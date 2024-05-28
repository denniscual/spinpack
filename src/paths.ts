import fs from "node:fs";
import path from "node:path";

const appDirectory = fs.realpathSync(process.cwd());
function resolveApp(relativePath: string) {
  return path.resolve(appDirectory, relativePath);
}

export default {
  appDirectory,
  appPackageJson: resolveApp("package.json"),
  appRsbuildConfig: resolveApp("rsbuild.config.ts"),
  appPublic: resolveApp("public"),
  appRspackComp: resolveApp(".rspack-comp"),
  appRspackCompPublic: resolveApp(".rspack-comp/public"),
};
