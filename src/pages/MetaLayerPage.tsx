import { Helmet } from 'react-helmet-async';
import { MetaLayerDashboard } from '@/components/meta-layer/MetaLayerDashboard';

export default function MetaLayerPage() {
  return (
    <>
      <Helmet>
        <title>Meta Layer — System Self-Analysis | DISSG</title>
        <meta name="description" content="Layer 7 of the 7-Layer Knowledge Intelligence Architecture. Self-analysis of knowledge gaps, weak claims, and research priorities." />
      </Helmet>
      <div className="container mx-auto py-6 px-4 max-w-6xl">
        <MetaLayerDashboard />
      </div>
    </>
  );
}
