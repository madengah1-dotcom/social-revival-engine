import React from 'react';
import { BlueprintContext } from '../types';
import { DEFAULT_SYSTEM_SPEC } from '../constants';
import { Play, Settings2, MapPin, Target, FileText } from 'lucide-react';

interface ConfigFormProps {
  context: BlueprintContext;
  setContext: React.Dispatch<React.SetStateAction<BlueprintContext>>;
  onGenerate: () => void;
  isGenerating: boolean;
}

const ConfigForm: React.FC<ConfigFormProps> = ({
  context,
  setContext,
  onGenerate,
  isGenerating,
}) => {
  const handleChange = (field: keyof BlueprintContext, value: string) => {
    setContext((prev) => ({ ...prev, [field]: value }));
  };

  return (
    <div className="w-full max-w-4xl mx-auto p-6 animate-fade-in">
      <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-8 shadow-2xl backdrop-blur-sm">
        <div className="flex items-center gap-3 mb-8">
            <div className="p-3 bg-brand-500/10 rounded-lg">
                <Settings2 className="w-6 h-6 text-brand-500" />
            </div>
            <div>
                <h2 className="text-2xl font-bold text-white">System Configuration</h2>
                <p className="text-slate-400 text-sm">Define the parameters for the AI Social Revival Engine.</p>
            </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          {/* Location Group */}
          <div className="space-y-4">
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 mb-2">Target Region</label>
            <div className="relative">
                <MapPin className="absolute left-3 top-3 w-5 h-5 text-slate-500" />
                <input
                type="text"
                placeholder="Country / Region (e.g. UK)"
                className="w-full bg-slate-900 border border-slate-700 rounded-lg py-3 pl-10 pr-4 text-slate-100 focus:ring-2 focus:ring-brand-500 focus:border-transparent outline-none transition-all placeholder:text-slate-600"
                value={context.country}
                onChange={(e) => handleChange('country', e.target.value)}
                />
            </div>
            <div className="relative">
                <MapPin className="absolute left-3 top-3 w-5 h-5 text-slate-500" />
                <input
                type="text"
                placeholder="City / Area (optional)"
                className="w-full bg-slate-900 border border-slate-700 rounded-lg py-3 pl-10 pr-4 text-slate-100 focus:ring-2 focus:ring-brand-500 focus:border-transparent outline-none transition-all placeholder:text-slate-600"
                value={context.city}
                onChange={(e) => handleChange('city', e.target.value)}
                />
            </div>
          </div>

          {/* Niches Group */}
          <div className="space-y-4">
             <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 mb-2">Target Verticals</label>
            <div className="relative">
                <Target className="absolute left-3 top-3 w-5 h-5 text-slate-500" />
                <input
                type="text"
                placeholder="Primary Niche + Region"
                className="w-full bg-slate-900 border border-slate-700 rounded-lg py-3 pl-10 pr-4 text-slate-100 focus:ring-2 focus:ring-brand-500 focus:border-transparent outline-none transition-all placeholder:text-slate-600"
                value={context.niche1}
                onChange={(e) => handleChange('niche1', e.target.value)}
                />
            </div>
            <div className="relative">
                <Target className="absolute left-3 top-3 w-5 h-5 text-slate-500" />
                <input
                type="text"
                placeholder="Secondary Niche + Media Surface"
                className="w-full bg-slate-900 border border-slate-700 rounded-lg py-3 pl-10 pr-4 text-slate-100 focus:ring-2 focus:ring-brand-500 focus:border-transparent outline-none transition-all placeholder:text-slate-600"
                value={context.niche2}
                onChange={(e) => handleChange('niche2', e.target.value)}
                />
            </div>
          </div>
        </div>

        {/* System Spec */}
        <div className="mb-8">
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 mb-4 flex items-center gap-2">
                <FileText className="w-4 h-4" />
                System Specification / Blueprint Source
            </label>
            <textarea
                className="w-full h-48 bg-slate-900 border border-slate-700 rounded-lg p-4 text-slate-300 font-mono text-sm focus:ring-2 focus:ring-brand-500 focus:border-transparent outline-none transition-all resize-none"
                value={context.systemSpec}
                onChange={(e) => handleChange('systemSpec', e.target.value)}
                placeholder="Paste your system architecture notes here..."
            />
        </div>

        <button
          onClick={onGenerate}
          disabled={isGenerating || !context.country || !context.niche1}
          className={`w-full py-4 rounded-lg font-bold text-lg flex items-center justify-center gap-3 transition-all transform active:scale-[0.98]
            ${isGenerating || !context.country || !context.niche1
              ? 'bg-slate-700 text-slate-400 cursor-not-allowed'
              : 'bg-gradient-to-r from-brand-600 to-cyan-600 hover:from-brand-500 hover:to-cyan-500 text-white shadow-lg shadow-brand-900/50'
            }`}
        >
          {isGenerating ? (
            <>
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                Architecting Solution...
            </>
          ) : (
            <>
                <Play className="w-5 h-5 fill-current" />
                Generate Blueprint Assets
            </>
          )}
        </button>

        {!process.env.API_KEY && (
            <div className="mt-4 p-3 bg-red-900/20 border border-red-900/50 rounded text-red-400 text-xs text-center">
                Warning: API_KEY not detected in environment. Generation will fail.
            </div>
        )}
      </div>
    </div>
  );
};

export default ConfigForm;