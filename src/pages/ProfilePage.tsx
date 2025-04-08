
const handleMenuItemClick = (item: string) => {
  if (!isAuthenticated && ['Bookmarks', 'Favorites', 'Cart', 'Orders', 'Purchases', 'Addresses', 
                           'Payment Methods', 'Edit Profile', 'Seller Dashboard', 'Messages',
                           'My Blog Posts', 'Saved Articles', 'Write New Post'].includes(item)) {
    setShowLoginDialog(true);
    return;
  }
  
  // Handle blog-related menu items
  if (item === "My Blog Posts") {
    navigate("/blog/my-posts");
    return;
  }
  
  if (item === "Saved Articles") {
    navigate("/blog/saved-articles");
    return;
  }
  
  if (item === "Write New Post") {
    navigate("/blog/write-post");
    return;
  }
  
  if (item === "Bookmarks") {
    navigate("/bookmarks");
    return;
  }
  
  if (item === "Favorites") {
    navigate("/favorites");
    return;
  }
  
  if (item === "Cart") {
    navigate("/cart");
    return;
  }
  
  if (item === "Orders") {
    navigate("/orders");
    return;
  }

  if (item === "Purchases") {
    navigate("/purchases");
    return;
  }

  if (item === "Addresses") {
    navigate("/addresses");
    return;
  }

  if (item === "Payment Methods") {
    navigate("/payment-methods");
    return;
  }
  
  if (item === "Edit Profile") {
    navigate("/edit-profile");
    return;
  }
  
  if (item === "Change Password") {
    navigate("/change-password");
    return;
  }
  
  if (item === "Language") {
    navigate("/language-settings");
    return;
  }
  
  if (item === "Help") {
    navigate("/help-center");
    return;
  }
  
  if (item === "About") {
    navigate("/about");
    return;
  }
  
  if (item === "Privacy") {
    navigate("/privacy-policy");
    return;
  }
  
  if (item === "Terms") {
    navigate("/terms-of-use");
    return;
  }

  if (item === "Submit Ticket") {
    navigate("/submit-ticket");
    return;
  }

  if (item === "Seller Dashboard") {
    navigate("/seller-dashboard");
    return;
  }
  
  if (item === "Messages") {
    navigate("/profile/messages");
    return;
  }
  
  toast({
    title: "Coming Soon",
    description: `The ${item} feature is under development.`,
  });
};
