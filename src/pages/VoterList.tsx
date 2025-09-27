import React, { useState, useMemo } from 'react';
import { Printer, Search, Filter, Download, Monitor, Tablet } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import DetailPageLayout from "@/components/layout/DetailPageLayout";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogClose } from "@/components/ui/dialog";

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
  },
    {
    id: '5',
    name: 'radha',
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
  },
    {
    id: '6',
    name: 'neena devi',
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
  },
    {
    id: '7',
    name: 'manju devi',
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

const groupByHouseNumber = (voters: typeof mockVoterData) => {
  const groups: Record<string, VoterRecord[]> = {};
  voters.forEach((voter) => {
    if (!groups[voter.houseNo]) {
      groups[voter.houseNo] = [];
    }
    groups[voter.houseNo].push(voter);
  });
  return groups;
};

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
  const [open, setOpen] = useState(false);
  const [selectedHouse, setSelectedHouse] = useState<string | null>(null);

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

  const handlegroupPrint = () => {
  if (!selectedHouse) return;
  const voters = groups[selectedHouse] || [];
  const printWindow = window.open('', '_blank');
  if (printWindow) {
    printWindow.document.write(`
      <html>
        <head>
          <title>Voters in House No: ${selectedHouse}</title>
          <style>
            body { 
              font-family: Arial, sans-serif; 
              padding: 20px; 
              line-height: 1.4;
              background-color: #f8f9fa;
            }
            h2 { 
              text-align: center; 
              color: #333;
              margin-bottom: 30px;
              padding-bottom: 10px;
              border-bottom: 2px solid #007bff;
            }
            .voter-card {
              background: white;
              border-radius: 8px;
              padding: 20px;
              margin-bottom: 20px;
              box-shadow: 0 2px 4px rgba(0,0,0,0.1);
              border-left: 4px solid #007bff;
            }
            .voter-header {
              background: linear-gradient(135deg, #007bff, #6610f2);
              color: white;
              padding: 15px;
              border-radius: 6px;
              margin-bottom: 15px;
            }
            .voter-name {
              font-size: 18px;
              font-weight: bold;
              margin: 0;
            }
            .voter-details {
              font-size: 14px;
              opacity: 0.9;
            }
            .info-grid {
              display: grid;
              grid-template-columns: 1fr 1fr;
              gap: 15px;
              margin-bottom: 15px;
            }
            .info-item {
              background: #f8f9fa;
              padding: 12px;
              border-radius: 6px;
              border-left: 3px solid #28a745;
            }
            .info-label {
              font-size: 11px;
              font-weight: bold;
              color: #666;
              text-transform: uppercase;
              margin-bottom: 4px;
            }
            .info-value {
              font-size: 14px;
              color: #333;
              font-weight: 600;
            }
            .voter-id {
              background: #e3f2fd;
              border: 1px solid #2196f3;
              padding: 12px;
              border-radius: 6px;
              margin-bottom: 15px;
              text-align: center;
            }
            .voter-id-label {
              font-size: 12px;
              color: #1976d2;
              font-weight: bold;
              margin-bottom: 4px;
            }
            .voter-id-value {
              font-size: 16px;
              color: #0d47a1;
              font-weight: bold;
            }
            .booth-address {
              background: #fff3e0;
              border: 1px solid #ff9800;
              padding: 12px;
              border-radius: 6px;
              margin-top: 15px;
            }
            .booth-label {
              font-size: 11px;
              color: #f57c00;
              font-weight: bold;
              margin-bottom: 6px;
            }
            .booth-text {
              font-size: 13px;
              color: #e65100;
              line-height: 1.4;
            }
            .mobile-info {
              background: #f3e5f5;
              border: 1px solid #9c27b0;
              padding: 12px;
              border-radius: 6px;
              text-align: center;
            }
            .no-mobile {
              background: #fafafa;
              border: 1px solid #bdbdbd;
              color: #757575;
            }
            @media print {
              .voter-card {
                page-break-inside: avoid;
                margin-bottom: 30px;
              }
            }
          </style>
        </head>
        <body>
          <h2>Voters in House No: ${selectedHouse}</h2>
          ${voters
            .map(
              v =>
                `<div class="voter-card">
                  <div class="voter-header">
                    <div class="voter-name">${v.name}</div>
                    <div class="voter-details">${v.gender} • ${v.age} years old</div>
                  </div>
                  
                  <div class="voter-id">
                    <div class="voter-id-label">VOTER ID NUMBER</div>
                    <div class="voter-id-value">${v.voterIdNumber}</div>
                  </div>
                  
                  <div class="info-grid">
                    <div class="info-item">
                      <div class="info-label">Related To</div>
                      <div class="info-value">${v.relatedTo}</div>
                    </div>
                    <div class="info-item">
                      <div class="info-label">House No</div>
                      <div class="info-value">${v.houseNo || 'Not Available'}</div>
                    </div>
                    <div class="info-item">
                      <div class="info-label">City</div>
                      <div class="info-value">${v.city}</div>
                    </div>
                    <div class="info-item">
                      <div class="info-label">Booth No</div>
                      <div class="info-value">${v.boothNo}</div>
                    </div>
                  </div>
                  
                  <div class="mobile-info ${v.mobile ? '' : 'no-mobile'}">
                    <div class="info-label">Mobile Number</div>
                    <div class="info-value">${v.mobile || 'Not Available'}</div>
                  </div>
                  
                  <div class="booth-address">
                    <div class="booth-label">Booth Address</div>
                    <div class="booth-text">${v.boothAddress}</div>
                  </div>
                </div>`
            )
            .join("")}
        </body>
      </html>
    `);
    printWindow.document.close();
    printWindow.print();
  }
};

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

  const groups = groupByHouseNumber(mockVoterData);

  const handleGroupByClick = (houseNumber: string) => {
    setSelectedHouse(houseNumber);
    setOpen(true);
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
              <CardTitle className="flex items-center gap-2 mb-4">
                <Search className="h-5 w-5" />
                Voter Records ({filteredVoters.length})
              </CardTitle>
              {/* Enhanced Search Box */}
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search by name, voter ID, or mobile number..."
                  value={filters.name}
                  onChange={(e) => setFilters(prev => ({ ...prev, name: e.target.value }))}
                  className="pl-10 h-12 text-base bg-gradient-to-r from-blue-50 to-purple-50 border-2 border-blue-200 focus:border-purple-400 focus:bg-white transition-all duration-300"
                />
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {filteredVoters.map((voter) => (
                  <Card
                    key={voter.id}
                    className="group relative overflow-hidden bg-gradient-to-br from-white to-gray-50/80 border-0 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
                  >
                    {/* Header with gradient background */}
                    <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-4 text-white">
                      <div className="flex items-center justify-between">
                        <div>
                          <h3 className="font-bold text-lg leading-tight">
                            {voter.name}
                          </h3>
                          <p className="text-blue-100 text-sm">
                            {voter.gender} • {voter.age} years
                          </p>
                        </div>
                        <div className="text-right">
                          <div className="bg-white/20 rounded-lg px-3 py-1">
                            <p className="text-xs font-medium">Booth</p>
                            <p className="text-sm font-bold">{voter.boothNo}</p>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Content */}
                    <div className="p-5">
                      <div className="space-y-3">
                        {/* Voter ID - Prominent display */}
                        <div className="bg-gray-50 rounded-lg p-3 border-l-4 border-blue-500">
                          <p className="text-xs text-gray-600 font-medium uppercase tracking-wide">Voter ID</p>
                          <p className="text-sm font-bold text-gray-900">{voter.voterIdNumber}</p>
                        </div>

                        {/* Personal Details */}
                        <div className="grid grid-cols-2 gap-3">
                          <div>
                            <p className="text-xs text-gray-500 font-medium">Related To</p>
                            <p className="text-sm font-semibold text-gray-800 capitalize">{voter.relatedTo}</p>
                          </div>
                          <div>
                            <p className="text-xs text-gray-500 font-medium">House No</p>
                            <p className="text-sm font-semibold text-gray-800">{voter.houseNo || 'N/A'}</p>
                          </div>
                        </div>

                        {/* Location Info */}
                        <div>
                          <p className="text-xs text-gray-500 font-medium mb-1">Location</p>
                          <div className="bg-green-50 rounded-lg p-2 border border-green-200">
                            <p className="text-xs font-semibold text-green-800">{voter.city}</p>
                          </div>
                        </div>

                        {/* Contact Info */}
                        {voter.mobile && (
                          <div className="flex items-center gap-2 bg-orange-50 rounded-lg p-2 border border-orange-200">
                            <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
                            <div>
                              <p className="text-xs text-orange-700 font-medium">Mobile</p>
                              <p className="text-sm font-semibold text-orange-800">{voter.mobile}</p>
                            </div>
                          </div>
                        )}
                        
                        {!voter.mobile && (
                          <div className="flex items-center gap-2 bg-gray-50 rounded-lg p-2 border border-gray-200">
                            <div className="w-2 h-2 bg-gray-400 rounded-full"></div>
                            <p className="text-xs text-gray-500">No mobile number</p>
                          </div>
                        )}

                        {/* Booth Address - Collapsible */}
                        <div className="bg-blue-50 rounded-lg p-3 border border-blue-200">
                          <p className="text-xs text-blue-700 font-medium mb-1">Booth Address</p>
                          <p className="text-xs text-blue-800 leading-relaxed">{voter.boothAddress}</p>
                        </div>
                      </div>

                      {/* Action Buttons */}
                      <div className="flex gap-2 mt-5 pt-4 border-t border-gray-100">
                        <Button
                          variant={voter.isPrint ? "default" : "secondary"}
                          size="sm"
                          onClick={() => handlePrint(voter)}
                          disabled={!voter.isPrint}
                          className="flex-1 flex items-center justify-center gap-2 font-medium"
                        >
                          <Printer className="h-4 w-4" />
                          Print
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleGroupByClick(voter.houseNo)}
                          disabled={!voter.isPrint}
                          className="flex-1 flex items-center justify-center gap-2 font-medium bg-teal-50 border-teal-200 text-teal-700 hover:bg-teal-100 hover:border-teal-300 disabled:bg-gray-50 disabled:border-gray-200 disabled:text-gray-400"
                        >
                          <Monitor className="h-4 w-4" />
                          Group
                        </Button>
                      </div>
                    </div>
                    
                    {/* Status indicator */}
                    <div className="absolute top-2 right-2">
                      <div className={`w-3 h-3 rounded-full ${voter.isPrint ? 'bg-green-400' : 'bg-red-400'}`} 
                           title={voter.isPrint ? 'Print enabled' : 'Print disabled'}>
                      </div>
                    </div>
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

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {selectedHouse ? `Voters in House No: ${selectedHouse}` : "Group By House Number"}
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-2">
            {selectedHouse &&
              groups[selectedHouse]?.map((voter, idx) => (
                <div key={idx} className="flex justify-between border-b py-1 items-center">
              <span className="flex-1">{voter.name}</span>
              <span className="flex-1 text-center text-xs text-muted-foreground">{voter.relatedTo}</span>
              <span className="flex-1 text-right text-xs text-muted-foreground">{voter.voterIdNumber}</span>
            </div>
              ))}
          </div>
          <DialogClose asChild>
            <Button variant="outline" className="mt-4 w-full" onClick = {handlegroupPrint}>Print</Button>
          </DialogClose>
        </DialogContent>
      </Dialog>
    </DetailPageLayout>
  );
};

export default VoterList;