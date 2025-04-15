
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

// Automatically seed the marketplace when this module is imported
seedMarketplace();
