import React, { useState, useRef } from 'react';
import { BlueprintContext, ViewMode, GenerationState } from './types';
import { DEFAULT_SYSTEM_SPEC } from './constants';
import { generateBlueprintStream } from './services/geminiService';
import ConfigForm from './components/ConfigForm';
import MarkdownViewer from './components/MarkdownViewer';
import { Bot, ChevronLeft, LayoutTemplate, Activity } from 'lucide-react';

const App: React.FC = () => {
  const [viewMode, setViewMode] = useState<ViewMode>(ViewMode.CONFIG);
  
  const [context, setContext] = useState<BlueprintContext>({
    country: '',
    city: '',
    niche1: '',
    niche2: '',
    systemSpec: DEFAULT_SYSTEM_SPEC,
  });

  const [genState, setGenState] = useState<GenerationState>({
    isGenerating: false,
    content: '',
    error: null,
    progress: '',
  });

  const handleGenerate = async () => {
    setViewMode(ViewMode.BLUEPRINT);
    setGenState({
      isGenerating: true,
      content: '', // Reset content
      error: null,
      progress: 'Initializing Gemini Protocol...',
    });

    try {
      await generateBlueprintStream(context, (chunk) => {
        setGenState((prev) => ({
          ...prev,
          content: prev.content + chunk,
          progress: 'Streaming architectural data...',
        }));
      });
    } catch (error: any) {
      setGenState((prev) => ({
        ...prev,
        error: error.message,
        progress: 'Error encountered.',
      }));
    } finally {
      setGenState((prev) => ({
        ...prev,
        isGenerating: false,
        progress: 'Blueprint Complete.',
      }));
    }
  };

  const handleBack = () => {
    if (genState.isGenerating) return; // Prevent navigation while active
    setViewMode(ViewMode.CONFIG);
  };

  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <header className="h-16 border-b border-slate-800 bg-slate-900 flex items-center justify-between px-6 z-10">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-gradient-to-br from-brand-500 to-purple-600 rounded-lg flex items-center justify-center shadow-lg shadow-brand-500/20">
            <Bot className="w-5 h-5 text-white" />
          </div>
          <h1 className="text-lg font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-slate-400">
            Social Revival Engine <span className="font-mono text-xs text-brand-500 bg-brand-500/10 px-2 py-0.5 rounded border border-brand-500/20">v2.1</span>
          </h1>
        </div>
        
        {viewMode === ViewMode.BLUEPRINT && (
             <div className="flex items-center gap-4 text-xs font-mono text-slate-500">
                <div className="flex items-center gap-2">
                    <Activity className={`w-3 h-3 ${genState.isGenerating ? 'text-green-500 animate-pulse' : 'text-slate-600'}`} />
                    <span>STATUS: {genState.isGenerating ? 'ACTIVE_STREAM' : 'IDLE'}</span>
                </div>
            </div>
        )}
      </header>

      {/* Main Content */}
      <main className="flex-1 flex overflow-hidden relative">
        {viewMode === ViewMode.CONFIG ? (
          <div className="w-full h-full overflow-y-auto bg-slate-900 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-slate-800 via-slate-900 to-slate-950">
             <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 pointer-events-none"></div>
             <div className="relative pt-12 pb-24">
                 <div className="text-center mb-12 space-y-4">
                     <h2 className="text-4xl md:text-5xl font-bold text-white tracking-tight">
                         Operational Blueprint Generator
                     </h2>
                     <p className="text-slate-400 max-w-2xl mx-auto text-lg">
                         Turn your system specifications into a comprehensive documentation package, operator playbooks, and compliance guides instantly.
                     </p>
                 </div>
                <ConfigForm
                    context={context}
                    setContext={setContext}
                    onGenerate={handleGenerate}
                    isGenerating={genState.isGenerating}
                />
             </div>
          </div>
        ) : (
          <div className="w-full flex flex-col h-full">
            {/* Sub-header for Blueprint Mode */}
             <div className="h-12 bg-slate-950 border-b border-slate-800 flex items-center px-4">
                <button 
                    onClick={handleBack}
                    disabled={genState.isGenerating}
                    className={`flex items-center gap-2 text-sm font-medium px-3 py-1.5 rounded-md transition-colors
                        ${genState.isGenerating 
                            ? 'text-slate-600 cursor-not-allowed' 
                            : 'text-slate-400 hover:text-white hover:bg-slate-800'}`}
                >
                    <ChevronLeft className="w-4 h-4" />
                    Back to Config
                </button>
                <div className="h-4 w-px bg-slate-800 mx-4"></div>
                <div className="flex items-center gap-2 text-slate-300 text-sm">
                    <LayoutTemplate className="w-4 h-4 text-brand-500" />
                    <span>Generated Documentation</span>
                </div>
             </div>
             
             {/* Viewer */}
             <div className="flex-1 overflow-hidden relative">
                <MarkdownViewer content={genState.content} isGenerating={genState.isGenerating} />
                
                {genState.error && (
                    <div className="absolute bottom-6 left-6 right-6 bg-red-900/90 border border-red-500 text-white p-4 rounded-lg shadow-xl backdrop-blur flex items-center justify-between">
                        <span>Error: {genState.error}</span>
                        <button 
                            onClick={() => setGenState(s => ({...s, error: null}))}
                            className="text-xs bg-red-950/50 px-2 py-1 rounded hover:bg-red-950"
                        >
                            Dismiss
                        </button>
                    </div>
                )}
             </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default App;
