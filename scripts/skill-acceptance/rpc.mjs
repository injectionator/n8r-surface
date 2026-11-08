// One pinned stdio interface. Keep protocol errors intact for isolation assertions.
export class RpcError extends Error {
  constructor(error) { super(error.message); this.code=error.code; }
}
export class Rpc {
  constructor(child,event,serve) {
    this.child=child;this.pending=new Map();this.sequence=0;this.buffer='';
    this.event=event;this.serve=serve;
    child.stdout.setEncoding('utf8');child.stderr.resume();
    child.stdout.on('data',chunk=>{
      this.buffer+=chunk;
      if(this.buffer.length>8*1024*1024){this.fail(new Error('Protocol output limit exceeded'));return;}
      for(let end=this.buffer.indexOf('\n');end>=0;end=this.buffer.indexOf('\n')) {
        const line=this.buffer.slice(0,end);this.buffer=this.buffer.slice(end+1);
        if(!line.trim())continue;
        try {this.receive(JSON.parse(line));}catch(error){this.fail(error);return;}
      }
    });
    child.stdin.on('error',error=>this.fail(error));
    child.on('error',error=>this.fail(error));
    child.on('exit',()=>this.fail(new Error('Codex process exited')));
  }
  send(message) {if(this.failure)throw this.failure;this.child.stdin.write(JSON.stringify(message)+'\n');}
  receive(message) {
    if(message.method) {
      if(message.id!==undefined) {
        void this.serve(message.method,message.params??{}).then(result=>{
          this.send({id:message.id,result});
        },()=>this.send({id:message.id,error:{code:-32601,message:'No automatic acceptance response'}})).catch(error=>this.fail(error));
      } else this.event(message.method,message.params??{});
      return;
    }
    const pending=this.pending.get(message.id);if(!pending)return;
    this.pending.delete(message.id);clearTimeout(pending.timer);
    if(message.error)pending.reject(new RpcError(message.error));
    else if(message.result && typeof message.result==='object')pending.resolve(message.result);
    else pending.reject(new Error('Malformed Codex response'));
  }
  request(method,params) {
    const id=++this.sequence;
    return new Promise((resolve,reject)=>{
      const timer=setTimeout(()=>{this.pending.delete(id);reject(new Error(`Protocol timeout: ${method}`));},45000);
      this.pending.set(id,{resolve,reject,timer});
      try{this.send({id,method,params});}catch(error){clearTimeout(timer);this.pending.delete(id);reject(error);}
    });
  }
  notify(method) {this.send({method});}
  fail(error) {
    if(this.failure)return;this.failure=error;
    for(const p of this.pending.values()){clearTimeout(p.timer);p.reject(error);}this.pending.clear();
    this.child.kill();this.event('host/error',{message:error.message});
  }
  async close() {
    this.fail(new Error('Codex connection closed'));
    if(this.child.exitCode!==null || this.child.signalCode!==null)return;
    await new Promise(resolve=>{
      const timer=setTimeout(()=>{this.child.kill('SIGKILL');resolve();},1500);
      this.child.once('exit',()=>{clearTimeout(timer);resolve();});
    });
  }
}
