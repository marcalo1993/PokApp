'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { Pokemon, getDailyPokemon } from '@/lib/pokemon';
import { Star } from 'lucide-react';

interface RatingSystemProps {
  day: number;
  currentPlayer: number; // 1 para Iván, 2 para María
}

export default function RatingSystem({ day, currentPlayer }: RatingSystemProps) {
  const [imitation, setImitation] = useState(0);
  const [movement, setMovement] = useState(0);
  const [loading, setLoading] = useState(true);

  const [ratingsData, setRatingsData] = useState({
    p1_imitation: 0,
    p1_movement: 0,
    p2_imitation: 0,
    p2_movement: 0,
  });

  // El Pokémon del día se calcula de forma fija y distinta para cada jugador
  const pokemon: Pokemon = getDailyPokemon(day, currentPlayer);

  useEffect(() => {
    async function loadDayRatings() {
      setLoading(true);

      const { data } = await supabase
        .from('ratings')
        .select('*')
        .eq('day', day)
        .single();

      if (data) {
        setRatingsData({
          p1_imitation: data.p1_imitation || 0,
          p1_movement: data.p1_movement || 0,
          p2_imitation: data.p2_imitation || 0,
          p2_movement: data.p2_movement || 0,
        });

        if (currentPlayer === 1) {
          setImitation(data.p1_imitation || 0);
          setMovement(data.p1_movement || 0);
        } else {
          setImitation(data.p2_imitation || 0);
          setMovement(data.p2_movement || 0);
        }
      } else {
        // Inicializar fila si no existe
        await supabase.from('ratings').upsert({
          day,
          p1_imitation: 0,
          p1_movement: 0,
          p2_imitation: 0,
          p2_movement: 0,
        });
      }

      setLoading(false);
    }

    loadDayRatings();
  }, [day, currentPlayer]);

  const handleRate = async (type: 'imitation' | 'movement', value: number) => {
    if (type === 'imitation') setImitation(value);
    if (type === 'movement') setMovement(value);

    const updatePayload =
      currentPlayer === 1
        ? {
            p1_imitation: type === 'imitation' ? value : imitation,
            p1_movement: type === 'movement' ? value : movement,
          }
        : {
            p2_imitation: type === 'imitation' ? value : imitation,
            p2_movement: type === 'movement' ? value : movement,
          };

    setRatingsData(prev => ({
      ...prev,
      [currentPlayer === 1 ? (type === 'imitation' ? 'p1_imitation' : 'p1_movement') : (type === 'imitation' ? 'p2_imitation' : 'p2_movement')]: value,
    }));

    await supabase.from('ratings').update(updatePayload).eq('day', day);
  };

  if (loading) {
    return <div className="text-center py-12 text-slate-400">Cargando puntuaciones del día {day}...</div>;
  }

  const playerName = currentPlayer === 1 ? 'Iván' : 'María';

  return (
    <div className="bg-slate-800 border border-slate-700 rounded-2xl p-6 shadow-xl text-center space-y-6">
      <div className="flex justify-between items-center border-b border-slate-700 pb-3">
        <span className="text-xs uppercase tracking-widest text-amber-400 font-bold">Día {day} del Calendario</span>
        <span className="text-xs bg-slate-900 text-slate-300 px-3 py-1 rounded-full border border-slate-700">
          Turno de: <strong className="text-amber-300">{playerName}</strong>
        </span>
      </div>

      <div>
        <p className="text-xs text-slate-400 mb-1">Tu Pokémon asignado para hoy es:</p>
        <h2 className="text-2xl font-extrabold text-white mb-2">{pokemon.name}</h2>
        <div className="w-48 h-48 mx-auto bg-slate-900/60 rounded-2xl border border-slate-700/60 flex items-center justify-center p-4">
          <img src={pokemon.image} alt={pokemon.name} className="w-full h-full object-contain drop-shadow-lg" />
        </div>
      </div>

      {/* Selector de Puntuaciones */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-left bg-slate-900/80 p-4 rounded-xl border border-slate-700">
        <div className="space-y-2">
          <label className="text-sm font-medium text-slate-300 flex items-center gap-1">
            🎭 Imitación
          </label>
          <div className="flex gap-1">
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                type="button"
                onClick={() => handleRate('imitation', star)}
                className={`p-1 transition cursor-pointer ${
                  star <= imitation ? 'text-amber-400 scale-110' : 'text-slate-600 hover:text-slate-400'
                }`}
              >
                <Star size={24} fill={star <= imitation ? 'currentColor' : 'none'} />
              </button>
            ))}
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium text-slate-300 flex items-center gap-1">
            💃 Movimiento / Baile
          </label>
          <div className="flex gap-1">
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                type="button"
                onClick={() => handleRate('movement', star)}
                className={`p-1 transition cursor-pointer ${
                  star <= movement ? 'text-amber-400 scale-110' : 'text-slate-600 hover:text-slate-400'
                }`}
              >
                <Star size={24} fill={star <= movement ? 'currentColor' : 'none'} />
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="bg-slate-900/40 p-3 rounded-lg border border-slate-800 text-xs flex justify-around text-slate-400">
        <div>
          <p className="font-bold text-slate-300 mb-1">Iván</p>
          <p>🎭 {ratingsData.p1_imitation}★ | 💃 {ratingsData.p1_movement}★</p>
        </div>
        <div className="border-r border-slate-800"></div>
        <div>
          <p className="font-bold text-slate-300 mb-1">María</p>
          <p>🎭 {ratingsData.p2_imitation}★ | 💃 {ratingsData.p2_movement}★</p>
        </div>
      </div>
    </div>
  );
}