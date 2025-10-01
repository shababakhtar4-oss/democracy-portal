import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import DetailPageLayout from "@/components/layout/DetailPageLayout";
import { Button }from "@/components/ui/button";
import { apiRequest } from "@/lib/utils";
import { Users, User, Printer, TrendingUp, Calendar, FileText } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"

interface ReportUser {
  totalPrints: number;
  mobileNumber: string;
  user: string;
}

interface ReportResponse {
  activationCode: string;
  users: ReportUser[];
}

const VoterReport = () => {
  const [report, setReport] = useState<ReportResponse | null>(null);
  const [loading, setLoading] = useState(true);

  const stats = {
    totalVoters: 156420,
    newRegistrations: 2340,
    activeBooths: 45,
    reportsGenerated: 28
  };

  useEffect(() => {
    const fetchReport = async () => {
      try {
        const storedUser = localStorage.getItem("user");
        if (!storedUser) return;
        const user = JSON.parse(storedUser);
        const response = await apiRequest<ReportResponse>(
          `https://pollingservice-addeehfvcxafffb5.centralindia-01.azurewebsites.net/report/user-prints?activationCode=${user.activationCode}`,
          {
            method: "GET",
            headers: {
              Authorization: `Bearer ${user.token}`,
              "Content-Type": "application/json",
            },
          }
        );
        setReport(response);
      } catch (error) {
        setReport(null);
      } finally {
        setLoading(false);
      }
    };
    fetchReport();
  }, []);

const getTotalPrints = () => {
  return report?.users?.reduce((sum, user) => sum + user.totalPrints, 0);
};



  return (
    <DetailPageLayout title="Voter Report">
      <div className="space-y-6">
        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card className="shadow-card">
            <CardContent className="p-6 text-center">
              <Users className="h-8 w-8 text-civic-primary mx-auto mb-2" />
              <div className="text-2xl font-bold text-civic-primary">{stats.totalVoters.toLocaleString()}</div>
              <div className="text-sm text-muted-foreground">Total Voters</div>
            </CardContent>
          </Card>
          
          <Card className="shadow-card">
            <CardContent className="p-6 text-center">
              <TrendingUp className="h-8 w-8 text-civic-secondary mx-auto mb-2" />
              <div className="text-2xl font-bold text-civic-secondary">{getTotalPrints()}</div>
              <div className="text-sm text-muted-foreground">Total Prints</div>
            </CardContent>
          </Card>
          
          <Card className="shadow-card">
            <CardContent className="p-6 text-center">
              <User className="h-8 w-8 text-civic-accent mx-auto mb-2" />
              <div className="text-2xl font-bold text-civic-accent">{report?.users?.length}</div>
              <div className="text-sm text-muted-foreground">Active Users</div>
            </CardContent>
          </Card>
          
          <Card className="shadow-card">
            <CardContent className="p-6 text-center">
              <FileText className="h-8 w-8 text-civic-primary mx-auto mb-2" />
              <div className="text-2xl font-bold text-civic-primary">{report?.activationCode}</div>
              <div className="text-sm text-muted-foreground">Activation Code</div>
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions */}
        {/* <Card className="shadow-card">
          <CardHeader>
            <CardTitle className="text-civic-primary">Quick Actions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-3">
              <Button className="bg-gradient-primary hover:opacity-90">
                Generate New Report
              </Button>
              <Button variant="outline" className="border-civic-primary text-civic-primary hover:bg-civic-primary/10">
                Export All Data
              </Button>
              <Button variant="outline" className="border-civic-secondary text-civic-secondary hover:bg-civic-secondary/10">
                Schedule Report
              </Button>
            </div>
          </CardContent>
        </Card> */}

        {/* Recent Reports */}
         <div className="mb-6">
            <h2 className="text-2xl font-bold text-civic-primary mb-2">Recent Report</h2>
            <p className="text-muted-foreground">
             Overview of user print activity for your activation code.
            </p>
          </div>
      {loading ? (
        <div className="flex items-center justify-center h-64">
          <div className="text-muted-foreground">Loading report...</div>
        </div>
      ) : (
         <div className="rounded-lg border shadow-sm">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[200px]">User</TableHead>
            <TableHead>Mobile Number</TableHead>
            <TableHead className="text-right">Total Prints</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {report?.users?.map((u, idx) => (
            <TableRow key={idx} className="hover:bg-gray-50 transition">
              <TableCell className="font-medium flex items-center gap-2">
                <User className="h-5 w-5 text-civic-primary" />
                {u.user}
              </TableCell>
              <TableCell>{u.mobileNumber}</TableCell>
              <TableCell className="text-right font-semibold text-civic-primary flex justify-end items-center gap-2">
                <Printer className="h-4 w-4 text-civic-secondary" />
                {u.totalPrints}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
          )}
        </div>
    </DetailPageLayout>
  );
};

export default VoterReport;