import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, ChevronRight, ChevronDown, ChevronUp, ThumbsUp, ThumbsDown, Check, Leaf, Building2 } from 'lucide-react';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Separator } from '@/components/ui/separator';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Button } from '@/components/ui/button';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";

const plantData = {
  id: '1',
  name: 'Ti Leaf',
  scientificName: 'Cordyline fruticosa',
  alsoKnownAs: ['Ti Plant', 'Good Luck Plant', 'Cabbage Palm', 'Palm Lily'],
  isPoisonous: true,
  mainImage: '/lovable-uploads/1f7ad51d-b73f-4008-99f5-a320f60304dc.png',
  galleryImages: [
    '/lovable-uploads/1f7ad51d-b73f-4008-99f5-a320f60304dc.png',
    '/lovable-uploads/4c436a75-e04b-4265-8025-91e7bb146566.png',
    '/lovable-uploads/81f6d068-8c80-4e65-9ad0-2d3fe0a6f480.png',
  ],
  location: {
    indoor: true,
    outdoor: false
  },
  care: {
    difficulty: 'Easy',
    water: 'Every 10 days',
    fertilize: 'Every month',
    prune: 'Regularly',
    repot: 'Every year'
  },
  requirements: {
    pot: 'Medium pot with drainage holes',
    soil: 'Well-draining potting mix',
    lighting: 'Part sun',
    humidity: 'High (>60%)',
    hardiness: '10a - 11b',
    temperature: '73°F - 95°F'
  },
  description: [
    'A perfect companion to any Mediterranean-style garden, the Ti Leaf is easy to grow and has large gorgeous leaves with beautiful flowers during the summer.',
    'Ti leaf (Cordyline fruticosa) is a perennial evergreen that grows as a shrub. It is native to regions of Southeast Asia, Hawaii, and Australia.',
    'Ti leaf, when grown outdoors, can reach heights of 3-12ft(1-4m) and is also perfect for growing indoors, reaching more manageable heights of 3-6ft(1-2m).',
    'You can identify the Ti leaf by its large leaves, which appear in various colors, including red, green, purple, black, and pink. Identification is made more straightforward due to the small pink or white flowers that bloom during the summer.'
  ],
  propagation: {
    methods: ['Stem cuttings', 'Division'],
    difficulty: 'Moderate',
    bestTime: 'Spring or summer',
    steps: [
      'Cut a stem section with at least 2-3 nodes',
      'Let it dry for a day',
      'Plant in moist soil',
      'Keep warm and humid until roots develop'
    ]
  },
  sowing: {
    seeds: 'Ti plants are rarely grown from seeds in cultivation',
    whenToSow: 'Spring to early summer if available',
    howToSow: [
      'Use fresh seeds as viability decreases rapidly',
      'Sow seeds in a well-draining seed starting mix',
      'Maintain temperature around 70-75°F (21-24°C)',
      'Keep soil consistently moist but not soggy',
      'Germination can take 2-8 weeks',
      'Seedlings are delicate and slow-growing initially'
    ],
    successRate: 'Low to moderate due to seed viability issues'
  },
  greenhouse: {
    benefits: [
      'Provides ideal temperature and humidity control',
      'Protection from pests and diseases',
      'Extends growing season',
      'Allows for propagation year-round'
    ],
    idealConditions: {
      temperature: '65-85°F (18-29°C)',
      humidity: '60-80%',
      lighting: 'Bright, indirect light or 30-50% shade cloth',
      airflow: 'Good ventilation to prevent fungal issues'
    },
    commonIssues: [
      'Heat stress during summer (requires ventilation)',
      'Fungal problems if humidity is too high with poor airflow',
      'Pest infestations can spread quickly in greenhouse environments'
    ]
  },
  funFact: 'In Hawaiian culture, Ti leaves are considered sacred and are used in traditional ceremonies. They are believed to bring good luck and ward off evil spirits.',
  toxicInfo: {
    isPoisonous: true,
    toxicToAnimals: true,
    effects: 'Contact with the sap of the Ti leaf can cause mild skin irritation in sensitive individuals. Ingestion of the leaves is generally considered non-toxic but may result in mild stomach upset in some cases. It is not known to have severe toxic effects.',
    toxicParts: ['Roots', 'Flowers', 'Fruit', 'Sterms', 'Foliage'],
    toxin: 'Foliage'
  }
};

const PlantDetailPage = () => {
  const { plantId } = useParams();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('description');
  const [selectedLocation, setSelectedLocation] = useState('indoor');
  const [isHelpful, setIsHelpful] = useState<boolean | null>(null);
  const [sowingSheetOpen, setSowingSheetOpen] = useState(false);
  const [greenhouseSheetOpen, setGreenhouseSheetOpen] = useState(false);
  
  const plant = plantData;
  const bestAlternativeNames = plant.alsoKnownAs.slice(0, 2);

  const handleBack = () => {
    navigate(-1);
  };

  return (
    <div className="bg-white min-h-screen pb-8 text-gray-800">
      <div className="fixed top-0 left-0 right-0 bg-[#034AFF] z-10 h-16 flex items-center px-4 shadow-sm">
        <button 
          onClick={handleBack}
          className="w-10 h-10 rounded-full flex items-center justify-center"
        >
          <ArrowLeft className="h-6 w-6 text-white" />
        </button>
        <h1 className="ml-4 text-xl font-semibold text-white">Plant Details</h1>
      </div>
      
      <div className="relative w-full h-[35vh] mt-16">
        <img 
          src={plant.mainImage} 
          alt={plant.name} 
          className="w-full h-full object-cover rounded-lg px-5 pt-5"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent to-white opacity-70"></div>
      </div>
      
      <div className="px-4 pb-4 max-w-md mx-auto">
        <div className="mt-4 mb-5">
          <h1 className="text-3xl font-bold text-gray-800">{plant.name}</h1>
          <p className="text-xl text-gray-600 mt-1">{plant.scientificName}</p>
        </div>
        
        <Tabs defaultValue="description" value={activeTab} onValueChange={setActiveTab} className="mt-4">
          <div className="flex justify-center mb-4">
            <TabsList className="grid grid-cols-3 rounded-full bg-gray-100 p-1 w-full">
              <TabsTrigger 
                value="description" 
                className="rounded-full py-2 px-3 text-sm data-[state=active]:bg-[#034AFF] data-[state=active]:text-white data-[state=active]:shadow transition-all"
              >
                Description
              </TabsTrigger>
              <TabsTrigger 
                value="care" 
                className="rounded-full py-2 px-3 text-sm data-[state=active]:bg-[#034AFF] data-[state=active]:text-white data-[state=active]:shadow transition-all"
              >
                Care
              </TabsTrigger>
              <TabsTrigger 
                value="history" 
                className="rounded-full py-2 px-3 text-sm data-[state=active]:bg-[#034AFF] data-[state=active]:text-white data-[state=active]:shadow transition-all"
              >
                History
              </TabsTrigger>
            </TabsList>
          </div>
          
          <TabsContent value="description" className="mt-4 animate-in fade-in-50">
            <div className="space-y-4">
              <div>
                <p className="text-green-600 text-sm font-semibold">Latin name:</p>
                <p className="text-base">{plant.scientificName}</p>
              </div>
              
              <div>
                <p className="text-[#034AFF] text-sm font-semibold">Also known as:</p>
                <p className="text-base">{bestAlternativeNames.join(', ')}</p>
              </div>
              
              {plant.isPoisonous && (
                <Sheet>
                  <SheetTrigger asChild>
                    <div className="flex items-center py-3 px-4 rounded-lg bg-gray-100 mt-2 cursor-pointer">
                      <div className="bg-amber-500 rounded-full p-2 mr-4">
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <path d="M12 12C13.6569 12 15 10.6569 15 9C15 7.34315 13.6569 6 12 6C10.3431 6 9 7.34315 9 9C9 10.6569 10.3431 12 12 12Z" fill="#FFFFFF"/>
                          <path d="M19.6 8.4C19.9 8.4 20.1 8.2 20.1 7.9C20.1 7.6 19.9 7.4 19.6 7.4C19.3 7.4 19.1 7.6 19.1 7.9C19.1 8.2 19.3 8.4 19.6 8.4Z" fill="#FFFFFF"/>
                          <path d="M15.8 21.2C15.3 21.8 14.7 22 14 22H10C9.3 22 8.7 21.8 8.2 21.2C7.7 20.6 7.5 19.9 7.6 19.2L8.2 14.8C8.3 14.4 8.7 14.1 9.1 14.1H14.9C15.3 14.1 15.7 14.4 15.8 14.8L16.4 19.2C16.5 19.9 16.3 20.6 15.8 21.2ZM18.4 5.6C17.6 5.6 16.8 5.9 16.1 6.4C15.4 5 14 4 12.3 4C10.2 4 8.4 5.4 8 7.3C6.4 7.1 4.8 8.1 4.2 9.6C3.6 11.1 4.1 12.7 5.3 13.7C5.8 14.1 6.4 14.3 7 14.3H7.5C7.8 14.3 8 14.1 8 13.8C8 13.5 7.8 13.3 7.5 13.3C7.5 13.3 7.4 13.3 7 13.3C6.6 13.3 6.2 13.1 5.9 12.9C4.9 12.1 4.5 10.8 5 9.6C5.5 8.4 6.7 7.7 8 8.1C8.3 8.2 8.6 7.9 8.7 7.6C8.9 6 10.5 5 12.1 5.2C13.6 5.4 14.7 6.8 14.7 8.4C14.7 8.7 14.9 8.9 15.2 8.9C15.5 8.9 15.7 8.7 15.7 8.4C15.7 8.2 15.7 8.1 15.7 8.1C15.7 7.4 16.5 6.6 17.2 6.6C18.3 6.6 19.2 7.4 19.2 8.6C19.2 9.7 18.4 10.6 17.3 10.6H16.8C16.5 10.6 16.3 10.8 16.3 11.1C16.3 11.4 16.5 11.6 16.8 11.6H17.3C18.9 11.6 20.3 10.2 20.3 8.6C20.1 6.9 19 5.6 18.4 5.6Z" fill="#FFFFFF"/>
                        </svg>
                      </div>
                      <span className="text-gray-800 font-medium">Poisonous</span>
                      <ChevronRight className="ml-auto text-gray-400" />
                    </div>
                  </SheetTrigger>
                  <SheetContent side="bottom" className="h-[80vh] rounded-t-[16px] pt-6">
                    <SheetHeader className="text-left pb-4 border-b border-gray-200">
                      <div className="flex items-center">
                        <div className="bg-amber-500 rounded-full p-2 mr-3">
                          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M12 12C13.6569 12 15 10.6569 15 9C15 7.34315 13.6569 6 12 6C10.3431 6 9 7.34315 9 9C9 10.6569 10.3431 12 12 12Z" fill="#FFFFFF"/>
                            <path d="M19.6 8.4C19.9 8.4 20.1 8.2 20.1 7.9C20.1 7.6 19.9 7.4 19.6 7.4C19.3 7.4 19.1 7.6 19.1 7.9C19.1 8.2 19.3 8.4 19.6 8.4Z" fill="#FFFFFF"/>
                            <path d="M15.8 21.2C15.3 21.8 14.7 22 14 22H10C9.3 22 8.7 21.8 8.2 21.2C7.7 20.6 7.5 19.9 7.6 19.2L8.2 14.8C8.3 14.4 8.7 14.1 9.1 14.1H14.9C15.3 14.1 15.7 14.4 15.8 14.8L16.4 19.2C16.5 19.9 16.3 20.6 15.8 21.2ZM18.4 5.6C17.6 5.6 16.8 5.9 16.1 6.4C15.4 5 14 4 12.3 4C10.2 4 8.4 5.4 8 7.3C6.4 7.1 4.8 8.1 4.2 9.6C3.6 11.1 4.1 12.7 5.3 13.7C5.8 14.1 6.4 14.3 7 14.3H7.5C7.8 14.3 8 14.1 8 13.8C8 13.5 7.8 13.3 7.5 13.3C7.5 13.3 7.4 13.3 7 13.3C6.6 13.3 6.2 13.1 5.9 12.9C4.9 12.1 4.5 10.8 5 9.6C5.5 8.4 6.7 7.7 8 8.1C8.3 8.2 8.6 7.9 8.7 7.6C8.9 6 10.5 5 12.1 5.2C13.6 5.4 14.7 6.8 14.7 8.4C14.7 8.7 14.9 8.9 15.2 8.9C15.5 8.9 15.7 8.7 15.7 8.4C15.7 8.2 15.7 8.1 15.7 8.1C15.7 7.4 16.5 6.6 17.2 6.6C18.3 6.6 19.2 7.4 19.2 8.6C19.2 9.7 18.4 10.6 17.3 10.6H16.8C16.5 10.6 16.3 10.8 16.3 11.1C16.3 11.4 16.5 11.6 16.8 11.6H17.3C18.9 11.6 20.3 10.2 20.3 8.6C20.1 6.9 19 5.6 18.4 5.6Z" fill="#FFFFFF"/>
                          </svg>
                        </div>
                        <SheetTitle className="text-lg font-semibold">Poisonous</SheetTitle>
                      </div>
                    </SheetHeader>
                    
                    <div className="space-y-4 mt-4">
                      <div className="flex items-center">
                        <p className="text-base font-medium">Poisonous:</p>
                        <p className="ml-2">Yes</p>
                      </div>
                      
                      <div className="flex items-center">
                        <p className="text-base font-medium">Toxic to Animals</p>
                      </div>
                      
                      <div className="bg-gray-50 p-4 rounded-lg">
                        <p className="text-base font-medium mb-2">Effects:</p>
                        <p className="text-sm text-gray-700">
                          {plant.toxicInfo.effects}
                        </p>
                      </div>
                      
                      <div className="bg-gray-50 p-4 rounded-lg">
                        <p className="text-base font-medium mb-2">Toxic Parts:</p>
                        <ul className="space-y-2">
                          {plant.toxicInfo.toxicParts.map((part, index) => (
                            <li key={index} className="flex items-center">
                              <div className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center mr-2">
                                <Check className="h-4 w-4 text-green-600" />
                              </div>
                              <span>{part}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                      
                      <div className="bg-gray-50 p-4 rounded-lg">
                        <p className="text-base font-medium mb-2">Toxin:</p>
                        <div className="flex items-center">
                          <div className="w-6 h-6 bg-red-100 rounded-full flex items-center justify-center mr-2">
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                              <rect x="5" y="5" width="14" height="14" rx="2" fill="#FF4D6D"/>
                            </svg>
                          </div>
                          <span>{plant.toxicInfo.toxin}</span>
                        </div>
                      </div>
                    </div>
                  </SheetContent>
                </Sheet>
              )}
              
              <div className="mt-4">
                <h3 className="text-lg font-bold mb-3">Gallery</h3>
                <div className="grid grid-cols-3 gap-2">
                  {plant.galleryImages.map((img, index) => (
                    <div key={index} className="rounded-lg overflow-hidden aspect-square">
                      <img src={img} alt={`${plant.name} ${index + 1}`} className="w-full h-full object-cover" />
                    </div>
                  ))}
                </div>
              </div>

              <div className="mt-4">
                <h3 className="text-lg font-bold mb-3">Choose plant location</h3>
                <div className="grid grid-cols-2 gap-3 mt-2">
                  <Button 
                    variant={selectedLocation === 'indoor' ? 'default' : 'outline'}
                    className={`py-2 px-4 rounded-full font-medium h-auto ${selectedLocation === 'indoor' ? 'bg-[#034AFF] text-white' : 'border-[#034AFF] text-[#034AFF]'}`}
                    onClick={() => setSelectedLocation('indoor')}
                  >
                    Indoor
                  </Button>
                  <Button 
                    variant={selectedLocation === 'outdoor' ? 'default' : 'outline'}
                    className={`py-2 px-4 rounded-full font-medium h-auto ${selectedLocation === 'outdoor' ? 'bg-[#034AFF] text-white' : 'border-[#034AFF] text-[#034AFF]'}`}
                    onClick={() => setSelectedLocation('outdoor')}
                  >
                    Outdoor
                  </Button>
                </div>
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="care" className="mt-4 animate-in fade-in-50">
            <div className="space-y-4">
              <h3 className="text-lg font-bold mb-2">Cares</h3>
              <div className="space-y-3">
                <button className="w-full flex items-center justify-between bg-gray-100 p-3 rounded-lg hover:bg-gray-200 transition-colors">
                  <div className="flex items-center">
                    <div className="w-10 flex justify-center">
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <rect x="4" y="4" width="16" height="16" rx="1.5" stroke="#696974" strokeWidth="1.5"/>
                        <rect x="7" y="7" width="4" height="4" fill="#696974"/>
                        <rect x="13" y="7" width="4" height="4" fill="#E5E5E5"/>
                        <rect x="7" y="13" width="4" height="4" fill="#E5E5E5"/>
                        <rect x="13" y="13" width="4" height="4" fill="#E5E5E5"/>
                      </svg>
                    </div>
                    <div className="ml-3">
                      <h4 className="text-base font-medium">Difficulty</h4>
                      <p className="text-[#034AFF] text-sm">{plant.care.difficulty}</p>
                    </div>
                  </div>
                  <ChevronRight className="text-gray-400" size={18} />
                </button>
                
                <button className="w-full flex items-center justify-between bg-gray-100 p-3 rounded-lg hover:bg-gray-200 transition-colors">
                  <div className="flex items-center">
                    <div className="w-10 flex justify-center">
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M12 22C16.4183 22 20 18.4183 20 14C20 10.5 17.4 7.26 12 2C6.6 7.26 4 10.5 4 14C4 18.4183 7.58172 22 12 22Z" stroke="#0EA5E9" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                    </div>
                    <div className="ml-3">
                      <h4 className="text-base font-medium">Water</h4>
                      <p className="text-[#034AFF] text-sm">{plant.care.water}</p>
                    </div>
                  </div>
                  <ChevronRight className="text-gray-400" size={18} />
                </button>
                
                <button className="w-full flex items-center justify-between bg-gray-100 p-3 rounded-lg hover:bg-gray-200 transition-colors">
                  <div className="flex items-center">
                    <div className="w-10 flex justify-center">
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <circle cx="12" cy="12" r="9" stroke="#0EA5E9" strokeWidth="2"/>
                        <circle cx="12" cy="12" r="3" fill="#0EA5E9"/>
                      </svg>
                    </div>
                    <div className="ml-3">
                      <h4 className="text-base font-medium">Fertilize</h4>
                      <p className="text-[#034AFF] text-sm">{plant.care.fertilize}</p>
                    </div>
                  </div>
                  <ChevronRight className="text-gray-400" size={18} />
                </button>
              </div>
              
              <div className="grid grid-cols-2 gap-3 mt-1">
                <button className="w-full flex items-center justify-between bg-gray-100 p-3 rounded-lg hover:bg-gray-200 transition-colors">
                  <div className="flex items-center">
                    <div className="w-8 flex justify-center">
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M6 7H18M6 12H18M6 17H18" stroke="#696974" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                    </div>
                    <div className="ml-2">
                      <h4 className="text-base font-medium">Prune</h4>
                      <p className="text-[#034AFF] text-sm">{plant.care.prune}</p>
                    </div>
                  </div>
                  <ChevronRight className="text-gray-400" size={16} />
                </button>
                
                <button className="w-full flex items-center justify-between bg-gray-100 p-3 rounded-lg hover:bg-gray-200 transition-colors">
                  <div className="flex items-center">
                    <div className="w-8 flex justify-center">
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M8 21H16M12 21V11M12 11C9.79086 11 8 9.20914 8 7C8 4.79086 9.79086 3 12 3C14.2091 3 16 4.79086 16 7C16 9.20914 14.2091 11 12 11Z" stroke="#696974" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                    </div>
                    <div className="ml-2">
                      <h4 className="text-base font-medium">Repot</h4>
                      <p className="text-[#034AFF] text-sm">{plant.care.repot}</p>
                    </div>
                  </div>
                  <ChevronRight className="text-gray-400" size={16} />
                </button>
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="history" className="mt-4 animate-in fade-in-50">
            <div className="space-y-4">
              <h3 className="text-lg font-bold mb-2">Plant requirements</h3>
              
              <div className="grid grid-cols-2 gap-3 mb-3">
                <button className="w-full flex items-center justify-between bg-gray-100 p-3 rounded-lg hover:bg-gray-200 transition-colors">
                  <div className="flex items-center">
                    <div className="w-8 flex justify-center">
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M12 10C12 8.89543 11.1046 8 10 8H6C4.89543 8 4 8.89543 4 10V19C4 20.1046 4.89543 21 6 21H10C11.1046 21 12 20.1046 12 19V10Z" fill="#FFC288"/>
                        <path d="M20 18C20 19.1046 19.1046 20 18 20H14C12.8954 20 12 19.1046 12 18V10C12 8.89543 12.8954 8 14 8H18C19.1046 8 20 8.89546 20 10V18Z" fill="#FFC288"/>
                        <path d="M13.3246 4.27679C12.8688 3.54691 11.1312 3.54691 10.6754 4.27679L9.25336 6.42198C9.09691 6.67087 9.26524 7 9.57853 7H14.4215C14.7348 7 14.9031 6.67087 14.7466 6.42198L13.3246 4.27679Z" fill="#FFC288"/>
                      </svg>
                    </div>
                    <div className="ml-2">
                      <h4 className="text-base font-medium">Pot</h4>
                      <p className="text-[#034AFF] text-xs">{plant.requirements.pot}</p>
                    </div>
                  </div>
                  <ChevronRight className="text-gray-400" size={16} />
                </button>
                
                <button className="w-full flex items-center justify-between bg-gray-100 p-3 rounded-lg hover:bg-gray-200 transition-colors">
                  <div className="flex items-center">
                    <div className="w-8 flex justify-center">
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <rect x="4" y="12" width="16" height="8" rx="1" fill="#D2B48C"/>
                        <path d="M12 3L16 9H8L12 3Z" fill="#8BC34A"/>
                      </svg>
                    </div>
                    <div className="ml-2">
                      <h4 className="text-base font-medium">Soil</h4>
                      <p className="text-[#034AFF] text-xs">{plant.requirements.soil}</p>
                    </div>
                  </div>
                  <ChevronRight className="text-gray-400" size={16} />
                </button>
              </div>
              
              <div className="space-y-3">
                <button className="w-full flex items-center justify-between bg-gray-100 p-3 rounded-lg hover:bg-gray-200 transition-colors">
                  <div className="flex items-center">
                    <div className="w-10 flex justify-center">
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <circle cx="12" cy="12" r="6" fill="#FDB813"/>
                        <path d="M12 0V3M12 21V24M24 12H21M3 12H0M20.5 3.5L18.4 5.6M5.6 18.4L3.5 20.5M20.5 20.5L18.4 18.4M5.6 5.6L3.5 3.5" stroke="#FDB813" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                    </div>
                    <div className="ml-3">
                      <h4 className="text-base font-medium">Lighting</h4>
                      <p className="text-[#034AFF] text-sm">{plant.requirements.lighting}</p>
                    </div>
                  </div>
                  <ChevronRight className="text-gray-400" size={18} />
                </button>
                
                <button className="w-full flex items-center justify-between bg-gray-100 p-3 rounded-lg hover:bg-gray-200 transition-colors">
                  <div className="flex items-center">
                    <div className="w-10 flex justify-center">
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M17 7L7 17M17 17L7 7" stroke="#3B82F6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                    </div>
                    <div className="ml-3">
                      <h4 className="text-base font-medium">Humidity</h4>
                      <p className="text-[#034AFF] text-sm">{plant.requirements.humidity}</p>
                    </div>
                  </div>
                  <ChevronRight className="text-gray-400" size={18} />
                </button>
                
                <button className="w-full flex items-center justify-between bg-gray-100 p-3 rounded-lg hover:bg-gray-200 transition-colors">
                  <div className="flex items-center">
                    <div className="w-10 flex justify-center">
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M3 20.4V3.6C3 3.26863 3.26863 3 3.6 3H20.4C20.7314 3 21 3.26863 21 3.6V20.4C21 20.7314 20.7314 21 20.4 21H3.6C3.26863 21 3 20.7314 3 20.4Z" fill="#3B82F6"/>
                        <path d="M14 16.5V11.5H16V16.5H14ZM11 16.5V7.5H13V16.5H11ZM8 16.5V13.5H10V16.5H8Z" fill="white"/>
                      </svg>
                    </div>
                    <div className="ml-3">
                      <h4 className="text-base font-medium">Hardiness zone</h4>
                      <p className="text-[#034AFF] text-sm">{plant.requirements.hardiness}</p>
                    </div>
                  </div>
                  <ChevronRight className="text-gray-400" size={18} />
                </button>
                
                <button className="w-full flex items-center justify-between bg-gray-100 p-3 rounded-lg hover:bg-gray-200 transition-colors">
                  <div className="flex items-center">
                    <div className="w-10 flex justify-center">
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <rect x="7" y="3" width="3" height="18" rx="1.5" fill="#CBD5E1"/>
                        <rect x="7" y="6" width="3" height="8" rx="1.5" fill="#EF4444"/>
                        <circle cx="8.5" cy="18.5" r="2.5" fill="#EF4444"/>
                      </svg>
                    </div>
                    <div className="ml-3">
                      <h4 className="text-base font-medium">Temperature</h4>
                      <p className="text-[#034AFF] text-sm">{plant.requirements.temperature}</p>
                    </div>
                  </div>
                  <ChevronRight className="text-gray-400" size={18} />
                </button>
              </div>
            </div>
          </TabsContent>
        </Tabs>
        
        <div className="mt-6 py-2">
          <h2 className="text-xl font-bold mb-4">General information</h2>
          
          <Accordion type="single" collapsible className="space-y-2">
            <AccordionItem value="description" className="border-none">
              <AccordionTrigger className="flex items-center bg-gray-100 p-3 rounded-lg hover:no-underline">
                <div className="flex items-center">
                  <div className="bg-amber-200 p-1.5 rounded mr-3">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M4 6H20M4 12H20M4 18H12" stroke="#1E1F24" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </div>
                  <span className="text-base font-medium">Description</span>
                </div>
              </AccordionTrigger>
              <AccordionContent className="pt-3 px-1 text-gray-700 text-sm">
                {plant.description.map((paragraph, index) => (
                  <p key={index} className="mb-3">{paragraph}</p>
                ))}
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="sowing" className="border-none">
              <AccordionTrigger className="flex items-center bg-gray-100 p-3 rounded-lg hover:no-underline">
                <div className="flex items-center">
                  <div className="bg-green-200 p-1.5 rounded mr-3">
                    <Leaf className="h-4 w-4 text-green-700" />
                  </div>
                  <span className="text-base font-medium">Sowing</span>
                </div>
              </AccordionTrigger>
              <AccordionContent className="pt-3 px-1 text-gray-700 text-sm">
                <Sheet open={sowingSheetOpen} onOpenChange={setSowingSheetOpen}>
                  <SheetTrigger asChild>
                    <Button variant="outline" className="w-full">
                      View Sowing Information
                    </Button>
                  </SheetTrigger>
                  <SheetContent side="bottom" className="h-[80vh] rounded-t-[16px] pt-6">
                    <SheetHeader className="text-left pb-4 border-b border-gray-200">
                      <div className="flex items-center">
                        <div className="bg-green-200 p-1.5 rounded mr-3">
                          <Leaf className="h-4 w-4 text-green-700" />
                        </div>
                        <SheetTitle className="text-lg font-semibold">Sowing Information</SheetTitle>
                      </div>
                    </SheetHeader>
                    
                    <div className="space-y-4 mt-4">
                      <div className="bg-gray-50 p-4 rounded-lg">
                        <p className="text-base font-medium mb-2">Seeds:</p>
                        <p className="text-sm text-gray-700">{plant.sowing.seeds}</p>
                      </div>
                      
                      <div className="bg-gray-50 p-4 rounded-lg">
                        <p className="text-base font-medium mb-2">When to Sow:</p>
                        <p className="text-sm text-gray-700">{plant.sowing.whenToSow}</p>
                      </div>
                      
                      <div className="bg-gray-50 p-4 rounded-lg">
                        <p className="text-base font-medium mb-2">How to Sow:</p>
                        <ul className="space-y-2">
                          {plant.sowing.howToSow.map((step, index) => (
                            <li key={index} className="flex items-start">
                              <div className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center mr-2 mt-0.5">
                                <Check className="h-4 w-4 text-green-600" />
                              </div>
                              <span className="text-sm text-gray-700">{step}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                      
                      <div className="bg-gray-50 p-4 rounded-lg">
                        <p className="text-base font-medium mb-2">Success Rate:</p>
                        <p className="text-sm text-gray-700">{plant.sowing.successRate}</p>
                      </div>
                    </div>
                  </SheetContent>
                </Sheet>
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="greenhouse" className="border-none">
              <AccordionTrigger className="flex items-center bg-gray-100 p-3 rounded-lg hover:no-underline">
                <div className="flex items-center">
                  <div className="bg-blue-200 p-1.5 rounded mr-3">
                    <Building2 className="h-4 w-4 text-blue-700" />
                  </div>
                  <span className="text-base font-medium">Greenhouse</span>
                </div>
              </AccordionTrigger>
              <AccordionContent className="pt-3 px-1 text-gray-700 text-sm">
                <Sheet open={greenhouseSheetOpen} onOpenChange={setGreenhouseSheetOpen}>
                  <SheetTrigger asChild>
                    <Button variant="outline" className="w-full">
                      View Greenhouse Information
                    </Button>
                  </SheetTrigger>
                  <SheetContent side="bottom" className="h-[80vh] rounded-t-[16px] pt-6">
                    <SheetHeader className="text-left pb-4 border-b border-gray-200">
                      <div className="flex items-center">
                        <div className="bg-blue-200 p-1.5 rounded mr-3">
                          <Building2 className="h-4 w-4 text-blue-700" />
                        </div>
                        <SheetTitle className="text-lg font-semibold">Greenhouse Growing</SheetTitle>
                      </div>
                    </SheetHeader>
                    
                    <div className="space-y-4 mt-4">
                      <div className="bg-gray-50 p-4 rounded-lg">
                        <p className="text-base font-medium mb-2">Benefits:</p>
                        <ul className="space-y-2">
                          {plant.greenhouse.benefits.map((benefit, index) => (
                            <li key={index} className="flex items-start">
                              <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center mr-2 mt-0.5">
                                <Check className="h-4 w-4 text-blue-600" />
                              </div>
                              <span className="text-sm text-gray-700">{benefit}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                      
                      <div className="bg-gray-50 p-4 rounded-lg">
                        <p className="text-base font-medium mb-2">Ideal Conditions:</p>
                        <div className="space-y-2">
                          <div className="flex items-start">
                            <span className="text-sm font-medium w-28">Temperature:</span>
                            <span className="text-sm text-gray-700">{plant.greenhouse.idealConditions.temperature}</span>
                          </div>
                          <div className="flex items-start">
                            <span className="text-sm font-medium w-28">Humidity:</span>
                            <span className="text-sm text-gray-700">{plant.greenhouse.idealConditions.humidity}</span>
                          </div>
                          <div className="flex items-start">
                            <span className="text-sm font-medium w-28">Lighting:</span>
                            <span className="text-sm text-gray-700">{plant.greenhouse.idealConditions.lighting}</span>
                          </div>
                          <div className="flex items-start">
                            <span className="text-sm font-medium w-28">Airflow:</span>
                            <span className="text-sm text-gray-700">{plant.greenhouse.idealConditions.airflow}</span>
                          </div>
                        </div>
                      </div>
                      
                      <div className="bg-gray-50 p-4 rounded-lg">
                        <p className="text-base font-medium mb-2">Common Issues:</p>
                        <ul className="space-y-2">
                          {plant.greenhouse.commonIssues.map((issue, index) => (
                            <li key={index} className="flex items-start">
                              <div className="w-6 h-6 bg-red-100 rounded-full flex items-center justify-center mr-2 mt-0.5">
                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                  <path d="M12 8v4M12 16h.01M22 12c0 5.523-4.477 10-10 10S2 17.523 2 12 6.477 2 12 2s10 4.477 10 10z" stroke="#EF4444" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                </svg>
                              </div>
                              <span className="text-sm text-gray-700">{issue}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </SheetContent>
                </Sheet>
              </AccordionContent>
            </AccordionItem>
            
            <AccordionItem value="propagation" className="border-none">
              <AccordionTrigger className="flex items-center bg-gray-100 p-3 rounded-lg hover:no-underline">
                <div className="flex items-center">
                  <div className="bg-blue-200 p-1.5 rounded mr-3">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M12 3L4 9V21H20V9L12 3Z" stroke="#1E1F24" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      <path d="M8 14V21M16 14V21" stroke="#1E1F24" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </div>
                  <span className="text-base font-medium">Propagation</span>
                </div>
              </AccordionTrigger>
              <AccordionContent className="pt-3 px-1 text-sm">
                <p className="mb-2">Methods: {plant.propagation.methods.join(', ')}</p>
                <p className="mb-2">Difficulty: {plant.propagation.difficulty}</p>
                <p className="mb-3">Best time: {plant.propagation.bestTime}</p>
                <h4 className="font-medium mb-2">Steps:</h4>
                <ul className="list-disc pl-5 space-y-1">
                  {plant.propagation.steps.map((step, index) => (
                    <li key={index}>{step}</li>
                  ))}
                </ul>
              </AccordionContent>
            </AccordionItem>
            
            <AccordionItem value="funFact" className="border-none">
              <AccordionTrigger className="flex items-center bg-gray-100 p-3 rounded-lg hover:no-underline">
                <div className="flex items-center">
                  <div className="bg-yellow-200 p-1.5 rounded mr-3">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <circle cx="12" cy="12" r="9" fill="#FFE91F"/>
                      <circle cx="9" cy="10" r="1.5" fill="#1E1F24"/>
                      <circle cx="15" cy="10" r="1.5" fill="#1E1F24"/>
                      <path d="M8 15C8 15 9.5 17 12 17C14.5 17 16 15 16 15" stroke="#1E1F24" strokeWidth="2" strokeLinecap="round"/>
                    </svg>
                  </div>
                  <span className="text-base font-medium">Fun fact</span>
                </div>
              </AccordionTrigger>
              <AccordionContent className="pt-3 px-1 text-sm">
                <p>{plant.funFact}</p>
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </div>
        
        <div className="mt-6 py-2">
          <Separator className="bg-gray-200 mb-4" />
          <div className="text-center mb-4">
            <p className="text-base">Was this information helpful?</p>
          </div>
          <div className="flex justify-center gap-6">
            <Button 
              variant="outline"
              className={`w-12 h-12 rounded-full flex items-center justify-center p-0 ${isHelpful === false ? 'bg-red-500 text-white border-red-500' : 'bg-gray-100 text-gray-600'}`}
              onClick={() => setIsHelpful(false)}
            >
              <ThumbsDown className="h-6 w-6" />
            </Button>
            <Button 
              variant="outline"
              className={`w-12 h-12 rounded-full flex items-center justify-center p-0 ${isHelpful === true ? 'bg-[#034AFF] text-white border-[#034AFF]' : 'bg-gray-100 text-gray-600'}`}
              onClick={() => setIsHelpful(true)}
            >
              <ThumbsUp className="h-6 w-6" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PlantDetailPage;
