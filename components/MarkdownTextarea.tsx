import React, { useState, useEffect } from 'react';
import { Textarea } from '@/components/ui/textarea';
import { marked } from 'marked';

interface MarkdownTextareaProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
  name?: string;
}

export function MarkdownTextarea({ value, onChange, placeholder, className, name }: MarkdownTextareaProps) {
  const [preview, setPreview] = useState('');

  useEffect(() => {
    const renderMarkdown = async () => {
      try {
        const renderedMarkdown = await marked(value);
        setPreview(renderedMarkdown);
      } catch (error) {
        console.error('Error rendering markdown:', error);
        setPreview('Error rendering preview');
      }
    };

    renderMarkdown();
  }, [value]);

  return (
    <div className="relative">
      <Textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className={`font-mono ${className}`}
        name={name}
      />
      <div 
        className="absolute top-0 left-0 w-full h-full pointer-events-none p-2 overflow-hidden"
        dangerouslySetInnerHTML={{ __html: preview }}
      />
    </div>
  );
}
