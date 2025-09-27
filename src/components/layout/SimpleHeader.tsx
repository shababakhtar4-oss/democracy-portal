import { LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import defaultAvatar from "@/assets/default-avatar.png";

interface SimpleHeaderProps {
  user: {
    name: string;
    email: string;
    avatar?: string | null;
  };
}

const SimpleHeader = ({ user }: SimpleHeaderProps) => {
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
    <div className="w-full bg-gradient-to-r from-purple-600 to-purple-700 px-8 py-6">
      <div className="flex items-center justify-between">
        <h1 className="text-4xl font-bold text-white">Chunav</h1>
        
        <div className="flex items-center space-x-4">
          <span className="text-white font-medium">{user.name}</span>
          <Avatar className="h-12 w-12 border-2 border-white/30">
            <AvatarImage 
              src={user.avatar || defaultAvatar} 
              alt={user.name}
              className="object-cover"
            />
            <AvatarFallback className="bg-white text-purple-600 font-bold">
              {user.name?.charAt(0) || '?'}
            </AvatarFallback>
          </Avatar>
          <Button 
            variant="ghost" 
            onClick={handleLogout}
            className="text-white hover:bg-white/10 px-4 py-2"
          >
            Logout
          </Button>
        </div>
      </div>
    </div>
  );
};

export default SimpleHeader;