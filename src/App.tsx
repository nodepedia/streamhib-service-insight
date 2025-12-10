import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import Auth from "./pages/Auth";

// Admin Pages
import AdminLayout from "./components/admin/AdminLayout";
import Dashboard from "./pages/admin/Dashboard";
import Users from "./pages/admin/Users";
import Streams from "./pages/admin/Streams";
import Settings from "./pages/admin/Settings";

// User Pages
import UserLayout from "./components/user/UserLayout";
import UserDashboard from "./pages/user/Dashboard";
import YouTubeAPI from "./pages/user/YouTubeAPI";
import StartLive from "./pages/user/StartLive";
import Videos from "./pages/user/Videos";
import Playlists from "./pages/user/Playlists";
import LiveStreams from "./pages/user/LiveStreams";
import Schedules from "./pages/user/Schedules";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/auth" element={<Auth />} />
            
            {/* User Routes */}
            <Route path="/user" element={<UserLayout />}>
              <Route path="dashboard" element={<UserDashboard />} />
              <Route path="live-streams" element={<LiveStreams />} />
              <Route path="schedules" element={<Schedules />} />
              <Route path="videos" element={<Videos />} />
              <Route path="playlists" element={<Playlists />} />
              <Route path="youtube-api" element={<YouTubeAPI />} />
              <Route path="start-live" element={<StartLive />} />
            </Route>
            
            {/* Admin Routes */}
            <Route path="/admin" element={<AdminLayout />}>
              <Route index element={<Dashboard />} />
              <Route path="users" element={<Users />} />
              <Route path="streams" element={<Streams />} />
              <Route path="settings" element={<Settings />} />
            </Route>
            
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
