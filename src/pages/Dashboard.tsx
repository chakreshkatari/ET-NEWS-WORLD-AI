import { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { generatePersonalizedFeed } from '../services/ai';
import { Loader2, TrendingUp, BookOpen, Briefcase } from 'lucide-react';

const MOCK_NEWS = [
  "RBI keeps repo rate unchanged at 6.5% for the 8th consecutive time.",
  "Reliance Industries announces a $10 billion investment in green energy projects over the next 3 years.",
  "Indian startup funding hits a 2-year high in Q1 2026, driven by AI and deeptech investments.",
  "New tax regulations for mutual funds introduced, impacting long-term capital gains.",
  "Global supply chain disruptions ease, leading to a drop in commodity prices.",
  "Tech giant launches a new AI model that outperforms competitors in reasoning tasks.",
  "Government announces a new scheme to boost semiconductor manufacturing in India.",
  "Stock market reaches an all-time high amid strong corporate earnings."
];

export default function Dashboard() {
  const [persona, setPersona] = useState('Investor');
  const [feed, setFeed] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  const personas = [
    { id: 'Investor', icon: TrendingUp, desc: 'Market impact & portfolio relevance' },
    { id: 'Startup Founder', icon: Briefcase, desc: 'Funding & competitor moves' },
    { id: 'Student', icon: BookOpen, desc: 'Explainers & foundational knowledge' },
  ];

  useEffect(() => {
    const fetchFeed = async () => {
      setLoading(true);
      try {
        const personalizedNews = await generatePersonalizedFeed(persona, MOCK_NEWS);
        setFeed(personalizedNews);
      } catch (error) {
        console.error("Error generating feed:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchFeed();
  }, [persona]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-8"
    >
      <header className="space-y-2">
        <h1 className="text-4xl font-bold tracking-tight text-zinc-100">My ET</h1>
        <p className="text-zinc-400">The Personalized Newsroom. Not just a filtered feed, a fundamentally different experience.</p>
      </header>

      {/* Persona Selector */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {personas.map((p) => (
          <button
            key={p.id}
            onClick={() => setPersona(p.id)}
            className={`p-4 rounded-2xl border transition-all duration-300 flex items-start gap-4 text-left ${
              persona === p.id
                ? 'bg-emerald-500/10 border-emerald-500/50 shadow-[0_0_15px_rgba(16,185,129,0.1)]'
                : 'bg-zinc-900/50 border-zinc-800 hover:border-zinc-700 hover:bg-zinc-800'
            }`}
          >
            <div className={`p-3 rounded-xl ${persona === p.id ? 'bg-emerald-500/20 text-emerald-400' : 'bg-zinc-800 text-zinc-400'}`}>
              <p.icon className="w-6 h-6" />
            </div>
            <div>
              <h3 className={`font-semibold ${persona === p.id ? 'text-emerald-400' : 'text-zinc-200'}`}>{p.id}</h3>
              <p className="text-xs text-zinc-500 mt-1">{p.desc}</p>
            </div>
          </button>
        ))}
      </div>

      {/* Feed */}
      <div className="space-y-6">
        <div className="flex items-center justify-between border-b border-zinc-800 pb-4">
          <h2 className="text-2xl font-semibold text-zinc-100">Your Briefing</h2>
          {loading && <Loader2 className="w-5 h-5 text-emerald-400 animate-spin" />}
        </div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="p-6 rounded-2xl bg-zinc-900/50 border border-zinc-800 animate-pulse h-48" />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {feed.map((item, index) => (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.1 }}
                key={item.id || index}
                className="group p-6 rounded-2xl bg-zinc-900/50 border border-zinc-800 hover:border-emerald-500/30 transition-all duration-300 flex flex-col h-full"
              >
                <div className="flex justify-between items-start mb-4">
                  <span className="text-xs font-mono uppercase tracking-wider text-emerald-400 bg-emerald-400/10 px-2 py-1 rounded-md">
                    {item.category}
                  </span>
                  <span className="text-xs text-zinc-500 font-mono">Match: {item.relevanceScore}%</span>
                </div>
                <h3 className="text-xl font-medium text-zinc-100 mb-3 group-hover:text-emerald-300 transition-colors">
                  {item.title}
                </h3>
                <p className="text-zinc-400 text-sm leading-relaxed flex-1">
                  {item.summary}
                </p>
                <div className="mt-6 pt-4 border-t border-zinc-800/50 flex justify-end">
                  <button className="text-sm text-emerald-400 hover:text-emerald-300 font-medium flex items-center gap-1">
                    Read Deep Dive &rarr;
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </motion.div>
  );
}
