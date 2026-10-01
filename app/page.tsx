'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import Auth from '@/components/Auth';
import Calendar from '@/components/Calendar';
import RatingSystem from '@/components/RatingSystem';
import { LogOut, RotateCcw, ArrowLeft, Calendar as CalendarIcon } from 'lucide-react';

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
        <header className="flex flex-col sm:flex-row justify-between items-center bg-slate-900/90 backdrop-blur-md p-4 md:p-5 rounded-2xl border border-slate-800 gap-4 shadow-xl">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 bg-gradient-to-br from-amber-400 to-amber-600 rounded-xl flex items-center justify-center font-black text-slate-950 text-xl shadow-lg shadow-amber-500/20">
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
                className="flex items-center gap-2 px-3.5 py-2 bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 border border-rose-500/30 hover:border-rose-500/50 rounded-xl text-xs font-semibold transition-all duration-200 cursor-pointer shadow-sm active:scale-95"
                title="Reiniciar partida y generar nuevos Pokémon"
              >
                <RotateCcw size={15} />
                <span>Reset Partida</span>
              </button>
            )}

            <button
              onClick={() => supabase.auth.signOut()}
              className="flex items-center gap-2 px-3.5 py-2 bg-slate-800/80 hover:bg-slate-700/80 text-slate-200 hover:text-white border border-slate-700/60 hover:border-slate-600 rounded-xl text-xs font-semibold transition-all duration-200 cursor-pointer shadow-sm active:scale-95"
            >
              <LogOut size={15} className="text-slate-400" />
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
              className="group flex items-center gap-2 px-4 py-2.5 bg-slate-900/90 hover:bg-slate-800 text-slate-300 hover:text-white rounded-xl text-xs font-semibold transition-all duration-200 cursor-pointer border border-slate-800 hover:border-slate-700 shadow-md active:scale-95"
            >
              <ArrowLeft size={16} className="transition-transform group-hover:-translate-x-1 text-amber-400" />
              <span>Volver al Calendario</span>
            </button>

            <RatingSystem day={selectedDay} currentPlayer={currentPlayer} />
          </div>
        )}
      </div>
    </main>
  );
}