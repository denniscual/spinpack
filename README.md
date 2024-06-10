# Spinpack

Spinpack is a CLI tool that turbocharges the developer server experience for [CRA](https://create-react-app.dev/) projects with [Rspack](https://www.rspack.dev/), a lightning-fast, Rust-based bundler.

## Motivation

Spinpack was developed to modernize the development experience for Create React App (CRA) users facing performance bottlenecks with [Webpack](https://webpack.js.org/). By bringing in Rspack, a fast, rust-based bundler, Spinpack speeds up your development and updates your project’s tech stack without changing the way you work. Spinpack uses [Rsbuild](https://rsbuild.dev/), the Rspack powered build tool, to spin-up developer server. Spinpack makes sure developers can stay efficient without needing to give up their familiar setup.

## Install

```bash
npm add -D @denniscual/spinpack
```

## Usage

### Initializing a Project

To prepare your project to use Webpack and Rspack, run:

```bash
npm spinpack init
```

This command will:

- Create an rsbuild.config.ts configuration file in your project directory to spin-up an Rspack dev server.
- Install necessary dependencies for RSPack.
- Update your .gitignore to exclude the appropriate files.

### Starting the Development Server

To start the development server, use:

```bash
npm spinpack start
```

Options:

- -rs, --rspack: Use Rspack for the development server.
- -cr, --craco: Use CRACO, custom create-react-app webpack config, for the development server.
- -rs, --react-scripts: Use React Scripts, default create-react-app webpack config, for the development server (default).

Example:

```bash
npm spinpack start --rspack
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
npm spinpack start --rspack
```

This streamlined configuration process ensures that developers can focus on their code, not on managing tool settings.

_Currently, updating Rspack, `rsbuild.config.ts`, configurations and expecting them to reflect in CRA’s Webpack configuration is not supported. However, we are exploring the possibility of enabling this in future updates._

### Does Spinpack support production builds?

Currently, Spinpack is focused exclusively on enhancing the development server experience and does not yet support configuring production builds. This ensures that developers can use Spinpack to quickly spin up a development environment using either CRA Webpack Config or Rspack without affecting the existing production build process. Adding support for production environments through Spinpack is something we highly consider for future updates.

## License

MIT © [denniscual](https://github.com/denniscual/spinpack/blob/master/LICENSE.MD)
