import React, { useState, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import Dropzone from './components/Dropzone';
import ResultsDashboard from './components/ResultsDashboard';
import ScanningOverlay from './components/ScanningOverlay';
import LiveActivity from './components/LiveActivity';
import { analyzeMediaIntegrity } from './services/geminiService';
import { AppState, AnalysisResult } from './types';
import { Aperture, Github, X, Sparkles, Shield, Radar, Globe } from 'lucide-react';

const App: React.FC = () => {
  const [appState, setAppState] = useState<AppState>(AppState.IDLE);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [showCamera, setShowCamera] = useState(false);
  const [caseId, setCaseId] = useState<string>("");
  
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // File processing
  const processFile = useCallback((file: File) => {
    const reader = new FileReader();
    reader.onload = async (e) => {
      if (e.target?.result) {
        const base64 = e.target.result as string;
        setSelectedImage(base64);
        runAnalysis(base64.split(',')[1]); // Remove data:image/type;base64,
      }
    };
    reader.readAsDataURL(file);
  }, []);

  // Analysis Logic
  const runAnalysis = async (base64Data: string) => {
    const newCaseId = Math.random().toString(36).substring(2, 10).toUpperCase();
    setCaseId(newCaseId);
    setAppState(AppState.ANALYZING);
    setErrorMsg(null);
    try {
      const data = await analyzeMediaIntegrity(base64Data);
      setResult(data);
      setAppState(AppState.RESULT);
    } catch (err) {
      console.error(err);
      const errorMessage = err instanceof Error ? err.message : "Analysis failed. Please ensure the image is valid and try again.";
      setErrorMsg(`Analysis failed: ${errorMessage}`);
      setAppState(AppState.ERROR);
    }
  };

  const handleReset = () => {
    setAppState(AppState.IDLE);
    setSelectedImage(null);
    setResult(null);
    setErrorMsg(null);
    setCaseId("");
  };

  // Camera Handling
  const startCamera = async () => {
    setShowCamera(true);
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'user' } });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
    } catch (err) {
      console.error("Camera access denied:", err);
      alert("Could not access camera. Please allow permissions.");
      setShowCamera(false);
    }
  };

  const stopCamera = () => {
     if (videoRef.current && videoRef.current.srcObject) {
         const stream = videoRef.current.srcObject as MediaStream;
         stream.getTracks().forEach(track => track.stop());
         videoRef.current.srcObject = null;
     }
     setShowCamera(false);
  };

  const capturePhoto = () => {
      if (videoRef.current && canvasRef.current) {
          const video = videoRef.current;
          const canvas = canvasRef.current;
          canvas.width = video.videoWidth;
          canvas.height = video.videoHeight;
          const ctx = canvas.getContext('2d');
          if (ctx) {
              ctx.drawImage(video, 0, 0);
              const base64 = canvas.toDataURL('image/jpeg');
              setSelectedImage(base64);
              stopCamera();
              runAnalysis(base64.split(',')[1]);
          }
      }
  };

  return (
    <div className="min-h-screen text-gray-100 font-sans selection:bg-brand-500/30">
      
      {/* Background Ambience */}
      <div className="fixed inset-0 z-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-1/4 w-[60vw] h-[60vw] max-w-[800px] max-h-[800px] bg-brand-900/10 rounded-full blur-[120px] mix-blend-screen animate-pulse-slow"></div>
        <div className="absolute bottom-0 right-1/4 w-[70vw] h-[70vw] max-w-[900px] max-h-[900px] bg-indigo-900/10 rounded-full blur-[140px] mix-blend-screen animate-pulse-slow" style={{ animationDelay: '2s' }}></div>
      </div>

      {/* Header */}
      <nav className="relative z-10 border-b border-white/5 bg-black/40 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="bg-brand-500/10 border border-brand-500/20 p-2 rounded-lg">
                <Aperture className="text-brand-400 w-6 h-6" />
            </div>
            <span className="text-xl font-bold tracking-tight text-white font-mono">TrueSight<span className="text-brand-500">_AI</span></span>
          </div>
          <div className="flex items-center gap-6">
            <div className="hidden md:flex items-center gap-6 text-sm font-medium text-gray-400">
                <span className="flex items-center gap-2 hover:text-brand-400 transition-colors cursor-pointer"><Radar size={14} /> Global Feed</span>
                <span className="flex items-center gap-2 hover:text-brand-400 transition-colors cursor-pointer"><Shield size={14} /> Forensics</span>
            </div>
            <div className="h-4 w-px bg-gray-800 hidden md:block"></div>
            <a href="https://github.com/uwddhruv" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-white transition-colors">
                <Github className="w-5 h-5" />
            </a>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="relative z-10 px-6 py-12 md:py-20 max-w-7xl mx-auto min-h-[calc(100vh-64px)] flex flex-col justify-center">
        
        <AnimatePresence mode="wait">
        {appState === AppState.IDLE && (
           <motion.div 
             key="idle-state"
             initial={{ opacity: 0, y: 20 }}
             animate={{ opacity: 1, y: 0 }}
             exit={{ opacity: 0, scale: 0.95 }}
             transition={{ duration: 0.5 }}
             className="w-full flex flex-col lg:flex-row gap-12 items-center"
           >
              {/* Left Column: Hero Text & Live Feed */}
              <div className="flex-1 w-full flex flex-col items-start text-left">
                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-brand-500/20 bg-brand-950/30 text-brand-300 text-sm font-mono mb-8 backdrop-blur-sm">
                  <Sparkles size={14} className="animate-pulse" />
                  <span>Powered by Gemini 3.0 Pro Vision</span>
                </div>
                
                <h1 className="text-5xl md:text-7xl font-bold text-white mb-6 tracking-tight leading-tight">
                  Verify Reality in <br/>
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-400 via-cyan-400 to-teal-400">The AI Age</span>
                </h1>
                
                <p className="text-lg text-gray-400 mb-8 max-w-xl leading-relaxed">
                  Real-time forensic analysis detecting deepfakes, GAN-synthesized faces, and digital manipulation with neural integrity scoring.
                </p>

                <div className="w-full max-w-xl mb-4">
                  <LiveActivity />
                </div>
              </div>
              
              {/* Right Column: Dropzone */}
              <div className="flex-1 w-full">
                <div className="bg-black/20 backdrop-blur-sm p-4 rounded-3xl border border-white/5 relative">
                   <div className="absolute top-0 right-0 p-4 opacity-50"><Globe size={100} className="text-brand-500 blur-2xl" /></div>
                   <Dropzone onFileSelect={processFile} onCameraSelect={startCamera} />
                </div>
              </div>
           </motion.div>
        )}

        {appState === AppState.ANALYZING && selectedImage && (
            <motion.div 
              key="analyzing-state"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              className="flex flex-col items-center w-full max-w-2xl mx-auto"
            >
                <h2 className="text-2xl font-bold mb-8 flex items-center gap-3 font-mono">
                    <span className="relative flex h-3 w-3">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-brand-400 opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-3 w-3 bg-brand-500"></span>
                    </span>
                    Forensic Scan in Progress
                </h2>
                <div className="relative w-full aspect-square md:aspect-video rounded-2xl overflow-hidden border border-brand-500/20 shadow-[0_0_50px_rgba(14,165,233,0.1)] bg-gray-900">
                    <img src={selectedImage} alt="Analysis Target" className="w-full h-full object-contain opacity-40 blur-sm" />
                    <ScanningOverlay />
                </div>
                <div className="mt-8 flex flex-col items-center gap-2">
                    <div className="font-mono text-xs text-brand-500/50 uppercase tracking-widest">Case ID</div>
                    <div className="font-mono text-lg text-brand-400 tracking-widest">{caseId}</div>
                </div>
            </motion.div>
        )}

        {appState === AppState.RESULT && result && (
            <motion.div
              key="result-state"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="w-full"
            >
                <ResultsDashboard result={result} onReset={handleReset} caseId={caseId} />
            </motion.div>
        )}

        {appState === AppState.ERROR && (
            <motion.div 
               key="error-state"
               initial={{ opacity: 0, scale: 0.95 }}
               animate={{ opacity: 1, scale: 1 }}
               exit={{ opacity: 0 }}
               className="glass-panel p-12 rounded-3xl text-center max-w-lg mx-auto border-danger-500/30"
            >
                <div className="w-20 h-20 bg-danger-500/10 rounded-full flex items-center justify-center mx-auto mb-6">
                    <X className="w-10 h-10 text-danger-500" />
                </div>
                <h2 className="text-2xl font-bold text-white mb-2">Analysis Interrupted</h2>
                <p className="text-gray-400 mb-8">{errorMsg}</p>
                <button 
                    onClick={handleReset} 
                    className="px-6 py-2 bg-gray-800 hover:bg-gray-700 text-white rounded-lg transition-colors border border-white/10"
                >
                    Return to Dashboard
                </button>
            </motion.div>
        )}
        </AnimatePresence>

      </main>

      {/* Footer */}
      <footer className="relative z-10 border-t border-white/5 bg-black/40 backdrop-blur-md mt-auto">
        <div className="max-w-7xl mx-auto px-6 py-6 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="text-sm text-gray-500 font-mono">
            © {new Date().getFullYear()} TrueSight AI. All rights reserved.
          </div>
          <div className="text-sm font-mono flex items-center gap-4">
            <span className="text-gray-400">Made by <span className="text-white font-semibold">Dhruv Vaniawala</span></span>
            <span className="text-gray-600">|</span>
            <a href="mailto:uwddhruv@gmail.com" className="text-brand-400 hover:text-brand-300 transition-colors">
              uwddhruv@gmail.com
            </a>
          </div>
        </div>
      </footer>

      {/* Camera Modal */}
      {showCamera && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/95 backdrop-blur-md p-4 animate-fade-in">
            <div className="bg-gray-900 border border-gray-800 rounded-3xl overflow-hidden max-w-2xl w-full relative shadow-2xl">
                <div className="p-4 border-b border-gray-800 flex justify-between items-center bg-gray-950">
                    <h3 className="font-semibold text-white font-mono flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse"></div>
                        LIVE FEED
                    </h3>
                    <button onClick={stopCamera} className="text-gray-400 hover:text-white transition-colors"><X size={20} /></button>
                </div>
                <div className="relative aspect-video bg-black">
                    <video ref={videoRef} autoPlay playsInline muted className="w-full h-full object-cover"></video>
                    <canvas ref={canvasRef} className="hidden"></canvas>
                    
                    {/* Camera Overlay Elements */}
                    <div className="absolute inset-0 border-[20px] border-black/20 pointer-events-none"></div>
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-16 h-16 border-2 border-white/30 rounded-full pointer-events-none"></div>
                    <div className="absolute bottom-4 left-4 text-xs font-mono text-white/50">ISO AUTO</div>
                </div>
                <div className="p-8 flex justify-center bg-gray-950 border-t border-gray-800">
                    <button 
                        onClick={capturePhoto} 
                        className="w-20 h-20 rounded-full border-4 border-white/20 flex items-center justify-center hover:bg-white/5 hover:border-white transition-all group"
                    >
                        <div className="w-16 h-16 bg-white rounded-full group-hover:scale-90 transition-transform"></div>
                    </button>
                </div>
            </div>
        </div>
      )}

    </div>
  );
};

export default App;