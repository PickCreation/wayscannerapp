
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
import { getProductById, Product } from "@/lib/marketplaceService";

const ProductDetailPage = () => {
  const navigate = useNavigate();
  const { productId } = useParams();
  const { toast } = useToast();
  const [quantity, setQuantity] = useState(1);
  const [cartCount, setCartCount] = useState(0);
  const [sellerPolicy, setSellerPolicy] = useState<string>("");
  const [product, setProduct] = useState<Product | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  
  // Fetch product from local storage first
  useEffect(() => {
    const fetchProduct = async () => {
      setIsLoading(true);
      try {
        console.log(`Attempting to fetch product with ID: ${productId}`);
        
        // Try to get products from localStorage first
        const productsJson = localStorage.getItem('products');
        const products: Product[] = productsJson ? JSON.parse(productsJson) : [];
        console.log('Products from localStorage:', products.length);
        
        // First check if we can find the product in localStorage
        const localProduct = products.find(p => 
          p.id === productId || 
          p.id === `local_${productId}` || 
          parseInt(p.id.replace('local_', '')) === parseInt(productId as string)
        );
        
        if (localProduct) {
          console.log('Found product in localStorage:', localProduct);
          setProduct(localProduct);
        } else {
          // If not found in localStorage, try to fetch from Firebase
          console.log('Product not found in localStorage, trying Firebase...');
          const firebaseProduct = await getProductById(productId as string);
          if (firebaseProduct) {
            console.log('Found product in Firebase:', firebaseProduct);
            setProduct(firebaseProduct);
          } else {
            console.log('Product not found in Firebase either');
            
            // Fallback to hardcoded products if no products found
            const hardcodedProducts = [
              {
                id: '1',
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
                createdAt: new Date(),
              },
              // ... more hardcoded products if needed
            ];
            
            const hardcodedProduct = hardcodedProducts.find(p => 
              p.id === productId || 
              parseInt(p.id) === parseInt(productId as string)
            );
            
            if (hardcodedProduct) {
              console.log('Found product in hardcoded list:', hardcodedProduct);
              setProduct(hardcodedProduct as Product);
            }
          }
        }
      } catch (error) {
        console.error("Error fetching product details:", error);
        toast({
          title: "Error",
          description: "Failed to load product details",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchProduct();
  }, [productId, toast]);
  
  useEffect(() => {
    const updateCartCount = () => {
      const cartItems = JSON.parse(localStorage.getItem('cartItems') || '[]');
      const count = cartItems.reduce((total: number, item: any) => total + item.quantity, 0);
      setCartCount(count);
    };
    
    updateCartCount();
    
    window.addEventListener('storage', updateCartCount);
    window.addEventListener('cartUpdated', updateCartCount);
    
    // Load seller policy from localStorage
    const loadSellerPolicy = () => {
      const shopSettings = JSON.parse(localStorage.getItem('shopSettings') || '{}');
      if (shopSettings && shopSettings.shopPolicy) {
        setSellerPolicy(shopSettings.shopPolicy);
      }
    };
    
    loadSellerPolicy();
    
    return () => {
      window.removeEventListener('storage', updateCartCount);
      window.removeEventListener('cartUpdated', updateCartCount);
    };
  }, []);
  
  if (isLoading) {
    return (
      <div className="min-h-screen p-4">
        <header className="bg-wayscanner-blue text-white py-4 px-4 flex justify-between items-center fixed top-0 left-0 right-0">
          <button className="p-2" onClick={() => navigate(-1)}>
            <ChevronLeft size={24} color="white" />
          </button>
          <h1 className="text-xl font-bold">Loading Product...</h1>
          <div className="w-10"></div>
        </header>
        <div className="pt-16 flex flex-col items-center justify-center">
          <div className="w-full h-64 bg-gray-200 animate-pulse rounded-lg mb-4"></div>
          <div className="w-3/4 h-8 bg-gray-200 animate-pulse rounded mb-2"></div>
          <div className="w-1/2 h-6 bg-gray-200 animate-pulse rounded mb-4"></div>
          <div className="w-1/4 h-10 bg-gray-200 animate-pulse rounded"></div>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-4">
        <header className="bg-wayscanner-blue text-white py-4 px-4 flex justify-between items-center fixed top-0 left-0 right-0">
          <button className="p-2" onClick={() => navigate(-1)}>
            <ChevronLeft size={24} color="white" />
          </button>
          <h1 className="text-xl font-bold">Product Not Found</h1>
          <div className="w-10"></div>
        </header>
        <div className="pt-20 text-center">
          <p className="text-gray-600 mb-4">Sorry, we couldn't find the product you're looking for.</p>
          <Button 
            variant="default" 
            onClick={() => navigate('/marketplace')}
            className="bg-wayscanner-blue hover:bg-blue-700"
          >
            Return to Marketplace
          </Button>
        </div>
      </div>
    );
  }

  const totalPrice = (product.price * quantity).toFixed(2);
  const productImages = product.images || (product.image ? [product.image] : []);

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

  const handleSellerClick = () => {
    navigate(`/store/1`);
  };

  return (
    <div className="pb-24 bg-white min-h-screen">
      <header className="bg-wayscanner-blue text-white py-4 px-4 flex justify-between items-center fixed top-0 left-0 right-0 z-10" style={{ backgroundColor: "#034AFF" }}>
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

      <div className="w-full bg-gray-100 px-4 py-0 pt-16">
        {productImages.length > 0 ? (
          <Carousel className="w-full">
            <CarouselContent>
              {productImages.map((image, index) => (
                <CarouselItem key={index}>
                  <div className="h-64 flex items-center justify-center">
                    <img 
                      src={image} 
                      alt={`${product.title} - view ${index + 1}`} 
                      className="h-full object-contain rounded-lg overflow-hidden"
                      style={{ borderRadius: "8px" }}
                    />
                  </div>
                </CarouselItem>
              ))}
            </CarouselContent>
            {productImages.length > 1 && (
              <>
                <CarouselPrevious className="left-2" />
                <CarouselNext className="right-2" />
              </>
            )}
          </Carousel>
        ) : (
          <div className="w-full h-64 flex items-center justify-center bg-gray-200 rounded-lg">
            <span className="text-gray-500">No image available</span>
          </div>
        )}
      </div>

      {productImages.length > 1 && (
        <div className="px-4 py-2 flex space-x-2 overflow-x-auto">
          {productImages.map((img, index) => (
            <button 
              key={index} 
              className="w-14 h-14 border border-gray-300 rounded-lg overflow-hidden flex-shrink-0"
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
          <p className="text-sm text-gray-600"><span className="font-medium">Category:</span> {product.category}</p>
          <p className="text-sm text-gray-600">
            <span className="font-medium">Seller:</span>{" "}
            <button 
              className="text-wayscanner-blue font-medium hover:underline" 
              onClick={handleSellerClick}
            >
              {product.seller || "Unknown Seller"}
            </button>
          </p>
        </div>
        
        <div className="flex items-center mb-3">
          <Star size={18} className="text-yellow-500 fill-current" />
          <span className="text-sm ml-1">{product.rating || "N/A"}</span>
          <span className="text-sm text-gray-500 ml-1">({product.reviews || 0} reviews)</span>
        </div>
        
        <p className="text-2xl font-bold text-wayscanner-blue mb-4">${totalPrice}</p>
      </div>
      
      <div className="px-4">
        <Tabs defaultValue="description">
          <TabsList className="grid grid-cols-3 mb-2">
            <TabsTrigger value="description">Description</TabsTrigger>
            <TabsTrigger value="reviews">Reviews ({product.reviews || 0})</TabsTrigger>
            <TabsTrigger value="policies">Policies</TabsTrigger>
          </TabsList>
          <TabsContent value="description" className="pt-2">
            <p className="text-gray-700 mb-4">{product.description || "No description available."}</p>
            
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
                      star <= Math.floor(product.rating || 0)
                        ? "text-yellow-500 fill-current"
                        : "text-gray-300"
                    }`}
                  />
                ))}
              </div>
              <span className="ml-2 text-sm font-medium text-gray-700">
                {product.rating || 0} out of 5
              </span>
            </div>
            <p className="text-sm text-gray-500">Reviews are coming soon!</p>
          </TabsContent>
          <TabsContent value="policies" className="pt-2">
            <div className="space-y-4">
              <h3 className="font-medium text-lg">Seller Policies</h3>
              {sellerPolicy ? (
                <div className="bg-gray-50 p-4 rounded-md border border-gray-200">
                  <p className="text-sm text-gray-700 whitespace-pre-line">{sellerPolicy}</p>
                </div>
              ) : (
                <p className="text-sm text-gray-500">This seller has not specified any policies.</p>
              )}
            </div>
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
