/**
 * PUBLIC DASHBOARD - APPLE HEALTH STYLE
 *
 * Pedagogical, friendly, and accessible design inspired by iPhone Health app.
 * Uses soft colors, rounded cards, progress rings, and human-readable labels.
 *
 * Live global WorldBank data injected at top via LiveDataWidget.
 */

import { AppleHealthDashboard } from '@/components/health/AppleHealthDashboard';
import { LiveDataWidget } from '@/components/data/LiveDataWidget';

const PublicDashboard = () => {
  return (
    <div>
      {/* Global live stats — WorldBank aggregate (WLD = world) */}
      <div style={{ padding: '16px 24px', borderBottom: '1px solid #E5E7EB', background: '#F9FAFB' }}>
        <LiveDataWidget countryCode="WLD" showTitle={true} />
      </div>
      <AppleHealthDashboard />
    </div>
  );
};

export default PublicDashboard;
