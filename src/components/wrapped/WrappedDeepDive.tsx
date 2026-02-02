// Wrapped Step 7: Deep Dive - "Vill du gå djupare?"

import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { BarChart3, BookOpen, Database, FileText, ExternalLink } from 'lucide-react';
import type { WrappedOutput } from '@/types/wrapped';
import { Link } from 'react-router-dom';

interface WrappedDeepDiveProps {
  data: WrappedOutput['deepDive'];
  isDemo?: boolean;
}

function getViewIcon(type: string) {
  switch (type) {
    case 'full_graph': return BarChart3;
    case 'methodology': return BookOpen;
    case 'raw_data': return Database;
    case 'sources': return FileText;
    default: return ExternalLink;
  }
}

export function WrappedDeepDive({ data, isDemo }: WrappedDeepDiveProps) {
  return (
    <div className="space-y-6 animate-in fade-in-0 slide-in-from-bottom-4 duration-500">
      <div className="text-center space-y-2">
        <h2 className="text-2xl font-semibold">Vill du gå djupare?</h2>
        <p className="text-muted-foreground">
          Utforska fullständiga data och metodik
        </p>
      </div>

      <div className="grid gap-3 sm:grid-cols-2">
        {data.availableViews.map((view, index) => {
          const Icon = getViewIcon(view.type);
          
          return (
            <Card 
              key={view.type}
              className="group cursor-pointer hover:border-primary/50 transition-colors animate-in fade-in-0 slide-in-from-bottom-2"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <CardContent className="py-4">
                <Link 
                  to={view.url}
                  className="flex items-center gap-3"
                >
                  <div className="p-2 rounded-lg bg-muted group-hover:bg-primary/10 transition-colors">
                    <Icon className="h-5 w-5 text-muted-foreground group-hover:text-primary transition-colors" />
                  </div>
                  <div className="flex-1">
                    <p className="font-medium group-hover:text-primary transition-colors">
                      {view.label}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {view.type === 'full_graph' && 'Interaktiva visualiseringar'}
                      {view.type === 'methodology' && 'Beräkningar och definitioner'}
                      {view.type === 'raw_data' && 'Exporterbar data'}
                      {view.type === 'sources' && 'Källhänvisningar'}
                    </p>
                  </div>
                  <ExternalLink className="h-4 w-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
                </Link>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Wrapped is entry point, not endpoint */}
      <Card className="bg-muted/50">
        <CardContent className="py-6 text-center">
          <p className="text-muted-foreground mb-4">
            Denna sammanfattning är en ingång till data, inte en slutpunkt.
          </p>
          
          {isDemo ? (
            <div className="space-y-2">
              <p className="text-sm text-muted-foreground">
                I demo-läget kan du inte spara eller dela.
              </p>
              <Button variant="secondary" disabled>
                Dela (Endast i fullversion)
              </Button>
            </div>
          ) : (
            <div className="flex justify-center gap-3">
              <Button variant="outline">
                Kopiera länk
              </Button>
              <Button>
                Exportera PDF
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Return to start */}
      <div className="text-center pt-4">
        <Button variant="ghost" asChild>
          <Link to="/">
            Tillbaka till startsidan
          </Link>
        </Button>
      </div>
    </div>
  );
}
