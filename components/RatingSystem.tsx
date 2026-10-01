'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { Star } from 'lucide-react';

interface RatingSystemProps {
  day: number;
  myRole: 'jugador1' | 'jugador2';
}

interface RatingData {
  sound_score: number;
  movement_score: number;
  from_player: string;
}

export default function RatingSystem({ day, myRole }: RatingSystemProps) {
  const targetPlayer = myRole === 'jugador1' ? 'jugador2' : 'jugador1';

  const [soundScore, setSoundScore] = useState<number>(0);
  const [movementScore, setMovementScore] = useState<number>(0);
  const [hasVoted, setHasVoted] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [receivedRating, setReceivedRating] = useState<RatingData | null>(null);

  useEffect(() => {
    async function loadRatings() {
      if (!supabase) return;

      const { data: myVote } = await supabase
        .from('ratings')
        .select('*')
        .eq('day', day)
        .eq('from_player', myRole)
        .maybeSingle();

      if (myVote) {
        setSoundScore(myVote.sound_score);
        setMovementScore(myVote.movement_score);
        setHasVoted(true);
      }

      const { data: partnerVote } = await supabase
        .from('ratings')
        .select('*')
        .eq('day', day)
        .eq('from_player', targetPlayer)
        .maybeSingle();

      if (partnerVote) {
        setReceivedRating(partnerVote);
      }
    }

    loadRatings();

    if (!supabase) return;

    const channel = supabase
      .channel(`ratings_day_${day}`)
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'ratings',
          filter: `day=eq.${day}`,
        },
        (payload) => {
          const newVote = payload.new as RatingData;
          if (newVote.from_player === targetPlayer) {
            setReceivedRating(newVote);
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [day, myRole, targetPlayer]);

  async function submitRating() {
    if (soundScore === 0 || movementScore === 0) {
      alert('Por favor selecciona una puntuación para Sonido y Movimiento');
      return;
    }

    setLoading(true);

    if (!supabase) {
      alert('Supabase no está configurado aún');
      setLoading(false);
      return;
    }

    const { error } = await supabase.from('ratings').insert({
      day,
      from_player: myRole,
      to_player: targetPlayer,
      sound_score: soundScore,
      movement_score: movementScore,
    });

    setLoading(false);

    if (error) {
      console.error(error);
      alert('Error al guardar la puntuación');
    } else {
      setHasVoted(true);
    }
  }

  const RenderStars = ({
    value,
    onChange,
    disabled = false,
  }: {
    value: number;
    onChange?: (v: number) => void;
    disabled?: boolean;
  }) => (
    <div className="flex gap-1">
      {[1, 2, 3, 4, 5].map((star) => (
        <button
          key={star}
          type="button"
          disabled={disabled}
          onClick={() => onChange && onChange(star)}
          className={`p-1 transition-all ${
            disabled ? 'cursor-default' : 'hover:scale-110'
          }`}
        >
          <Star
            className={`w-7 h-7 ${
              star <= value
                ? 'fill-yellow-400 text-yellow-400'
                : 'text-gray-300 dark:text-gray-600'
            }`}
          />
        </button>
      ))}
    </div>
  );

  return (
    <div className="p-6 bg-white dark:bg-gray-800 rounded-2xl shadow-xl max-w-md mx-auto space-y-6 border border-gray-100 dark:border-gray-700">
      <div className="space-y-4">
        <h3 className="text-xl font-bold text-center text-red-500">
          🎯 Evalúa la imitación de tu Pareja
        </h3>

        <div className="space-y-2">
          <p className="text-sm font-medium">Sonido / Onomatopeya:</p>
          <RenderStars
            value={soundScore}
            onChange={setSoundScore}
            disabled={hasVoted}
          />
        </div>

        <div className="space-y-2">
          <p className="text-sm font-medium">Movimiento / Andares:</p>
          <RenderStars
            value={movementScore}
            onChange={setMovementScore}
            disabled={hasVoted}
          />
        </div>

        {!hasVoted ? (
          <button
            onClick={submitRating}
            disabled={loading}
            className="w-full py-3 bg-red-500 hover:bg-red-600 text-white font-bold rounded-xl transition-all shadow-md disabled:opacity-50"
          >
            {loading ? 'Guardando...' : 'Enviar Puntuación'}
          </button>
        ) : (
          <p className="text-center text-xs font-semibold text-green-500 bg-green-50 dark:bg-green-950 p-2 rounded-lg">
            ✓ ¡Ya has enviado tu puntuación de hoy!
          </p>
        )}
      </div>

      <hr className="border-gray-200 dark:border-gray-700" />

      <div className="space-y-3 text-center">
        <h4 className="text-lg font-semibold text-gray-700 dark:text-gray-200">
          🏆 Tu Puntuación de Hoy
        </h4>

        {receivedRating ? (
          <div className="bg-yellow-50 dark:bg-yellow-900/20 p-4 rounded-xl space-y-2 border border-yellow-200 dark:border-yellow-700">
            <p className="text-sm font-medium">¡Tu pareja te ha puntuado!</p>
            <div className="flex justify-around text-sm">
              <div>
                <p className="text-xs text-gray-500">Sonido</p>
                <p className="text-lg font-bold">⭐ {receivedRating.sound_score}/5</p>
              </div>
              <div>
                <p className="text-xs text-gray-500">Movimiento</p>
                <p className="text-lg font-bold">⭐ {receivedRating.movement_score}/5</p>
              </div>
            </div>
          </div>
        ) : (
          <div className="p-4 bg-gray-50 dark:bg-gray-900/50 rounded-xl">
            <p className="text-xs text-gray-500 animate-pulse">
              Esperando a que tu pareja te evalúe... ⏳
            </p>
          </div>
        )}
      </div>
    </div>
  );
}