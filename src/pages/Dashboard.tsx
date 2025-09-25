import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  List,
  Settings,
  Clock,
  FileText,
  Key,
  Users,
  UploadCloud,
} from "lucide-react";
import EnhancedHeader from "@/components/layout/EnhancedHeader";
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

  const dashboardItems = [
    {
      title: "List",
      description: "Manage voter lists and records",
      icon: List,
      path: "/list",
    },
    {
      title: "Settings",
      description: "System configuration and preferences",
      icon: Settings,
      path: "/settings",
    },
    {
      title: "Recent Logins",
      description: "View login history and activity",
      icon: Clock,
      path: "/recent-logins",
    },
    {
      title: "Voter Report",
      description: "Generate and view voter reports",
      icon: FileText,
      path: "/voter-report",
    },
    // {
    //   title: "Activation Code",
    //   description: "Manage system activation codes",
    //   icon: Key,
    //   path: "/activation-code",
    // },
    // {
    //   title: "Booth Committee",
    //   description: "Manage booth committee members",
    //   icon: Users,
    //   path: "/booth-committee",
    // },
  ];

  const handleTileClick = (path: string) => {
    navigate(path);
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
    <div className="min-h-screen bg-background">
      <EnhancedHeader user={user} />

      <main className="container mx-auto px-6 py-8">
        <div className="mb-6 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h2 className="text-2xl font-bold text-civic-primary mb-2">
              Dashboard
            </h2>
            <p className="text-muted-foreground">
              Welcome back, {user.name}. Here's your election management overview.
            </p>
          </div>
          <div>
            <input
              type="file"
              accept=".csv,.xlsx,.xls"
              ref={fileInputRef}
              style={{ display: "none" }}
              onChange={handleFileChange}
            />
            <Button
              type="button"
              variant="outline"
              onClick={handleUploadClick}
              disabled={uploading}
              className="flex items-center gap-2"
            >
              <UploadCloud className="h-5 w-5" />
              {uploading ? "Uploading..." : "Upload Data File"}
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-2 gap-10">
          {dashboardItems.map((item) => (
            <DashboardTile
              key={item.title}
              title={item.title}
              description={item.description}
              icon={item.icon}
              onClick={() => handleTileClick(item.path)}
              className="bg-gradient-to-br from-civic-primary/90 to-civic-primary/60 rounded-2xl shadow-lg min-h-[180px] flex items-center transition-transform hover:scale-105 cursor-pointer"
              titleClassName="text-white text-xl font-semibold"
              descriptionClassName="text-white/90"
              iconClassName="text-white opacity-90"
            />
          ))}
        </div>
      </main>
    </div>
  );
};

export default Dashboard;