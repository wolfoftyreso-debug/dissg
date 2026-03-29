import { lazy, Suspense } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ThemeProvider } from "next-themes";
import { HelmetProvider } from "react-helmet-async";
import { AuthProvider } from "@/contexts/AuthContext";
import { GeoProvider } from "@/contexts/GeoContext";
import { ProtectedRoute } from "@/components/auth/ProtectedRoute";
import { SpotlessProvider } from "@/context/SpotlessContext";
import { InfiniteDepthProvider, DepthExplorer } from "@/components/data";
import { TruthLayerProvider } from "@/components/truth";
import { AppLayout } from "@/components/layout/AppLayout";

// ─── Eager-loaded (critical path — always in main bundle) ───────────────────
import Index from "./pages/Index";
import Login from "./pages/Login";
import Register from "./pages/Register";
import NotFound from "./pages/NotFound";
import AboutSystem from "./pages/AboutSystem";
import GlobalIndex from "./pages/GlobalIndex";
import CountryExplorer from "./pages/CountryExplorer";

// ─── Lazy-loaded (code-split per route) ─────────────────────────────────────
const PublicDashboard = lazy(() => import("./pages/PublicDashboard"));
const GlobalCompact = lazy(() => import("./pages/GlobalCompact"));
const GlobalMasterIndex = lazy(() => import("./pages/GlobalMasterIndex"));
const Admin = lazy(() => import("./pages/Admin"));
const PublicProfiles = lazy(() => import("./pages/PublicProfiles"));
const ProfileDemo = lazy(() => import("./pages/ProfileDemo"));
const DepthDemo = lazy(() => import("./pages/DepthDemo"));
const EuDashboardPage = lazy(() => import("./pages/EuDashboard"));
const WrappedDemo = lazy(() => import("./pages/WrappedDemo"));
const ApiLicensingPage = lazy(() => import("./pages/ApiLicensing"));
const RegionalView = lazy(() => import("./pages/RegionalView"));
const DecisionTimeline = lazy(() => import("./pages/DecisionTimeline"));
const Settings = lazy(() => import("./pages/Settings"));
// ConceptDemo removed — was demo-only mockdata (see produktionslås)
const CanvasDemo = lazy(() => import("./pages/CanvasDemo"));
const LearningPaths = lazy(() => import("./pages/LearningPaths"));
const StoriesDemo = lazy(() => import("./pages/StoriesDemo"));
const ResilienceDemo = lazy(() => import("./pages/ResilienceDemo"));
const InsightBuilderDemo = lazy(() => import("./pages/InsightBuilderDemo"));
const CollectiveLearningDemo = lazy(() => import("./pages/CollectiveLearningDemo"));
const MisuseDetectionDemo = lazy(() => import("./pages/MisuseDetectionDemo"));
const SystemMemoryDemo = lazy(() => import("./pages/SystemMemoryDemo"));
const CognitiveBiasDemo = lazy(() => import("./pages/CognitiveBiasDemo"));
const HumanViabilityDemo = lazy(() => import("./pages/HumanViabilityDemo"));
const PerspectiveDemo = lazy(() => import("./pages/PerspectiveDemo"));
const ClarityDemo = lazy(() => import("./pages/ClarityDemo"));
const DemographyDemo = lazy(() => import("./pages/DemographyDemo"));
const SwedenDashboard = lazy(() => import("./pages/SwedenDashboard"));
const ScenarioDemo = lazy(() => import("./pages/ScenarioDemo"));
const CapacityDemo = lazy(() => import("./pages/CapacityDemo"));
const FairnessDemo = lazy(() => import("./pages/FairnessDemo"));
const CivilizationDemo = lazy(() => import("./pages/CivilizationDemo"));
const GlobalMapDemo = lazy(() => import("./pages/GlobalMapDemo"));
const ExplainDemo = lazy(() => import("./pages/ExplainDemo"));
const GlobalRealityDemo = lazy(() => import("./pages/GlobalRealityDemo"));
const IndexEngineDemo = lazy(() => import("./pages/IndexEngineDemo"));
const CorrelationDemo = lazy(() => import("./pages/CorrelationDemo"));
const SmokeTestPage = lazy(() => import("./pages/SmokeTest"));
const TrustLogPage = lazy(() => import("./pages/TrustLogPage"));
const CharterPage = lazy(() => import("./pages/CharterPage"));
const GovernancePage = lazy(() => import("./pages/GovernancePage"));
const EvidenceRequirementPage = lazy(() => import("./pages/EvidenceRequirementPage"));
const EvidenceMechanismPage = lazy(() => import("./pages/EvidenceMechanismPage"));
const BigQuestionsPage = lazy(() => import("./pages/BigQuestionsPage"));
const BigQuestionDetailPage = lazy(() => import("./pages/BigQuestionDetailPage"));
const AIGroundingPage = lazy(() => import("./pages/AIGroundingPage"));
const RealityCheckDemo = lazy(() => import("./pages/RealityCheckDemo"));
const OnboardingPage = lazy(() => import("./pages/OnboardingPage"));
const SpotlessPage = lazy(() => import("./pages/SpotlessPage"));
const PrioritizedPage = lazy(() => import("./pages/PrioritizedPage"));
const RealityIndex = lazy(() => import("./pages/RealityIndex"));
const CityNodes = lazy(() => import("./pages/CityNodes"));
const CityNode = lazy(() => import("./pages/CityNode"));
const CitationAPI = lazy(() => import("./pages/CitationAPI"));
const AIDiscovery = lazy(() => import("./pages/AIDiscovery"));
const HistoricalReplay = lazy(() => import("./pages/HistoricalReplay"));
const AIAdoption = lazy(() => import("./pages/AIAdoption"));
const CQAIS = lazy(() => import("./pages/CQAIS"));
const Lambda = lazy(() => import("./pages/Lambda"));
const InfiniteDepthDemo = lazy(() => import("./pages/InfiniteDepthDemo"));
const RelevanceWeightManager = lazy(() => import("./pages/RelevanceWeightManager"));
const OscilloscopeViewPage = lazy(() => import("./pages/OscilloscopeViewPage"));
const GmiWeightEditor = lazy(() => import("./pages/GmiWeightEditor"));
const SystemAuditPage = lazy(() => import("./pages/SystemAudit"));
const FaultCodesPage = lazy(() => import("./pages/FaultCodes"));
const DiagnosticsPage = lazy(() => import("./pages/Diagnostics"));
const AIGovernancePage = lazy(() => import("./pages/AIGovernance"));
const SelfTestPage = lazy(() => import("./pages/SelfTest"));
const SelfAuditPage = lazy(() => import("./pages/SelfAudit"));
const GEDIPage = lazy(() => import("./pages/GEDI"));
const Lambda1Page = lazy(() => import("./pages/Lambda1"));
const GDMPage = lazy(() => import("./pages/GDM"));
const GGDPage = lazy(() => import("./pages/GGD"));
const WagesPage = lazy(() => import("./pages/WagesPage"));
const IndicatorExplorer = lazy(() => import("./pages/IndicatorExplorer"));
const IndexPage = lazy(() => import("./pages/IndexPage"));
const SystemLog = lazy(() => import("./pages/SystemLog"));
const DataPage = lazy(() => import("./pages/DataPage"));
const Extras = lazy(() => import("./pages/Extras"));
const Help = lazy(() => import("./pages/Help"));
const DemocraticHealth = lazy(() => import("./pages/DemocraticHealth"));
const BudgetPage = lazy(() => import("./pages/BudgetPage"));
const PortfolioPage = lazy(() => import("./pages/PortfolioPage"));
const EducationPage = lazy(() => import("./pages/EducationPage"));
const DecisionDemo = lazy(() => import("./pages/DecisionDemo"));
const IndexBoards = lazy(() => import("./pages/IndexBoards"));
const QuestionFirst = lazy(() => import("./pages/QuestionFirst"));
const GDGSpec = lazy(() => import("./pages/GDGSpec"));
const Methodology = lazy(() => import("./pages/Methodology"));
const WhatWeDoNot = lazy(() => import("./pages/WhatWeDoNot"));
const Validator = lazy(() => import("./pages/Validator"));
const ReportsPage = lazy(() => import("./pages/Reports"));
const ReportPage = lazy(() => import("./pages/Report"));
const QuestionPage = lazy(() => import("./pages/QuestionPage"));
const OracleStressTestPage = lazy(() => import("./pages/OracleStressTest"));
const AccountabilityPage = lazy(() => import("./pages/Accountability"));
const CalibrationPage = lazy(() => import("./pages/Calibration"));
const CausalDAGPage = lazy(() => import("./pages/CausalDAG"));
const KnowledgeModulesPage = lazy(() => import("./pages/KnowledgeModules"));
const UCEPage = lazy(() => import("./pages/UCEPage"));
const MetaLayerPage = lazy(() => import("./pages/MetaLayerPage"));
const GRMPage = lazy(() => import("./pages/GRMPage"));
const OCAPage = lazy(() => import("./pages/OCAPage"));
const AKBPage = lazy(() => import("./pages/AKBPage"));
const GDISPage = lazy(() => import("./pages/GDISPage"));
const GSSEPage = lazy(() => import("./pages/GSSEPage"));

// ─── Loading fallback ────────────────────────────────────────────────────────
const PageLoader = () => (
  <div className="flex items-center justify-center min-h-screen bg-background">
    <div className="flex flex-col items-center gap-3 text-muted-foreground">
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
      <span className="text-sm">Laddar...</span>
    </div>
  </div>
);

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
      <HelmetProvider>
        <AuthProvider>
          <GeoProvider>
            <SpotlessProvider>
              <InfiniteDepthProvider>
                <TruthLayerProvider>
                  <TooltipProvider>
                    <Toaster />
                    <Sonner />
                    <DepthExplorer />
                    <BrowserRouter>
                      <Suspense fallback={<PageLoader />}>
                        <Routes>
                          {/* Auth routes - utan layout */}
                          <Route path="/login" element={<Login />} />
                          <Route path="/register" element={<Register />} />

                          {/* Landningssida - ingen sidebar */}
                          <Route path="/" element={<Index />} />

                          {/* Routes med global layout (sidebar + breadcrumbs) */}
                          <Route element={<AppLayout />}>
                            {/* GDM - Global Diagnostic Map */}
                            <Route path="/gdm" element={<GDMPage />} />
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
                            {/* /demo route removed — ConceptDemo was demo-only mockdata */}
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
                            <Route path="/index" element={<IndexPage />} />
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
                            <Route path="/spotless" element={<SpotlessPage />} />
                            <Route path="/prioritized" element={<PrioritizedPage />} />
                            <Route path="/reality-index" element={<RealityIndex />} />
                            <Route path="/cities" element={<CityNodes />} />
                            <Route path="/city" element={<CityNode />} />
                            <Route path="/cite" element={<CitationAPI />} />
                            <Route path="/ai-discovery" element={<AIDiscovery />} />
                            <Route path="/replay" element={<HistoricalReplay />} />
                            <Route path="/ai-adoption" element={<AIAdoption />} />
                            <Route path="/cqais" element={<CQAIS />} />
                            <Route path="/lambda" element={<Lambda />} />
                            <Route path="/depth" element={<InfiniteDepthDemo />} />
                            <Route path="/relevance-weight-manager" element={<RelevanceWeightManager />} />
                            <Route path="/oscilloscope-view" element={<OscilloscopeViewPage />} />
                            <Route path="/gmi-weight-editor" element={<GmiWeightEditor />} />
                            <Route path="/system-audit" element={<SystemAuditPage />} />
                            <Route path="/fault-codes" element={<FaultCodesPage />} />
                            <Route path="/diagnostics" element={<DiagnosticsPage />} />
                            <Route path="/ai-governance" element={<AIGovernancePage />} />
                            <Route path="/self-test" element={<SelfTestPage />} />
                            <Route path="/self-audit" element={<SelfAuditPage />} />
                            <Route path="/gedi" element={<GEDIPage />} />
                            <Route path="/lambda1" element={<Lambda1Page />} />
                            <Route path="/ggd" element={<GGDPage />} />
                            <Route path="/wages" element={<WagesPage />} />
                            <Route path="/country/:code" element={<CountryExplorer />} />
                            <Route path="/indicator/:code" element={<IndicatorExplorer />} />
                            <Route path="/log" element={<SystemLog />} />
                            <Route path="/data" element={<DataPage />} />
                            <Route path="/extras" element={<Extras />} />
                            <Route path="/help" element={<Help />} />
                            <Route path="/democratic-health" element={<DemocraticHealth />} />
                            <Route path="/budget" element={<BudgetPage />} />
                            <Route path="/portfolio" element={<PortfolioPage />} />
                            <Route path="/education" element={<EducationPage />} />
                            <Route path="/decision" element={<DecisionDemo />} />
                            <Route path="/index-boards" element={<IndexBoards />} />
                            <Route path="/ask" element={<QuestionFirst />} />
                            <Route path="/gdg" element={<GDGSpec />} />
                            <Route path="/methodology" element={<Methodology />} />
                            <Route path="/what-we-do-not" element={<WhatWeDoNot />} />
                            <Route path="/validator" element={<Validator />} />
                            <Route path="/reports" element={<ReportsPage />} />
                            <Route path="/report/:slug" element={<ReportPage />} />
                            <Route path="/global-index" element={<GlobalIndex />} />
                            <Route path="/index/questions/:questionId" element={<QuestionPage />} />
                            <Route path="/oracle-stress-test" element={<OracleStressTestPage />} />
                            <Route path="/accountability" element={<AccountabilityPage />} />
                            <Route path="/calibration" element={<CalibrationPage />} />
                            <Route path="/causal-dag" element={<CausalDAGPage />} />
                            <Route path="/knowledge-modules" element={<KnowledgeModulesPage />} />
                            <Route path="/uce" element={<UCEPage />} />
                            <Route path="/meta-layer" element={<MetaLayerPage />} />
                            <Route path="/grm" element={<GRMPage />} />
                            <Route path="/ontology-core" element={<OCAPage />} />
                            <Route path="/akb" element={<AKBPage />} />
                            <Route path="/gdis" element={<GDISPage />} />
                            <Route path="/gsse" element={<GSSEPage />} />

                            {/* Skyddade routes - kräver inloggning */}
                            <Route
                              path="/depth-demo"
                              element={
                                <ProtectedRoute requiredRole="operativ">
                                  <DepthDemo />
                                </ProtectedRoute>
                              }
                            />

                            {/* Admin - kräver Statsminister */}
                            <Route
                              path="/admin"
                              element={
                                <ProtectedRoute requiredRole="statsminister">
                                  <Admin />
                                </ProtectedRoute>
                              }
                            />
                          </Route>

                          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
                          <Route path="*" element={<NotFound />} />
                        </Routes>
                      </Suspense>
                    </BrowserRouter>
                  </TooltipProvider>
                </TruthLayerProvider>
              </InfiniteDepthProvider>
            </SpotlessProvider>
          </GeoProvider>
        </AuthProvider>
      </HelmetProvider>
    </ThemeProvider>
  </QueryClientProvider>
);

export default App;
