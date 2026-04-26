import React, { useRef, useState } from 'react';
import { Upload, FileImage, Camera } from 'lucide-react';

interface DropzoneProps {
  onFileSelect: (file: File) => void;
  onCameraSelect: () => void;
}

const Dropzone: React.FC<DropzoneProps> = ({ onFileSelect, onCameraSelect }) => {
  const [isDragActive, setIsDragActive] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragActive(true);
  };

  const handleDragLeave = () => {
    setIsDragActive(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      validateAndPassFile(e.dataTransfer.files[0]);
    }
  };

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      validateAndPassFile(e.target.files[0]);
    }
  };

  const validateAndPassFile = (file: File) => {
    if (!file.type.startsWith('image/')) {
        alert("Please upload an image file.");
        return;
    }
    onFileSelect(file);
  }

  return (
    <div className="w-full">
      <div 
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        className={`
            relative group
            border-2 border-dashed rounded-3xl p-8
            flex flex-col items-center justify-center text-center
            transition-all duration-300 ease-in-out
            cursor-pointer min-h-[360px]
            ${isDragActive 
                ? 'border-brand-500 bg-brand-500/10 scale-[1.02]' 
                : 'border-white/10 hover:border-brand-500/50 hover:bg-brand-900/20 bg-black/40' // Darker, sleeker baseline
            }
        `}
        onClick={() => inputRef.current?.click()}
      >
        {/* Futuristic Corner Accents */}
        <div className="absolute top-0 left-0 w-8 h-8 border-t-2 border-l-2 border-white/20 rounded-tl-3xl opacity-50 group-hover:border-brand-500 group-hover:opacity-100 transition-colors pointer-events-none"></div>
        <div className="absolute top-0 right-0 w-8 h-8 border-t-2 border-r-2 border-white/20 rounded-tr-3xl opacity-50 group-hover:border-brand-500 group-hover:opacity-100 transition-colors pointer-events-none"></div>
        <div className="absolute bottom-0 left-0 w-8 h-8 border-b-2 border-l-2 border-white/20 rounded-bl-3xl opacity-50 group-hover:border-brand-500 group-hover:opacity-100 transition-colors pointer-events-none"></div>
        <div className="absolute bottom-0 right-0 w-8 h-8 border-b-2 border-r-2 border-white/20 rounded-br-3xl opacity-50 group-hover:border-brand-500 group-hover:opacity-100 transition-colors pointer-events-none"></div>

        <input 
          type="file" 
          ref={inputRef} 
          onChange={handleFileInput} 
          className="hidden" 
          accept="image/*"
        />

        <div className={`
            w-24 h-24 rounded-full flex items-center justify-center mb-6 relative
            transition-all duration-500
            ${isDragActive ? 'bg-brand-500 text-white shadow-[0_0_40px_rgba(14,165,233,0.5)]' : 'bg-brand-950/50 text-brand-500 group-hover:bg-brand-900 group-hover:text-brand-400 group-hover:shadow-[0_0_30px_rgba(14,165,233,0.3)]'}
        `}>
          {/* Animated concentric rings */}
          <div className="absolute inset-[-10px] rounded-full border border-brand-500/10 group-hover:border-brand-500/30 group-hover:animate-ping-slow transition-colors"></div>
          <div className="absolute inset-[-20px] rounded-full border border-brand-500/5 group-hover:border-brand-500/10 transition-colors"></div>
          <Upload size={36} className={`transition-transform duration-500 ${isDragActive ? '-translate-y-2' : 'group-hover:-translate-y-1'}`} />
        </div>

        <h3 className="text-xl font-bold text-white mb-3 font-mono tracking-wide">
            INITIALIZE SCAN
        </h3>
        <p className="text-gray-400 text-sm max-w-[280px] mx-auto mb-8 leading-relaxed">
            Drag & drop media for deep neural analysis. Supported formats: JPG, PNG, WEBP.
        </p>

        <div className="flex flex-col sm:flex-row gap-3 w-full max-w-[280px]">
             <button 
                type="button"
                className="flex-1 py-3 px-4 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl text-sm font-medium text-white flex items-center justify-center gap-2 transition-all hover:scale-[1.02]"
                onClick={(e) => { e.stopPropagation(); inputRef.current?.click(); }}
             >
                <FileImage size={18} />
                Browse
             </button>
             <button 
                type="button"
                className="flex-1 py-3 px-4 bg-brand-500/20 hover:bg-brand-500/30 border border-brand-500/30 rounded-xl text-sm font-medium text-brand-300 flex items-center justify-center gap-2 transition-all hover:scale-[1.02] shadow-[0_0_15px_rgba(14,165,233,0.1)] group-hover:shadow-[0_0_20px_rgba(14,165,233,0.2)]"
                onClick={(e) => { e.stopPropagation(); onCameraSelect(); }}
             >
                <Camera size={18} />
                Camera
             </button>
        </div>
      </div>
      
      <div className="mt-6 flex justify-center gap-6 text-[10px] sm:text-xs text-gray-500 uppercase tracking-widest font-mono opacity-80">
        <div className="flex items-center gap-2">
            <div className="w-1.5 h-1.5 rounded-full bg-teal-500 shadow-[0_0_8px_rgba(20,184,166,0.8)]"></div>
            AES-256
        </div>
        <div className="flex items-center gap-2">
            <div className="w-1.5 h-1.5 rounded-full bg-brand-500 shadow-[0_0_8px_rgba(14,165,233,0.8)]"></div>
            Zero-Log
        </div>
        <div className="flex items-center gap-2">
            <div className="w-1.5 h-1.5 rounded-full bg-indigo-500 shadow-[0_0_8px_rgba(99,102,241,0.8)]"></div>
            Edge AI
        </div>
      </div>
    </div>
  );
};

export default Dropzone;