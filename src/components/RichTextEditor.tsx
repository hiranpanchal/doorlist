"use client";

import { useRef, useCallback } from "react";
import {
  Bold, Italic, Underline, List, ListOrdered, Link, Heading2, Heading3,
  Quote, AlignLeft, AlignCenter, RemoveFormatting,
} from "lucide-react";

function ToolbarButton({
  onClick,
  title,
  children,
}: {
  onClick: () => void;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      title={title}
      className="p-1.5 rounded-lg hover:bg-surface-2 text-muted hover:text-ink transition-colors"
    >
      {children}
    </button>
  );
}

export default function RichTextEditor({
  value,
  onChange,
}: {
  value: string;
  onChange: (value: string) => void;
}) {
  const editorRef = useRef<HTMLDivElement>(null);

  const exec = useCallback((command: string, val?: string) => {
    document.execCommand(command, false, val);
    if (editorRef.current) {
      onChange(editorRef.current.innerHTML);
    }
  }, [onChange]);

  function handleInput() {
    if (editorRef.current) {
      onChange(editorRef.current.innerHTML);
    }
  }

  function insertLink() {
    const url = prompt("Enter URL:");
    if (url) exec("createLink", url);
  }

  return (
    <div className="border border-border rounded-2xl overflow-hidden">
      {/* Toolbar */}
      <div className="flex flex-wrap items-center gap-0.5 px-3 py-2 bg-surface border-b border-border">
        <ToolbarButton onClick={() => exec("formatBlock", "h2")} title="Heading 2">
          <Heading2 className="w-4 h-4" />
        </ToolbarButton>
        <ToolbarButton onClick={() => exec("formatBlock", "h3")} title="Heading 3">
          <Heading3 className="w-4 h-4" />
        </ToolbarButton>
        <div className="w-px h-5 bg-border mx-1" />
        <ToolbarButton onClick={() => exec("bold")} title="Bold">
          <Bold className="w-4 h-4" />
        </ToolbarButton>
        <ToolbarButton onClick={() => exec("italic")} title="Italic">
          <Italic className="w-4 h-4" />
        </ToolbarButton>
        <ToolbarButton onClick={() => exec("underline")} title="Underline">
          <Underline className="w-4 h-4" />
        </ToolbarButton>
        <div className="w-px h-5 bg-border mx-1" />
        <ToolbarButton onClick={() => exec("insertUnorderedList")} title="Bullet list">
          <List className="w-4 h-4" />
        </ToolbarButton>
        <ToolbarButton onClick={() => exec("insertOrderedList")} title="Numbered list">
          <ListOrdered className="w-4 h-4" />
        </ToolbarButton>
        <ToolbarButton onClick={() => exec("formatBlock", "blockquote")} title="Quote">
          <Quote className="w-4 h-4" />
        </ToolbarButton>
        <div className="w-px h-5 bg-border mx-1" />
        <ToolbarButton onClick={insertLink} title="Insert link">
          <Link className="w-4 h-4" />
        </ToolbarButton>
        <ToolbarButton onClick={() => exec("justifyLeft")} title="Align left">
          <AlignLeft className="w-4 h-4" />
        </ToolbarButton>
        <ToolbarButton onClick={() => exec("justifyCenter")} title="Align center">
          <AlignCenter className="w-4 h-4" />
        </ToolbarButton>
        <ToolbarButton onClick={() => exec("removeFormat")} title="Clear formatting">
          <RemoveFormatting className="w-4 h-4" />
        </ToolbarButton>
      </div>

      {/* Editor */}
      <div
        ref={editorRef}
        contentEditable
        suppressContentEditableWarning
        onInput={handleInput}
        dangerouslySetInnerHTML={{ __html: value }}
        className="min-h-[280px] p-5 outline-none text-ink-2 leading-relaxed"
        style={{ fontSize: 15 }}
      />

      <style>{`
        [contenteditable] h2 { font-family: var(--font-bricolage), sans-serif; font-size: 22px; font-weight: 700; margin: 20px 0 8px; color: var(--color-ink); }
        [contenteditable] h3 { font-family: var(--font-bricolage), sans-serif; font-size: 18px; font-weight: 700; margin: 16px 0 6px; color: var(--color-ink); }
        [contenteditable] p { margin-bottom: 12px; }
        [contenteditable] ul, [contenteditable] ol { margin-bottom: 12px; padding-left: 24px; }
        [contenteditable] li { margin-bottom: 4px; }
        [contenteditable] a { color: var(--color-accent); text-decoration: underline; }
        [contenteditable] blockquote { border-left: 3px solid var(--color-accent); padding-left: 16px; color: var(--color-muted); font-style: italic; margin: 16px 0; }
        [contenteditable] strong { color: var(--color-ink); }
      `}</style>
    </div>
  );
}
