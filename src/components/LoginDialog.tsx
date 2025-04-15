import React, { useState } from 'react';
import { Drawer, DrawerContent, DrawerHeader, DrawerTitle, DrawerDescription } from "@/components/ui/drawer";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useToast } from "@/hooks/use-toast";
import { LogIn, User, Lock, Mail, X } from "lucide-react";
import { useFirebaseAuth } from "@/hooks/use-firebase-auth";

interface LoginDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const loginSchema = z.object({
  email: z.string().email({ message: "Please enter a valid email address" }),
  password: z.string().min(6, { message: "Password must be at least 6 characters" }),
});

const signupSchema = z.object({
  name: z.string().min(2, { message: "Name must be at least 2 characters" }),
  email: z.string().email({ message: "Please enter a valid email address" }),
  password: z.string().min(6, { message: "Password must be at least 6 characters" }),
});

const LoginDialog: React.FC<LoginDialogProps> = ({ open, onOpenChange }) => {
  const [activeTab, setActiveTab] = useState<"login" | "signup">("login");
  const { toast } = useToast();
  const { login, signup } = useFirebaseAuth();
  
  const loginForm = useForm<z.infer<typeof loginSchema>>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const signupForm = useForm<z.infer<typeof signupSchema>>({
    resolver: zodResolver(signupSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
    },
  });

  const onLoginSubmit = async (values: z.infer<typeof loginSchema>) => {
    try {
      await login(values.email, values.password);
      loginForm.reset();
      onOpenChange(false);
    } catch (error) {
      console.error("Login error:", error);
    }
  };

  const onSignupSubmit = async (values: z.infer<typeof signupSchema>) => {
    try {
      await signup(values.name, values.email, values.password);
      signupForm.reset();
      onOpenChange(false);
    } catch (error) {
      console.error("Signup error:", error);
    }
  };

  return (
    <Drawer open={open} onOpenChange={onOpenChange}>
      <DrawerContent className="px-4 pb-8">
        <div className="relative">
          <button 
            onClick={() => onOpenChange(false)}
            className="absolute right-1 top-3 p-2 rounded-full hover:bg-gray-100"
            aria-label="Close"
          >
            <X className="h-5 w-5 text-gray-500" />
          </button>
          
          <DrawerHeader className="px-0 pb-0">
            <DrawerTitle className="text-center text-xl">Welcome to WayScanner</DrawerTitle>
            <DrawerDescription className="text-center">
              Login or create an account to access all features
            </DrawerDescription>
          </DrawerHeader>
        </div>
        
        <Tabs 
          defaultValue="login" 
          value={activeTab} 
          onValueChange={(value) => setActiveTab(value as "login" | "signup")}
          className="w-full mt-2"
        >
          <TabsList className="grid w-full grid-cols-2 mb-6">
            <TabsTrigger value="login">Login</TabsTrigger>
            <TabsTrigger value="signup">Sign Up</TabsTrigger>
          </TabsList>
          
          <TabsContent value="login" className="space-y-4">
            <Form {...loginForm}>
              <form onSubmit={loginForm.handleSubmit(onLoginSubmit)} className="space-y-4">
                <FormField
                  control={loginForm.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email</FormLabel>
                      <FormControl>
                        <div className="relative">
                          <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                          <Input 
                            placeholder="you@example.com" 
                            className="pl-10" 
                            {...field} 
                          />
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={loginForm.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Password</FormLabel>
                      <FormControl>
                        <div className="relative">
                          <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                          <Input 
                            type="password" 
                            placeholder="••••••••" 
                            className="pl-10" 
                            {...field} 
                          />
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <Button type="submit" className="w-full gap-2">
                  <LogIn size={16} />
                  Login
                </Button>
              </form>
            </Form>
            
            <div className="text-center">
              <button 
                className="text-sm text-wayscanner-blue hover:underline" 
                onClick={() => console.log("Forgot password clicked")}
              >
                Forgot your password?
              </button>
            </div>
          </TabsContent>
          
          <TabsContent value="signup" className="space-y-4">
            <Form {...signupForm}>
              <form onSubmit={signupForm.handleSubmit(onSignupSubmit)} className="space-y-4">
                <FormField
                  control={signupForm.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Full Name</FormLabel>
                      <FormControl>
                        <div className="relative">
                          <User className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                          <Input 
                            placeholder="John Doe" 
                            className="pl-10" 
                            {...field} 
                          />
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={signupForm.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email</FormLabel>
                      <FormControl>
                        <div className="relative">
                          <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                          <Input 
                            placeholder="you@example.com" 
                            className="pl-10" 
                            {...field} 
                          />
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={signupForm.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Password</FormLabel>
                      <FormControl>
                        <div className="relative">
                          <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                          <Input 
                            type="password" 
                            placeholder="••••••••" 
                            className="pl-10" 
                            {...field} 
                          />
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <Button type="submit" className="w-full gap-2">
                  Create Account
                </Button>
              </form>
            </Form>
            
            <div className="text-xs text-center text-gray-500">
              By signing up, you agree to our <a href="/terms-of-use" className="text-wayscanner-blue hover:underline">Terms of Service</a> and <a href="/privacy-policy" className="text-wayscanner-blue hover:underline">Privacy Policy</a>.
            </div>
          </TabsContent>
        </Tabs>
      </DrawerContent>
    </Drawer>
  );
};

export default LoginDialog;
