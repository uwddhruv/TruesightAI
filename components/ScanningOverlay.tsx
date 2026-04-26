import React, { useState, useEffect } from 'react';

const ANALYSIS_STEPS = [
  "Initializing neural perception layers...",
  "Extracting EXIF data and metadata...",
  "Mapping facial landmarks (68 points)...",
  "Analyzing corneal specular highlights...",
  "Checking localized noise distribution...",
  "Verifying light source consistency...",
  "Detecting frequency domain anomalies...",
  "Comparing texture gradients...",
  "Synthesizing forensic probability..."
];

const ScanningOverlay: React.FC = () => {
  const [currentStep, setCurrentStep] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentStep((prev) => (prev + 1) % ANALYSIS_STEPS.length);
    }, 800);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="absolute inset-0 z-20 overflow-hidden pointer-events-none rounded-xl">
      {/* Moving scan line */}
      <div className="absolute inset-x-0 h-0.5 bg-brand-400 shadow-[0_0_20px_rgba(56,189,248,1)] animate-scan opacity-90 top-0 z-10"></div>
      
      {/* High-tech grid overlay */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(14,165,233,0.15)_1px,transparent_1px),linear-gradient(90deg,rgba(14,165,233,0.15)_1px,transparent_1px)] bg-[size:32px_32px]"></div>
      
      {/* Vignette */}
      <div className="absolute inset-0 bg-radial-gradient(circle, transparent 60%, rgba(2,6,23,0.6) 100%)"></div>

      {/* Dynamic Reticle/Focus Box */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-1/2 h-1/2 border border-brand-500/30 rounded-lg">
          <div className="absolute top-0 left-0 w-4 h-4 border-l-2 border-t-2 border-brand-400 -translate-x-1 -translate-y-1"></div>
          <div className="absolute top-0 right-0 w-4 h-4 border-r-2 border-t-2 border-brand-400 translate-x-1 -translate-y-1"></div>
          <div className="absolute bottom-0 left-0 w-4 h-4 border-l-2 border-b-2 border-brand-400 -translate-x-1 translate-y-1"></div>
          <div className="absolute bottom-0 right-0 w-4 h-4 border-r-2 border-b-2 border-brand-400 translate-x-1 translate-y-1"></div>
      </div>

      {/* Terminal Log Output */}
      <div className="absolute bottom-6 left-6 right-6 font-mono text-xs md:text-sm">
        <div className="flex flex-col items-start space-y-1">
            {ANALYSIS_STEPS.slice(Math.max(0, currentStep - 2), currentStep + 1).map((step, idx) => (
                <div key={idx} className={`flex items-center gap-2 ${idx === 2 ? 'text-brand-300' : 'text-brand-500/50'}`}>
                    <span className="text-brand-500">❯</span>
                    <span className="bg-black/50 px-2 py-0.5 rounded">{step}</span>
                </div>
            ))}
             <div className="flex items-center gap-2 text-brand-400 animate-pulse">
                <span className="w-2 h-4 bg-brand-400 block"></span>
            </div>
        </div>
      </div>

      {/* Top right status */}
      <div className="absolute top-4 right-4 bg-black/60 backdrop-blur border border-brand-500/30 px-3 py-1 rounded text-xs font-mono text-brand-300">
        STATUS: PROCESSING
      </div>
    </div>
  );
};

export default ScanningOverlay;