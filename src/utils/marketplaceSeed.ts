
import { saveProduct, Product } from '@/lib/marketplaceService';

export const seedMarketplace = async () => {
  try {
    const sampleProduct = {
      title: 'Eco-Friendly Plant Pot',
      price: 24.99,
      category: 'plants accessories',
      description: 'A sustainable, handcrafted ceramic plant pot made from recycled materials. Perfect for indoor and outdoor plants.',
      image: '/placeholder.svg', // You can replace this with an actual image URL
      rating: 4.5,
      reviews: 12,
      stock: 50
    };

    const savedProduct = await saveProduct(sampleProduct);
    console.log('Sample product saved:', savedProduct);
    return savedProduct;
  } catch (error) {
    console.error('Error seeding marketplace:', error);
    return null;
  }
};

// Add a synchronous seeding function for direct localStorage use
export const seedLocalStorage = () => {
  const sampleProducts = [
    {
      id: 'local_123456',
      title: 'Eco-Friendly Plant Pot',
      price: 24.99,
      category: 'plants accessories',
      description: 'A sustainable, handcrafted ceramic plant pot made from recycled materials. Perfect for indoor and outdoor plants.',
      image: '/placeholder.svg',
      rating: 4.5,
      reviews: 12,
      stock: 50,
      createdAt: new Date()
    },
    {
      id: 'local_123457',
      title: 'Handmade Pet Bowl',
      price: 19.99,
      category: 'animal-accessories',
      description: 'A beautiful ceramic pet bowl, perfect for food or water. Comes in multiple colors.',
      image: '/placeholder.svg',
      rating: 4.8,
      reviews: 24,
      stock: 35,
      createdAt: new Date()
    }
  ];
  
  // Save directly to localStorage
  localStorage.setItem('products', JSON.stringify(sampleProducts));
  console.log('Sample products added to localStorage:', sampleProducts);
  return sampleProducts;
};
