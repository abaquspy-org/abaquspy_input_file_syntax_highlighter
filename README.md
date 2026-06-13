# AbaqusPy: Abaqus Input File Syntax Highlighter

A Visual Studio Code extension that provides syntax highlighting for Abaqus input files (`.inp`), including both Abaqus standard syntax and AbaqusPy hybrid Abaqus–Python syntaxes.

AbaqusPy is an open-source framework, distributed as part of [PySubsea](https://pypi.org/project/pysubsea/), that extends the standard Abaqus `.inp` syntax with two simple  but powerful additions that unlock full power and flexibility of Python:

- `<py` and `py>` blocks for embedded Python logic, loops, calculations, and variable definitions
- `$` output markers for writing Python-generated lines into the final executable Abaqus .inp file

The main capabilities of the extension are:

- Highlights Abaqus keywords and directives (e.g. `*NODE`, `*ELEMENT`, etc.).
- Highlights AbaqusPy `<py` and `py>` Python blocks.
- Highlights AbaqusPy `$` output markers used for generating the final Abaqus input file.
- Improves readability of complex .inp files used in automation and parametric workflows.

## Preview

#### Example of Abaqus Syntax Highlighting:

![AbaqusPy - Abaqus syntax highlighting example](./images/abaqus_syntax_highlighting.png)

#### Example of Python `<py` and `py>` Block Syntax Highlighting:

![AbaqusPy - Python syntax highlighting example 1](./images/python_syntax_highlighting_1.png)

#### Example of Python `$` Block Syntax Highlighting:

![AbaqusPy - Python syntax highlighting example 2](./images/python_syntax_highlighting_2.png)


## Extension Details

- **Publisher:** `ismael-ripoll`
- **Credits:** Developed in collaboration with Subsea Energies, https://www.subseaenergies.com.
- **Extension Name:** `abaquspy-input-file-syntax-highlighter`
- **Identifier:** `ismael-ripoll.abaquspy-input-file-syntax-highlighter`

## Repository, License and Release Notes

- AbaqusPy is an open-source framework, distributed as part of PySubsea (https://pypi.org/project/pysubsea/).
- AbaqusPy is licensed under the MIT License, see [LICENSE](./LICENSE) for details.
- See [CHANGELOG.md](./CHANGELOG.md) for version history and updates.