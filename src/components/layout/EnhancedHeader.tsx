import { User, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import civicHeader from "@/assets/civic-header.jpg";
import defaultAvatar from "@/assets/default-avatar.png";

interface EnhancedHeaderProps {
  user: {
    name: string;
    email: string;
    avatar?: string | null;
  };
}

const EnhancedHeader = ({ user }: EnhancedHeaderProps) => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const userData = localStorage.getItem("user") ? JSON.parse(localStorage.getItem("user") as string) : null;

  const handleLogout = () => {
    localStorage.removeItem("user");
    toast({
      title: "Logged out",
      description: "You have been successfully logged out.",
    });
    navigate("/");
  };

  return (
    <div className="w-full">
      {/* Hero Banner */}
      <div 
        className="h-64 w-full bg-cover bg-center relative overflow-hidden"
        style={{ backgroundImage: `url(${civicHeader})` }}
      >
        <div className="absolute inset-0 bg-gradient-hero opacity-75"></div>
        <div className="absolute inset-0 flex items-center justify-between p-8">
          <div>
            <h1 className="text-4xl font-bold text-white mb-3">Chunaav Dashboard</h1>
            <p className="text-blue-100 text-lg">Election Management System</p>
          </div>
          
          {/* Enhanced User Profile Section */}
          <div className="flex items-center space-x-6">
            <div className="text-right hidden lg:block">
              <p className="text-white font-bold text-xl">{userData.activationCode}</p>
              <p className="text-blue-100 text-base mt-1">{userData.role}</p>
            </div>
            
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="relative rounded-full hover:bg-white/10 p-2">
                  <Avatar className="h-20 w-20 border-4 border-white/30 shadow-2xl hover:border-white/50 transition-all duration-200">
                    <AvatarImage 
                      src={user.avatar || defaultAvatar} 
                      alt={user.name}
                      className="object-cover"
                    />
                    <AvatarFallback className="bg-civic-primary text-white text-2xl font-bold">
                      {userData?.activationCode}
                    </AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-64" align="end">
                <div className="px-4 py-3 border-b">
                  <p className="font-semibold text-lg">{user.name}</p>
                  <p className="text-muted-foreground text-sm">{user.email}</p>
                </div>
                <DropdownMenuItem className="cursor-pointer py-3">
                  <User className="mr-3 h-5 w-5" />
                  <span className="text-base">Profile Settings</span>
                </DropdownMenuItem>
                <DropdownMenuItem onClick={handleLogout} className="cursor-pointer text-destructive py-3">
                  <LogOut className="mr-3 h-5 w-5" />
                  <span className="text-base">Logout</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EnhancedHeader;