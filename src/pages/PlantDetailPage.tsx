
import React from "react";
import { Link, useParams } from "react-router-dom";
import { Bookmark, ChevronLeft, MessageCircle, Share, ThumbsUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import BottomNavigation from "@/components/BottomNavigation";

const PlantDetailPage = () => {
  const { plantId } = useParams();
  
  // This is dummy data, in a real app this would come from an API
  const plant = {
    id: plantId,
    name: "Monstera Deliciosa",
    scientificName: "Monstera deliciosa",
    category: "Indoor Plant",
    description: "The Monstera deliciosa is a species of flowering plant native to tropical forests of southern Mexico, south to Panama. It has been introduced to many tropical areas, and has become a mildly invasive species in Hawaii, Seychelles, Ascension Island and the Society Islands.",
    careLevel: "Easy",
    light: "Medium to bright indirect light",
    water: "Water when top 1-2 inches of soil is dry",
    temperature: "65-85°F (18-29°C)",
    humidity: "High (>60%)",
    soil: "Well-draining potting mix",
    fertilizer: "Feed monthly during growing season",
    propagation: "Stem cuttings or division",
    toxicity: "Toxic to pets if ingested",
    commonProblems: "Yellowing leaves, brown spots, root rot",
    benefits: ["Air purifying", "Aesthetic appeal", "Low maintenance"],
    images: [
      "/lovable-uploads/dc7e6fce-2b21-472e-99f7-7f20be83b76f.png",
      "/lovable-uploads/81f6d068-8c80-4e65-9ad0-2d3fe0a6f480.png",
      "/lovable-uploads/69501614-b92c-43f9-89e5-85971b5b6ede.png"
    ],
    price: 39.99,
    currency: "USD",
    rating: 4.5,
    reviews: 128,
    inStock: true
  };
  
  if (!plant) {
    return (
      <div className="flex flex-col min-h-screen">
        <div className="p-4">
          <h1 className="text-2xl font-bold">Plant not found</h1>
          <p>Sorry, we couldn't find the plant you're looking for.</p>
          <Button asChild className="mt-4">
            <Link to="/">Go back home</Link>
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen bg-white">
      <div className="relative">
        <div className="absolute top-4 left-4 z-10">
          <Button variant="outline" size="icon" asChild className="rounded-full bg-white/80 backdrop-blur-sm">
            <Link to="/"><ChevronLeft className="h-5 w-5" /></Link>
          </Button>
        </div>
        <div className="absolute top-4 right-4 z-10 flex gap-2">
          <Button variant="outline" size="icon" className="rounded-full bg-white/80 backdrop-blur-sm">
            <Share className="h-5 w-5" />
          </Button>
          <Button variant="outline" size="icon" className="rounded-full bg-white/80 backdrop-blur-sm">
            <Bookmark className="h-5 w-5" />
          </Button>
        </div>
        <img 
          src={plant.images[0]} 
          alt={plant.name} 
          className="w-full h-80 object-cover" 
        />
      </div>

      <div className="flex-1 p-4">
        <div className="flex justify-between items-start mb-1">
          <h1 className="text-2xl font-bold">{plant.name}</h1>
          <div className="text-xl font-semibold">${plant.price.toFixed(2)}</div>
        </div>
        <h2 className="text-sm text-gray-500 italic mb-4">{plant.scientificName}</h2>
        
        <div className="flex items-center gap-4 mb-4">
          <div className="flex items-center">
            <span className="text-amber-500">★</span>
            <span className="ml-1">{plant.rating}</span>
            <span className="ml-1 text-gray-500">({plant.reviews})</span>
          </div>
          <div className="text-green-600 font-medium">
            {plant.inStock ? "In Stock" : "Out of Stock"}
          </div>
        </div>
        
        <div className="mb-4">
          <Button className="w-full bg-green-600 hover:bg-green-700">Add to Cart</Button>
        </div>
        
        <Separator className="my-4" />
        
        <Tabs defaultValue="overview" className="w-full">
          <TabsList className="grid grid-cols-3 mb-4">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="care">Care</TabsTrigger>
            <TabsTrigger value="reviews">Reviews</TabsTrigger>
          </TabsList>
          
          <TabsContent value="overview" className="space-y-4">
            <div>
              <h3 className="font-semibold text-lg mb-2">Description</h3>
              <p className="text-gray-700">{plant.description}</p>
            </div>
            
            <div>
              <h3 className="font-semibold text-lg mb-2">Benefits</h3>
              <ul className="list-disc pl-5 text-gray-700">
                {plant.benefits.map((benefit, index) => (
                  <li key={index}>{benefit}</li>
                ))}
              </ul>
            </div>
            
            <div>
              <h3 className="font-semibold text-lg mb-2">Specifications</h3>
              <div className="grid grid-cols-2 gap-2 text-sm">
                <div className="text-gray-500">Category</div>
                <div>{plant.category}</div>
                <div className="text-gray-500">Care Level</div>
                <div>{plant.careLevel}</div>
                <div className="text-gray-500">Toxicity</div>
                <div>{plant.toxicity}</div>
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="care" className="space-y-4">
            <Collapsible className="w-full border rounded-lg overflow-hidden mb-3">
              <CollapsibleTrigger className="flex justify-between items-center w-full p-4 bg-gray-50">
                <span className="font-semibold">Basic Care Information</span>
                <span>▼</span>
              </CollapsibleTrigger>
              <CollapsibleContent className="p-4 space-y-3">
                <div className="grid grid-cols-2 gap-3">
                  <div className="bg-green-50 p-3 rounded-lg">
                    <h4 className="font-medium text-green-800">Light</h4>
                    <p className="text-gray-700 text-sm">{plant.light}</p>
                  </div>
                  <div className="bg-blue-50 p-3 rounded-lg">
                    <h4 className="font-medium text-blue-800">Water</h4>
                    <p className="text-gray-700 text-sm">{plant.water}</p>
                  </div>
                  <div className="bg-yellow-50 p-3 rounded-lg">
                    <h4 className="font-medium text-yellow-800">Temperature</h4>
                    <p className="text-gray-700 text-sm">{plant.temperature}</p>
                  </div>
                  <div className="bg-purple-50 p-3 rounded-lg">
                    <h4 className="font-medium text-purple-800">Humidity</h4>
                    <p className="text-gray-700 text-sm">{plant.humidity}</p>
                  </div>
                  <div className="bg-orange-50 p-3 rounded-lg">
                    <h4 className="font-medium text-orange-800">Soil</h4>
                    <p className="text-gray-700 text-sm">{plant.soil}</p>
                  </div>
                  <div className="bg-red-50 p-3 rounded-lg">
                    <h4 className="font-medium text-red-800">Fertilizer</h4>
                    <p className="text-gray-700 text-sm">{plant.fertilizer}</p>
                  </div>
                </div>
              </CollapsibleContent>
            </Collapsible>
            
            <Collapsible className="w-full border rounded-lg overflow-hidden mb-3">
              <CollapsibleTrigger className="flex justify-between items-center w-full p-4 bg-gray-50">
                <span className="font-semibold">Care Information</span>
                <span>▼</span>
              </CollapsibleTrigger>
              <CollapsibleContent className="p-4 space-y-3">
                <div className="grid grid-cols-2 gap-3">
                  <div className="bg-green-50 p-3 rounded-lg">
                    <h4 className="font-medium text-green-800">Spring</h4>
                    <p className="text-gray-700 text-sm">Increase watering as growth begins. Repot if necessary before the growing season starts.</p>
                  </div>
                  <div className="bg-yellow-50 p-3 rounded-lg">
                    <h4 className="font-medium text-yellow-800">Summer</h4>
                    <p className="text-gray-700 text-sm">Regular watering, protect from intense direct sunlight. Mist occasionally to increase humidity.</p>
                  </div>
                  <div className="bg-orange-50 p-3 rounded-lg">
                    <h4 className="font-medium text-orange-800">Fall</h4>
                    <p className="text-gray-700 text-sm">Reduce watering as growth slows. Stop fertilizing toward the end of the season.</p>
                  </div>
                  <div className="bg-blue-50 p-3 rounded-lg">
                    <h4 className="font-medium text-blue-800">Winter</h4>
                    <p className="text-gray-700 text-sm">Minimal watering, keep away from cold drafts and heaters. Maintain humidity with a humidifier.</p>
                  </div>
                  <div className="bg-purple-50 p-3 rounded-lg">
                    <h4 className="font-medium text-purple-800">Fertilizing</h4>
                    <p className="text-gray-700 text-sm">Use balanced liquid fertilizer monthly during spring and summer. Dilute to half the recommended strength.</p>
                  </div>
                  <div className="bg-red-50 p-3 rounded-lg">
                    <h4 className="font-medium text-red-800">Pruning</h4>
                    <p className="text-gray-700 text-sm">Trim yellow or damaged leaves at the base. Prune in spring to control size and shape.</p>
                  </div>
                </div>

                {/* Plant requirements section - Added from screenshot */}
                <div className="mt-6">
                  <h3 className="text-2xl font-bold mb-4 text-[#1A1F2C]">Plant requirements</h3>
                  <div className="space-y-3">
                    <div className="bg-[#1A1F2C] rounded-lg p-4 flex items-center justify-between">
                      <div className="flex items-center">
                        <div className="mr-4">
                          <svg width="38" height="38" viewBox="0 0 38 38" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M19 10.5C17.6193 10.5 16.5 11.6193 16.5 13V24.5C16.5 25.8807 17.6193 27 19 27C20.3807 27 21.5 25.8807 21.5 24.5V13C21.5 11.6193 20.3807 10.5 19 10.5Z" fill="#F9AA7B" />
                            <path d="M22.6875 28.5H15.3125C14.8644 28.5 14.5 28.1356 14.5 27.6875V26.5625C14.5 26.1144 14.8644 25.75 15.3125 25.75H22.6875C23.1356 25.75 23.5 26.1144 23.5 26.5625V27.6875C23.5 28.1356 23.1356 28.5 22.6875 28.5Z" fill="#F9AA7B" />
                          </svg>
                        </div>
                        <div>
                          <h4 className="text-white text-xl font-semibold">Pot</h4>
                        </div>
                      </div>
                      <div className="text-white">
                        <ChevronLeft className="h-6 w-6 rotate-180" />
                      </div>
                    </div>

                    <div className="bg-[#1A1F2C] rounded-lg p-4 flex items-center justify-between">
                      <div className="flex items-center">
                        <div className="mr-4">
                          <svg width="38" height="38" viewBox="0 0 38 38" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M24.9375 21.9375C24.9375 20.9604 24.15 20.2092 23.1875 20.0681V19C23.1875 15.5511 20.2864 12.6875 16.8125 12.6875C13.3386 12.6875 10.4375 15.5511 10.4375 19V20.0681C9.47502 20.2092 8.6875 20.9604 8.6875 21.9375C8.6875 22.9986 9.59389 23.875 10.6875 23.875H13.3125V24.5625C13.3125 25.0106 13.6769 25.375 14.125 25.375H19.5C19.9481 25.375 20.3125 25.0106 20.3125 24.5625V23.875H22.9375C24.0311 23.875 24.9375 22.9986 24.9375 21.9375ZM12.25 19C12.25 16.5397 14.2772 14.5 16.8125 14.5C19.3478 14.5 21.375 16.5397 21.375 19H12.25Z" fill="#F9AA7B" />
                            <path d="M17.4118 12.6875C17.2128 12.6875 17.0139 12.6274 16.8542 12.5088C16.5375 12.2732 16.4738 11.8251 16.711 11.5102C16.7765 11.4228 18.1718 9.5 16.5157 8.08975C16.1135 7.75377 16.0635 7.16436 16.4012 6.7638C16.7388 6.36104 17.3301 6.31104 17.7341 6.64702C20.7878 9.13748 18.3415 12.3478 18.1127 12.6547C17.9493 12.8712 17.6835 12.6875 17.4118 12.6875Z" fill="#55AA6F" />
                          </svg>
                        </div>
                        <div>
                          <h4 className="text-white text-xl font-semibold">Soil</h4>
                        </div>
                      </div>
                      <div className="text-white">
                        <ChevronLeft className="h-6 w-6 rotate-180" />
                      </div>
                    </div>

                    <div className="bg-[#1A1F2C] rounded-lg p-4 flex items-center justify-between">
                      <div className="flex items-center">
                        <div className="mr-4">
                          <svg width="38" height="38" viewBox="0 0 38 38" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M19 11.875C14.3425 11.875 10.4375 15.78 10.4375 20.4375C10.4375 22.3374 11.0683 24.1006 12.1338 25.5267C12.2971 25.7615 12.3972 26.0365 12.4282 26.3249L12.8497 30.6875H25.1503L25.5718 26.3248C25.6028 26.0365 25.7029 25.7615 25.8662 25.5267C26.9318 24.1006 27.5625 22.3374 27.5625 20.4375C27.5625 15.78 23.6575 11.875 19 11.875ZM19 13.6875C22.6625 13.6875 25.75 16.775 25.75 20.4375C25.75 22.0142 25.2273 23.4662 24.3568 24.6165C24.0096 25.1182 23.7952 25.7078 23.7258 26.325L23.6284 27.3125H14.3716L14.2742 26.325C14.2049 25.7079 13.9904 25.1182 13.6432 24.6165C12.7727 23.4662 12.25 22.0142 12.25 20.4375C12.25 16.775 15.3375 13.6875 19 13.6875Z" fill="#FFCE31" />
                            <path d="M18.8125 7.125C18.3644 7.125 18 7.48944 18 7.9375V12.6875C18 13.1356 18.3644 13.5 18.8125 13.5C19.2606 13.5 19.625 13.1356 19.625 12.6875V7.9375C19.625 7.48944 19.2606 7.125 18.8125 7.125Z" fill="#FFCE31" />
                            <path d="M13.6516 9.62194C13.4051 9.24856 12.8998 9.1405 12.5264 9.38694C12.153 9.63337 12.045 10.1387 12.2914 10.5121L14.7289 14.33C14.9754 14.7034 15.4807 14.8114 15.8541 14.565C16.2275 14.3186 16.3355 13.8133 16.0891 13.4399L13.6516 9.62194Z" fill="#FFCE31" />
                            <path d="M24.0736 9.38694C23.7002 9.1405 23.1949 9.24856 22.9484 9.62194L20.5109 13.4399C20.2645 13.8133 20.3725 14.3186 20.7459 14.565C21.1193 14.8114 21.6246 14.7034 21.8711 14.33L24.3086 10.5121C24.555 10.1387 24.447 9.63337 24.0736 9.38694Z" fill="#FFCE31" />
                          </svg>
                        </div>
                        <div>
                          <h4 className="text-white text-xl font-semibold">Lighting</h4>
                          <p className="text-[#00E676] text-lg">Part sun</p>
                        </div>
                      </div>
                      <div className="text-white">
                        <ChevronLeft className="h-6 w-6 rotate-180" />
                      </div>
                    </div>

                    <div className="bg-[#1A1F2C] rounded-lg p-4 flex items-center justify-between">
                      <div className="flex items-center">
                        <div className="mr-4">
                          <svg width="38" height="38" viewBox="0 0 38 38" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M23.75 19C23.75 21.6234 21.6234 23.75 19 23.75C16.3766 23.75 14.25 21.6234 14.25 19C14.25 16.3766 19 9.5 19 9.5C19 9.5 23.75 16.3766 23.75 19Z" fill="#4D97FF" />
                            <path d="M19.75 25.75H18.25C15.5266 25.75 13.25 23.4734 13.25 20.75C13.25 20.3019 13.6144 19.9375 14.0625 19.9375C14.5106 19.9375 14.875 20.3019 14.875 20.75C14.875 22.5706 16.4294 24.125 18.25 24.125H19.75C21.5706 24.125 23.125 22.5706 23.125 20.75C23.125 20.3019 23.4894 19.9375 23.9375 19.9375C24.3856 19.9375 24.75 20.3019 24.75 20.75C24.75 23.4734 22.4734 25.75 19.75 25.75Z" fill="#4D97FF" />
                            <path d="M18.2499 28.5H17.8124C14.8974 28.5 12.5624 26.165 12.5624 23.25C12.5624 22.8019 12.9269 22.4375 13.3749 22.4375C13.823 22.4375 14.1874 22.8019 14.1874 23.25C14.1874 25.2672 15.7952 26.875 17.8124 26.875H18.2499C20.2671 26.875 21.8749 25.2672 21.8749 23.25C21.8749 22.8019 22.2394 22.4375 22.6874 22.4375C23.1355 22.4375 23.4999 22.8019 23.4999 23.25C23.4999 26.165 21.1649 28.5 18.2499 28.5Z" fill="#4D97FF" />
                          </svg>
                        </div>
                        <div>
                          <h4 className="text-white text-xl font-semibold">Humidity</h4>
                          <p className="text-[#00E676] text-lg">High ({">"} 60%)</p>
                        </div>
                      </div>
                      <div className="text-white">
                        <ChevronLeft className="h-6 w-6 rotate-180" />
                      </div>
                    </div>

                    <div className="bg-[#1A1F2C] rounded-lg p-4 flex items-center justify-between">
                      <div className="flex items-center">
                        <div className="mr-4">
                          <svg width="38" height="38" viewBox="0 0 38 38" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M16.4376 26.2351C15.9895 26.2351 15.6251 25.8707 15.6251 25.4226V24.5625C15.6251 24.1144 15.9895 23.75 16.4376 23.75C16.8857 23.75 17.2501 24.1144 17.2501 24.5625V25.4226C17.2501 25.8707 16.8857 26.2351 16.4376 26.2351Z" fill="#FF6D6D" />
                            <path d="M15.6251 21.375C15.1769 21.375 14.8125 21.0106 14.8125 20.5625V19.7024C14.8125 19.2543 15.1769 18.8899 15.6251 18.8899C16.0732 18.8899 16.4376 19.2543 16.4376 19.7024V20.5625C16.4376 21.0106 16.0732 21.375 15.6251 21.375Z" fill="#4D97FF" />
                            <path d="M17.2503 18.0774C16.8021 18.0774 16.4377 17.713 16.4377 17.2649V16.4048C16.4377 15.9567 16.8021 15.5923 17.2503 15.5923C17.6984 15.5923 18.0628 15.9567 18.0628 16.4048V17.2649C18.0628 17.713 17.6984 18.0774 17.2503 18.0774Z" fill="#4D97FF" />
                            <path d="M16.4374 13.6875C15.9893 13.6875 15.6249 13.3231 15.6249 12.875V11.875C15.6249 11.4269 15.9893 11.0625 16.4374 11.0625C16.8855 11.0625 17.2499 11.4269 17.2499 11.875V12.875C17.2499 13.3231 16.8855 13.6875 16.4374 13.6875Z" fill="#4D97FF" />
                            <path d="M20.7501 26.2351C20.302 26.2351 19.9376 25.8707 19.9376 25.4226V24.5625C19.9376 24.1144 20.302 23.75 20.7501 23.75C21.1982 23.75 21.5626 24.1144 21.5626 24.5625V25.4226C21.5626 25.8707 21.1982 26.2351 20.7501 26.2351Z" fill="#FF6D6D" />
                            <path d="M19.9376 21.375C19.4895 21.375 19.125 21.0106 19.125 20.5625V19.7024C19.125 19.2543 19.4895 18.8899 19.9376 18.8899C20.3857 18.8899 20.7501 19.2543 20.7501 19.7024V20.5625C20.7501 21.0106 20.3857 21.375 19.9376 21.375Z" fill="#4D97FF" />
                            <path d="M21.5625 18.0774C21.1144 18.0774 20.75 17.713 20.75 17.2649V16.4048C20.75 15.9567 21.1144 15.5923 21.5625 15.5923C22.0106 15.5923 22.375 15.9567 22.375 16.4048V17.2649C22.375 17.713 22.0106 18.0774 21.5625 18.0774Z" fill="#4D97FF" />
                            <path d="M20.7499 13.6875C20.3018 13.6875 19.9374 13.3231 19.9374 12.875V11.875C19.9374 11.4269 20.3018 11.0625 20.7499 11.0625C21.198 11.0625 21.5624 11.4269 21.5624 11.875V12.875C21.5624 13.3231 21.198 13.6875 20.7499 13.6875Z" fill="#4D97FF" />
                            <path d="M26.5047 10.3172L20.0609 3.15388C19.5101 2.54087 18.4899 2.54087 17.9391 3.15388L11.4953 10.3172C8.39062 13.7352 8.06697 18.8797 10.7323 22.6802C11.1056 23.2137 12.1391 23.995 13.1219 24C13.5438 24.0021 13.4875 24.4042 13.4875 24.8125C13.4875 26.4433 14.8063 27.8125 16.4375 27.8125H21.5625C23.1937 27.8125 24.5125 26.4433 24.5125 24.8125C24.5125 24.4042 24.4562 24.0021 24.8781 24C25.8609 23.995 26.8944 23.2136 27.2678 22.6802C29.9331 18.8797 29.6094 13.7352 26.5047 10.3172ZM25.9053 21.7802C25.6738 22.1006 25.0659 22.395 24.8781 22.395C23.7453 22.3992 22.8875 23.4992 22.8875 24.8125C22.8875 25.4935 22.3131 26.1875 21.5625 26.1875H16.4375C15.6869 26.1875 15.1125 25.4935 15.1125 24.8125C15.1125 23.4992 14.2547 22.3992 13.1219 22.395C12.9341 22.395 12.3262 22.1006 12.0947 21.7802C9.89375 18.6247 10.1628 14.3258 12.7566 11.4653L19.1953 4.30225C19.2297 4.26475 19.2891 4.26475 19.3234 4.30225L25.7622 11.4653C28.3569 14.3267 28.6062 18.6247 25.9053 21.7802Z" fill="#FF6D6D" />
                          </svg>
                        </div>
                        <div>
                          <h4 className="text-white text-xl font-semibold">Hardiness zone</h4>
                          <p className="text-[#00E676] text-lg">10a - 11b</p>
                        </div>
                      </div>
                      <div className="text-white">
                        <ChevronLeft className="h-6 w-6 rotate-180" />
                      </div>
                    </div>

                    <div className="bg-[#1A1F2C] rounded-lg p-4 flex items-center justify-between">
                      <div className="flex items-center">
                        <div className="mr-4">
                          <svg width="38" height="38" viewBox="0 0 38 38" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M17.2505 23.75H20.7505C21.198 23.75 21.563 24.115 21.563 24.5625C21.563 25.01 21.198 25.375 20.7505 25.375H17.2505C16.803 25.375 16.438 25.01 16.438 24.5625C16.438 24.115 16.803 23.75 17.2505 23.75Z" fill="#FF6D6D" />
                            <path d="M22.3755 26.9993H15.6255C15.178 26.9993 14.813 26.6343 14.813 26.1868C14.813 25.7393 15.178 25.3743 15.6255 25.3743H22.3755C22.823 25.3743 23.188 25.7393 23.188 26.1868C23.188 26.6343 22.823 26.9993 22.3755 26.9993Z" fill="#FF6D6D" />
                            <path d="M19.8132 30.8739C19.8132 31.3214 19.4482 31.6864 19.0007 31.6864C18.5532 31.6864 18.1882 31.3214 18.1882 30.8739V9.50012C18.1882 9.05262 18.5532 8.68762 19.0007 8.68762C19.4482 8.68762 19.8132 9.05262 19.8132 9.50012V30.8739Z" fill="#FF6D6D" />
                            <path d="M19 11.0626C16.803 11.0626 15.4892 9.50012 15.4892 9.50012C15.4892 9.50012 15.488 9.50012 15.488 9.49887C15.488 8.32262 17.0855 6.31387 19 6.31387C20.9145 6.31387 22.512 8.32262 22.512 9.49887C22.512 9.50012 22.5107 9.50012 22.5107 9.50012C22.5107 9.50012 21.197 11.0626 19 11.0626Z" fill="#FF6D6D" />
                          </svg>
                        </div>
                        <div>
                          <h4 className="text-white text-xl font-semibold">Temperature</h4>
                          <p className="text-[#00E676] text-lg">73°F - 95°F</p>
                        </div>
                      </div>
                      <div className="text-white">
                        <ChevronLeft className="h-6 w-6 rotate-180" />
                      </div>
                    </div>
                  </div>
                </div>
              </CollapsibleContent>
            </Collapsible>
            
            <Collapsible className="w-full border rounded-lg overflow-hidden mb-3">
              <CollapsibleTrigger className="flex justify-between items-center w-full p-4 bg-gray-50">
                <span className="font-semibold">Common Problems & Solutions</span>
                <span>▼</span>
              </CollapsibleTrigger>
              <CollapsibleContent className="p-4">
                <p className="text-gray-700 mb-3">{plant.commonProblems}</p>
                <div className="space-y-3">
                  <div className="border-l-4 border-yellow-400 pl-3">
                    <h4 className="font-medium">Yellowing Leaves</h4>
                    <p className="text-gray-700 text-sm">Usually indicates overwatering. Allow soil to dry out between waterings.</p>
                  </div>
                  <div className="border-l-4 border-brown-400 pl-3">
                    <h4 className="font-medium">Brown Leaf Tips</h4>
                    <p className="text-gray-700 text-sm">Low humidity. Increase misting or use a humidifier.</p>
                  </div>
                  <div className="border-l-4 border-red-400 pl-3">
                    <h4 className="font-medium">Root Rot</h4>
                    <p className="text-gray-700 text-sm">Caused by overwatering. Remove affected roots and repot in fresh soil.</p>
                  </div>
                </div>
              </CollapsibleContent>
            </Collapsible>
            
            <Collapsible className="w-full border rounded-lg overflow-hidden">
              <CollapsibleTrigger className="flex justify-between items-center w-full p-4 bg-gray-50">
                <span className="font-semibold">Propagation</span>
                <span>▼</span>
              </CollapsibleTrigger>
              <CollapsibleContent className="p-4">
                <p className="text-gray-700 mb-3">{plant.propagation}</p>
                <div className="space-y-3">
                  <div>
                    <h4 className="font-medium">Stem Cuttings</h4>
                    <ol className="list-decimal pl-5 text-gray-700 text-sm">
                      <li>Cut a stem with at least one node and a leaf.</li>
                      <li>Allow the cut end to callus for 1-2 days.</li>
                      <li>Place in water or moist soil.</li>
                      <li>Keep in bright, indirect light.</li>
                      <li>Roots should develop in 2-4 weeks.</li>
                    </ol>
                  </div>
                  <div>
                    <h4 className="font-medium">Division</h4>
                    <ol className="list-decimal pl-5 text-gray-700 text-sm">
                      <li>Remove the plant from its pot.</li>
                      <li>Gently separate the root ball into sections.</li>
                      <li>Ensure each section has healthy roots and stems.</li>
                      <li>Plant each division in appropriate potting mix.</li>
                      <li>Water thoroughly and place in indirect light.</li>
                    </ol>
                  </div>
                </div>
              </CollapsibleContent>
            </Collapsible>
          </TabsContent>
          
          <TabsContent value="reviews" className="space-y-4">
            <div className="flex items-center mb-4">
              <div className="text-3xl font-bold mr-2">{plant.rating}</div>
              <div className="flex-1">
                <div className="flex text-amber-500 mb-1">
                  {"★★★★★".slice(0, Math.floor(plant.rating))}
                  {"☆☆☆☆☆".slice(0, 5 - Math.floor(plant.rating))}
                </div>
                <div className="text-gray-500 text-sm">{plant.reviews} reviews</div>
              </div>
              <Button variant="outline" className="ml-2">Write a Review</Button>
            </div>
            
            <div className="space-y-4">
              <div className="p-4 border rounded-lg">
                <div className="flex justify-between mb-2">
                  <div className="font-semibold">John Doe</div>
                  <div className="text-gray-500 text-sm">2 weeks ago</div>
                </div>
                <div className="flex text-amber-500 mb-2">★★★★★</div>
                <p className="text-gray-700">This plant is stunning! Arrived in perfect condition and has been thriving in my living room. Very happy with my purchase.</p>
                <div className="flex justify-between items-center mt-3">
                  <div className="flex items-center gap-2 text-gray-500">
                    <ThumbsUp className="h-4 w-4" />
                    <span>12</span>
                  </div>
                  <Button variant="ghost" size="sm" className="text-gray-500">Reply</Button>
                </div>
              </div>
              
              <div className="p-4 border rounded-lg">
                <div className="flex justify-between mb-2">
                  <div className="font-semibold">Jane Smith</div>
                  <div className="text-gray-500 text-sm">1 month ago</div>
                </div>
                <div className="flex text-amber-500 mb-2">★★★★☆</div>
                <p className="text-gray-700">Beautiful plant, but a few leaves were damaged during shipping. Customer service was very helpful and offered a partial refund.</p>
                <div className="flex justify-between items-center mt-3">
                  <div className="flex items-center gap-2 text-gray-500">
                    <ThumbsUp className="h-4 w-4" />
                    <span>8</span>
                  </div>
                  <Button variant="ghost" size="sm" className="text-gray-500">Reply</Button>
                </div>
              </div>
              
              <div className="p-4 border rounded-lg">
                <div className="flex justify-between mb-2">
                  <div className="font-semibold">Robert Johnson</div>
                  <div className="text-gray-500 text-sm">2 months ago</div>
                </div>
                <div className="flex text-amber-500 mb-2">★★★★★</div>
                <p className="text-gray-700">This is my third Monstera and definitely the healthiest one I've purchased. The plant is thriving and putting out new leaves already!</p>
                <div className="flex justify-between items-center mt-3">
                  <div className="flex items-center gap-2 text-gray-500">
                    <ThumbsUp className="h-4 w-4" />
                    <span>15</span>
                  </div>
                  <Button variant="ghost" size="sm" className="text-gray-500">Reply</Button>
                </div>
              </div>
              
              <Button variant="outline" className="w-full">Load More Reviews</Button>
            </div>
          </TabsContent>
        </Tabs>
      </div>
      
      <div className="p-4 border-t bg-white">
        <div className="flex items-center justify-between mb-2">
          <div className="font-semibold">Similar Plants</div>
          <Link to="/marketplace" className="text-green-600 text-sm">View All</Link>
        </div>
        <div className="flex gap-3 overflow-x-auto pb-2">
          {[1, 2, 3].map((i) => (
            <div key={i} className="min-w-[140px] border rounded-lg overflow-hidden">
              <img 
                src={`/lovable-uploads/${i === 1 ? '81f6d068-8c80-4e65-9ad0-2d3fe0a6f480' : i === 2 ? '69501614-b92c-43f9-89e5-85971b5b6ede' : 'dc7e6fce-2b21-472e-99f7-7f20be83b76f'}.png`} 
                alt="Similar plant" 
                className="h-24 w-full object-cover" 
              />
              <div className="p-2">
                <div className="text-sm font-medium truncate">
                  {i === 1 ? 'Fiddle Leaf Fig' : i === 2 ? 'Snake Plant' : 'Pothos'}
                </div>
                <div className="text-green-600 text-sm font-semibold">${(29.99 + i * 5).toFixed(2)}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
      
      <BottomNavigation />
    </div>
  );
};

export default PlantDetailPage;

