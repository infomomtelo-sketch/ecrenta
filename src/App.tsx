import { HelmetProvider } from "react-helmet-async";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes, Navigate, Outlet } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { ListingsProvider } from "@/contexts/ListingsContext";
import { AuthProvider, useAuth } from "@/contexts/AuthContext";
import DashboardLayout from "@/components/DashboardLayout";
import Index from "./pages/Index";
import Listings from "./pages/Listings";
import ListingDetail from "./pages/ListingDetail";
import Inbox from "./pages/Inbox";
import AddProperty from "./pages/AddProperty";
import Dashboard from "./pages/Dashboard";
import Auth from "./pages/Auth";
import SelectRole from "./pages/SelectRole";
import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword from "./pages/ResetPassword";
import NotFound from "./pages/NotFound";
import ImportListing from "./pages/ImportListing";
import SocialLinks from "./pages/SocialLinks";
import Pricing from "./pages/Pricing";
import Privacy from "./pages/Privacy";
import Terms from "./pages/Terms";
import About from "./pages/About";
import Contact from "./pages/Contact";
import HowItWorks from "./pages/HowItWorks";
import ForLandlords from "./pages/ForLandlords";
import ForTenants from "./pages/ForTenants";
import Resources from "./pages/Resources";
import Blog from "./pages/Blog";
import BlogPost from "./pages/BlogPost";
import BlogEditor from "./pages/BlogEditor";
import Inspections from "./pages/Inspections";
import NewInspection from "./pages/NewInspection";
import InspectionReport from "./pages/InspectionReport";
import InspectionCompare from "./pages/InspectionCompare";
import SharedInspection from "./pages/SharedInspection";
import RepairRequest from "./pages/RepairRequest";
import MaintenanceDashboard from "./pages/MaintenanceDashboard";
import MaintenanceDetail from "./pages/MaintenanceDetail";
import P8Dashboard from "./pages/P8Dashboard";
import Install from "./pages/Install";
import PostProperty from "./pages/PostProperty";
import GetStarted from "./pages/GetStarted";
import Unsubscribe from "./pages/Unsubscribe";
import Tenants from "./pages/Tenants";
import RentalForms from "./pages/RentalForms";
import Invoices from "./pages/Invoices";
import SignForm from "./pages/SignForm";
import MarketLanding from "./pages/MarketLanding";
import OutreachCRM from "./pages/OutreachCRM";
import ListWithUs from "./pages/ListWithUs";
import AdminDashboard from "./pages/AdminDashboard";
import CapturePage from "./pages/CapturePage";
import CapturePages from "./pages/CapturePages";
import RentCollection from "./pages/RentCollection";
import TenantPortal from "./pages/TenantPortal";
import AcceptTenantInvite from "./pages/AcceptTenantInvite";
import { SaasGate } from "@/components/SaasGate";

const queryClient = new QueryClient();

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth();
  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
      </div>
    );
  }
  if (!user) return <Navigate to="/auth" replace />;
  return <>{children}</>;
}

function RoleGate({ children }: { children: React.ReactNode }) {
  const { user, role, loading } = useAuth();
  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
      </div>
    );
  }
  if (user && !role) return <Navigate to="/select-role" replace />;
  return <>{children}</>;
}

function ProtectedDashboard() {
  const { user, role, loading } = useAuth();
  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
      </div>
    );
  }
  if (!user) return <Navigate to="/auth" replace />;
  if (!role) return <Navigate to="/select-role" replace />;
  return <DashboardLayout />;
}

function LandlordOnly({ children }: { children: React.ReactNode }) {
  const { role, loading } = useAuth();
  if (loading) return null;
  if (role !== "landlord") return <Navigate to="/listings" replace />;
  return <>{children}</>;
}

const App = () => (
  <HelmetProvider>
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <AuthProvider>
        <ListingsProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <Routes>
              {/* Public routes */}
              <Route path="/" element={<Index />} />
              <Route path="/listings" element={<Listings />} />
              <Route path="/listing/:id" element={<ListingDetail />} />
              <Route path="/auth" element={<Auth />} />
              <Route path="/socials" element={<SocialLinks />} />
              <Route path="/forgot-password" element={<ForgotPassword />} />
              <Route path="/reset-password" element={<ResetPassword />} />
              <Route path="/pricing" element={<Pricing />} />
              <Route path="/privacy" element={<Privacy />} />
              <Route path="/terms" element={<Terms />} />
              <Route path="/about" element={<About />} />
              <Route path="/contact" element={<Contact />} />
              <Route path="/how-it-works" element={<HowItWorks />} />
              <Route path="/for-landlords" element={<ForLandlords />} />
              <Route path="/for-tenants" element={<ForTenants />} />
              <Route path="/resources" element={<Resources />} />
              <Route path="/blog" element={<Blog />} />
              <Route path="/blog/:slug" element={<BlogPost />} />
              <Route path="/select-role" element={<ProtectedRoute><SelectRole /></ProtectedRoute>} />

              {/* Public repair request */}
              <Route path="/repair" element={<RepairRequest />} />
              <Route path="/maintenance/:id" element={<MaintenanceDetail />} />
              <Route path="/install" element={<Install />} />
              <Route path="/post-property" element={<PostProperty />} />
              <Route path="/get-started" element={<GetStarted />} />
              <Route path="/unsubscribe" element={<Unsubscribe />} />
              <Route path="/sign/:token" element={<SignForm />} />
              <Route path="/inspection/:token" element={<SharedInspection />} />
              <Route path="/rentals/:slug" element={<MarketLanding />} />
              <Route path="/list-with-us" element={<ListWithUs />} />
              <Route path="/c/:slug" element={<CapturePage />} />
              <Route path="/tenant/accept-invite/:token" element={<AcceptTenantInvite />} />

              {/* Authenticated dashboard routes with sidebar */}
              <Route element={<ProtectedDashboard />}>
                <Route path="/inbox" element={<Inbox />} />
                <Route path="/dashboard" element={<LandlordOnly><Dashboard /></LandlordOnly>} />
                <Route path="/outreach" element={<LandlordOnly><SaasGate><OutreachCRM /></SaasGate></LandlordOnly>} />
                <Route path="/p8" element={<LandlordOnly><SaasGate><P8Dashboard /></SaasGate></LandlordOnly>} />
                <Route path="/tenants" element={<LandlordOnly><Tenants /></LandlordOnly>} />
                <Route path="/forms" element={<LandlordOnly><SaasGate><RentalForms /></SaasGate></LandlordOnly>} />
                <Route path="/invoices" element={<LandlordOnly><Invoices /></LandlordOnly>} />
                <Route path="/inspections" element={<LandlordOnly><SaasGate><Inspections /></SaasGate></LandlordOnly>} />
                <Route path="/inspections/new" element={<LandlordOnly><SaasGate><NewInspection /></SaasGate></LandlordOnly>} />
                <Route path="/inspections/:id" element={<LandlordOnly><SaasGate><InspectionReport /></SaasGate></LandlordOnly>} />
                <Route path="/inspections/:id/compare" element={<LandlordOnly><SaasGate><InspectionCompare /></SaasGate></LandlordOnly>} />
                <Route path="/maintenance" element={<LandlordOnly><MaintenanceDashboard /></LandlordOnly>} />
                <Route path="/add-property" element={<LandlordOnly><AddProperty /></LandlordOnly>} />
                <Route path="/import-listing" element={<LandlordOnly><ImportListing /></LandlordOnly>} />
                <Route path="/blog/new" element={<LandlordOnly><SaasGate><BlogEditor /></SaasGate></LandlordOnly>} />
                <Route path="/admin" element={<LandlordOnly><AdminDashboard /></LandlordOnly>} />
                <Route path="/capture-pages" element={<LandlordOnly><SaasGate><CapturePages /></SaasGate></LandlordOnly>} />
                <Route path="/rent-collection" element={<LandlordOnly><SaasGate><RentCollection /></SaasGate></LandlordOnly>} />
              </Route>

              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </ListingsProvider>
      </AuthProvider>
    </TooltipProvider>
  </QueryClientProvider>
  </HelmetProvider>
);

export default App;
