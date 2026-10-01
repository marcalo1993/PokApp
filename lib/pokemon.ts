export interface Pokemon {
  id: number;
  name: string;
  image: string;
}

export const UNCOMMON_POKEMON_IDS = [
  202, 137, 143, 35, 113, 122, 95, 131, 83, 108, 115, 128, 142, 138, 140,
  81, 92, 104, 118, 123, 127, 129, 133, 147, 54, 52, 63, 39, 79, 100,
  109, 111, 116, 120, 124, 125, 126, 130, 134, 135, 136, 144, 145, 146,
  150, 213, 214, 222, 227, 235, 248
];

const POKEMON_NAMES: Record<number, string> = {
  202: 'Wobbuffet', 137: 'Porygon', 143: 'Snorlax', 35: 'Clefairy', 113: 'Chansey',
  122: 'Mr. Mime', 95: 'Onix', 131: 'Lapras', 83: "Farfetch'd", 108: 'Lickitung',
  115: 'Kangaskhan', 128: 'Tauros', 142: 'Aerodactyl', 138: 'Omanyte', 140: 'Kabuto',
  81: 'Magnemite', 92: 'Gastly', 104: 'Cubone', 118: 'Goldeen', 123: 'Scyther',
  127: 'Pinsir', 129: 'Magikarp', 133: 'Eevee', 147: 'Dratini', 54: 'Psyduck',
  52: 'Meowth', 63: 'Abra', 39: 'Jigglypuff', 79: 'Slowpoke', 100: 'Voltorb',
  109: 'Koffing', 111: 'Rhyhorn', 116: 'Horsea', 120: 'Staryu', 124: 'Jynx',
  125: 'Electabuzz', 126: 'Magmar', 130: 'Gyarados', 134: 'Vaporeon', 135: 'Jolteon',
  136: 'Flareon', 144: 'Articuno', 145: 'Zapdos', 146: 'Moltres', 150: 'Mewtwo',
  213: 'Shuckle', 214: 'Heracross', 222: 'Corsola', 227: 'Skarmory', 235: 'Smeargle', 248: 'Tyranitar'
};

export function getPokemonById(id: number): Pokemon {
  const name = POKEMON_NAMES[id] || `Pokémon #${id}`;
  const image = `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${id}.png`;
  return { id, name, image };
}

export function getRandomPokemonId(excludeIds: number[] = []): number {
  const available = UNCOMMON_POKEMON_IDS.filter(id => !excludeIds.includes(id));
  if (available.length === 0) return UNCOMMON_POKEMON_IDS[0];
  const randomIndex = Math.floor(Math.random() * available.length);
  return available[randomIndex];
}

export function getCurrentDayOfDecember(): number {
  const now = new Date();
  if (now.getMonth() === 11) {
    return now.getDate();
  }
  return 31;
}

// Compatibilidad por si page.tsx u otros componentes la invocan
export function getDailyPokemon(day: number, player: number): Pokemon {
  const seed = (day * 31 + player * 97) % UNCOMMON_POKEMON_IDS.length;
  return getPokemonById(UNCOMMON_POKEMON_IDS[seed]);
}