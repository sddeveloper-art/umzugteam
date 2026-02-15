import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { HelmetProvider } from "react-helmet-async";
import { I18nProvider } from "@/hooks/useI18n";
import ErrorBoundary from "@/components/ErrorBoundary";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import Admin from "./pages/Admin";
import PriceComparison from "./pages/PriceComparison";
import Announcements from "./pages/Announcements";
import RouteMap from "./pages/RouteMap";
import DetailedCalculator from "./pages/DetailedCalculator";
import Preise from "./pages/Preise";
import About from "./pages/About";
import Gallery from "./pages/Gallery";
import Checklist from "./pages/Checklist";
import Blog from "./pages/Blog";
import CityLanding from "./pages/CityLanding";
import Auth from "./pages/Auth";
import Dashboard from "./pages/Dashboard";
import Reviews from "./pages/Reviews";
import BundeslandLanding from "./pages/BundeslandLanding";
import BundeslaenderIndex from "./pages/BundeslaenderIndex";
import ChatBot from "./components/ChatBot";

const queryClient = new QueryClient();

const App = () => (
  <HelmetProvider>
    <I18nProvider>
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <ErrorBoundary>
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/admin" element={<Admin />} />
              <Route path="/preisvergleich" element={<PriceComparison />} />
              <Route path="/anfragen" element={<Announcements />} />
              <Route path="/trajet" element={<RouteMap />} />
              <Route path="/preisrechner" element={<DetailedCalculator />} />
              <Route path="/preise" element={<Preise />} />
              <Route path="/ueber-uns" element={<About />} />
              <Route path="/galerie" element={<Gallery />} />
              <Route path="/checkliste" element={<Checklist />} />
              <Route path="/blog" element={<Blog />} />
              <Route path="/umzug/:city" element={<CityLanding />} />
              <Route path="/auth" element={<Auth />} />
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/bewertungen" element={<Reviews />} />
              <Route path="/bundeslaender" element={<BundeslaenderIndex />} />
              <Route path="/bundesland/:land" element={<BundeslandLanding />} />
              {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
              <Route path="*" element={<NotFound />} />
            </Routes>
            <ChatBot />
          </BrowserRouter>
        </ErrorBoundary>
      </TooltipProvider>
    </QueryClientProvider>
    </I18nProvider>
  </HelmetProvider>
);

export default App;
