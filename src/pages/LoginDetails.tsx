import { useEffect, useState } from "react";
import { useParams, useNavigate,useLocation } from "react-router-dom";
import { Shield, Clock, MapPin, Smartphone, Activity } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import DetailPageLayout from "@/components/layout/DetailPageLayout";
import { apiRequest } from "@/lib/utils";

interface LoginDetail {
  id: string;
  username: string;
  ipAddress: string;
  device: string;
  location: string;
  timestamp: string;
  status: string;
  userAgent: string;
}

const LoginDetails = () => {
  const location = useLocation();
  const lastSegment = location?.pathname?.split('/').pop();
  const navigate = useNavigate();
  const [loginDetails, setLoginDetails] = useState<LoginDetail[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLoginDetails = async () => {
      try {
        const storedUser = localStorage.getItem("user");
        if (!storedUser) {
          navigate("/");
          return;
        }

        const user = JSON.parse(storedUser);
        const response = await apiRequest<LoginDetail[]>(
          `https://pollingservice-addeehfvcxafffb5.centralindia-01.azurewebsites.net/report/total-prints?activationCode=${user.activationCode}&user=${lastSegment}`,
          {
            method: "GET",
            headers: {
              Authorization: `Bearer ${user.token}`,
              "Content-Type": "application/json"
            }
          }
        );
        
        setLoginDetails(response || []);
      } catch (error) {
        console.error("Failed to fetch login details:", error);
        setLoginDetails([]);
      } finally {
        setLoading(false);
      }
    };

    fetchLoginDetails();
  }, [lastSegment, navigate]);

  if (loading) {
    return (
      <DetailPageLayout title="Login History">
        <div className="flex items-center justify-center h-64">
          <div className="text-muted-foreground">Loading login details...</div>
        </div>
      </DetailPageLayout>
    );
  }

  return (
    <DetailPageLayout title="Login History">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-civic-primary mb-2">Login History Details</h2>
        <p className="text-muted-foreground">
          Detailed view of recent login activities and security information.
        </p>
      </div>

      {loginDetails?.print?.length === 0 ? (
        <Card>
          <CardContent className="p-8 text-center">
            <Shield className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <p className="text-muted-foreground">No recent login records found.</p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {loginDetails?.print?.map((detail, index) => (
            <Card key={index} className="border-civic-primary/30 hover:shadow-lg transition-shadow">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg">
                  <Activity className="h-5 w-5 text-civic-primary" />
                  User Session
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center gap-2">
                  <Smartphone className="h-4 w-4 text-civic-secondary" />
                  <div>
                    <p className="text-sm font-medium">Username</p>
                    <p className="text-xs text-muted-foreground">{detail.votername || "Unknown"}</p>
                  </div>
                </div>
                
                <div className="flex items-center gap-2">
                  <MapPin className="h-4 w-4 text-civic-secondary" />
                  <div>
                    <p className="text-sm font-medium">Voter ID</p>
                    <p className="text-xs text-muted-foreground">{detail.voteridnumber || "127.0.0.1"}</p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <Smartphone className="h-4 w-4 text-civic-secondary" />
                  <div>
                    <p className="text-sm font-medium">Device</p>
                    <p className="text-xs text-muted-foreground">{detail.device || "Mobile App"}</p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4 text-civic-secondary" />
                  <div>
                    <p className="text-sm font-medium">Login Time</p>
                    <p className="text-xs text-muted-foreground">
                      {detail.timestamp ? new Date(detail.timestamp).toLocaleString() : "Recent"}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <Shield className="h-4 w-4 text-civic-secondary" />
                  <div>
                    <p className="text-sm font-medium">Status</p>
                    <span className={`text-xs px-2 py-1 rounded-full ${
                      detail.status === "Success" 
                        ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200" 
                        : "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200"
                    }`}>
                      {detail.status || "Success"}
                    </span>
                  </div>
                </div>

                {detail.location && (
                  <div className="flex items-center gap-2">
                    <MapPin className="h-4 w-4 text-civic-secondary" />
                    <div>
                      <p className="text-sm font-medium">Location</p>
                      <p className="text-xs text-muted-foreground">{detail.location}</p>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </DetailPageLayout>
  );
};

export default LoginDetails;