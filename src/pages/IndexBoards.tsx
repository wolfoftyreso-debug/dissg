/**
 * INDEX BOARDS PAGE
 * 
 * Index-first dashboards showing "something is moving".
 * Click any index → relevant Decision Graphs.
 */

import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { SystemStabilityBoard } from "@/components/index-boards/SystemStabilityBoard";
import { HealthcareLoadBoard } from "@/components/index-boards/HealthcareLoadBoard";
import { Activity, Stethoscope, Info } from "lucide-react";

export default function IndexBoards() {
  const [selectedIndex, setSelectedIndex] = useState<string | null>(null);

  const handleIndexClick = (indexId: string) => {
    setSelectedIndex(indexId);
    // In production, this would navigate to or open the relevant Decision Graph
    console.log("Selected index:", indexId);
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-card">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold">Index Boards</h1>
              <p className="text-muted-foreground mt-1">
                Orientation, not dashboards — see what's moving
              </p>
            </div>
            <Badge variant="outline" className="gap-1">
              <Info className="h-3 w-3" />
              Click any index for detail
            </Badge>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <Tabs defaultValue="stability" className="space-y-6">
          <TabsList>
            <TabsTrigger value="stability" className="gap-2">
              <Activity className="h-4 w-4" />
              System Stability
            </TabsTrigger>
            <TabsTrigger value="healthcare" className="gap-2">
              <Stethoscope className="h-4 w-4" />
              Healthcare Load
            </TabsTrigger>
          </TabsList>

          <TabsContent value="stability">
            <SystemStabilityBoard 
              country="SE" 
              onIndexClick={handleIndexClick} 
            />
          </TabsContent>

          <TabsContent value="healthcare">
            <HealthcareLoadBoard 
              region="Stockholm" 
              onMetricClick={handleIndexClick} 
            />
          </TabsContent>
        </Tabs>
      </main>

      {/* Footer */}
      <footer className="border-t bg-muted py-6 mt-12">
        <div className="container mx-auto px-4 text-center text-sm text-muted-foreground">
          <p>Index = "something is moving" · Decision Graph = "what we can measure"</p>
          <p className="mt-1">You decide the response</p>
        </div>
      </footer>
    </div>
  );
}
