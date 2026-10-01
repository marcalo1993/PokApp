'use client';

import { Lock, Sparkles } from 'lucide-react';
import { getCurrentDayOfDecember } from '@/lib/pokemon';

interface CalendarProps {
  onSelectDay: (day: number) => void;
}

export default function Calendar({ onSelectDay }: CalendarProps) {
  const currentDay = getCurrentDayOfDecember();
  const totalDays = Array.from({ length: 31 }, (_, i) => i + 1);

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      <div className="text-center space-y-2">
        <h1 className="text-4xl font-extrabold text-red-600 tracking-tight">
          🎄 PokeApp Adviento 🎄
        </h1>
        <p className="text-gray-600 dark:text-gray-300">
          Abre el día correspondiente para descubrir e imitar a tu Pokémon.
        </p>
      </div>

      <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-3 sm:gap-4">
        {totalDays.map((day) => {
          const isToday = day === currentDay;
          const isUnlocked = day <= currentDay;

          return (
            <button
              key={day}
              disabled={!isUnlocked}
              onClick={() => isUnlocked && onSelectDay(day)}
              className={`
                relative h-24 sm:h-28 rounded-2xl p-3 flex flex-col justify-between items-center transition-all duration-300 transform font-bold
                ${
                  isToday
                    ? 'bg-gradient-to-br from-red-500 to-amber-500 text-white shadow-lg shadow-red-500/30 scale-105 ring-4 ring-yellow-400 hover:scale-110'
                    : isUnlocked
                    ? 'bg-white dark:bg-gray-800 text-gray-800 dark:text-white shadow-md hover:shadow-xl hover:-translate-y-1 hover:border-red-400 border-2 border-transparent'
                    : 'bg-gray-200 dark:bg-gray-800/40 text-gray-400 cursor-not-allowed opacity-60'
                }
              `}
            >
              <div className="w-full flex justify-between items-center text-xs">
                <span>Día</span>
                {isToday && <Sparkles className="w-4 h-4 text-yellow-300 animate-bounce" />}
              </div>

              <span className="text-2xl sm:text-3xl font-black">{day}</span>

              <div className="text-xs">
                {isUnlocked ? (
                  <span className={isToday ? 'text-yellow-200' : 'text-red-500'}>
                    {isToday ? '¡Hoy!' : 'Abrir'}
                  </span>
                ) : (
                  <Lock className="w-4 h-4 text-gray-400" />
                )}
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}