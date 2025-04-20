
export interface Plant {
  id: string;
  name: string;
  scientificName: string;
  imageUrl: string;
  description: string;
  light: string;
  water: string;
  soil: string;
  funFact: string;
}

export const plants: Plant[] = [
  {
    id: "1",
    name: "Snake Plant",
    scientificName: "Sansevieria trifasciata",
    imageUrl: "https://via.placeholder.com/400",
    description: "The Snake Plant, or Mother-in-Law's Tongue, is one of the most tolerant houseplants you can find. It features stiff, upright leaves that range from 6 inches to 8 feet tall, depending on the variety.",
    light: "Low to bright indirect light",
    water: "Allow soil to dry between waterings",
    soil: "Well-draining potting mix",
    funFact: "Snake plants are excellent air purifiers, converting CO2 to oxygen at night, making them ideal bedroom plants."
  },
  {
    id: "2",
    name: "Monstera Deliciosa",
    scientificName: "Monstera deliciosa",
    imageUrl: "https://via.placeholder.com/400",
    description: "The Monstera Deliciosa, or Swiss Cheese Plant, is famous for its unique leaf holes and splits. It's a climbing evergreen plant native to Central America.",
    light: "Medium to bright indirect light",
    water: "Water when top 1-2 inches of soil is dry",
    soil: "Rich, well-draining potting mix",
    funFact: "The holes in Monstera leaves are called fenestrations and are believed to help the plant withstand heavy rain and allow light to reach lower leaves."
  },
  {
    id: "3",
    name: "Pothos",
    scientificName: "Epipremnum aureum",
    imageUrl: "https://via.placeholder.com/400",
    description: "Pothos, or Devil's Ivy, is a versatile trailing vine with heart-shaped leaves. It's one of the easiest houseplants to grow and care for.",
    light: "Low to bright indirect light",
    water: "Allow top 1-2 inches of soil to dry between waterings",
    soil: "Standard potting mix",
    funFact: "Pothos plants can grow over 40 feet long in their natural habitat but typically stay much shorter as houseplants."
  }
];
