import React, { useState, useMemo, useEffect } from 'react';
import { Printer, Search, Filter, Download, Monitor, Tablet } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import DetailPageLayout from "@/components/layout/DetailPageLayout";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogClose,DialogFooter } from "@/components/ui/dialog";
import { apiRequest } from '@/lib/utils';

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


const groupByHouseNumber = (voters: any) => {
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
  const [voterData, setVoterData] = useState([]);
  const [selectedHouse, setSelectedHouse] = useState<string | null>(null);
    const [filterOpen, setFilterOpen] = useState(false);
  const [filterFields, setFilterFields] = useState({
    name: "",
    houseNo: "",
    voterIdNumber: "",
    relatedTo: "",
  });
  const userData = localStorage.getItem("user");
  const token = userData ? JSON.parse(userData).token : null;
 const groups = useMemo(() => groupByHouseNumber(voterData), [voterData]);
 useEffect(() => {
  const activationCode = userData ? JSON.parse(userData).activationCode : null;
    const fetchVoters = async () => {
      try {
        const response = await apiRequest<any>(
          `https://pollingservice-addeehfvcxafffb5.centralindia-01.azurewebsites.net/api/voters/presearch?pageSize=50&activationCode=${activationCode}`,
          {
            method: "GET",
            headers: token
              ? {
                  Authorization: `Bearer ${token}`,
                }
              : undefined,
          }
        );
        setVoterData(response);
      } catch (error) {
        console.error("Failed to fetch voters:", error);
      }
    };

    fetchVoters();
  }, [token]);

  const handleApiSearch = async () => {
    // setLoading(true);
    try {
      const userData = localStorage.getItem("user");
      const token = userData ? JSON.parse(userData).token : null;
      // Replace with your actual API endpoint
      const response = await apiRequest<any>(
        `https://pollingservice-addeehfvcxafffb5.centralindia-01.azurewebsites.net/api/voters/search?searchText=${filters?.name}&activationCode=${userData ? JSON.parse(userData).activationCode : null}`,
        {
          method: "GET",
          headers: token
            ? {
                Authorization: `Bearer ${token}`,
                "Content-Type": "application/json",
              }
            : {
                "Content-Type": "application/json",
              },
        }
      );
      // Handle response (e.g., set filteredVoters state if using API data)
      // setFilteredVoters(response.data);
      // For now, just log:
      setVoterData(response);
      console.log("API search result:", response);
    } catch (error) {
      // Handle error (show toast, etc.)
      console.error("API search failed:", error);
    } finally {
      // setLoading(false);
      console.log("API search completed");
      
    }
  };

    const filteredUsers = voterData?.filter((login: any) => {
    const nameMatch = filterFields.name
      ? login.name?.toLowerCase().includes(filterFields.name.toLowerCase())
      : true;
    const houseNoMatch = filterFields.houseNo
      ? login.houseNo?.toLowerCase().includes(filterFields.houseNo.toLowerCase())
      : true;
    const voterIdMatch = filterFields.voterIdNumber
      ? login.voterIdNumber?.toLowerCase().includes(filterFields.voterIdNumber.toLowerCase())
      : true;
    const relatedToMatch = filterFields.relatedTo
      ? login.relatedTo?.toLowerCase().includes(filterFields.relatedTo.toLowerCase())
      : true;
    return nameMatch || houseNoMatch || voterIdMatch || relatedToMatch;
  });

  const handleFilterChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFilterFields({ ...filterFields, [e.target.name]: e.target.value });
  };

  const handleApplyFilters = () => {
    setFilterOpen(false);
    // Filtering is handled by filteredUsers
  };

  const filteredVoters = useMemo(() => {
      return voterData.filter((voter: any) => {
      const search = filters.name.trim().toLowerCase();
      if (search) {
        const haystack = [
          voter.name,
          voter.voterIdNumber,
          voter.mobile,
          voter.houseNo,
          voter.relatedTo,
          voter.city,
          voter.boothAddress,
          voter.boothNo?.toString(),
          voter.gender,
          voter.age?.toString(),
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
      if (filters.mobileAvailable && !voter.mobile) return false;
      if (filters.printEnabled && !voter.isPrint) return false;
      return true;
    });
  }, [filters, voterData]);

  const handlegroupPrint = () => {
  if (!selectedHouse) return;
  const voters = groups[selectedHouse] || [];
  const printWindow = window.open('', '_blank');
  if (printWindow) {
    printWindow.document.write(`
      <html>
        <head>
          <title>Voter Details</title>
          <style>
            body { font-family: Arial, sans-serif; padding: 20px; }
            .card { border: 1px solid #ddd; border-radius: 10px; padding: 20px; max-width: 400px; margin: auto; box-shadow: 0 5px 15px rgba(0,0,0,0.1); }
            .card h3 { margin-top: 0; color: #2c3e50; }
            .card p { margin: 6px 0; font-size: 14px; }
            .card b { color: #34495e; }
          </style>
        </head>
        <body>
          <h2>Voters in House No: ${selectedHouse}</h2>
          ${voters
            .map(
              item =>
                `<div class="card">
            <h3>Voter Details</h3>
            <p><b>Name:</b> ${item.name}</p>
            <p><b>Father/Husband:</b> ${item.rlnName} (${item.rlnType})</p>
            <p><b>House No:</b> ${item.houseNo}</p>
            <p><b>AC No:</b> ${item.acNo}, <b>Part No:</b> ${item.partNo}, <b>Section No:</b> ${item.sectionNo}</p>
            <p><b>Sl No:</b> ${item.slNoInPart}</p>
            <p><b>EPIC No:</b> ${item.epicNo}</p>
            <p><b>Gender:</b> ${item.gender}</p>
            <p><b>Age:</b> ${item.age}</p>
            <p><b>DOB:</b> ${item.dob || "-"}</p>
            <p><b>Mobile No:</b> ${item.mobileNo || "-"}</p>
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

  const handlePrint = (item: VoterRecord) => {
    const printWindow = window.open('', '_blank');
    if (printWindow) {
      printWindow.document.write(`
        <html>
        <head>
          <title>Voter Details</title>
          <style>
            body { font-family: Arial, sans-serif; padding: 20px; }
            .card { border: 1px solid #ddd; border-radius: 10px; padding: 20px; max-width: 400px; margin: auto; box-shadow: 0 5px 15px rgba(0,0,0,0.1); }
            .card h3 { margin-top: 0; color: #2c3e50; }
            .card p { margin: 6px 0; font-size: 14px; }
            .card b { color: #34495e; }
          </style>
        </head>
        <body>
          <div class="card">
            <h3>Voter Details</h3>
            <p><b>Name:</b> ${item.name}</p>
            <p><b>Father/Husband:</b> ${item.rlnName} (${item.rlnType})</p>
            <p><b>House No:</b> ${item.houseNo}</p>
            <p><b>AC No:</b> ${item.acNo}, <b>Part No:</b> ${item.partNo}, <b>Section No:</b> ${item.sectionNo}</p>
            <p><b>Sl No:</b> ${item.slNoInPart}</p>
            <p><b>EPIC No:</b> ${item.epicNo}</p>
            <p><b>Gender:</b> ${item.gender}</p>
            <p><b>Age:</b> ${item.age}</p>
            <p><b>DOB:</b> ${item.dob || "-"}</p>
            <p><b>Mobile No:</b> ${item.mobileNo || "-"}</p>
          </div>
        </body>
      </html>
      `);
      printWindow.document.close();
      printWindow.print();
    }
  };

  const handleGroupByClick = (houseNumber: string) => {
    setSelectedHouse(houseNumber);
    setOpen(true);
  };

  return (
    <DetailPageLayout title="Voter Records">
      <div className="w-full">
        {/* Voter Records List */}
        <div className="w-full">
                        {/* Filter Dialog */}
      <Dialog open={filterOpen} onOpenChange={setFilterOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Filter Users</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <Input
              name="name"
              placeholder="Name"
              value={filterFields.name}
              onChange={handleFilterChange}
            />
            <Input
              name="houseNo"
              placeholder="House Number"
              value={filterFields.houseNo}
              onChange={handleFilterChange}
            />
            <Input
              name="voterIdNumber"
              placeholder="Voter ID Card"
              value={filterFields.voterIdNumber}
              onChange={handleFilterChange}
            />
               <Input
              name="relatedTo"
              placeholder="Related To"
              value={filterFields.relatedTo}
              onChange={handleFilterChange}
            />
          </div>
          <DialogFooter>
            <Button onClick={handleApplyFilters} type="button">
              Apply
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 mb-4">
                Voter Records ({voterData?.length})
              </CardTitle>
              {/* Enhanced Search Box */}
              <div className="relative flex items-center gap-5">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search by name, voter ID, or mobile number..."
                  value={filters.name}
                  onChange={(e) => setFilters(prev => ({ ...prev, name: e.target.value }))}
                  className="pl-10 h-12 text-base bg-gradient-to-r from-blue-50 to-purple-50 border-2 border-blue-200 focus:border-purple-400 focus:bg-white transition-all duration-300"
                />
              <Button
                  type="button"
                  variant="default"
                  className="h-12 px-6"
                  onClick={handleApiSearch}
                  // disabled={loading || !filters.name.trim()}
                >
                  {/* {loading ? "Searching..." : "Search"} */}
                  Search
                </Button>
                {/* <Button
          type="button"
          variant="outline"
          onClick={() => setFilterOpen(true)}
        >
          Filters
        </Button> */}
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {voterData?.map((voter) => (
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
                          <p className="text-sm font-bold text-gray-900">{voter.epicNo}</p>
                        </div>

                        {/* Personal Details */}
                        <div className="grid grid-cols-2 gap-3">
                          <div>
                            <p className="text-xs text-gray-500 font-medium">Related To</p>
                            <p className="text-sm font-semibold text-gray-800 capitalize">{voter.rlnName}</p>
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
                            <p className="text-xs font-semibold text-green-800">{voter.partNo}</p>
                          </div>
                        </div>

                        {/* Contact Info */}
                        {voter?.mobileNo && (
                          <div className="flex items-center gap-2 bg-orange-50 rounded-lg p-2 border border-orange-200">
                            <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
                            <div>
                              <p className="text-xs text-orange-700 font-medium">Mobile</p>
                              <p className="text-sm font-semibold text-orange-800">{voter?.mobileNo?.slice(-4).padStart(voter?.mobileNo?.length, '*')}</p>
                            </div>
                          </div>
                        )}
                        
                        {!voter?.mobileNo && (
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
                          variant={"default"}
                          size="sm"
                          onClick={() => handlePrint(voter)}
                          className="flex-1 flex items-center justify-center gap-2 font-medium"
                        >
                          <Printer className="h-4 w-4" />
                          Print
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleGroupByClick(voter.houseNo)}
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