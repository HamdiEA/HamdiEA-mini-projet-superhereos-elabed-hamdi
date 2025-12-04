import fs from 'fs';
import path from 'path';

// Interface for the JSON superhero structure from your file
interface JSONHero {
  id: number;
  name: string;
  slug: string;
  powerstats: {
    intelligence: number;
    strength: number;
    speed: number;
    durability: number;
    power: number;
    combat: number;
  };
  appearance: {
    gender: string;
    race: string;
    height: string[];
    weight: string[];
    eyeColor: string;
    hairColor: string;
  };
  biography: {
    fullName: string;
    alterEgos: string;
    aliases: string[];
    placeOfBirth: string;
    firstAppearance: string;
    publisher: string;
    alignment: string;
  };
  work: {
    occupation: string;
    base: string;
  };
  connections: {
    groupAffiliation: string;
    relatives: string;
  };
  images: {
    xs: string;
    sm: string;
    md: string;
    lg: string;
  };
}

// Function to extract powers from powerstats
const extractPowers = (powerstats: JSONHero['powerstats']): string[] => {
  const powers: string[] = [];
  
  if (powerstats.intelligence > 70) powers.push('Intelligence');
  if (powerstats.strength > 70) powers.push('Super force');
  if (powerstats.speed > 70) powers.push('Super vitesse');
  if (powerstats.durability > 70) powers.push('Durabilite');
  if (powerstats.power > 70) powers.push('Pouvoirs surhumains');
  if (powerstats.combat > 70) powers.push('Combat');
  
  // Add specific powers based on very high stats
  if (powerstats.intelligence >= 90) powers.push('Genie intellectuel');
  if (powerstats.strength >= 90) powers.push('Force extreme');
  if (powerstats.speed >= 90) powers.push('Vitesse supersonique');
  
  return powers.length > 0 ? powers : ['Pouvoirs varies'];
};

// Function to normalize universe name
const normalizeUniverse = (publisher: string): string => {
  if (!publisher) return 'Autre';
  
  const marvelKeywords = ['Marvel Comics', 'Marvel', 'Timely Comics', 'Atlas Comics'];
  const dcKeywords = ['DC Comics', 'DC', 'Detective Comics', 'All-American Publications'];
  
  if (marvelKeywords.some(keyword => publisher.toLowerCase().includes(keyword.toLowerCase()))) {
    return 'Marvel';
  }
  
  if (dcKeywords.some(keyword => publisher.toLowerCase().includes(keyword.toLowerCase()))) {
    return 'DC';
  }
  
  return 'Autre';
};

// Function to create description from hero data
const createDescription = (hero: JSONHero): string => {
  const fullName = hero.biography.fullName || hero.name;
  const publisher = hero.biography.publisher;
  const occupation = hero.work.occupation;
  const alignment = hero.biography.alignment === 'good' ? 'heros' : 
                   hero.biography.alignment === 'bad' ? 'mechant' : 'anti-heros';
  
  let description = `${fullName} est un ${alignment} de l'univers ${publisher}.`;
  
  if (occupation && occupation !== '-') {
    description += ` Professionnellement, ${occupation.toLowerCase()}.`;
  }
  
  if (hero.biography.placeOfBirth && hero.biography.placeOfBirth !== '-') {
    description += ` Originaire de ${hero.biography.placeOfBirth}.`;
  }
  
  return description;
};

// Main transformation function
export const transformHeroData = (jsonHero: JSONHero) => {
  return {
    _id: jsonHero.id.toString(),
    nom: jsonHero.name,
    alias: jsonHero.biography.fullName || jsonHero.name,
    univers: normalizeUniverse(jsonHero.biography.publisher),
    pouvoirs: extractPowers(jsonHero.powerstats),
    description: createDescription(jsonHero),
    // The JSON contains relative image paths like "md/1-a-bomb.jpg".
    // When running with mock data (no MongoDB), these files are not present
    // locally, so map them to the Akabab superhero-api raw GitHub URLs
    // which host the same image files. This lets the frontend load images
    // directly when using mock data.
    image: (jsonHero.images.md || jsonHero.images.lg)
      ? `https://raw.githubusercontent.com/akabab/superhero-api/master/api/images/${jsonHero.images.md || jsonHero.images.lg}`
      : '',
    origine: jsonHero.biography.placeOfBirth || 'Inconnu',
    premiereApparition: jsonHero.biography.firstAppearance || 'Inconnue',
    createdAt: new Date(),
    updatedAt: new Date()
  };
};

// Function to load and transform all heroes from JSON file
export const loadAndTransformHeroes = () => {
  try {
    const filePath = path.join(__dirname, '..', 'SuperHerosComplet.json');
    
    if (!fs.existsSync(filePath)) {
      console.log('JSON file not found:', filePath);
      return [];
    }
    
    const jsonData = fs.readFileSync(filePath, 'utf8');
    const parsedData = JSON.parse(jsonData);
    
    if (!parsedData.superheros || !Array.isArray(parsedData.superheros)) {
      console.log('Invalid JSON structure - expected superheros array');
      return [];
    }
    
    const transformedHeroes = parsedData.superheros
      .filter((hero: any) => hero && hero.name && hero.id)
      .map((hero: JSONHero) => transformHeroData(hero));
    
    console.log(`Successfully transformed ${transformedHeroes.length} heroes`);
    return transformedHeroes;
    
  } catch (error) {
    console.error('Error transforming hero data:', error);
    return [];
  }
};