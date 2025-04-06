import React, { useState, useEffect } from "react";
import { ChevronLeft, Heart, Share2, Plus, Minus, Tag } from "lucide-react";
import { ShoppingCart } from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { Badge } from "@/components/ui/badge";
import { 
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";

const products = [
  {
    id: 1,
    title: "Modern Plant Pot",
    price: 29.99,
    category: "Plants Accessories",
    image: "https://images.unsplash.com/photo-1485955900006-10f4d324d411?auto=format&fit=crop&q=80&w=600",
    images: [
      "https://images.unsplash.com/photo-1485955900006-10f4d324d411?auto=format&fit=crop&q=80&w=600",
      "https://images.unsplash.com/photo-1581504803078-889aa7a2a3c4?auto=format&fit=crop&q=80&w=600",
      "https://images.unsplash.com/photo-1582139329109-c10441b6db1c?auto=format&fit=crop&q=80&w=600",
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
    color: "White",
    tags: ["Plant", "Home Decor", "Ceramic", "Indoor", "Modern"],
  },
  {
    id: 2,
    title: "Ceramic Dog Bowl",
    price: 19.99,
    category: "Animal Accessories",
    image: "https://images.unsplash.com/photo-1601758174499-203dda8ffc92?auto=format&fit=crop&q=80&w=600",
    images: [
      "https://images.unsplash.com/photo-1601758174499-203dda8ffc92?auto=format&fit=crop&q=80&w=600",
      "https://images.unsplash.com/photo-1581456569631-873d308ba72c?auto=format&fit=crop&q=80&w=600",
      "https://images.unsplash.com/photo-1546421845-6471bdcf3edf?auto=format&fit=crop&q=80&w=600",
      "https://images.unsplash.com/photo-1583337130417-3346a1be7dee?auto=format&fit=crop&q=80&w=600",
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
    color: "Blue",
    tags: ["Pet", "Dog", "Bowl", "Ceramic", "Non-slip"],
  },
  {
    id: 3,
    title: "Monstera Plant",
    price: 34.99,
    category: "Plants",
    image: "https://images.unsplash.com/photo-1614594975525-e45190c55d0b?auto=format&fit=crop&q=80&w=600",
    images: [
      "https://images.unsplash.com/photo-1614594975525-e45190c55d0b?auto=format&fit=crop&q=80&w=600",
      "https://images.unsplash.com/photo-1545239705-1564e58b9e4d?auto=format&fit=crop&q=80&w=600",
      "https://images.unsplash.com/photo-1598880940639-7f443a26fe2a?auto=format&fit=crop&q=80&w=600",
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
    color: "Green",
    tags: ["Plant", "Monstera", "Indoor", "Tropical", "Easy Care"],
  },
  {
    id: 4,
    title: "Bamboo Cutting Board",
    price: 24.99,
    category: "Kitchen Essentials",
    image: "https://images.unsplash.com/photo-1594662322686-8db3bad1d279?auto=format&fit=crop&q=80&w=600",
    images: [
      "https://images.unsplash.com/photo-1594662322686-8db3bad1d279?auto=format&fit=crop&q=80&w=600",
      "https://images.unsplash.com/photo-1619108915702-31ee00a0a6bd?auto=format&fit=crop&q=80&w=600",
      "https://images.unsplash.com/photo-1668456186589-8c6af46226e0?auto=format&fit=crop&q=80&w=600",
      "https://images.unsplash.com/photo-1623632897768-7ff5604765ec?auto=format&fit=crop&q=80&w=600",
      "https://images.unsplash.com/photo-1625944526866-84b8898d1669?auto=format&fit=crop&q=80&w=600",
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
    color: "Natural",
    tags: ["Kitchen", "Bamboo", "Cutting Board", "Eco-friendly", "Durable"],
  },
  {
    id: 5,
    title: "Macrame Wall Hanging",
    price: 39.99,
    category: "Decor",
    image: "https://images.unsplash.com/photo-1594130139005-3f0c0f0e7c5e?auto=format&fit=crop&q=80&w=600",
    images: [
      "https://images.unsplash.com/photo-1594130139005-3f0c0f0e7c5e?auto=format&fit=crop&q=80&w=600",
      "https://images.unsplash.com/photo-1582582494705-f8ce0b0c24f2?auto=format&fit=crop&q=80&w=600",
      "https://images.unsplash.com/photo-1617870952348-760d43bae46f?auto=format&fit=crop&q=80&w=600",
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
    color: "Beige",
    tags: ["Decor", "Macrame", "Wall Hanging", "Handcrafted", "Boho"],
  },
  {
    id: 6,
    title: "Cat Climbing Tree",
    price: 89.99,
    category: "Animal Accessories",
    image: "https://images.unsplash.com/photo-1603314585442-ee3b3c16fbcf?auto=format&fit=crop&q=80&w=600",
    images: [
      "https://images.unsplash.com/photo-1603314585442-ee3b3c16fbcf?auto=format&fit=crop&q=80&w=600",
      "https://images.unsplash.com/photo-1605433274522-da77eecb7088?auto=format&fit=crop&q=80&w=600",
      "https://images.unsplash.com/photo-1545033131-485ea67fd7c3?auto=format&fit=crop&q=80&w=600",
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
    color: "Gray",
    tags: ["Pet", "Cat", "Climbing Tree", "Scratching Post", "Furniture"],
  }
];

const ProductDetailPage = () => {
  const navigate = useNavigate();
  const { productId } = useParams();
  const { toast } = useToast();
  const [quantity, setQuantity] = useState(1);
  const [cartCount, setCartCount] = useState(0);
  
  const product = products.find(p => p.id === Number(productId));
  
  useEffect(() => {
    const updateCartCount = () => {
      const cartItems = JSON.parse(localStorage.getItem('cartItems') || '[]');
      const count = cartItems.reduce((total: number, item: any) => total + item.quantity, 0);
      setCartCount(count);
    };
    
    updateCartCount();
    
    window.addEventListener('storage', updateCartCount);
    window.addEventListener('cartUpdated', updateCartCount);
    
    return () => {
      window.removeEventListener('storage', updateCartCount);
      window.removeEventListener('cartUpdated', updateCartCount);
    };
  }, []);
  
  if (!product) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p>Product not found</p>
      </div>
    );
  }

  const totalPrice = (product.price * quantity).toFixed(2);

  const handleAddToCart = () => {
    const cartItems = JSON.parse(localStorage.getItem('cartItems') || '[]');
    const existingItemIndex = cartItems.findIndex((item: any) => item.id === product.id);
    
    if (existingItemIndex >= 0) {
      cartItems[existingItemIndex].quantity += quantity;
    } else {
      cartItems.push({
        ...product,
        quantity: quantity
      });
    }
    
    localStorage.setItem('cartItems', JSON.stringify(cartItems));
    
    window.dispatchEvent(new Event('cartUpdated'));
    
    toast({
      title: "Added to Cart",
      description: `${quantity} × ${product.title} added to your cart`,
    });
  };

  const handleAddToFavorites = () => {
    const favorites = JSON.parse(localStorage.getItem('favorites') || '[]');
    const isAlreadyFavorite = favorites.some((item: any) => item.id === product.id);
    
    if (!isAlreadyFavorite) {
      favorites.push(product);
      localStorage.setItem('favorites', JSON.stringify(favorites));
      
      toast({
        title: "Added to Favorites",
        description: `${product.title} added to your favorites`,
      });
    } else {
      const updatedFavorites = favorites.filter((item: any) => item.id !== product.id);
      localStorage.setItem('favorites', JSON.stringify(updatedFavorites));
      
      toast({
        title: "Removed from Favorites",
        description: `${product.title} removed from your favorites`,
      });
    }
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
        <button className="p-2 relative" onClick={() => navigate('/cart')}>
          <ShoppingCart size={24} color="white" fill="white" />
          {cartCount > 0 && (
            <Badge variant="destructive" className="absolute -top-1 -right-1 px-1.5 py-0.5 min-w-5 h-5 flex items-center justify-center">
              {cartCount}
            </Badge>
          )}
        </button>
      </header>

      <div className="w-full bg-gray-100 px-4 py-6">
        {product.images && product.images.length > 0 ? (
          <Carousel className="w-full">
            <CarouselContent>
              {product.images.map((image, index) => (
                <CarouselItem key={index}>
                  <div className="h-64 flex items-center justify-center">
                    <img 
                      src={image} 
                      alt={`${product.title} - view ${index + 1}`} 
                      className="h-full object-contain"
                    />
                  </div>
                </CarouselItem>
              ))}
            </CarouselContent>
            <CarouselPrevious className="left-2" />
            <CarouselNext className="right-2" />
          </Carousel>
        ) : (
          <div className="w-full h-64">
            <img 
              src={product.image} 
              alt={product.title} 
              className="w-full h-full object-contain"
            />
          </div>
        )}
      </div>

      {product.images && product.images.length > 1 && (
        <div className="px-4 py-2 flex space-x-2 overflow-x-auto">
          {product.images.map((img, index) => (
            <button 
              key={index} 
              className="w-14 h-14 border border-gray-300 rounded-md overflow-hidden flex-shrink-0"
              aria-label={`View image ${index + 1}`}
            >
              <img 
                src={img} 
                alt={`${product.title} - thumbnail ${index + 1}`} 
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
            <Button size="icon" variant="ghost" className="h-9 w-9" onClick={handleAddToFavorites}>
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
        
        <p className="text-2xl font-bold text-wayscanner-blue mb-4">${totalPrice}</p>
      </div>
      
      <div className="px-4">
        <Tabs defaultValue="description">
          <TabsList className="grid grid-cols-2 mb-2">
            <TabsTrigger value="description">Description</TabsTrigger>
            <TabsTrigger value="reviews">Reviews ({product.reviews})</TabsTrigger>
          </TabsList>
          <TabsContent value="description" className="pt-2">
            <p className="text-gray-700 mb-4">{product.description}</p>
            
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
                
                <div className="text-gray-600">Tags:</div>
                <div className="font-medium">
                  {product.tags && product.tags.length > 0 ? (
                    <div className="flex flex-wrap gap-1">
                      {product.tags.map((tag, index) => (
                        <span 
                          key={index} 
                          className="bg-gray-100 text-gray-800 text-xs px-2 py-1 rounded-full flex items-center"
                        >
                          <Tag size={12} className="mr-1" />
                          {tag}
                        </span>
                      ))}
                    </div>
                  ) : (
                    "No tags"
                  )}
                </div>
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

const Star = ({ size, className }: { size: number, className: string }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
  </svg>
);

export default ProductDetailPage;
