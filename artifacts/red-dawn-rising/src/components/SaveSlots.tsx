import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useGame } from '../hooks/useGame';
import { Save, FolderOpen, Trash2 } from 'lucide-react';

export function SaveSlotsModal({ onClose, mode }: { onClose: () => void; mode: 'save' | 'load' }) {
  const { saveToSlot, loadFromSlot, deleteSlot, listSlots } = useGame();
  const [slots, setSlots] = useState(() => listSlots());
  const [newName, setNewName] = useState('');

  const refresh = () => setSlots(listSlots());

  const handleSave = () => {
    if (!newName.trim()) return;
    saveToSlot(newName.trim());
    setNewName('');
    refresh();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/90 backdrop-blur-sm p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-full max-w-md bg-card border border-border p-6 space-y-4 max-h-[80vh] overflow-y-auto"
      >
        <div className="flex justify-between items-center border-b border-border pb-4">
          <h2 className="text-xl font-mono text-primary uppercase tracking-widest">
            {mode === 'save' ? 'Save Game' : 'Load Game'}
          </h2>
        </div>

        {mode === 'save' && (
          <div className="flex gap-2">
            <input
              type="text"
              value={newName}
              onChange={e => setNewName(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && handleSave()}
              placeholder="Save slot name..."
              className="flex-1 bg-background border border-border px-3 py-2 font-mono text-sm text-foreground placeholder-muted-foreground focus:border-primary outline-none"
            />
            <button
              onClick={handleSave}
              className="px-4 py-2 bg-primary text-primary-foreground font-mono text-sm uppercase hover:bg-primary/90"
            >
              <Save size={16} />
            </button>
          </div>
        )}

        <div className="space-y-2">
          {slots.length === 0 && (
            <p className="text-muted-foreground/50 text-sm font-mono italic text-center py-4">No saved games.</p>
          )}
          {slots.map(slot => (
            <div key={slot.name} className="flex items-center gap-2 p-3 border border-border hover:border-primary/50 transition-colors">
              <div className="flex-1 min-w-0">
                <div className="font-mono text-sm text-foreground truncate">{slot.name}</div>
                <div className="font-mono text-xs text-muted-foreground truncate">{slot.sceneTitle}</div>
                {slot.savedAt && (
                  <div className="font-mono text-xs text-muted-foreground/50">
                    {slot.savedAt ? (() => {
                      const d = new Date(slot.savedAt);
                      return isNaN(d.getTime()) ? slot.savedAt : d.toLocaleDateString();
                    })() : null}
                  </div>
                )}
              </div>
              {mode === 'load' && (
                <button
                  onClick={() => { loadFromSlot(slot.name); onClose(); }}
                  className="p-2 text-primary hover:bg-primary/10 transition-colors"
                  title="Load"
                >
                  <FolderOpen size={16} />
                </button>
              )}
              <button
                onClick={() => { deleteSlot(slot.name); refresh(); }}
                className="p-2 text-destructive/60 hover:text-destructive hover:bg-destructive/10 transition-colors"
                title="Delete"
              >
                <Trash2 size={16} />
              </button>
            </div>
          ))}
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
