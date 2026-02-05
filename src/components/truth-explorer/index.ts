/**
 * TRUTH EXPLORER — PUBLIC API
 * 
 * The first public surface of Truth-OS.
 * V2 components: extreme clarity, zero fluff.
 */

// V1 Explorer (navigation-based)
export { TruthExplorer, type ExplorerView } from './TruthExplorer';
export { OrientationView } from './OrientationView';
export { DepthView } from './DepthView';
export { RelationsView } from './RelationsView';
export { NavigationBar } from './NavigationBar';
export { ComplianceFooter } from './ComplianceFooter';

// V2 Explorer (node-based, extreme clarity)
export { TruthNodeExplorer } from './TruthNodeExplorer';
export { DomainOrientationBar } from './DomainOrientationBar';
export { PriorityMap } from './PriorityMap';
export { CurrentState } from './CurrentState';
export { WhyThisMatters } from './WhyThisMatters';
export { WhatThisDoesNotMean } from './WhatThisDoesNotMean';
export { UncertaintyPanel } from './UncertaintyPanel';
export { GoDeeper } from './GoDeeper';
