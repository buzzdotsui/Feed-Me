'use client';

import { motion } from 'framer-motion';

interface MoodOption {
  id: string;
  label: string;
  emoji: string;
  description: string;
}

interface Props {
  moods: MoodOption[];
  selected: string;
  onSelect: (id: string) => void;
}

export default function MoodChips({ moods, selected, onSelect }: Props) {
  return (
    <div className="flex gap-3 overflow-x-auto pb-2 px-4 -mx-4 scrollbar-none snap-x snap-mandatory">
      {moods.map((mood) => {
        const isSelected = selected === mood.id;
        return (
          <motion.button
            key={mood.id}
            onClick={() => onSelect(mood.id)}
            whileTap={{ scale: 0.94 }}
            className="snap-start flex-shrink-0 flex flex-col items-center px-4 py-3 rounded-2xl border-2 min-w-[110px] focus:outline-none transition-colors"
            style={{
              backgroundColor: isSelected ? '#FF6B35' : '#F9F5EE',
              borderColor: isSelected ? '#E85A24' : '#E5DDD0',
            }}
          >
            <span className="text-2xl mb-1">{mood.emoji}</span>
            <span
              className="text-xs font-bold leading-tight text-center"
              style={{ color: isSelected ? '#fff' : '#1A1208' }}
            >
              {mood.label}
            </span>
            <span
              className="text-[10px] leading-tight text-center mt-0.5"
              style={{ color: isSelected ? '#FFD4C2' : '#9B8B78' }}
            >
              {mood.description}
            </span>
          </motion.button>
        );
      })}
    </div>
  );
}
