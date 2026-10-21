const fs = require('node:fs');
const path = require('node:path');
const crypto = require('node:crypto');
const {execFileSync} = require('node:child_process');
const {buildSync} = require('esbuild');
const {inject} = require('postject');
async function main() {
  if (process.platform !== 'win32' || process.arch !== 'x64' || process.versions.node !== '24.19.0') throw Error('Helper packaging requires official Windows x64 Node.js 24.19.0.');
  const root = path.resolve(__dirname, '..');
  const out = path.join(root, 'dist/helper');
  const work = path.join(root, 'dist/helper-build');
  fs.mkdirSync(out, {recursive: true}); fs.mkdirSync(work, {recursive: true});
  const entry = path.join(work, 'helper.cjs'), blob = path.join(work, 'helper.blob');
  buildSync({entryPoints: [path.join(__dirname, 'helper-entry.cjs')], outfile: entry, platform: 'node', target: 'node24', bundle: true});
  const config = path.join(work, 'sea-config.json');
  fs.writeFileSync(config, JSON.stringify({main: entry, output: blob, disableExperimentalSEAWarning: true, useSnapshot: false, useCodeCache: false, execArgvExtension: 'none'}));
  execFileSync(process.execPath, ['--experimental-sea-config', config], {stdio: 'inherit'});
  const executable = path.join(out, 'quotaview-hook.exe');
  fs.copyFileSync(process.execPath, executable);
  // SEA injection modifies the PE. Remove the copied Node signature first;
  // the generated helper is unsigned and can be signed after packaging.
  const pe = fs.readFileSync(executable);
  const optional = pe.readUInt32LE(0x3c) + 24;
  if (pe.readUInt16LE(optional) !== 0x20b) throw Error('Expected PE32+ Node executable');
  const certificateDirectory = optional + 112 + 4 * 8;
  pe.fill(0, certificateDirectory, certificateDirectory + 8);
  fs.writeFileSync(executable, pe);
  await inject(executable, 'NODE_SEA_BLOB', fs.readFileSync(blob), {sentinelFuse: 'NODE_SEA_FUSE_fce680ab2cc467b6e072b8b5df1996b2'});
  execFileSync(executable, ['--helper-smoke-test'], {stdio: 'inherit'});
  fs.copyFileSync(path.join(root, 'licenses/LICENSE.node.txt'), path.join(out, 'LICENSE.node.txt'));
  fs.writeFileSync(path.join(out, 'helper-manifest.json'), JSON.stringify({node: process.versions.node, sha256: crypto.createHash('sha256').update(fs.readFileSync(executable)).digest('hex')}, null, 2));
}
main().catch(error => {console.error(error); process.exitCode = 1;});
