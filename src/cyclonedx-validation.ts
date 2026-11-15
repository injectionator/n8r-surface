/** Standard validation shared by the legacy reader and BOM authority. */
import {Ajv} from 'ajv';
import formats from 'ajv-formats';
import extendedFormats from 'ajv-formats-draft2019';
import bomSchema from './cyclonedx-schemas/bom-1.7.schema.json' with {type:'json'};
import cryptoSchema from './cyclonedx-schemas/cryptography-defs.schema.json' with {type:'json'};
import spdxSchema from './cyclonedx-schemas/spdx.schema.json' with {type:'json'};
import jsfSchema from './cyclonedx-schemas/jsf-0.82.schema.json' with {type:'json'};
type Bom=Record<string,any>;
class ValidationError extends Error {}
function refuse(detail=''):never {throw new ValidationError(`CycloneDX 1.7 schema/reference validation failed${detail?`: ${detail}`:'.'} Input values withheld.`);}
function guard<T>(fn:()=>T):T {try{return fn();}catch(error){if(error instanceof ValidationError)throw error;return refuse();}}
// Only schema-authored field names and array indices may appear in diagnostics.
const fields=new Set<string>();
function collectFields(value:any):void {if(!value||typeof value!=='object')return;for(const key of Object.keys(value.properties??{}))fields.add(key);for(const child of Object.values(value))collectFields(child);}
for(const schema of [bomSchema,cryptoSchema,spdxSchema,jsfSchema])collectFields(schema);
function safePath(pointer:string):string {return pointer.split('/').map(part=>fields.has(part)||/^[0-9]+$/.test(part)?part:part?'[field]':'').join('/')||'/';}
const ajv=new Ajv({strict:false,allErrors:false,validateFormats:true});
// ajv-formats CJS interop is normalized by Node and the standalone bundler.
(formats as unknown as (a:Ajv)=>void)(ajv);
(extendedFormats as unknown as (a:Ajv)=>void)(ajv);
// ajv-formats-draft2019 loses the path when uri-js parses a URN NSS.
// Validate URN syntax directly (RFC 8141 §2), never bypass malformed URNs.
// Namespace registration/resolvability is not a JSON Schema format assertion.
const pchar="(?:[A-Za-z0-9._~!$&'()*+,;=:@-]|%[0-9A-Fa-f]{2})";
const urn=new RegExp(`^urn:[A-Za-z0-9][A-Za-z0-9-]{0,30}[A-Za-z0-9]:${pchar}(?:${pchar}|/)*(?:\\?\\+${pchar}(?:${pchar}|[/?])*)?(?:\\?=${pchar}(?:${pchar}|[/?])*)?(?:#(?:${pchar}|[/?])*)?$`,'i');
for(const name of ['iri','iri-reference']){
 const original=ajv.formats[name] as (value:string)=>boolean;
 ajv.addFormat(name,(value:string)=>/^urn:/i.test(value)?urn.test(value):original(value));
}
ajv.addSchema(spdxSchema);ajv.addSchema(jsfSchema);ajv.addSchema(cryptoSchema);
const schemaCheck=ajv.compile(bomSchema);
export function validateBom(bom:unknown):void {
 guard(()=>{
  if(!schemaCheck(bom)){
   const error=schemaCheck.errors?.[0];
   refuse(error?`${safePath(error.instancePath)}: ${error.keyword}${error.keyword==='format'?' (expected '+error.params.format+')':''}`:'');
  }const b=bom as Bom;
  if(b.bomFormat!=='CycloneDX'||b.specVersion!=='1.7')refuse();
  const refs=new Set<string>();
  for(const kind of ['components','services'])for(const [i,n] of (b[kind]??[]).entries()){
   if(typeof n['bom-ref']!=='string')refuse(`/${kind}/${i}/bom-ref: required reference`);
   if(refs.has(n['bom-ref']))refuse(`/${kind}/${i}/bom-ref: duplicate reference`);refs.add(n['bom-ref']);
  }
  for(const [i,d] of (b.dependencies??[]).entries()){
   if(!refs.has(d.ref))refuse(`/dependencies/${i}/ref: unresolved reference`);
   for(const [j,r] of (d.dependsOn??[]).entries())if(!refs.has(r))refuse(`/dependencies/${i}/dependsOn/${j}: unresolved reference`);
  }
 });
}
