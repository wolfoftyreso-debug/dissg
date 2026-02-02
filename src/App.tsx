import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ThemeProvider } from "next-themes";
import { AuthProvider } from "@/contexts/AuthContext";
import { ProtectedRoute } from "@/components/auth/ProtectedRoute";
import Index from "./pages/Index";
import PublicDashboard from "./pages/PublicDashboard";
import GlobalCompact from "./pages/GlobalCompact";
import GlobalMasterIndex from "./pages/GlobalMasterIndex";
import Admin from "./pages/Admin";
import PublicProfiles from "./pages/PublicProfiles";
import ProfileDemo from "./pages/ProfileDemo";
import DepthDemo from "./pages/DepthDemo";
import EuDashboardPage from "./pages/EuDashboard";
import WrappedDemo from "./pages/WrappedDemo";
import ApiLicensingPage from "./pages/ApiLicensing";
import AboutSystem from "./pages/AboutSystem";
import RegionalView from "./pages/RegionalView";
import DecisionTimeline from "./pages/DecisionTimeline";
import Settings from "./pages/Settings";
import Login from "./pages/Login";
import Register from "./pages/Register";
import NotFound from "./pages/NotFound";
import ConceptDemo from "./pages/ConceptDemo";
import CanvasDemo from "./pages/CanvasDemo";
import LearningPaths from "./pages/LearningPaths";
import StoriesDemo from "./pages/StoriesDemo";
import ResilienceDemo from "./pages/ResilienceDemo";
import InsightBuilderDemo from "./pages/InsightBuilderDemo";
import CollectiveLearningDemo from "./pages/CollectiveLearningDemo";
import MisuseDetectionDemo from "./pages/MisuseDetectionDemo";
import SystemMemoryDemo from "./pages/SystemMemoryDemo";
import CognitiveBiasDemo from "./pages/CognitiveBiasDemo";
import HumanViabilityDemo from "./pages/HumanViabilityDemo";
import PerspectiveDemo from "./pages/PerspectiveDemo";
import ClarityDemo from "./pages/ClarityDemo";
import DemographyDemo from "./pages/DemographyDemo";
import SwedenDashboard from "./pages/SwedenDashboard";
import ScenarioDemo from "./pages/ScenarioDemo";
import CapacityDemo from "./pages/CapacityDemo";
import FairnessDemo from "./pages/FairnessDemo";
import CivilizationDemo from "./pages/CivilizationDemo";
import GlobalMapDemo from "./pages/GlobalMapDemo";
import ExplainDemo from "./pages/ExplainDemo";
import GlobalRealityDemo from "./pages/GlobalRealityDemo";
import IndexEngineDemo from "./pages/IndexEngineDemo";
import CorrelationDemo from "./pages/CorrelationDemo";
import SmokeTestPage from "./pages/SmokeTest";
import TrustLogPage from "./pages/TrustLogPage";
import CharterPage from "./pages/CharterPage";
import GovernancePage from "./pages/GovernancePage";
import EvidenceRequirementPage from "./pages/EvidenceRequirementPage";
import EvidenceMechanismPage from "./pages/EvidenceMechanismPage";
import BigQuestionsPage from "./pages/BigQuestionsPage";
import BigQuestionDetailPage from "./pages/BigQuestionDetailPage";
import AIGroundingPage from "./pages/AIGroundingPage";
import RealityCheckDemo from "./pages/RealityCheckDemo";
import OnboardingPage from "./pages/OnboardingPage";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
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
              <Route path="/regional" element={<RegionalView />} />
              <Route path="/decisions" element={<DecisionTimeline />} />
              <Route path="/compact" element={<GlobalCompact />} />
              <Route path="/api-policy" element={<ApiLicensingPage />} />
              <Route path="/gmi" element={<GlobalMasterIndex />} />
              <Route path="/profiles" element={<PublicProfiles />} />
              <Route path="/profile-demo" element={<ProfileDemo />} />
              <Route path="/wrapped" element={<WrappedDemo />} />
              <Route path="/eu" element={<EuDashboardPage />} />
              <Route path="/om" element={<AboutSystem />} />
              <Route path="/settings" element={<Settings />} />
              <Route path="/demo" element={<ConceptDemo />} />
              <Route path="/canvas" element={<CanvasDemo />} />
              <Route path="/learn" element={<LearningPaths />} />
              <Route path="/stories" element={<StoriesDemo />} />
              <Route path="/resilience" element={<ResilienceDemo />} />
              <Route path="/insights" element={<InsightBuilderDemo />} />
              <Route path="/collective-learning" element={<CollectiveLearningDemo />} />
              <Route path="/misuse-detection" element={<MisuseDetectionDemo />} />
              <Route path="/system-memory" element={<SystemMemoryDemo />} />
              <Route path="/cognitive-bias" element={<CognitiveBiasDemo />} />
              <Route path="/viability" element={<HumanViabilityDemo />} />
              <Route path="/perspective" element={<PerspectiveDemo />} />
              <Route path="/clarity" element={<ClarityDemo />} />
              <Route path="/demography" element={<DemographyDemo />} />
              <Route path="/sweden" element={<SwedenDashboard />} />
              <Route path="/scenario" element={<ScenarioDemo />} />
              <Route path="/capacity" element={<CapacityDemo />} />
              <Route path="/fairness" element={<FairnessDemo />} />
              <Route path="/civilization" element={<CivilizationDemo />} />
              <Route path="/map" element={<GlobalMapDemo />} />
              <Route path="/explain" element={<ExplainDemo />} />
              <Route path="/reality" element={<GlobalRealityDemo />} />
              <Route path="/indices" element={<IndexEngineDemo />} />
              <Route path="/correlation" element={<CorrelationDemo />} />
              <Route path="/smoke-test" element={<SmokeTestPage />} />
              <Route path="/trust-log" element={<TrustLogPage />} />
              <Route path="/charter" element={<CharterPage />} />
              <Route path="/governance" element={<GovernancePage />} />
              <Route path="/evidence" element={<EvidenceRequirementPage />} />
              <Route path="/mechanism" element={<EvidenceMechanismPage />} />
              <Route path="/big-questions" element={<BigQuestionsPage />} />
              <Route path="/big-questions/:code" element={<BigQuestionDetailPage />} />
              <Route path="/ai/grounding" element={<AIGroundingPage />} />
              <Route path="/reality-check" element={<RealityCheckDemo />} />
              <Route path="/onboarding" element={<OnboardingPage />} />
              <Route path="/" element={
                <ProtectedRoute>
                  <Index />
                </ProtectedRoute>
              } />
              {/* Skyddade routes - kräver inloggning */}
              <Route path="/depth-demo" element={
                <ProtectedRoute requiredRole="operativ">
                  <DepthDemo />
                </ProtectedRoute>
              } />
              
              {/* Admin - kräver Statsminister */}
              <Route path="/admin" element={
                <ProtectedRoute requiredRole="statsminister">
                  <Admin />
                </ProtectedRoute>
              } />
              
              {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </TooltipProvider>
      </AuthProvider>
    </ThemeProvider>
  </QueryClientProvider>
);

export default App;
