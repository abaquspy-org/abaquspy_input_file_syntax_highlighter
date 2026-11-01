const assert = require('node:assert/strict');
const { execSync } = require('node:child_process');
const fs = require('node:fs');
const path = require('node:path');
const { after, before, test } = require('node:test');
const textmate = require('vscode-textmate');
const oniguruma = require('vscode-oniguruma');

const root = process.env.ABAQUS_EXTENSION_ROOT || path.resolve(__dirname, '..');
const readJson = file => JSON.parse(fs.readFileSync(file, 'utf8'));
const manifest = readJson(path.join(root, 'package.json'));
const registration = manifest.contributes.grammars.find(entry => entry.language === 'abaqus');
let registry;
let grammar;
let pythonConfiguration;
let themes;

before(async () => {
  const pythonDirectory = process.env.VSCODE_PYTHON_EXTENSION ||
    execSync('code --locate-extension vscode.python', { encoding: 'utf8' }).trim();
  assert(pythonDirectory, 'VS Code built-in Python extension was not found');
  const pythonManifest = readJson(path.join(pythonDirectory, 'package.json'));
  const pythonLanguage = pythonManifest.contributes.languages.find(entry => entry.id === 'python');
  const pythonGrammar = pythonManifest.contributes.grammars.find(entry => entry.scopeName === 'source.python');
  pythonConfiguration = readJson(path.join(pythonDirectory, pythonLanguage.configuration));
  const themeDirectory = path.join(pythonDirectory, '..', 'theme-defaults', 'themes');
  themes = ['light_vs.json', 'dark_vs.json'].map(file => ({
    name: file,
    settings: readJson(path.join(themeDirectory, file)).tokenColors
  }));
  themes.push({ name: 'default', settings: [] });

  const wasm = fs.readFileSync(require.resolve('vscode-oniguruma/release/onig.wasm'));
  await oniguruma.loadWASM(wasm.buffer.slice(wasm.byteOffset, wasm.byteOffset + wasm.byteLength));
  registry = new textmate.Registry({
    onigLib: Promise.resolve({
      createOnigScanner: patterns => new oniguruma.OnigScanner(patterns),
      createOnigString: text => new oniguruma.OnigString(text)
    }),
    loadGrammar: async scope => {
      if (scope === 'source.abaqus') return readJson(path.join(root, registration.path));
      if (scope === 'source.python') return readJson(path.join(pythonDirectory, pythonGrammar.path));
      return null;
    }
  });
  const embeddedLanguages = Object.fromEntries(
    Object.entries(registration.embeddedLanguages).map(([scope, language]) => {
      assert.equal(language, 'python');
      return [scope, 2];
    })
  );
  grammar = await registry.loadGrammarWithEmbeddedLanguages('source.abaqus', 1, embeddedLanguages);
});

after(() => {
  if (registry) registry.dispose();
});

function scopeAt(line, result, text, scope, occurrence = 0) {
  let position = -1;
  for (let i = 0; i <= occurrence; i++) position = line.indexOf(text, position + 1);
  assert(position >= 0, `Test text not found: ${text}`);
  const token = result.tokens.find(entry => entry.startIndex <= position && entry.endIndex > position);
  assert(token.scopes.includes(scope), `${line}: ${text} expected ${scope}; got ${token.scopes}`);
  return token.scopes;
}

function metadataAt(tokens, position) {
  let metadata;
  for (let i = 0; i < tokens.length && tokens[i] <= position; i += 2) metadata = tokens[i + 1];
  assert.notEqual(metadata, undefined);
  return metadata;
}

test('light palette overrides all Abaqus colors with readable contrast on white', () => {
  const colors = manifest.contributes.configurationDefaults['editor.tokenColorCustomizations'];
  const dark = colors.textMateRules;
  const light = colors['[*Light*]'].textMateRules;
  assert.deepEqual(light.map(rule => rule.scope), dark.map(rule => rule.scope));
  assert.deepEqual(dark.map(rule => rule.settings.foreground),
    ['#9f5fbf', '#BF5FA5', '#54c971', '#00CED1', '#ffb86c', '#ff7777']);
  assert.deepEqual(light.map(rule => rule.settings.foreground),
    ['#8000B0', '#B00080', '#008000', '#008080', '#C05800', '#D00000']);

  const examples = [
    ['** comment', '**'],
    ['*NODE', '*NODE'],
    ['*NODE, NSET=TEST', 'TEST'],
    ['*NODE, NSET=TEST', 'NSET'],
    ['<py', '<py'],
    ['$*NODE', '$']
  ];
  try {
    for (const rules of [dark, light]) {
      registry.setTheme({ settings: [...dark, ...rules] });
      examples.forEach(([line, text], index) => {
        const tokens = grammar.tokenizeLine2(line, textmate.INITIAL).tokens;
        const foreground = (metadataAt(tokens, line.indexOf(text)) >>> 15) & 511;
        assert.equal(registry.getColorMap()[foreground],
          rules[index].settings.foreground.toUpperCase());
      });
    }
    for (const rule of light) {
      const rgb = rule.settings.foreground.slice(1).match(/../g).map(channel => {
        const value = parseInt(channel, 16) / 255;
        return value <= 0.04045 ? value / 12.92 : ((value + 0.055) / 1.055) ** 2.4;
      });
      const luminance = 0.2126 * rgb[0] + 0.7152 * rgb[1] + 0.0722 * rgb[2];
      assert(1.05 / (luminance + 0.05) >= 4.5,
        `${rule.scope} must have at least 4.5:1 contrast on white`);
    }
  } finally {
    registry.setTheme({ settings: [] });
  }
});

test('file associations and comment configurations are preserved', () => {
  const language = manifest.contributes.languages.find(entry => entry.id === 'abaqus');
  assert.deepEqual(language.extensions, ['.inp', '.pes']);
  assert.equal(readJson(path.join(root, language.configuration)).comments.lineComment, '**');
  assert.equal(pythonConfiguration.comments.lineComment, '#');
  assert.equal(registration.embeddedLanguages['meta.embedded.block.python.abaqus'], 'python');
  assert.equal(registration.embeddedLanguages['meta.embedded.inline.python.abaqus'], 'python');
});

test('output keywords, parameters and comments work inside and outside Python', () => {
  for (const state of [textmate.INITIAL, grammar.tokenizeLine('<py', textmate.INITIAL).ruleStack]) {
    for (const prefix of ['$', '  $ ']) {
      const line = `${prefix}*NODE, NSET=TEST`;
      const result = grammar.tokenizeLine(line, state);
      scopeAt(line, result, '$', 'punctuation.definition.dollar.abaqus');
      scopeAt(line, result, '*NODE', 'keyword.control.abaqus');
      scopeAt(line, result, 'NSET=', 'support.constant.parameter.abaqus');
      scopeAt(line, result, 'TEST', 'string.unquoted.value.abaqus');
    }
    const line = '$ ** {not_python}';
    scopeAt(line, grammar.tokenizeLine(line, state), '{', 'comment.line.abaqus');
  }
  for (const line of ['**', '** comment', '** comment **', '  ** comment']) {
    scopeAt(line, grammar.tokenizeLine(line, textmate.INITIAL), '**', 'comment.line.abaqus');
  }
});

test('interpolations do not inherit the Abaqus value colour', () => {
  const line = '$*RIGID BODY, ANALYTICAL SURFACE=surf_sleeper_{i+1}, REF NODE=nset_ref_sleeper_{i+1},';
  for (const state of [textmate.INITIAL, grammar.tokenizeLine('<py', textmate.INITIAL).ruleStack]) {
    const result = grammar.tokenizeLine(line, state);
    scopeAt(line, result, 'surf_sleeper_', 'string.unquoted.value.abaqus');
    scopeAt(line, result, 'REF NODE=', 'support.constant.parameter.abaqus');
    for (let occurrence = 0; occurrence < 2; occurrence++) {
      const scopes = scopeAt(line, result, '{', 'punctuation.section.interpolation.begin.python', occurrence);
      assert(!scopes.includes('string.unquoted.value.abaqus'));
      scopeAt(line, result, '}', 'punctuation.section.interpolation.end.python', occurrence);
      scopeAt(line, result, '1', 'constant.numeric.dec.python', occurrence);
    }
  }
});

test('nested expressions, commas and quoted braces do not consume following parameters', () => {
  for (const expression of ['make_name(i, j)', '{"key": 1}["key"]', '"}"']) {
    const line = `$*NODE, NSET={${expression}}, TYPE=C3D8`;
    const result = grammar.tokenizeLine(line, textmate.INITIAL);
    scopeAt(line, result, 'TYPE=', 'support.constant.parameter.abaqus');
    scopeAt(line, result, 'C3D8', 'string.unquoted.value.abaqus');
  }
});

test('expression language and colour metadata match inside and outside blocks', () => {
  for (const theme of themes) {
    registry.setTheme(theme);
    for (const line of ["$ {soil_sr['downward_stiff']}", '$*NODE, NSET=surf_{i+1}']) {
      const insideState = grammar.tokenizeLine('<py', textmate.INITIAL).ruleStack;
      const outside = grammar.tokenizeLine2(line, textmate.INITIAL).tokens;
      const inside = grammar.tokenizeLine2(line, insideState).tokens;
      const start = line.indexOf('{');
      const end = line.lastIndexOf('}');
      for (let position = start; position <= end; position++) {
        const metadata = metadataAt(outside, position);
        assert.equal(metadata & 255, 2, 'Interpolation must use the Python language');
        assert.equal(metadata, metadataAt(inside, position), `Different colour/language in ${theme.name}`);
      }
      assert.equal(metadataAt(outside, 0) & 255, 1, 'Outside dollar marker must remain Abaqus');
    }
  }
});

test('ordinary Python and Abaqus resume after output lines and block boundaries', () => {
  let state = grammar.tokenizeLine('<py', textmate.INITIAL).ruleStack;
  state = grammar.tokenizeLine('$*NODE, NSET={i+1}', state).ruleStack;
  const python = '# Python comment';
  scopeAt(python, grammar.tokenizeLine(python, state), '#', 'comment.line.number-sign.python');
  state = grammar.tokenizeLine('py>', state).ruleStack;
  const abaqus = '*ELEMENT, TYPE=C3D8';
  const result = grammar.tokenizeLine(abaqus, state);
  scopeAt(abaqus, result, '*ELEMENT', 'keyword.control.abaqus');
  scopeAt(abaqus, result, 'TYPE=', 'support.constant.parameter.abaqus');
  const malformed = grammar.tokenizeLine('$*NODE, NSET={i+1', textmate.INITIAL);
  scopeAt(abaqus, grammar.tokenizeLine(abaqus, malformed.ruleStack), '*ELEMENT', 'keyword.control.abaqus');
});
