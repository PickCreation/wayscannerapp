import React, { useState } from "react";
import { ChevronLeft, ShoppingCart, Star, Heart, Share2, Plus, Minus } from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";

const products = [
  {
    id: 1,
    title: "Modern Plant Pot",
    price: 29.99,
    category: "Plants Accessories",
    image: "/lovable-uploads/5cf63fd0-114b-490f-96f9-b6b8dcc0b573.png",
    images: [
      "/lovable-uploads/5cf63fd0-114b-490f-96f9-b6b8dcc0b573.png",
      "/lovable-uploads/4c436a75-e04b-4265-8025-91e7bb146566.png",
      "/lovable-uploads/f2fb63ae-cc4d-4d46-ba4f-c70225d6d564.png",
    ],
    rating: 4.5,
    reviews: 124,
    description: "A beautiful modern plant pot perfect for your indoor plants. Made with high-quality ceramic and designed to complement any interior decor.",
    seller: "Green Thumb Co.",
    sellerRating: 4.8,
    available: true,
    condition: "New",
    weight: "2.5 kg",
    brand: "EcoPlant",
    country: "United States",
  },
  {
    id: 2,
    title: "Ceramic Dog Bowl",
    price: 19.99,
    category: "Animal Accessories",
    image: "/lovable-uploads/1044c752-2d75-49e0-836c-39ab8130a173.png",
    images: [
      "/lovable-uploads/1044c752-2d75-49e0-836c-39ab8130a173.png",
      "/lovable-uploads/1485fb6f-36f0-4eee-98e1-0a56eb978616.png",
      "/lovable-uploads/5cf63fd0-114b-490f-96f9-b6b8dcc0b573.png",
    ],
    rating: 4.2,
    reviews: 89,
    description: "A durable ceramic dog bowl that's easy to clean and perfect for your furry friend. Designed with a non-slip base to prevent spills.",
    seller: "Pet Haven",
    sellerRating: 4.6,
    available: true,
    condition: "New",
    weight: "1.2 kg",
    brand: "PetCare",
    country: "Canada",
  },
  {
    id: 3,
    title: "Monstera Plant",
    price: 34.99,
    category: "Plants",
    image: "/lovable-uploads/4c436a75-e04b-4265-8025-91e7bb146566.png",
    images: [
      "/lovable-uploads/4c436a75-e04b-4265-8025-91e7bb146566.png",
      "/lovable-uploads/5cf63fd0-114b-490f-96f9-b6b8dcc0b573.png",
      "/lovable-uploads/81f6d068-8c80-4e65-9ad0-2d3fe0a6f480.png",
    ],
    rating: 4.8,
    reviews: 215,
    description: "A healthy Monstera Deliciosa plant, perfect for adding a touch of nature to your home. Comes in a stylish pot and is easy to care for.",
    seller: "Urban Jungle",
    sellerRating: 4.9,
    available: true,
    condition: "New",
    weight: "3.5 kg",
    brand: "GreenLife",
    country: "Brazil",
  },
  {
    id: 4,
    title: "Bamboo Cutting Board",
    price: 24.99,
    category: "Kitchen Essentials",
    image: "/lovable-uploads/f2fb63ae-cc4d-4d46-ba4f-c70225d6d564.png",
    images: [
      "/lovable-uploads/f2fb63ae-cc4d-4d46-ba4f-c70225d6d564.png",
      "/lovable-uploads/81f6d068-8c80-4e65-9ad0-2d3fe0a6f480.png",
      "/lovable-uploads/1044c752-2d75-49e0-836c-39ab8130a173.png",
    ],
    rating: 4.6,
    reviews: 178,
    description: "A premium bamboo cutting board, perfect for all your kitchen needs. Durable, eco-friendly, and designed with a juice groove to prevent spills.",
    seller: "Kitchen Pros",
    sellerRating: 4.7,
    available: true,
    condition: "New",
    weight: "0.8 kg",
    brand: "EcoKitchen",
    country: "Japan",
  },
  {
    id: 5,
    title: "Macrame Wall Hanging",
    price: 39.99,
    category: "Decor",
    image: "/lovable-uploads/81f6d068-8c80-4e65-9ad0-2d3fe0a6f480.png",
    images: [
      "/lovable-uploads/81f6d068-8c80-4e65-9ad0-2d3fe0a6f480.png",
      "/lovable-uploads/f2fb63ae-cc4d-4d46-ba4f-c70225d6d564.png",
      "/lovable-uploads/4c436a75-e04b-4265-8025-91e7bb146566.png",
    ],
    rating: 4.7,
    reviews: 156,
    description: "A handcrafted macrame wall hanging that adds texture and style to any room. Made with 100% cotton rope and natural wooden beads.",
    seller: "Artisan Crafts",
    sellerRating: 4.8,
    available: true,
    condition: "New",
    weight: "0.5 kg",
    brand: "HandMade",
    country: "Mexico",
  },
  {
    id: 6,
    title: "Cat Climbing Tree",
    price: 89.99,
    category: "Animal Accessories",
    image: "/lovable-uploads/1485fb6f-36f0-4eee-98e1-0a56eb978616.png",
    images: [
      "/lovable-uploads/1485fb6f-36f0-4eee-98e1-0a56eb978616.png",
      "/lovable-uploads/1044c752-2d75-49e0-836c-39ab8130a173.png",
      "/lovable-uploads/81f6d068-8c80-4e65-9ad0-2d3fe0a6f480.png",
    ],
    rating: 4.3,
    reviews: 92,
    description: "A multi-level cat climbing tree with scratching posts, platforms, and cozy hideaways. Perfect for keeping your feline friend entertained and active.",
    seller: "Pet Palace",
    sellerRating: 4.5,
    available: true,
    condition: "New",
    weight: "12 kg",
    brand: "CatHaven",
    country: "Germany",
  }
];

const ProductDetailPage = () => {
  const navigate = useNavigate();
  const { productId } = useParams();
  const { toast } = useToast();
  const [quantity, setQuantity] = useState(1);
  const [selectedImage, setSelectedImage] = useState(0);
  
  const product = products.find(p => p.id === Number(productId));
  
  if (!product) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p>Product not found</p>
      </div>
    );
  }

  const handleAddToCart = () => {
    toast({
      title: "Added to Cart",
      description: `${quantity} × ${product.title} added to your cart`,
    });
  };

  const handleIncreaseQuantity = () => {
    setQuantity(prev => prev + 1);
  };

  const handleDecreaseQuantity = () => {
    if (quantity > 1) {
      setQuantity(prev => prev - 1);
    }
  };

  return (
    <div className="pb-24 bg-white min-h-screen">
      <header className="bg-wayscanner-blue text-white py-4 px-4 flex justify-between items-center">
        <button 
          className="p-2" 
          onClick={() => navigate(-1)}
        >
          <ChevronLeft size={24} color="white" />
        </button>
        <h1 className="text-xl font-bold">Product Details</h1>
        <button className="p-2">
          <ShoppingCart size={24} color="white" />
        </button>
      </header>

      <div className="w-full h-72 bg-gray-100">
        <img 
          src={product.images ? product.images[selectedImage] : product.image} 
          alt={product.title} 
          className="w-full h-full object-contain"
        />
      </div>

      {product.images && product.images.length > 1 && (
        <div className="px-4 py-2 flex space-x-2 overflow-x-auto">
          {product.images.slice(0, 6).map((img, index) => (
            <button 
              key={index} 
              className={`w-16 h-16 border ${selectedImage === index ? 'border-wayscanner-blue' : 'border-gray-300'}`}
              onClick={() => setSelectedImage(index)}
            >
              <img 
                src={img} 
                alt={`${product.title} - view ${index + 1}`} 
                className="w-full h-full object-cover"
              />
            </button>
          ))}
        </div>
      )}

      <div className="p-4">
        <div className="flex justify-between items-start mb-2">
          <h2 className="text-xl font-bold">{product.title}</h2>
          <div className="flex space-x-2">
            <Button size="icon" variant="ghost" className="h-9 w-9">
              <Heart size={20} />
            </Button>
            <Button size="icon" variant="ghost" className="h-9 w-9">
              <Share2 size={20} />
            </Button>
          </div>
        </div>
        
        <div className="mb-3">
          <p className="text-sm text-gray-600">Category: {product.category}</p>
          <p className="text-sm text-gray-600">Seller: {product.seller}</p>
        </div>
        
        <div className="flex items-center mb-3">
          <Star size={18} className="text-yellow-500 fill-current" />
          <span className="text-sm ml-1">{product.rating}</span>
          <span className="text-sm text-gray-500 ml-1">({product.reviews} reviews)</span>
        </div>
        
        <p className="text-2xl font-bold text-wayscanner-blue mb-4">${product.price.toFixed(2)}</p>
      </div>
      
      <div className="px-4">
        <Tabs defaultValue="description">
          <TabsList className="grid grid-cols-2 mb-2">
            <TabsTrigger value="description">Description</TabsTrigger>
            <TabsTrigger value="reviews">Reviews ({product.reviews})</TabsTrigger>
          </TabsList>
          <TabsContent value="description" className="pt-2">
            <p className="text-gray-700 mb-4">{product.description}</p>
            
            {/* Product additional details */}
            <div className="mt-6 space-y-4 border-t pt-4">
              <h3 className="font-medium text-lg">Product Details</h3>
              
              <div className="grid grid-cols-2 gap-y-3">
                <div className="text-gray-600">Color:</div>
                <div className="font-medium">{product.color || "Not specified"}</div>
                
                <div className="text-gray-600">Condition:</div>
                <div className="font-medium">{product.condition || "New"}</div>
                
                <div className="text-gray-600">Weight:</div>
                <div className="font-medium">{product.weight || "Not specified"}</div>
                
                <div className="text-gray-600">Brand:</div>
                <div className="font-medium">{product.brand || "Not specified"}</div>
                
                <div className="text-gray-600">Country:</div>
                <div className="font-medium">{product.country || "Not specified"}</div>
              </div>
            </div>
          </TabsContent>
          <TabsContent value="reviews" className="pt-2">
            <div className="flex items-center mb-4">
              <div className="flex items-center">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star
                    key={star}
                    size={18}
                    className={`${
                      star <= Math.floor(product.rating)
                        ? "text-yellow-500 fill-current"
                        : "text-gray-300"
                    }`}
                  />
                ))}
              </div>
              <span className="ml-2 text-sm font-medium text-gray-700">
                {product.rating} out of 5
              </span>
            </div>
            <p className="text-sm text-gray-500">Reviews are coming soon!</p>
          </TabsContent>
        </Tabs>
      </div>
      
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t p-4 flex items-center justify-between">
        <div className="flex items-center border rounded-md">
          <Button 
            variant="ghost" 
            size="icon" 
            className="h-8 w-8"
            onClick={handleDecreaseQuantity}
            disabled={quantity <= 1}
          >
            <Minus size={16} />
          </Button>
          <span className="w-8 text-center">{quantity}</span>
          <Button 
            variant="ghost" 
            size="icon" 
            className="h-8 w-8"
            onClick={handleIncreaseQuantity}
          >
            <Plus size={16} />
          </Button>
        </div>
        
        <Button 
          variant="default" 
          className="flex-1 ml-4 bg-wayscanner-blue text-white hover:bg-blue-700"
          onClick={handleAddToCart}
        >
          Add to Cart
        </Button>
      </div>
    </div>
  );
};

export default ProductDetailPage;
