import { useState } from 'react';
import { motion } from 'motion/react';
import { generateBriefing, answerBriefingQuestion } from '../services/ai';
import { Loader2, Search, MessageSquare, Send } from 'lucide-react';
import Markdown from 'react-markdown';

const MOCK_ARTICLES = [
  "The Finance Minister presented the Union Budget 2026 today, focusing heavily on infrastructure and digital public goods.",
  "Capital gains tax on equities remains unchanged, providing relief to retail investors who feared a hike.",
  "A new scheme for MSMEs was announced, offering collateral-free loans up to Rs 5 crore to boost manufacturing.",
  "The budget allocates a record Rs 12 lakh crore for capital expenditure, aiming to crowd-in private investment.",
  "Electric vehicle subsidies have been extended for another two years, but the subsidy amount per vehicle has been reduced by 20%.",
  "Fiscal deficit target for FY27 set at 4.5% of GDP, adhering to the fiscal consolidation glide path.",
  "Analysts say the budget is 'prudent' and balances growth with macroeconomic stability, though some sectors like real estate feel left out.",
  "Opposition leaders criticized the budget for not doing enough to address rural distress and unemployment."
];

export default function Briefings() {
  const [topic, setTopic] = useState('Union Budget 2026');
  const [briefing, setBriefing] = useState('');
  const [loading, setLoading] = useState(false);
  
  const [question, setQuestion] = useState('');
  const [chatHistory, setChatHistory] = useState<{role: 'user'|'ai', content: string}[]>([]);
  const [chatLoading, setChatLoading] = useState(false);

  const handleGenerate = async () => {
    if (!topic) return;
    setLoading(true);
    setBriefing('');
    setChatHistory([]);
    try {
      const result = await generateBriefing(topic, MOCK_ARTICLES);
      setBriefing(result);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleAskQuestion = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!question.trim() || !briefing) return;

    const userQ = question;
    setQuestion('');
    setChatHistory(prev => [...prev, { role: 'user', content: userQ }]);
    setChatLoading(true);

    try {
      const answer = await answerBriefingQuestion(topic, briefing, userQ);
      setChatHistory(prev => [...prev, { role: 'ai', content: answer }]);
    } catch (error) {
      console.error(error);
    } finally {
      setChatLoading(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-8 h-full flex flex-col"
    >
      <header className="space-y-2 shrink-0">
        <h1 className="text-4xl font-bold tracking-tight text-zinc-100">News Navigator</h1>
        <p className="text-zinc-400">Interactive Intelligence Briefings. Synthesize multiple articles into one explorable document.</p>
      </header>

      <div className="flex gap-4 shrink-0">
        <div className="relative flex-1">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-500" />
          <input
            type="text"
            value={topic}
            onChange={(e) => setTopic(e.target.value)}
            placeholder="Enter a topic to synthesize (e.g., Union Budget 2026)"
            className="w-full bg-zinc-900/80 border border-zinc-800 rounded-xl py-4 pl-12 pr-4 text-zinc-100 focus:outline-none focus:border-cyan-500/50 focus:ring-1 focus:ring-cyan-500/50 transition-all"
          />
        </div>
        <button
          onClick={handleGenerate}
          disabled={loading || !topic}
          className="bg-cyan-600 hover:bg-cyan-500 text-white px-8 rounded-xl font-medium transition-colors disabled:opacity-50 flex items-center gap-2"
        >
          {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Synthesize'}
        </button>
      </div>

      {loading && (
        <div className="flex-1 flex items-center justify-center">
          <div className="flex flex-col items-center gap-4 text-zinc-500">
            <Loader2 className="w-8 h-8 animate-spin text-cyan-500" />
            <p className="font-mono text-sm animate-pulse">Synthesizing 8 articles...</p>
          </div>
        </div>
      )}

      {briefing && !loading && (
        <div className="flex-1 grid grid-cols-1 lg:grid-cols-3 gap-8 min-h-0">
          {/* Briefing Document */}
          <div className="lg:col-span-2 bg-zinc-900/40 border border-zinc-800 rounded-2xl p-8 overflow-y-auto prose prose-invert prose-cyan max-w-none">
            <Markdown>{briefing}</Markdown>
          </div>

          {/* Interactive Q&A */}
          <div className="bg-zinc-900/80 border border-zinc-800 rounded-2xl flex flex-col overflow-hidden">
            <div className="p-4 border-b border-zinc-800 bg-zinc-900 flex items-center gap-2">
              <MessageSquare className="w-5 h-5 text-cyan-400" />
              <h3 className="font-medium text-zinc-200">Follow-up Questions</h3>
            </div>
            
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {chatHistory.length === 0 ? (
                <div className="text-center text-zinc-500 text-sm mt-10">
                  Ask anything about the briefing above.
                </div>
              ) : (
                chatHistory.map((msg, i) => (
                  <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                    <div className={`max-w-[85%] p-3 rounded-2xl text-sm ${
                      msg.role === 'user' 
                        ? 'bg-cyan-600/20 text-cyan-100 border border-cyan-500/30 rounded-tr-sm' 
                        : 'bg-zinc-800 text-zinc-300 rounded-tl-sm'
                    }`}>
                      <div className="prose prose-invert prose-sm max-w-none">
                        <Markdown>{msg.content}</Markdown>
                      </div>
                    </div>
                  </div>
                ))
              )}
              {chatLoading && (
                <div className="flex justify-start">
                  <div className="bg-zinc-800 p-3 rounded-2xl rounded-tl-sm">
                    <Loader2 className="w-4 h-4 animate-spin text-zinc-400" />
                  </div>
                </div>
              )}
            </div>

            <form onSubmit={handleAskQuestion} className="p-4 border-t border-zinc-800 bg-zinc-900/50">
              <div className="relative">
                <input
                  type="text"
                  value={question}
                  onChange={(e) => setQuestion(e.target.value)}
                  placeholder="Ask a question..."
                  className="w-full bg-zinc-950 border border-zinc-800 rounded-xl py-3 pl-4 pr-12 text-sm text-zinc-200 focus:outline-none focus:border-cyan-500/50"
                />
                <button
                  type="submit"
                  disabled={chatLoading || !question.trim()}
                  className="absolute right-2 top-1/2 -translate-y-1/2 p-1.5 text-cyan-500 hover:bg-cyan-500/10 rounded-lg disabled:opacity-50 transition-colors"
                >
                  <Send className="w-4 h-4" />
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </motion.div>
  );
}
