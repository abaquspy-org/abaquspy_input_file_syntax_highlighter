# AbaqusPy: Input File Syntax Highlighter for Abaqus

AbaqusPy is an open-source framework, distributed as part of [PySubsea](https://pypi.org/project/pysubsea/), for extending Abaqus `.inp` workflows with lightweight Python integration.

This Visual Studio Code extension provides syntax highlighting for Abaqus input files (`.inp`), including standard Abaqus syntax and AbaqusPy extensions.


## AbaqusPy Syntax Extensions

AbaqusPy extends the standard Abaqus `.inp` syntax with:

- `<py` and `py>` blocks for embedded Python logic, loops, calculations, and variable definitions
- `$` output markers for writing Python-generated lines into the final executable Abaqus .inp file


## Features

- Highlights Abaqus keywords and directives (e.g. `*NODE`, `*ELEMENT`, etc.).
- Highlights AbaqusPy `<py` and `py>` Python blocks.
- Highlights AbaqusPy `$` output markers used for generating the final Abaqus input file.
- Improves readability of complex `.inp` files used in automation and parametric workflows.


## Preview

#### Example of Abaqus Syntax Highlighting:

![AbaqusPy - Abaqus syntax highlighting example](./images/abaqus_syntax_highlighting.png)

#### Example of Python `<py` and `py>` Block Syntax Highlighting:

![AbaqusPy - Python syntax highlighting example 1](./images/python_syntax_highlighting_1.png)

#### Example of Python `$` Block Syntax Highlighting:

![AbaqusPy - Python syntax highlighting example 2](./images/python_syntax_highlighting_2.png)


## Extension Details

- **Publisher:** `ismaelripoll`
- **Extension Name:** `syntax-highlighter-for-abaqus-input-files`
- **Identifier:** `ismaelripoll.syntax-highlighter-for-abaqus-input-files`
- **Credits:** Developed in collaboration with Subsea Energies (https://www.subseaenergies.com)


## Dependencies

AbaqusPy integrates with the open-source PySubsea framework:

- PySubsea (PyPI): https://pypi.org/project/pysubsea/
- PySubsea repository: https://github.com/py-subsea/py-subsea
- PySubsea documentation: https://py-subsea.github.io/py-subsea/


## License

- PySubsea is licensed under a MIT License (see [LICENSE](./LICENSE) for details).
- AbaqusPy is therefore also licensed under a MIT License.


## Security and Privacy

- This extension is grammar-only and provides syntax highlighting.
- It does not execute scripts or run code on your files.
- It does not collect telemetry.
- It does not make network calls.


## Trademark Notice

This extension is an independent open-source project and is not affiliated with, endorsed by, or sponsored by Dassault Systèmes. Abaqus is a trademark of Dassault Systèmes.