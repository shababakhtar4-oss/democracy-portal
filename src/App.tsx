import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Dashboard from "./pages/Dashboard";
import BoothLocations from "./pages/BoothLocations";
import VoterReport from "./pages/VoterReport";
import VoterList from "./pages/VoterList";
import SettingsPage from "./pages/SettingsPage";
import NotFound from "./pages/NotFound";
import Index from "./pages/Index";
import RecentLogins from "./pages/RecentLogins";
import LoginDetails from "./pages/LoginDetails";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/booth-locations" element={<BoothLocations />} />
          <Route path="/voter-report" element={<VoterReport />} />
          <Route path="/settings" element={<SettingsPage />} />
          <Route path="/list" element={<VoterList />} />
          <Route path="/language" element={<Index />} />
          <Route path="/recent-logins" element={<RecentLogins />} />
          <Route path="/recent-login/:id" element={<LoginDetails />} />
          <Route path="/activation-code" element={<Index />} />
          <Route path="/booth-committee" element={<Index />} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
