export interface PokemonDay {
  day: number;
  id: number;
  name: string;
  image: string;
  audio: string;
  hint: string;
}

export function getCurrentDayOfDecember(): number {
  const today = new Date();
  const month = today.getMonth(); // 11 es Diciembre (0-indexed)
  const date = today.getDate();

  if (month === 11) {
    return Math.min(Math.max(date, 1), 31);
  }
  return 1; // Por defecto el día 1 si no es Diciembre
}

export function getDailyPokemon(day: number): PokemonDay {
  // Fórmula pseudo-aleatoria pero fija para cada día
  const pokemonId = ((day * 37 + 13) % 151) + 1;

  return {
    day,
    id: pokemonId,
    name: `Pokemon #${pokemonId}`,
    image: `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${pokemonId}.png`,
    audio: `https://raw.githubusercontent.com/PokeAPI/cries/main/cries/pokemon/latest/${pokemonId}.ogg`,
    hint: `¡Adivina e imita los movimientos y sonidos del Pokémon #${pokemonId}!`,
  };
}