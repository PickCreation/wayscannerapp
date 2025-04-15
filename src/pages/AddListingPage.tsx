import React, { useState } from "react";
import { ChevronLeft, Camera, Upload, Plus, X, Tag, Clock, DollarSign, Ruler, Package, WashingMachine } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { useToast } from "@/hooks/use-toast";
import BottomNavigation from "@/components/BottomNavigation";
import CameraSheet from "@/components/CameraSheet";
import ProductVariationsSection, { VariationType } from "@/components/ProductVariationsSection";

const countries = [
  "Afghanistan", "Albania", "Algeria", "Andorra", "Angola", "Antigua and Barbuda", "Argentina", "Armenia", "Australia", 
  "Austria", "Azerbaijan", "Bahamas", "Bahrain", "Bangladesh", "Barbados", "Belarus", "Belgium", "Belize", "Benin", 
  "Bhutan", "Bolivia", "Bosnia and Herzegovina", "Botswana", "Brazil", "Brunei", "Bulgaria", "Burkina Faso", "Burundi", 
  "Cabo Verde", "Cambodia", "Cameroon", "Canada", "Central African Republic", "Chad", "Chile", "China", "Colombia", 
  "Comoros", "Congo", "Costa Rica", "Croatia", "Cuba", "Cyprus", "Czech Republic", "Denmark", "Djibouti", "Dominica", 
  "Dominican Republic", "Ecuador", "Egypt", "El Salvador", "Equatorial Guinea", "Eritrea", "Estonia", "Eswatini", 
  "Ethiopia", "Fiji", "Finland", "France", "Gabon", "Gambia", "Georgia", "Germany", "Ghana", "Greece", "Grenada", 
  "Guatemala", "Guinea", "Guinea-Bissau", "Guyana", "Haiti", "Honduras", "Hungary", "Iceland", "India", "Indonesia", 
  "Iran", "Iraq", "Ireland", "Israel", "Italy", "Jamaica", "Japan", "Jordan", "Kazakhstan", "Kenya", "Kiribati", 
  "Korea, North", "Korea, South", "Kosovo", "Kuwait", "Kyrgyzstan", "Laos", "Latvia", "Lebanon", "Lesotho", "Liberia", 
  "Libya", "Liechtenstein", "Lithuania", "Luxembourg", "Madagascar", "Malawi", "Malaysia", "Maldives", "Mali", "Malta", 
  "Marshall Islands", "Mauritania", "Mauritius", "Mexico", "Micronesia", "Moldova", "Monaco", "Mongolia", "Montenegro", 
  "Morocco", "Mozambique", "Myanmar", "Namibia", "Nauru", "Nepal", "Netherlands", "New Zealand", "Nicaragua", "Niger", 
  "Nigeria", "North Macedonia", "Norway", "Oman", "Pakistan", "Palau", "Palestine", "Panama", "Papua New Guinea", 
  "Paraguay", "Peru", "Philippines", "Poland", "Portugal", "Qatar", "Romania", "Russia", "Rwanda", "Saint Kitts and Nevis", 
  "Saint Lucia", "Saint Vincent and the Grenadines", "Samoa", "San Marino", "Sao Tome and Principe", "Saudi Arabia", 
  "Senegal", "Serbia", "Seychelles", "Sierra Leone", "Singapore", "Slovakia", "Slovenia", "Solomon Islands", "Somalia", 
  "South Africa", "South Sudan", "Spain", "Sri Lanka", "Sudan", "Suriname", "Sweden", "Switzerland", "Syria", "Taiwan", 
  "Tajikistan", "Tanzania", "Thailand", "Timor-Leste", "Togo", "Tonga", "Trinidad and Tobago", "Tunisia", "Turkey", 
  "Turkmenistan", "Tuvalu", "Uganda", "Ukraine", "United Arab Emirates", "United Kingdom", "United States", "Uruguay", 
  "Uzbekistan", "Vanuatu", "Vatican City", "Venezuela", "Vietnam", "Yemen", "Zambia", "Zimbabwe"
];

const colors = [
  "Red", "Gold", "Pink", "Orange", "Grey", "Brown", "Navy blue", "Yellow", 
  "Black", "Green", "Maroon", "Silver", "Turquoise", "Purple", "Teal", "Blue"
];

const conditions = ["New", "Open Box", "Like New", "Used", "Refurbished"];

const formSchema = z.object({
  title: z.string().min(3, { message: "Title must be at least 3 characters" }),
  description: z.string().min(10, { message: "Description must be at least 10 characters" }),
  price: z.string().refine((val) => !isNaN(Number(val)) && Number(val) > 0, {
    message: "Price must be a positive number",
  }),
  category: z.string().min(1, { message: "Please select a category" }),
  condition: z.string().min(1, { message: "Please select condition" }),
  weight: z.string().refine((val) => !isNaN(Number(val)) && Number(val) >= 0, {
    message: "Weight must be a non-negative number",
  }),
  height: z.string().refine((val) => !isNaN(Number(val)) && Number(val) >= 0, {
    message: "Height must be a non-negative number",
  }),
  width: z.string().refine((val) => !isNaN(Number(val)) && Number(val) >= 0, {
    message: "Width must be a non-negative number",
  }),
  material: z.string().min(1, { message: "Please enter material information" }),
  careInstructions: z.string().optional(),
  color: z.string().min(1, { message: "Please select a color" }),
  brand: z.string().min(1, { message: "Please enter a brand" }),
  country: z.string().min(1, { message: "Please select a country" }),
  tags: z.array(z.string()).max(6, { message: "Maximum 6 tags allowed" }).optional(),
  shippingDays: z.string().refine((val) => !isNaN(Number(val)) && Number(val) > 0 && Number(val) <= 30, {
    message: "Shipping days must be between 1 and 30 days",
  }),
});

const AddListingPage = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [images, setImages] = useState<{file: File, preview: string}[]>([]);
  const [activeNavItem, setActiveNavItem] = useState<"home" | "forum" | "recipes" | "shop">("shop");
  const [showCameraSheet, setShowCameraSheet] = useState(false);
  const [tags, setTags] = useState<string[]>([]);
  const [tagInput, setTagInput] = useState("");
  const [calculatedAmount, setCalculatedAmount] = useState<string>("0.00");
  const [commissionAmount, setCommissionAmount] = useState<string>("0.00");
  const COMMISSION_RATE = 0.10; // 10% commission
  
  const [productVariations, setProductVariations] = useState<VariationType[]>([]);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      description: "",
      price: "",
      category: "",
      condition: "",
      weight: "",
      height: "",
      width: "",
      material: "",
      careInstructions: "",
      color: "",
      brand: "",
      country: "",
      tags: [],
      shippingDays: "5", // Default to 5 days
    },
  });

  const watchPrice = form.watch("price");
  
  React.useEffect(() => {
    if (watchPrice && !isNaN(Number(watchPrice))) {
      const price = Number(watchPrice);
      const commission = price * COMMISSION_RATE;
      const sellerReceives = price - commission;
      
      setCommissionAmount(commission.toFixed(2));
      setCalculatedAmount(sellerReceives.toFixed(2));
    } else {
      setCommissionAmount("0.00");
      setCalculatedAmount("0.00");
    }
  }, [watchPrice]);

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file && images.length < 6) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImages([...images, {
          file: file,
          preview: reader.result as string
        }]);
      };
      reader.readAsDataURL(file);
    }
  };

  const removeImage = (index: number) => {
    setImages(images.filter((_, i) => i !== index));
  };

  const addTag = () => {
    const trimmedTag = tagInput.trim();
    if (trimmedTag && tags.length < 6 && !tags.includes(trimmedTag)) {
      const newTags = [...tags, trimmedTag];
      setTags(newTags);
      form.setValue("tags", newTags);
      setTagInput("");
    } else if (tags.includes(trimmedTag)) {
      toast({
        title: "Tag already exists",
        description: "This tag is already added",
        variant: "destructive",
      });
    } else if (tags.length >= 6) {
      toast({
        title: "Maximum tags reached",
        description: "You can only add up to 6 tags",
        variant: "destructive",
      });
    }
  };

  const removeTag = (tagToRemove: string) => {
    const newTags = tags.filter((tag) => tag !== tagToRemove);
    setTags(newTags);
    form.setValue("tags", newTags);
  };

  const handleTagInputKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      addTag();
    }
  };

  const onSubmit = (values: z.infer<typeof formSchema>) => {
    if (images.length === 0) {
      toast({
        title: "Image Required",
        description: "Please upload at least one product image",
        variant: "destructive",
      });
      return;
    }

    values.variations = productVariations;

    console.log({
      ...values,
      images: images.map(img => img.preview),
      tags: tags,
      sellerAmount: calculatedAmount,
      commissionAmount: commissionAmount,
    });

    toast({
      title: "Listing Created",
      description: "Your listing has been created successfully",
    });

    setTimeout(() => {
      navigate("/marketplace");
    }, 1500);
  };

  const handleNavItemClick = (item: "home" | "forum" | "recipes" | "shop") => {
    setActiveNavItem(item);
    
    if (item === "home") {
      navigate("/");
    } else if (item === "forum") {
      navigate("/forum");
    } else if (item === "recipes") {
      navigate("/recipes");
    } else if (item === "shop") {
      navigate("/marketplace");
    }
  };

  const handleCameraClick = () => {
    setShowCameraSheet(true);
  };

  return (
    <div className="pb-20 bg-white min-h-screen">
      <header className="bg-wayscanner-blue text-white py-4 px-4 flex justify-between items-center">
        <button 
          className="p-2" 
          onClick={() => navigate("/marketplace")}
        >
          <ChevronLeft size={24} color="white" />
        </button>
        <h1 className="text-xl font-bold">Add New Listing</h1>
        <div className="w-10"></div> {/* Empty space for balance */}
      </header>

      <div className="p-4">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <div>
              <FormLabel className="block mb-2">Product Images (up to 6)</FormLabel>
              <div className="grid grid-cols-3 gap-2">
                {images.map((image, index) => (
                  <div key={index} className="relative h-24 border rounded overflow-hidden">
                    <img src={image.preview} alt={`Preview ${index}`} className="w-full h-full object-cover" />
                    <button
                      type="button"
                      onClick={() => removeImage(index)}
                      className="absolute top-1 right-1 bg-black bg-opacity-50 rounded-full p-1 text-white"
                    >
                      <X size={14} />
                    </button>
                  </div>
                ))}
                
                {images.length < 6 && (
                  <label className="border-2 border-dashed border-gray-300 rounded flex flex-col items-center justify-center h-24 cursor-pointer bg-gray-50">
                    <Plus size={24} className="text-gray-400" />
                    <span className="text-xs text-gray-500 mt-1">Add Image</span>
                    <input 
                      type="file" 
                      className="hidden" 
                      accept="image/*"
                      onChange={handleImageUpload}
                    />
                  </label>
                )}
              </div>
              {images.length === 0 && (
                <p className="text-xs text-gray-500 mt-1">Please upload at least one image</p>
              )}
            </div>

            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Product Title</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter product title" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="brand"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Brand</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter brand name" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Textarea placeholder="Describe your product" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div>
              <FormLabel className="block mb-2">Tags (max 6)</FormLabel>
              <div className="flex items-center space-x-2 mb-2">
                <Input
                  value={tagInput}
                  onChange={(e) => setTagInput(e.target.value)}
                  onKeyDown={handleTagInputKeyDown}
                  placeholder="Add a tag"
                  className="flex-1"
                  disabled={tags.length >= 6}
                />
                <Button 
                  type="button" 
                  size="sm"
                  onClick={addTag}
                  disabled={tags.length >= 6 || !tagInput.trim()}
                  className="bg-wayscanner-blue hover:bg-blue-700"
                >
                  <Tag size={16} className="mr-1" /> Add
                </Button>
              </div>
              
              {tags.length > 0 && (
                <div className="flex flex-wrap gap-2 mb-2">
                  {tags.map((tag, index) => (
                    <div 
                      key={index} 
                      className="bg-gray-100 px-3 py-1 rounded-full flex items-center text-sm"
                    >
                      <span>{tag}</span>
                      <button
                        type="button"
                        onClick={() => removeTag(tag)}
                        className="ml-2 text-gray-500 hover:text-red-500"
                      >
                        <X size={14} />
                      </button>
                    </div>
                  ))}
                </div>
              )}
              
              <p className="text-xs text-gray-500">
                {tags.length}/6 tags added. Press Enter or click Add to add a tag.
              </p>
            </div>

            <FormField
              control={form.control}
              name="category"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Category</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a category" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="Decor">Decor</SelectItem>
                      <SelectItem value="Animal Accessories">Animal Accessories</SelectItem>
                      <SelectItem value="Plants">Plants</SelectItem>
                      <SelectItem value="Plants Accessories">Plants Accessories</SelectItem>
                      <SelectItem value="Kitchen Essentials">Kitchen Essentials</SelectItem>
                      <SelectItem value="Furniture">Furniture</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="condition"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Condition</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select condition" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {conditions.map(condition => (
                        <SelectItem key={condition} value={condition}>{condition}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="color"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Color</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select color" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {colors.map(color => (
                        <SelectItem key={color} value={color}>{color}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="price"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Price ($)</FormLabel>
                    <FormControl>
                      <Input placeholder="0.00" type="number" step="0.01" min="0" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="weight"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Weight (kg)</FormLabel>
                    <FormControl>
                      <Input placeholder="0.00" type="number" step="0.01" min="0" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="height"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Height (cm)</FormLabel>
                    <div className="flex items-center">
                      <FormControl>
                        <Input placeholder="0" type="number" step="0.1" min="0" {...field} />
                      </FormControl>
                      <Ruler className="ml-2 text-gray-400" size={18} />
                    </div>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="width"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Width (cm)</FormLabel>
                    <div className="flex items-center">
                      <FormControl>
                        <Input placeholder="0" type="number" step="0.1" min="0" {...field} />
                      </FormControl>
                      <Ruler className="ml-2 text-gray-400" size={18} />
                    </div>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="material"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Material</FormLabel>
                  <div className="flex items-center">
                    <FormControl>
                      <Input placeholder="Enter material (e.g., Wood, Metal, Cotton)" {...field} />
                    </FormControl>
                    <Package className="ml-2 text-gray-400" size={18} />
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="careInstructions"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Care Instructions</FormLabel>
                  <div className="flex items-center">
                    <FormControl>
                      <Textarea 
                        placeholder="Add care or maintenance instructions for the product" 
                        {...field} 
                      />
                    </FormControl>
                    <WashingMachine className="ml-2 text-gray-400 self-start mt-3" size={18} />
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />

            <ProductVariationsSection 
              variations={productVariations}
              setVariations={setProductVariations}
            />

            {Number(watchPrice) > 0 && (
              <div className="bg-gray-50 border rounded-md p-4">
                <div className="flex items-center mb-2">
                  <DollarSign className="h-5 w-5 text-green-500 mr-2" />
                  <h3 className="font-medium">Price Breakdown</h3>
                </div>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <p>Product price:</p>
                    <p className="font-medium">${Number(watchPrice).toFixed(2)}</p>
                  </div>
                  <div className="flex justify-between text-red-500">
                    <p>Platform fee (10%):</p>
                    <p>-${commissionAmount}</p>
                  </div>
                  <div className="flex justify-between pt-2 border-t font-medium text-green-600">
                    <p>You receive:</p>
                    <p>${calculatedAmount}</p>
                  </div>
                </div>
              </div>
            )}

            <FormField
              control={form.control}
              name="shippingDays"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Shipping Deadline (days)</FormLabel>
                  <div className="flex items-center">
                    <FormControl>
                      <Input 
                        type="number" 
                        min="1" 
                        max="30" 
                        placeholder="5"
                        {...field} 
                      />
                    </FormControl>
                    <Clock className="ml-2 text-gray-400" size={18} />
                  </div>
                  <p className="text-xs text-gray-500 mt-1">
                    Number of days you need to ship the item after receiving an order. Orders not shipped within this period may be automatically canceled.
                  </p>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="country"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Country</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select country" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent className="max-h-[200px]">
                      {countries.map(country => (
                        <SelectItem key={country} value={country}>{country}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button 
              type="submit" 
              className="w-full bg-wayscanner-blue hover:bg-blue-700 text-white"
            >
              Create Listing
            </Button>
          </form>
        </Form>
      </div>

      <BottomNavigation
        activeItem={activeNavItem}
        onItemClick={handleNavItemClick}
        onCameraClick={handleCameraClick}
      />
      
      <CameraSheet open={showCameraSheet} onOpenChange={setShowCameraSheet} />
    </div>
  );
};

export default AddListingPage;
