import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Sparkles, ArrowLeft, RefreshCw, Github } from 'lucide-react';
import ResumeUploader from './components/ResumeUploader';
import AnalysisResults from './components/AnalysisResults';
import { analyzeResume, ResumeData } from './services/geminiService';
import { cn } from './lib/utils';

export default function App() {
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisData, setAnalysisData] = useState<ResumeData | null>(null);
  const [jobDescription, setJobDescription] = useState("");
  const [error, setError] = useState<string | null>(null);

  const handleResumeAnalysis = async (data: { text?: string; fileData?: { data: string; mimeType: string } }) => {
    setIsAnalyzing(true);
    setError(null);
    try {
      const results = await analyzeResume({ ...data, jobDescription });
      setAnalysisData(results);
    } catch (err) {
      console.error("Analysis Error:", err);
      setError("Something went wrong during analysis. Please try again or use a different file.");
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleReset = () => {
    setAnalysisData(null);
    setJobDescription("");
    setError(null);
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-slate-900 font-sans selection:bg-indigo-100 selection:text-indigo-900">
      <nav className="h-16 px-8 flex items-center justify-between border-b border-slate-200 bg-white sticky top-0 z-50">
        <div className="flex items-center gap-2 cursor-pointer" onClick={handleReset}>
          <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center shadow-lg shadow-indigo-100">
            <div className="w-4 h-4 border-2 border-white rounded-sm"></div>
          </div>
          <span className="font-bold text-xl tracking-tight">ResuScan <span className="text-indigo-600">AI</span></span>
        </div>

        <nav className="hidden md:flex gap-8 text-sm font-medium text-slate-500">
          <button onClick={handleReset} className={cn("transition-colors", !analysisData ? "text-indigo-600" : "hover:text-slate-900")}>Analyzer</button>
        </nav>

        <div className="flex items-center gap-4">
          <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-400">
            <Github className="w-4 h-4" />
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-6 pt-12 pb-24 flex flex-col min-h-[calc(100vh-64px)]">
        <AnimatePresence mode="wait">
          {!analysisData ? (
            <motion.div
              key="uploader"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-12 flex-1 flex flex-col justify-center max-w-4xl mx-auto w-full"
            >
              <div className="text-center space-y-4 max-w-2xl mx-auto">
                <h1 className="text-5xl md:text-6xl font-bold tracking-tight text-slate-900 leading-[1.1]">
                  Intelligent <span className="text-indigo-600">Resume Parser</span>
                </h1>
                <p className="text-lg text-slate-500 leading-relaxed">
                  Extract deep insights, skills, and experience metrics using advanced NLP.
                  Built for precision and speed.
                </p>
              </div>

              <div className="space-y-6">
                <ResumeUploader onUpload={handleResumeAnalysis} isLoading={isAnalyzing} />
                
                <div className="max-w-2xl mx-auto w-full">
                  <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-4">
                    <div className="flex items-center justify-between">
                      <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest">Target Job Description (Optional)</h3>
                      {jobDescription && (
                        <button onClick={() => setJobDescription("")} className="text-xs text-indigo-600 font-bold hover:underline">Clear</button>
                      )}
                    </div>
                    <textarea
                      placeholder="Paste the target job description here to see how well the resume matches..."
                      value={jobDescription}
                      onChange={(e) => setJobDescription(e.target.value)}
                      className="w-full h-32 p-4 bg-slate-50 border border-slate-100 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/10 placeholder:text-slate-400 transition-all resize-none"
                    />
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-8 pt-8">
                {[
                  { title: "Entity Recognition", desc: "Identification of companies, roles, and schools." },
                  { title: "Skill Validation", desc: "Automatic categorization of technical and soft skills." },
                  { title: "Match Analysis", desc: "See how well you align with specific job requirements." }
                ].map((feature, i) => (
                  <div key={i} className="p-6 rounded-2xl bg-white border border-slate-200 shadow-sm space-y-2">
                    <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest">{feature.title}</h3>
                    <p className="text-sm font-medium text-slate-700 leading-relaxed">{feature.desc}</p>
                  </div>
                ))}
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="results"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="space-y-8"
            >
              <div className="flex items-center justify-between">
                <button 
                  onClick={handleReset}
                  className="flex items-center gap-2 text-sm font-semibold text-slate-500 hover:text-slate-900 group transition-colors"
                >
                  <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
                  Analyze another resume
                </button>
                
                <button 
                  onClick={() => analysisData && handleResumeAnalysis(analysisData.summary ? { text: analysisData.summary } : {})} 
                  className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-xl text-sm font-bold shadow-lg shadow-indigo-100 hover:bg-indigo-700 transition-all active:scale-95"
                >
                  <RefreshCw className={cn("w-4 h-4", isAnalyzing && "animate-spin")} />
                  Refresh
                </button>
              </div>
              
              <AnalysisResults data={analysisData} />
            </motion.div>
          )}
        </AnimatePresence>

        {error && (
          <div className="fixed bottom-8 left-1/2 -translate-x-1/2 bg-slate-900 text-white px-6 py-3 rounded-full shadow-2xl flex items-center gap-3 animate-in slide-in-from-bottom-4">
            <span className="text-sm font-medium">{error}</span>
            <button onClick={() => setError(null)} className="hover:text-red-400 transition-colors">
              <RefreshCw className="w-4 h-4" />
            </button>
          </div>
        )}
      </main>
    </div>
  );
}
