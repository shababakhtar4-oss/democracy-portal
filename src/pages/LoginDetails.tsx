import { useEffect, useState } from "react";
import { useParams, useNavigate,useLocation } from "react-router-dom";
import { Shield, Clock, MapPin, Smartphone, Activity } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import DetailPageLayout from "@/components/layout/DetailPageLayout";
import { apiRequest } from "@/lib/utils";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"

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
       <div className="overflow-x-auto">
      <div className="inline-block min-w-full align-middle">
        <div className="rounded-xl border bg-white shadow-md">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>
                  <div className="flex items-center gap-2">
                    <Activity className="h-4 w-4 text-civic-primary" />
                    Username
                  </div>
                </TableHead>
                <TableHead>
                  <div className="flex items-center gap-2">
                    <MapPin className="h-4 w-4 text-civic-secondary" />
                    Voter ID
                  </div>
                </TableHead>
                <TableHead>
                  <div className="flex items-center gap-2">
                    <Smartphone className="h-4 w-4 text-civic-secondary" />
                    Device
                  </div>
                </TableHead>
                <TableHead>
                  <div className="flex items-center gap-2">
                    <Clock className="h-4 w-4 text-civic-secondary" />
                    Login Time
                  </div>
                </TableHead>
                <TableHead>
                  <div className="flex items-center gap-2">
                    <Shield className="h-4 w-4 text-civic-secondary" />
                    Status
                  </div>
                </TableHead>
              </TableRow>
            </TableHeader>

        <TableBody>
          {loginDetails?.print?.map((detail, index) => (
            <TableRow key={index} className="hover:bg-gray-50 transition">
              <TableCell className="font-medium">{detail.votername || "Unknown"}</TableCell>
              <TableCell>{detail.voteridnumber || "N/A"}</TableCell>
              <TableCell>{detail.device || "Mobile App"}</TableCell>
              <TableCell>
                {detail.timestamp
                  ? new Date(detail.timestamp).toLocaleString()
                  : "Recent"}
              </TableCell>
              <TableCell>
                <span
                  className={`text-xs px-2 py-1 rounded-full ${
                    detail.status === "Success"
                      ? "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200"
                      :"bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
                  }`}
                >
                  {detail.status || "Success"}
                </span>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
    </div>
    </div>
      )}
    </DetailPageLayout>
  );
};

export default LoginDetails;