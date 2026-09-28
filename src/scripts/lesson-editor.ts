import { autocompletion, completionKeymap } from '@codemirror/autocomplete';
import { defaultKeymap, history, historyKeymap } from '@codemirror/commands';
import { foldKeymap, foldGutter, indentOnInput, bracketMatching, HighlightStyle, LanguageSupport, syntaxHighlighting } from '@codemirror/language';
import { searchKeymap } from '@codemirror/search';
import { Compartment } from '@codemirror/state';
import { css } from '@codemirror/lang-css';
import { htmlCompletionSource, htmlLanguage } from '@codemirror/lang-html';
import { javascript } from '@codemirror/lang-javascript';
import { python } from '@codemirror/lang-python';
import { oneDark } from '@codemirror/theme-one-dark';
import { EditorView, drawSelection, dropCursor, highlightActiveLine, highlightActiveLineGutter, keymap, lineNumbers } from '@codemirror/view';
import { tags } from '@lezer/highlight';

const lessonHighlightStyle = HighlightStyle.define([
  { tag: tags.keyword, color: 'var(--accent)', fontWeight: '600' },
  { tag: [tags.tagName, tags.attributeName], color: 'var(--accent)' },
  { tag: [tags.string, tags.attributeValue], color: '#64804b' },
  { tag: [tags.number, tags.bool, tags.atom], color: '#8a6b36' },
  { tag: [tags.comment, tags.lineComment, tags.blockComment], color: 'var(--muted)', fontStyle: 'italic' },
  { tag: [tags.definition(tags.variableName), tags.definition(tags.propertyName), tags.typeName], color: 'var(--ink)' },
  { tag: tags.operator, color: 'var(--muted)' },
]);

let cleanupCurrentEditors: (() => void) | null = null;

type PyodideRuntime = {
  runPythonAsync(code: string): Promise<unknown>;
  setStdout(options: { batched: (text: string) => void }): void;
  setStderr(options: { batched: (text: string) => void }): void;
};

type PyodideWindow = Window & {
  loadPyodide?: (options: { indexURL: string }) => Promise<PyodideRuntime>;
};

const pyodideVersion = '314.0.7';
let pyodidePromise: Promise<PyodideRuntime> | undefined;
let pythonExecutionQueue: Promise<void> = Promise.resolve();

function loadPyodide(): Promise<PyodideRuntime> {
  const pyodideWindow = window as PyodideWindow;
  pyodidePromise ??= new Promise<void>((resolve, reject) => {
    if (pyodideWindow.loadPyodide) {
      resolve();
      return;
    }

    const script = document.createElement('script');
    script.src = `https://cdn.jsdelivr.net/pyodide/v${pyodideVersion}/full/pyodide.js`;
    script.async = true;
    script.onload = () => resolve();
    script.onerror = () => reject(new Error('Could not load the Python runtime. Check your connection and try again.'));
    document.head.append(script);
  }).then(() => {
    if (!pyodideWindow.loadPyodide) throw new Error('The Python runtime did not initialize.');
    return pyodideWindow.loadPyodide({
      indexURL: `https://cdn.jsdelivr.net/pyodide/v${pyodideVersion}/full/`,
    });
  });

  return pyodidePromise;
}

function showPythonOutput(frame: HTMLIFrameElement, output: string, isError = false) {
  const escaped = output.replace(/[&<>"']/g, (character) => ({
    '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;',
  })[character]!);
  const color = isError ? '#fca5a5' : '#f3f4f6';
  frame.srcdoc = `<!doctype html>
  <html><head><meta name="viewport" content="width=device-width,initial-scale=1"><style>
  :root { color-scheme: dark; scrollbar-color: #4b5563 #0b0d0f; }
  ::-webkit-scrollbar { width: 8px; background: #0b0d0f; }
  ::-webkit-scrollbar-thumb { background: #4b5563; border-radius: 4px; }
  </style></head>
  <body style="box-sizing:border-box;margin:0;min-height:100vh;overflow:auto;background:#0b0d0f;color:${color};font:13px/1.6 ui-monospace,SFMono-Regular,Menlo,monospace">
  <main style="box-sizing:border-box;min-height:100vh;padding:10px 12px">
  <pre style="margin:0;white-space:pre-wrap;font:inherit">${escaped || 'Code ran successfully.'}</pre></main></body></html>`;
}

function runPython(code: string, frame: HTMLIFrameElement, button: HTMLButtonElement) {
  const run = async () => {
    button.disabled = true;
    button.textContent = 'Loading Python…';
    showPythonOutput(frame, 'Starting Python runtime…');
    let stdout = '';
    let stderr = '';

    try {
      const pyodide = await loadPyodide();
      pyodide.setStdout({ batched: (line) => { stdout += `${line}\n`; } });
      pyodide.setStderr({ batched: (line) => { stderr += `${line}\n`; } });
      button.textContent = 'Running…';
      const result = await pyodide.runPythonAsync(code);
      const value = result == null ? '' : String(result);
      showPythonOutput(frame, `${stdout}${stderr}${!stdout && !stderr ? value : ''}`.trimEnd());
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error);
      showPythonOutput(frame, `${stdout}${stderr}${message}`.trimEnd(), true);
    } finally {
      button.disabled = false;
      button.innerHTML = 'Run <span>↗</span>';
    }
  };

  pythonExecutionQueue = pythonExecutionQueue.then(run, run);
}

export function destroyLessonEditor() {
  cleanupCurrentEditors?.();
  cleanupCurrentEditors = null;
}

export function setupLessonEditor() {
  destroyLessonEditor();
  const examples = [...document.querySelectorAll<HTMLElement>('[data-live-example]')];
  const cleanups: Array<() => void> = [];

  for (const example of examples) {
    const host = example.querySelector<HTMLElement>('[data-editor-host]');
    const frame = example.querySelector<HTMLIFrameElement>('[data-preview]');
    const runButton = example.querySelector<HTMLButtonElement>('[data-run]');
    const resetButton = example.querySelector<HTMLButtonElement>('[data-reset]');
    const copyButton = example.querySelector<HTMLButtonElement>('[data-copy]');
    if (!host || !frame || !runButton || !resetButton || !copyButton) continue;
    const previewFrame = frame;

    const language = host.dataset.language ?? 'html';
    const initialCode = host.dataset.initial ?? '';
    const languageSupport = language === 'css'
      ? css()
      : language === 'javascript'
        ? javascript()
        : language === 'python'
          ? python()
          : new LanguageSupport(htmlLanguage);
    const completion = autocompletion({
      activateOnTyping: false,
      ...(language === 'html' ? { override: [htmlCompletionSource] } : {}),
    });
    const colorScheme = window.matchMedia('(prefers-color-scheme: dark)');
    const themeConfig = new Compartment();

    function currentEditorTheme() {
      const preference = document.documentElement.dataset.theme ?? 'system';
      const dark = preference === 'dark' || (preference === 'system' && colorScheme.matches);

      if (dark) return [
        oneDark,
        syntaxHighlighting(lessonHighlightStyle, { fallback: true }),
        EditorView.theme({
          '.cm-selectionBackground': { backgroundColor: 'color-mix(in srgb, var(--accent) 36%, transparent) !important' },
          '&.cm-focused .cm-selectionBackground': { backgroundColor: 'color-mix(in srgb, var(--accent) 42%, transparent) !important' },
          '.cm-cursor': { borderLeftColor: 'var(--accent)' },
          '.cm-selectionMatch': { backgroundColor: 'color-mix(in srgb, var(--accent) 20%, transparent)' },
        }, { dark: true }),
      ];

      return [
        EditorView.theme({
          '&': { backgroundColor: 'var(--code)', color: 'var(--ink)', fontSize: '13px' },
          '.cm-scroller': { fontFamily: 'ui-monospace, SFMono-Regular, Menlo, monospace' },
          '.cm-gutters': { backgroundColor: 'var(--code)', border: 'none', color: 'var(--faint)' },
          '.cm-activeLineGutter': { backgroundColor: 'transparent' },
          '.cm-activeLine': { backgroundColor: 'color-mix(in srgb, var(--accent) 5%, transparent)' },
          '.cm-selectionBackground': { backgroundColor: 'color-mix(in srgb, var(--accent) 22%, transparent)' },
          '.cm-cursor': { borderLeftColor: 'var(--accent)' },
          '&.cm-focused': { outline: 'none' },
        }),
        syntaxHighlighting(lessonHighlightStyle, { fallback: true }),
      ];
    }

    function run(code: string) {
      if (language === 'javascript') {
        const safeCode = code.replaceAll('<', '\\x3c');
        previewFrame.srcdoc = `<!doctype html><html><body><pre id="result" style="font:14px ui-monospace,monospace;color:#444;white-space:pre-wrap"></pre><script>const result=document.getElementById('result');console.log=(...args)=>result.textContent+=args.join(' ')+'\\n';try{${safeCode}\\nif(!result.textContent)result.textContent='Code ran successfully.'}catch(error){result.textContent=error.message}<\\/script></body></html>`;
      } else if (language === 'css') {
        const safeCss = code.replace(/<\/style/gi, '<\\/style');
        previewFrame.srcdoc = `<!doctype html><html><head><style>body{font:16px system-ui,sans-serif;padding:16px;color:#222}${safeCss}</style></head><body><h1 class="welcome">Hello, CSS!</h1><p>Change the CSS to style this preview.</p><button class="welcome">Try a style</button></body></html>`;
      } else {
        previewFrame.srcdoc = code;
      }
    }

    const view = new EditorView({
      doc: initialCode,
      parent: host,
      extensions: [
        lineNumbers(),
        foldGutter(),
        drawSelection(),
        dropCursor(),
        indentOnInput(),
        bracketMatching(),
        highlightActiveLine(),
        highlightActiveLineGutter(),
        history(),
        completion,
        keymap.of([...defaultKeymap, ...historyKeymap, ...foldKeymap, ...searchKeymap, ...completionKeymap]),
        languageSupport,
        EditorView.lineWrapping,
        themeConfig.of(currentEditorTheme()),
        EditorView.updateListener.of((update) => {
          if (update.docChanged && (language === 'html' || language === 'css')) run(update.state.doc.toString());
        }),
      ],
    });
    const eventController = new AbortController();

    view.contentDOM.setAttribute('aria-label', host.getAttribute('aria-label') ?? 'Edit code');
    view.contentDOM.setAttribute('spellcheck', 'false');
    document.addEventListener('theme-change', () => {
      view.dispatch({ effects: themeConfig.reconfigure(currentEditorTheme()) });
    }, { signal: eventController.signal });
    colorScheme.addEventListener('change', () => {
      if ((document.documentElement.dataset.theme ?? 'system') === 'system') {
        view.dispatch({ effects: themeConfig.reconfigure(currentEditorTheme()) });
      }
    }, { signal: eventController.signal });
    if (language !== 'python') run(initialCode);
    else showPythonOutput(previewFrame, 'Press Run to execute this Python example.');
    runButton.addEventListener('click', () => {
      if (language === 'python') runPython(view.state.doc.toString(), previewFrame, runButton);
      else run(view.state.doc.toString());
    }, { signal: eventController.signal });
    resetButton.addEventListener('click', () => {
      view.dispatch({ changes: { from: 0, to: view.state.doc.length, insert: initialCode } });
      if (language !== 'python') run(initialCode);
    }, { signal: eventController.signal });
    copyButton.addEventListener('click', async () => {
      await navigator.clipboard.writeText(view.state.doc.toString());
      copyButton.textContent = 'Copied';
      window.setTimeout(() => { copyButton.textContent = 'Copy'; }, 1200);
    }, { signal: eventController.signal });

    cleanups.push(() => {
      eventController.abort();
      view.destroy();
    });
  }

  cleanupCurrentEditors = () => cleanups.forEach((cleanup) => cleanup());
}
