'use client';

import { useState, useEffect } from 'react';
import Calendar from '@/components/Calendar';
import RatingSystem from '@/components/RatingSystem';
import { getDailyPokemon } from '@/lib/pokemon';
import { ArrowLeft, Volume2 } from 'lucide-react';

export default function Home() {
  const [selectedRole, setSelectedRole] = useState<'jugador1' | 'jugador2'>('jugador1');
  const [activeDay, setActiveDay] = useState<number | null>(null);
  const [pokemon, setPokemon] = useState<any | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    if (activeDay !== null) {
      setLoading(true);
      getDailyPokemon(activeDay, selectedRole).then((data) => {
        setPokemon(data);
        setLoading(false);
      });
    }
  }, [activeDay, selectedRole]);

  const playCry = () => {
    if (pokemon?.cryUrl) {
      const audio = new Audio(pokemon.cryUrl);
      audio.play().catch(() => {});
    }
  };

  return (
    <main className="min-h-screen bg-slate-100 dark:bg-slate-900 py-8 px-4">
      {/* Selector de Perfil */}
      <div className="max-w-md mx-auto mb-6 bg-white dark:bg-gray-800 p-2 rounded-xl flex shadow-sm border border-gray-200 dark:border-gray-700">
        <button
          onClick={() => setSelectedRole('jugador1')}
          className={`flex-1 py-2 text-sm font-bold rounded-lg transition-all ${
            selectedRole === 'jugador1'
              ? 'bg-red-500 text-white shadow-sm'
              : 'text-gray-500 hover:text-gray-800 dark:text-gray-400'
          }`}
        >
          👤 Jugador 1
        </button>
        <button
          onClick={() => setSelectedRole('jugador2')}
          className={`flex-1 py-2 text-sm font-bold rounded-lg transition-all ${
            selectedRole === 'jugador2'
              ? 'bg-red-500 text-white shadow-sm'
              : 'text-gray-500 hover:text-gray-800 dark:text-gray-400'
          }`}
        >
          👤 Jugador 2
        </button>
      </div>

      {/* Calendario vs Detalle del Pokémon */}
      {activeDay === null ? (
        <Calendar onSelectDay={(day) => setActiveDay(day)} />
      ) : (
        <div className="max-w-lg mx-auto space-y-6">
          <button
            onClick={() => setActiveDay(null)}
            className="flex items-center gap-2 text-sm font-semibold text-gray-600 dark:text-gray-300 hover:text-red-500 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" /> Volver al Calendario
          </button>

          <div className="bg-white dark:bg-gray-800 rounded-3xl p-6 shadow-xl text-center space-y-4 border border-gray-100 dark:border-gray-700">
            <span className="inline-block px-3 py-1 bg-red-100 dark:bg-red-950 text-red-600 dark:text-red-400 rounded-full text-xs font-bold">
              Día {activeDay} de Diciembre
            </span>

            {loading ? (
              <div className="py-12 text-gray-400 animate-pulse">Cargando Pokémon...</div>
            ) : pokemon ? (
              <>
                <img
                  src={pokemon.sprite}
                  alt={pokemon.name}
                  className="w-48 h-48 mx-auto drop-shadow-md hover:scale-105 transition-transform"
                />
                <h2 className="text-2xl font-black capitalize text-gray-800 dark:text-white">
                  {pokemon.name}
                </h2>

                {pokemon.cryUrl && (
                  <button
                    onClick={playCry}
                    className="inline-flex items-center gap-2 px-4 py-2 bg-slate-100 dark:bg-slate-700 text-xs font-bold rounded-full hover:bg-slate-200 transition-colors"
                  >
                    <Volume2 className="w-4 h-4 text-red-500" /> Escuchar grito original
                  </button>
                )}
              </>
            ) : null}
          </div>

          <RatingSystem day={activeDay} myRole={selectedRole} />
        </div>
      )}
    </main>
  );
}