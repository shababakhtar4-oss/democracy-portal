import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { 
  List, 
  Settings, 
  Languages, 
  MapPin, 
  Clock, 
  FileText, 
  Key, 
  Users 
} from "lucide-react";
import Header from "@/components/layout/Header";
import DashboardTile from "@/components/dashboard/DashboardTile";

interface User {
  name: string;
  email: string;
  avatar?: string | null;
}

const Dashboard = () => {
  const [user, setUser] = useState<User | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (!storedUser) {
      navigate("/");
      return;
    }
    
    setUser(JSON.parse(storedUser));
  }, [navigate]);

  const dashboardItems = [
    {
      title: "List",
      description: "Manage voter lists and records",
      icon: List,
      path: "/list"
    },
    {
      title: "Settings",
      description: "System configuration and preferences",
      icon: Settings,
      path: "/settings"
    },
    {
      title: "Language",
      description: "Configure language settings",
      icon: Languages,
      path: "/language"
    },
    {
      title: "Booth Locations",
      description: "Manage polling booth locations",
      icon: MapPin,
      path: "/booth-locations"
    },
    {
      title: "Recent Logins",
      description: "View login history and activity",
      icon: Clock,
      path: "/recent-logins"
    },
    {
      title: "Voter Report",
      description: "Generate and view voter reports",
      icon: FileText,
      path: "/voter-report"
    },
    {
      title: "Activation Code",
      description: "Manage system activation codes",
      icon: Key,
      path: "/activation-code"
    },
    {
      title: "Booth Committee",
      description: "Manage booth committee members",
      icon: Users,
      path: "/booth-committee"
    }
  ];

  const handleTileClick = (path: string) => {
    navigate(path);
  };

  if (!user) {
    return null; // Loading state
  }

  return (
    <div className="min-h-screen bg-background">
      <Header user={user} />
      
      <main className="container mx-auto px-6 py-8">
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-civic-primary mb-2">Dashboard</h2>
          <p className="text-muted-foreground">
            Welcome back, {user.name}. Here's your election management overview.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {dashboardItems.map((item) => (
            <DashboardTile
              key={item.title}
              title={item.title}
              description={item.description}
              icon={item.icon}
              onClick={() => handleTileClick(item.path)}
            />
          ))}
        </div>
      </main>
    </div>
  );
};

export default Dashboard;