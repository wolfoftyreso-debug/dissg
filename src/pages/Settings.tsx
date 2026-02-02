import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Settings as SettingsIcon, User, Bell, Shield, Palette } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { ThemeToggle } from '@/components/settings/ThemeToggle';
import { useAuth } from '@/contexts/AuthContext';
import { GlobalDisclaimer } from '@/components/transparency';

export default function Settings() {
  const { user } = useAuth();

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card/50 px-6 py-4">
        <div className="container mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <SettingsIcon className="h-6 w-6 text-primary" />
            <div>
              <h1 className="font-mono text-lg font-semibold uppercase tracking-wider">
                Inställningar
              </h1>
              <p className="text-xs text-muted-foreground">
                Anpassa ditt konto och systemet
              </p>
            </div>
          </div>
          <Link 
            to="/" 
            className="text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            Dashboard ↗
          </Link>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8 max-w-4xl">
        {/* Back navigation */}
        <div className="mb-6">
          <Link 
            to="/" 
            className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            Tillbaka till dashboard
          </Link>
        </div>

        <Tabs defaultValue="appearance" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="appearance" className="gap-2">
              <Palette className="h-4 w-4" />
              <span className="hidden sm:inline">Utseende</span>
            </TabsTrigger>
            <TabsTrigger value="notifications" className="gap-2">
              <Bell className="h-4 w-4" />
              <span className="hidden sm:inline">Aviseringar</span>
            </TabsTrigger>
            <TabsTrigger value="account" className="gap-2">
              <User className="h-4 w-4" />
              <span className="hidden sm:inline">Konto</span>
            </TabsTrigger>
            <TabsTrigger value="privacy" className="gap-2">
              <Shield className="h-4 w-4" />
              <span className="hidden sm:inline">Integritet</span>
            </TabsTrigger>
          </TabsList>

          {/* Appearance Tab */}
          <TabsContent value="appearance" className="space-y-6">
            <ThemeToggle />

            <Card>
              <CardHeader>
                <CardTitle>Visningsalternativ</CardTitle>
                <CardDescription>
                  Anpassa hur data presenteras
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Kompakt läge</Label>
                    <p className="text-sm text-muted-foreground">
                      Visa mer information på mindre yta
                    </p>
                  </div>
                  <Switch />
                </div>
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Visa sparklines</Label>
                    <p className="text-sm text-muted-foreground">
                      Visa miniatyr-trendlinjer i kortvisningar
                    </p>
                  </div>
                  <Switch defaultChecked />
                </div>
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Animerade övergångar</Label>
                    <p className="text-sm text-muted-foreground">
                      Aktivera mjuka animationer i gränssnittet
                    </p>
                  </div>
                  <Switch defaultChecked />
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Notifications Tab */}
          <TabsContent value="notifications" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Bell className="h-5 w-5" />
                  Aviseringsinställningar
                </CardTitle>
                <CardDescription>
                  Hantera hur och när du får aviseringar
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Kritiska KPI-varningar</Label>
                    <p className="text-sm text-muted-foreground">
                      Avisera när KPI:er når kritisk nivå
                    </p>
                  </div>
                  <Switch defaultChecked />
                </div>
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Nya policy-beslut</Label>
                    <p className="text-sm text-muted-foreground">
                      Avisera vid nya beslut som påverkar dina KPI:er
                    </p>
                  </div>
                  <Switch defaultChecked />
                </div>
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Veckosammanfattning</Label>
                    <p className="text-sm text-muted-foreground">
                      Skicka veckovis sammanfattning via e-post
                    </p>
                  </div>
                  <Switch />
                </div>
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Feed-uppdateringar</Label>
                    <p className="text-sm text-muted-foreground">
                      Avisera vid nya händelser i prenumererade feeds
                    </p>
                  </div>
                  <Switch defaultChecked />
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Account Tab */}
          <TabsContent value="account" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <User className="h-5 w-5" />
                  Kontoinformation
                </CardTitle>
                <CardDescription>
                  Din kontoinformation och inloggningsuppgifter
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid gap-4 sm:grid-cols-2">
                  <div>
                    <Label className="text-muted-foreground">E-post</Label>
                    <p className="font-medium">{user?.email || 'Inte inloggad'}</p>
                  </div>
                  <div>
                    <Label className="text-muted-foreground">Konto skapat</Label>
                    <p className="font-medium">
                      {user?.created_at 
                        ? new Date(user.created_at).toLocaleDateString('sv-SE')
                        : '—'}
                    </p>
                  </div>
                </div>
                <div className="pt-4 border-t">
                  <Button variant="outline">
                    Ändra lösenord
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Privacy Tab */}
          <TabsContent value="privacy" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Shield className="h-5 w-5" />
                  Integritets­inställningar
                </CardTitle>
                <CardDescription>
                  Hantera hur dina data används
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Analysdata</Label>
                    <p className="text-sm text-muted-foreground">
                      Hjälp oss förbättra systemet med anonym användningsdata
                    </p>
                  </div>
                  <Switch defaultChecked />
                </div>
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Personalisering</Label>
                    <p className="text-sm text-muted-foreground">
                      Visa personligt anpassat innehåll baserat på din roll
                    </p>
                  </div>
                  <Switch defaultChecked />
                </div>
                <div className="pt-4 border-t">
                  <Button variant="outline" className="text-destructive border-destructive hover:bg-destructive/10">
                    Exportera mina data
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        <GlobalDisclaimer className="mt-8" />
      </main>
    </div>
  );
}
