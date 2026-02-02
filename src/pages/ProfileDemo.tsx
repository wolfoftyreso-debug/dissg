import { FictionalProfileDemo } from '@/components/demo/FictionalProfileDemo';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';

/**
 * DEL XIV: Demo-sida för fiktiv politikerprofil
 * 
 * Visar exakt hur verkliga profiler kommer att se ut
 * med alla disclaimers och tre-lager-separation.
 */
const ProfileDemo = () => {
  return (
    <div className="min-h-screen bg-background">
      <header className="border-b bg-card sticky top-0 z-10">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon" asChild>
              <a href="/">
                <ArrowLeft className="h-5 w-5" />
              </a>
            </Button>
            <div>
              <h1 className="text-xl font-semibold">
                Profildemo (Fiktiv)
              </h1>
              <p className="text-sm text-muted-foreground">
                Demonstration av profilstruktur enligt DEL XIV-specifikationen
              </p>
            </div>
          </div>
        </div>
      </header>

      <main className="py-6">
        <FictionalProfileDemo />
      </main>
    </div>
  );
};

export default ProfileDemo;
