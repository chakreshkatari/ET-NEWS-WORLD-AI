import { useState, useRef } from 'react';
import { motion } from 'motion/react';
import { generateVideoScript, generateAudioSpeech } from '../services/ai';
import { Loader2, Play, Pause, Video as VideoIcon, Volume2, FileText } from 'lucide-react';

const MOCK_ARTICLE = `
India's space agency, ISRO, successfully launched its latest communication satellite, GSAT-20, using SpaceX's Falcon 9 rocket from Cape Canaveral, Florida. This marks a significant collaboration between the Indian government agency and Elon Musk's private space company. The satellite, weighing 4,700 kg, is designed to provide high-speed internet connectivity to remote and unconnected regions of India, including the Andaman and Nicobar Islands and Lakshadweep. The launch is expected to significantly boost India's broadband infrastructure and support the Digital India initiative.
`;

export default function VideoStudio() {
  const [article, setArticle] = useState(MOCK_ARTICLE);
  const [script, setScript] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [activeScene, setActiveScene] = useState<number | null>(null);
  const [audioUrls, setAudioUrls] = useState<{ [key: number]: string }>({});
  const [playingAudio, setPlayingAudio] = useState<number | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const handleGenerate = async () => {
    if (!article.trim()) return;
    setLoading(true);
    setScript([]);
    setAudioUrls({});
    try {
      const result = await generateVideoScript(article);
      setScript(result);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const playAudio = async (sceneNumber: number, narration: string) => {
    if (playingAudio === sceneNumber) {
      audioRef.current?.pause();
      setPlayingAudio(null);
      return;
    }

    if (audioUrls[sceneNumber]) {
      if (audioRef.current) {
        audioRef.current.src = audioUrls[sceneNumber];
        audioRef.current.play();
        setPlayingAudio(sceneNumber);
      }
      return;
    }

    try {
      setActiveScene(sceneNumber);
      const base64Audio = await generateAudioSpeech(narration);
      if (base64Audio) {
        const url = `data:audio/mp3;base64,${base64Audio}`;
        setAudioUrls(prev => ({ ...prev, [sceneNumber]: url }));
        if (audioRef.current) {
          audioRef.current.src = url;
          audioRef.current.play();
          setPlayingAudio(sceneNumber);
        }
      }
    } catch (error) {
      console.error("Error generating audio:", error);
    } finally {
      setActiveScene(null);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-8"
    >
      <header className="space-y-2">
        <h1 className="text-4xl font-bold tracking-tight text-zinc-100">AI News Video Studio</h1>
        <p className="text-zinc-400">Transform articles into broadcast-quality short videos with AI narration and visuals.</p>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Input Section */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-medium text-zinc-200 flex items-center gap-2">
              <FileText className="w-5 h-5 text-indigo-400" />
              Source Article
            </h2>
          </div>
          <textarea
            value={article}
            onChange={(e) => setArticle(e.target.value)}
            className="w-full h-64 bg-zinc-900/50 border border-zinc-800 rounded-2xl p-4 text-zinc-300 focus:outline-none focus:border-indigo-500/50 resize-none"
            placeholder="Paste article text here..."
          />
          <button
            onClick={handleGenerate}
            disabled={loading || !article.trim()}
            className="w-full bg-indigo-600 hover:bg-indigo-500 text-white py-4 rounded-xl font-medium transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
          >
            {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <><VideoIcon className="w-5 h-5" /> Generate Video Storyboard</>}
          </button>
        </div>

        {/* Output Section */}
        <div className="bg-zinc-900/40 border border-zinc-800 rounded-2xl p-6 overflow-hidden flex flex-col h-[600px]">
          <h2 className="text-lg font-medium text-zinc-200 mb-4 flex items-center gap-2">
            <VideoIcon className="w-5 h-5 text-indigo-400" />
            Generated Storyboard
          </h2>

          {loading ? (
            <div className="flex-1 flex items-center justify-center flex-col gap-4">
              <Loader2 className="w-8 h-8 animate-spin text-indigo-500" />
              <p className="text-zinc-500 font-mono text-sm animate-pulse">Analyzing article & generating scenes...</p>
            </div>
          ) : script.length > 0 ? (
            <div className="flex-1 overflow-y-auto space-y-6 pr-2">
              {script.map((scene) => (
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: scene.sceneNumber * 0.1 }}
                  key={scene.sceneNumber}
                  className="bg-zinc-950 border border-zinc-800 rounded-xl p-4 relative overflow-hidden group"
                >
                  <div className="absolute top-0 left-0 w-1 h-full bg-indigo-500/50" />
                  
                  <div className="flex items-start justify-between mb-3">
                    <span className="text-xs font-mono text-indigo-400 bg-indigo-400/10 px-2 py-1 rounded">
                      SCENE {scene.sceneNumber}
                    </span>
                    <button
                      onClick={() => playAudio(scene.sceneNumber, scene.narration)}
                      disabled={activeScene === scene.sceneNumber}
                      className="p-2 bg-zinc-800 hover:bg-zinc-700 rounded-full text-zinc-300 transition-colors disabled:opacity-50"
                      title="Generate & Play Audio"
                    >
                      {activeScene === scene.sceneNumber ? (
                        <Loader2 className="w-4 h-4 animate-spin text-indigo-400" />
                      ) : playingAudio === scene.sceneNumber ? (
                        <Pause className="w-4 h-4 text-emerald-400" />
                      ) : (
                        <Volume2 className="w-4 h-4" />
                      )}
                    </button>
                  </div>

                  <div className="space-y-3">
                    <div>
                      <h4 className="text-xs uppercase tracking-wider text-zinc-500 font-semibold mb-1">Visual</h4>
                      <p className="text-sm text-zinc-300 italic border-l-2 border-zinc-800 pl-3 py-1">
                        {scene.visual}
                      </p>
                    </div>
                    <div>
                      <h4 className="text-xs uppercase tracking-wider text-zinc-500 font-semibold mb-1">Narration</h4>
                      <p className="text-sm text-zinc-100 font-medium leading-relaxed">
                        "{scene.narration}"
                      </p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          ) : (
            <div className="flex-1 flex items-center justify-center text-zinc-600 text-sm text-center px-8">
              Paste an article and click generate to see the AI break it down into a video storyboard with synthesized voiceover.
            </div>
          )}
        </div>
      </div>
      
      {/* Hidden audio element for playback */}
      <audio 
        ref={audioRef} 
        onEnded={() => setPlayingAudio(null)} 
        className="hidden" 
      />
    </motion.div>
  );
}
