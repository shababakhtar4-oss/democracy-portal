import { Clock, Smartphone, Monitor, CheckCircle, XCircle, AlertCircle } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import DetailPageLayout from "@/components/layout/DetailPageLayout";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { apiRequest } from "@/lib/utils";

interface User {
  name: string;
  email: string;
  avatar?: string | null;
  token: string;
  activationCode: string;
  username: string;
}

interface LoginRecord {
  id: number;
  username: string;
  ipAddress: string;
  deviceInfo: string;
  loginTime: string;
  status: "Success" | "Failed";
}

const RecentLogins = () => {
  const [user, setUser] = useState<User | null>(null);
  const [loginRecords, setLoginRecords] = useState<LoginRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (!storedUser) {
      navigate("/");
      return;
    }
    
    const userData = JSON.parse(storedUser);
    setUser(userData);

    // Fetch recent logins from API
    const fetchRecentLogins = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const response = await apiRequest<LoginRecord[]>(
          `https://pollingservice-addeehfvcxafffb5.centralindia-01.azurewebsites.net/api/recent-logins?activationCode=${userData.activationCode}&username=${userData.username}`,
          {
            method: "GET",
            headers: {
              Authorization: `Bearer ${userData.token}`,
              "Content-Type": "application/json"
            },
          }
        );
        
        setLoginRecords(response || []);
      } catch (error: any) {
        console.error("Failed to fetch recent logins:", error);
        
        // Handle authentication errors
        if (error.message?.includes("401") || error.message?.includes("Unauthorized")) {
          localStorage.removeItem("user");
          navigate("/");
          return;
        }
        
        setError("Failed to load recent logins. Please try again.");
        setLoginRecords([]);
      } finally {
        setLoading(false);
      }
    };

    fetchRecentLogins();
  }, [navigate]);

  if (!user) {
    return null;
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "Success":
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case "Failed":
        return <XCircle className="h-4 w-4 text-red-500" />;
      default:
        return <AlertCircle className="h-4 w-4 text-yellow-500" />;
    }
  };

  const formatDateTime = (dateString: string) => {
    try {
      const date = new Date(dateString);
      return date.toLocaleString();
    } catch {
      return dateString;
    }
  };

  return (
    <DetailPageLayout title="Recent Logins">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-civic-primary mb-2">Recent Logins</h2>
        <p className="text-muted-foreground">
          View your recent login history and device information.
        </p>
      </div>

      {error && (
        <Alert variant="destructive" className="mb-6">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Clock className="h-5 w-5" />
            Login History
          </CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex justify-center items-center py-8">
              <div className="text-muted-foreground">Loading login records...</div>
            </div>
          ) : loginRecords.length === 0 ? (
            <div className="text-center py-8">
              <Clock className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground">No recent logins found.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {loginRecords.map((record) => (
                <Card key={record.id} className="h-full border-civic-primary/30 hover:shadow-lg transition-shadow">
                  <CardHeader className="pb-3">
                    <CardTitle className="flex items-center gap-2 text-base">
                      <Monitor className="h-4 w-4 text-civic-primary" />
                      {record.username}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-muted-foreground">Status:</span>
                      <div className="flex items-center gap-1">
                        {getStatusIcon(record.status)}
                        <span className={`text-xs ${
                          record.status === "Success" ? "text-green-600" : "text-red-600"
                        }`}>
                          {record.status}
                        </span>
                      </div>
                    </div>
                    <div>
                      <span className="text-xs text-muted-foreground">IP Address:</span>
                      <p className="text-sm font-mono">{record.ipAddress}</p>
                    </div>
                    <div>
                      <span className="text-xs text-muted-foreground">Device:</span>
                      <p className="text-sm">{record.deviceInfo}</p>
                    </div>
                    <div>
                      <span className="text-xs text-muted-foreground">Login Time:</span>
                      <p className="text-sm">{formatDateTime(record.loginTime)}</p>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </DetailPageLayout>
  );
};

export default RecentLogins;