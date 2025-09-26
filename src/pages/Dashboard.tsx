import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  List,
  Settings,
  Clock,
  UploadCloud,
  BarChart3,
} from "lucide-react";
import SimpleHeader from "@/components/layout/SimpleHeader";
import StatCard from "@/components/dashboard/StatCard";
import DashboardTile from "@/components/dashboard/DashboardTile";
import { Button } from "@/components/ui/button";
import { toast } from "@/components/ui/use-toast";

interface User {
  name: string;
  email: string;
  avatar?: string | null;
}

const Dashboard = () => {
  const [user, setUser] = useState<User | null>(null);
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (!storedUser) {
      navigate("/");
      return;
    }
    setUser(JSON.parse(storedUser));
  }, [navigate]);

  const userData = localStorage.getItem("user") ? JSON.parse(localStorage.getItem("user") as string) : null;

  const statCards = [
    {
      title: "Activation Code",
      value: userData?.activationCode || "AXC134",
      subtitle: "Overview of Last month",
      progress: 60,
      progressColor: "hsl(254 73% 58%)",
    },
    {
      title: "Total Records", 
      value: "20,000+",
      subtitle: "Overview of Last month",
      progress: 500,
      progressColor: "hsl(168 76% 42%)",
    },
    {
      title: "Constituency Name",
      value: "Constituency Name",
      subtitle: "",
      progress: 0,
      progressColor: "hsl(197 71% 73%)",
    },
  ];

  const navigationItems = [
    {
      title: "List",
      description: "Manage voter lists and records",
      icon: List,
      path: "/list",
      cardClass: "dashboard-card-orange",
      iconBg: "bg-orange-500/80",
      iconColor: "text-white",
      textColor: "text-white",
    },
    {
      title: "Settings",
      description: "System configuration and preferences", 
      icon: Settings,
      path: "/settings",
      cardClass: "dashboard-card-teal",
      iconBg: "bg-teal-600/80",
      iconColor: "text-white",
      textColor: "text-white",
    },
    {
      title: "Recent Logins",
      description: "View login history and activity",
      icon: Clock,
      path: "/recent-logins",
      cardClass: "dashboard-card-mint",
      iconBg: "bg-teal-700/80",
      iconColor: "text-white",
      textColor: "text-teal-900",
    },
    {
      title: "Voter Reports",
      description: "Generate and view voter reports",
      icon: BarChart3,
      path: "/voter-report",
      cardClass: "dashboard-card-purple",
      iconBg: "bg-purple-600/80",
      iconColor: "text-white",
      textColor: "text-white",
    },
  ];

  const uploadItem = {
    title: "Upload to Excel",
    description: "Drag & Drop or Click to Upload",
    icon: UploadCloud,
    path: "#",
    action: "upload",
    bgColor: "bg-blue-50 hover:bg-blue-100",
    iconColor: "text-blue-600",
    textColor: "text-slate-800",
  };

  const handleTileClick = (path: string, action?: string) => {
    if (action === "upload") {
      handleUploadClick();
    } else {
      navigate(path);
    }
  };

  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
  const userData = localStorage.getItem("user");
  const token = userData ? JSON.parse(userData).token : null;
  // const token = "eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJ0ZXN0Iiwicm9sZXMiOlsiUk9MRV9DQU5ESURBVEVfQURNSU4iXSwiaWF0IjoxNzU4NzA5NzQ2LCJleHAiOjE3NTg3MTMzNDZ9.Pf2aJXR0LcaUSnjKmY8RxevO7d8UFA8hBuIt6-meu-o";
  const file = e.target.files?.[0];
  if (!file) return;
  setUploading(true);

  try {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("partyName", "BJP");
    formData.append("candidateName", "Faizan");
    formData.append("areaName", "Area 51");
    formData.append("stateName", "Delhi");

    // Replace with your actual API endpoint
    const response = await fetch(
      "https://pollingservice-addeehfvcxafffb5.centralindia-01.azurewebsites.net/api/excel/upload",
      {
        method: "POST",
        body: formData,
        headers: token
          ? {
              Authorization: `Bearer ${token}`,
            }
          : undefined,
      }
    );
          if (!response.ok) {
      throw new Error("File upload failed");
    }

    toast({
      title: "Upload Successful",
      description: "Your data file has been uploaded.",
    });
  } catch (error: any) {
    toast({
      title: "Upload Failed",
      description: error.message || "An error occurred during upload.",
      variant: "destructive",
    });
  } finally {
    setUploading(false);
    if (fileInputRef.current) fileInputRef.current.value = "";
  }
};

  if (!user) {
    return null; // Loading state
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <SimpleHeader user={user} />

      <main className="container mx-auto px-8 py-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {statCards.map((stat) => (
            <StatCard
              key={stat.title}
              title={stat.title}
              value={stat.value}
              subtitle={stat.subtitle}
              progress={stat.progress}
              progressColor={stat.progressColor}
              className="border border-purple-200"
            />
          ))}
        </div>

        {/* Action Grids */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Navigation Grid - 2x2 */}
          <div className="lg:col-span-2">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {navigationItems.map((item) => (
                <div
                  key={item.title}
                  className={`${item.cardClass} rounded-2xl p-8 cursor-pointer transition-all duration-200 hover:scale-105 shadow-lg`}
                  onClick={() => handleTileClick(item.path)}
                >
                  <div className="flex flex-col items-center text-center space-y-4 relative z-10">
                    <div className={`p-4 rounded-full ${item.iconBg} backdrop-blur-sm border border-white/20`}>
                      <item.icon className={`h-12 w-12 ${item.iconColor}`} />
                    </div>
                    <div>
                      <h3 className={`text-2xl font-bold ${item.textColor} mb-2 drop-shadow-sm`}>
                        {item.title}
                      </h3>
                      <p className={`${item.textColor} opacity-90 drop-shadow-sm`}>
                        {item.description}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Upload Grid */}
          <div className="lg:col-span-1">
            <div
              className={`${uploadItem.bgColor} rounded-2xl p-8 cursor-pointer transition-all duration-200 hover:scale-105 shadow-lg h-full`}
              onClick={() => handleTileClick(uploadItem.path, uploadItem.action)}
            >
              <div className="flex flex-col items-center text-center space-y-4 h-full justify-center">
                <div className="p-4 rounded-full bg-white/20">
                  <uploadItem.icon className={`h-12 w-12 ${uploadItem.iconColor}`} />
                </div>
                <div>
                  <h3 className={`text-2xl font-bold ${uploadItem.textColor} mb-2`}>
                    {uploadItem.title}
                  </h3>
                  <p className={`${uploadItem.textColor} opacity-80`}>
                    {uploadItem.description}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Hidden file input */}
        <input
          type="file"
          accept=".csv,.xlsx,.xls"
          ref={fileInputRef}
          style={{ display: "none" }}
          onChange={handleFileChange}
        />
      </main>
    </div>
  );
};

export default Dashboard;