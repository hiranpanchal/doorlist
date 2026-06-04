"use client";

import dynamic from "next/dynamic";
import "react-quill-new/dist/quill.snow.css";

const ReactQuill = dynamic(() => import("react-quill-new"), { ssr: false });

const modules = {
  toolbar: [
    [{ header: [2, 3, 4, false] }],
    ["bold", "italic", "underline", "strike"],
    [{ list: "ordered" }, { list: "bullet" }],
    ["link"],
    [{ align: [] }],
    ["blockquote"],
    ["clean"],
  ],
};

export default function RichTextEditor({
  value,
  onChange,
}: {
  value: string;
  onChange: (value: string) => void;
}) {
  return (
    <div className="rich-editor">
      <style>{`
        .rich-editor .ql-container { font-family: var(--font-hanken), sans-serif; font-size: 15px; min-height: 250px; border-radius: 0 0 12px 12px; border-color: var(--color-border); }
        .rich-editor .ql-toolbar { border-radius: 12px 12px 0 0; border-color: var(--color-border); background: var(--color-surface); }
        .rich-editor .ql-editor { min-height: 250px; line-height: 1.7; color: var(--color-ink); }
        .rich-editor .ql-editor h2 { font-family: var(--font-bricolage), sans-serif; font-size: 22px; font-weight: 700; margin: 24px 0 8px; color: var(--color-ink); }
        .rich-editor .ql-editor h3 { font-family: var(--font-bricolage), sans-serif; font-size: 18px; font-weight: 700; margin: 20px 0 6px; color: var(--color-ink); }
        .rich-editor .ql-editor p { margin-bottom: 12px; }
        .rich-editor .ql-editor ul, .rich-editor .ql-editor ol { margin-bottom: 12px; padding-left: 24px; }
        .rich-editor .ql-editor li { margin-bottom: 4px; }
        .rich-editor .ql-editor a { color: var(--color-accent); text-decoration: underline; }
        .rich-editor .ql-editor blockquote { border-left: 3px solid var(--color-accent); padding-left: 16px; color: var(--color-muted); font-style: italic; }
      `}</style>
      <ReactQuill
        theme="snow"
        value={value}
        onChange={onChange}
        modules={modules}
      />
    </div>
  );
}
