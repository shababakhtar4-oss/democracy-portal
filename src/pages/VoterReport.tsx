import DetailPageLayout from "@/components/layout/DetailPageLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { FileText, Download, Users, TrendingUp, Calendar } from "lucide-react";

const VoterReport = () => {
  const reports = [
    {
      id: "VR001",
      title: "Monthly Voter Registration Report",
      type: "Registration",
      date: "2024-03-15",
      status: "Completed",
      records: 15420
    },
    {
      id: "VR002",
      title: "Booth-wise Voter Distribution",
      type: "Distribution",
      date: "2024-03-14",
      status: "In Progress",
      records: 8920
    },
    {
      id: "VR003",
      title: "Age-wise Voter Demographics",
      type: "Demographics",
      date: "2024-03-13",
      status: "Completed",
      records: 12340
    }
  ];

  const stats = {
    totalVoters: 156420,
    newRegistrations: 2340,
    activeBooths: 45,
    reportsGenerated: 28
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
              <div className="text-2xl font-bold text-civic-secondary">{stats.newRegistrations.toLocaleString()}</div>
              <div className="text-sm text-muted-foreground">New This Month</div>
            </CardContent>
          </Card>
          
          <Card className="shadow-card">
            <CardContent className="p-6 text-center">
              <Calendar className="h-8 w-8 text-civic-accent mx-auto mb-2" />
              <div className="text-2xl font-bold text-civic-accent">{stats.activeBooths}</div>
              <div className="text-sm text-muted-foreground">Active Booths</div>
            </CardContent>
          </Card>
          
          <Card className="shadow-card">
            <CardContent className="p-6 text-center">
              <FileText className="h-8 w-8 text-civic-primary mx-auto mb-2" />
              <div className="text-2xl font-bold text-civic-primary">{stats.reportsGenerated}</div>
              <div className="text-sm text-muted-foreground">Reports Generated</div>
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions */}
        <Card className="shadow-card">
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
        </Card>

        {/* Recent Reports */}
        <Card className="shadow-card">
          <CardHeader>
            <CardTitle className="text-civic-primary">Recent Reports</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {reports.map((report) => (
                <div key={report.id} className="border rounded-lg p-4 hover:shadow-card-hover transition-shadow">
                  <div className="flex justify-between items-start mb-3">
                    <div className="flex-1">
                      <h3 className="font-semibold text-civic-primary mb-1">{report.title}</h3>
                      <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                        <span>Type: {report.type}</span>
                        <span>Records: {report.records.toLocaleString()}</span>
                        <span>Date: {report.date}</span>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Badge variant={report.status === "Completed" ? "default" : "secondary"}>
                        {report.status}
                      </Badge>
                      {report.status === "Completed" && (
                        <Button size="sm" variant="ghost" className="text-civic-primary hover:bg-civic-primary/10">
                          <Download className="h-4 w-4" />
                        </Button>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </DetailPageLayout>
  );
};

export default VoterReport;