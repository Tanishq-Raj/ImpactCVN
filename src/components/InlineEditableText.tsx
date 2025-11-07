import { useState, useRef, useEffect } from 'react';
import { Check, X } from 'lucide-react';

interface InlineEditableTextProps {
  value: string;
  onChange: (value: string) => void;
  className?: string;
  as?: 'span' | 'h1' | 'h2' | 'h3' | 'h4' | 'p' | 'div';
  multiline?: boolean;
  placeholder?: string;
}

export function InlineEditableText({
  value,
  onChange,
  className = '',
  as: Component = 'span',
  multiline = false,
  placeholder = 'Click to edit'
}: InlineEditableTextProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [editValue, setEditValue] = useState(value);
  const inputRef = useRef<HTMLInputElement | HTMLTextAreaElement>(null);
  const contentRef = useRef<HTMLElement>(null);

  useEffect(() => {
    setEditValue(value);
  }, [value]);

  useEffect(() => {
    if (isEditing && inputRef.current) {
      inputRef.current.focus();
      inputRef.current.select();
    }
  }, [isEditing]);

  const handleSave = () => {
    if (editValue.trim() !== value) {
      onChange(editValue.trim());
    }
    setIsEditing(false);
  };

  const handleCancel = () => {
    setEditValue(value);
    setIsEditing(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !multiline) {
      e.preventDefault();
      handleSave();
    } else if (e.key === 'Escape') {
      handleCancel();
    }
  };

  if (isEditing) {
    return (
      <div className="inline-flex items-center gap-2 w-full">
        {multiline ? (
          <textarea
            ref={inputRef as React.RefObject<HTMLTextAreaElement>}
            value={editValue}
            onChange={(e) => setEditValue(e.target.value)}
            onKeyDown={handleKeyDown}
            onBlur={handleSave}
            className={`${className} border border-blue-400 rounded px-2 py-1 focus:outline-none focus:ring-2 focus:ring-blue-500 w-full resize-none`}
            rows={3}
          />
        ) : (
          <input
            ref={inputRef as React.RefObject<HTMLInputElement>}
            type="text"
            value={editValue}
            onChange={(e) => setEditValue(e.target.value)}
            onKeyDown={handleKeyDown}
            onBlur={handleSave}
            className={`${className} border border-blue-400 rounded px-2 py-1 focus:outline-none focus:ring-2 focus:ring-blue-500 w-full`}
          />
        )}
        <button
          onClick={handleSave}
          className="text-green-500 hover:text-green-700 flex-shrink-0"
          type="button"
        >
          <Check className="h-4 w-4" />
        </button>
        <button
          onClick={handleCancel}
          className="text-red-500 hover:text-red-700 flex-shrink-0"
          type="button"
        >
          <X className="h-4 w-4" />
        </button>
      </div>
    );
  }

  return (
    <Component
      ref={contentRef as any}
      className={`${className} group relative cursor-pointer hover:bg-blue-50/50 transition-colors rounded px-1 -mx-1`}
      onClick={() => setIsEditing(true)}
      title="Click to edit"
    >
      {value || <span className="text-gray-400 italic">{placeholder}</span>}
      <span className="absolute -right-5 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity text-blue-500 text-xs">
        ✎
      </span>
    </Component>
  );
}
