import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, ChevronRight, ChevronDown, ChevronUp, ThumbsUp, ThumbsDown, Check, Leaf, Building2 } from 'lucide-react';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Separator } from '@/components/ui/separator';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Button } from '@/components/ui/button';
import BottomNavigation from '@/components/BottomNavigation';
import CameraSheet from '@/components/CameraSheet';
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
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";

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
  },
  careInfo: {
    difficulty: {
      level: 'Easy',
      description: 'The Ti Leaf is considered an easy plant to care for, making it perfect for beginners. It adapts well to various indoor conditions and is quite forgiving if you occasionally forget to water it.',
      tips: [
        'Keep away from drafts and sudden temperature changes',
        'Rotate occasionally for even growth',
        'Wipe leaves with a damp cloth to remove dust'
      ]
    },
    water: {
      frequency: 'Every 10 days',
      description: 'Ti Leaf prefers consistently moist soil but is susceptible to root rot if overwatered. Allow the top inch of soil to dry out between waterings.',
      tips: [
        'Reduce watering in winter months',
        'Increase frequency during hot summer days',
        'Use filtered water if possible as they can be sensitive to chlorine and fluoride',
        'Water thoroughly until water drains out of the bottom of the pot'
      ],
      signs: {
        overwatering: ['Yellowing leaves', 'Soft, mushy stems', 'Foul smell from soil'],
        underwatering: ['Crispy brown leaf edges', 'Drooping leaves', 'Slow growth']
      }
    },
    fertilize: {
      frequency: 'Every month',
      description: 'Feed your Ti Leaf with a balanced, water-soluble fertilizer diluted to half the recommended strength during the growing season (spring and summer).',
      tips: [
        'Avoid fertilizing newly repotted plants',
        'Don\'t fertilize if the plant is stressed or showing signs of disease',
        'Flush the soil occasionally to prevent salt buildup'
      ],
      recommended: 'Balanced 10-10-10 or 20-20-20 fertilizer',
      warning: 'Over-fertilizing can lead to leaf burn and root damage.'
    },
    prune: {
      frequency: 'Regularly',
      description: 'Pruning helps maintain the plant\'s shape and encourages bushier growth. Remove any dead, damaged, or yellowing leaves by cutting them close to the stem with clean, sharp scissors.',
      tips: [
        'Sterilize cutting tools before and after pruning',
        'Prune in spring or early summer for best results',
        'You can use pruned stems for propagation'
      ],
      benefits: ['Improves plant appearance', 'Prevents disease spread', 'Encourages new growth']
    },
    repot: {
      frequency: 'Every year',
      description: 'Ti Leaf benefits from annual repotting to refresh the soil and provide more space for root growth. Choose a pot that is 1-2 inches larger in diameter than the current one.',
      steps: [
        'Water the plant a day before repotting',
        'Gently remove from current pot and loosen root ball',
        'Place in new pot with fresh potting mix',
        'Water thoroughly and place in indirect light for a few days'
      ],
      bestTime: 'Spring or early summer',
      signs: ['Roots growing out of drainage holes', 'Plant becoming top-heavy', 'Water draining too quickly']
    }
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
  const [cameraSheetOpen, setCameraSheetOpen] = useState(false);
  const [openCareItem, setOpenCareItem] = useState<string | null>(null);
  
  const plant = plantData;
  const bestAlternativeNames = plant.alsoKnownAs.slice(0, 2);

  const handleBack = () => {
    navigate(-1);
  };

  const handleNavigationClick = (item: "home" | "forum" | "recipes" | "shop" | "profile") => {
    switch (item) {
      case "home":
        navigate("/");
        break;
      case "forum":
        navigate("/forum");
        break;
      case "recipes":
        navigate("/recipes");
        break;
      case "shop":
        navigate("/marketplace");
        break;
      case "profile":
        navigate("/profile");
        break;
      default:
        break;
    }
  };

  const handleCameraClick = () => {
    setCameraSheetOpen(true);
  };
  
  const toggleCareItem = (item: string) => {
    if (openCareItem === item) {
      setOpenCareItem(null);
    } else {
      setOpenCareItem(item);
    }
  };

  return (
    <div className="bg-white min-h-screen pb-16 text-gray-800">
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
              
              {selectedLocation === 'indoor' && (
                <div className="mt-4 space-y-3">
                  <h3 className="text-lg font-bold mb-3">Care Information</h3>
                  
                  <Collapsible
                    open={openCareItem === 'difficulty'}
                    onOpenChange={() => toggleCareItem('difficulty')}
                    className="w-full border rounded-lg overflow-hidden"
                  >
                    <CollapsibleTrigger className="flex items-center justify-between w-full p-4 bg-gray-100">
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
                      {openCareItem === 'difficulty' ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
                    </CollapsibleTrigger>
                    <CollapsibleContent className="bg-white p-4">
                      <div className="space-y-3">
                        <p className="text-gray-700">{plant.careInfo.difficulty.description}</p>
                        <div className="mt-3">
                          <h5 className="font-medium mb-2">Helpful Tips:</h5>
                          <ul className="space-y-2">
                            {plant.careInfo.difficulty.tips.map((tip, index) => (
                              <li key={index} className="flex items-start">
                                <div className="w-5 h-5 bg-green-100 rounded-full flex items-center justify-center mr-2 mt-0.5">
                                  <Check className="h-3 w-3 text-green-600" />
                                </div>
                                <span className="text-sm">{tip}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    </CollapsibleContent>
                  </Collapsible>
                  
                  <Collapsible
                    open={openCareItem === 'water'}
                    onOpenChange={() => toggleCareItem('water')}
                    className="w-full border rounded-lg overflow-hidden"
                  >
                    <CollapsibleTrigger className="flex items-center justify-between w-full p-4 bg-gray-100">
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
                      {openCareItem === 'water' ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
                    </CollapsibleTrigger>
                    <CollapsibleContent className="bg-white p-4">
                      <div className="space-y-3">
                        <p className="text-gray-700">{plant.careInfo.water.description}</p>
                        <div className="mt-3">
                          <h5 className="font-medium mb-2">Watering Tips:</h5>
                          <ul className="space-y-2">
                            {plant.careInfo.water.tips.map((tip, index) => (
                              <li key={index} className="flex items-start">
                                <div className="w-5 h-5 bg-blue-100 rounded-full flex items-center justify-center mr-2 mt-0.5">
                                  <Check className="h-3 w-3 text-blue-600" />
                                </div>
                                <span className="text-sm">{
