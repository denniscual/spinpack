import { defineConfig, loadEnv } from "@rsbuild/core";
import { pluginAssetsRetry } from "@rsbuild/plugin-assets-retry";
import { pluginEslint } from "@rsbuild/plugin-eslint";
import { pluginNodePolyfill } from "@rsbuild/plugin-node-polyfill";
import { pluginReact } from "@rsbuild/plugin-react";
import { pluginSvgr } from "@rsbuild/plugin-svgr";
import { pluginTypeCheck } from "@rsbuild/plugin-type-check";
import fs from "fs";
import path from "path";

// Enable TypeScript and ESLint
const useTsAndLint = process.env.TS_AND_LINT === "true";

// Environment Variables
const CRA_ENV_VARS = extractCRAEnvVars();
const { publicVars: CUSTOM_ENV_VARS } = loadEnv({ prefixes: ["REACT_APP_"] });
const sourceDefineVars = {
  ...CUSTOM_ENV_VARS, // Expose REACT_APP_* environment variables
  ...defineCRAEnvVars(), // Expose CRA environment variables
};

const templateParameters = {
  ...toRawEnvVars(sourceDefineVars),
  process: {
    env: JSON.stringify(sourceDefineVars),
  },
};

const assetPrefix = CRA_ENV_VARS.PUBLIC_URL || "";

export default defineConfig({
  plugins: [
    pluginNodePolyfill(),
    pluginReact(),
    pluginAssetsRetry(),
    pluginSvgr({
      mixedImport: true,
    }),
    pluginTypeCheck({
      enable: useTsAndLint,
    }),
    pluginEslint({
      enable: useTsAndLint,
    }),
  ],
  source: {
    define: sourceDefineVars,
  },
  output: {
    distPath: {
      root: CRA_ENV_VARS.BUILD_PATH,
    },
    assetPrefix,
    dataUriLimit: CRA_ENV_VARS.IMAGE_INLINE_SIZE_LIMIT
      ? parseInt(CRA_ENV_VARS.IMAGE_INLINE_SIZE_LIMIT)
      : undefined,
  },
  dev: {
    assetPrefix,
    hmr:
      CRA_ENV_VARS.FAST_REFRESH != null
        ? CRA_ENV_VARS.FAST_REFRESH === "true"
        : undefined,
  },
  html: {
    template: path.resolve(__dirname, ".rspack-comp", "public", "index.ejs"),
    templateParameters,
  },
  server: {
    host: CRA_ENV_VARS.HOST,
    port: CRA_ENV_VARS.PORT ? parseInt(CRA_ENV_VARS.PORT) : 3000,
    // Update the following line to enable HTTPS.
    https: CRA_ENV_VARS.HTTPS === "true" ? createHttpsConfig() : undefined,
  },
  tools: {
    // Uncomment the following line to enable TailwindCSS.
    // postcss: (opts) => {
    //   opts.postcssOptions?.plugins?.push(require("tailwindcss"));
    // },
    swc: {
      jsc: {
        externalHelpers: true,
        transform: {
          react: {
            runtime: "automatic",
          },
        },
        parser: {
          syntax: "typescript",
          dynamicImport: true,
        },
      },
      rspackExperiments: {
        import: [
          {
            libraryName: "@mui/icons-material",
            customName: "@mui/icons-material/{{member}}",
          },
          {
            libraryName: "date-fns",
            customName: "date-fns/{{member}}",
          },
          {
            libraryName: "lodash",
            customName: "lodash/{{member}}",
          },
          {
            libraryName: "lodash/fp",
            customName: "lodash/fp/{{member}}",
          },
          {
            libraryName: "lodash-es",
            customName: "lodash-es/{{member}}",
          },
        ],
      },
    },
  },
});

function createHttpsConfig() {
  if (!CRA_ENV_VARS.SSL_CRT_FILE || !CRA_ENV_VARS.SSL_KEY_FILE) {
    throw new Error(
      "SSL_CRT_FILE and SSL_KEY_FILE environment variables are required to enable HTTPS. Please define them in your .env file.",
    );
  }

  const sslCrtFile = CRA_ENV_VARS.SSL_CRT_FILE ?? "./localhost.crt";
  const sslKeyFile = CRA_ENV_VARS.SSL_KEY_FILE ?? "./localhost.key";

  return {
    key: fs.readFileSync(path.resolve(__dirname, sslKeyFile)),
    cert: fs.readFileSync(path.resolve(__dirname, sslCrtFile)),
  };
}

function defineCRAEnvVars() {
  // Expose environment variables to the process.env object like PUBLIC_URL.
  return Object.entries(extractCRAEnvVars()).reduce((acc, [key, value]) => {
    acc[`process.env.${key}`] = JSON.stringify(value);
    return acc;
  }, {});
}

function extractCRAEnvVars() {
  // Env vars that supported by rsbuild
  // - https://rsbuild.dev/guide/migration/cra#configuration-migration
  return {
    HOST: process.env.HOST,
    PORT: process.env.PORT,
    HTTPS: process.env.HTTPS,
    PUBLIC_URL: process.env.PUBLIC_URL,
    BUILD_PATH: process.env.BUILD_PATH,
    IMAGE_INLINE_SIZE_LIMIT: process.env.IMAGE_INLINE_SIZE_LIMIT,
    FAST_REFRESH: process.env.FAST_REFRESH,
    SSL_CRT_FILE: process.env.SSL_CRT_FILE,
    SSL_KEY_FILE: process.env.SSL_KEY_FILE,
    // Ignoring generate source map for development server.
    // For BROWSER, it doesn't have a direct equivalent in rsbuild.
    // GENERATE_SOURCEMAP: process.env.GENERATE_SOURCEMAP,
    // BROWSER: process.env.BROWSER,
  };
}

function toRawEnvVars(vars: Record<string, string>) {
  return Object.entries(vars).reduce((acc, [key, value]) => {
    // From process.env.SAMPLE_VAR into SAMPLE_VAR
    const newKey = key.replace("process.env.", "");
    acc[newKey] = value != null ? JSON.parse(value) : undefined;
    return acc;
  }, {});
}
