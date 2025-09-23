import DetailPageLayout from "@/components/layout/DetailPageLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { MapPin, Users, Clock } from "lucide-react";

const BoothLocations = () => {
  const boothLocations = [
    {
      id: "BL001",
      name: "Central Government School",
      address: "123 Main Street, District Center",
      capacity: 1200,
      status: "Active",
      lastUpdated: "2024-03-15"
    },
    {
      id: "BL002", 
      name: "Community Hall A",
      address: "456 Park Avenue, Sector 7",
      capacity: 800,
      status: "Active",
      lastUpdated: "2024-03-14"
    },
    {
      id: "BL003",
      name: "Municipal Building",
      address: "789 Civic Center Road",
      capacity: 1500,
      status: "Pending Setup",
      lastUpdated: "2024-03-13"
    }
  ];

  return (
    <DetailPageLayout title="Booth Locations">
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card className="shadow-card">
            <CardContent className="p-6 text-center">
              <MapPin className="h-8 w-8 text-civic-primary mx-auto mb-2" />
              <div className="text-2xl font-bold text-civic-primary">{boothLocations.length}</div>
              <div className="text-sm text-muted-foreground">Total Locations</div>
            </CardContent>
          </Card>
          
          <Card className="shadow-card">
            <CardContent className="p-6 text-center">
              <Users className="h-8 w-8 text-civic-secondary mx-auto mb-2" />
              <div className="text-2xl font-bold text-civic-secondary">
                {boothLocations.reduce((sum, location) => sum + location.capacity, 0)}
              </div>
              <div className="text-sm text-muted-foreground">Total Capacity</div>
            </CardContent>
          </Card>
          
          <Card className="shadow-card">
            <CardContent className="p-6 text-center">
              <Clock className="h-8 w-8 text-civic-accent mx-auto mb-2" />
              <div className="text-2xl font-bold text-civic-accent">
                {boothLocations.filter(l => l.status === "Active").length}
              </div>
              <div className="text-sm text-muted-foreground">Active Booths</div>
            </CardContent>
          </Card>
        </div>

        <Card className="shadow-card">
          <CardHeader>
            <CardTitle className="text-civic-primary">Polling Booth Locations</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {boothLocations.map((location) => (
                <div key={location.id} className="border rounded-lg p-4 hover:shadow-card-hover transition-shadow">
                  <div className="flex justify-between items-start mb-3">
                    <div>
                      <h3 className="font-semibold text-civic-primary">{location.name}</h3>
                      <p className="text-sm text-muted-foreground">{location.address}</p>
                    </div>
                    <Badge variant={location.status === "Active" ? "default" : "secondary"}>
                      {location.status}
                    </Badge>
                  </div>
                  
                  <div className="flex items-center justify-between text-sm">
                    <div className="flex items-center space-x-4">
                      <span className="flex items-center text-muted-foreground">
                        <Users className="h-4 w-4 mr-1" />
                        Capacity: {location.capacity}
                      </span>
                      <span className="text-muted-foreground">ID: {location.id}</span>
                    </div>
                    <span className="text-muted-foreground">
                      Updated: {location.lastUpdated}
                    </span>
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

export default BoothLocations;