import { Clock, Smartphone } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import DetailPageLayout from "@/components/layout/DetailPageLayout";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAppSelector } from "@/hooks/redux";
import { useSearchUsersQuery } from "@/store/api/apiSlice";

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
  const navigate = useNavigate();
  const { user } = useAppSelector((state) => state.auth);
  
  const { data: recentLogins, isLoading } = useSearchUsersQuery(
    user?.activationCode || '',
    { skip: !user?.activationCode }
  );

  useEffect(() => {
    if (!user) {
      navigate("/");
    }
  }, [user, navigate]);

  if (!user) {
    return null;
  }

  const handleCardClick = (userId: string) => {
    navigate(`/recent-login/${userId}`);
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
            {recentLogins?.users?.map((login) => (
              <div
                key={login.userId}
                className="cursor-pointer outline-none focus:ring-2 focus:ring-civic-primary rounded transition-shadow hover:shadow-lg"
                tabIndex={0}
                role="button"
                onClick={() => handleCardClick(login.userId)}
                onKeyDown={e => {
                  if (e.key === "Enter" || e.key === " ") handleCardClick(login.userId);
                }}
              >
                <Card className="h-full border-civic-primary/30">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-base">
                      <Smartphone className="h-4 w-4 text-civic-primary" />
                      {login.username}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-xs text-muted-foreground mb-1">{`UserName : ${login.username}`}</div>
                    <div className="text-xs text-muted-foreground">{`Mobile: ${login.mobileNumber}`}</div>
                    <div className="text-xs text-muted-foreground">{`User Id: ${login.userId}`}</div>
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