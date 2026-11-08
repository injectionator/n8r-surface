// SPDX-License-Identifier: Apache-2.0
// Shared workspace boundary. No network, global settings or host attachment.
import fs from 'node:fs';
import path from 'node:path';
import { randomUUID } from 'node:crypto';
import { pathToFileURL } from 'node:url';

export const WORKSPACE_FORMAT = 'n8r.workspace/1';
const uuid4 = /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
const nonempty = value => typeof value === 'string' && value.trim().length > 0;
const result = (status, message, extra = {}) => ({ status, message, ...extra });

export function validateWorkspace(record) {
  if (!record || typeof record !== 'object' || Array.isArray(record)
      || !nonempty(record.format)) {
    return result('malformed', 'Workspace metadata must be an object with a nonempty format token.');
  }
  // An unknown format has its own contract: do not apply this version's fields.
  if (record.format !== WORKSPACE_FORMAT) {
    return result('unsupported', 'Unsupported workspace format; use a compatible reader or another destination.');
  }
  if (typeof record.id !== 'string' || !uuid4.test(record.id) || !nonempty(record.name)
      || (Object.hasOwn(record, 'purpose') && typeof record.purpose !== 'string')) {
    return result('malformed', 'Workspace metadata requires a UUID v4 id, nonempty name and optional text purpose.');
  }
  return result('recognized', 'Recognized supported workspace; existing bytes are unchanged.', { record });
}

function statIfPresent(file) {
  try { return fs.lstatSync(file); }
  catch (error) { if (error.code === 'ENOENT') return undefined; throw error; }
}
function failure(error, directory) {
  return result('io-error', `Filesystem operation failed (${error.code ?? 'unknown'}); inspect the destination before retrying. No repair was attempted.`, { directory });
}

export function inspectWorkspace(directory) {
  if (!nonempty(directory) || directory.includes('\0')) return result('invalid-input', 'Select a nonempty local directory path.');
  directory = path.resolve(directory);
  const at = (status, message, extra) => result(status, message, { directory, ...extra });
  try {
    const root = statIfPresent(directory);
    if (!root) return at('missing', 'Destination does not exist; explicit setup may create it.');
    if (!root.isDirectory() || root.isSymbolicLink()) return at('conflict', 'Destination must be a real directory, not a file or symbolic link. Choose another folder.');
    const metaPath = path.join(directory, '.n8r'), meta = statIfPresent(metaPath);
    if (!meta) return fs.readdirSync(directory).length === 0
      ? at('empty', 'Empty destination; explicit setup may initialize it.')
      : at('needs-choice', 'Existing files are present. Initialize here or choose another folder?');
    if (!meta.isDirectory() || meta.isSymbolicLink()) return at('conflict', '.n8r conflicts with workspace metadata. Choose another folder; repair is separate.');
    const file = path.join(metaPath, 'workspace.json'), stat = statIfPresent(file);
    if (!stat || !stat.isFile() || stat.isSymbolicLink()) return at('conflict', '.n8r has no regular workspace.json identity record. Choose another folder; repair is separate.');
    let record;
    try { record = JSON.parse(fs.readFileSync(file, 'utf8')); }
    catch (error) {
      if (error instanceof SyntaxError) return at('malformed', 'workspace.json is not valid JSON. Preserve it; choose another folder or arrange separate repair.');
      throw error;
    }
    return { ...validateWorkspace(record), directory };
  } catch (error) { return failure(error, directory); }
}

export function setupWorkspace(directory, options = {}) {
  if (!options || typeof options !== 'object' || Array.isArray(options)
      || Object.keys(options).some(key => !['name', 'purpose', 'adopt'].includes(key))
      || (options.name !== undefined && !nonempty(options.name))
      || (options.purpose !== undefined && typeof options.purpose !== 'string')
      || (options.adopt !== undefined && typeof options.adopt !== 'boolean')) {
    return result('invalid-input', 'Use an optional nonempty name, text purpose and boolean adopt choice.');
  }
  const state = inspectWorkspace(directory);
  if (!['missing', 'empty', 'needs-choice'].includes(state.status)) return state;
  if (state.status === 'needs-choice' && options.adopt !== true) return state;
  directory = state.directory;
  const record = { format: WORKSPACE_FORMAT, id: randomUUID(), name: options.name ?? path.basename(directory) };
  if (options.purpose !== undefined) record.purpose = options.purpose;
  const validation = validateWorkspace(record);
  if (validation.status !== 'recognized') return result('invalid-input', validation.message, { directory });
  const meta = path.join(directory, '.n8r');
  const temporary = path.join(meta, `.workspace-${randomUUID()}.tmp`);
  try {
    fs.mkdirSync(directory, { recursive: true });
    // Exclusive directory creation refuses an intervening metadata writer.
    fs.mkdirSync(meta);
    fs.writeFileSync(temporary, `${JSON.stringify(record, null, 2)}\n`, { flag: 'wx', mode: 0o600 });
    const descriptor = fs.openSync(temporary, 'r');
    try { fs.fsyncSync(descriptor); } finally { fs.closeSync(descriptor); }
    // Hard-link publication is atomic and refuses an existing target. No partial
    // JSON is ever published at the identity path. No rename-overwrite fallback.
    fs.linkSync(temporary, path.join(meta, 'workspace.json'));
    fs.unlinkSync(temporary);
    const readback = inspectWorkspace(directory);
    if (readback.status !== 'recognized' || readback.record.id !== record.id) {
      return result('io-error', 'Created metadata could not be independently read back. Inspect the destination; setup is not confirmed.', { directory });
    }
    return { ...readback, status: 'created', message: 'Workspace created and read back. Research has not started; app attachment is separate.' };
  } catch (error) {
    // Keep evidence of interrupted initialization. Never remove or repair data
    // here; a later setup refuses incomplete .n8r rather than guessing ownership.
    return failure(error, directory);
  }
}

function main(args) {
  const [operation, directory, ...rest] = args;
  const options = {};
  let valid = ['inspect', 'setup'].includes(operation) && nonempty(directory);
  for (let i = 0; i < rest.length && valid; i++) {
    const flag = rest[i], key = flag.slice(2);
    if (operation !== 'setup' || !['--adopt', '--name', '--purpose'].includes(flag) || Object.hasOwn(options, key)) { valid = false; break; }
    if (flag === '--adopt') options.adopt = true;
    else if (rest[i + 1] === undefined || rest[i + 1].startsWith('--')) valid = false;
    else options[key] = rest[++i];
  }
  const output = !valid ? result('invalid-input', 'Usage: node workspace.mjs inspect PATH | setup PATH [--name NAME] [--purpose TEXT] [--adopt]')
    : operation === 'inspect' ? inspectWorkspace(directory) : setupWorkspace(directory, options);
  process.stdout.write(`${JSON.stringify(output)}\n`);
  process.exitCode = ['created', 'recognized'].includes(output.status) ? 0
    : ['missing', 'empty', 'needs-choice'].includes(output.status) ? 3 : 2;
}
if (process.argv[1] && import.meta.url === pathToFileURL(fs.realpathSync(process.argv[1])).href) main(process.argv.slice(2));
