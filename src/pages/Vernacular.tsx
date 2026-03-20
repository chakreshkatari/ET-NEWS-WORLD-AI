import { useState } from 'react';
import { motion } from 'motion/react';
import { translateAndAdapt } from '../services/ai';
import { Loader2, Languages, FileText, ArrowRight } from 'lucide-react';
import Markdown from 'react-markdown';

const MOCK_ARTICLE = `
The Reserve Bank of India (RBI) has decided to keep the repo rate unchanged at 6.5% for the eighth consecutive time. This decision comes amidst concerns over sticky food inflation, despite core inflation showing signs of moderation. The central bank has also retained its GDP growth projection for the current fiscal year at 7%, citing robust domestic demand and a recovery in rural consumption. However, the RBI Governor warned against premature rate cuts, emphasizing the need to bring inflation down to the 4% target on a durable basis.
`;

export default function Vernacular() {
  const [article, setArticle] = useState(MOCK_ARTICLE);
  const [language, setLanguage] = useState('Hindi');
  const [translatedText, setTranslatedText] = useState('');
  const [loading, setLoading] = useState(false);

  const languages = ['Hindi', 'Tamil', 'Telugu', 'Bengali', 'Marathi', 'Gujarati'];

  const handleTranslate = async () => {
    if (!article.trim()) return;
    setLoading(true);
    setTranslatedText('');
    try {
      const result = await translateAndAdapt(article, language);
      setTranslatedText(result);
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
        <h1 className="text-4xl font-bold tracking-tight text-zinc-100">Vernacular Engine</h1>
        <p className="text-zinc-400">Real-time, context-aware translation. Culturally adapted explanations, not literal translation.</p>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Input Section */}
        <div className="space-y-4 flex flex-col h-[600px]">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-medium text-zinc-200 flex items-center gap-2">
              <FileText className="w-5 h-5 text-amber-400" />
              English Source
            </h2>
          </div>
          <textarea
            value={article}
            onChange={(e) => setArticle(e.target.value)}
            className="flex-1 w-full bg-zinc-900/50 border border-zinc-800 rounded-2xl p-6 text-zinc-300 focus:outline-none focus:border-amber-500/50 resize-none leading-relaxed"
            placeholder="Paste English business news here..."
          />
        </div>

        {/* Output Section */}
        <div className="space-y-4 flex flex-col h-[600px]">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-medium text-zinc-200 flex items-center gap-2">
              <Languages className="w-5 h-5 text-amber-400" />
              Adapted Output
            </h2>
            <div className="flex items-center gap-2">
              <select
                value={language}
                onChange={(e) => setLanguage(e.target.value)}
                className="bg-zinc-900 border border-zinc-800 text-zinc-300 text-sm rounded-lg focus:ring-amber-500 focus:border-amber-500 block w-full p-2"
              >
                {languages.map(lang => (
                  <option key={lang} value={lang}>{lang}</option>
                ))}
              </select>
              <button
                onClick={handleTranslate}
                disabled={loading || !article.trim()}
                className="bg-amber-600 hover:bg-amber-500 text-white px-4 py-2 rounded-lg font-medium transition-colors disabled:opacity-50 flex items-center gap-2 shrink-0"
              >
                {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <><ArrowRight className="w-4 h-4" /> Translate</>}
              </button>
            </div>
          </div>
          
          <div className="flex-1 bg-zinc-900/40 border border-zinc-800 rounded-2xl p-6 overflow-y-auto">
            {loading ? (
              <div className="h-full flex items-center justify-center flex-col gap-4">
                <Loader2 className="w-8 h-8 animate-spin text-amber-500" />
                <p className="text-zinc-500 font-mono text-sm animate-pulse">Adapting context for {language} readers...</p>
              </div>
            ) : translatedText ? (
              <div className="prose prose-invert prose-amber max-w-none text-zinc-200 leading-relaxed">
                <Markdown>{translatedText}</Markdown>
              </div>
            ) : (
              <div className="h-full flex items-center justify-center text-zinc-600 text-sm text-center px-8">
                Click translate to see the culturally adapted {language} version. It will explain complex terms using local analogies.
              </div>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
}
