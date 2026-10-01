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

  useEffect(() => {
    async function fetchRatings() {
      setLoading(true);
      try {
        const { data, error } = await supabase
          .from('ratings')
          .select('player1_rating, player2_rating')
          .eq('day', day);

        if (error) {
          console.error('Error al obtener valoraciones:', error.message);
        } else if (data && data.length > 0) {
          setRatingPlayer1(data[0].player1_rating || 0);
          setRatingPlayer2(data[0].player2_rating || 0);
        } else {
          setRatingPlayer1(0);
          setRatingPlayer2(0);
        }
      } catch (err) {
        console.error('Excepción al cargar valoraciones:', err);
      } finally {
        setLoading(false);
      }
    }

    fetchRatings();
  }, [day]);

  const handleRate = async (stars: number) => {
    if (saving) return;
    setSaving(true);
    
    const newP1 = currentPlayer === 1 ? stars : ratingPlayer1;
    const newP2 = currentPlayer === 2 ? stars : ratingPlayer2;

    if (currentPlayer === 1) setRatingPlayer1(stars);
    if (currentPlayer === 2) setRatingPlayer2(stars);

    const { error } = await supabase
      .from('ratings')
      .upsert(
        {
          day: Number(day),
          pokemon_id: Number(pokemon.id),
          player1_rating: Number(newP1),
          player2_rating: Number(newP2),
        },
        { onConflict: 'day' }
      );

    if (error) {
      console.error('Error al guardar en Supabase:', error.message);
    }
    setSaving(false);
  };

  return (
    <div className="bg-slate-800 border border-slate-700 rounded-2xl p-6 shadow-xl max-w-md mx-auto text-center space-y-6">
      <div className="space-y-1">
        <span className="text-xs font-bold uppercase tracking-widest text-amber-400">
          Día {day} de Adviento
        </span>
        <h2 className="text-3xl font-black capitalize text-white tracking-wide">
          {pokemon.name}
        </h2>
      </div>

      <div className="relative w-48 h-48 mx-auto flex items-center justify-center bg-slate-900/50 rounded-xl p-4 border border-slate-700/50">
        <img
          src={pokemon.image}
          alt={pokemon.name}
          className="w-full h-full object-contain filter drop-shadow-lg"
        />
      </div>

      {loading ? (
        <p className="text-sm text-slate-400">Cargando puntuaciones...</p>
      ) : (
        <div className="space-y-4 pt-2">
          {/* Jugador 1 - Iván */}
          <div
            className={`p-4 rounded-xl border transition ${
              currentPlayer === 1
                ? 'bg-slate-700/60 border-amber-500/60 shadow-md'
                : 'bg-slate-900/40 border-slate-800 opacity-80'
            }`}
          >
            <p className="text-sm font-semibold mb-2 text-slate-300">
              Jugador 1 (Iván){' '}
              {currentPlayer === 1 && (
                <span className="text-amber-400 text-xs font-bold ml-1">(Tú)</span>
              )}
            </p>
            <div className="flex justify-center gap-2">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={`p1-${star}`}
                  type="button"
                  disabled={currentPlayer !== 1 || saving}
                  onClick={() => handleRate(star)}
                  className={`p-1 transition-transform ${
                    currentPlayer === 1
                      ? 'hover:scale-125 cursor-pointer active:scale-95'
                      : 'cursor-not-allowed'
                  }`}
                >
                  <Star
                    size={32}
                    className={
                      star <= ratingPlayer1
                        ? 'fill-amber-400 text-amber-400 drop-shadow'
                        : 'text-slate-600'
                    }
                  />
                </button>
              ))}
            </div>
          </div>

          {/* Jugador 2 - María */}
          <div
            className={`p-4 rounded-xl border transition ${
              currentPlayer === 2
                ? 'bg-slate-700/60 border-amber-500/60 shadow-md'
                : 'bg-slate-900/40 border-slate-800 opacity-80'
            }`}
          >
            <p className="text-sm font-semibold mb-2 text-slate-300">
              Jugador 2 (María){' '}
              {currentPlayer === 2 && (
                <span className="text-amber-400 text-xs font-bold ml-1">(Tú)</span>
              )}
            </p>
            <div className="flex justify-center gap-2">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={`p2-${star}`}
                  type="button"
                  disabled={currentPlayer !== 2 || saving}
                  onClick={() => handleRate(star)}
                  className={`p-1 transition-transform ${
                    currentPlayer === 2
                      ? 'hover:scale-125 cursor-pointer active:scale-95'
                      : 'cursor-not-allowed'
                  }`}
                >
                  <Star
                    size={32}
                    className={
                      star <= ratingPlayer2
                        ? 'fill-amber-400 text-amber-400 drop-shadow'
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