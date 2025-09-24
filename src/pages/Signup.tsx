import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { Eye, EyeOff, UserPlus } from "lucide-react";

const Signup = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [formData, setFormData] = useState({
    username: "",
    password: "",
    fullName: "",
    mobileNumber: "",
    activationCode: ""
  });
  
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const validateForm = () => {
    if (!formData.username.trim()) {
      toast({
        title: "Validation Error",
        description: "Username is required",
        variant: "destructive"
      });
      return false;
    }
    
    if (!formData.password.trim() || formData.password.length < 6) {
      toast({
        title: "Validation Error", 
        description: "Password must be at least 6 characters long",
        variant: "destructive"
      });
      return false;
    }
    
    if (!formData.fullName.trim()) {
      toast({
        title: "Validation Error",
        description: "Full Name is required", 
        variant: "destructive"
      });
      return false;
    }
    
    if (!formData.mobileNumber.trim() || !/^\d{10}$/.test(formData.mobileNumber)) {
      toast({
        title: "Validation Error",
        description: "Please enter a valid 10-digit mobile number",
        variant: "destructive"
      });
      return false;
    }
    
    if (!formData.activationCode.trim()) {
      toast({
        title: "Validation Error",
        description: "Activation Code is required",
        variant: "destructive"
      });
      return false;
    }
    
    return true;
  };

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    setIsLoading(true);
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Mock validation - in real app, this would be an API call
      if (formData.activationCode !== "ADMIN2024") {
        throw new Error("Invalid activation code");
      }
      
      // Store user data
      const userData = {
        name: formData.fullName,
        email: formData.username + "@chunaav.com", // Mock email generation
        avatar: null,
        mobile: formData.mobileNumber
      };
      
      localStorage.setItem("user", JSON.stringify(userData));
      
      toast({
        title: "Account Created!",
        description: "Welcome to Chunaav Dashboard. Redirecting to dashboard...",
      });
      
      // Redirect to dashboard after successful signup
      setTimeout(() => {
        navigate("/dashboard");
      }, 1000);
      
    } catch (error) {
      toast({
        title: "Signup Failed",
        description: error instanceof Error ? error.message : "An error occurred during signup. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-civic-primary via-civic-primary/90 to-civic-secondary flex items-center justify-center p-4">
      <Card className="w-full max-w-md shadow-2xl border-0">
        <CardHeader className="space-y-1 pb-4">
          <div className="flex items-center justify-center mb-4">
            <div className="w-16 h-16 bg-civic-primary rounded-full flex items-center justify-center">
              <UserPlus className="w-8 h-8 text-white" />
            </div>
          </div>
          <CardTitle className="text-2xl font-bold text-center text-civic-primary">
            Create Account
          </CardTitle>
          <p className="text-center text-muted-foreground text-sm">
            Join the Chunaav Election Management System
          </p>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSignup} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="username">Username</Label>
              <Input
                id="username"
                name="username"
                type="text"
                placeholder="Enter your username"
                value={formData.username}
                onChange={handleInputChange}
                required
                className="transition-all duration-200 focus:ring-2 focus:ring-civic-primary/20"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <div className="relative">
                <Input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter your password"
                  value={formData.password}
                  onChange={handleInputChange}
                  required
                  className="pr-10 transition-all duration-200 focus:ring-2 focus:ring-civic-primary/20"
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? (
                    <EyeOff className="h-4 w-4 text-muted-foreground" />
                  ) : (
                    <Eye className="h-4 w-4 text-muted-foreground" />
                  )}
                </Button>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="fullName">Full Name</Label>
              <Input
                id="fullName"
                name="fullName"
                type="text"
                placeholder="Enter your full name"
                value={formData.fullName}
                onChange={handleInputChange}
                required
                className="transition-all duration-200 focus:ring-2 focus:ring-civic-primary/20"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="mobileNumber">Mobile Number</Label>
              <Input
                id="mobileNumber"
                name="mobileNumber"
                type="tel"
                placeholder="Enter 10-digit mobile number"
                value={formData.mobileNumber}
                onChange={handleInputChange}
                required
                maxLength={10}
                className="transition-all duration-200 focus:ring-2 focus:ring-civic-primary/20"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="activationCode">Activation Code</Label>
              <Input
                id="activationCode"
                name="activationCode"
                type="text"
                placeholder="Enter activation code"
                value={formData.activationCode}
                onChange={handleInputChange}
                required
                className="transition-all duration-200 focus:ring-2 focus:ring-civic-primary/20"
              />
            </div>

            <Button 
              type="submit" 
              className="w-full bg-civic-primary hover:bg-civic-primary/90 text-white font-medium py-2.5 transition-all duration-200"
              disabled={isLoading}
            >
              {isLoading ? "Creating Account..." : "Sign Up"}
            </Button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-sm text-muted-foreground">
              Already have an account?{" "}
              <Link 
                to="/" 
                className="font-medium text-civic-primary hover:text-civic-primary/80 transition-colors duration-200"
              >
                Sign In
              </Link>
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Signup;