
// Simulated plant data types and API functions
export interface Plant {
  id: string;
  name: string;
  family: string;
  genus: string;
  imageUrl?: string;
}

// Sample plants data
const plants: Plant[] = [
  {
    id: "1",
    name: "Monstera Deliciosa",
    family: "Araceae",
    genus: "Monstera",
    imageUrl: "/placeholder.svg"
  },
  {
    id: "2",
    name: "Snake Plant",
    family: "Asparagaceae",
    genus: "Dracaena",
    imageUrl: "/placeholder.svg"
  },
  {
    id: "3",
    name: "Peace Lily",
    family: "Araceae",
    genus: "Spathiphyllum",
    imageUrl: "/placeholder.svg"
  }
];

// API functions
export const getPlant = async (id: string): Promise<Plant> => {
  // Simulate API fetch with 500ms delay
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const plant = plants.find(p => p.id === id);
      if (plant) {
        resolve(plant);
      } else {
        reject(new Error("Plant not found"));
      }
    }, 500);
  });
};

export const updatePlant = async (plant: Plant): Promise<Plant> => {
  // Simulate API update with 500ms delay
  return new Promise((resolve) => {
    setTimeout(() => {
      const index = plants.findIndex(p => p.id === plant.id);
      if (index >= 0) {
        plants[index] = { ...plant };
      }
      resolve(plant);
    }, 500);
  });
};

export const deletePlant = async (id: string): Promise<void> => {
  // Simulate API delete with 500ms delay
  return new Promise((resolve) => {
    setTimeout(() => {
      const index = plants.findIndex(p => p.id === id);
      if (index >= 0) {
        plants.splice(index, 1);
      }
      resolve();
    }, 500);
  });
};
