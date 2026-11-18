import {canonical} from './portable.js';
const fail=(code:string):never=>{throw new Error(`Surface operation refused: ${code}. No input values are included.`);};
/** Conservative defense in depth; host must omit sensitive values before staging. */
export function privacy(value:unknown) {
 const text=canonical(value);
 if (/(?:https?|mongodb(?:\+srv)?|postgres(?:ql)?):\/\/|\b(?:\d{1,3}\.){3}\d{1,3}\b|\b(?:[a-f0-9]{1,4}:){2,}[a-f0-9:]+\b|(?:password|passwd|token|secret|username|api[_-]?key)\s*[=:]\s*[^\s"},]+|(?:\/Users\/|\/home\/|[A-Z]:\\\\)|[\w.+-]+@[\w.-]+\.[a-z]{2,}/i.test(text)) fail('privacy review required');
}
