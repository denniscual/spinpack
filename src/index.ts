import { program } from "commander";
import spawn from "cross-spawn";
import fs from "fs-extra";
import path from "node:path";
import {
  installDependencies,
  detectPackageManager,
  updateGitignore,
} from "./deps";
import { transformTemplateIntoRspackTemplate } from "./transformer";
import paths from "./paths";

// init
program
  .command("init")
  .description("Setup project to support both Webpack and Rspack")
  .action(async () => {
    try {
      console.log("Create rsbuild.config.ts file");
      const rsbuildConfigTemplate = fs.readFileSync(
        path.resolve(__dirname, "../templates/rspack", "rsbuild.config.ts"),
      );
      fs.writeFileSync(paths.appRsbuildConfig, rsbuildConfigTemplate);

      console.log("Updating .gitignore file");
      updateGitignore();

      console.log("Installing spinpack dev dependencies...");
      const rsbuildDeps = [
        "@rsbuild/core",
        "@rsbuild/plugin-assets-retry",
        "@rsbuild/plugin-node-polyfill",
        "@rsbuild/plugin-react",
        "@rsbuild/plugin-svgr",
        // Linting
        "@rsbuild/plugin-eslint",
        "@rsbuild/plugin-type-check",
      ];
      installDependencies(rsbuildDeps, detectPackageManager());
    } catch (error) {
      console.error("Failed to setup project.", error);
    }
  });

program
  .command("start")
  .description("Start the development server")
  .option("-rs, --rspack", "Use Rspack for the development server")
  .option("-cr, --craco", "Use CRACO for the development server")
  .option(
    "-rs, --react-scripts",
    "Use React Scripts for the development server",
  )
  .action((options) => {
    if (options.rspack) {
      setupRspack().then(spawnRspack);
    } else if (options.craco) {
      spawnCraco();
    } else {
      spawnReactScripts();
    }
  });

program.parse(process.argv);

async function setupRspack() {
  // refer to the directory where the command was executed

  console.log("Setting up rspack...");

  try {
    await fs.copy(paths.appPublic, paths.appRspackCompPublic, {
      overwrite: true,
    });

    const indexHtmlPath = path.join(paths.appRspackCompPublic, "index.html");
    const indexEjsPath = path.join(paths.appRspackCompPublic, "index.ejs");
    const rspackTemplate: string = transformTemplateIntoRspackTemplate(
      await fs.readFile(indexHtmlPath, "utf8"),
    );
    await fs.writeFile(indexEjsPath, rspackTemplate, "utf8");
  } catch (error) {
    console.error("Error setting up rspack:", error);
  }
}

function spawnRspack() {
  console.log("Start dev server using Rspack...");
  const rspackProcess = spawn("rsbuild", ["dev"], { stdio: "inherit" });
  rspackProcess.on("close", (code) => process.exit(code));
}

function spawnCraco() {
  console.log("Start dev server using Webpack...");
  const cracoProcess = spawn("craco", ["start"], { stdio: "inherit" });
  cracoProcess.on("close", (code) => process.exit(code));
}

function spawnReactScripts() {
  console.log("Start dev server using React Scripts...");
  const reactScripts = spawn("react-scripts", ["start"], { stdio: "inherit" });
  reactScripts.on("close", (code) => process.exit(code));
}
