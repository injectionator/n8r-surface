#!/usr/bin/env node
import {readFileSync} from 'node:fs';
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

  n8r-surface                        Set up or show your local vault
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
No source execution, edits or web access. /save writes numbered Markdown notes.
Ask for a Surface to preview it; /save surface saves that exact HTML/JSON pair.
Reopen either research.html or surface.json from a saved pair to revise it.
Reopen confirms note/source transmission again; no old Codex thread is restored.
Codex manages its own auth/cache/diagnostics. /exit ends the chat; Ctrl-C cancels.`;

async function discover(args: string[], reopening = false): Promise<number> {
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
  console.log('Source access is read-only. /save saves a Markdown note; /save surface saves the previewed Surface bundle.');
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
  const output = (text: string) => activity.log(text.split('\n').map(part => line(part)).join('\n') + '\n');
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
    session = await activity.run('Connecting to Codex', () => ResearchConversation.start(tools, output, model, controller.signal));
    console.log(`Connected: ChatGPT sign-in; model ${line(session.model)}.`);
    console.log(`Researcher ${session.instructions.version}; ${session.instructions.digest}`);
    console.log('Ask about your source or request a Surface preview. /save saves a note; /save surface saves the preview; /exit ends the chat; Ctrl-C cancels.');
    if (note) await activity.run('Reopening research', () => session!.reopen(note!));
    if (pair) await activity.run('Reopening Surface', () => session!.reopenSurface(pair!));
    if (session.surfaceDraft) output(previewSurface(session.surfaceDraft));
    while (!closed) {
      const question = await ask('You> ');
      if (question === undefined || question.trim() === '/exit') break;
      if (!question.trim()) continue;
      if (question.trim() === '/save surface') {
        if (!session.surfaceDraft) { console.log('No current validated Surface preview. Ask to create or update a Surface first.'); continue; }
        const saved=surfaces.save(session.surfaceDraft,{researcher:{version:session.instructions.version,digest:session.instructions.digest},model:session.model,evidence:session.evidence});
        session.acceptSurface(saved);
        if(saved.briefPath) console.log(`Saved and read back: ${line(saved.briefPath)}`);
        console.log(`Saved and read back: ${line(saved.researchPath)}`);
        console.log(`Saved and read back: ${line(saved.surfacePath)}`);
      } else if (question.trim() === '/save') {
        const destination = notes.next();
        console.log(`Save destination: ${line(destination)}`);
        const markdown = await activity.run('Preparing note', () => session!.prepareNote());
        if (closed || controller.signal.aborted) throw new InspectionError('Research cancelled; nothing saved');
        const saved = notes.save(destination,markdown,{researcher:{version:session.instructions.version,digest:session.instructions.digest},model:session.model,evidence:session.evidence});
        console.log(`Saved and read back: ${line(saved.path)}`);
        console.log(saved.digest);
      } else if (question.trim().startsWith('/')) {
        console.log('Unknown chat command. Use /save, /save surface or /exit.');
      } else {
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

const args = process.argv.slice(2);
try {
  if ((args.length === 1 && args[0] === '--help') || (args.length === 2 && ['discover','reopen'].includes(args[0]!) && args[1] === '--help')) console.log(help);
  else if (args.length === 1 && args[0] === '--version') console.log(`n8r-surface ${JSON.parse(readFileSync(new URL('../package.json', import.meta.url), 'utf8')).version}`);
  else if (args[0] === 'reopen') process.exitCode = await discover(args.slice(1),true);
  else if (args[0] === 'discover') process.exitCode = await discover(args.slice(1));
  else if (args.length) {
    console.log('Unsupported arguments; run n8r-surface --help.'); process.exitCode = 2;
  } else {
    const state = overview(); console.log(state.text);
    console.log('Setup does not start research. Use n8r-surface discover to begin a conversation.');
    if (state.failed || !state.settings) process.exitCode = 2;
    else process.exitCode = await setup(state.settings);
  }
} catch (error) {
  console.log(`n8r-surface failed: ${problem(error)}`); process.exitCode = 2;
}
