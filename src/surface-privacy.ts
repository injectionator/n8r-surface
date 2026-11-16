import {canonical} from './portable.js';
const fail=(code:string):never=>{throw new Error(`Surface operation refused: ${code}. No input values are included.`);};
/** Conservative defense in depth; host must omit sensitive values before staging. */
export function privacy(value:unknown) {
 const text=canonical(value);
 // Scan the address-like token in full so a clock embedded in an IPv6 address
 // cannot exempt the address. Other categories still inspect the original text.
 for(const match of text.matchAll(/(?<![\w:])(?:[a-f0-9]{0,4}:){2,}[a-f0-9:]+\b/gi)){
  if(!/^(?:[01]?\d|2[0-3]):[0-5]\d:[0-5]\d$/.test(match[0]))fail('privacy review required');
 }
 if (/(?:https?|mongodb(?:\+srv)?|postgres(?:ql)?):\/\/|\b(?:\d{1,3}\.){3}\d{1,3}\b|(?:password|passwd|token|secret|username|api[_-]?key)\s*[=:]\s*[^\s"},]+|(?:\/Users\/|\/home\/|[A-Z]:\\\\)|[\w.+-]+@[\w.-]+\.[a-z]{2,}/i.test(text)) fail('privacy review required');
}
