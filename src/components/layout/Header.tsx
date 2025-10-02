import { User, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import civicHeader from "@/assets/civic-header.jpg";
import defaultAvatar from "@/assets/default-avatar.png";

interface HeaderProps {
  user: {
    name: string;
    email: string;
    avatar?: string | null;
  };
}

const Header = ({ user }: HeaderProps) => {
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
        className="h-48 w-full bg-cover bg-center relative overflow-hidden"
        style={{ backgroundImage: `url(${civicHeader})` }}
      >
        <div className="absolute inset-0 bg-gradient-hero opacity-75"></div>
        <div className="absolute inset-0 flex items-center justify-between p-6">
          <div>
            <h1 className="text-3xl font-bold text-white mb-2">Chunaav Dashboard</h1>
            <p className="text-blue-100">Election Management System</p>
          </div>
          
          {/* User Profile Section */}
          <div className="flex items-center space-x-4">
            <div className="text-right hidden md:block">
              <p className="text-white font-medium">{userData?.username}</p>
              <p className="text-blue-100 text-sm">{user.email}</p>
            </div>
            
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="relative h-10 w-10 rounded-full hover:bg-white/10">
                  <Avatar className="h-10 w-10 border-2 border-white/20">
                    <AvatarImage src={user.avatar || defaultAvatar} alt={user.name} />
                    <AvatarFallback className="bg-civic-primary text-white">
                      {userData?.username.split(' ').map(n => n[0]).join('').toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56" align="end">
                <DropdownMenuItem className="cursor-pointer">
                  <User className="mr-2 h-4 w-4" />
                  Profile
                </DropdownMenuItem>
                <DropdownMenuItem onClick={handleLogout} className="cursor-pointer text-destructive">
                  <LogOut className="mr-2 h-4 w-4" />
                  Logout
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Header;