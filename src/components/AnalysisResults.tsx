import React from 'react';
import { 
  User, Mail, Phone, MapPin, ExternalLink, 
  Briefcase, GraduationCap, Code, Sparkles, 
  Lightbulb, Target, CheckCircle2 
} from 'lucide-react';
import { motion } from 'motion/react';
import { ResumeData } from '../services/geminiService';
import { cn } from '../lib/utils';

interface AnalysisResultsProps {
  data: ResumeData;
}

export default function AnalysisResults({ data }: AnalysisResultsProps) {
  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 }
  };

  const handleExportJSON = () => {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(data, null, 2));
    const downloadAnchorNode = document.createElement('a');
    downloadAnchorNode.setAttribute("href", dataStr);
    downloadAnchorNode.setAttribute("download", `${data.name.replace(/\s+/g, '_')}_analysis.json`);
    document.body.appendChild(downloadAnchorNode);
    downloadAnchorNode.click();
    downloadAnchorNode.remove();
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <motion.div 
      variants={container}
      initial="hidden"
      animate="show"
      className="grid grid-cols-12 gap-6"
    >
      {/* Left Panel: Status & Confidence */}
      <div className="col-span-12 lg:col-span-4 flex flex-col gap-6">
        {data.jobMatch ? (
          <motion.div variants={item} className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200">
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-4">Job Match Score</h3>
            <div className="flex items-end gap-2 mb-6">
              <span className={cn(
                "text-6xl font-light",
                data.jobMatch.score >= 80 ? "text-emerald-600" : data.jobMatch.score >= 50 ? "text-amber-600" : "text-slate-900"
              )}>
                {data.jobMatch.score}
              </span>
              <span className="text-xl font-medium text-slate-400 mb-1">/100</span>
            </div>
            <p className="text-sm text-slate-600 leading-relaxed mb-6 font-medium italic">
              "{data.jobMatch.analysis}"
            </p>
            {data.jobMatch.missingSkills.length > 0 && (
              <div className="space-y-3">
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Gap Analysis</p>
                <div className="flex flex-wrap gap-2">
                  {data.jobMatch.missingSkills.map((skill, i) => (
                    <span key={i} className="px-2 py-1 bg-red-50 text-red-600 rounded text-[10px] font-bold border border-red-100">
                      Missing: {skill}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </motion.div>
        ) : (
          <motion.div variants={item} className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200 flex flex-col items-center justify-center border-dashed border-2 bg-slate-50/50 h-56">
            <div className="w-12 h-12 bg-white rounded-full shadow-sm flex items-center justify-center mb-4">
              <svg className="w-6 h-6 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <p className="font-medium text-slate-700 truncate w-full text-center px-4">ready_for_matching</p>
            <p className="text-xs text-slate-400 mt-1">Provide JD to see match score</p>
          </motion.div>
        )}

        <motion.div variants={item} className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200">
          <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-4">NLP Confidence Score</h3>
          <div className="flex items-end gap-2 mb-6">
            <span className="text-5xl font-light text-slate-900">96</span>
            <span className="text-xl font-medium text-slate-400 mb-1">/100</span>
          </div>
          <div className="space-y-4">
            {[
              { label: "Entity Recognition", val: 98, color: "bg-indigo-600", text: "text-indigo-600" },
              { label: "Role Classification", val: 92, color: "bg-emerald-500", text: "text-emerald-500" },
              { label: "Skill Validation", val: 89, color: "bg-amber-500", text: "text-amber-500" }
            ].map((stat, i) => (
              <div key={i}>
                <div className="flex justify-between text-xs font-medium mb-1">
                  <span className="text-slate-500">{stat.label}</span>
                  <span className={stat.text}>{stat.val}%</span>
                </div>
                <div className="w-full bg-slate-100 h-1.5 rounded-full">
                  <div className={cn(stat.color, "h-1.5 rounded-full")} style={{ width: `${stat.val}%` }}></div>
                </div>
              </div>
            ))}
          </div>
        </motion.div>

        <motion.div variants={item} className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200">
          <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-4">Linguistic Analysis (NLP)</h3>
          <div className="space-y-4">
            <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
              <p className="text-[10px] font-bold text-slate-400 uppercase mb-1">Tone & Sentiment</p>
              <div className="flex justify-between items-center text-xs">
                <span className="text-slate-700 font-medium">{data.nlpInsights.tone}</span>
                <span className="text-indigo-600 font-bold">{data.nlpInsights.sentiment}</span>
              </div>
            </div>
            
            <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
              <p className="text-[10px] font-bold text-slate-400 uppercase mb-1">Readability</p>
              <p className="text-xs text-slate-700 font-medium">{data.nlpInsights.readabilityScore}</p>
            </div>

            <div className="space-y-2">
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Extracted Phrases</p>
              <div className="flex flex-wrap gap-1.5">
                {data.nlpInsights.keyPhrases.slice(0, 8).map((phrase, i) => (
                  <span key={i} className="px-2 py-0.5 bg-white border border-slate-200 text-[10px] text-slate-500 rounded font-medium">
                    {phrase}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Right Panel: Extracted Data */}
      <div className="col-span-12 lg:col-span-8 flex flex-col gap-6">
        <motion.div variants={item} className="bg-white rounded-2xl p-8 shadow-sm border border-slate-200 flex-1 flex flex-col">
          <div className="flex flex-col sm:flex-row justify-between items-start gap-4 mb-8">
            <div>
              <h1 className="text-3xl font-bold text-slate-900">{data.name}</h1>
              <p className="text-slate-500 font-medium text-sm">
                {data.experience[0]?.title || 'Professional'} • {data.contact.location}
              </p>
              <div className="flex gap-4 mt-2">
                <a href={`mailto:${data.contact.email}`} className="text-xs text-indigo-600 hover:underline">{data.contact.email}</a>
                {data.contact.phone && <span className="text-xs text-slate-400">{data.contact.phone}</span>}
              </div>
            </div>
            {data.jobMatch && (
              <div className={cn(
                "px-3 py-1 rounded-full text-xs font-bold border uppercase tracking-tight",
                data.jobMatch.score >= 80 
                  ? "bg-emerald-50 text-emerald-700 border-emerald-100" 
                  : data.jobMatch.score >= 50 
                    ? "bg-amber-50 text-amber-700 border-amber-100" 
                    : "bg-slate-50 text-slate-700 border-slate-100"
              )}>
                {data.jobMatch.score >= 80 ? 'High Match' : data.jobMatch.score >= 50 ? 'Partial Match' : 'Low Match'}
              </div>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-10 flex-1">
            {/* Column 1: Experience & Education */}
            <div className="space-y-8">
              <section>
                <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-4">Experience</h3>
                <div className="space-y-6 relative">
                  <div className="absolute left-1 top-2 bottom-2 w-px bg-slate-100"></div>
                  {data.experience.map((exp, idx) => (
                    <div key={idx} className="relative pl-6">
                      <div className={cn(
                        "absolute left-0 top-1.5 w-2 h-2 rounded-full",
                        idx === 0 ? "bg-indigo-600" : "bg-slate-300"
                      )}></div>
                      <p className="text-sm font-bold text-slate-800">{exp.title} @ {exp.company}</p>
                      <p className="text-xs text-slate-400 line-clamp-1">{exp.duration}</p>
                    </div>
                  ))}
                </div>
              </section>

              <section>
                <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-4">Education</h3>
                <div className="space-y-4">
                  {data.education.map((edu, idx) => (
                    <div key={idx} className="p-4 bg-slate-50 rounded-xl border border-slate-100">
                      <p className="text-sm font-bold text-slate-800">{edu.degree}</p>
                      <p className="text-xs text-slate-500">{edu.school} • {edu.year}</p>
                    </div>
                  ))}
                </div>
              </section>
            </div>

            {/* Column 2: Skills & Insights */}
            <div className="space-y-8">
              <section>
                <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-4">Extracted Skills</h3>
                <div className="flex flex-wrap gap-2">
                  {data.skills.map((skill, idx) => (
                    <span 
                      key={idx} 
                      className={cn(
                        "px-2.5 py-1 rounded-md text-xs font-semibold border transition-colors",
                        idx < 4 
                          ? "bg-indigo-50 text-indigo-700 border-indigo-100" 
                          : "bg-slate-50 text-slate-600 border-slate-100"
                      )}
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </section>

              <section>
                <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-4">AI Career Pathing</h3>
                <div className="space-y-4">
                  <div>
                    <p className="text-[10px] font-bold text-slate-400 uppercase mb-2 tracking-tighter">Recommended Roles</p>
                    <div className="flex flex-wrap gap-2">
                      {data.aiInsights.suggestedRoles.map((role, idx) => (
                        <div key={idx} className="px-3 py-1 bg-indigo-50 text-indigo-700 rounded-lg text-xs font-bold border border-indigo-100/50">
                          {role}
                        </div>
                      ))}
                    </div>
                  </div>
                  
                  <div className="space-y-3">
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Growth Insights</p>
                    <ul className="space-y-3">
                      {data.aiInsights.strengths.slice(0, 2).map((str, idx) => (
                        <li key={idx} className="flex gap-3 text-sm text-slate-600">
                          <div className="w-5 h-5 bg-emerald-50 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                            <CheckCircle2 className="w-3 h-3 text-emerald-500" />
                          </div>
                          <span className="leading-tight text-xs">{str}</span>
                        </li>
                      ))}
                      {data.aiInsights.improvementTips.slice(0, 2).map((tip, idx) => (
                        <li key={idx} className="flex gap-3 text-sm text-slate-600">
                          <div className="w-5 h-5 bg-amber-50 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                            <Lightbulb className="w-3 h-3 text-amber-500" />
                          </div>
                          <span className="leading-tight text-xs italic">"{tip}"</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </section>
            </div>
          </div>

          <motion.section variants={item} className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-8 border-t border-slate-100 mt-8">
            <div className="space-y-4">
              <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest">Semantic Entities</h3>
              <div className="flex flex-wrap gap-2">
                {data.nlpInsights.entities?.slice(0, 10).map((ent, i) => (
                  <div key={i} className="flex flex-col p-2 bg-slate-50 border border-slate-200 rounded-lg min-w-[120px] max-w-[200px]">
                    <span className="text-[9px] text-slate-400 font-bold uppercase tracking-tighter">{ent.category}</span>
                    <span className="text-xs text-slate-800 font-semibold truncate">{ent.value}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest">Keyword Density</h3>
              <div className="space-y-2.5">
                {data.nlpInsights.keywordDensity?.slice(0, 5).map((kw, i) => (
                  <div key={i} className="flex items-center gap-3">
                    <div className="w-24 text-[10px] font-bold text-slate-500 truncate uppercase tracking-tight">{kw.keyword}</div>
                    <div className="flex-1 h-1.5 bg-slate-100 rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-indigo-600 rounded-full opacity-60" 
                        style={{ width: `${Math.min(kw.count * 10, 100)}%` }}
                      />
                    </div>
                    <div className="text-[10px] font-bold text-slate-400">{kw.count}</div>
                  </div>
                ))}
              </div>
            </div>
          </motion.section>

          <div className="print:hidden mt-auto pt-6 border-t border-slate-100 flex justify-end gap-3">
            <button 
              onClick={handleExportJSON}
              className="px-6 py-2.5 rounded-xl font-bold text-sm text-slate-500 hover:bg-slate-50 transition-colors"
            >
              Export JSON
            </button>
            <button 
              onClick={handlePrint}
              className="px-6 py-2.5 bg-indigo-600 rounded-xl font-bold text-sm text-white shadow-lg shadow-indigo-100 hover:bg-indigo-700 transition-all active:scale-95"
            >
              Download PDF
            </button>
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
}
