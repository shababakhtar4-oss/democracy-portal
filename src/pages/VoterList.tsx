import React, { useState, useMemo } from 'react';
import { Printer, Search, Filter, Download, Monitor, Tablet } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import DetailPageLayout from "@/components/layout/DetailPageLayout";

interface VoterRecord {
  id: string;
  name: string;
  age: number;
  gender: 'Male' | 'Female';
  voterIdNumber: string;
  boothAddress: string;
  boothNo: number;
  mobile: string;
  houseNo: string;
  city: string;
  relatedTo: string;
  isPrint: boolean;
}


const mockVoterData: VoterRecord[] = [
  {
    id: '1',
    name: 'md kasim',
    age: 68,
    gender: 'Male',
    voterIdNumber: 'NWD5059084',
    boothAddress: 'NATIONAL PUBLIC SCHOOL, KALINDI COLONY, MAHARANI BAGH, NEW DELHI-110065',
    boothNo: 101,
    mobile: '9119694951',
    houseNo: '',
    city: 'DELHI',
    relatedTo: 'md aziz',
    isPrint: true
  },
  {
    id: '2',
    name: 'priya sharma',
    age: 34,
    gender: 'Female',
    voterIdNumber: 'DLH3456789',
    boothAddress: 'GOVERNMENT SENIOR SECONDARY SCHOOL, LAJPAT NAGAR, NEW DELHI-110024',
    boothNo: 102,
    mobile: '9876543210',
    houseNo: 'A-123',
    city: 'DELHI',
    relatedTo: 'raj sharma',
    isPrint: true
  },
  {
    id: '3',
    name: 'amit kumar',
    age: 29,
    gender: 'Male',
    voterIdNumber: 'UP1234567',
    boothAddress: 'PRIMARY SCHOOL, SECTOR 15, NOIDA, UP-201301',
    boothNo: 103,
    mobile: '',
    houseNo: 'B-456',
    city: 'NOIDA',
    relatedTo: 'suresh kumar',
    isPrint: false
  },
  {
    id: '4',
    name: 'sunita devi',
    age: 45,
    gender: 'Female',
    voterIdNumber: 'DLH9876543',
    boothAddress: 'COMMUNITY CENTER, JANAKPURI, NEW DELHI-110058',
    boothNo: 104,
    mobile: '9988776655',
    houseNo: 'C-789',
    city: 'DELHI',
    relatedTo: 'ramesh singh',
    isPrint: true
  }
];

const VoterList = () => {
  const [filters, setFilters] = useState({
    name: '',
    ageMin: '',
    ageMax: '',
    gender: '',
    boothNo: '',
    city: '',
    houseNo: '',
    relatedTo: '',
    mobileAvailable: false,
    printEnabled: false
  });

  const cities = useMemo(() => {
    const uniqueCities = [...new Set(mockVoterData.map(voter => voter.city))];
    return uniqueCities;
  }, []);

  const filteredVoters = useMemo(() => {
    return mockVoterData.filter(voter => {
      if (filters.name && !voter.name.toLowerCase().includes(filters.name.toLowerCase())) return false;
      if (filters.ageMin && voter.age < parseInt(filters.ageMin)) return false;
      if (filters.ageMax && voter.age > parseInt(filters.ageMax)) return false;
      if (filters.gender && filters.gender !== 'all' && voter.gender !== filters.gender) return false;
      if (filters.boothNo && voter.boothNo !== parseInt(filters.boothNo)) return false;
      if (filters.city && filters.city !== 'all' && voter.city !== filters.city) return false;
      if (filters.houseNo && !voter.houseNo.toLowerCase().includes(filters.houseNo.toLowerCase())) return false;
      if (filters.relatedTo && !voter.relatedTo.toLowerCase().includes(filters.relatedTo.toLowerCase())) return false;
      if (filters.mobileAvailable && !voter.mobile) return false;
      if (filters.printEnabled && !voter.isPrint) return false;
      return true;
    });
  }, [filters]);

  const handlePrint = (voter: VoterRecord) => {
    const printWindow = window.open('', '_blank');
    if (printWindow) {
      printWindow.document.write(`
        <html>
          <head>
            <title>Voter Record - ${voter.name}</title>
            <style>
              body { font-family: Arial, sans-serif; padding: 20px; }
              .header { text-align: center; margin-bottom: 30px; }
              .field { margin: 10px 0; }
              .label { font-weight: bold; }
            </style>
          </head>
          <body>
            <div class="header">
              <h2>Voter Record</h2>
            </div>
            <div class="field"><span class="label">Name:</span> ${voter.name} (${voter.gender}, ${voter.age})</div>
            <div class="field"><span class="label">Voter ID:</span> ${voter.voterIdNumber}</div>
            <div class="field"><span class="label">Related To:</span> ${voter.relatedTo}</div>
            <div class="field"><span class="label">House No:</span> ${voter.houseNo || '(blank)'}</div>
            <div class="field"><span class="label">City:</span> ${voter.city}</div>
            <div class="field"><span class="label">Booth:</span> ${voter.boothAddress}</div>
            <div class="field"><span class="label">Mobile:</span> ${voter.mobile || 'Not available'}</div>
          </body>
        </html>
      `);
      printWindow.document.close();
      printWindow.print();
    }
  };


  return (
    <DetailPageLayout title="Voter Records">
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Filters Sidebar */}
        <div className="lg:col-span-1">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Filter className="h-5 w-5" />
                Filters
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="text-sm font-medium mb-2 block">Name</label>
                <Input
                  placeholder="Search by name..."
                  value={filters.name}
                  onChange={(e) => setFilters(prev => ({ ...prev, name: e.target.value }))}
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-sm font-medium mb-2 block">Min Age</label>
                  <Input
                    type="number"
                    placeholder="Min"
                    value={filters.ageMin}
                    onChange={(e) => setFilters(prev => ({ ...prev, ageMin: e.target.value }))}
                  />
                </div>
                <div>
                  <label className="text-sm font-medium mb-2 block">Max Age</label>
                  <Input
                    type="number"
                    placeholder="Max"
                    value={filters.ageMax}
                    onChange={(e) => setFilters(prev => ({ ...prev, ageMax: e.target.value }))}
                  />
                </div>
              </div>

              <div>
                <label className="text-sm font-medium mb-2 block">Gender</label>
                <Select value={filters.gender} onValueChange={(value) => setFilters(prev => ({ ...prev, gender: value }))}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select gender" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All</SelectItem>
                    <SelectItem value="Male">Male</SelectItem>
                    <SelectItem value="Female">Female</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label className="text-sm font-medium mb-2 block">Booth Number</label>
                <Input
                  type="number"
                  placeholder="Enter booth number"
                  value={filters.boothNo}
                  onChange={(e) => setFilters(prev => ({ ...prev, boothNo: e.target.value }))}
                />
              </div>

              <div>
                <label className="text-sm font-medium mb-2 block">City</label>
                <Select value={filters.city} onValueChange={(value) => setFilters(prev => ({ ...prev, city: value }))}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select city" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Cities</SelectItem>
                    {cities.map(city => (
                      <SelectItem key={city} value={city}>{city}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label className="text-sm font-medium mb-2 block">House Number</label>
                <Input
                  placeholder="Search house number"
                  value={filters.houseNo}
                  onChange={(e) => setFilters(prev => ({ ...prev, houseNo: e.target.value }))}
                />
              </div>

              <div>
                <label className="text-sm font-medium mb-2 block">Related To</label>
                <Input
                  placeholder="Search related to"
                  value={filters.relatedTo}
                  onChange={(e) => setFilters(prev => ({ ...prev, relatedTo: e.target.value }))}
                />
              </div>

              <div className="space-y-2">
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="mobile"
                    checked={filters.mobileAvailable}
                    onCheckedChange={(checked) => setFilters(prev => ({ ...prev, mobileAvailable: checked as boolean }))}
                  />
                  <label htmlFor="mobile" className="text-sm">Mobile Available</label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="print"
                    checked={filters.printEnabled}
                    onCheckedChange={(checked) => setFilters(prev => ({ ...prev, printEnabled: checked as boolean }))}
                  />
                  <label htmlFor="print" className="text-sm">Print Enabled</label>
                </div>
              </div>

              <Button 
                variant="outline" 
                onClick={() => setFilters({
                  name: '', ageMin: '', ageMax: '', gender: '', boothNo: '',
                  city: '', houseNo: '', relatedTo: '', mobileAvailable: false, printEnabled: false
                })}
                className="w-full"
              >
                Clear Filters
              </Button>
            </CardContent>
          </Card>

        </div>

        {/* Voter Records List */}
        <div className="lg:col-span-3">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-2">
                  <Search className="h-5 w-5" />
                  Voter Records ({filteredVoters.length})
                </CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {filteredVoters.map((voter) => (
                  <Card key={voter.id} className="border border-civic-border bg-civic-surface/50">
                    <CardContent className="p-4">
                      <div className="space-y-2">
                        <div className="flex items-start justify-between">
                          <div className="space-y-1 flex-1">
                            <h3 className="font-semibold text-lg text-civic-primary">
                              {voter.name} ({voter.gender}, {voter.age})
                            </h3>
                            <p className="text-sm text-muted-foreground">
                              <span className="font-medium">Voter ID:</span> {voter.voterIdNumber}
                            </p>
                            <p className="text-sm text-muted-foreground">
                              <span className="font-medium">Related To:</span> {voter.relatedTo}
                            </p>
                            <p className="text-sm text-muted-foreground">
                              <span className="font-medium">House No:</span> {voter.houseNo || '(blank)'}, 
                              <span className="font-medium"> City:</span> {voter.city}
                            </p>
                            <p className="text-sm text-muted-foreground">
                              <span className="font-medium">Booth:</span> {voter.boothAddress}
                            </p>
                            <p className="text-sm text-muted-foreground">
                              <span className="font-medium">Mobile:</span> {voter.mobile || 'Not available'}
                            </p>
                          </div>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handlePrint(voter)}
                            disabled={!voter.isPrint}
                            className="ml-4 flex items-center gap-2"
                          >
                            <Printer className="h-4 w-4" />
                            Print
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
                
                {filteredVoters.length === 0 && (
                  <div className="text-center py-8 text-muted-foreground">
                    <Search className="h-8 w-8 mx-auto mb-2 opacity-50" />
                    <p>No voter records found matching your filters.</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </DetailPageLayout>
  );
};

export default VoterList;