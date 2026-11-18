import {stringify} from 'yaml';
import type {Artefact} from './contracts.js';
import {checkSize, fail} from './portable.js';
import {validateArtefact} from './validate.js';
import {decodeValue, formatCheck, type Encoding} from './encoded-value.js';
export {decodeJsonValue, type Encoding} from './encoded-value.js';
export function decode(text: string, format: Encoding): Artefact {
  const a = validateArtefact(decodeValue(text, format));
  if ((a.contract === 'n8r.surface/0.2' || a.contract === 'n8r.surface/0.3') && format !== 'json') fail('$format', 'Surface descriptions require JSON');
  return a;
}
export function encode(value: unknown, format: Encoding): string {
  formatCheck(format); const a = validateArtefact(value);
  if ((a.contract === 'n8r.surface/0.2' || a.contract === 'n8r.surface/0.3') && format !== 'json') fail('$format', 'Surface descriptions require JSON');
  const text = format === 'json' ? JSON.stringify(a, null, 2) + '\n' : stringify(a, {version: '1.2', aliasDuplicateObjects: false, lineWidth: 0, defaultKeyType: 'QUOTE_DOUBLE'});
  checkSize(text); return text;
}
