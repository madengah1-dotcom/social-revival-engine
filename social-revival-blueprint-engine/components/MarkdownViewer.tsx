import React, { useMemo } from 'react';
import ReactMarkdown from 'react-markdown';
import { FileCode, Terminal, Download, Copy, Check } from 'lucide-react';

interface MarkdownViewerProps {
  content: string;
  isGenerating: boolean;
}

const MarkdownViewer: React.FC<MarkdownViewerProps> = ({ content, isGenerating }) => {
  const [copied, setCopied] = React.useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    const blob = new Blob([content], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'AI_Social_Revival_Blueprint.md';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  // Memoize the markdown component to prevent flickering during stream
  const MarkdownContent = useMemo(() => {
    return (
      <ReactMarkdown
        className="prose prose-invert prose-blue max-w-none prose-headings:font-bold prose-headings:tracking-tight prose-h1:text-brand-500 prose-pre:bg-slate-900 prose-pre:border prose-pre:border-slate-800"
        components={{
          code({ node, inline, className, children, ...props }: any) {
            const match = /language-(\w+)/.exec(className || '');
            return !inline ? (
              <div className="relative group">
                <div className="absolute right-2 top-2 px-2 py-1 text-xs text-slate-500 bg-slate-800 rounded opacity-0 group-hover:opacity-100 transition-opacity">
                    {match ? match[1] : 'text'}
                </div>
                <code className={`${className} block bg-slate-900 p-4 rounded-lg my-4 overflow-x-auto border border-slate-800 text-sm font-mono text-blue-200`} {...props}>
                  {children}
                </code>
              </div>
            ) : (
              <code className="bg-slate-800 text-brand-200 px-1.5 py-0.5 rounded text-sm font-mono" {...props}>
                {children}
              </code>
            );
          }
        }}
      >
        {content}
      </ReactMarkdown>
    );
  }, [content]);

  return (
    <div className="w-full h-full flex flex-col bg-slate-950">
      {/* Toolbar */}
      <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-slate-900/50 backdrop-blur">
        <div className="flex items-center gap-3">
            <div className={`p-2 rounded-lg ${isGenerating ? 'bg-amber-500/10 text-amber-500 animate-pulse' : 'bg-green-500/10 text-green-500'}`}>
                {isGenerating ? <Terminal className="w-5 h-5" /> : <FileCode className="w-5 h-5" />}
            </div>
            <div>
                <h3 className="font-mono text-sm font-bold text-slate-200">
                    {isGenerating ? 'STREAMING_OUTPUT...' : 'BLUEPRINT_GENERATED.md'}
                </h3>
                <p className="text-xs text-slate-500">
                    {content.length} characters • Markdown
                </p>
            </div>
        </div>
        <div className="flex items-center gap-2">
            <button
                onClick={handleCopy}
                className="p-2 hover:bg-slate-800 rounded-lg text-slate-400 hover:text-white transition-colors flex items-center gap-2"
                title="Copy to Clipboard"
            >
                {copied ? <Check className="w-4 h-4 text-green-500" /> : <Copy className="w-4 h-4" />}
                <span className="text-xs hidden md:inline">Copy Raw</span>
            </button>
            <button
                onClick={handleDownload}
                className="p-2 bg-brand-600 hover:bg-brand-500 text-white rounded-lg transition-colors flex items-center gap-2 text-sm font-medium"
            >
                <Download className="w-4 h-4" />
                <span className="hidden md:inline">Export MD</span>
            </button>
        </div>
      </div>

      {/* Content Area */}
      <div className="flex-1 overflow-y-auto custom-scrollbar p-8">
        <div className="max-w-5xl mx-auto">
            {content ? MarkdownContent : (
                <div className="h-full flex flex-col items-center justify-center text-slate-600 py-20">
                    <Terminal className="w-16 h-16 mb-4 opacity-20" />
                    <p className="font-mono text-sm">Waiting for data stream...</p>
                </div>
            )}
            {isGenerating && (
                <div className="mt-4 flex items-center gap-2 text-brand-400 font-mono text-xs animate-pulse">
                    <span className="w-2 h-4 bg-brand-400 block" />
                    Writing...
                </div>
            )}
        </div>
      </div>
    </div>
  );
};

export default MarkdownViewer;
