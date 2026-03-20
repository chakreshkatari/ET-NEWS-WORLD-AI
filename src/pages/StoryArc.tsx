import { useState } from 'react';
import { motion } from 'motion/react';
import { generateStoryArc } from '../services/ai';
import { Loader2, Search, TrendingUp, Users, Activity, AlertCircle } from 'lucide-react';

export default function StoryArc() {
  const [topic, setTopic] = useState('The Rise of Quick Commerce in India');
  const [arcData, setArcData] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const handleGenerate = async () => {
    if (!topic.trim()) return;
    setLoading(true);
    setArcData(null);
    try {
      const result = await generateStoryArc(topic);
      setArcData(result);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-8"
    >
      <header className="space-y-2">
        <h1 className="text-4xl font-bold tracking-tight text-zinc-100">Story Arc Tracker</h1>
        <p className="text-zinc-400">Pick any ongoing business story and AI builds a complete visual narrative.</p>
      </header>

      <div className="flex gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-500" />
          <input
            type="text"
            value={topic}
            onChange={(e) => setTopic(e.target.value)}
            placeholder="Enter an ongoing story (e.g., The Rise of Quick Commerce in India)"
            className="w-full bg-zinc-900/80 border border-zinc-800 rounded-xl py-4 pl-12 pr-4 text-zinc-100 focus:outline-none focus:border-violet-500/50 focus:ring-1 focus:ring-violet-500/50 transition-all"
          />
        </div>
        <button
          onClick={handleGenerate}
          disabled={loading || !topic.trim()}
          className="bg-violet-600 hover:bg-violet-500 text-white px-8 rounded-xl font-medium transition-colors disabled:opacity-50 flex items-center gap-2"
        >
          {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Track Arc'}
        </button>
      </div>

      {loading && (
        <div className="py-20 flex flex-col items-center justify-center gap-4">
          <Loader2 className="w-8 h-8 animate-spin text-violet-500" />
          <p className="text-zinc-500 font-mono text-sm animate-pulse">Mapping timeline and extracting entities...</p>
        </div>
      )}

      {arcData && !loading && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Timeline */}
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-zinc-900/40 border border-zinc-800 rounded-2xl p-6">
              <h2 className="text-xl font-semibold text-zinc-100 mb-6 flex items-center gap-2">
                <Activity className="w-5 h-5 text-violet-400" />
                Interactive Timeline
              </h2>
              <div className="space-y-8 relative before:absolute before:inset-0 before:ml-5 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-zinc-800 before:to-transparent">
                {arcData.timeline.map((item: any, index: number) => (
                  <motion.div 
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    key={index} 
                    className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active"
                  >
                    <div className="flex items-center justify-center w-10 h-10 rounded-full border-4 border-zinc-950 bg-zinc-800 text-zinc-500 shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 shadow-[0_0_0_4px_rgba(24,24,27,1)] z-10">
                      <div className={`w-3 h-3 rounded-full ${
                        item.sentiment === 'positive' ? 'bg-emerald-500' : 
                        item.sentiment === 'negative' ? 'bg-rose-500' : 'bg-blue-500'
                      }`} />
                    </div>
                    <div className="w-[calc(100%-4rem)] md:w-[calc(50%-2.5rem)] bg-zinc-900/80 p-4 rounded-xl border border-zinc-800/50 hover:border-violet-500/30 transition-colors">
                      <div className="flex items-center justify-between mb-1">
                        <time className="font-mono text-xs text-violet-400">{item.date}</time>
                      </div>
                      <p className="text-zinc-300 text-sm leading-relaxed">{item.event}</p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>

          {/* Sidebar Info */}
          <div className="space-y-6">
            {/* Sentiment & Predictions */}
            <div className="bg-zinc-900/40 border border-zinc-800 rounded-2xl p-6 space-y-6">
              <div>
                <h3 className="text-sm font-semibold text-zinc-500 uppercase tracking-wider mb-2 flex items-center gap-2">
                  <TrendingUp className="w-4 h-4" /> Overall Sentiment
                </h3>
                <p className="text-zinc-200 font-medium">{arcData.overallSentiment}</p>
              </div>
              
              <div>
                <h3 className="text-sm font-semibold text-zinc-500 uppercase tracking-wider mb-3 flex items-center gap-2">
                  <AlertCircle className="w-4 h-4" /> What to Watch Next
                </h3>
                <ul className="space-y-3">
                  {arcData.predictions.map((pred: string, i: number) => (
                    <li key={i} className="text-sm text-zinc-300 flex items-start gap-2">
                      <span className="text-violet-500 mt-1">•</span>
                      <span>{pred}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Key Players */}
            <div className="bg-zinc-900/40 border border-zinc-800 rounded-2xl p-6">
              <h3 className="text-sm font-semibold text-zinc-500 uppercase tracking-wider mb-4 flex items-center gap-2">
                <Users className="w-4 h-4" /> Key Players
              </h3>
              <div className="space-y-4">
                {arcData.keyPlayers.map((player: any, i: number) => (
                  <div key={i} className="p-3 bg-zinc-950 rounded-xl border border-zinc-800/50">
                    <div className="font-medium text-zinc-200">{player.name}</div>
                    <div className="text-xs text-zinc-500 mb-2">{player.role}</div>
                    <div className="text-xs text-zinc-400 italic border-l-2 border-violet-500/50 pl-2 py-0.5">
                      "{player.stance}"
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Contrarian Perspectives */}
            <div className="bg-zinc-900/40 border border-zinc-800 rounded-2xl p-6">
              <h3 className="text-sm font-semibold text-zinc-500 uppercase tracking-wider mb-3">
                Contrarian Perspectives
              </h3>
              <ul className="space-y-3">
                {arcData.contrarianPerspectives.map((persp: string, i: number) => (
                  <li key={i} className="text-sm text-zinc-400 italic flex items-start gap-2">
                    <span className="text-rose-500/70 mt-1">"</span>
                    <span>{persp}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      )}
    </motion.div>
  );
}
