/** Standard validation shared by the legacy reader and BOM authority. */
import {Ajv} from 'ajv';
import formats from 'ajv-formats';
import extendedFormats from 'ajv-formats-draft2019';
import bomSchema from './cyclonedx-schemas/bom-1.7.schema.json' with {type:'json'};
import cryptoSchema from './cyclonedx-schemas/cryptography-defs.schema.json' with {type:'json'};
import spdxSchema from './cyclonedx-schemas/spdx.schema.json' with {type:'json'};
import jsfSchema from './cyclonedx-schemas/jsf-0.82.schema.json' with {type:'json'};
type Bom=Record<string,any>;
function refuse():never {throw Error('CycloneDX 1.7 schema/reference validation failed. Input values withheld.');}
function guard<T>(fn:()=>T):T {try{return fn();}catch{return refuse();}}
const ajv=new Ajv({strict:false,allErrors:false,validateFormats:true});
// ajv-formats CJS interop is normalized by Node and the standalone bundler.
(formats as unknown as (a:Ajv)=>void)(ajv);
(extendedFormats as unknown as (a:Ajv)=>void)(ajv);
// The upstream IRI checker rejects URNs because uri-js parses their NSS
// separately from path. Accept only the standard BOM-Link grammar here.
const iriReference=ajv.formats['iri-reference'] as (value:string)=>boolean;
ajv.addFormat('iri-reference',(value:string)=>/^urn:cdx:[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}\/[1-9][0-9]*(?:#[^\s]+)?$/.test(value)||iriReference(value));
ajv.addSchema(spdxSchema);ajv.addSchema(jsfSchema);ajv.addSchema(cryptoSchema);
const schemaCheck=ajv.compile(bomSchema);
export function validateBom(bom:unknown):void {
 guard(()=>{
  if(!schemaCheck(bom))refuse();const b=bom as Bom;
  if(b.bomFormat!=='CycloneDX'||b.specVersion!=='1.7')refuse();
  const refs=new Set<string>();
  for(const n of [...(b.components??[]),...(b.services??[])]){
   if(typeof n['bom-ref']!=='string'||refs.has(n['bom-ref']))refuse();refs.add(n['bom-ref']);
  }
  for(const d of b.dependencies??[])if(!refs.has(d.ref)||d.dependsOn?.some((r:string)=>!refs.has(r)))refuse();
 });
}
