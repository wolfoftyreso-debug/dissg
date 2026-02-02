import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import { ProtectedRoute } from "@/components/auth/ProtectedRoute";
import Index from "./pages/Index";
import PublicDashboard from "./pages/PublicDashboard";
import GlobalCompact from "./pages/GlobalCompact";
import Admin from "./pages/Admin";
import PublicProfiles from "./pages/PublicProfiles";
import ProfileDemo from "./pages/ProfileDemo";
import DepthDemo from "./pages/DepthDemo";
import Login from "./pages/Login";
import Register from "./pages/Register";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            {/* Publika routes */}
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/public" element={<PublicDashboard />} />
            <Route path="/compact" element={<GlobalCompact />} />
            <Route path="/profiles" element={<PublicProfiles />} />
            <Route path="/profile-demo" element={<ProfileDemo />} />
            
            {/* Skyddade routes - kräver inloggning */}
            <Route path="/" element={
              <ProtectedRoute>
                <Index />
              </ProtectedRoute>
            } />
            
            <Route path="/depth-demo" element={
              <ProtectedRoute requiredRole="researcher">
                <DepthDemo />
              </ProtectedRoute>
            } />
            
            {/* Admin - kräver departementschef eller högre */}
            <Route path="/admin" element={
              <ProtectedRoute requiredRole="department_lead">
                <Admin />
              </ProtectedRoute>
            } />
            
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
