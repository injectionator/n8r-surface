#!/usr/bin/env node
import {readFileSync,existsSync} from 'node:fs';
import {basename} from 'node:path';
import {recentWork,rememberWork,type RecentWork} from './recent.js';
import {createInterface} from 'node:readline';
import {overview} from './startup.js';
import {chooseVault, inspectVault, saveSetup} from './setup.js';
import {line, problem, loadSettings, localPath, InspectionError, type Settings} from './settings.js';

import {SourceTools} from './source-tools.js';
import {ResearchConversation} from './codex.js';
import {Activity} from './activity.js';
import {Notes, readNote, latestNote, type Note} from './notes.js';
import {SurfaceStore,readSurfacePair,type SavedSurfacePair} from './surface-store.js';
import {previewSurface} from './surface-draft.js';

async function setup(config: Settings): Promise<number> {
  const existing = config.vault === undefined ? undefined : inspectVault(config.vault);
  if (existing && !existing.missing) {
    console.log(`Vault ready: ${line(existing.root)}`);
    return 0;
  }
  if (!process.stdin.isTTY || !process.stdout.isTTY) {
    console.log('Vault setup required; run n8r-surface in an interactive terminal.');
    return 1;
  }
  const input = createInterface({input: process.stdin, output: process.stdout});
  let closed = false;
  input.once('close', () => { closed = true; });
  const cancel = () => input.close();
  input.on('SIGINT', cancel);
  process.on('SIGINT', cancel);
  const ask = (prompt: string): Promise<string | undefined> => new Promise(resolve => {
    if (closed) { resolve(undefined); return; }
    const ended = () => resolve(undefined);
    input.once('close', ended);
    input.question(prompt, answer => {
      input.removeListener('close', ended);
      resolve(answer);
    });
  });
  try {
    let vault = existing?.root;
    if (vault === undefined) {
      const answer = await ask('Vault directory [~/n8r/]: ');
      if (answer === undefined) return 1;
      vault = chooseVault(answer === '' ? '~/n8r/' : answer, config.home, process.cwd());
      inspectVault(vault);
    }
    console.log(`Vault directory: ${line(vault)}`);
    if (existing) console.log('Required vault folders are missing; confirmation will create them.');
    const answer = await ask('Create vault folders and save this location? [y/N] ');
    if (answer === undefined || !/^y(es)?$/i.test(answer.trim())) return 1;
    const saved = saveSetup(config, vault, process.cwd());
    console.log(`Vault ready: ${line(saved)}`);
    return 0;
  } finally {
    input.close();
    process.removeListener('SIGINT', cancel);
  }
}

const help = `n8r-surface — experimental local AI Surface research

  n8r-surface                        Open a conversation or return to saved work
  n8r-surface discover [source]       Research a directory or file (default: cwd)
  n8r-surface discover [source] --model MODEL
  n8r-surface reopen [NOTE] --source SOURCE [--model MODEL]
                                    Continue a note or pair; omit NOTE for latest edited note
  n8r-surface --help                  Show this help
  n8r-surface --version               Show package version

Discovery requires a configured vault, an interactive terminal, and Codex CLI
0.166.0 signed in with ChatGPT. You confirm before source text is sent to OpenAI.
Uses your configured Codex model unless --model selects one; no fallback.
Source tools list, search and read bounded UTF-8 text. Hidden entries, dependency
folders, symlinks, key files and oversized/binary files are excluded.
No source execution, edits or web access. Type save to save a checked Surface.
At startup, /source PATH changes the working source; choose saved work by number.
/save note writes Markdown; legacy discover/reopen /save still writes notes.
Ask for a Surface to preview it; /save surface saves that checked bundle.
Reopen either research.html or surface.json from a saved pair to revise it.
Reopen confirms note/source transmission again; no old Codex thread is restored.
Codex manages its own auth/cache/diagnostics. /exit ends the chat; Ctrl-C cancels.`;

async function discover(args: string[], reopening = false, guided = false, firstQuestion?:string): Promise<number> {
  let source: string | undefined, model: string | undefined, notePath: string | undefined;
  for (let i = 0; i < args.length; i++) {
    const arg = args[i]!;
    if (arg === '--model' && model === undefined && args[i + 1] && /^[a-zA-Z0-9._-]{1,100}$/.test(args[i + 1]!)) model = args[++i];
    else if (reopening && arg === '--source' && source === undefined && args[i+1] && !args[i+1]!.startsWith('-')) source = args[++i];
    else if (reopening && !arg.startsWith('-') && notePath === undefined) notePath = arg;
    else if (!reopening && !arg.startsWith('-') && source === undefined) source = arg;
    else throw new InspectionError('Unsupported arguments; run n8r-surface discover --help');
  }
  if (reopening && !source) throw new InspectionError('Reopen requires --source SOURCE; source access must be selected again');
  if (!process.stdin.isTTY || !process.stdout.isTTY) {
    console.log('Discovery requires an interactive terminal; no research started.'); return 1;
  }
  const config = loadSettings();
  if (!config.vault || inspectVault(config.vault).missing) {
    console.log('Vault setup required; run n8r-surface first.'); return 1;
  }
  const tools = new SourceTools(localPath(source ?? process.cwd(), config.home, process.cwd()));
  console.log(`Research source: ${line(tools.selected)} (${tools.file ? 'one file' : 'directory'})`);
  console.log('Inspected source text and your messages will be sent to OpenAI through Codex using ChatGPT sign-in.');
  console.log(guided ? 'Your source stays unchanged. Type save when you want to keep the result.' : 'Source access is read-only. /save saves a Markdown note; /save surface saves the previewed Surface bundle.');
  const input = createInterface({input: process.stdin, output: process.stdout});
  const controller = new AbortController();
  let closed = false, interrupted = false;
  let session: ResearchConversation | undefined;
  input.once('close', () => { closed = true; controller.abort(); });
  const cancel = () => { interrupted = true; controller.abort(); input.close(); };
  input.on('SIGINT', cancel); process.on('SIGINT', cancel);
  const ask = (prompt: string): Promise<string | undefined> => new Promise(resolve => {
    if (closed) { resolve(undefined); return; }
    const ended = () => resolve(undefined); input.once('close', ended);
    input.question(prompt, answer => { input.removeListener('close', ended); resolve(answer); });
  });
  const activity = new Activity();
  const output = (text: string) => activity.log((guided ? text.replace(/ sha256:[a-f0-9]{64}/g,'') : text).split('\n').map(part => line(part)).join('\n') + '\n');
  try {
    let note: Note | undefined;
    let pair: SavedSurfacePair | undefined;
    if (reopening && notePath && /(?:research\.html|surface\.json)$/.test(notePath)) {
      pair=readSurfacePair(localPath(notePath,config.home,process.cwd()));
      console.log(`Saved pair: ${line(pair.directory)}`);
      console.log('Saved artefacts, dependencies and host evidence will be sent to OpenAI after confirmation.');
    } else if (reopening) {
      note = notePath ? readNote(localPath(notePath,config.home,process.cwd())) : latestNote(config.vault,tools.selected);
      if (!note) { console.log('No saved numbered note found for this source. Name a note explicitly or start with discover.'); return 1; }
      console.log(`Saved note: ${line(note.path)}`);
      console.log(`Last edited: ${note.modifiedAt}`);
      console.log(`Recorded source: ${line(note.metadata.source.name)} (${note.metadata.source.kind}); this is not verified identity.`);
      if (!notePath) {
        const choice = await ask('Open this note? [y/N] ');
        if (interrupted) return 130;
        if (choice === undefined || !/^y(es)?$/i.test(choice.trim())) return 1;
      }
      console.log('The saved note, including human edits, will also be sent to OpenAI after confirmation.');
    }
    const notes = new Notes(config.vault,tools.selected,note);
    const surfaces = new SurfaceStore(config.vault,tools.selected,pair,note);
    const accepted = await ask('Start research with OpenAI using Codex ChatGPT sign-in? [y/N] ');
    if (interrupted) return 130;
    if (accepted === undefined || !/^y(es)?$/i.test(accepted.trim())) return 1;
    console.log('Connecting to Codex…');
    session = await activity.run('Connecting to Codex', () => ResearchConversation.start(tools, output, model, controller.signal,guided));
    console.log(`Connected: ChatGPT sign-in; model ${line(session.model)}.`);
    if(!guided) console.log(`Researcher ${session.instructions.version}; ${session.instructions.digest}`);
    console.log(guided ? 'Ask questions, explore another angle, or make corrections. Type save to keep the result; exit to leave.' : 'Ask about your source or request a Surface preview. /save saves a note; /save surface saves the preview; /exit ends the chat; Ctrl-C cancels.');
    if (note) await activity.run('Reopening research', () => session!.reopen(note!));
    if (pair) await activity.run('Reopening Surface', () => session!.reopenSurface(pair!));
    if(firstQuestion) await activity.run('Researching',()=>session!.turn(firstQuestion!));
    if (session.surfaceDraft) output(previewSurface(session.surfaceDraft));
    let dirty=Boolean(firstQuestion),lastSaved:string|undefined;
    const remember=(item:RecentWork)=>{try{rememberWork(config.home,item);return true;}catch(error){console.log(`The result is saved, but the recent-work list could not be updated: ${problem(error)}. Keep the saved path above.`);return false;}};
    while (!closed) {
      const question = await ask('You> ');
      if (question === undefined || /^(?:\/exit|exit|quit)$/i.test(question.trim())) break;
      if (!question.trim()) continue;
      const plainSave=/^(?:please )?save(?: (?:it|this|the result|my research|the research|this result|the surface))?(?: for later)?[.!]?$/i.test(question.trim());
      if (plainSave || question.trim()==='/save surface' || (guided && question.trim()==='/save')) {
        if(!dirty && lastSaved){console.log(`Already saved: ${line(lastSaved)}`);continue;}
        try {
          if(!session.surfaceDraft && (plainSave || guided)) {
            await activity.run('Preparing your saved result',()=>session!.turn('HOST_SURFACE_SAVE_REQUEST: The user asked to save the result. Prepare the checked Surface bundle now using surface_draft. Continue the saved Surface kind and identities if reopened; otherwise create a Capability Surface from the research so far. Retain decisions, evidence and unknowns. Inspect permitted sources as needed. Stage the result; the host will save it.'));
          }
          if (!session.surfaceDraft) { console.log('No checked result is ready to save yet. Continue the research or ask for a Surface, then try save again.'); continue; }
          const saved=surfaces.save(session.surfaceDraft,{researcher:{version:session.instructions.version,digest:session.instructions.digest},model:session.model,evidence:session.evidence});
          session.acceptSurface(saved);
          console.log(`Saved and read back: ${line(saved.briefPath ?? saved.researchPath)}`);
          console.log(`Saved and read back: ${line(saved.surfacePath)}`);
          const remembered=remember({id:saved.surface.id,title:saved.surface.title,source:tools.selected,path:saved.surfacePath,model:session.model});
          if(remembered)console.log(`Next time, open n8r-surface and choose “${line(saved.surface.title)}”.`);
          lastSaved=saved.briefPath ?? saved.researchPath;dirty=false;
        } catch(error) { console.log(`Could not complete the save: ${problem(error)}. Your earlier saved work is unchanged. You can continue this conversation.`); }
      } else if (question.trim() === '/save' || question.trim()==='/save note') {
        const destination = notes.next();
        console.log(`Save destination: ${line(destination)}`);
        const markdown = await activity.run('Preparing note', () => session!.prepareNote());
        if (closed || controller.signal.aborted) throw new InspectionError('Research cancelled; nothing saved');
        const saved = notes.save(destination,markdown,{researcher:{version:session.instructions.version,digest:session.instructions.digest},model:session.model,evidence:session.evidence});
        console.log(`Saved and read back: ${line(saved.path)}`);
        if(!guided)console.log(saved.digest);
        remember({id:`note:${tools.selected}`,title:markdown.split('\n').find(x=>x.startsWith('# '))?.slice(2) ?? basename(tools.selected),source:tools.selected,path:saved.path,model:session.model});
      } else if (question.trim().startsWith('/')) {
        console.log('Type save to keep the result, /save note for a Markdown note, or exit to leave.');
      } else {
        dirty=true;
        await activity.run('Waiting for Codex', () => session!.turn(question));
        if (session.surfaceDraft) output(previewSurface(session.surfaceDraft));
      }
    }
    return interrupted ? 130 : 0;
  } catch (error) {
    if (interrupted) { console.log('Research cancelled.'); return 130; }
    if (closed) { console.log('Research input closed; answer incomplete.'); return 1; }
    throw error;
  } finally {
    if (session) await session.close();
    input.close(); process.removeListener('SIGINT', cancel);
  }
}

/** Open conversation; saved-work choices are shortcuts, not a required sequence. */
async function launch():Promise<number> {
  let config=loadSettings();
  console.log('n8r-surface');
  const ready=await setup(config);if(ready!==0)return ready;
  config=loadSettings();
  let work:RecentWork[]=[];
  try{work=recentWork(config.home);}catch(error){console.log(`Saved-work list unavailable: ${problem(error)}. Your saved files are unchanged.`);}
  let source=process.cwd(),override:string|undefined,pendingQuestion:string|undefined;
  const checkNewSource=(path:string)=>{const tools=new SourceTools(path);new Notes(config.vault!,tools.selected);new SurfaceStore(config.vault!,tools.selected);return tools.selected;};
  console.log(`Working folder: ${line(source)}`);
  if(work.length){console.log('Continue saved work:');work.slice(0,20).forEach((w,i)=>console.log(`  ${i+1}. ${line(w.title)} — ${line(basename(w.source))}`));}
  console.log('Tell me what you want to investigate, or choose saved work by number.');
  console.log('You can ask questions and change direction. /source PATH changes the working folder or file. exit leaves.');
  const input=createInterface({input:process.stdin,output:process.stdout});let closed=false;
  input.once('close',()=>{closed=true;});
  const cancel=()=>input.close();input.on('SIGINT',cancel);process.on('SIGINT',cancel);
  const ask=(prompt:string):Promise<string|undefined>=>new Promise(resolve=>{
    if(closed){resolve(undefined);return;}
    const end=()=>resolve(undefined);input.once('close',end);
    input.question(prompt,answer=>{input.removeListener('close',end);resolve(answer);});
  });
  let selection:{args:string[];reopening:boolean;question?:string}|undefined;
  try {
    while(!closed){
      const answer=await ask('You> ');if(answer===undefined||/^(?:exit|quit|\/exit)$/i.test(answer.trim()))return 0;
      const value=answer.trim();if(!value)continue;
      if(value.startsWith('/source ')){
        try{
          source=checkNewSource(localPath(value.slice(8).trim(),config.home,process.cwd()));override=source;console.log(`Working source: ${line(source)}`);
          if(pendingQuestion){selection={args:[source],reopening:false,question:pendingQuestion};break;}
        }catch(e){console.log(`Source unavailable: ${problem(e)}`);}
        continue;
      }
      if(/^\d+$/.test(value)){
        const item=work[Number(value)-1];if(!item){console.log('Choose one of the displayed numbers, or describe new research.');continue;}
        const selectedSource=override ?? item.source;
        if(!existsSync(selectedSource)){console.log('The remembered source has moved. Use /source PATH to select it, then choose the saved work again.');continue;}
        try{const note=item.path.endsWith('.md')?readNote(item.path):undefined;const pair=note?undefined:readSurfacePair(item.path);new SourceTools(selectedSource);new Notes(config.vault!,selectedSource,note);new SurfaceStore(config.vault!,selectedSource,pair,note);}catch(e){console.log(`Cannot reopen this saved work: ${problem(e)}. Its files have not been changed.`);continue;}
        selection={args:[item.path,'--source',selectedSource,'--model',item.model],reopening:true};break;
      }
      if(value.startsWith('/')){console.log('Use /source PATH, select saved work by number, or simply ask a research question.');continue;}
      try{source=checkNewSource(source);}catch(e){pendingQuestion=answer;console.log(`This folder cannot be used for research: ${problem(e)}. Select your project with /source PATH; I will keep your question.`);continue;}
      selection={args:[source],reopening:false,question:answer};break;
    }
  } finally {input.close();process.removeListener('SIGINT',cancel);}
  if(!selection)return 0;
  return discover(selection.args,selection.reopening,true,selection.question);
}

const args = process.argv.slice(2);
try {
  if ((args.length === 1 && args[0] === '--help') || (args.length === 2 && ['discover','reopen'].includes(args[0]!) && args[1] === '--help')) console.log(help);
  else if (args.length === 1 && args[0] === '--version') console.log(`n8r-surface ${JSON.parse(readFileSync(new URL('../package.json', import.meta.url), 'utf8')).version}`);
  else if (args[0] === 'reopen') process.exitCode = await discover(args.slice(1),true);
  else if (args[0] === 'discover') process.exitCode = await discover(args.slice(1));
  else if (args.length) {
    console.log('Unsupported arguments; run n8r-surface --help.'); process.exitCode = 2;
  } else if(process.stdin.isTTY && process.stdout.isTTY) {
    process.exitCode=await launch();
  } else {
    const state = overview(); console.log(state.text);
    console.log('Setup does not start research. Use n8r-surface discover to begin a conversation.');
    if (state.failed || !state.settings) process.exitCode = 2;
    else process.exitCode = await setup(state.settings);
  }
} catch (error) {
  console.log(`n8r-surface failed: ${problem(error)}`); process.exitCode = 2;
}
