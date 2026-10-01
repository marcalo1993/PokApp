'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { Star } from 'lucide-react';

interface RatingSystemProps {
  day: number;
  pokemon: {
    id: number;
    name: string;
    image: string;
  };
  currentPlayer: number;
}

export default function RatingSystem({ day, pokemon, currentPlayer }: RatingSystemProps) {
  const [ratingPlayer1, setRatingPlayer1] = useState<number>(0);
  const [ratingPlayer2, setRatingPlayer2] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(true);
  const [saving, setSaving] = useState<boolean>(false);

  // Cargar las puntuaciones guardadas de Supabase para este día
  useEffect(() => {
    async function fetchRatings() {
      setLoading(true);
      const { data, error } = await supabase
        .from('ratings')
        .select('*')
        .eq('day', day)
        .maybeSingle();

      if (data && !error) {
        setRatingPlayer1(data.player1_rating || 0);
        setRatingPlayer2(data.player2_rating || 0);
      } else {
        setRatingPlayer1(0);
        setRatingPlayer2(0);
      }
      setLoading(false);
    }

    fetchRatings();
  }, [day]);

  // Guardar la puntuación del jugador actual
  const handleRate = async (stars: number) => {
    setSaving(true);
    
    const newP1 = currentPlayer === 1 ? stars : ratingPlayer1;
    const newP2 = currentPlayer === 2 ? stars : ratingPlayer2;

    if (currentPlayer === 1) setRatingPlayer1(stars);
    if (currentPlayer === 2) setRatingPlayer2(stars);

    const { error } = await supabase
      .from('ratings')
      .upsert(
        {
          day: day,
          pokemon_id: pokemon.id,
          player1_rating: newP1,
          player2_rating: newP2,
        },
        { onConflict: 'day' }
      );

    if (error) {
      console.error('Error al guardar la puntuación:', error.message);
    }
    setSaving(false);
  };

  return (
    <div className="bg-slate-800 border border-slate-700 rounded-2xl p-6 shadow-xl max-w-md mx-auto text-center space-y-6">
      <div className="space-y-2">
        <span className="text-xs font-semibold uppercase tracking-wider text-amber-400">Día {day}</span>
        <h2 className="text-2xl font-bold capitalize">{pokemon.name}</h2>
      </div>

      <div className="relative w-48 h-48 mx-auto flex items-center justify-center bg-slate-900/50 rounded-xl p-4">
        <img
          src={pokemon.image}
          alt={pokemon.name}
          className="w-full h-full object-contain filter drop-shadow-lg"
        />
      </div>

      {loading ? (
        <p className="text-sm text-slate-400">Cargando puntuaciones...</p>
      ) : (
        <div className="space-y-6 pt-2">
          {/* Valoración del Jugador 1 */}
          <div className={`p-4 rounded-xl border transition ${currentPlayer === 1 ? 'bg-slate-700/50 border-amber-500/50' : 'bg-slate-900/30 border-slate-800'}`}>
            <p className="text-sm font-semibold mb-2 text-slate-300">
              Jugador 1 {currentPlayer === 1 && <span className="text-amber-400 text-xs">(Tú)</span>}
            </p>
            <div className="flex justify-center gap-1">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={`p1-${star}`}
                  disabled={currentPlayer !== 1 || saving}
                  onClick={() => handleRate(star)}
                  className={`p-1 transition ${currentPlayer === 1 ? 'hover:scale-110 cursor-pointer' : 'cursor-default'}`}
                >
                  <Star
                    size={28}
                    className={
                      star <= ratingPlayer1
                        ? 'fill-amber-400 text-amber-400'
                        : 'text-slate-600'
                    }
                  />
                </button>
              ))}
            </div>
          </div>

          {/* Valoración del Jugador 2 */}
          <div className={`p-4 rounded-xl border transition ${currentPlayer === 2 ? 'bg-slate-700/50 border-amber-500/50' : 'bg-slate-900/30 border-slate-800'}`}>
            <p className="text-sm font-semibold mb-2 text-slate-300">
              Jugador 2 {currentPlayer === 2 && <span className="text-amber-400 text-xs">(Tú)</span>}
            </p>
            <div className="flex justify-center gap-1">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={`p2-${star}`}
                  disabled={currentPlayer !== 2 || saving}
                  onClick={() => handleRate(star)}
                  className={`p-1 transition ${currentPlayer === 2 ? 'hover:scale-110 cursor-pointer' : 'cursor-default'}`}
                >
                  <Star
                    size={28}
                    className={
                      star <= ratingPlayer2
                        ? 'fill-amber-400 text-amber-400'
                        : 'text-slate-600'
                    }
                  />
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}