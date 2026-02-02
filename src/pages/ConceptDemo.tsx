import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  LogIn, LayoutDashboard, TrendingUp, AlertTriangle, 
  CheckCircle2, ArrowRight, ArrowLeft, Target, FileText,
  BarChart3, Users, Calendar, Bell, Zap, Eye, ThumbsUp,
  Clock, Activity, Globe, Shield, Sparkles
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

type DemoStep = 'login' | 'dashboard' | 'explore' | 'alert' | 'decision' | 'followup';

const STEPS: { id: DemoStep; label: string; icon: React.ReactNode }[] = [
  { id: 'login', label: 'Inloggning', icon: <LogIn className="h-4 w-4" /> },
  { id: 'dashboard', label: 'Översikt', icon: <LayoutDashboard className="h-4 w-4" /> },
  { id: 'explore', label: 'Utforska', icon: <TrendingUp className="h-4 w-4" /> },
  { id: 'alert', label: 'Signal', icon: <AlertTriangle className="h-4 w-4" /> },
  { id: 'decision', label: 'Beslut', icon: <Target className="h-4 w-4" /> },
  { id: 'followup', label: 'Uppföljning', icon: <CheckCircle2 className="h-4 w-4" /> },
];

export default function ConceptDemo() {
  const [currentStep, setCurrentStep] = useState<DemoStep>('login');
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const currentIndex = STEPS.findIndex(s => s.id === currentStep);

  const goNext = () => {
    if (currentIndex < STEPS.length - 1) {
      setCurrentStep(STEPS[currentIndex + 1].id);
    }
  };

  const goPrev = () => {
    if (currentIndex > 0) {
      setCurrentStep(STEPS[currentIndex - 1].id);
    }
  };

  const handleLogin = () => {
    setIsLoggedIn(true);
    setTimeout(() => setCurrentStep('dashboard'), 500);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20">
      {/* Header */}
      <header className="border-b bg-background/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-primary to-primary/60 flex items-center justify-center">
              <Globe className="h-5 w-5 text-primary-foreground" />
            </div>
            <div>
              <h1 className="font-bold text-lg">Infinity Analytics</h1>
              <p className="text-xs text-muted-foreground">Konceptuell Demo</p>
            </div>
          </div>
          
          {/* Progress Steps */}
          <div className="hidden md:flex items-center gap-2">
            {STEPS.map((step, idx) => (
              <button
                key={step.id}
                onClick={() => setCurrentStep(step.id)}
                className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-sm transition-all ${
                  currentStep === step.id 
                    ? 'bg-primary text-primary-foreground' 
                    : idx < currentIndex
                    ? 'bg-primary/20 text-primary'
                    : 'bg-muted text-muted-foreground'
                }`}
              >
                {step.icon}
                <span className="hidden lg:inline">{step.label}</span>
              </button>
            ))}
          </div>

          <div className="flex items-center gap-2">
            <Badge variant="outline" className="gap-1">
              <Sparkles className="h-3 w-3" />
              Demo Mode
            </Badge>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        <AnimatePresence mode="wait">
          {currentStep === 'login' && (
            <LoginStep key="login" onLogin={handleLogin} isLoggedIn={isLoggedIn} />
          )}
          {currentStep === 'dashboard' && (
            <DashboardStep key="dashboard" />
          )}
          {currentStep === 'explore' && (
            <ExploreStep key="explore" />
          )}
          {currentStep === 'alert' && (
            <AlertStep key="alert" />
          )}
          {currentStep === 'decision' && (
            <DecisionStep key="decision" />
          )}
          {currentStep === 'followup' && (
            <FollowupStep key="followup" />
          )}
        </AnimatePresence>

        {/* Navigation */}
        <div className="flex justify-between items-center mt-8 pt-8 border-t">
          <Button 
            variant="outline" 
            onClick={goPrev}
            disabled={currentIndex === 0}
            className="gap-2"
          >
            <ArrowLeft className="h-4 w-4" />
            Föregående
          </Button>
          
          <div className="flex items-center gap-2">
            {STEPS.map((_, idx) => (
              <div
                key={idx}
                className={`h-2 w-2 rounded-full transition-all ${
                  idx === currentIndex ? 'bg-primary w-6' : idx < currentIndex ? 'bg-primary/50' : 'bg-muted'
                }`}
              />
            ))}
          </div>

          <Button 
            onClick={goNext}
            disabled={currentIndex === STEPS.length - 1}
            className="gap-2"
          >
            Nästa
            <ArrowRight className="h-4 w-4" />
          </Button>
        </div>
      </main>
    </div>
  );
}

// Step Components
function LoginStep({ onLogin, isLoggedIn }: { onLogin: () => void; isLoggedIn: boolean }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="max-w-md mx-auto"
    >
      <Card className="border-2">
        <CardHeader className="text-center">
          <div className="mx-auto h-16 w-16 rounded-2xl bg-gradient-to-br from-primary to-primary/60 flex items-center justify-center mb-4">
            <Shield className="h-8 w-8 text-primary-foreground" />
          </div>
          <CardTitle className="text-2xl">Välkommen tillbaka</CardTitle>
          <CardDescription>
            Logga in för att få tillgång till dina dashboards och analyser
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">E-post</label>
            <Input type="email" placeholder="namn@organisation.se" defaultValue="anna.andersson@kommun.se" />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">Lösenord</label>
            <Input type="password" placeholder="••••••••" defaultValue="password123" />
          </div>
          
          <Button 
            className="w-full gap-2" 
            size="lg"
            onClick={onLogin}
            disabled={isLoggedIn}
          >
            {isLoggedIn ? (
              <>
                <CheckCircle2 className="h-4 w-4" />
                Inloggad!
              </>
            ) : (
              <>
                <LogIn className="h-4 w-4" />
                Logga in
              </>
            )}
          </Button>

          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-card px-2 text-muted-foreground">Eller fortsätt med</span>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <Button variant="outline" className="gap-2">
              <svg className="h-4 w-4" viewBox="0 0 24 24"><path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/><path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/><path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/><path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/></svg>
              Google
            </Button>
            <Button variant="outline" className="gap-2">
              <svg className="h-4 w-4" viewBox="0 0 24 24"><path fill="currentColor" d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0 0 24 12c0-6.63-5.37-12-12-12z"/></svg>
              Microsoft
            </Button>
          </div>
        </CardContent>
      </Card>

      <div className="mt-6 text-center text-sm text-muted-foreground">
        <p>Demo-konto förifyllt. Klicka "Logga in" för att fortsätta.</p>
      </div>
    </motion.div>
  );
}

function DashboardStep() {
  const criticalKPIs = [
    { name: "Arbetslöshet 15-24 år", value: "24.3%", change: "+2.1%", trend: "negative", region: "Malmö" },
    { name: "Väntetid akutsjukvård", value: "4.2h", change: "+45min", trend: "negative", region: "Stockholm" },
    { name: "Bostadsbyggande", value: "-18%", change: "-5%", trend: "negative", region: "Göteborg" },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="space-y-6"
    >
      {/* Welcome Banner */}
      <Card className="bg-gradient-to-r from-primary/10 via-primary/5 to-transparent border-primary/20">
        <CardContent className="flex items-center justify-between p-6">
          <div>
            <h2 className="text-2xl font-bold">God morgon, Anna</h2>
            <p className="text-muted-foreground">3 kritiska signaler kräver din uppmärksamhet idag</p>
          </div>
          <div className="flex gap-3">
            <Button variant="outline" className="gap-2">
              <Bell className="h-4 w-4" />
              <Badge variant="destructive" className="h-5 w-5 p-0 flex items-center justify-center text-[10px]">3</Badge>
            </Button>
            <Button className="gap-2">
              <Zap className="h-4 w-4" />
              Prioriterad vy
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Stats Row */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {[
          { label: "Övervakade KPI:er", value: "847", icon: BarChart3, color: "text-blue-500" },
          { label: "Aktiva signaler", value: "12", icon: AlertTriangle, color: "text-amber-500" },
          { label: "Pågående beslut", value: "5", icon: Target, color: "text-purple-500" },
          { label: "Datakällor online", value: "156/158", icon: Activity, color: "text-green-500" },
        ].map((stat, i) => (
          <Card key={i}>
            <CardContent className="flex items-center gap-4 p-4">
              <div className={`h-10 w-10 rounded-lg bg-muted flex items-center justify-center ${stat.color}`}>
                <stat.icon className="h-5 w-5" />
              </div>
              <div>
                <p className="text-2xl font-bold">{stat.value}</p>
                <p className="text-xs text-muted-foreground">{stat.label}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Critical Signals */}
      <Card className="border-destructive/30">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-destructive" />
              <CardTitle>Kritiska signaler</CardTitle>
            </div>
            <Button variant="ghost" size="sm">Visa alla →</Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-3">
          {criticalKPIs.map((kpi, i) => (
            <div key={i} className="flex items-center justify-between p-3 rounded-lg bg-destructive/5 border border-destructive/20">
              <div className="flex items-center gap-3">
                <div className="h-8 w-8 rounded-full bg-destructive/20 flex items-center justify-center">
                  <TrendingUp className="h-4 w-4 text-destructive rotate-180" />
                </div>
                <div>
                  <p className="font-medium">{kpi.name}</p>
                  <p className="text-xs text-muted-foreground">{kpi.region}</p>
                </div>
              </div>
              <div className="text-right">
                <p className="font-bold">{kpi.value}</p>
                <p className="text-xs text-destructive">{kpi.change}</p>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Recent Activity */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="h-5 w-5" />
              Senaste uppdateringar
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {[
              { time: "09:15", text: "SCB publicerade Q4 arbetslöshetsdata" },
              { time: "08:45", text: "Ny observation: Bostadsmarknaden Sthlm" },
              { time: "08:30", text: "Eurostat-uppdatering inläst (142 KPI)" },
              { time: "07:00", text: "Daglig prioriteringsanalys klar" },
            ].map((item, i) => (
              <div key={i} className="flex items-center gap-3 text-sm">
                <span className="text-muted-foreground w-12">{item.time}</span>
                <span>{item.text}</span>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5" />
              Teamaktivitet
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {[
              { user: "Erik J.", action: "skapade beslut", target: "Ungdomsarbetslöshet" },
              { user: "Maria L.", action: "kommenterade", target: "Vårdberedskap" },
              { user: "Johan S.", action: "stängde uppföljning", target: "Skolresultat" },
              { user: "Anna A.", action: "prenumererar på", target: "Bostadsindex" },
            ].map((item, i) => (
              <div key={i} className="flex items-center gap-2 text-sm">
                <div className="h-6 w-6 rounded-full bg-primary/20 flex items-center justify-center text-xs font-medium">
                  {item.user.charAt(0)}
                </div>
                <span className="font-medium">{item.user}</span>
                <span className="text-muted-foreground">{item.action}</span>
                <span className="text-primary">{item.target}</span>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </motion.div>
  );
}

function ExploreStep() {
  const mockData = [
    { period: "2023-Q1", value: 18.2 },
    { period: "2023-Q2", value: 19.1 },
    { period: "2023-Q3", value: 20.4 },
    { period: "2023-Q4", value: 21.8 },
    { period: "2024-Q1", value: 22.9 },
    { period: "2024-Q2", value: 23.5 },
    { period: "2024-Q3", value: 24.3 },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="space-y-6"
    >
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Utforska: Ungdomsarbetslöshet</h2>
          <p className="text-muted-foreground">Detaljerad analys av KPI med historik och korrelationer</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" className="gap-2">
            <FileText className="h-4 w-4" />
            Exportera
          </Button>
          <Button variant="outline" className="gap-2">
            <Bell className="h-4 w-4" />
            Prenumerera
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Chart */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Historisk utveckling</CardTitle>
              <Tabs defaultValue="1y">
                <TabsList>
                  <TabsTrigger value="6m">6M</TabsTrigger>
                  <TabsTrigger value="1y">1Å</TabsTrigger>
                  <TabsTrigger value="5y">5Å</TabsTrigger>
                  <TabsTrigger value="max">Max</TabsTrigger>
                </TabsList>
              </Tabs>
            </div>
          </CardHeader>
          <CardContent>
            {/* Simple SVG Chart Visualization */}
            <div className="h-64 relative">
              <svg className="w-full h-full" viewBox="0 0 400 200">
                {/* Grid lines */}
                {[0, 50, 100, 150, 200].map((y) => (
                  <line key={y} x1="0" y1={y} x2="400" y2={y} stroke="currentColor" strokeOpacity="0.1" />
                ))}
                
                {/* Area gradient */}
                <defs>
                  <linearGradient id="areaGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                    <stop offset="0%" stopColor="hsl(var(--destructive))" stopOpacity="0.3" />
                    <stop offset="100%" stopColor="hsl(var(--destructive))" stopOpacity="0" />
                  </linearGradient>
                </defs>
                
                {/* Area */}
                <path
                  d={`M 0 ${200 - mockData[0].value * 6} ${mockData.map((d, i) => `L ${i * 66} ${200 - d.value * 6}`).join(' ')} L ${(mockData.length - 1) * 66} 200 L 0 200 Z`}
                  fill="url(#areaGradient)"
                />
                
                {/* Line */}
                <path
                  d={`M 0 ${200 - mockData[0].value * 6} ${mockData.map((d, i) => `L ${i * 66} ${200 - d.value * 6}`).join(' ')}`}
                  fill="none"
                  stroke="hsl(var(--destructive))"
                  strokeWidth="2"
                />
                
                {/* Points */}
                {mockData.map((d, i) => (
                  <circle
                    key={i}
                    cx={i * 66}
                    cy={200 - d.value * 6}
                    r="4"
                    fill="hsl(var(--destructive))"
                  />
                ))}
              </svg>
              
              {/* Y-axis labels */}
              <div className="absolute left-0 top-0 bottom-0 flex flex-col justify-between text-xs text-muted-foreground py-2">
                <span>30%</span>
                <span>20%</span>
                <span>10%</span>
                <span>0%</span>
              </div>
            </div>
            
            {/* X-axis labels */}
            <div className="flex justify-between text-xs text-muted-foreground mt-2">
              {mockData.map((d) => (
                <span key={d.period}>{d.period}</span>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Stats Panel */}
        <div className="space-y-4">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-base">Nyckeltal</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Nuvarande</span>
                <span className="font-bold text-destructive">24.3%</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Förändring YoY</span>
                <span className="font-medium text-destructive">+6.1 pp</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">EU-snitt</span>
                <span className="font-medium">14.8%</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Trend</span>
                <Badge variant="destructive">Försämras</Badge>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-base">Korrelerade KPI:er</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              {[
                { name: "BNP-tillväxt", corr: -0.72 },
                { name: "Utbildningsnivå", corr: -0.65 },
                { name: "Investeringar", corr: -0.58 },
              ].map((kpi, i) => (
                <div key={i} className="flex items-center justify-between text-sm">
                  <span>{kpi.name}</span>
                  <span className={kpi.corr < 0 ? "text-destructive" : "text-green-500"}>
                    {kpi.corr.toFixed(2)}
                  </span>
                </div>
              ))}
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-base">Datakvalitet</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Konfidens</span>
                <span className="font-medium">94%</span>
              </div>
              <Progress value={94} className="h-2" />
              <p className="text-xs text-muted-foreground mt-2">
                Källa: SCB, Eurostat • Uppdaterad: 2024-01-15
              </p>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Analysis Section */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Eye className="h-5 w-5" />
            Systemanalys
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="p-4 bg-muted/50 rounded-lg">
            <h4 className="font-medium mb-2">Observation: Accelererande försämring</h4>
            <p className="text-sm text-muted-foreground mb-4">
              Ungdomsarbetslösheten har ökat med 6.1 procentenheter sedan samma period förra året. 
              Trenden visar acceleration de senaste två kvartalen. Malmöregionen uppvisar högst värden (28.1%).
              Korrelationen med BNP-tillväxt är stark negativ (-0.72), vilket indikerar strukturella utmaningar.
            </p>
            <div className="flex gap-2">
              <Button size="sm" className="gap-1">
                <Target className="h-3 w-3" />
                Skapa beslut
              </Button>
              <Button size="sm" variant="outline" className="gap-1">
                <TrendingUp className="h-3 w-3" />
                Djupare analys
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}

function AlertStep() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="space-y-6"
    >
      {/* Alert Header */}
      <Card className="border-destructive bg-destructive/5">
        <CardContent className="flex items-start gap-4 p-6">
          <div className="h-12 w-12 rounded-full bg-destructive/20 flex items-center justify-center flex-shrink-0">
            <AlertTriangle className="h-6 w-6 text-destructive" />
          </div>
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2">
              <Badge variant="destructive">KRITISK SIGNAL</Badge>
              <span className="text-sm text-muted-foreground">Detekterad 2024-01-15 07:00</span>
            </div>
            <h2 className="text-xl font-bold mb-2">Ungdomsarbetslöshet överstiger kritisk tröskel</h2>
            <p className="text-muted-foreground">
              Arbetslösheten för åldersgruppen 15-24 år har passerat 24% i Malmöregionen, 
              vilket aktiverar kritisk signal enligt konfigurerade tröskelvärden.
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Signal Details Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base text-muted-foreground">Nuvarande värde</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold text-destructive">24.3%</p>
            <p className="text-sm text-muted-foreground">Tröskel: 20%</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base text-muted-foreground">Påverkade personer</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">~45,000</p>
            <p className="text-sm text-muted-foreground">I Malmöregionen</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base text-muted-foreground">Tid sedan senaste normal</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">18 mån</p>
            <p className="text-sm text-muted-foreground">Under 20% juni 2022</p>
          </CardContent>
        </Card>
      </div>

      {/* Why Now Section */}
      <Card>
        <CardHeader>
          <CardTitle>Varför nu?</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {[
              {
                title: "Konjunkturnedgång",
                desc: "BNP-tillväxt negativ senaste 2 kvartalen påverkar arbetsmarknaden",
                weight: "35%",
              },
              {
                title: "Strukturella faktorer",
                desc: "Mismatch mellan utbildning och arbetsmarknadsefterfrågan",
                weight: "25%",
              },
              {
                title: "Regional koncentration",
                desc: "Malmöregionen drabbas hårdare än rikssnittet",
                weight: "20%",
              },
              {
                title: "Demografisk effekt",
                desc: "Större ungdomskullar möter svagare arbetsmarknad",
                weight: "20%",
              },
            ].map((factor, i) => (
              <div key={i} className="p-4 bg-muted/50 rounded-lg">
                <div className="flex justify-between items-start mb-2">
                  <h4 className="font-medium">{factor.title}</h4>
                  <Badge variant="outline">{factor.weight}</Badge>
                </div>
                <p className="text-sm text-muted-foreground">{factor.desc}</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Responsibility */}
      <Card>
        <CardHeader>
          <CardTitle>Ansvarsnivåer</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {[
              { level: "Nationell", entity: "Arbetsförmedlingen", responsibility: "Primärt ansvar", color: "bg-primary" },
              { level: "Regional", entity: "Region Skåne", responsibility: "Delat ansvar", color: "bg-amber-500" },
              { level: "Kommunal", entity: "Malmö stad", responsibility: "Delat ansvar", color: "bg-amber-500" },
            ].map((r, i) => (
              <div key={i} className="flex items-center gap-4 p-3 border rounded-lg">
                <div className={`h-3 w-3 rounded-full ${r.color}`} />
                <div className="flex-1">
                  <p className="font-medium">{r.entity}</p>
                  <p className="text-sm text-muted-foreground">{r.level}</p>
                </div>
                <Badge variant="outline">{r.responsibility}</Badge>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <div className="flex gap-3">
        <Button size="lg" className="gap-2">
          <Target className="h-4 w-4" />
          Initiera beslut
        </Button>
        <Button size="lg" variant="outline" className="gap-2">
          <Calendar className="h-4 w-4" />
          Bevaka signal
        </Button>
      </div>
    </motion.div>
  );
}

function DecisionStep() {
  const [phase, setPhase] = useState<'define' | 'options' | 'evaluate'>('define');

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="space-y-6"
    >
      <div>
        <h2 className="text-2xl font-bold">Beslutsunderlag</h2>
        <p className="text-muted-foreground">Strukturera åtgärdsalternativ och utvärdera effekt</p>
      </div>

      {/* Phase Tabs */}
      <Tabs value={phase} onValueChange={(v) => setPhase(v as typeof phase)}>
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="define" className="gap-2">
            <span className="h-5 w-5 rounded-full bg-primary text-primary-foreground text-xs flex items-center justify-center">1</span>
            Definiera problem
          </TabsTrigger>
          <TabsTrigger value="options" className="gap-2">
            <span className="h-5 w-5 rounded-full bg-primary text-primary-foreground text-xs flex items-center justify-center">2</span>
            Alternativ
          </TabsTrigger>
          <TabsTrigger value="evaluate" className="gap-2">
            <span className="h-5 w-5 rounded-full bg-primary text-primary-foreground text-xs flex items-center justify-center">3</span>
            Utvärdera
          </TabsTrigger>
        </TabsList>

        <TabsContent value="define" className="space-y-4 mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Problemdefinition</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium">Titel</label>
                  <Input defaultValue="Åtgärder mot ungdomsarbetslöshet" className="mt-1" />
                </div>
                <div>
                  <label className="text-sm font-medium">Ansvarig</label>
                  <Input defaultValue="Anna Andersson" className="mt-1" />
                </div>
              </div>
              <div>
                <label className="text-sm font-medium">Berörd KPI</label>
                <div className="flex gap-2 mt-1">
                  <Badge>Arbetslöshet 15-24 år</Badge>
                  <Badge variant="outline">+ Lägg till</Badge>
                </div>
              </div>
              <div>
                <label className="text-sm font-medium">Målsättning</label>
                <Input defaultValue="Minska ungdomsarbetslösheten till under 20% inom 24 månader" className="mt-1" />
              </div>
            </CardContent>
          </Card>
          <Button onClick={() => setPhase('options')}>Fortsätt till alternativ →</Button>
        </TabsContent>

        <TabsContent value="options" className="space-y-4 mt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {[
              {
                title: "Alternativ A: Utbildningssatsning",
                desc: "Intensifierad yrkesutbildning med praktikgaranti",
                cost: "250 MSEK/år",
                time: "12-24 månader",
                effect: "Måttlig",
              },
              {
                title: "Alternativ B: Subventionerad anställning",
                desc: "Arbetsgivaravgift sänks för ungdomsanställningar",
                cost: "400 MSEK/år",
                time: "6-12 månader",
                effect: "Hög",
              },
              {
                title: "Alternativ C: Kombinerad insats",
                desc: "Kombination av A och B med regional anpassning",
                cost: "550 MSEK/år",
                time: "12-18 månader",
                effect: "Mycket hög",
              },
              {
                title: "Alternativ D: Avvakta",
                desc: "Följ utvecklingen utan aktiv åtgärd",
                cost: "0 SEK",
                time: "-",
                effect: "Ingen/Negativ",
              },
            ].map((alt, i) => (
              <Card key={i} className={i === 2 ? "border-primary" : ""}>
                <CardHeader className="pb-2">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-base">{alt.title}</CardTitle>
                    {i === 2 && <Badge>Rekommenderas</Badge>}
                  </div>
                  <CardDescription>{alt.desc}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-3 gap-2 text-sm">
                    <div>
                      <p className="text-muted-foreground">Kostnad</p>
                      <p className="font-medium">{alt.cost}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Tidsspann</p>
                      <p className="font-medium">{alt.time}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Effekt</p>
                      <p className="font-medium">{alt.effect}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
          <Button onClick={() => setPhase('evaluate')}>Fortsätt till utvärdering →</Button>
        </TabsContent>

        <TabsContent value="evaluate" className="space-y-4 mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Prioriteringsmatris</CardTitle>
              <CardDescription>Baserat på effekt, kostnad, risk och genomförbarhet</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {[
                  { alt: "Alternativ C", score: 87, effect: 9, cost: 6, risk: 8, feasibility: 7 },
                  { alt: "Alternativ B", score: 72, effect: 8, cost: 5, risk: 7, feasibility: 8 },
                  { alt: "Alternativ A", score: 65, effect: 6, cost: 7, risk: 9, feasibility: 8 },
                  { alt: "Alternativ D", score: 12, effect: 1, cost: 10, risk: 2, feasibility: 10 },
                ].map((item, i) => (
                  <div key={i} className="flex items-center gap-4">
                    <div className="w-32 font-medium">{item.alt}</div>
                    <div className="flex-1">
                      <Progress value={item.score} className="h-3" />
                    </div>
                    <div className="w-16 text-right font-bold">{item.score}/100</div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card className="border-primary">
            <CardHeader>
              <div className="flex items-center gap-2">
                <ThumbsUp className="h-5 w-5 text-primary" />
                <CardTitle>Rekommendation</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-lg font-medium mb-4">
                Systemet rekommenderar <strong>Alternativ C: Kombinerad insats</strong>
              </p>
              <p className="text-muted-foreground mb-4">
                Baserat på analysen ger detta alternativ bäst balans mellan förväntad effekt och kostnad. 
                Regional anpassning möjliggör optimerad resursallokering i de mest drabbade områdena.
              </p>
              <div className="flex gap-3">
                <Button className="gap-2">
                  <CheckCircle2 className="h-4 w-4" />
                  Godkänn beslut
                </Button>
                <Button variant="outline">Modifiera</Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </motion.div>
  );
}

function FollowupStep() {
  const timeline = [
    { date: "2024-01-15", event: "Beslut fattat", status: "done" },
    { date: "2024-02-01", event: "Genomförandeplan godkänd", status: "done" },
    { date: "2024-03-01", event: "Första insatser påbörjade", status: "done" },
    { date: "2024-06-01", event: "Första mätpunkt", status: "current" },
    { date: "2024-09-01", event: "Halvårsutvärdering", status: "pending" },
    { date: "2025-01-01", event: "Årsutvärdering", status: "pending" },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="space-y-6"
    >
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Beslutsuppföljning</h2>
          <p className="text-muted-foreground">Åtgärder mot ungdomsarbetslöshet - Kombinerad insats</p>
        </div>
        <Badge variant="outline" className="gap-2">
          <Activity className="h-3 w-3" />
          Pågående
        </Badge>
      </div>

      {/* Progress Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-6">
            <p className="text-sm text-muted-foreground">Tid sedan beslut</p>
            <p className="text-2xl font-bold">5 månader</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <p className="text-sm text-muted-foreground">Budget använd</p>
            <p className="text-2xl font-bold">42%</p>
            <Progress value={42} className="h-2 mt-2" />
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <p className="text-sm text-muted-foreground">Milstolpar klara</p>
            <p className="text-2xl font-bold">3/6</p>
          </CardContent>
        </Card>
        <Card className="border-green-500/30">
          <CardContent className="pt-6">
            <p className="text-sm text-muted-foreground">KPI-förändring</p>
            <p className="text-2xl font-bold text-green-500">-1.2 pp</p>
            <p className="text-xs text-muted-foreground">24.3% → 23.1%</p>
          </CardContent>
        </Card>
      </div>

      {/* Timeline */}
      <Card>
        <CardHeader>
          <CardTitle>Tidslinje</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="relative">
            <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-muted" />
            <div className="space-y-6">
              {timeline.map((item, i) => (
                <div key={i} className="flex gap-4 relative">
                  <div className={`h-8 w-8 rounded-full flex items-center justify-center z-10 ${
                    item.status === 'done' ? 'bg-green-500' :
                    item.status === 'current' ? 'bg-primary animate-pulse' : 'bg-muted'
                  }`}>
                    {item.status === 'done' ? (
                      <CheckCircle2 className="h-4 w-4 text-white" />
                    ) : item.status === 'current' ? (
                      <Activity className="h-4 w-4 text-primary-foreground" />
                    ) : (
                      <Clock className="h-4 w-4 text-muted-foreground" />
                    )}
                  </div>
                  <div className="flex-1 pt-1">
                    <div className="flex items-center gap-2">
                      <p className="font-medium">{item.event}</p>
                      {item.status === 'current' && <Badge>Nu</Badge>}
                    </div>
                    <p className="text-sm text-muted-foreground">{item.date}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* KPI Tracking */}
      <Card>
        <CardHeader>
          <CardTitle>KPI-utveckling under perioden</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-48 relative">
            <svg className="w-full h-full" viewBox="0 0 400 150">
              {/* Target line */}
              <line x1="0" y1="100" x2="400" y2="100" stroke="hsl(var(--primary))" strokeDasharray="4 4" strokeOpacity="0.5" />
              <text x="405" y="104" className="text-[10px] fill-primary">Mål: 20%</text>
              
              {/* Actual trend */}
              <path
                d="M 0 30 C 50 35, 100 40, 150 45 S 250 55, 300 50 S 350 48, 400 45"
                fill="none"
                stroke="hsl(var(--primary))"
                strokeWidth="2"
              />
              
              {/* Points */}
              <circle cx="0" cy="30" r="4" fill="hsl(var(--primary))" />
              <circle cx="100" cy="40" r="4" fill="hsl(var(--primary))" />
              <circle cx="200" cy="50" r="4" fill="hsl(var(--primary))" />
              <circle cx="300" cy="50" r="4" fill="hsl(var(--primary))" />
              <circle cx="400" cy="45" r="5" fill="hsl(var(--primary))" className="animate-pulse" />
            </svg>
            
            {/* Y-axis */}
            <div className="absolute left-0 top-0 bottom-0 flex flex-col justify-between text-xs text-muted-foreground">
              <span>25%</span>
              <span>22%</span>
              <span>20%</span>
              <span>18%</span>
            </div>
          </div>
          
          <div className="flex justify-between text-xs text-muted-foreground mt-2 pl-8">
            <span>Jan 2024</span>
            <span>Mar</span>
            <span>Maj</span>
            <span>Jul</span>
            <span>Nu</span>
          </div>
          
          <div className="mt-6 p-4 bg-green-500/10 border border-green-500/20 rounded-lg">
            <div className="flex items-center gap-2 text-green-600 dark:text-green-400 mb-2">
              <TrendingUp className="h-4 w-4" />
              <span className="font-medium">Positiv trend</span>
            </div>
            <p className="text-sm text-muted-foreground">
              Ungdomsarbetslösheten har minskat med 1.2 procentenheter sedan beslutet fattades. 
              Om trenden håller i sig beräknas målet nås inom 18 månader.
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Success Summary */}
      <Card className="bg-gradient-to-r from-primary/10 via-primary/5 to-transparent border-primary/20">
        <CardContent className="flex items-center gap-6 p-6">
          <div className="h-16 w-16 rounded-2xl bg-primary/20 flex items-center justify-center">
            <Sparkles className="h-8 w-8 text-primary" />
          </div>
          <div>
            <h3 className="text-lg font-bold mb-1">Demoflöde slutfört</h3>
            <p className="text-muted-foreground">
              Du har nu genomgått hela flödet från inloggning → översikt → utforskning → 
              signaldetektion → beslutsfattande → uppföljning.
            </p>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
