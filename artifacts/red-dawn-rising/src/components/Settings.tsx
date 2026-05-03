import React from 'react';
import { motion } from 'framer-motion';
import { useSettings, TextSpeed } from '../hooks/useSettings';
import { Settings as SettingsIcon } from 'lucide-react';

export function SettingsModal({ onClose }: { onClose: () => void }) {
  const { settings, updateSettings } = useSettings();

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/90 backdrop-blur-sm p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-full max-w-md bg-card border border-border p-6 space-y-6"
      >
        <div className="flex justify-between items-center border-b border-border pb-4">
          <div className="flex items-center gap-2">
            <SettingsIcon size={18} className="text-primary" />
            <h2 className="text-xl font-mono text-primary uppercase tracking-widest">Settings</h2>
          </div>
        </div>

        <div className="space-y-5">
          <div>
            <label className="block text-xs font-mono text-muted-foreground uppercase tracking-wider mb-3">Text Speed</label>
            <div className="flex gap-2">
              {(['slow', 'normal', 'fast'] as TextSpeed[]).map(speed => (
                <button
                  key={speed}
                  onClick={() => updateSettings({ textSpeed: speed })}
                  className={`flex-1 py-2 font-mono text-sm uppercase border transition-all ${settings.textSpeed === speed ? 'border-primary bg-primary/10 text-primary' : 'border-border text-muted-foreground hover:border-primary/50'}`}
                >
                  {speed}
                </button>
              ))}
            </div>
          </div>

          <div className="flex justify-between items-center">
            <label className="text-xs font-mono text-muted-foreground uppercase tracking-wider">Audio</label>
            <button
              onClick={() => updateSettings({ audioEnabled: !settings.audioEnabled })}
              className={`w-12 h-6 border transition-all relative ${settings.audioEnabled ? 'border-primary bg-primary/10' : 'border-border bg-transparent'}`}
            >
              <div className={`absolute top-1 w-4 h-4 bg-current transition-all ${settings.audioEnabled ? 'left-7 text-primary' : 'left-1 text-muted-foreground'}`} />
            </button>
          </div>

          <div className="flex justify-between items-center">
            <label className="text-xs font-mono text-muted-foreground uppercase tracking-wider">Reduce Motion</label>
            <button
              onClick={() => updateSettings({ reduceMotion: !settings.reduceMotion })}
              className={`w-12 h-6 border transition-all relative ${settings.reduceMotion ? 'border-primary bg-primary/10' : 'border-border bg-transparent'}`}
            >
              <div className={`absolute top-1 w-4 h-4 bg-current transition-all ${settings.reduceMotion ? 'left-7 text-primary' : 'left-1 text-muted-foreground'}`} />
            </button>
          </div>
        </div>

        <button
          onClick={onClose}
          className="w-full py-3 border border-border text-muted-foreground hover:text-foreground hover:bg-border/20 font-mono uppercase text-sm transition-colors"
        >
          Close
        </button>
      </motion.div>
    </div>
  );
}
