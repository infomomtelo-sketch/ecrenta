import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { ListingsProvider } from "@/contexts/ListingsContext";
import Listings from "./pages/Listings";
import ListingDetail from "./pages/ListingDetail";
import Inbox from "./pages/Inbox";
import AddProperty from "./pages/AddProperty";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <ListingsProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Listings />} />
            <Route path="/listing/:id" element={<ListingDetail />} />
            <Route path="/inbox" element={<Inbox />} />
            <Route path="/add-property" element={<AddProperty />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </ListingsProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
