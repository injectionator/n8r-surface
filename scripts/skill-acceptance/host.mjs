import assert from 'node:assert/strict';
import {spawn, execFileSync} from 'node:child_process';
import {appendFileSync, readFileSync, realpathSync, readdirSync, lstatSync} from 'node:fs';
import {createHash} from 'node:crypto';
import {dirname, join, resolve} from 'node:path';
import {homedir} from 'node:os';
import {Rpc} from './rpc.mjs';
import {Blocked, checkProvider, isMissingThread} from './checks.mjs';

const restrictions = Object.fromEntries(['hooks','apps','multi_agent','memories','browser_use','browser_use_external','computer_use','image_generation','code_mode','code_mode_only','remote_control','chronicle','in_app_browser','request_permissions_tool','tool_suggest','workspace_dependencies'].map(k=>[`features.${k}`,false]));
Object.assign(restrictions, {project_doc_max_bytes:0, web_search:'disabled', forced_login_method:'chatgpt', notify:[], 'memories.use_memories':false, 'memories.generate_memories':false, 'shell_environment_policy.inherit':'none', 'shell_environment_policy.set':{PATH:process.env.PATH}, 'shell_environment_policy.ignore_default_excludes':false});
const environment = Object.fromEntries(['PATH','HOME','USER','LOGNAME','TMPDIR','LANG','LC_ALL','CODEX_HOME','SSL_CERT_FILE','SSL_CERT_DIR','HTTPS_PROXY','HTTP_PROXY','NO_PROXY'].filter(k=>process.env[k]!==undefined).map(k=>[k,process.env[k]]));
function toml(v) {
  if (Array.isArray(v)) return '['+v.map(toml).join(',')+']';
  if (v && typeof v==='object') return '{'+Object.entries(v).map(([k,x])=>JSON.stringify(k)+'='+toml(x)).join(',')+'}';
  return JSON.stringify(v);
}
export function verifyInstallation(root, revision) {
  assert.match(revision,/^[0-9a-f]{40}$/, 'Use a full source commit');
  root=realpathSync(root);
  const prefix='plugins/n8r-surface/';
  const paths=execFileSync('git',['ls-tree','-r','--name-only',revision,'--',prefix],{encoding:'utf8'}).trim().split('\n');
  if (!paths.length || !paths[0].startsWith(prefix)) throw new Blocked('Pinned plugin source is unavailable');
  const files=paths.map(path=>{
    const relative=path.slice(prefix.length);
    const source=execFileSync('git',['show',`${revision}:${path}`],{maxBuffer:16*1024*1024});
    const bytes=readFileSync(join(root,relative));
    assert(bytes.equals(source),`Installed bytes differ: ${relative}`);
    return {path:relative,sha256:createHash('sha256').update(bytes).digest('hex')};
  });
  function walk(dir,base='') {
    return readdirSync(dir).flatMap(name=>{
      const p=join(dir,name), relative=base+name, stat=lstatSync(p);
      assert(!stat.isSymbolicLink(),'Installed plugin contains a symlink');
      return stat.isDirectory()?walk(p,relative+'/'):[relative];
    });
  }
  assert.deepEqual(walk(root).sort(),files.map(f=>f.path).sort(),'Unexpected installed files');
  const version=JSON.parse(readFileSync(join(root,'plugin.json'),'utf8')).version;
  assert(['0.1.9','0.1.10','0.1.11','0.1.12','0.1.13','0.1.14'].includes(version),'Unsupported installed candidate');
  return {root,revision,version,files};
}

export class Host {
  constructor(cwd,config,logFile) {
    this.cwd=cwd; this.config=config; this.logFile=logFile; this.items=[];
    const child=spawn('codex',['app-server',...Object.entries(config).flatMap(([k,v])=>['-c',`${k}=${toml(v)}`])],{cwd,env:environment,stdio:['pipe','pipe','pipe']});
    this.child=child;
    this.rpc=new Rpc(child,(method,params)=>{
      if (method.endsWith('/delta') || method==='item/commandExecution/outputDelta') return;
      this.log(method,params);
      if (method==='item/completed' && this.active) this.items.push(params.item);
      if (method==='host/error' && this.active) this.active.reject(new Blocked(params.message));
      if (method==='turn/completed' && this.active && params.threadId===this.thread?.thread.id) {
        if(params.turn.status==='completed') this.active.resolve(params.turn);
        else this.active.reject(new Blocked(`Codex turn ${params.turn.status}: ${params.turn.error?.message??'no detail'}`));
      }
    },async(method,params)=>{
      this.log('unexpected-request',{method,params});
      this.active?.reject(new Blocked(`Unexpected server request: ${method}; no automatic answer`));
      throw new Error('Unsupported acceptance request');
    });
  }
  log(method,params) { appendFileSync(this.logFile,JSON.stringify({time:new Date().toISOString(),method,params})+'\n',{mode:0o600}); }
  async request(method,params) {
    this.log('request',{method,params});
    try {const result=await this.rpc.request(method,params);
      this.log('response',{method,result}); return result;
    } catch(error) {this.log('response-error',{method,code:error.code,message:error.message});throw error;}
  }
  async initialize() {
    await this.request('initialize',{clientInfo:{name:'n8r_skill_acceptance',version:'0.1'},capabilities:{experimentalApi:true}});
    this.rpc.notify('initialized');
    const account=await this.rpc.request('account/read',{});
    this.log('authentication',{type:account.account?.type});
    if(account.account?.type!=='chatgpt') throw new Blocked('ChatGPT sign-in required; no API-key fallback');
  }
  static async discover(cwd,logFile) {
    const version=execFileSync('codex',['--version'],{env:environment,encoding:'utf8',timeout:10000}).trim();
    if(version!=='codex-cli 0.166.0') throw new Blocked('Requires Codex CLI 0.166.0');
    const host=new Host(cwd,restrictions,logFile);
    try {
      await host.initialize();
      const {config}=await host.rpc.request('config/read',{});
      checkProvider(config);
      if(config.permissions?.n8r_skill_acceptance)throw new Blocked('Reserved acceptance permission profile already configured');
      const extra={};
      for(const name of Object.keys(config.mcp_servers??{})) {
        if(!/^[a-zA-Z0-9_-]+$/.test(name))throw new Blocked('Unsupported MCP configuration name');
        extra[`mcp_servers.${name}.enabled`]=false;
      }
      const skills=await host.request('skills/list',{cwds:[cwd],forceReload:true});
      return {version, model:config.model, extra, skills};
    } finally { await host.close(); }
  }
  static async start({directory,installation,discovery,logFile,deniedPaths,previousThreadId,onHost=()=>{}}) {
    const nodeRoot=dirname(dirname(realpathSync(process.execPath)));
    const filesystem={':minimal':'read',[directory]:'write',[installation.root]:'read',[nodeRoot]:'read'};
    if(process.platform==='darwin')filesystem['/System/Library/OpenSSL']='read';
    const config={...restrictions,...discovery.extra,default_permissions:'n8r_skill_acceptance', 'permissions.n8r_skill_acceptance':{filesystem,network:{enabled:false}}};
    const host=new this(directory,config,logFile);
    onHost(host);
    const startupTimer=setTimeout(()=>{host.log('startup-timeout',{seconds:30});void host.close();},30000);
    try {
      await host.initialize();
      // Technical boundary check only: never execute the workspace helper here.
      const probe=await host.request('command/exec',{
        command:[process.execPath,'-e',`const fs=require('node:fs');fs.readFileSync(process.argv[1]);for(const p of process.argv.slice(2)){try{fs.readFileSync(p);process.exit(9)}catch(e){if(!['EACCES','EPERM'].includes(e.code))process.exit(8)}}console.log('allowed skill read; denied evidence reads');`,join(installation.root,'skills/research/SKILL.md'),...deniedPaths],
        cwd:directory, permissionProfile:'n8r_skill_acceptance',timeoutMs:10000
      });
      if(probe.exitCode!==0 || probe.stdout.trim()!=='allowed skill read; denied evidence reads')throw new Blocked('History/evidence isolation probe failed');
      if(previousThreadId) {
        let unavailable=false;
        try {await host.request('thread/read',{threadId:previousThreadId});}catch(error) {if(!isMissingThread(error,previousThreadId))throw new Blocked('History probe failed without an explicit missing-thread response');unavailable=true;host.log('previous-thread-unavailable',{threadId:previousThreadId});}
        if(!unavailable)throw new Blocked('Previous ephemeral thread is readable in the new process');
      }
      host.thread=await host.request('thread/start',{cwd:directory,model:discovery.model,modelProvider:'openai',allowProviderModelFallback:false,ephemeral:true,approvalPolicy:'never',approvalsReviewer:'user',permissions:'n8r_skill_acceptance',config});
      const t=host.thread;
      if(t.model!==discovery.model || t.modelProvider!=='openai' || t.thread.ephemeral!==true || t.thread.path!==null || t.thread.forkedFromId!==null || t.thread.turns.length!==0 || t.approvalPolicy!=='never' || t.activePermissionProfile?.id!=='n8r_skill_acceptance' || t.sandbox.networkAccess!==false || t.sandbox.type!=='workspaceWrite')throw new Blocked('Required session/permission controls were not applied');
      host.skill={type:'skill',name:'n8r-surface:research',path:join(installation.root,'skills/research/SKILL.md')};
      return host;
    } catch(error) {await host.close();throw error;}
    finally {clearTimeout(startupTimer);}
  }
  async turn(prompt) {
    this.items=[]; const started=Date.now();
    let timer;
    const finished=new Promise((resolve,reject)=>{
      this.active={resolve,reject};
      timer=setTimeout(()=>reject(new Blocked('120-second turn limit exceeded')),120000);
    });
    const observed=finished.catch(error=>error);
    try {
      await this.request('turn/start',{threadId:this.thread.thread.id,input:[{type:'text',text:prompt,text_elements:[]},this.skill]});
      const result=await observed;
      if(result instanceof Error)throw result;
      return {items:this.items,turn:result,durationMs:Date.now()-started,threadId:this.thread.thread.id};
    } catch(error) {await this.close();throw error;}
    finally {clearTimeout(timer);this.active=undefined;}
  }
  async close() {this.active?.reject(new Blocked('Acceptance host closed'));this.active=undefined;await this.rpc.close();}
}
