import React, { useRef, useEffect } from 'react';
import { EditorState } from '@codemirror/state';
import { EditorView } from '@codemirror/view';
import { basicSetup } from '@codemirror/basic-setup';
import { json } from '@codemirror/lang-json';

interface EditorProps {
  initialDoc?: string;
  onChange?: (value: string) => void;
  readOnly?: boolean;
}

export const Editor: React.FC<EditorProps> = ({ 
  initialDoc = '',
  onChange = () => {},
  readOnly = false,
}) => {
  const editor = useRef<HTMLDivElement>(null);
  const viewRef = useRef<EditorView | null>(null);

  useEffect(() => {
    if (!editor.current) return;

    const state = EditorState.create({
      doc: initialDoc,
      extensions: [
        basicSetup,
        json(),
        EditorState.readOnly.of(readOnly),
        EditorView.updateListener.of((update) => {
          if (update.docChanged) {
            onChange(update.state.doc.toString());
          }
        })
      ]
    });

    const view = new EditorView({
      state,
      parent: editor.current
    });

    viewRef.current = view;

    return () => {
      view.destroy();
    };
  }, [initialDoc, onChange, readOnly]);

  return (
    <div 
      ref={editor} 
      className="border rounded-md overflow-hidden"
      style={{ minHeight: '600px' }}
    />
  );
};
