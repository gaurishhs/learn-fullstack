export const preserveFenceMetadata = {
  name: 'preserve-fence-metadata',
  pre(node) {
    const metadata = this.options.meta;
    const rawMetadata = typeof metadata === 'string'
      ? metadata
      : metadata?.__raw ?? Object.keys(metadata ?? {}).filter((key) => !key.startsWith('_')).join(' ');
    const metaText = String(rawMetadata ?? '');
    node.properties ??= {};
    node.properties['data-language'] = this.options.lang;
    if (/(?:^|\s)live(?:\s|$)/.test(metaText)) {
      node.properties['data-live-example'] = '';
    }
  },
};

/** @typedef {import('satteri').HastPluginDefinition} HastPluginDefinition */

const supportedLanguages = new Map([
  ['html', 'html'],
  ['htm', 'html'],
  ['css', 'css'],
  ['js', 'javascript'],
  ['javascript', 'javascript'],
  ['py', 'python'],
  ['python', 'python'],
]);

/**
 * @param {string} tagName
 * @param {string[]} classNames
 * @param {import('hast').Properties} properties
 * @param {import('hast').ElementContent[]} children
 * @returns {import('hast').Element}
 */
function element(tagName, classNames = [], properties = {}, children = []) {
  return {
    type: 'element',
    tagName,
    properties: {
      ...(classNames.length ? { className: classNames } : {}),
      ...properties,
    },
    children,
  };
}

/** @param {string} value @returns {import('hast').Text} */
function text(value) {
  return { type: 'text', value };
}

function makeLiveExample(language, initialCode) {
  const toolbar = element('div', ['code-toolbar', 'flex', 'h-10', 'items-center', 'justify-between', 'border-b', 'border-line', 'px-3'], {}, [
    element('span', ['flex', 'items-center', 'gap-2', 'font-mono', 'tracking-wide'], {}, [
      element('i', ['language-dot', 'size-1.5', 'rounded-full']),
      text(language.toUpperCase()),
    ]),
    element('div', ['flex', 'gap-1.5'], {}, [
      element('button', ['h-6', 'rounded', 'px-2'], { type: 'button', dataCopy: '' }, [text('Copy')]),
      element('button', ['run-button', 'h-6', 'rounded', 'px-2'], { type: 'button', dataRun: '' }, [
        text('Run '), element('span', [], {}, [text('↗')]),
      ]),
    ]),
  ]);

  const editor = element('div', ['code-editor', '[&_.cm-editor]:h-54', 'max-[760px]:[&_.cm-editor]:h-45', 'min-w-0', 'min-h-54', 'border-r', 'border-line', 'max-[760px]:min-h-45', 'max-[760px]:border-r-0', 'max-[760px]:border-b'], {
    dataEditorHost: '',
    dataInitial: initialCode,
    dataLanguage: language,
    ariaLabel: `Edit ${language} code`,
  });
  const preview = element('div', ['preview-area', 'flex', 'min-w-0', 'flex-col', 'bg-page'], {}, [
    element('div', ['preview-label', 'flex', 'h-7', 'justify-between', 'px-2.5', 'pt-1.5'], {}, [
      text(language === 'python' ? 'PYTHON TERMINAL ' : 'PREVIEW '),
      element('span', [], {}, [text(language === 'python' ? 'Pyodide' : 'Live result')]),
    ]),
    element('iframe', [
      'h-44', 'w-full', 'border-0', 'max-[760px]:h-44',
      ...(language === 'python' ? ['python-terminal-frame'] : ['bg-white']),
    ], {
      title: 'Live code preview',
      sandbox: ['allow-scripts'],
      dataPreview: '',
    }),
  ]);
  const editorGrid = element('div', ['grid', 'min-h-54', 'grid-cols-2', 'max-[760px]:grid-cols-1'], {}, [
    editor,
    preview,
  ]);
  const footer = element('div', ['code-footer', 'flex', 'h-8', 'items-center', 'justify-between', 'border-t', 'border-line', 'px-2'], {}, [
    element('button', ['h-6', 'px-2'], { type: 'button', dataReset: '' }, [text('Reset example')]),
    element('span', [], {}, [text('Edit the code, then run it.')]),
  ]);

  return element('div', ['code-example', 'live-code-example', 'overflow-hidden', 'rounded-md', 'border', 'border-line', 'bg-surface'], {
    dataLiveExample: '',
  }, [toolbar, editorGrid, footer]);
}

/** @type {HastPluginDefinition} */
const liveCodeBlocks = {
  name: 'live-code-blocks',
  element: {
    filter: ['pre'],
    visit(node, context) {
      const code = node.children?.find((child) => child.type === 'element' && child.tagName === 'code');
      const codeData = code?.data ?? {};
      const properties = { ...node.properties, ...code?.properties };
      const meta = String(codeData.meta ?? properties['data-fence-meta'] ?? properties['data-meta'] ?? properties.dataMeta ?? '');
      const hasLiveFlag = /(?:^|\s)live(?:\s|$)/.test(meta)
        || Object.hasOwn(properties, 'live')
        || properties['data-live'] === ''
        || properties['data-live'] === true
        || Object.hasOwn(properties, 'data-live-example');
      const classNames = code?.properties?.className ?? [];
      const languageToken = classNames.find((name) => name.startsWith('language-'));
      const sourceLanguage = String(
        codeData.lang ?? properties['data-language'] ?? properties.dataLanguage
          ?? languageToken?.slice('language-'.length) ?? '',
      ).toLowerCase();
      const language = supportedLanguages.get(sourceLanguage);

      if (!hasLiveFlag || !language || !code) return;

      const initialCode = context.textContent(code).replace(/\n$/, '');
      return makeLiveExample(language, initialCode);
    },
  },
};

export default liveCodeBlocks;
