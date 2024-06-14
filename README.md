# Spinpack

Spinpack is a CLI tool that turbocharges the developer server experience for [CRA](https://create-react-app.dev/) projects with [Rspack](https://www.rspack.dev/), a lightning-fast, Rust-based bundler.

## Motivation

Spinpack was designed to modernize the development experience for Create React App (CRA) users struggling with performance issues due to [Webpack](https://webpack.js.org/). By integrating Rspack, a fast, rust-based bundler, this tool accelerates development and modernizes your project’s tech stack without altering your workflow. It leverages [Rsbuild](https://rsbuild.dev/), the Rspack powered build tool, to quickly spin up developer servers. This solution ensures developers remain productive and efficient, maintaining familiarity while benefiting from improved performance.

## Usage

### Initializing a Project

To prepare your project to use Webpack and Rspack, run:

```bash
npx @denniscual/spinpack init
```

This command will:

- Create an rsbuild.config.ts configuration file in your project directory to spin-up an Rspack dev server.
- Install necessary dependencies for RSPack.
- Update your .gitignore to exclude the appropriate files.

### Starting the Development Server

To start the development server, use:

```bash
npx @denniscual/spinpack start
```

Options:

- -rs, --rspack: Use Rspack for the development server.
- -cr, --craco: Use CRACO, custom create-react-app webpack config, for the development server.
- --react-scripts: Use React Scripts, default create-react-app webpack config, for the development server (default).

Example:

```bash
npx @denniscual/spinpack start --rspack
```

This will start the development server using Rspack. If no option is provided, Webpack will be used by default.

## Frequently Asked Questions (FAQ)

### How does Spinpack handle configuration settings between CRA and Rspack?

Spinpack enhances the development experience by aligning Rspack configurations with Create React App’s (CRA) environment variables. By treating CRA’s configurations as the source of truth, Spinpack automatically applies these settings to Rspack, eliminating the need for separate configuration efforts. This approach not only simplifies development by minimizing configuration duplication but also ensures consistent settings across both tools. For example, changing the server port via CRA’s `PORT` environment variable will automatically adjust the port for Rspack when using Spinpack:

Define in `.env` file

```
# Set the development server port to 3001
PORT=3001
```

Start dev server with Rspack

```bash
npx @denniscual/spinpack start --rspack
```

This streamlined configuration process ensures that developers can focus on their code, not on managing tool settings.

_Currently, updating Rspack, `rsbuild.config.ts`, configurations and expecting them to reflect in CRA’s Webpack configuration is not supported. However, we are exploring the possibility of enabling this in future updates._

### Does Spinpack support production builds?

Currently, Spinpack is focused exclusively on enhancing the development server experience. This ensures that developers can use Spinpack to quickly spin up a development environment using either CRA Webpack Config or Rspack without affecting the existing production build process.

Spinpack does generate a build configuration file, `rsbuild.config.ts`, within the project, which developers can fine-tune for production use. However, because projects often have unique requirements such as the need for specific Webpack plugins when leveraging [CRACO](https://craco.js.org/) or other similar tools for customization—this generated config might require further adjustments to fully meet production standards.

We highly consider adding support for production environments through Spinpack in future updates. This would streamline the process of using the tool's configurations directly for production builds, potentially reducing the need for extensive custom setups.

## License

MIT © [denniscual](https://github.com/denniscual/spinpack/blob/master/LICENSE.MD)
