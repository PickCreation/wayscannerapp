
import { saveProduct, Product } from '@/lib/marketplaceService';

export const seedMarketplace = async () => {
  try {
    // Create multiple sample products
    const sampleProducts = [
      {
        title: 'Eco-Friendly Plant Pot',
        price: 24.99,
        category: 'plants-accessories',
        description: 'A sustainable, handcrafted ceramic plant pot made from recycled materials. Perfect for indoor and outdoor plants.',
        image: '/placeholder.svg',
        images: ['/placeholder.svg', '/placeholder.svg', '/placeholder.svg'],
        rating: 4.5,
        reviews: 12,
        stock: 50,
        seller: 'Green Thumb Co.',
        color: 'Terracotta',
        condition: 'New',
        weight: '2.5 kg',
        brand: 'EcoVase',
        country: 'USA',
        tags: ['eco-friendly', 'handmade', 'ceramic']
      },
      {
        title: 'Handmade Pet Bowl',
        price: 19.99,
        category: 'animal-accessories',
        description: 'A beautiful ceramic pet bowl, perfect for food or water. Comes in multiple colors.',
        image: '/placeholder.svg',
        images: ['/placeholder.svg', '/placeholder.svg'],
        rating: 4.8,
        reviews: 24,
        stock: 35,
        seller: 'Pet Lovers Inc.',
        color: 'Blue',
        condition: 'New',
        weight: '1.2 kg',
        brand: 'PawCraft',
        country: 'Canada',
        tags: ['pet-supplies', 'ceramic', 'handmade']
      },
      {
        title: 'Vintage Wooden Shelf',
        price: 49.99,
        category: 'decor',
        description: 'Handcrafted wooden shelf with vintage finish. Perfect for displaying plants, books or decorative items.',
        image: '/placeholder.svg',
        images: ['/placeholder.svg', '/placeholder.svg', '/placeholder.svg'],
        rating: 4.2,
        reviews: 18,
        stock: 15,
        seller: 'Rustic Home Goods',
        color: 'Walnut',
        condition: 'New',
        weight: '3.8 kg',
        brand: 'TimberCraft',
        country: 'UK',
        tags: ['home-decor', 'wooden', 'vintage']
      }
    ];

    // Save all products
    const savedProducts = [];
    for (const product of sampleProducts) {
      const savedProduct = await saveProduct(product);
      savedProducts.push(savedProduct);
      console.log('Sample product saved:', savedProduct);
    }
    
    return savedProducts;
  } catch (error) {
    console.error('Error seeding marketplace:', error);
    // If Firebase seeding fails, fall back to localStorage
    return seedLocalStorage();
  }
};

// Add a synchronous seeding function for direct localStorage use
export const seedLocalStorage = () => {
  console.log('Seeding localStorage directly');
  const sampleProducts = [
    {
      id: 'local_123456',
      title: 'Eco-Friendly Plant Pot',
      price: 24.99,
      category: 'plants-accessories',
      description: 'A sustainable, handcrafted ceramic plant pot made from recycled materials. Perfect for indoor and outdoor plants.',
      image: '/placeholder.svg',
      images: ['/placeholder.svg', '/placeholder.svg', '/placeholder.svg'],
      rating: 4.5,
      reviews: 12,
      stock: 50,
      createdAt: new Date(),
      seller: 'Green Thumb Co.',
      color: 'Terracotta',
      condition: 'New',
      weight: '2.5 kg',
      brand: 'EcoVase',
      country: 'USA',
      tags: ['eco-friendly', 'handmade', 'ceramic']
    },
    {
      id: 'local_123457',
      title: 'Handmade Pet Bowl',
      price: 19.99,
      category: 'animal-accessories',
      description: 'A beautiful ceramic pet bowl, perfect for food or water. Comes in multiple colors.',
      image: '/placeholder.svg',
      images: ['/placeholder.svg', '/placeholder.svg'],
      rating: 4.8,
      reviews: 24,
      stock: 35,
      createdAt: new Date(),
      seller: 'Pet Lovers Inc.',
      color: 'Blue',
      condition: 'New',
      weight: '1.2 kg',
      brand: 'PawCraft',
      country: 'Canada',
      tags: ['pet-supplies', 'ceramic', 'handmade']
    },
    {
      id: 'local_123458',
      title: 'Vintage Wooden Shelf',
      price: 49.99,
      category: 'decor',
      description: 'Handcrafted wooden shelf with vintage finish. Perfect for displaying plants, books or decorative items.',
      image: '/placeholder.svg',
      images: ['/placeholder.svg', '/placeholder.svg', '/placeholder.svg'],
      rating: 4.2,
      reviews: 18,
      stock: 15,
      createdAt: new Date(),
      seller: 'Rustic Home Goods',
      color: 'Walnut',
      condition: 'New',
      weight: '3.8 kg',
      brand: 'TimberCraft',
      country: 'UK',
      tags: ['home-decor', 'wooden', 'vintage']
    },
    {
      id: 'local_123459',
      title: 'Handwoven Macrame Wall Hanging',
      price: 34.99,
      category: 'decor',
      description: 'Beautiful bohemian wall hanging, handmade by artisans using sustainable cotton rope.',
      image: '/placeholder.svg',
      images: ['/placeholder.svg', '/placeholder.svg'],
      rating: 4.7,
      reviews: 32,
      stock: 20,
      createdAt: new Date(),
      seller: 'Boho Crafts',
      color: 'Natural',
      condition: 'New',
      weight: '0.8 kg',
      brand: 'BohoChic',
      country: 'Mexico',
      tags: ['home-decor', 'handmade', 'bohemian']
    },
    {
      id: 'local_123460',
      title: 'Organic Cat Treats',
      price: 12.99,
      category: 'animal-accessories',
      description: 'All-natural, grain-free cat treats made with organic ingredients. No artificial preservatives.',
      image: '/placeholder.svg',
      images: ['/placeholder.svg'],
      rating: 4.9,
      reviews: 45,
      stock: 60,
      createdAt: new Date(),
      seller: 'Happy Pets Co.',
      color: 'N/A',
      condition: 'New',
      weight: '0.3 kg',
      brand: 'OrganicPet',
      country: 'USA',
      tags: ['pet-food', 'organic', 'cat-supplies']
    }
  ];
  
  // Save directly to localStorage
  localStorage.setItem('products', JSON.stringify(sampleProducts));
  console.log('Sample products added to localStorage:', sampleProducts);
  return sampleProducts;
};
