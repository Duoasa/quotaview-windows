var fs = require("node:fs");
var sea = require("node:sea");
var integrationHook = require("../src/core/hook.cjs");
var codexHook = require("../src/core/codex-hook.cjs");
async function main(args = process.argv.slice(1)) {
  if (args.includes("--helper-smoke-test")) {
    const report = {
      ok: true,
      sea: sea.isSea(),
      platform: process.platform,
      arch: process.arch,
      node: process.versions.node,
      entrypoints: ["--quotaview-hook", "--quotaview-codex-hook"],
      headless: true
    };
    const file = args.find((value) => value.startsWith("--helper-smoke-report="))?.slice("--helper-smoke-report=".length);
    if (file) fs.writeFileSync(file, JSON.stringify(report, null, 2));
    process.stdout.write(JSON.stringify(report) + "\n");
    return;
  }
  const codex = args.indexOf("--quotaview-codex-hook");
  const integration = args.indexOf("--quotaview-hook");
  if (codex >= 0 && integration < 0) await codexHook.main(args.slice(codex + 1));
  else if (integration >= 0 && codex < 0) await integrationHook.main(args.slice(integration + 1));
}
if (require.main === module || sea.isSea()) {
  main().then(() => {
    process.exitCode = 0;
  }, () => {
    process.exitCode = 0;
  });
}
module.exports = { main };
