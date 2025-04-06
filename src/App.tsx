
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import ForumPage from "./pages/ForumPage";
import MyPostsPage from "./pages/MyPostsPage";
import PostDetailPage from "./pages/PostDetailPage";
import NotFound from "./pages/NotFound";
import ProfilePage from "./pages/ProfilePage";
import BookmarksPage from "./pages/BookmarksPage";
import RecipesPage from "./pages/RecipesPage";
import RecipeDetailPage from "./pages/RecipeDetailPage";
import RecipeSearchPage from "./pages/RecipeSearchPage";
import AllRecipesPage from "./pages/AllRecipesPage";
import ScanPage from "./pages/ScanPage";
import AnimalDetailPage from "./pages/AnimalDetailPage";
import ScanCameraPage from "./pages/ScanCameraPage";
import FoodScanCameraPage from "./pages/FoodScanCameraPage";
import FoodDetailPage from "./pages/FoodDetailPage";
import MarketplacePage from "./pages/MarketplacePage";
import ProductDetailPage from "./pages/ProductDetailPage";
import AddListingPage from "./pages/AddListingPage";
import CartPage from "./pages/CartPage";
import FavoritesPage from "./pages/FavoritesPage";
import AddressesPage from "./pages/AddressesPage";
import PaymentMethodsPage from "./pages/PaymentMethodsPage";
import PurchasesPage from "./pages/PurchasesPage";
import CheckoutPage from "./pages/CheckoutPage";
import EditProfilePage from "./pages/EditProfilePage";
import ChangePasswordPage from "./pages/ChangePasswordPage";
import OrdersPage from "./pages/OrdersPage";
import LanguageSettingsPage from "./pages/LanguageSettingsPage";
import HelpCenterPage from "./pages/HelpCenterPage";
import AboutPage from "./pages/AboutPage";
import PrivacyPolicyPage from "./pages/PrivacyPolicyPage";
import TermsOfUsePage from "./pages/TermsOfUsePage";
import SubmitTicketPage from "./pages/SubmitTicketPage";
import SubscriptionPage from "./pages/SubscriptionPage";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/profile" element={<ProfilePage />} />
          <Route path="/bookmarks" element={<BookmarksPage />} />
          <Route path="/forum" element={<ForumPage />} />
          <Route path="/forum/my-posts" element={<MyPostsPage />} />
          <Route path="/forum/post/:postId" element={<PostDetailPage />} />
          <Route path="/recipes" element={<RecipesPage />} />
          <Route path="/recipes/:recipeId" element={<RecipeDetailPage />} />
          <Route path="/recipes/search" element={<RecipeSearchPage />} />
          <Route path="/recipes/all" element={<AllRecipesPage />} />
          <Route path="/scan" element={<ScanPage />} />
          <Route path="/animal/:animalId" element={<AnimalDetailPage />} />
          <Route path="/food/:foodId" element={<FoodDetailPage />} />
          <Route path="/scan-camera" element={<ScanCameraPage />} />
          <Route path="/food-scan-camera" element={<FoodScanCameraPage />} />
          <Route path="/marketplace" element={<MarketplacePage />} />
          <Route path="/marketplace/product/:productId" element={<ProductDetailPage />} />
          <Route path="/add-listing" element={<AddListingPage />} />
          <Route path="/cart" element={<CartPage />} />
          <Route path="/favorites" element={<FavoritesPage />} />
          <Route path="/addresses" element={<AddressesPage />} />
          <Route path="/payment-methods" element={<PaymentMethodsPage />} />
          <Route path="/purchases" element={<PurchasesPage />} />
          <Route path="/checkout" element={<CheckoutPage />} />
          <Route path="/edit-profile" element={<EditProfilePage />} />
          <Route path="/change-password" element={<ChangePasswordPage />} />
          <Route path="/orders" element={<OrdersPage />} />
          <Route path="/language-settings" element={<LanguageSettingsPage />} />
          <Route path="/help-center" element={<HelpCenterPage />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/privacy-policy" element={<PrivacyPolicyPage />} />
          <Route path="/terms-of-use" element={<TermsOfUsePage />} />
          <Route path="/submit-ticket" element={<SubmitTicketPage />} />
          <Route path="/subscription" element={<SubscriptionPage />} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
