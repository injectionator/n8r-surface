import {isAlias, isMap, isNode, isScalar, parseDocument, visit} from 'yaml';
import {checkSize, fail, MAX_DEPTH} from './portable.js';
export type Encoding = 'json' | 'yaml';
export function formatCheck(format: string): void { if (format !== 'json' && format !== 'yaml') fail('$format', 'unsupported encoding'); }
export function decodeValue(text: string, format: Encoding): unknown {
  formatCheck(format); checkSize(text);
  if (format === 'json') {
    try { JSON.parse(text); } catch { fail('$', 'invalid JSON syntax'); }
  } // enforce JSON grammar before YAML's duplicate/number checks
  if (/^%/m.test(text)) fail('$', 'YAML directives unsupported');
  const doc = parseDocument(text, {version: '1.2', schema: 'core', uniqueKeys: true, strict: true});
  if (doc.errors.length || doc.warnings.length) fail('$', 'invalid encoded syntax or duplicate keys');
  visit(doc, (_key, node, path) => {
    if (path.length > MAX_DEPTH * 2 + 2) fail('$', 'exceeds depth 64');
    if (isAlias(node) || (isNode(node) && (node.tag || ('anchor' in node && node.anchor)))) fail('$', 'YAML tags/anchors/aliases unsupported');
    if (isMap(node)) for (const pair of node.items) {
      if (!isScalar(pair.key) || typeof pair.key.value !== 'string') fail('$', 'mapping keys must be strings');
      if (format === 'yaml' && pair.key.value === '<<' && pair.key.type !== 'QUOTE_DOUBLE' && pair.key.type !== 'QUOTE_SINGLE') fail('$', 'unquoted YAML merge keys unsupported');
    }
    if (isScalar(node) && typeof node.value === 'number' && !/^-?(0|[1-9][0-9]*)$/.test(node.source ?? '')) fail('$', 'numbers require decimal integer notation');
  });
  const data: unknown = format === 'json' ? JSON.parse(text) : doc.toJS({maxAliasCount: 0});
  return data;
}
/** Strict JSON syntax for host envelopes; artifact validation is separate. */
export function decodeJsonValue(text: string): unknown { return decodeValue(text, 'json'); }
