"use client";

import { useEffect, useRef } from "react";

export function RichTextEditor({
  value,
  onChange,
  mergeFields = [],
  placeholder,
}: {
  value: string;
  onChange: (html: string) => void;
  mergeFields?: string[];
  placeholder?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);

  // Initialize the editable region once; afterwards it's uncontrolled so the
  // caret never jumps. The parent stays in sync via onInput.
  useEffect(() => {
    if (ref.current && ref.current.innerHTML !== value) {
      ref.current.innerHTML = value || "";
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function emit() {
    if (ref.current) onChange(ref.current.innerHTML);
  }

  function cmd(command: string, val?: string) {
    ref.current?.focus();
    document.execCommand(command, false, val);
    emit();
  }

  function insertTag(field: string) {
    ref.current?.focus();
    document.execCommand("insertText", false, `{{${field}}}`);
    emit();
  }

  function addLink() {
    const url = window.prompt("Link URL", "https://");
    if (url) cmd("createLink", url);
  }

  return (
    <div className="overflow-hidden rounded-lg border border-line bg-elevated transition-colors focus-within:border-accent-500">
      <div className="flex flex-wrap items-center gap-1 border-b border-line bg-canvas p-2">
        <Btn onClick={() => cmd("bold")} title="Bold">
          <b>B</b>
        </Btn>
        <Btn onClick={() => cmd("italic")} title="Italic">
          <i>I</i>
        </Btn>
        <Btn onClick={() => cmd("underline")} title="Underline">
          <u>U</u>
        </Btn>
        <Btn onClick={() => cmd("insertUnorderedList")} title="Bulleted list">
          • List
        </Btn>
        <Btn onClick={addLink} title="Insert link">
          Link
        </Btn>
        {mergeFields.length > 0 && (
          <>
            <span className="mx-1 h-4 w-px bg-line" />
            {mergeFields.map((f) => (
              <button
                key={f}
                type="button"
                onClick={() => insertTag(f)}
                className="rounded bg-accent-soft px-1.5 py-0.5 font-mono text-xs text-accent-600 ring-1 ring-inset ring-accent-500/20 hover:bg-accent-500/20"
              >{`{{${f}}}`}</button>
            ))}
          </>
        )}
      </div>
      <div
        ref={ref}
        contentEditable
        onInput={emit}
        data-placeholder={placeholder}
        suppressContentEditableWarning
        className="prose-email min-h-[200px] bg-surface px-3 py-2 text-ink focus:outline-none [&:empty:before]:text-faint [&:empty:before]:content-[attr(data-placeholder)]"
      />
    </div>
  );
}

function Btn({
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
      title={title}
      onClick={onClick}
      className="rounded px-2 py-1 text-sm text-muted transition-colors hover:bg-subtle hover:text-ink"
    >
      {children}
    </button>
  );
}
