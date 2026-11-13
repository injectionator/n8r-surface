declare module 'ajv-formats-draft2019' {
  import type {Ajv} from 'ajv';
  const addFormats: (ajv:Ajv)=>Ajv;
  export default addFormats;
}
