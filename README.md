# AbaqusPy: Input File Syntax Highlighter for Abaqus

AbaqusPy is an open-source framework, distributed as part of [PySubsea](https://pypi.org/project/pysubsea/), for extending Abaqus `.inp` workflows with lightweight Python integration.

This Visual Studio Code extension provides syntax highlighting for Abaqus input files (`.inp` and `.pes`), including standard Abaqus syntax and AbaqusPy extensions.


## AbaqusPy Syntax Extensions

AbaqusPy extends the standard Abaqus `.inp` syntax with:

- `<py` and `py>` blocks for embedded Python logic, loops, calculations, and variable definitions
- `$` output markers for writing Python-generated lines into the final executable Abaqus .inp file


## Features

- Highlights Abaqus keywords and directives (e.g. `*NODE`, `*ELEMENT`, etc.).
- Highlights AbaqusPy `<py` and `py>` Python blocks.
- Highlights AbaqusPy `$` output markers and the Abaqus syntax following them, both inside and outside `<py` ... `py>` blocks.
- Highlights Python `{...}` expressions consistently in output lines and parameter values, such as `surf_sleeper_{i+1}`.
- Supports Ctrl+/ to toggle Python `#` comments inside `<py` ... `py>` blocks and Abaqus `**` comments outside them in `.inp` and `.pes` files.
- Improves readability of complex `.inp` and `.pes` files used in automation and parametric workflows.


## Preview

#### Python Blocks, Inline `$` Output, and Abaqus `.inp` Syntax:

![Master file showing Python blocks, inline dollar output, and Abaqus input syntax highlighting](./images/python_abaqus_syntax_highlighting.png)

#### Abaqus `.inp` Syntax Highlighting:

![Abaqus .inp file syntax highlighting example](./images/abaqus_inp_syntax_highlighting.png)

#### Abaqus `.pes` Syntax Highlighting:

![Abaqus .pes file syntax highlighting example](./images/abaqus_pes_syntax_highlighting.png)


## Extension Details

- **Publisher display name:** Subsea Energies
- **Publisher ID:** `ismaelripoll`
- **Extension Name:** `syntax-highlighter-for-abaqus-input-files`
- **Identifier:** `ismaelripoll.syntax-highlighter-for-abaqus-input-files`
- **Credits:** Developed in collaboration with Subsea Energies (https://www.subseaenergies.com)


## Related Framework

This extension does not require PySubsea or a Python interpreter. It uses VS Code's built-in Python grammar for embedded Python highlighting.

AbaqusPy integrates with the open-source PySubsea framework for executing parametric workflows:

- PySubsea (PyPI): https://pypi.org/project/pysubsea/
- PySubsea repository: https://github.com/py-subsea/py-subsea
- PySubsea documentation: https://py-subsea.github.io/py-subsea/


## License

This extension is licensed under the MIT License (see [LICENSE](./LICENSE)).


## Development and Release Checks

With Node.js and VS Code's `code` command available on PATH:

```sh
npm ci
npm test
```

The tests use VS Code's bundled Python grammar. If `code` is unavailable, set `VSCODE_PYTHON_EXTENSION` to the directory containing the built-in Python extension's `package.json`.

Before publishing, install the built VSIX in a normal VS Code window, reload that window, and open [sample.inp](./tests/fixtures/sample.inp) and [sample.pes](./tests/fixtures/sample.pes). Check:

- Ctrl+/ uses `**` outside Python blocks and `#` inside them.
- `$` keywords and parameter values are highlighted inside and outside Python blocks.
- `{...}` expressions have matching Python colours in both locations.
- Ordinary Python and Abaqus highlighting resumes after output lines and block boundaries.


## Security and Privacy

- This extension is grammar-only and provides syntax highlighting.
- It does not execute scripts or run code on your files.
- It does not collect telemetry.
- It does not make network calls.


## Trademark Notice

This extension is an independent open-source project and is not affiliated with, endorsed by, or sponsored by Dassault Systèmes. Abaqus is a trademark of Dassault Systèmes.