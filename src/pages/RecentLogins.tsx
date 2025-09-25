import { Clock, Smartphone } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import DetailPageLayout from "@/components/layout/DetailPageLayout";
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

  const handleCardClick = (id: number) => {
    navigate(`/recent-login/${id}`);
  };

  return (
    <DetailPageLayout title="Recent Logins">
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
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {recentLogins.map((login) => (
              <div
                key={login.id}
                className="cursor-pointer outline-none focus:ring-2 focus:ring-civic-primary rounded transition-shadow hover:shadow-lg"
                tabIndex={0}
                role="button"
                onClick={() => handleCardClick(login.id)}
                onKeyDown={e => {
                  if (e.key === "Enter" || e.key === " ") handleCardClick(login.id);
                }}
              >
                <Card className="h-full border-civic-primary/30">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-base">
                      <Smartphone className="h-4 w-4 text-civic-primary" />
                      {login.device}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-xs text-muted-foreground mb-1">{login.timestamp}</div>
                    <div className="text-xs text-muted-foreground">{login.ipAddress}</div>
                    <div className="text-xs text-muted-foreground">{login.location}</div>
                  </CardContent>
                </Card>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </DetailPageLayout>
  );
};

export default RecentLogins;