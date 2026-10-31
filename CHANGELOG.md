# Changelog

All notable changes to this project are documented in this file.

## [0.0.3] - 2026-10-31

- Added syntax highlighting for `.pes` files.
- Enabled Ctrl+/ to toggle Abaqus `**` line comments.
- Enabled Python `#` comments with Ctrl+/ inside `<py` ... `py>` blocks.
- Fixed highlighting for `**` comments without trailing `**`.
- Fixed Abaqus keyword highlighting after `$` output markers outside Python blocks.
- Added consistent Python highlighting for `{...}` expressions in output lines and parameter values.
- Matched the Python language mapping for inline expressions inside and outside Python blocks, including bracket colouring.
- Clarified publisher branding and that PySubsea is not required for highlighting.
- Added repeatable TextMate regression tests and installed-package smoke-test examples.

## [0.0.2] - 2026-09-25

- Added an explicit cyan color for Abaqus parameter names across VS Code themes.
- Bumped extension version to 0.0.2 for release.
- Synchronized lockfile package metadata with extension package metadata.

## [0.0.1] - 2026-07-09

- Initial release.
- Added TextMate grammar for Abaqus input files.
- Added embedded Python block highlighting support.
- Clarified marketplace description as unofficial and community-maintained.
- Updated keywords for relevance and reduced brand-risk terms.
- Aligned README publisher/name/identifier with package metadata.
- Added README Security and Privacy section (no telemetry, no network calls, no code execution).
- Expanded release packaging excludes for cleaner VSIX artifacts.
- Refined trademark notice wording for clearer independence statement.
