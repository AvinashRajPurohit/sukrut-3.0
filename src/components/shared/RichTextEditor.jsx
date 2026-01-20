'use client';

import { useRef, useEffect, useState } from 'react';
import { Bold, Italic, Underline, List, ListOrdered, Link, Quote, Code, AlignLeft, AlignCenter, AlignRight } from 'lucide-react';

export default function RichTextEditor({ value, onChange, placeholder = 'Enter content...', error }) {
  const editorRef = useRef(null);
  const [isFocused, setIsFocused] = useState(false);

  useEffect(() => {
    if (editorRef.current && value !== editorRef.current.innerHTML) {
      editorRef.current.innerHTML = value || '';
    }
  }, [value]);

  const handleInput = (e) => {
    const html = e.target.innerHTML;
    onChange(html);
  };

  const execCommand = (command, value = null) => {
    document.execCommand(command, false, value);
    editorRef.current?.focus();
    handleInput({ target: editorRef.current });
  };

  const insertLink = () => {
    const url = prompt('Enter URL:');
    if (url) {
      execCommand('createLink', url);
    }
  };

  const ToolbarButton = ({ onClick, icon: Icon, title, active = false }) => (
    <button
      type="button"
      onClick={onClick}
      title={title}
      className={`
        p-2 rounded hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors
        ${active ? 'bg-[#E39A2E]/10 text-[#E39A2E]' : 'text-slate-600 dark:text-slate-400'}
      `}
    >
      <Icon className="w-4 h-4" />
    </button>
  );

  return (
    <div className="w-full">
      {/* Toolbar */}
      <div className="flex flex-wrap items-center gap-1 p-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-t-lg">
        <div className="flex items-center gap-1 border-r border-slate-200 dark:border-slate-700 pr-2 mr-2">
          <select
            className="px-2 py-1 text-sm bg-white dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded text-slate-900 dark:text-slate-100 cursor-pointer"
            onChange={(e) => execCommand('formatBlock', e.target.value)}
            defaultValue=""
          >
            <option value="">Normal</option>
            <option value="h1">Heading 1</option>
            <option value="h2">Heading 2</option>
            <option value="h3">Heading 3</option>
            <option value="h4">Heading 4</option>
            <option value="p">Paragraph</option>
          </select>
        </div>
        
        <div className="flex items-center gap-1 border-r border-slate-200 dark:border-slate-700 pr-2 mr-2">
          <ToolbarButton
            onClick={() => execCommand('bold')}
            icon={Bold}
            title="Bold"
          />
          <ToolbarButton
            onClick={() => execCommand('italic')}
            icon={Italic}
            title="Italic"
          />
          <ToolbarButton
            onClick={() => execCommand('underline')}
            icon={Underline}
            title="Underline"
          />
        </div>

        <div className="flex items-center gap-1 border-r border-slate-200 dark:border-slate-700 pr-2 mr-2">
          <ToolbarButton
            onClick={() => execCommand('insertUnorderedList')}
            icon={List}
            title="Bullet List"
          />
          <ToolbarButton
            onClick={() => execCommand('insertOrderedList')}
            icon={ListOrdered}
            title="Numbered List"
          />
        </div>

        <div className="flex items-center gap-1 border-r border-slate-200 dark:border-slate-700 pr-2 mr-2">
          <ToolbarButton
            onClick={() => execCommand('justifyLeft')}
            icon={AlignLeft}
            title="Align Left"
          />
          <ToolbarButton
            onClick={() => execCommand('justifyCenter')}
            icon={AlignCenter}
            title="Align Center"
          />
          <ToolbarButton
            onClick={() => execCommand('justifyRight')}
            icon={AlignRight}
            title="Align Right"
          />
        </div>

        <div className="flex items-center gap-1">
          <ToolbarButton
            onClick={insertLink}
            icon={Link}
            title="Insert Link"
          />
          <ToolbarButton
            onClick={() => execCommand('formatBlock', 'blockquote')}
            icon={Quote}
            title="Quote"
          />
          <ToolbarButton
            onClick={() => execCommand('formatBlock', 'pre')}
            icon={Code}
            title="Code Block"
          />
        </div>
      </div>

      {/* Editor */}
      <div
        ref={editorRef}
        contentEditable
        onInput={handleInput}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        className={`
          min-h-[300px] p-4 bg-white dark:bg-slate-800 border border-t-0 border-slate-200 dark:border-slate-700 rounded-b-lg
          text-slate-900 dark:text-slate-100
          focus:outline-none focus:ring-2 focus:ring-[#E39A2E] focus:border-[#E39A2E]
          ${error ? 'border-red-500 focus:ring-red-500' : ''}
          ${isFocused ? 'ring-2 ring-[#E39A2E]' : ''}
        `}
        style={{
          outline: 'none'
        }}
        suppressContentEditableWarning
        data-placeholder={placeholder}
      />
      
      {error && (
        <p className="mt-1.5 text-sm text-red-500">{error}</p>
      )}

      <style jsx global>{`
        [contenteditable][data-placeholder]:empty:before {
          content: attr(data-placeholder);
          color: #94a3b8;
          pointer-events: none;
        }
        [contenteditable] {
          word-wrap: break-word;
        }
        [contenteditable] h1 {
          font-size: 2em;
          font-weight: bold;
          margin: 0.67em 0;
        }
        [contenteditable] h2 {
          font-size: 1.5em;
          font-weight: bold;
          margin: 0.75em 0;
        }
        [contenteditable] h3 {
          font-size: 1.17em;
          font-weight: bold;
          margin: 0.83em 0;
        }
        [contenteditable] h4 {
          font-size: 1em;
          font-weight: bold;
          margin: 1em 0;
        }
        [contenteditable] p {
          margin: 1em 0;
        }
        [contenteditable] ul,
        [contenteditable] ol {
          margin: 1em 0;
          padding-left: 2em;
        }
        [contenteditable] blockquote {
          margin: 1em 0;
          padding-left: 1em;
          border-left: 3px solid #e2e8f0;
          font-style: italic;
        }
        [contenteditable] pre {
          margin: 1em 0;
          padding: 1em;
          background: #f1f5f9;
          border-radius: 0.5rem;
          overflow-x: auto;
        }
        .dark [contenteditable] blockquote {
          border-left-color: #475569;
        }
        .dark [contenteditable] pre {
          background: #1e293b;
        }
        [contenteditable] a {
          color: #E39A2E;
          text-decoration: underline;
        }
      `}</style>
    </div>
  );
}
