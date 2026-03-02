'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import { useParams, useSearchParams } from 'next/navigation';
import { EditorContent, useEditor } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import { FontFamily, FontSize, TextStyle } from '@tiptap/extension-text-style';
import Underline from '@tiptap/extension-underline';
import TextAlign from '@tiptap/extension-text-align';
import Placeholder from '@tiptap/extension-placeholder';

const FONT_OPTIONS = [
  'Roboto',
  'Arial',
  'Georgia',
  'Times New Roman',
  'Trebuchet MS',
  'Courier New',
];

const FONT_STACKS = {
  Roboto: "'Roboto', Arial, Helvetica, sans-serif",
  Arial: 'Arial, Helvetica, sans-serif',
  Georgia: "Georgia, 'Times New Roman', serif",
  'Times New Roman': "'Times New Roman', Times, serif",
  'Trebuchet MS': "'Trebuchet MS', Helvetica, sans-serif",
  'Courier New': "'Courier New', Courier, monospace",
};

const MIN_FONT_SIZE = 12;
const MAX_FONT_SIZE = 72;
const DEFAULT_FONT_SIZE = 15;

const DEFAULT_MESSAGE = `Hello member,

Thank you for your reimbursement submission.
To proceed, please provide the additional required documents.

Our team will continue processing once all requirements are complete.`;

function toEditorHtml(plainText) {
  const normalized = plainText.replace(/\r/g, '');
  if (!normalized) return '<p></p>';

  return normalized
    .split('\n')
    .map((line) => `<p>${line ? escapeHtml(line) : '<br />'}</p>`)
    .join('');
}

function normalizeEditorText(value) {
  return value.replace(/\r/g, '').replace(/\u00a0/g, ' ');
}

function applyTemplate(content, templateVariables) {
  return content.replace(/{{\s*([a-z0-9_.]+)\s*}}/gi, (match, key) => {
    return Object.prototype.hasOwnProperty.call(templateVariables, key)
      ? templateVariables[key]
      : match;
  });
}

function applyTemplateToRichHtml(contentHtml, fallbackText, templateVariables) {
  if (typeof window === 'undefined') {
    return toEditorHtml(applyTemplate(fallbackText, templateVariables));
  }

  const root = document.createElement('div');
  root.innerHTML = contentHtml;

  const walker = document.createTreeWalker(root, window.NodeFilter.SHOW_TEXT);
  const textNodes = [];

  for (let node = walker.nextNode(); node; node = walker.nextNode()) {
    textNodes.push(node);
  }

  textNodes.forEach((textNode) => {
    textNode.textContent = applyTemplate(textNode.textContent || '', templateVariables);
  });

  return root.innerHTML;
}

function escapeHtml(value) {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

function withApiBase(path) {
  const base = (process.env.NEXT_PUBLIC_API_BASE_URL || '').trim();
  if (!base) return path;
  return `${base.replace(/\/+$/, '')}${path}`;
}

function clampFontSize(value) {
  return Math.max(MIN_FONT_SIZE, Math.min(MAX_FONT_SIZE, value));
}

function parseFontSize(value) {
  if (!value) return DEFAULT_FONT_SIZE;
  const parsed = Number.parseInt(String(value).replace(/[^\d]/g, ''), 10);
  return Number.isFinite(parsed) ? clampFontSize(parsed) : DEFAULT_FONT_SIZE;
}

function resolveFontOption(fontFamily) {
  if (!fontFamily) return 'Roboto';

  const match = Object.entries(FONT_STACKS).find(([, stack]) => stack === fontFamily);
  return match ? match[0] : 'Roboto';
}

function resolveTextAlign(editor) {
  if (editor.isActive({ textAlign: 'center' })) return 'center';
  if (editor.isActive({ textAlign: 'right' })) return 'right';
  return 'left';
}

export default function ClientCareReimbursementComposerPage() {
  const params = useParams();
  const searchParams = useSearchParams();
  const savedSelectionRef = useRef(null);

  const reimburseFormId = Array.isArray(params?.reimburseFormId)
    ? params.reimburseFormId[0]
    : params?.reimburseFormId;

  const signature = searchParams.get('signature') || '';
  const expires = searchParams.get('expires') || '';

  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState('');
  const [sendResult, setSendResult] = useState('');
  const [payload, setPayload] = useState(null);

  const [recipientEmail, setRecipientEmail] = useState('');
  const [subject, setSubject] = useState('LLIBI - Additional Reimbursement Documents Needed');
  const [message, setMessage] = useState(DEFAULT_MESSAGE);
  const [messageHtml, setMessageHtml] = useState(() => toEditorHtml(DEFAULT_MESSAGE));
  const [fontFamily, setFontFamily] = useState('Roboto');
  const [fontSize, setFontSize] = useState(DEFAULT_FONT_SIZE);
  const [fontSizeInput, setFontSizeInput] = useState(String(DEFAULT_FONT_SIZE));
  const [isBold, setIsBold] = useState(false);
  const [isItalic, setIsItalic] = useState(false);
  const [isUnderline, setIsUnderline] = useState(false);
  const [isBulletList, setIsBulletList] = useState(false);
  const [isOrderedList, setIsOrderedList] = useState(false);
  const [textAlign, setTextAlign] = useState('left');

  function syncToolbarState(editorInstance) {
    const textStyleAttrs = editorInstance.getAttributes('textStyle') || {};
    const nextFont = resolveFontOption(textStyleAttrs.fontFamily);
    const nextSize = parseFontSize(textStyleAttrs.fontSize);

    setFontFamily(nextFont);
    setFontSize(nextSize);
    setFontSizeInput(String(nextSize));
    setIsBold(editorInstance.isActive('bold'));
    setIsItalic(editorInstance.isActive('italic'));
    setIsUnderline(editorInstance.isActive('underline'));
    setIsBulletList(editorInstance.isActive('bulletList'));
    setIsOrderedList(editorInstance.isActive('orderedList'));
    setTextAlign(resolveTextAlign(editorInstance));
  }

  function captureSelection(editorInstance) {
    if (!editorInstance) return;
    const { from, to } = editorInstance.state.selection;
    savedSelectionRef.current = { from, to };
  }

  const editor = useEditor({
    immediatelyRender: false,
    extensions: [
      StarterKit.configure({
        heading: false,
        codeBlock: false,
        horizontalRule: false,
      }),
      TextStyle.configure({ mergeNestedSpanStyles: true }),
      FontFamily.configure({ types: ['textStyle'] }),
      FontSize.configure({ types: ['textStyle'] }),
      Underline,
      TextAlign.configure({ types: ['paragraph'], alignments: ['left', 'center', 'right'] }),
      Placeholder.configure({ placeholder: 'Write your message with placeholders...' }),
    ],
    content: messageHtml,
    editorProps: {
      attributes: {
        class: 'composer-editor-content',
      },
      handlePaste(view, event) {
        const plainText = event.clipboardData?.getData('text/plain');
        if (!plainText) return false;

        event.preventDefault();
        view.dispatch(view.state.tr.insertText(plainText));
        return true;
      },
    },
    onCreate: ({ editor: editorInstance }) => {
      const initialText = normalizeEditorText(editorInstance.getText({ blockSeparator: '\n' }));
      setMessage(initialText);
      setMessageHtml(editorInstance.getHTML() || '<p></p>');
      captureSelection(editorInstance);
      syncToolbarState(editorInstance);
    },
    onUpdate: ({ editor: editorInstance }) => {
      setMessage(normalizeEditorText(editorInstance.getText({ blockSeparator: '\n' })));
      setMessageHtml(editorInstance.getHTML() || '<p></p>');
      captureSelection(editorInstance);
      syncToolbarState(editorInstance);
    },
    onSelectionUpdate: ({ editor: editorInstance }) => {
      captureSelection(editorInstance);
      syncToolbarState(editorInstance);
    },
    onBlur: ({ editor: editorInstance }) => {
      captureSelection(editorInstance);
    },
  });

  function chainWithSavedSelection() {
    if (!editor) return null;

    let chain = editor.chain().focus();
    const savedSelection = savedSelectionRef.current;

    if (
      savedSelection &&
      Number.isInteger(savedSelection.from) &&
      Number.isInteger(savedSelection.to)
    ) {
      chain = chain.setTextSelection(savedSelection);
    }

    return chain;
  }

  function runEditorCommand(buildCommand) {
    if (!editor) return false;

    let didRun = buildCommand(editor.chain().focus()).run();
    if (!didRun) {
      const chain = chainWithSavedSelection();
      if (chain) {
        didRun = buildCommand(chain).run();
      }
    }
    if (!didRun) return false;

    captureSelection(editor);
    syncToolbarState(editor);
    return true;
  }

  function preserveSelectionMouseDown(event) {
    event.preventDefault();
    captureSelection(editor);
  }

  function applyFontSize(size) {
    const parsed = Number(size);
    if (!Number.isFinite(parsed)) return;

    const nextSize = clampFontSize(parsed);
    setFontSize(nextSize);
    setFontSizeInput(String(nextSize));

    runEditorCommand((chain) => chain.setFontSize(`${nextSize}px`));
  }

  function nudgeFontSize(delta) {
    applyFontSize(fontSize + delta);
  }

  function adjustTextIndentBySpaces(direction) {
    const INDENT_TOKEN = '\u00a0\u00a0\u00a0\u00a0';
    const OUTDENT_PATTERN = /^(?:\u00a0| ){1,4}/;

    runEditorCommand((chain) =>
      chain.command(({ state, tr, dispatch }) => {
        const textBlockPositions = [];
        const seen = new Set();
        const { from, to, empty, $from } = state.selection;

        if (empty) {
          for (let depth = $from.depth; depth > 0; depth -= 1) {
            const node = $from.node(depth);
            if (!node.isTextblock) continue;
            textBlockPositions.push($from.before(depth));
            break;
          }
        } else {
          state.doc.nodesBetween(from, to, (node, pos) => {
            if (!node.isTextblock || seen.has(pos)) return;
            seen.add(pos);
            textBlockPositions.push(pos);
          });
        }

        if (!textBlockPositions.length) return false;

        let changed = false;
        textBlockPositions
          .sort((a, b) => b - a)
          .forEach((pos) => {
            const node = tr.doc.nodeAt(pos);
            if (!node || !node.isTextblock) return;

            const start = pos + 1;
            const text = node.textContent || '';

            if (direction > 0) {
              tr.insertText(INDENT_TOKEN, start);
              changed = true;
              return;
            }

            const match = text.match(OUTDENT_PATTERN);
            if (match) {
              tr.delete(start, start + match[0].length);
              changed = true;
            }
          });

        if (!changed) return false;
        if (dispatch) dispatch(tr);
        return true;
      })
    );
  }

  function indentSelection() {
    if (!editor) return;

    const inList = editor.isActive('bulletList') || editor.isActive('orderedList');
    const didIndentList = inList ? runEditorCommand((chain) => chain.sinkListItem('listItem')) : false;

    if (!didIndentList) {
      adjustTextIndentBySpaces(1);
    }
  }

  function outdentSelection() {
    if (!editor) return;

    const inList = editor.isActive('bulletList') || editor.isActive('orderedList');
    const didOutdentList = inList ? runEditorCommand((chain) => chain.liftListItem('listItem')) : false;

    if (!didOutdentList) {
      adjustTextIndentBySpaces(-1);
    }
  }

  function insertVariable(variableKey) {
    const token = `{{${variableKey}}}`;

    if (!editor) {
      const nextMessage = `${message}${token}`;
      setMessage(nextMessage);
      setMessageHtml(toEditorHtml(nextMessage));
      return;
    }

    runEditorCommand((chain) => chain.insertContent(token));
  }

  async function handleSend() {
    setSendResult('');
    setError('');

    if (!recipientEmail.trim()) {
      setError('Recipient email is required.');
      return;
    }

    const editorText = editor
      ? normalizeEditorText(editor.getText({ blockSeparator: '\n' }))
      : message;
    const editorHtml = editor ? editor.getHTML() : messageHtml;

    if (!subject.trim() || !editorText.trim()) {
      setError('Subject and message are required.');
      return;
    }

    setSending(true);
    try {
      const endpoint = withApiBase(`/api/reimbursement/client-care/${encodeURIComponent(reimburseFormId)}/send-email`);
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          signature,
          expires: Number(expires),
          recipient_email: recipientEmail.trim(),
          subject: subject.trim(),
          content: editorText,
          content_html: editorHtml,
        }),
      });

      const json = await response.json();
      if (!response.ok || !json.success) {
        const details = json?.details?.unknown_variables?.length
          ? ` Unknown variables: ${json.details.unknown_variables.join(', ')}`
          : '';
        setError(`${json.error || 'Failed to send email.'}${details}`);
        return;
      }

      setMessage(editorText);
      setSendResult(`Email sent to ${json.data.recipient_email}`);
    } catch (sendError) {
      setError(`Failed to send email: ${sendError.message}`);
    } finally {
      setSending(false);
    }
  }

  const canUndo = editor?.can().chain().focus().undo().run() ?? false;
  const canRedo = editor?.can().chain().focus().redo().run() ?? false;

  const templateVariables = payload?.template_variables || {};
  const variableKeys = useMemo(() => Object.keys(templateVariables).sort(), [templateVariables]);

  const previewHtml = useMemo(
    () => applyTemplateToRichHtml(messageHtml, message, templateVariables),
    [messageHtml, message, templateVariables]
  );

  useEffect(() => {
    async function loadData() {
      if (!reimburseFormId || !signature || !expires) {
        setError('Missing signed parameters. Please use the original email link.');
        setLoading(false);
        return;
      }

      setLoading(true);
      setError('');

      try {
        const endpoint = withApiBase(
          `/api/reimbursement/client-care/${encodeURIComponent(reimburseFormId)}?signature=${encodeURIComponent(
            signature
          )}&expires=${encodeURIComponent(expires)}`
        );

        const response = await fetch(endpoint, { method: 'GET' });
        const json = await response.json();

        if (!response.ok || !json.success) {
          setError(json.error || 'Unable to load reimbursement details.');
          setLoading(false);
          return;
        }

        setPayload(json.data);
        setRecipientEmail(json.data?.reimbursement?.email_address || '');
        setSubject(json.data?.suggested_subject || 'LLIBI - Additional Reimbursement Documents Needed');
      } catch (fetchError) {
        setError(`Failed to load data: ${fetchError.message}`);
      } finally {
        setLoading(false);
      }
    }

    loadData();
  }, [reimburseFormId, signature, expires]);

  if (loading) {
    return (
      <main style={{ ...styles.page, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ ...styles.loadingContainer, padding: '50px 60px', overflow: 'hidden', position: 'relative' }}>
          <div className="animation-container">
            <div className="paper-plane">
              <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#1e3161" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="m22 2-7 20-4-9-9-4Z" />
                <path d="M22 2 11 13" />
              </svg>
            </div>
            <div className="cloud c1" />
            <div className="cloud c2" />
            <div className="cloud c3" />
          </div>
          <p style={{ ...styles.loadingText, marginTop: '20px', fontSize: '18px' }}>
            Training our carrier pigeons...
          </p>
          <style jsx>{`
            .animation-container {
              position: relative;
              width: 100px;
              height: 80px;
              display: flex;
              align-items: center;
              justify-content: center;
            }
            .paper-plane {
              animation: fly 2s ease-in-out infinite;
              z-index: 2;
            }
            .cloud {
              position: absolute;
              background: #e2e8f0;
              border-radius: 20px;
              opacity: 0.6;
              height: 10px;
              animation: cloud-move 3s linear infinite;
            }
            .c1 { width: 30px; top: 10px; right: -20px; animation-delay: 0s; }
            .c2 { width: 45px; bottom: 15px; right: -40px; animation-delay: 1s; }
            .c3 { width: 25px; top: 40px; right: -30px; animation-delay: 2s; }

            @keyframes fly {
              0%, 100% { transform: translateY(0) rotate(0deg); }
              25% { transform: translateY(-10px) rotate(-5deg); }
              75% { transform: translateY(10px) rotate(5deg); }
            }
            @keyframes cloud-move {
              from { transform: translateX(50px); opacity: 0; }
              20% { opacity: 0.6; }
              80% { opacity: 0.6; }
              to { transform: translateX(-150px); opacity: 0; }
            }
          `}</style>
        </div>
      </main>
    );
  }

  if (error && !payload) {
    return (
      <main style={styles.page}>
        <div style={styles.cardError}>{error}</div>
      </main>
    );
  }

  return (
    <main style={styles.page}>
      <div className="composer-layout" style={styles.layout}>
        <section style={styles.card}>
          <h1 style={styles.title}>Compose Lacking Documents Email</h1>
          <p style={styles.subtitle}>
            Reference: <strong>{payload?.reimbursement?.reimburse_form_id}</strong>
          </p>

          <div style={styles.row}>
            <label style={styles.label}>Recipient Email</label>
            <input
              style={{ ...styles.input, background: '#f1f5f9', cursor: 'default' }}
              value={recipientEmail}
              readOnly
              placeholder="member@email.com"
            />
          </div>

          <div style={styles.row}>
            <label style={styles.label}>Subject</label>
            <input
              style={{ ...styles.input, background: '#f1f5f9', cursor: 'default' }}
              value={subject}
              readOnly
              placeholder="Email subject"
            />
          </div>

          {/* Rich-text toolbar hidden
          <div className="composer-controls" style={styles.controls}>
            <div className="toolbar-top" style={styles.toolbarTopRow}>
              <div style={styles.toolbarField}>
                <label style={styles.label}>Font Family</label>
                <select
                  className="toolbar-select"
                  style={styles.select}
                  value={fontFamily}
                  title="Choose font family for selected text"
                  onPointerDown={() => captureSelection(editor)}
                  onChange={(e) => {
                    const nextFont = e.target.value;
                    setFontFamily(nextFont);
                    runEditorCommand((chain) =>
                      chain.setFontFamily(FONT_STACKS[nextFont] || FONT_STACKS.Roboto)
                    );
                  }}
                  disabled={!editor}
                >
                  {FONT_OPTIONS.map((font) => (
                    <option key={font} value={font}>
                      {font}
                    </option>
                  ))}
                </select>
              </div>

              <div style={styles.toolbarField}>
                <label style={styles.label}>Font Size (12-72px)</label>
                <div style={styles.fontSizeRow}>
                  <button
                    type="button"
                    className="toolbar-action"
                    style={styles.smallControlButton}
                    title="Decrease selected text size"
                    aria-label="Decrease font size"
                    onMouseDown={preserveSelectionMouseDown}
                    onClick={() => nudgeFontSize(-1)}
                    disabled={!editor}
                  >
                    -
                  </button>

                  <input
                    className="toolbar-input"
                    style={styles.fontSizeInput}
                    type="text"
                    inputMode="numeric"
                    title="Set selected text size in pixels, then press Enter"
                    value={fontSizeInput}
                    onPointerDown={() => captureSelection(editor)}
                    onChange={(e) => {
                      const rawValue = e.target.value.replace(/[^\d]/g, '');
                      setFontSizeInput(rawValue);
                    }}
                    onBlur={(e) => {
                      const rawValue = e.target.value.replace(/[^\d]/g, '');
                      if (!rawValue) {
                        setFontSizeInput(String(fontSize));
                        return;
                      }
                      applyFontSize(rawValue);
                    }}
                    onKeyDown={(e) => {
                      if (e.key !== 'Enter') return;
                      e.preventDefault();
                      applyFontSize(e.currentTarget.value);
                    }}
                    disabled={!editor}
                  />

                  <button
                    type="button"
                    className="toolbar-action"
                    style={styles.smallControlButton}
                    title="Increase selected text size"
                    aria-label="Increase font size"
                    onMouseDown={preserveSelectionMouseDown}
                    onClick={() => nudgeFontSize(1)}
                    disabled={!editor}
                  >
                    +
                  </button>
                </div>
              </div>

              <div style={styles.toolbarField}>
                <label style={styles.label}>Indentation</label>
                <div style={styles.indentRow}>
                  <button
                    type="button"
                    className="toolbar-action"
                    style={styles.indentControlButton}
                    title="Indent by 4 spaces"
                    onMouseDown={preserveSelectionMouseDown}
                    onClick={indentSelection}
                    aria-label="Increase list indentation"
                    disabled={!editor}
                  >
                    Indent
                  </button>

                  <button
                    type="button"
                    className="toolbar-action"
                    style={styles.indentControlButton}
                    title="Outdent by removing up to 4 leading spaces"
                    onMouseDown={preserveSelectionMouseDown}
                    onClick={outdentSelection}
                    aria-label="Decrease list indentation"
                    disabled={!editor}
                  >
                    Outdent
                  </button>
                </div>
              </div>
            </div>

            <div className="toolbar-groups" style={styles.toolbarGroups}>
              <div style={styles.toolbarGroup}>
                <p style={styles.toolbarGroupLabel}>Style</p>
                <div style={styles.toolbarButtonRow}>
                  <button
                    type="button"
                    className="toolbar-action"
                    style={{ ...styles.toolbarButton, ...(isBold ? styles.toolbarButtonActive : null) }}
                    title="Bold (Ctrl+B)"
                    onMouseDown={preserveSelectionMouseDown}
                    onClick={() => runEditorCommand((chain) => chain.toggleBold())}
                    aria-label="Toggle bold"
                    aria-pressed={isBold}
                    disabled={!editor}
                  >
                    B
                  </button>

                  <button
                    type="button"
                    className="toolbar-action"
                    style={{ ...styles.toolbarButton, ...(isItalic ? styles.toolbarButtonActive : null) }}
                    title="Italic (Ctrl+I)"
                    onMouseDown={preserveSelectionMouseDown}
                    onClick={() => runEditorCommand((chain) => chain.toggleItalic())}
                    aria-label="Toggle italic"
                    aria-pressed={isItalic}
                    disabled={!editor}
                  >
                    I
                  </button>

                  <button
                    type="button"
                    className="toolbar-action"
                    style={{ ...styles.toolbarButton, ...(isUnderline ? styles.toolbarButtonActive : null) }}
                    title="Underline (Ctrl+U)"
                    onMouseDown={preserveSelectionMouseDown}
                    onClick={() => runEditorCommand((chain) => chain.toggleUnderline())}
                    aria-label="Toggle underline"
                    aria-pressed={isUnderline}
                    disabled={!editor}
                  >
                    U
                  </button>
                </div>
              </div>

              <div style={styles.toolbarGroup}>
                <p style={styles.toolbarGroupLabel}>Lists</p>
                <div style={styles.toolbarButtonRow}>
                  <button
                    type="button"
                    className="toolbar-action"
                    style={{ ...styles.toolbarButton, ...(isBulletList ? styles.toolbarButtonActive : null) }}
                    title="Bulleted list"
                    onMouseDown={preserveSelectionMouseDown}
                    onClick={() => runEditorCommand((chain) => chain.toggleBulletList())}
                    aria-label="Toggle bullet list"
                    aria-pressed={isBulletList}
                    disabled={!editor}
                  >
                    UL
                  </button>

                  <button
                    type="button"
                    className="toolbar-action"
                    style={{ ...styles.toolbarButton, ...(isOrderedList ? styles.toolbarButtonActive : null) }}
                    title="Numbered list"
                    onMouseDown={preserveSelectionMouseDown}
                    onClick={() => runEditorCommand((chain) => chain.toggleOrderedList())}
                    aria-label="Toggle numbered list"
                    aria-pressed={isOrderedList}
                    disabled={!editor}
                  >
                    OL
                  </button>
                </div>
              </div>

              <div style={styles.toolbarGroup}>
                <p style={styles.toolbarGroupLabel}>Alignment</p>
                <div style={styles.toolbarButtonRow}>
                  <button
                    type="button"
                    className="toolbar-action"
                    style={{ ...styles.toolbarButton, ...(textAlign === 'left' ? styles.toolbarButtonActive : null) }}
                    title="Align left"
                    onMouseDown={preserveSelectionMouseDown}
                    onClick={() => runEditorCommand((chain) => chain.setTextAlign('left'))}
                    aria-label="Align left"
                    aria-pressed={textAlign === 'left'}
                    disabled={!editor}
                  >
                    L
                  </button>

                  <button
                    type="button"
                    className="toolbar-action"
                    style={{ ...styles.toolbarButton, ...(textAlign === 'center' ? styles.toolbarButtonActive : null) }}
                    title="Align center"
                    onMouseDown={preserveSelectionMouseDown}
                    onClick={() => runEditorCommand((chain) => chain.setTextAlign('center'))}
                    aria-label="Align center"
                    aria-pressed={textAlign === 'center'}
                    disabled={!editor}
                  >
                    C
                  </button>

                  <button
                    type="button"
                    className="toolbar-action"
                    style={{ ...styles.toolbarButton, ...(textAlign === 'right' ? styles.toolbarButtonActive : null) }}
                    title="Align right"
                    onMouseDown={preserveSelectionMouseDown}
                    onClick={() => runEditorCommand((chain) => chain.setTextAlign('right'))}
                    aria-label="Align right"
                    aria-pressed={textAlign === 'right'}
                    disabled={!editor}
                  >
                    R
                  </button>
                </div>
              </div>

              <div style={styles.toolbarGroup}>
                <p style={styles.toolbarGroupLabel}>History</p>
                <div style={styles.toolbarButtonRow}>
                  <button
                    type="button"
                    className="toolbar-action"
                    style={{ ...styles.toolbarButton, ...styles.toolbarButtonWide }}
                    title="Undo last change"
                    onMouseDown={preserveSelectionMouseDown}
                    onClick={() => runEditorCommand((chain) => chain.undo())}
                    aria-label="Undo"
                    disabled={!editor || !canUndo}
                  >
                    Undo
                  </button>

                  <button
                    type="button"
                    className="toolbar-action"
                    style={{ ...styles.toolbarButton, ...styles.toolbarButtonWide }}
                    title="Redo last undone change"
                    onMouseDown={preserveSelectionMouseDown}
                    onClick={() => runEditorCommand((chain) => chain.redo())}
                    aria-label="Redo"
                    disabled={!editor || !canRedo}
                  >
                    Redo
                  </button>
                </div>
              </div>
            </div>
          </div>
          Rich-text toolbar hidden */}

          <div style={styles.row}>
            <label style={styles.label}>Message</label>
            <div style={styles.editorShell}>
              <EditorContent editor={editor} className="composer-editor" />
            </div>
          </div>

          {/* Variable insertion hidden
          <div style={styles.variableSection}>
            <p style={styles.variableLabel}>Insert variable (strict format)</p>
            <div style={styles.variableWrap}>
              {variableKeys.map((key) => (
                <button
                  key={key}
                  type="button"
                  style={styles.variableButton}
                  title={`Insert {{${key}}}`}
                  onMouseDown={preserveSelectionMouseDown}
                  onClick={() => insertVariable(key)}
                >
                  {`{{${key}}}`}
                </button>
              ))}
            </div>
          </div>
          */}

          {error ? <p style={styles.errorText}>{error}</p> : null}
          {sendResult ? <p style={styles.successText}>{sendResult}</p> : null}

          <button type="button" style={styles.sendButton} onClick={handleSend} disabled={sending}>
            {sending ? 'Sending...' : 'Send Email'}
          </button>
        </section>

        <section style={styles.previewCard}>
          <h2 style={styles.previewTitle}>Preview</h2>
          <div style={styles.previewShell}>
            <div style={styles.previewHeader}>
              <h3 style={styles.previewHeaderTitle}>Insufficient/Deficient Claims Document</h3>
            </div>

            <div style={styles.previewBody}>
              <p style={styles.previewMeta}>Dear Valued Member,</p>
              <p style={styles.previewMeta}>Please review the message below from our claims team.</p>

              <div style={styles.previewDetails}>
                <p>
                  <strong>Reference:</strong> {payload?.reimbursement?.reimburse_form_id}
                </p>
                <p>
                  <strong>Member ID:</strong> {payload?.reimbursement?.member_id}
                </p>
                <p>
                  <strong>Requirement Type:</strong> {payload?.reimbursement?.requirement_type}
                </p>
                <p>
                  <strong>Files Submitted:</strong> {payload?.reimbursement?.files_count}
                </p>
              </div>

              <div
                className="preview-message-html"
                style={styles.previewMessage}
                dangerouslySetInnerHTML={{ __html: previewHtml }}
              />
            </div>
          </div>
        </section>
      </div>

      <style jsx>{`
        @media (max-width: 1024px) {
          .composer-layout {
            grid-template-columns: 1fr !important;
          }

          .toolbar-top {
            grid-template-columns: 1fr !important;
          }

          .toolbar-groups {
            grid-template-columns: repeat(2, minmax(0, 1fr)) !important;
          }
        }

        @media (max-width: 768px) {
          .toolbar-groups {
            grid-template-columns: 1fr !important;
          }
        }

        .toolbar-action,
        .toolbar-select,
        .toolbar-input {
          transition: background-color 0.16s ease, border-color 0.16s ease, color 0.16s ease, transform 0.16s ease;
        }

        .toolbar-action:hover:not(:disabled) {
          background: #f0f5ff !important;
          border-color: #9cb7ea !important;
          color: #1e3a8a !important;
          transform: translateY(-1px);
        }

        .toolbar-action:disabled,
        .toolbar-select:disabled,
        .toolbar-input:disabled {
          opacity: 0.55;
          cursor: not-allowed;
        }

        .composer-editor :global(.composer-editor-content) {
          min-height: 196px;
          outline: none;
          white-space: pre-wrap;
          word-break: break-word;
        }

        .composer-editor :global(.composer-editor-content p) {
          margin: 0 0 8px 0;
        }

        .composer-editor :global(.composer-editor-content p:last-child) {
          margin-bottom: 0;
        }

        .composer-editor :global(.composer-editor-content p.is-editor-empty:first-child::before) {
          content: attr(data-placeholder);
          color: #98a2b3;
          float: left;
          height: 0;
          pointer-events: none;
        }

        .composer-editor :global(.composer-editor-content ul),
        .composer-editor :global(.composer-editor-content ol),
        .preview-message-html :global(ul),
        .preview-message-html :global(ol) {
          margin: 0 0 10px 0;
          padding-left: 1.45rem;
        }

        .composer-editor :global(.composer-editor-content ul),
        .preview-message-html :global(ul) {
          list-style: disc;
        }

        .composer-editor :global(.composer-editor-content ol),
        .preview-message-html :global(ol) {
          list-style: decimal;
        }

        .composer-editor :global(.composer-editor-content li),
        .preview-message-html :global(li) {
          margin: 2px 0;
        }
      `}</style>
    </main>
  );
}

const styles = {
  page: {
    minHeight: '100vh',
    background: 'linear-gradient(135deg, #eef3fb 0%, #f8fafc 100%)',
    padding: '24px',
    color: '#1d2939',
    fontFamily: "'Trebuchet MS', Helvetica, sans-serif",
    overflowX: 'hidden',
  },
  layout: {
    maxWidth: '1280px',
    margin: '0 auto',
    display: 'grid',
    gridTemplateColumns: '1.15fr 1fr',
    gap: '20px',
    minWidth: 0,
  },
  card: {
    background: '#ffffff',
    border: '1px solid #d0d7e2',
    borderRadius: '12px',
    padding: '20px',
    boxShadow: '0 6px 24px rgba(15, 23, 42, 0.08)',
    minWidth: 0,
  },
  previewCard: {
    background: '#ffffff',
    border: '1px solid #d0d7e2',
    borderRadius: '12px',
    padding: '20px',
    boxShadow: '0 6px 24px rgba(15, 23, 42, 0.08)',
    minWidth: 0,
  },
  loadingContainer: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '16px',
    background: '#ffffff',
    border: '1px solid #d0d7e2',
    borderRadius: '16px',
    padding: '40px 48px',
    boxShadow: '0 8px 32px rgba(15, 23, 42, 0.1)',
  },
  loadingText: {
    margin: 0,
    fontSize: '16px',
    fontWeight: 600,
    color: '#1e3161',
    letterSpacing: '0.01em',
  },
  cardError: {
    maxWidth: '720px',
    margin: '0 auto',
    background: '#fff5f5',
    border: '1px solid #fecaca',
    color: '#991b1b',
    borderRadius: '12px',
    padding: '18px',
    fontSize: '15px',
  },
  title: {
    margin: '0 0 6px 0',
    fontSize: '22px',
    fontWeight: 700,
    color: '#1e3161',
  },
  subtitle: {
    margin: '0 0 18px 0',
    fontSize: '14px',
    color: '#475467',
  },
  row: {
    display: 'flex',
    flexDirection: 'column',
    gap: '6px',
    marginBottom: '14px',
  },
  label: {
    fontSize: '13px',
    fontWeight: 600,
    color: '#334155',
  },
  input: {
    height: '40px',
    border: '1px solid #cbd5e1',
    borderRadius: '8px',
    padding: '0 12px',
    fontSize: '14px',
    color: '#1f2937',
    background: '#fff',
  },
  select: {
    height: '40px',
    border: '1px solid #cbd5e1',
    borderRadius: '8px',
    padding: '0 12px',
    fontSize: '14px',
    color: '#1f2937',
    background: '#fff',
  },
  editorShell: {
    minHeight: '220px',
    border: '1px solid #cbd5e1',
    borderRadius: '8px',
    padding: '12px',
    color: '#1f2937',
    background: '#fff',
    lineHeight: 1.6,
    overflowY: 'auto',
    fontSize: '15px',
    fontFamily: FONT_STACKS.Roboto,
  },
  controls: {
    display: 'flex',
    flexDirection: 'column',
    gap: '12px',
    marginBottom: '14px',
    padding: '12px',
    borderRadius: '10px',
    border: '1px solid #d8e2f2',
    background: '#f8fbff',
    minWidth: 0,
  },
  toolbarTopRow: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
    gap: '12px',
    alignItems: 'end',
    minWidth: 0,
  },
  toolbarField: {
    display: 'flex',
    flexDirection: 'column',
    gap: '6px',
    minWidth: 0,
  },
  toolbarGroups: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(165px, 1fr))',
    gap: '10px',
    minWidth: 0,
  },
  toolbarGroup: {
    display: 'flex',
    flexDirection: 'column',
    gap: '8px',
    background: '#ffffff',
    border: '1px solid #e2e8f0',
    borderRadius: '8px',
    padding: '8px',
    minWidth: 0,
  },
  toolbarGroupLabel: {
    margin: 0,
    fontSize: '11px',
    lineHeight: 1,
    letterSpacing: '0.04em',
    textTransform: 'uppercase',
    fontWeight: 700,
    color: '#64748b',
  },
  fontSizeRow: {
    display: 'grid',
    gridTemplateColumns: '32px minmax(0, 1fr) 32px',
    gap: '6px',
    alignItems: 'center',
    minWidth: 0,
  },
  indentRow: {
    display: 'grid',
    gridTemplateColumns: 'repeat(2, minmax(0, 1fr))',
    gap: '6px',
    alignItems: 'center',
    minWidth: 0,
  },
  fontSizeInput: {
    height: '40px',
    border: '1px solid #cbd5e1',
    borderRadius: '8px',
    padding: '0 10px',
    fontSize: '14px',
    color: '#1f2937',
    background: '#fff',
    textAlign: 'center',
    minWidth: 0,
  },
  smallControlButton: {
    height: '40px',
    border: '1px solid #cbd5e1',
    borderRadius: '8px',
    background: '#fff',
    color: '#1f2937',
    fontSize: '18px',
    lineHeight: 1,
    cursor: 'pointer',
    fontWeight: 600,
  },
  indentControlButton: {
    height: '40px',
    border: '1px solid #cbd5e1',
    borderRadius: '8px',
    background: '#fff',
    color: '#1f2937',
    fontSize: '13px',
    lineHeight: 1,
    cursor: 'pointer',
    fontWeight: 700,
    whiteSpace: 'nowrap',
  },
  toolbarButtonRow: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: '6px',
    minWidth: 0,
  },
  toolbarButton: {
    minWidth: '32px',
    height: '34px',
    padding: '0 8px',
    borderRadius: '8px',
    border: '1px solid #cbd5e1',
    background: '#fff',
    color: '#1f2937',
    fontSize: '13px',
    fontWeight: 700,
    cursor: 'pointer',
    whiteSpace: 'nowrap',
  },
  toolbarButtonWide: {
    minWidth: 0,
    flex: '1 1 calc(50% - 3px)',
  },
  toolbarButtonActive: {
    background: '#e8eef9',
    border: '1px solid #8fb0f0',
    color: '#1d4ed8',
  },
  variableSection: {
    marginBottom: '16px',
  },
  variableLabel: {
    fontSize: '13px',
    fontWeight: 600,
    margin: '0 0 8px 0',
    color: '#334155',
  },
  variableWrap: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: '8px',
    maxHeight: '120px',
    overflowY: 'auto',
    padding: '2px',
  },
  variableButton: {
    background: '#e8eef9',
    border: '1px solid #c5d4f0',
    color: '#1e3a8a',
    borderRadius: '20px',
    padding: '6px 10px',
    fontSize: '12px',
    cursor: 'pointer',
    maxWidth: '100%',
    overflowWrap: 'anywhere',
  },
  sendButton: {
    width: '100%',
    height: '44px',
    borderRadius: '10px',
    border: 'none',
    background: '#1e3161',
    color: '#fff',
    fontSize: '15px',
    fontWeight: 700,
    cursor: 'pointer',
  },
  errorText: {
    margin: '0 0 12px 0',
    color: '#b42318',
    fontSize: '13px',
    background: '#fef3f2',
    border: '1px solid #fecdca',
    borderRadius: '8px',
    padding: '8px 10px',
  },
  successText: {
    margin: '0 0 12px 0',
    color: '#067647',
    fontSize: '13px',
    background: '#ecfdf3',
    border: '1px solid #abefc6',
    borderRadius: '8px',
    padding: '8px 10px',
  },
  previewTitle: {
    margin: '0 0 12px 0',
    fontSize: '20px',
    color: '#1e3161',
  },
  previewShell: {
    border: '1px solid #e2e8f0',
    borderRadius: '10px',
    overflow: 'hidden',
    background: '#f8fafc',
  },
  previewHeader: {
    background: '#1e3161',
    padding: '16px 18px',
    color: '#fff',
  },
  previewHeaderTitle: {
    margin: 0,
    fontSize: '18px',
  },
  previewHeaderSub: {
    margin: '4px 0 0 0',
    fontSize: '13px',
    opacity: 0.9,
  },
  previewBody: {
    padding: '16px 18px 20px 18px',
    background: '#ffffff',
  },
  previewMeta: {
    margin: '0 0 10px 0',
    color: '#334155',
    fontSize: '14px',
    lineHeight: 1.6,
  },
  previewDetails: {
    margin: '14px 0',
    background: '#f8f9fa',
    border: '1px solid #e6e9ee',
    borderLeft: '4px solid #1e3161',
    borderRadius: '8px',
    padding: '12px',
    fontSize: '13px',
    color: '#334155',
    lineHeight: 1.5,
  },
  previewMessage: {
    marginTop: '14px',
    background: '#f8f9fa',
    border: '1px solid #e6e9ee',
    borderRadius: '8px',
    padding: '14px',
    color: '#333333',
    lineHeight: 1.7,
    overflowWrap: 'anywhere',
  },
};
