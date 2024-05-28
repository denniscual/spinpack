import fs from "fs-extra";
import path from "node:path";
import spawn from "cross-spawn";

type PackageManger = "yarn" | "pnpm" | "npm" | "bun";

export function installDependencies(
  dependencies: string[],
  packageManager: PackageManger,
) {
  const deps = dependencies.join(" ");
  let installCommand = "";

  switch (packageManager) {
    case "yarn":
      installCommand = `yarn add -D ${deps}`;
      break;
    case "pnpm":
      installCommand = `pnpm add -D ${deps}`;
      break;
    default:
      installCommand = `npm add -D ${deps}`;
      break;
  }

  const childProcess = spawn(installCommand, [], {
    stdio: "inherit",
    shell: true,
  });
  childProcess.on("close", (code) => process.exit(code));
  childProcess.on("error", (err) => {
    console.error(`Error running ${installCommand}: ${err.message}`);
  });
}

export function detectPackageManager(): PackageManger {
  let currentDir = process.cwd();

  while (true) {
    // Check for 'yarn.lock'
    if (fs.existsSync(path.join(currentDir, "yarn.lock"))) {
      return "yarn";
    }
    // Check for 'pnpm-lock.yaml'
    if (fs.existsSync(path.join(currentDir, "pnpm-lock.yaml"))) {
      return "pnpm";
    }
    // Check for 'package-lock.json' for npm
    if (fs.existsSync(path.join(currentDir, "package-lock.json"))) {
      return "npm";
    }
    // Check for 'bun.lockb' for bun
    if (fs.existsSync(path.join(currentDir, "bun.lockb"))) {
      return "bun";
    }

    // Get the parent directory. Traversing up the directory tree is for supporting monorepos.
    const parentDir = path.resolve(currentDir, "..");

    // Check if the parent directory is the same as the current directory (root directory reached)
    if (parentDir === currentDir) {
      break;
    }

    // Update current directory to the parent directory
    currentDir = parentDir;
  }

  throw new Error("No package manager found.");
}

/**
 * Update .gitignore to include .rspack-comp artifacts.
 * */
export function updateGitignore() {
  let currentDir = process.cwd();

  while (true) {
    const gitignorePath = path.join(currentDir, ".gitignore");

    // Check for .gitignore
    if (fs.existsSync(gitignorePath)) {
      const gitignore = fs.readFileSync(gitignorePath, "utf8");

      if (!gitignore.includes(".rspack-comp")) {
        fs.appendFileSync(gitignorePath, ".rspack-comp\n");
      }

      return;
    }

    // Get the parent directory. Traversing up the directory tree is for supporting monorepos.
    const parentDir = path.resolve(currentDir, "..");

    // Check if the parent directory is the same as the current directory (root directory reached)
    if (parentDir === currentDir) {
      break;
    }

    // Update current directory to the parent directory
    currentDir = parentDir;
  }

  throw new Error("Project is not a git repository.");
}
