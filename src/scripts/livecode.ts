import { HighlightStyle, syntaxHighlighting } from '@codemirror/language';
import { css } from '@codemirror/lang-css';
import { html } from '@codemirror/lang-html';
import { javascript } from '@codemirror/lang-javascript';
import { python } from '@codemirror/lang-python';
import { oneDark } from '@codemirror/theme-one-dark';
import { EditorState } from '@codemirror/state';
import { EditorView, lineNumbers } from '@codemirror/view';
import { tags } from '@lezer/highlight';

type FileNode = { name: string; type: 'file' | 'directory'; size?: number; children?: FileNode[] };
type LiveEvent = { type?: string; path?: string };

const app = document.querySelector<HTMLElement>('[data-livecode]');
const status = document.querySelector<HTMLElement>('[data-connection-status]');
if (app && status) {
  const statusLabel = status.querySelector<HTMLElement>('[data-status-label]')!;
  const statusDetail = status.querySelector<HTMLElement>('[data-status-detail]')!;
  const tree = app.querySelector<HTMLElement>('[data-tree]')!;
  const rootLabel = app.querySelector<HTMLElement>('[data-root-label]')!;
  const treeCount = app.querySelector<HTMLElement>('[data-tree-count]')!;
  const refreshButton = app.querySelector<HTMLButtonElement>('[data-refresh]')!;
  const filePathLabel = app.querySelector<HTMLElement>('[data-file-path]')!;
  const fileMeta = app.querySelector<HTMLElement>('[data-file-meta]')!;
  const viewerEmpty = app.querySelector<HTMLElement>('[data-viewer-empty]')!;
  const code = app.querySelector<HTMLElement>('[data-code]')!;
  const viewerMessage = app.querySelector<HTMLElement>('[data-viewer-message]')!;
  const baseUrl = 'https://ws.gaurishhs.xyz';
  let socket: WebSocket | null = null;
  let reconnectTimer = 0;
  let requestId = 0;
  let fileRequestId = 0;
  let selectedPath: string | null = null;
  let editor: EditorView | null = null;
  let explicitlyStopped = false;

  const highlight = HighlightStyle.define([
    { tag: tags.keyword, color: '#c792ea' },
    { tag: [tags.string, tags.attributeValue], color: '#c3e88d' },
    { tag: [tags.number, tags.bool, tags.atom], color: '#f78c6c' },
    { tag: [tags.comment, tags.lineComment, tags.blockComment], color: '#697586', fontStyle: 'italic' },
    { tag: [tags.tagName, tags.typeName, tags.className], color: '#82aaff' },
    { tag: [tags.attributeName, tags.propertyName], color: '#f07178' },
    { tag: tags.operator, color: '#89ddff' },
    { tag: tags.variableName, color: '#d6deeb' },
  ]);
  const lightHighlight = HighlightStyle.define([
    { tag: tags.keyword, color: '#7c3aed' },
    { tag: [tags.string, tags.attributeValue], color: '#277a49' },
    { tag: [tags.number, tags.bool, tags.atom], color: '#b45309' },
    { tag: [tags.comment, tags.lineComment, tags.blockComment], color: '#8b9299', fontStyle: 'italic' },
    { tag: [tags.tagName, tags.typeName, tags.className], color: '#2563a6' },
    { tag: [tags.attributeName, tags.propertyName], color: '#b4234d' },
    { tag: tags.operator, color: '#087e8b' },
    { tag: tags.variableName, color: '#303943' },
  ]);
  const lightEditorTheme = EditorView.theme({
    '&': { backgroundColor: 'var(--lc-editor)', color: 'var(--lc-ink)' },
    '.cm-gutters': { backgroundColor: 'var(--lc-gutter)', color: 'var(--lc-gutter-ink)' },
    '.cm-activeLineGutter': { backgroundColor: 'transparent' },
    '.cm-activeLine': { backgroundColor: 'color-mix(in srgb, var(--lc-ink) 5%, transparent)' },
    '.cm-scroller': { fontFamily: 'ui-monospace, SFMono-Regular, Menlo, monospace' },
  });
  const isDarkTheme = () => {
    const theme = document.documentElement.dataset.theme ?? 'system';
    return theme === 'dark' || (theme === 'system' && window.matchMedia('(prefers-color-scheme: dark)').matches);
  };
  const languageForPath = (path: string) => {
    const ext = path.split('.').pop()?.toLowerCase();
    if (['html', 'htm', 'svg'].includes(ext ?? '')) return html();
    if (['css', 'scss'].includes(ext ?? '')) return css();
    if (['js', 'jsx', 'mjs', 'ts', 'tsx'].includes(ext ?? '')) return javascript({ typescript: ext === 'ts' || ext === 'tsx', jsx: ext === 'jsx' || ext === 'tsx' });
    if (ext === 'py') return python();
    if (ext === 'json') return javascript();
    return [];
  };

  const setStatus = (state: 'connecting' | 'connected' | 'reconnecting' | 'error', label: string, detail = '') => {
    status.dataset.state = state;
    statusLabel.textContent = label;
    statusDetail.textContent = detail;
  };
  const connectionError = (error: unknown) => {
    const message = error instanceof Error ? error.message : 'The request could not reach the server.';
    if (message === 'Failed to fetch' || message.includes('NetworkError')) {
      return `Can’t reach the API. Check the tunnel and allow ${window.location.origin} with the CLI --allow-origin option.`;
    }
    return message;
  };
  const makeNode = (node: FileNode, parentPath = ''): HTMLLIElement => {
    const item = document.createElement('li');
    item.className = 'lc-tree-item';
    const path = parentPath ? `${parentPath}/${node.name}` : node.name;
    const directory = node.type === 'directory';
    const row = document.createElement('button');
    row.type = 'button';
    row.className = `lc-tree-row${directory ? ' is-directory' : ' is-file'}`;
    row.dataset.path = directory ? '' : path;
    const caret = document.createElement('span');
    caret.className = 'lc-tree-caret';
    caret.textContent = directory ? '▾' : '';
    const icon = document.createElement('span');
    icon.className = 'lc-tree-icon';
    icon.textContent = directory ? '▰' : fileIcon(node.name);
    const name = document.createElement('span');
    name.className = 'lc-tree-name';
    name.textContent = node.name;
    row.append(caret, icon, name);
    if (!directory) {
      row.title = path;
      row.setAttribute('aria-current', String(path === selectedPath));
      row.addEventListener('click', () => void loadFile(path));
    }
    item.append(row);
    if (directory) {
      const children = document.createElement('ul');
      children.className = 'lc-tree-list';
      (node.children ?? []).forEach((child) => children.append(makeNode(child, path)));
      row.setAttribute('aria-expanded', 'true');
      row.addEventListener('click', () => {
        const expanded = row.getAttribute('aria-expanded') === 'true';
        row.setAttribute('aria-expanded', String(!expanded));
        children.hidden = expanded;
        caret.textContent = expanded ? '▸' : '▾';
      });
      item.append(children);
    }
    return item;
  };

  async function loadFile(path: string) {
    const refreshingVisibleFile = selectedPath === path && editor !== null;
    selectedPath = path;
    tree.querySelectorAll<HTMLButtonElement>('.lc-tree-row.is-file').forEach((row) => {
      row.setAttribute('aria-current', String(row.dataset.path === path));
    });
    const currentRequest = ++fileRequestId;
    filePathLabel.textContent = path;
    if (!refreshingVisibleFile) {
      fileMeta.textContent = 'LOADING';
      viewerMessage.textContent = 'Loading file…';
      viewerEmpty.hidden = true;
      code.hidden = false;
      code.textContent = 'Loading…';
      editor?.destroy();
      editor = null;
    }
    try {
      const response = await fetch(`${baseUrl}/api/file?path=${encodeURIComponent(path)}`);
      if (!response.ok) throw new Error(`File request failed (${response.status})`);
      const body = await response.text();
      if (currentRequest !== fileRequestId) return;
      let content = body;
      try {
        const parsed = JSON.parse(body) as { content?: unknown; text?: unknown };
        if (typeof parsed.content === 'string') content = parsed.content;
        else if (typeof parsed.text === 'string') content = parsed.text;
      } catch { /* File API may return plain text. */ }
      editor?.destroy();
      editor = null;
      code.replaceChildren();
      const dark = isDarkTheme();
      const extensions = [dark ? oneDark : lightEditorTheme, syntaxHighlighting(dark ? highlight : lightHighlight), languageForPath(path), EditorState.readOnly.of(true), EditorView.editable.of(false), EditorView.lineWrapping, lineNumbers()];
      editor = new EditorView({ state: EditorState.create({ doc: content, extensions }), parent: code });
      fileMeta.textContent = `${content.split('\n').length} LINES`;
      viewerMessage.textContent = 'File opened in read-only mode';
    } catch (error) {
      if (currentRequest !== fileRequestId) return;
      if (refreshingVisibleFile) {
        viewerMessage.textContent = `Refresh failed; showing the previous version. ${connectionError(error)}`;
        return;
      }
      editor?.destroy();
      editor = null;
      code.textContent = connectionError(error);
      fileMeta.textContent = 'ERROR';
      viewerMessage.textContent = 'Could not load file';
    }
  }
  const fileIcon = (name: string) => {
    const ext = name.split('.').pop()?.toLowerCase();
    if (['html', 'htm', 'svg'].includes(ext ?? '')) return '◇';
    if (['css', 'scss'].includes(ext ?? '')) return '◈';
    if (['js', 'jsx', 'ts', 'tsx'].includes(ext ?? '')) return '◉';
    if (['json', 'yaml', 'yml', 'toml'].includes(ext ?? '')) return '▤';
    if (['md', 'txt'].includes(ext ?? '')) return '≡';
    return '·';
  };

  async function loadTree() {
    const currentRequest = ++requestId;
    refreshButton.classList.add('is-loading');
    try {
      const response = await fetch(`${baseUrl}/api/tree`);
      if (!response.ok) throw new Error(`Tree request failed (${response.status})`);
      const data = await response.json() as FileNode | FileNode[] | { root?: FileNode; tree?: FileNode; name?: string; type?: string; children?: FileNode[] };
      if (currentRequest !== requestId) return;
      let nodes: FileNode[];
      let name = 'PROJECT FILES';
      if (Array.isArray(data)) nodes = data;
      else if (data.type === 'directory') { name = data.name || name; nodes = data.children ?? []; }
      else {
        const root = data.root ?? data.tree;
        name = root?.name || data.name || name;
        nodes = root?.children ?? data.children ?? [];
      }
      rootLabel.textContent = name.toUpperCase();
      const list = document.createElement('ul');
      list.className = 'lc-tree-list lc-tree-root';
      nodes.forEach((node) => list.append(makeNode(node)));
      if (!nodes.length) {
        const empty = document.createElement('div');
        empty.className = 'lc-empty-tree';
        const label = document.createElement('strong');
        label.textContent = 'This project is empty';
        empty.append(label);
        tree.replaceChildren(empty);
      } else tree.replaceChildren(list);
      treeCount.textContent = `${nodes.length} ${nodes.length === 1 ? 'item' : 'items'}`;
    } catch (error) {
      if (currentRequest !== requestId) return;
      setStatus('error', 'Connection issue', connectionError(error));
      const empty = document.createElement('div');
      empty.className = 'lc-empty-tree';
      const label = document.createElement('strong');
      label.textContent = 'Could not load project files';
      const detail = document.createElement('small');
      detail.textContent = connectionError(error);
      empty.append(label, detail);
      tree.replaceChildren(empty);
    } finally {
      if (currentRequest === requestId) refreshButton.classList.remove('is-loading');
    }
  }

  async function connect() {
    setStatus('connecting', 'Connecting', baseUrl);
    try {
      const response = await fetch(`${baseUrl}/api/health`);
      if (!response.ok) throw new Error(`Health check failed (${response.status})`);
      const result = await response.json() as { status?: string };
      if (result.status !== 'ok') throw new Error('Health check did not return status “ok”');
      void loadTree();
      openSocket();
    } catch (error) {
      setStatus('error', 'Connection issue', connectionError(error));
      window.clearTimeout(reconnectTimer);
      if (!explicitlyStopped) reconnectTimer = window.setTimeout(connect, 5000);
    }
  }

  function openSocket() {
    if (explicitlyStopped) return;
    const wsUrl = new URL(baseUrl);
    wsUrl.protocol = 'wss:';
    wsUrl.pathname = '/ws';
    const currentSocket = new WebSocket(wsUrl.toString());
    socket = currentSocket;
    currentSocket.addEventListener('open', () => {
      if (socket !== currentSocket) return;
      setStatus('connected', 'Connected', 'Live updates active');
      void loadTree();
    });
    currentSocket.addEventListener('message', (event) => {
      if (socket !== currentSocket) return;
      try {
        const update = JSON.parse(String(event.data)) as LiveEvent;
        if (update.type === 'modified' && update.path === selectedPath && selectedPath) void loadFile(selectedPath);
        if (update.type === 'deleted' && update.path === selectedPath) {
          selectedPath = null;
          editor?.destroy();
          editor = null;
          code.hidden = true;
          viewerEmpty.hidden = false;
          filePathLabel.textContent = 'Selected file was deleted';
          fileMeta.textContent = '';
          viewerMessage.textContent = 'The selected file is no longer available';
        }
        if (['created', 'deleted', 'renamed'].includes(update.type ?? '')) void loadTree();
      } catch { /* Ignore malformed events and keep the connection open. */ }
    });
    currentSocket.addEventListener('close', () => {
      if (socket !== currentSocket || explicitlyStopped) return;
      setStatus('reconnecting', 'Reconnecting', 'Retrying in a few seconds…');
      window.clearTimeout(reconnectTimer);
      reconnectTimer = window.setTimeout(connect, 3000);
    });
    currentSocket.addEventListener('error', () => currentSocket.close());
  }

  refreshButton.addEventListener('click', () => void loadTree());
  document.addEventListener('theme-change', () => {
    if (selectedPath) void loadFile(selectedPath);
  });
  void connect();
}
