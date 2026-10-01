export interface Pokemon {
  id: number;
  name: string;
  image: string;
}

const UNCOMMON_POKEMON_IDS = [
  202, // Wobbuffet
  137, // Porygon
  143, // Snorlax
  35,  // Clefairy
  113, // Chansey
  122, // Mr. Mime
  95,  // Onix
  131, // Lapras
  83,  // Farfetch'd
  108, // Lickitung
  115, // Kangaskhan
  128, // Tauros
  142, // Aerodactyl
  138, // Omanyte
  140, // Kabuto
  81,  // Magnemite
  92,  // Gastly
  104, // Cubone
  118, // Goldeen
  123, // Scyther
  127, // Pinsir
  129, // Magikarp
  133, // Eevee
  147, // Dratini
  54,  // Psyduck
  52,  // Meowth
  63,  // Abra
  39,  // Jigglypuff
  79,  // Slowpoke
  100, // Voltorb
  109, // Koffing
  111, // Rhyhorn
  116, // Horsea
  120, // Staryu
  124, // Jynx
  125, // Electabuzz
  126, // Magmar
  130, // Gyarados
  134, // Vaporeon
  135, // Jolteon
  136, // Flareon
  144, // Articuno
  145, // Zapdos
  146, // Moltres
  150, // Mewtwo
  213, // Shuckle
  214, // Heracross
  222, // Corsola
  227, // Skarmory
  235, // Smeargle
  248, // Tyranitar
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

export function getDailyPokemon(day: number, player: number): Pokemon {
  const seed = day * 31 + player * 97;
  const arrayIndex = seed % UNCOMMON_POKEMON_IDS.length;
  
  const pokemonId = UNCOMMON_POKEMON_IDS[arrayIndex];
  const name = POKEMON_NAMES[pokemonId] || `Pokémon #${pokemonId}`;
  const image = `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${pokemonId}.png`;

  return {
    id: pokemonId,
    name,
    image,
  };
}

// Función auxiliar que el componente Calendar.tsx estaba buscando
export function getCurrentDayOfDecember(): number {
  const now = new Date();
  // Si estamos en diciembre, devuelve el día actual, o un valor por defecto (ej. 1) si no
  if (now.getMonth() === 11) {
    return now.getDate();
  }
  return 31; // Permite ver todos los días fuera de diciembre para probar
}