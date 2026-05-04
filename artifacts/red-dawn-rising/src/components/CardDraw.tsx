import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { DECK, ALLY_NAMES } from '../data/gameData';
import { useGame } from '../hooks/useGame';

const MOLE_SUCCESS_RATE = 0.58;

function getDrawWeight(cardId: string, drawnHistory: string[]): number {
  const drawCount = drawnHistory.filter(id => id === cardId).length;
  if (drawCount >= 4) return 0.3;
  if (drawCount === 3) return 0.6;
  if (drawCount === 2) return 0.85;
  return 1;
}

export function CardDrawModal({
  onComplete,
  count,
  title = 'Intercepted Intel',
  subtitle,
}: {
  onComplete: () => void;
  count: number;
  title?: string;
  subtitle?: string;
}) {
  const { state, dispatch } = useGame();
  const [drawn, setDrawn] = useState<typeof DECK>([]);
  const [revealed, setRevealed] = useState<number>(0);
  // Capture cardsDrawn at mount so the draw weights are stable for this session.
  const initialCardsDrawn = useRef(state.cardsDrawn);

  useEffect(() => {
    const pool = DECK.map(card => ({ card, weight: getDrawWeight(card.id, initialCardsDrawn.current) }));
    const shuffled: typeof DECK = [];
    const remaining = [...pool];
    for (let i = 0; i < count && remaining.length > 0; i++) {
      const totalWeight = remaining.reduce((sum, item) => sum + item.weight, 0);
      let rand = Math.random() * totalWeight;
      for (let j = 0; j < remaining.length; j++) {
        rand -= remaining[j].weight;
        if (rand <= 0) {
          shuffled.push(remaining[j].card);
          remaining.splice(j, 1);
          break;
        }
      }
    }
    setDrawn(shuffled);
  }, [count]);

  const removeRandomItem = () => {
    if (state.inventory.length > 0) {
      dispatch({ type: 'REMOVE_ITEM', payload: state.inventory[Math.floor(Math.random() * state.inventory.length)] });
    }
  };

  const handleCardEffect = (card: typeof DECK[0]) => {
    dispatch({ type: 'ADD_DRAWN_CARD', payload: card.id });

    switch (card.id) {
      case 'c1': { // Vanguard — stacks up to +3 total
        const currentMod = state.nextDieRollModifier || 0;
        // Only dispatch if we're below the cap; dispatching when currentMod=2 reaches exactly 3
        if (currentMod < 3) {
          dispatch({ type: 'MODIFY_NEXT_DIE_ROLL', payload: 1 });
        }
        const newMod = Math.min(currentMod + 1, 3);
        dispatch({ type: 'ADD_JOURNAL_ENTRY', payload: `Vanguard boost active (+${newMod} total)` });
        break;
      }

      case 'c6': // Apparatus
        dispatch({ type: 'MODIFY_NEXT_DIE_ROLL', payload: -1 });
        dispatch({ type: 'ADD_JOURNAL_ENTRY', payload: 'The Apparatus tightens its grip — state pressure increases.' });
        break;

      case 'c3': { // Proletariat — +50% bonus if Mike is in the cell
        const mikeBuff = state.flags.has_mike || state.flags.mike_recruited;
        const proletariatGain = mikeBuff ? 120 : 80;
        dispatch({ type: 'ADD_MEANS', payload: proletariatGain });
        if (mikeBuff) dispatch({ type: 'ADD_JOURNAL_ENTRY', payload: 'The Proletariat surges — Big Mike\'s union network amplified the solidarity dividend (+120 Means).' });
        break;
      }

      case 'c5': { // Strike — +50% bonus if Mike is in the cell
        const mikeStrike = state.flags.has_mike || state.flags.mike_recruited;
        const strikeGain = mikeStrike ? 150 : 100;
        dispatch({ type: 'ADD_MEANS', payload: strikeGain });
        if (mikeStrike) dispatch({ type: 'ADD_JOURNAL_ENTRY', payload: 'The Strike pays off double — Big Mike\'s workers delivered (+150 Means).' });
        break;
      }

      case 'c8': // Barricade
        dispatch({ type: 'SET_PROTECTED_SCENES', payload: 2 });
        break;

      case 'c10': // Red Dawn — cost reduction + momentum surge
        dispatch({ type: 'SET_RED_DAWN', payload: true });
        dispatch({ type: 'ADD_MEANS', payload: 40 });
        dispatch({ type: 'ADD_JOURNAL_ENTRY', payload: 'Red Dawn rises — costs reduced and momentum gained.' });
        break;

      case 'c2': { // Informant — escalating intel on repeat draws
        dispatch({ type: 'SET_FLAG', payload: { flag: 'suspect_alex', value: true } });
        const informantCount = state.journal.filter(j => j.startsWith('Informant Intel')).length + 1;
        const informantMessages = [
          "Encrypted intercept reveals a familiar pattern: controlled cadence, rehearsed emotion, communication style matching federal handler training. Someone near you is performing.",
          "Follow-up: Alex met with a handler near the riverfront at 02:00. Payment confirmed.",
          "Critical: Bank records link Alex to off-books federal accounts. High confidence.",
          "URGENT — Alex is burned. Recommend immediate extraction or elimination protocol.",
        ];
        dispatch({
          type: 'ADD_JOURNAL_ENTRY',
          payload: `Informant Intel #${informantCount} — ${informantMessages[Math.min(informantCount - 1, informantMessages.length - 1)]}`,
        });
        break;
      }

      case 'c4': { // Manifesto — escalating reach on repeat draws
        dispatch({ type: 'SET_FLAG', payload: { flag: 'manifesto_secret_dialogue', value: true } });
        const manifestoCount = state.journal.filter(j => j.startsWith('Manifesto Signal')).length + 1;
        dispatch({
          type: 'ADD_JOURNAL_ENTRY',
          payload: manifestoCount === 1
            ? 'Manifesto Signal #1 — A one-time covert line is open. You can ask one off-script question in a critical conversation.'
            : `Manifesto Signal #${manifestoCount} — The words spread further. New sympathizers are listening; the movement gains momentum.`,
        });
        break;
      }

      case 'c7': // Martyr
        removeRandomItem();
        break;

      case 'c9': { // Cipher — successive foreshadowing fragments
        dispatch({ type: 'SET_FLAG', payload: { flag: 'cipher_foreshadowing', value: true } });
        const cipherCount = state.journal.filter(j => j.startsWith('Cipher Fragment')).length + 1;
        const cipherFragments = [
          "'One soldier joins. One ledger burns. The smiling one opens the door from inside.'",
          "'When the clock strikes red, the old order falls. Trust the face you least expect.'",
          "'The final key was never hidden — it was carried by the one who asked no questions.'",
        ];
        dispatch({
          type: 'ADD_JOURNAL_ENTRY',
          payload: `Cipher Fragment #${cipherCount} — ${cipherFragments[Math.min(cipherCount - 1, cipherFragments.length - 1)]}`,
        });
        break;
      }

      case 'c11': { // The Cell — strengthen a random ally
        const ally = ALLY_NAMES[Math.floor(Math.random() * ALLY_NAMES.length)];
        dispatch({ type: 'MODIFY_ALLY_TRUST', payload: { ally, amount: 15 } });
        dispatch({ type: 'ADD_JOURNAL_ENTRY', payload: `The Cell activated — ${ally.charAt(0).toUpperCase() + ally.slice(1)}'s commitment to the cause deepens (+15 trust).` });
        break;
      }

      case 'c12': // Propaganda Drop
        dispatch({ type: 'ADD_MEANS', payload: 60 });
        dispatch({ type: 'MODIFY_SURVEILLANCE', payload: -10 });
        dispatch({ type: 'ADD_JOURNAL_ENTRY', payload: 'Propaganda Drop successful — pamphlets flooded the district. Means +60, surveillance pressure eased.' });
        break;

      case 'c13': { // The Mole — risky high-reward intel
        if (Math.random() < MOLE_SUCCESS_RATE) {
          // Success: funds + reduced heat from cleared contacts
          dispatch({ type: 'ADD_MEANS', payload: 160 });
          dispatch({ type: 'MODIFY_SURVEILLANCE', payload: -15 });
          dispatch({ type: 'ADD_JOURNAL_ENTRY', payload: 'The Mole came through — major intelligence haul. Critical intel secured and surveillance pressure eased.' });
        } else {
          removeRandomItem();
          dispatch({ type: 'MODIFY_SURVEILLANCE', payload: 35 });
          dispatch({ type: 'ADD_JOURNAL_ENTRY', payload: 'The Mole was turned. Heavy consequences — an asset seized, surveillance spiked.' });
        }
        break;
      }

      case 'c14': // Sabotage — state logistics disrupted
        dispatch({ type: 'MODIFY_SURVEILLANCE', payload: -25 });
        dispatch({ type: 'ADD_JOURNAL_ENTRY', payload: 'Sabotage successful. State logistics disrupted — surveillance pressure drops.' });
        break;

      case 'c15': // The Theorist — analytical edge, +1 die bonus
        dispatch({ type: 'SET_FLAG', payload: { flag: 'theorist_insight', value: true } });
        dispatch({ type: 'MODIFY_NEXT_DIE_ROLL', payload: 1 });
        dispatch({ type: 'ADD_JOURNAL_ENTRY', payload: 'The Theorist provides lasting strategic insight — analytical edge gained.' });
        break;
    }
  };

  const handleReveal = () => {
    if (revealed < count) {
      const card = drawn[revealed];
      handleCardEffect(card);
      setRevealed(r => r + 1);
    } else {
      onComplete();
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-background/95 backdrop-blur-md">
      <div className="flex flex-col items-center min-h-full py-12 px-4">
        <h2 className="text-2xl font-mono text-primary uppercase mb-2">{title}</h2>
        {subtitle && <p className="text-sm text-muted-foreground font-mono mb-8">{subtitle}</p>}
        {!subtitle && <div className="mb-8" />}

        <div className="flex gap-4 flex-wrap justify-center max-w-3xl">
          <AnimatePresence>
            {drawn.map((card, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.1 }}
                className={`w-48 h-72 border-2 ${idx < revealed ? 'border-primary bg-card' : 'border-border bg-border/20'} p-4 flex flex-col relative overflow-hidden`}
              >
                {idx < revealed ? (
                  <motion.div
                    initial={{ opacity: 0, rotateY: 90 }}
                    animate={{ opacity: 1, rotateY: 0 }}
                    className="h-full flex flex-col"
                  >
                    <div className="text-xs text-muted-foreground border-b border-border pb-2 mb-2 font-mono">DECRYPTED</div>
                    <h3 className="font-bold text-lg text-foreground mb-2 leading-tight">{card.name}</h3>
                    <p className="text-sm text-primary/80 font-mono mt-auto">{card.effectDescription}</p>
                  </motion.div>
                ) : (
                  <div className="flex items-center justify-center h-full text-muted-foreground/30 font-mono text-4xl">
                    ?
                  </div>
                )}
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

        <button
          onClick={handleReveal}
          className="mt-12 px-8 py-3 border border-primary text-primary hover:bg-primary hover:text-primary-foreground font-mono uppercase transition-colors"
        >
          {revealed < count ? 'Decrypt Next' : 'Acknowledge'}
        </button>
      </div>
    </div>
  );
}
