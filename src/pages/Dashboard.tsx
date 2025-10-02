import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  List,
  Settings,
  Clock,
  UploadCloud,
  BarChart3,
  MessageCircle, Send, X, bot, Printer
} from "lucide-react";
import SimpleHeader from "@/components/layout/SimpleHeader";
import StatCard from "@/components/dashboard/StatCard";
import { toast } from "@/components/ui/use-toast";
import { Card, CardHeader, CardContent, CardFooter } from "@/components/ui/card"

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
    const [isChatOpen, setIsChatOpen] = useState(false)
    const [messages, setMessages] = useState([]);
  // const [messages, setMessages] = useState([
  //   { sender: "bot", text: "👋 Hi! How can I help you today?" },
  // ])

  const [botData, setBotData] = useState<any[]>([]);
  const [input, setInput] = useState("")
   const userData = localStorage.getItem("user") ? JSON.parse(localStorage.getItem("user") as string) : null;

  const handleSend = async () => {
    if (!input.trim()) return
    // Call chatbot service API (replace with your backend endpoint)
    try {
      const res = await fetch(`https://ai-voter-chat-d2gxaheja5fkhbbr.centralindia-01.azurewebsites.net/chat/query?activationCode=${userData?.activationCode}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: input }),
      })
            const data = await res.json()
            const list = data?.results || data || [];
      setBotData(data);
      setMessages((prev) => [
        ...prev,
        { sender: "user", text: input },
        { sender: "bot", list }
      ]);

    } catch (err) {
      console.error("API error:", error);
    }

    setInput("")
  }

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (!storedUser) {
      navigate("/");
      return;
    }
    setUser(JSON.parse(storedUser));
  }, [navigate]);


  const handlePrint = (item) => {
    const printContent = `
     <html>
        <head>
          <title>Voter Details</title>
          <style>
            body { font-family: Arial, sans-serif; padding: 20px; }
            .card { border: 1px solid #ddd; border-radius: 10px; padding: 20px; max-width: 400px; margin: auto; box-shadow: 0 5px 15px rgba(0,0,0,0.1); }
            .card h3 { margin-top: 0; color: #2c3e50; }
            .card p { margin: 6px 0; font-size: 14px; }
            .card b { color: #34495e; }
          </style>
        </head>
        <body>
          <div class="card">
            <h3>Voter Details</h3>
            <p><b>Name:</b> ${item.name}</p>
            <p><b>Father/Husband:</b> ${item.rlnName} (${item.rlnType})</p>
            <p><b>House No:</b> ${item.houseNo}</p>
            <p><b>AC No:</b> ${item.acNo}, <b>Part No:</b> ${item.partNo}, <b>Section No:</b> ${item.sectionNo}</p>
            <p><b>Sl No:</b> ${item.slNoInPart}</p>
            <p><b>EPIC No:</b> ${item.epicNo}</p>
            <p><b>Gender:</b> ${item.gender}</p>
            <p><b>Age:</b> ${item.age}</p>
            <p><b>DOB:</b> ${item.dob || "-"}</p>
            <p><b>Mobile No:</b> ${item.mobileNo || "-"}</p>
          </div>
        </body>
      </html>
    `;

    const newWindow = window.open('', '_blank');
    newWindow.document.write(printContent);
    newWindow.document.close();
    newWindow.print();
  };

 

  const statCards = [
    {
      title: "Activation Code",
      value: userData?.activationCode || "AXC134",
      subtitle: "Share this code to users",
      progress: 100,
      progressColor: "hsl(254 73% 58%)",
    },
    {
      title: "State Name", 
      value: userData?.stateName || "Delhi",
      subtitle: "State of the assembly",
      progress: 500,
      progressColor: "hsl(168 76% 42%)",
    },
    {
      title: "Constituency Name",
      value: userData?.areaName || "New Delhi",
      subtitle: "Constituency declared as per ECI data",
      progress: 1000,
      progressColor: "hsl(197 71% 73%)",
    },
    {
      title: "Party Name",
      value: userData?.partyName || "BJP",
      subtitle: "Party name declared as per ECI data",
      progress: 200,
      progressColor: "hsla(199, 19%, 19%, 1.00)",
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
      title: "Users Report",
      description: "Generate and view user reports",
      icon: BarChart3,
      path: "/voter-report",
      cardClass: "dashboard-card-purple",
      iconBg: "bg-purple-600/80",
      iconColor: "text-white",
      textColor: "text-white",
    },
    {
      title: "campaign",
      description: "Create and manage campaigns messages",
      icon: BarChart3,
      path: "/campaign",
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
    cardClass: "dashboard-card-blue",
    iconBg: "bg-blue-600/80",
    iconColor: "text-white",
    textColor: "text-white",
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
  const activationCode = userData ? JSON.parse(userData).activationCode : "";
  const token = userData ? JSON.parse(userData).token : null;
  const areaName = userData ? JSON.parse(userData).areaName : "Area 51";
  const stateName = userData ? JSON.parse(userData).stateName : "Delhi";
  const partyName = userData ? JSON.parse(userData).partyName : "BJP";
  const candidateName = userData ? JSON.parse(userData).username : "Faizan";
  // const token = "eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJ0ZXN0Iiwicm9sZXMiOlsiUk9MRV9DQU5ESURBVEVfQURNSU4iXSwiaWF0IjoxNzU4NzA5NzQ2LCJleHAiOjE3NTg3MTMzNDZ9.Pf2aJXR0LcaUSnjKmY8RxevO7d8UFA8hBuIt6-meu-o";
  const file = e.target.files?.[0];
  if (!file) return;
  setUploading(true);

  try {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("partyName", partyName);
    formData.append("candidateName", candidateName);
    formData.append("areaName", areaName);
    formData.append("stateName", stateName);
    formData.append("activationCode", activationCode);

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

  const handleToggle = () => setIsChatOpen(!isChatOpen);

  return (
    <div className="min-h-screen bg-gray-50">
      <SimpleHeader user={user} />

      <main className="container mx-auto px-8 py-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
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
          {/* Navigation Grid */}
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
              className={`${uploadItem.cardClass} rounded-2xl p-8 cursor-pointer transition-all duration-200 hover:scale-105 shadow-lg h-full`}
              onClick={() => handleTileClick(uploadItem.path, uploadItem.action)}
            >
              <div className="flex flex-col items-center text-center space-y-4 h-full justify-center relative z-10">
                <div className={`p-4 rounded-full ${uploadItem.iconBg} backdrop-blur-sm border border-white/20`}>
                  <uploadItem.icon className={`h-12 w-12 ${uploadItem.iconColor}`} />
                </div>
                <div>
                  <h3 className={`text-2xl font-bold ${uploadItem.textColor} mb-2 drop-shadow-sm`}>
                    {uploadItem.title}
                  </h3>
                  <p className={`${uploadItem.textColor} opacity-90 drop-shadow-sm`}>
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

      {/* Floating Chat Button */}
      {!isChatOpen && (
          <button
            onClick={handleToggle}
            className="fixed bottom-6 right-6 flex items-center gap-2 px-5 py-3 rounded-full bg-purple-600 text-white shadow-lg hover:bg-purple-700 transition z-50"
          >
            <MessageCircle className="h-6 w-6" />
            <span className="font-medium">Chat with AI</span>
          </button>
      )}

      {/* Chat Popup */}
      {isChatOpen && (
        <div className="fixed bottom-16 right-5 w-96 h-[500px] bg-white shadow-xl border rounded-lg flex flex-col z-50">
                 <div className="flex justify-between items-center p-2 font-bold bg-purple-700 text-white rounded-t-lg">
            <span>ChatBot</span>
            <button onClick={handleToggle} className="p-1 hover:bg-blue-700 rounded">
              <X size={18} />
            </button>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-2 space-y-3">
            {messages.map((msg, i) => (
              <div key={i}>
                {msg.sender === "user" && (
                  <div className="bg-blue-100 p-2 rounded-lg text-right">
                    {msg.text}
                  </div>
                )}

                {msg.sender === "bot" && (
                  <div className="space-y-2">
                    {msg.list && msg.list.length > 0 ? (
                      msg.list.map((item, idx) => (
                        <div
                          key={idx}
                          className="border rounded-lg shadow-sm p-3 space-y-1 bg-gray-50"
                        >
                          <p><b>{item.name}</b> ({item.gender}, {item.age})</p>
                          <p>EPIC: {item.epicNo}</p>
                          <p>Father/Husband: {item.rlnName}</p>
                          <p>House No: {item.houseNo}</p>

                          <button
                            onClick={() => handlePrint(item)}
                            className="mt-2 bg-green-600 text-white px-3 py-1 rounded text-sm"
                          >
                            Print
                          </button>
                        </div>
                      ))
                    ) : (
                      <div className="bg-gray-100 p-2 rounded">
                        No results found
                      </div>
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Input */}
          <div className="p-3 border-t flex items-center gap-2">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Type a message..."
              className="flex-1 p-2 border rounded-lg focus:outline-none focus:ring focus:ring-purple-400"
              onKeyDown={(e) => e.key === "Enter" && handleSend()}
            />
            <button
              onClick={handleSend}
              className="p-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700"
            >
              <Send className="h-5 w-5" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;