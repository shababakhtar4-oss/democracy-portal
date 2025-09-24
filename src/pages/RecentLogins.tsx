import { Clock, Smartphone } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import EnhancedHeader from "@/components/layout/EnhancedHeader";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

interface User {
  name: string;
  email: string;
  avatar?: string | null;
}

interface RecentLogin {
  id: number;
  device: string;
  timestamp: string;
  ipAddress: string;
  location: string;
}

// Mock recent logins data
const recentLogins: RecentLogin[] = [
  { id: 1, device: 'Samsung Galaxy S22 - Chrome Mobile', timestamp: '2 hours ago', ipAddress: '192.168.1.15', location: 'Mumbai, India' },
  { id: 2, device: 'Windows PC - Chrome Desktop', timestamp: '1 day ago', ipAddress: '192.168.1.25', location: 'Mumbai, India' },
  { id: 3, device: 'iPad Pro - Safari', timestamp: '3 days ago', ipAddress: '192.168.1.35', location: 'Mumbai, India' },
];

const RecentLogins = () => {
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

  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-background">
      <EnhancedHeader user={user} />
      
      <main className="container mx-auto px-6 py-8">
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-civic-primary mb-2">Recent Logins</h2>
          <p className="text-muted-foreground">
            View your recent login history and device information.
          </p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="h-5 w-5" />
              Login History
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {recentLogins.map((login, index) => (
                <div key={login.id}>
                  <div className="flex items-start gap-3">
                    <div className="text-civic-primary mt-1">
                      <Smartphone className="h-4 w-4" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between">
                        <div>
                          <p className="font-medium text-sm">{login.device}</p>
                          <p className="text-xs text-muted-foreground">{login.timestamp}</p>
                        </div>
                        <div className="text-right">
                          <p className="text-xs text-muted-foreground">{login.ipAddress}</p>
                          <p className="text-xs text-muted-foreground">{login.location}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                  {index < recentLogins.length - 1 && (
                    <div className="border-b border-civic-border/30 mt-3"></div>
                  )}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  );
};

export default RecentLogins;