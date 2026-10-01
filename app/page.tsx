'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import Auth from '@/components/Auth';
import Calendar from '@/components/Calendar';
import RatingSystem from '@/components/RatingSystem';
import { LogOut, RotateCcw, ArrowLeft } from 'lucide-react';

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

  const userEmail = session.user.email?.toLowerCase().trim() || '';

  let currentPlayer = 1; // Por defecto Iván
  if (userEmail === 'marcos.alo1993@gmail.com') {
    currentPlayer = 2; // María es el Jugador 2
  } else if (userEmail === 'ivan.navi93@gmail.com' || userEmail.includes('ivan')) {
    currentPlayer = 1; // Iván es el Jugador 1
  }

  const handleReset = async () => {
    if (confirm('¿Seguro que quieres reiniciar la partida? Se borrarán todas las puntuaciones y se sortearán nuevos Pokémon.')) {
      await supabase.from('ratings').delete().neq('day', 0);
      window.location.reload();
    }
  };

  return (
    <main className="min-h-screen bg-slate-950 text-white p-4 md:p-8">
      <div className="max-w-4xl mx-auto space-y-8">
        {/* Cabecera */}
        <header className="flex flex-col sm:flex-row justify-between items-center bg-slate-900 p-4 md:p-5 rounded-2xl border border-slate-800 gap-4 shadow-xl">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 bg-amber-500 rounded-xl flex items-center justify-center font-black text-slate-950 text-xl shadow-lg shadow-amber-500/20">
              ⚡
            </div>
            <div>
              <h1 className="text-lg font-bold text-white flex items-center gap-2">
                Pokémon Advent Calendar
              </h1>
              <p className="text-xs text-slate-400">
                Jugador actual: <span className="text-amber-400 font-semibold">{currentPlayer === 1 ? 'Iván' : 'María'}</span> ({userEmail})
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2.5">
            {selectedDay === null && (
              <button
                onClick={handleReset}
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl font-medium text-xs bg-rose-950/80 text-rose-300 border border-rose-800 hover:bg-rose-900 hover:text-white transition-all shadow-sm cursor-pointer"
                title="Reiniciar partida y generar nuevos Pokémon"
              >
                <RotateCcw size={15} />
                <span>Reset Partida</span>
              </button>
            )}

            <button
              onClick={() => supabase.auth.signOut()}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl font-medium text-xs bg-slate-800 text-slate-200 border border-slate-700 hover:bg-slate-700 hover:text-white transition-all shadow-sm cursor-pointer"
            >
              <LogOut size={15} />
              <span>Salir</span>
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
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl font-medium text-xs bg-slate-800 text-slate-200 border border-slate-700 hover:bg-slate-700 hover:text-white transition-all shadow-sm cursor-pointer"
            >
              <ArrowLeft size={15} className="text-amber-400" />
              <span>Volver al Calendario</span>
            </button>

            <RatingSystem day={selectedDay} currentPlayer={currentPlayer} />
          </div>
        )}
      </div>
    </main>
  );
}