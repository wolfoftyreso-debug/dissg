import { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { ArrowLeft, MapPin, ArrowLeftRight, BarChart3 } from 'lucide-react';
import { Link } from 'react-router-dom';
import { RegionalComparison, RegionDetailPanel, RegionVsRegion } from '@/components/regional';
import { GlobalDisclaimer } from '@/components/transparency/GlobalDisclaimer';

export default function RegionalView() {
  const [selectedRegion, setSelectedRegion] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState('ranking');

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-card/50 backdrop-blur-sm sticky top-0 z-10">
        <div className="container mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Button variant="ghost" size="icon" asChild>
                <Link to="/public">
                  <ArrowLeft className="h-5 w-5" />
                </Link>
              </Button>
              <div>
                <h1 className="text-lg font-bold flex items-center gap-2">
                  <MapPin className="h-5 w-5" />
                  Regional jämförelse
                </h1>
                <p className="text-xs text-muted-foreground">
                  Samma indikatorer – olika län. Objektiv jämförelse.
                </p>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-6">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full max-w-md grid-cols-2">
            <TabsTrigger value="ranking" className="gap-2">
              <BarChart3 className="h-4 w-4" />
              Rangordning
            </TabsTrigger>
            <TabsTrigger value="compare" className="gap-2">
              <ArrowLeftRight className="h-4 w-4" />
              Jämför två län
            </TabsTrigger>
          </TabsList>

          <TabsContent value="ranking" className="space-y-6">
            <div className="grid lg:grid-cols-2 gap-6">
              <RegionalComparison 
                onRegionSelect={(code) => setSelectedRegion(code)}
              />
              
              {selectedRegion ? (
                <RegionDetailPanel 
                  regionCode={selectedRegion}
                  onClose={() => setSelectedRegion(null)}
                />
              ) : (
                <div className="border-2 border-dashed rounded-lg flex items-center justify-center h-[600px] text-muted-foreground">
                  <div className="text-center p-6">
                    <MapPin className="h-12 w-12 mx-auto mb-4 opacity-50" />
                    <p className="font-medium">Välj ett län</p>
                    <p className="text-sm">
                      Klicka på ett län i rangordningen för att se detaljerad information
                    </p>
                  </div>
                </div>
              )}
            </div>
          </TabsContent>

          <TabsContent value="compare">
            <div className="max-w-2xl mx-auto">
              <RegionVsRegion />
            </div>
          </TabsContent>
        </Tabs>
      </main>

      {/* Footer Disclaimer */}
      <footer className="border-t mt-8 py-4">
        <div className="container mx-auto px-4">
          <GlobalDisclaimer />
        </div>
      </footer>
    </div>
  );
}
