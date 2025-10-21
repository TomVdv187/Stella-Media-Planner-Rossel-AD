import { RateCard } from '@/types';

export const rateCardData: RateCard[] = [
  {
    publication: "Le Soir",
    adTypes: [
      {
        name: "Publicité Display",
        positions: [
          {
            name: "Page entière",
            sizes: [
              { size: "275x380mm", price: 8500, description: "Page entière couleur" },
              { size: "275x380mm", price: 6800, description: "Page entière N&B" }
            ]
          },
          {
            name: "1/2 page",
            sizes: [
              { size: "275x185mm", price: 4500, description: "Demi-page horizontale couleur" },
              { size: "135x380mm", price: 4500, description: "Demi-page verticale couleur" },
              { size: "275x185mm", price: 3600, description: "Demi-page horizontale N&B" },
              { size: "135x380mm", price: 3600, description: "Demi-page verticale N&B" }
            ]
          },
          {
            name: "1/4 page",
            sizes: [
              { size: "135x185mm", price: 2400, description: "Quart de page couleur" },
              { size: "275x90mm", price: 2400, description: "Bandeau couleur" },
              { size: "135x185mm", price: 1900, description: "Quart de page N&B" },
              { size: "275x90mm", price: 1900, description: "Bandeau N&B" }
            ]
          },
          {
            name: "1/8 page",
            sizes: [
              { size: "135x90mm", price: 1300, description: "Huitième de page couleur" },
              { size: "66x185mm", price: 1300, description: "Colonne couleur" },
              { size: "135x90mm", price: 1050, description: "Huitième de page N&B" },
              { size: "66x185mm", price: 1050, description: "Colonne N&B" }
            ]
          }
        ]
      },
      {
        name: "Publicité Première Page",
        positions: [
          {
            name: "Bandeau Une",
            sizes: [
              { size: "275x45mm", price: 3200, description: "Bandeau première page" }
            ]
          },
          {
            name: "Carré Une",
            sizes: [
              { size: "66x66mm", price: 1800, description: "Carré première page" }
            ]
          }
        ]
      },
      {
        name: "Publicité Dernière Page",
        positions: [
          {
            name: "Page entière",
            sizes: [
              { size: "275x380mm", price: 10200, description: "Page entière dernière page couleur" }
            ]
          },
          {
            name: "1/2 page",
            sizes: [
              { size: "275x185mm", price: 5400, description: "Demi-page dernière page couleur" },
              { size: "135x380mm", price: 5400, description: "Demi-page verticale dernière page couleur" }
            ]
          }
        ]
      },
      {
        name: "Insertions",
        positions: [
          {
            name: "Insertion libre",
            sizes: [
              { size: "A4", price: 0.45, description: "Insertion A4 (prix par exemplaire)" },
              { size: "A5", price: 0.35, description: "Insertion A5 (prix par exemplaire)" },
              { size: "DL", price: 0.25, description: "Insertion DL (prix par exemplaire)" }
            ]
          }
        ]
      }
    ]
  },
  {
    publication: "Le Soir Weekend",
    adTypes: [
      {
        name: "Publicité Display",
        positions: [
          {
            name: "Page entière",
            sizes: [
              { size: "275x380mm", price: 6800, description: "Page entière couleur weekend" },
              { size: "275x380mm", price: 5400, description: "Page entière N&B weekend" }
            ]
          },
          {
            name: "1/2 page",
            sizes: [
              { size: "275x185mm", price: 3600, description: "Demi-page horizontale couleur weekend" },
              { size: "135x380mm", price: 3600, description: "Demi-page verticale couleur weekend" },
              { size: "275x185mm", price: 2900, description: "Demi-page horizontale N&B weekend" },
              { size: "135x380mm", price: 2900, description: "Demi-page verticale N&B weekend" }
            ]
          }
        ]
      }
    ]
  },
  {
    publication: "Site Web lesoir.be",
    adTypes: [
      {
        name: "Publicité Display Web",
        positions: [
          {
            name: "Leaderboard",
            sizes: [
              { size: "728x90px", price: 25, description: "Bandeau horizontal haut de page (CPM)" },
              { size: "970x250px", price: 35, description: "Super leaderboard (CPM)" }
            ]
          },
          {
            name: "Rectangle",
            sizes: [
              { size: "300x250px", price: 20, description: "Rectangle moyen (CPM)" },
              { size: "336x280px", price: 22, description: "Grand rectangle (CPM)" }
            ]
          },
          {
            name: "Skyscraper",
            sizes: [
              { size: "160x600px", price: 18, description: "Skyscraper large (CPM)" },
              { size: "120x600px", price: 15, description: "Skyscraper (CPM)" }
            ]
          }
        ]
      },
      {
        name: "Vidéo Pre-roll",
        positions: [
          {
            name: "Vidéo",
            sizes: [
              { size: "15s", price: 45, description: "Vidéo pre-roll 15 secondes (CPM)" },
              { size: "30s", price: 55, description: "Vidéo pre-roll 30 secondes (CPM)" }
            ]
          }
        ]
      }
    ]
  },
  {
    publication: "La Dernière Heure",
    adTypes: [
      {
        name: "Publicité Display",
        positions: [
          {
            name: "Page entière",
            sizes: [
              { size: "275x380mm", price: 7500, description: "Page entière couleur" },
              { size: "275x380mm", price: 6000, description: "Page entière N&B" }
            ]
          },
          {
            name: "1/2 page",
            sizes: [
              { size: "275x185mm", price: 4000, description: "Demi-page horizontale couleur" },
              { size: "135x380mm", price: 4000, description: "Demi-page verticale couleur" },
              { size: "275x185mm", price: 3200, description: "Demi-page horizontale N&B" },
              { size: "135x380mm", price: 3200, description: "Demi-page verticale N&B" }
            ]
          },
          {
            name: "1/4 page",
            sizes: [
              { size: "135x185mm", price: 2100, description: "Quart de page couleur" },
              { size: "275x90mm", price: 2100, description: "Bandeau couleur" },
              { size: "135x185mm", price: 1700, description: "Quart de page N&B" },
              { size: "275x90mm", price: 1700, description: "Bandeau N&B" }
            ]
          }
        ]
      }
    ]
  },
  {
    publication: "Sudinfo.be",
    adTypes: [
      {
        name: "Publicité Display Web",
        positions: [
          {
            name: "Leaderboard",
            sizes: [
              { size: "728x90px", price: 20, description: "Bandeau horizontal haut de page (CPM)" },
              { size: "970x250px", price: 30, description: "Super leaderboard (CPM)" }
            ]
          },
          {
            name: "Rectangle",
            sizes: [
              { size: "300x250px", price: 18, description: "Rectangle moyen (CPM)" },
              { size: "336x280px", price: 20, description: "Grand rectangle (CPM)" }
            ]
          },
          {
            name: "Skyscraper",
            sizes: [
              { size: "160x600px", price: 16, description: "Skyscraper large (CPM)" },
              { size: "120x600px", price: 13, description: "Skyscraper (CPM)" }
            ]
          }
        ]
      }
    ]
  },
  {
    publication: "dhnet.be",
    adTypes: [
      {
        name: "Publicité Display Web",
        positions: [
          {
            name: "Leaderboard",
            sizes: [
              { size: "728x90px", price: 22, description: "Bandeau horizontal haut de page (CPM)" },
              { size: "970x250px", price: 32, description: "Super leaderboard (CPM)" }
            ]
          },
          {
            name: "Rectangle",
            sizes: [
              { size: "300x250px", price: 19, description: "Rectangle moyen (CPM)" },
              { size: "336x280px", price: 21, description: "Grand rectangle (CPM)" }
            ]
          }
        ]
      }
    ]
  },
  {
    publication: "Newsletter Le Soir",
    adTypes: [
      {
        name: "Publicité Newsletter",
        positions: [
          {
            name: "Header",
            sizes: [
              { size: "600x120px", price: 450, description: "Bandeau header newsletter" }
            ]
          },
          {
            name: "Rectangle",
            sizes: [
              { size: "300x250px", price: 350, description: "Rectangle dans newsletter" }
            ]
          },
          {
            name: "Footer",
            sizes: [
              { size: "600x80px", price: 250, description: "Bandeau footer newsletter" }
            ]
          }
        ]
      }
    ]
  }
];

export function getRateCard(publication: string): RateCard | undefined {
  return rateCardData.find(card => card.publication === publication);
}

export function getAllPublications(): string[] {
  return rateCardData.map(card => card.publication);
}

export function getAdTypes(publication: string): string[] {
  const card = getRateCard(publication);
  return card ? card.adTypes.map(type => type.name) : [];
}

export function getPositions(publication: string, adType: string): string[] {
  const card = getRateCard(publication);
  if (!card) return [];
  
  const type = card.adTypes.find(t => t.name === adType);
  return type ? type.positions.map(pos => pos.name) : [];
}

export function getSizes(publication: string, adType: string, position: string) {
  const card = getRateCard(publication);
  if (!card) return [];
  
  const type = card.adTypes.find(t => t.name === adType);
  if (!type) return [];
  
  const pos = type.positions.find(p => p.name === position);
  return pos ? pos.sizes : [];
}

export function getPrice(publication: string, adType: string, position: string, size: string): number {
  const sizes = getSizes(publication, adType, position);
  const sizeObj = sizes.find(s => s.size === size);
  return sizeObj ? sizeObj.price : 0;
}