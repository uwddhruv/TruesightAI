import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Activity, ShieldAlert, Zap, Search, Server } from 'lucide-react';

type LogEntry = {
  id: string;
  timestamp: string;
  message: string;
  type: 'info' | 'alert' | 'success' | 'warning';
};

const templates = [
  { msg: "Analyzing facial geometry matrices...", type: "info" },
  { msg: "GAN artifact detected in eye reflection", type: "alert" },
  { msg: "Cross-referencing global synthetic database...", type: "info" },
  { msg: "Deep tensor network running inference", type: "info" },
  { msg: "Inconsistent lighting identified on subject jawline", type: "warning" },
  { msg: "Media origin traced to known synthetic source", type: "alert" },
  { msg: "Pixel manipulation probability: 87.4%", type: "warning" },
  { msg: "Integrity check passed. No anomalies found.", type: "success" },
  { msg: "Extracting noise profile signature...", type: "info" },
  { msg: "Matching biometric landmarks...", type: "info" }
];

const LiveActivity: React.FC = () => {
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const [nodesActive, setNodesActive] = useState(1042);

  useEffect(() => {
    // Initial logs
    const initial = Array.from({ length: 4 }).map((_, i) => createRandomLog());
    setLogs(initial);

    const interval = setInterval(() => {
      setLogs((prev) => {
        const newLogs = [createRandomLog(), ...prev];
        if (newLogs.length > 6) newLogs.pop();
        return newLogs;
      });
      
      setNodesActive(prev => prev + Math.floor(Math.random() * 5) - 2);
    }, 2500);

    return () => clearInterval(interval);
  }, []);

  const createRandomLog = (): LogEntry => {
    const template = templates[Math.floor(Math.random() * templates.length)];
    const date = new Date();
    return {
      id: Math.random().toString(36).substr(2, 9),
      timestamp: `${date.getHours().toString().padStart(2, '0')}:${date.getMinutes().toString().padStart(2, '0')}:${date.getSeconds().toString().padStart(2, '0')}.${date.getMilliseconds().toString().padStart(3, '0')}`,
      message: template.msg,
      type: template.type as 'info' | 'alert' | 'success' | 'warning',
    };
  };

  const getTypeStyle = (type: string) => {
    switch (type) {
      case 'alert': return 'text-danger-400';
      case 'warning': return 'text-amber-400';
      case 'success': return 'text-accent-400';
      default: return 'text-brand-300';
    }
  };

  return (
    <div className="w-full flex gap-6 overflow-hidden rounded-2xl border border-white/5 bg-black/40 backdrop-blur-md p-6 mt-8">
      {/* Network Status */}
      <div className="hidden md:flex flex-col min-w-[200px] border-r border-white/10 pr-6">
        <div className="flex items-center gap-2 mb-6">
          <Activity className="w-5 h-5 text-brand-500" />
          <h3 className="text-sm font-semibold text-white font-mono uppercase tracking-wider">Live Network</h3>
        </div>
        
        <div className="space-y-4">
          <div>
            <div className="text-xs text-gray-500 uppercase font-mono mb-1">Active Nodes</div>
            <div className="text-2xl font-bold text-white font-mono">{nodesActive.toLocaleString()}</div>
          </div>
          <div>
            <div className="text-xs text-gray-500 uppercase font-mono mb-1">Scans / Min</div>
            <div className="text-lg font-bold text-teal-400 font-mono">1,304</div>
          </div>
          <div>
            <div className="text-xs text-gray-500 uppercase font-mono mb-1">Model Version</div>
            <div className="text-sm font-medium text-brand-400 font-mono">TS-v3.0.4-PRO</div>
          </div>
        </div>
      </div>

      {/* Terminal Logs */}
      <div className="flex-1 flex flex-col relative w-full h-[180px] overflow-hidden">
        <div className="absolute top-0 left-0 right-0 h-4 bg-gradient-to-b from-black/40 to-transparent z-10 pointer-events-none"></div>
        <div className="absolute bottom-0 left-0 right-0 h-8 bg-gradient-to-t from-[#090b14] to-transparent z-10 pointer-events-none"></div>
        
        <div className="flex items-center gap-2 mb-4">
          <Server className="w-4 h-4 text-gray-500" />
          <span className="text-xs font-mono text-gray-500 uppercase">Global Ingestion Stream</span>
        </div>

        <div className="flex-1 flex flex-col gap-2 relative">
          <AnimatePresence>
            {logs.map((log) => (
              <motion.div
                key={log.id}
                initial={{ opacity: 0, x: -20, height: 0 }}
                animate={{ opacity: 1, x: 0, height: 'auto' }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.3 }}
                className="flex items-start gap-4 font-mono text-xs sm:text-sm"
              >
                <span className="text-gray-600 shrink-0">[{log.timestamp}]</span>
                <span className={`${getTypeStyle(log.type)}`}>
                  {log.message}
                </span>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
};

export default LiveActivity;
