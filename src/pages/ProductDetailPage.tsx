
import React, { useState, useEffect } from "react";
import { ChevronLeft, Heart, Share2, Plus, Minus, Tag, Star } from "lucide-react";
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
  const [product, setProduct] = useState<Product | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  
  // Hardcoded products for fallback
  const hardcodedProducts: Product[] = [
    {
      id: '1',
      title: "Modern Plant Pot",
      price: 29.99,
      category: "Plants Accessories",
      image: "https://images.unsplash.com/photo-1485955900006-10f4d324d411?auto=format&fit=crop&q=80&w=600",
      images: [
        "https://images.unsplash.com/photo-1485955900006-10f4d324d411?auto=format&fit=crop&q=80&w=600",
        "https://images.unsplash.com/photo-1581504803078-889aa7a2a3c4?auto=format&fit=crop&q=80&w=600"
      ],
      rating: 4.5,
      reviews: 124,
      description: "A beautiful modern plant pot perfect for your indoor plants. Made with high-quality ceramic and designed to complement any interior decor.",
      seller: "Green Thumb Co.",
      createdAt: new Date(),
      color: "White",
      condition: "New",
      weight: "2.5 lbs",
      brand: "Modern Home",
      country: "USA",
      tags: ["ceramic", "modern", "indoor"]
    },
    {
      id: '2',
      title: "Organic Dog Treats",
      price: 15.99,
      category: "Animal Accessories",
      image: "https://images.unsplash.com/photo-1601758228041-f3b2795255f1?auto=format&fit=crop&q=80&w=600",
      rating: 4.8,
      reviews: 89,
      description: "All-natural organic dog treats made with premium ingredients. Perfect for training or just showing your furry friend some love.",
      seller: "Pet Paradise",
      createdAt: new Date(),
      color: "Brown",
      condition: "New",
      weight: "1 lb",
      brand: "Healthy Paws",
      country: "Canada",
      tags: ["organic", "training", "healthy"]
    }
  ];
  
  useEffect(() => {
    const fetchProduct = async () => {
      setIsLoading(true);
      console.log(`Fetching product with ID: ${productId}`);
      
      try {
        // First try localStorage
        const productsJson = localStorage.getItem('products');
        const localProducts: Product[] = productsJson ? JSON.parse(productsJson) : [];
        
        // Try to find product by ID (handle various ID formats)
        let foundProduct = localProducts.find(p => 
          p.id === productId || 
          p.id === `local_${productId}` ||
          p.id.replace(/[^0-9]/g, '') === productId
        );
        
        // If not found in localStorage, try hardcoded products
        if (!foundProduct) {
          foundProduct = hardcodedProducts.find(p => 
            p.id === productId || 
            parseInt(p.id) === parseInt(productId as string)
          );
        }
        
        // If still not found, try Firebase
        if (!foundProduct && productId) {
          foundProduct = await getProductById(productId);
        }
        
        if (foundProduct) {
          console.log('Found product:', foundProduct);
          setProduct(foundProduct);
        } else {
          console.log('Product not found, using first hardcoded product');
          setProduct(hardcodedProducts[0]);
        }
      } catch (error) {
        console.error("Error fetching product:", error);
        setProduct(hardcodedProducts[0]);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchProduct();
  }, [productId]);
  
  useEffect(() => {
    const updateCartCount = () => {
      const cartItems = JSON.parse(localStorage.getItem('cartItems') || '[]');
      const count = cartItems.reduce((total: number, item: any) => total + item.quantity, 0);
      setCartCount(count);
    };
    
    updateCartCount();
    window.addEventListener('cartUpdated', updateCartCount);
    
    return () => {
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
          <p className="text-sm text-gray-600"><span className="font-medium">Category:</span> {product.category}</p>
          <p className="text-sm text-gray-600">
            <span className="font-medium">Seller:</span> {product.seller || "Unknown Seller"}
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
            <TabsTrigger value="details">Details</TabsTrigger>
          </TabsList>
          <TabsContent value="description" className="pt-2">
            <p className="text-gray-700 mb-4">{product.description || "No description available."}</p>
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
          <TabsContent value="details" className="pt-2">
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
          </TabsContent>
        </Tabs>
      </div>
      
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t p-4 flex items-center justify-between">
        <div className="flex items-center border rounded-md">
          <Button 
            variant="ghost" 
            size="icon" 
            className="h-8 w-8"
            onClick={() => setQuantity(Math.max(1, quantity - 1))}
          >
            <Minus size={16} />
          </Button>
          <span className="w-8 text-center">{quantity}</span>
          <Button 
            variant="ghost" 
            size="icon" 
            className="h-8 w-8"
            onClick={() => setQuantity(quantity + 1)}
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
