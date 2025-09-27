import React, { useState, useMemo, useEffect } from 'react';
import { Printer, Search, Filter, Download, Monitor, Tablet } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import DetailPageLayout from "@/components/layout/DetailPageLayout";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogClose } from "@/components/ui/dialog";
import { useAppSelector, useAppDispatch } from "@/hooks/redux";
import { useGetVoterReportQuery } from "@/store/api/apiSlice";
import { setSearchTerm, setUsers, setLoading } from "@/store/slices/votersSlice";

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
  userId?: string;
  username?: string;
  mobileNumber?: string;
}

// Mock data for fallback
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

const groupByHouseNumber = (voters: VoterRecord[]) => {
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
  
  const dispatch = useAppDispatch();
  const { user } = useAppSelector((state) => state.auth);
  const { searchTerm, filteredUsers, loading } = useAppSelector((state) => state.voters);
  
  // Use RTK Query for API data
  const { data: apiVoterData, isLoading: isApiLoading } = useGetVoterReportQuery(
    { activationCode: user?.activationCode || '' },
    { skip: !user?.activationCode }
  );

  const cities = useMemo(() => {
    const uniqueCities = [...new Set(mockVoterData.map(voter => voter.city))];
    return uniqueCities;
  }, []);

  useEffect(() => {
    if (apiVoterData?.users) {
      const mappedUsers = apiVoterData.users.map((user: any) => ({
        id: user.userId,
        userId: user.userId,
        name: user.name,
        username: user.username,
        mobile: user.mobileNumber,
        mobileNumber: user.mobileNumber,
        age: 30, // Default age since not provided by API
        gender: 'Male' as const, // Default gender
        voterIdNumber: `VID${user.userId.slice(-6)}`, // Generate voter ID
        boothAddress: 'Address not available',
        boothNo: 101,
        houseNo: '',
        city: 'DELHI',
        relatedTo: '',
        isPrint: true
      }));
      dispatch(setUsers(mappedUsers));
    }
  }, [apiVoterData, dispatch]);

  const handleApiSearch = async () => {
    dispatch(setLoading(true));
    // The search will be handled by RTK Query automatically
    dispatch(setLoading(false));
  };

  // Filter the voters based on search term and other filters
  const displayVoters = useMemo(() => {
    const voters = filteredUsers.length > 0 ? filteredUsers : mockVoterData;
    
    return voters.filter(voter => {
      // Enhanced search: check if the search term is in any visible field
      const search = searchTerm.trim().toLowerCase();
      if (search) {
        const haystack = [
          voter.name,
          voter.voterIdNumber,
          voter.mobile || voter.mobileNumber,
          voter.houseNo,
          voter.relatedTo,
          voter.city,
          voter.boothAddress,
          voter.boothNo?.toString(),
          voter.gender,
          voter.age?.toString(),
          voter.username,
        ]
          .filter(Boolean)
          .join(" ")
          .toLowerCase();
        if (!haystack.includes(search)) return false;
      }
      if (filters.ageMin && voter.age < parseInt(filters.ageMin)) return false;
      if (filters.ageMax && voter.age > parseInt(filters.ageMax)) return false;
      if (filters.gender && filters.gender !== 'all' && voter.gender !== filters.gender) return false;
      if (filters.boothNo && voter.boothNo !== parseInt(filters.boothNo)) return false;
      if (filters.city && filters.city !== 'all' && voter.city !== filters.city) return false;
      if (filters.houseNo && !voter.houseNo.toLowerCase().includes(filters.houseNo.toLowerCase())) return false;
      if (filters.relatedTo && !voter.relatedTo.toLowerCase().includes(filters.relatedTo.toLowerCase())) return false;
      if (filters.mobileAvailable && !(voter.mobile || voter.mobileNumber)) return false;
      if (filters.printEnabled && !voter.isPrint) return false;
      return true;
    });
  }, [searchTerm, filters, filteredUsers]);

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
            <div class="field"><span class="label">Mobile:</span> ${voter.mobile || voter.mobileNumber || 'Not available'}</div>
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
              body { font-family: Arial, sans-serif; padding: 20px; }
              .voter-card { border: 1px solid #ccc; margin: 10px 0; padding: 15px; }
              .voter-name { font-size: 18px; font-weight: bold; }
            </style>
          </head>
          <body>
            <h2>Voters in House No: ${selectedHouse}</h2>
            ${voters.map(v => `
              <div class="voter-card">
                <div class="voter-name">${v.name}</div>
                <div>Gender: ${v.gender}, Age: ${v.age}</div>
                <div>Voter ID: ${v.voterIdNumber}</div>
                <div>Mobile: ${v.mobile || 'Not available'}</div>
                <div>Related To: ${v.relatedTo}</div>
              </div>
            `).join('')}
          </body>
        </html>
      `);
      printWindow.document.close();
      printWindow.print();
    }
  };

  return (
    <DetailPageLayout title="Voter Records">
      <div className="w-full">
        <div className="w-full">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 mb-4">
                Voter Records ({displayVoters?.length || 0})
              </CardTitle>
              {/* Enhanced Search Box */}
              <div className="relative flex items-center gap-5">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search by name, voter ID, or mobile number..."
                  value={searchTerm}
                  onChange={(e) => dispatch(setSearchTerm(e.target.value))}
                  className="pl-10 h-12 text-base bg-gradient-to-r from-blue-50 to-purple-50 border-2 border-blue-200 focus:border-purple-400 focus:bg-white transition-all duration-300"
                />
                <Button
                  type="button"
                  variant="default"
                  className="h-12 px-6"
                  onClick={handleApiSearch}
                >
                  Search
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {(loading || isApiLoading) ? (
                  <div className="col-span-full text-center py-8">Loading voters...</div>
                ) : (
                  displayVoters.map((voter) => (
                    <Card
                      key={voter.id || voter.userId}
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
                              <p className="text-sm font-semibold text-gray-800 capitalize">{voter.relatedTo || 'N/A'}</p>
                            </div>
                            <div>
                              <p className="text-xs text-gray-500 font-medium">House No</p>
                              <p className="text-sm font-semibold text-gray-800">{voter.houseNo || 'N/A'}</p>
                            </div>
                          </div>

                          {/* Contact & Location */}
                          <div className="space-y-2">
                            <div className="flex items-center justify-between">
                              <p className="text-xs text-gray-500 font-medium">Mobile</p>
                              <p className="text-sm font-semibold text-gray-800">
                                {voter.mobile || voter.mobileNumber || 'Not available'}
                              </p>
                            </div>
                            <div className="flex items-center justify-between">
                              <p className="text-xs text-gray-500 font-medium">City</p>
                              <p className="text-sm font-semibold text-gray-800">{voter.city}</p>
                            </div>
                          </div>

                          {/* Action Buttons */}
                          <div className="flex gap-2 pt-3 border-t border-gray-100">
                            <Button
                              size="sm"
                              variant="outline"
                              className="flex-1 text-xs"
                              onClick={() => handlePrint(voter)}
                            >
                              <Printer className="h-3 w-3 mr-1" />
                              Print
                            </Button>
                          </div>
                        </div>
                      </div>
                      
                      {/* Status indicator */}
                      <div className="absolute top-2 right-2">
                        <div className={`w-3 h-3 rounded-full ${voter.isPrint ? 'bg-green-400' : 'bg-red-400'}`} 
                             title={voter.isPrint ? 'Print enabled' : 'Print disabled'}>
                        </div>
                      </div>
                    </Card>
                  ))
                )}
                {(displayVoters?.length === 0 && !loading && !isApiLoading) && (
                  <div className="col-span-full text-center py-8 text-muted-foreground">
                    <Search className="h-8 w-8 mx-auto mb-2 opacity-50" />
                    <p>No voter records found matching your filters.</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Group Print Dialog */}
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Voters in House No: {selectedHouse}</DialogTitle>
          </DialogHeader>
          <div className="max-h-[400px] overflow-y-auto">
            {selectedHouse && groups[selectedHouse]?.map((voter) => (
              <div key={voter.id} className="p-3 border-b last:border-b-0">
                <div className="font-semibold">{voter.name}</div>
                <div className="text-sm text-gray-600">
                  {voter.gender}, {voter.age} years • {voter.voterIdNumber}
                </div>
                <div className="text-sm text-gray-600">
                  Mobile: {voter.mobile || 'Not available'}
                </div>
              </div>
            ))}
          </div>
          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handlegroupPrint}>
              <Printer className="h-4 w-4 mr-2" />
              Print All
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </DetailPageLayout>
  );
};

export default VoterList;