'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import Auth from '@/components/Auth';
import Calendar from '@/components/Calendar';
import RatingSystem from '@/components/RatingSystem';
import { getDailyPokemon } from '@/lib/pokemon';
import { LogOut } from 'lucide-react';

// Nuevo UID asignado al Jugador 1
const PLAYER_1_UID = 'c7da1c58-52ad-42eb-8e31-962d33435328';

export default function Home() {
  const [session, setSession] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [selectedDay, setSelectedDay] = useState<number | null>(null);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setLoading(false);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });

    return () => subscription.unsubscribe();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-900 text-white flex items-center justify-center">
        <p className="text-slate-400">Cargando PokApp...</p>
      </div>
    );
  }

  // Si no hay sesión iniciada, muestra el formulario de login
  if (!session) {
    return <Auth />;
  }

  // Identifica automáticamente si es Jugador 1 o Jugador 2
  const currentPlayer = session.user.id === PLAYER_1_UID ? 1 : 2;
  const pokemon = selectedDay ? getDailyPokemon(selectedDay) : null;

  return (
    <main className="min-h-screen bg-slate-900 text-white p-4 max-w-2xl mx-auto">
      <header className="flex items-center justify-between border-b border-slate-800 pb-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-amber-400">⚡ PokApp</h1>
          <p className="text-xs text-slate-400">
            Sesión: <span className="text-amber-300 font-semibold">{session.user.email}</span> (Jugador {currentPlayer})
          </p>
        </div>
        <button
          onClick={() => supabase.auth.signOut()}
          className="flex items-center gap-1 bg-slate-800 hover:bg-slate-700 text-xs text-slate-300 px-3 py-2 rounded-lg border border-slate-700 transition cursor-pointer"
        >
          <LogOut size={14} /> Salir
        </button>
      </header>

      {!selectedDay ? (
        <Calendar onSelectDay={(day) => setSelectedDay(day)} />
      ) : (
        <div className="space-y-6">
          <button
            onClick={() => setSelectedDay(null)}
            className="text-sm text-slate-400 hover:text-white mb-2 cursor-pointer"
          >
            ← Volver al calendario
          </button>
          
          {pokemon && (
            <RatingSystem
              day={selectedDay}
              pokemon={pokemon}
              currentPlayer={currentPlayer}
            />
          )}
        </div>
      )}
    </main>
  );
}