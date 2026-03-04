import { Helmet } from 'react-helmet-async';
import UCEExplorer from '@/components/uce/UCEExplorer';

export default function UCEPage() {
  return (
    <>
      <Helmet>
        <title>Universal Claim Engine | DISSG</title>
        <meta name="description" content="Domain-agnostic knowledge engine: all knowledge as ENTITY → VARIABLE → RELATIONSHIP → OUTCOME" />
      </Helmet>
      <div className="container mx-auto py-8 px-4 max-w-6xl">
        <div className="mb-8">
          <h1 className="text-3xl font-bold tracking-tight mb-2">Universal Claim Engine</h1>
          <p className="text-muted-foreground max-w-2xl">
            All kunskap reduceras till: <span className="font-mono text-primary">ENTITY → VARIABLE → RELATIONSHIP → OUTCOME</span>. 
            Domänoberoende analys av hälsa, ekonomi, psykologi, miljö och samhälle i samma motor.
          </p>
        </div>
        <UCEExplorer />
      </div>
    </>
  );
}
