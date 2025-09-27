import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { Eye, EyeOff, Vote, UserPlus } from "lucide-react";
import { useAppDispatch, useAppSelector } from "@/hooks/redux";
import { useLoginMutation } from "@/store/api/apiSlice";
import { loginStart, loginSuccess, loginFailure } from "@/store/slices/authSlice";

const LoginForm = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [activationcode, setActivationcode] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();
  const dispatch = useAppDispatch();
  const { loading } = useAppSelector((state) => state.auth);
  const [login] = useLoginMutation();

  // const validateEmail = (email: string) => {
  //   const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  //   return emailRegex.test(email);
  // };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email || !password) {
      toast({
        title: "Validation Error",
        description: "Please fill in all fields",
        variant: "destructive",
      });
      return;
    }

    if (!activationcode.trim()) {
      toast({
        title: "Validation Error",
        description: "Activation Code is required",
        variant: "destructive"
      });
      return;
    }

    dispatch(loginStart());

    try {
      const data = await login({
        identifier: email,
        password: password,
        activationCode: activationcode,
      }).unwrap();

      dispatch(loginSuccess({
        name: data.username,
        email: email,
        role: data.role,
        activationCode: data.activationCode,
        token: data.token,
        username: data.username,
      }));

      toast({
        title: "Login Successful",
        description: "Welcome to Chunaav!",
      });

      navigate("/dashboard");
    } catch (error: any) {
      dispatch(loginFailure());
      toast({
        title: "Login Failed",
        description: error.message || "Invalid credentials. Please try again.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-hero p-4">
      <Card className="w-full max-w-md shadow-elegant">
        <CardHeader className="text-center">
          <div className="flex justify-center mb-4">
            <div className="p-3 bg-gradient-primary rounded-full">
              <Vote className="h-8 w-8 text-white" />
            </div>
          </div>
          <CardTitle className="text-2xl font-bold text-civic-primary">Welcome to Chunaav</CardTitle>
          <CardDescription className="text-muted-foreground">
            Enter your credentials to access the election management system
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">User Name/Mobile</Label>
              <Input
                id="email"
                type="text"
                placeholder="Enter your Username/Mobile number"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="transition-all duration-200 focus:ring-civic-primary"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="pr-10 transition-all duration-200 focus:ring-civic-primary"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>

            
            <div className="space-y-2">
              <Label htmlFor="activationCode">Activation Code</Label>
              <Input
                id="activationCode"
                name="activationCode"
                type="text"
                placeholder="Enter activation code"
                value={activationcode}
                onChange={(e)=>setActivationcode(e.target.value)}
                required
                className="transition-all duration-200 focus:ring-2 focus:ring-civic-primary/20"
              />
            </div>

            <Button
              type="submit"
              className="w-full bg-gradient-primary hover:opacity-90 transition-opacity"
              disabled={loading}
            >
              {loading ? "Signing in..." : "Sign In"}
            </Button>
          </form>
          
          <div className="mt-6 text-center">
            <p className="text-sm text-muted-foreground">
              Don't have an account?{" "}
              <Link 
                to="/signup" 
                className="font-medium text-civic-primary hover:text-civic-primary/80 transition-colors duration-200 inline-flex items-center gap-1"
              >
                <UserPlus className="h-4 w-4" />
                Create Account
              </Link>
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default LoginForm;