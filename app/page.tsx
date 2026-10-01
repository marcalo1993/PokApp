'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import Auth from '@/components/Auth';
import Calendar from '@/components/Calendar';
import RatingSystem from '@/components/RatingSystem';
import { LogOut, RotateCcw } from 'lucide-react';

const PLAYER_1_UID = 'c7da1c58-52ad-42eb-8e31-962d33435328';
const PLAYER_2_UID = '77ba133a-97ab-43aa-a82f-870633b435328';

export default function Home() {
  const [session, setSession] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [selectedDay, setSelectedDay] = useState<number | null>(null);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setLoading(false);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      setLoading(false);
      setSelectedDay(null);
    });

    return () => subscription.unsubscribe();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 text-white flex items-center justify-center">
        <p className="text-amber-400 font-medium animate-pulse">Cargando PokApp...</p>
      </div>
    );
  }

  if (!session) {
    return <Auth />;
  }

  const userEmail = session.user.email;
  const userId = session.user.id;

  let currentPlayer = 1;
  if (userId === PLAYER_2_UID) {
    currentPlayer = 2;
  } else if (userId === PLAYER_1_UID) {
    currentPlayer = 1;
  } else {
    currentPlayer = userEmail?.includes('maria') ? 2 : 1;
  }

  const handleReset = async () => {
    if (confirm('¿Seguro que quieres reiniciar todas las puntuaciones?')) {
      await supabase.from('ratings').delete().neq('day', 0);
      window.location.reload();
    }
  };

  return (
    <main className="min-h-screen bg-slate-950 text-white p-4 md:p-8">
      <div className="max-w-4xl mx-auto space-y-8">
        {/* Cabecera */}
        <header className="flex flex-col sm:flex-row justify-between items-center bg-slate-900 p-4 rounded-2xl border border-slate-800 gap-4 shadow-lg">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-amber-500 rounded-xl flex items-center justify-center font-black text-slate-950 text-xl shadow">
              ⚡
            </div>
            <div>
              <h1 className="text-lg font-bold text-white">Pokémon Advent Calendar</h1>
              <p className="text-xs text-slate-400">
                Jugador actual: <span className="text-amber-400 font-semibold">{currentPlayer === 1 ? 'Iván' : 'María'}</span> ({userEmail})
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* El botón de Reset solo se muestra cuando estás en el menú principal (selectedDay === null) */}
            {selectedDay === null && (
              <button
                onClick={handleReset}
                className="flex items-center gap-1.5 px-3 py-2 bg-rose-950/60 hover:bg-rose-900/80 text-rose-300 border border-rose-800/50 rounded-xl text-xs font-medium transition cursor-pointer"
                title="Reiniciar todas las puntuaciones"
              >
                <RotateCcw size={14} />
                Reset Partida
              </button>
            )}

            <button
              onClick={() => supabase.auth.signOut()}
              className="flex items-center gap-1.5 px-3 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl text-xs font-medium transition cursor-pointer"
            >
              <LogOut size={14} />
              Salir
            </button>
          </div>
        </header>

        {/* Contenido principal */}
        {selectedDay === null ? (
          <Calendar onSelectDay={(day) => setSelectedDay(day)} />
        ) : (
          <div className="space-y-4">
            <button
              onClick={() => setSelectedDay(null)}
              className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl text-xs font-medium transition cursor-pointer border border-slate-700"
            >
              ← Volver al Calendario
            </button>

            <RatingSystem day={selectedDay} currentPlayer={currentPlayer} />
          </div>
        )}
      </div>
    </main>
  );
}