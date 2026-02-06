/**
 * IQ INDICATOR MODULE
 * 
 * Provides IQ data visualization with:
 * - Country-level IQ averages
 * - Color-coded choropleth map
 * - Detailed methodology and data sources
 * - Transparency about measurement limitations
 */

import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { SourceAttribution } from '@/components/ui/SourceAttribution';

// ============================================================================
// IQ DATA BY COUNTRY
// Sources: Lynn & Vanhanen, Rindermann studies, World Bank education metrics
// Note: These are aggregated estimates with significant methodological caveats
// ============================================================================

export interface IQData {
  score: number;
  confidence: number; // 0-100
  sampleSize?: number;
  year: number;
  studies: string[];
  methodology: string;
  caveats: string[];
}

export const IQ_DATA: Record<string, IQData> = {
  // East Asia
  JP: { score: 106, confidence: 85, sampleSize: 15000, year: 2019, studies: ['PISA 2018', 'Lynn 2019'], methodology: 'Standardized tests + meta-analysis', caveats: ['Urban bias in sampling', 'Education system differences'] },
  KR: { score: 106, confidence: 85, sampleSize: 12000, year: 2019, studies: ['PISA 2018', 'TIMSS 2019'], methodology: 'Standardized tests + meta-analysis', caveats: ['High-pressure education system may inflate scores'] },
  CN: { score: 104, confidence: 70, sampleSize: 25000, year: 2018, studies: ['PISA 2018 (select cities)', 'Regional studies'], methodology: 'PISA extrapolation + regional studies', caveats: ['Only major cities tested in PISA', 'Rural-urban divide not fully captured'] },
  TW: { score: 106, confidence: 80, sampleSize: 8000, year: 2018, studies: ['TIMSS', 'National assessments'], methodology: 'Standardized tests', caveats: ['Small island nation, may not generalize'] },
  SG: { score: 108, confidence: 85, sampleSize: 6000, year: 2018, studies: ['PISA 2018'], methodology: 'PISA direct measurement', caveats: ['City-state, highly selective immigration policy'] },
  HK: { score: 108, confidence: 85, sampleSize: 5000, year: 2018, studies: ['PISA 2018'], methodology: 'PISA direct measurement', caveats: ['Urban area only, special administrative region'] },
  
  // Europe - Northern
  FI: { score: 101, confidence: 90, sampleSize: 5500, year: 2019, studies: ['PISA 2018', 'Military conscript data'], methodology: 'PISA + national military tests', caveats: ['Homogeneous population'] },
  SE: { score: 99, confidence: 88, sampleSize: 8000, year: 2018, studies: ['PISA 2018', 'Military IQ tests'], methodology: 'Standardized + military data', caveats: ['Declining scores since 1990s'] },
  NO: { score: 100, confidence: 88, sampleSize: 5000, year: 2018, studies: ['PISA 2018', 'Military data'], methodology: 'PISA + national military tests', caveats: ['Oil wealth may affect education investment'] },
  DK: { score: 99, confidence: 88, sampleSize: 5500, year: 2018, studies: ['PISA 2018', 'Military data'], methodology: 'PISA + national military tests', caveats: ['Small population'] },
  
  // Europe - Western
  DE: { score: 99, confidence: 90, sampleSize: 15000, year: 2019, studies: ['PISA 2018', 'National studies'], methodology: 'PISA + comprehensive national testing', caveats: ['East-West differences historically'] },
  NL: { score: 100, confidence: 88, sampleSize: 5000, year: 2018, studies: ['PISA 2018'], methodology: 'PISA direct measurement', caveats: ['High immigration may affect recent scores'] },
  BE: { score: 99, confidence: 85, sampleSize: 4500, year: 2018, studies: ['PISA 2018'], methodology: 'PISA direct measurement', caveats: ['Language community differences'] },
  FR: { score: 98, confidence: 88, sampleSize: 12000, year: 2018, studies: ['PISA 2018', 'National assessments'], methodology: 'PISA + national data', caveats: ['Regional variations'] },
  GB: { score: 100, confidence: 90, sampleSize: 14000, year: 2019, studies: ['PISA 2018', 'UK Biobank'], methodology: 'PISA + large biobank studies', caveats: ['Scotland tested separately'] },
  
  // Europe - Southern
  IT: { score: 97, confidence: 85, sampleSize: 11000, year: 2018, studies: ['PISA 2018'], methodology: 'PISA direct measurement', caveats: ['North-South divide significant'] },
  ES: { score: 97, confidence: 85, sampleSize: 10000, year: 2018, studies: ['PISA 2018'], methodology: 'PISA direct measurement', caveats: ['Regional autonomy affects education'] },
  PT: { score: 95, confidence: 85, sampleSize: 4000, year: 2018, studies: ['PISA 2018'], methodology: 'PISA direct measurement', caveats: ['Rapid improvement in recent years'] },
  GR: { score: 93, confidence: 80, sampleSize: 3500, year: 2018, studies: ['PISA 2018'], methodology: 'PISA direct measurement', caveats: ['Economic crisis may have affected education'] },
  
  // Europe - Eastern
  PL: { score: 99, confidence: 88, sampleSize: 8000, year: 2018, studies: ['PISA 2018'], methodology: 'PISA direct measurement', caveats: ['Rapid improvement since 2000'] },
  CZ: { score: 98, confidence: 85, sampleSize: 4000, year: 2018, studies: ['PISA 2018'], methodology: 'PISA direct measurement', caveats: ['Post-communist education reform'] },
  HU: { score: 97, confidence: 82, sampleSize: 3500, year: 2018, studies: ['PISA 2018'], methodology: 'PISA direct measurement', caveats: ['Brain drain emigration'] },
  RO: { score: 91, confidence: 75, sampleSize: 3000, year: 2018, studies: ['PISA 2018'], methodology: 'PISA direct measurement', caveats: ['Rural-urban divide'] },
  UA: { score: 95, confidence: 70, sampleSize: 5000, year: 2017, studies: ['TIMSS', 'National studies'], methodology: 'TIMSS + national data', caveats: ['War disruption since 2014/2022'] },
  RU: { score: 97, confidence: 75, sampleSize: 15000, year: 2018, studies: ['PISA 2018', 'National data'], methodology: 'PISA + national assessments', caveats: ['PISA participation ended 2022', 'Geographic vastness'] },
  
  // North America
  US: { score: 98, confidence: 92, sampleSize: 50000, year: 2019, studies: ['PISA 2018', 'NAEP', 'SAT/ACT norms'], methodology: 'Multiple standardized tests + meta-analysis', caveats: ['Significant racial/ethnic group differences', 'State-level variation'] },
  CA: { score: 100, confidence: 90, sampleSize: 12000, year: 2018, studies: ['PISA 2018'], methodology: 'PISA direct measurement', caveats: ['Provincial differences', 'High immigration'] },
  MX: { score: 88, confidence: 80, sampleSize: 15000, year: 2018, studies: ['PISA 2018'], methodology: 'PISA direct measurement', caveats: ['Rural-urban divide', 'Indigenous populations underrepresented'] },
  
  // South America
  BR: { score: 87, confidence: 78, sampleSize: 20000, year: 2018, studies: ['PISA 2018'], methodology: 'PISA direct measurement', caveats: ['Regional inequality extreme', 'Racial disparities'] },
  AR: { score: 93, confidence: 75, sampleSize: 8000, year: 2018, studies: ['PISA 2018'], methodology: 'PISA direct measurement', caveats: ['Economic instability affects education'] },
  CL: { score: 91, confidence: 80, sampleSize: 5000, year: 2018, studies: ['PISA 2018'], methodology: 'PISA direct measurement', caveats: ['Highest performer in South America'] },
  CO: { score: 84, confidence: 75, sampleSize: 6000, year: 2018, studies: ['PISA 2018'], methodology: 'PISA direct measurement', caveats: ['Conflict regions underrepresented'] },
  PE: { score: 85, confidence: 75, sampleSize: 5000, year: 2018, studies: ['PISA 2018'], methodology: 'PISA direct measurement', caveats: ['Indigenous populations underrepresented'] },
  
  // Middle East
  IL: { score: 95, confidence: 82, sampleSize: 5000, year: 2018, studies: ['PISA 2018'], methodology: 'PISA direct measurement', caveats: ['Excludes Arab-Israeli populations in some studies'] },
  TR: { score: 90, confidence: 78, sampleSize: 10000, year: 2018, studies: ['PISA 2018'], methodology: 'PISA direct measurement', caveats: ['East-West regional divide'] },
  SA: { score: 84, confidence: 65, sampleSize: 6000, year: 2018, studies: ['TIMSS'], methodology: 'TIMSS extrapolation', caveats: ['Gender-segregated education', 'Limited PISA participation'] },
  AE: { score: 86, confidence: 70, sampleSize: 5000, year: 2018, studies: ['PISA 2018', 'TIMSS'], methodology: 'PISA + TIMSS', caveats: ['Large expat population tested separately'] },
  IR: { score: 84, confidence: 60, sampleSize: 4000, year: 2015, studies: ['TIMSS 2015'], methodology: 'TIMSS extrapolation', caveats: ['No PISA participation', 'Sanctions affect education'] },
  
  // Africa
  ZA: { score: 77, confidence: 70, sampleSize: 8000, year: 2019, studies: ['TIMSS', 'National assessments'], methodology: 'TIMSS + national data', caveats: ['Apartheid legacy', 'Extreme inequality'] },
  NG: { score: 71, confidence: 55, sampleSize: 3000, year: 2017, studies: ['Regional studies'], methodology: 'Limited academic studies', caveats: ['Very limited sampling', 'Northern regions underrepresented'] },
  EG: { score: 82, confidence: 65, sampleSize: 4000, year: 2018, studies: ['TIMSS'], methodology: 'TIMSS extrapolation', caveats: ['Urban bias'] },
  KE: { score: 80, confidence: 60, sampleSize: 2500, year: 2018, studies: ['Regional studies'], methodology: 'Academic studies only', caveats: ['Limited national coverage'] },
  ET: { score: 68, confidence: 50, sampleSize: 1500, year: 2016, studies: ['Regional studies'], methodology: 'Very limited data', caveats: ['Extremely limited sampling', 'Rural areas excluded'] },
  
  // South Asia
  IN: { score: 82, confidence: 65, sampleSize: 15000, year: 2018, studies: ['ASER', 'State-level studies'], methodology: 'National + state assessments', caveats: ['Huge regional variation', 'Caste disparities', 'Urban bias'] },
  PK: { score: 80, confidence: 55, sampleSize: 4000, year: 2017, studies: ['Limited studies'], methodology: 'Academic studies only', caveats: ['Very limited data', 'Gender gap in education'] },
  BD: { score: 81, confidence: 60, sampleSize: 3000, year: 2018, studies: ['Regional studies'], methodology: 'Academic studies', caveats: ['Rapid education expansion', 'Quality concerns'] },
  
  // Southeast Asia
  VN: { score: 99, confidence: 80, sampleSize: 8000, year: 2018, studies: ['PISA 2018'], methodology: 'PISA direct measurement', caveats: ['Surprising outlier', 'May reflect education system focus'] },
  TH: { score: 91, confidence: 78, sampleSize: 7000, year: 2018, studies: ['PISA 2018'], methodology: 'PISA direct measurement', caveats: ['Urban-rural divide'] },
  PH: { score: 86, confidence: 72, sampleSize: 6000, year: 2018, studies: ['PISA 2018'], methodology: 'PISA direct measurement', caveats: ['Lowest PISA score in Southeast Asia'] },
  ID: { score: 87, confidence: 75, sampleSize: 12000, year: 2018, studies: ['PISA 2018'], methodology: 'PISA direct measurement', caveats: ['Archipelago sampling challenges'] },
  MY: { score: 92, confidence: 78, sampleSize: 5000, year: 2018, studies: ['PISA 2018'], methodology: 'PISA direct measurement', caveats: ['Ethnic group differences'] },
  
  // Oceania
  AU: { score: 100, confidence: 90, sampleSize: 14000, year: 2018, studies: ['PISA 2018', 'NAPLAN'], methodology: 'PISA + national assessment', caveats: ['Indigenous populations underperform', 'Immigration effects'] },
  NZ: { score: 99, confidence: 88, sampleSize: 5000, year: 2018, studies: ['PISA 2018'], methodology: 'PISA direct measurement', caveats: ['Māori-European gap'] },
};

// ============================================================================
// COLOR SCALE FOR IQ VISUALIZATION
// ============================================================================

export function getIQColor(score: number): string {
  if (score >= 105) return '#1E40AF'; // Dark blue - highest
  if (score >= 100) return '#3B82F6'; // Blue - above average
  if (score >= 95) return '#60A5FA';  // Light blue - average+
  if (score >= 90) return '#93C5FD';  // Very light blue - average
  if (score >= 85) return '#FCD34D';  // Yellow - below average
  if (score >= 80) return '#FBBF24';  // Amber
  if (score >= 75) return '#F59E0B';  // Orange
  if (score >= 70) return '#EF4444';  // Red
  return '#B91C1C';                   // Dark red - lowest
}

export function getIQCategory(score: number): string {
  if (score >= 105) return 'Mycket hög';
  if (score >= 100) return 'Över genomsnitt';
  if (score >= 95) return 'Genomsnitt';
  if (score >= 90) return 'Under genomsnitt';
  if (score >= 85) return 'Låg';
  if (score >= 80) return 'Mycket låg';
  return 'Extremt låg';
}

// ============================================================================
// IQ LEGEND COMPONENT
// ============================================================================

export function IQLegend({ className = '' }: { className?: string }) {
  const ranges = [
    { min: 105, max: 115, color: '#1E40AF', label: '105+' },
    { min: 100, max: 104, color: '#3B82F6', label: '100-104' },
    { min: 95, max: 99, color: '#60A5FA', label: '95-99' },
    { min: 90, max: 94, color: '#93C5FD', label: '90-94' },
    { min: 85, max: 89, color: '#FCD34D', label: '85-89' },
    { min: 80, max: 84, color: '#FBBF24', label: '80-84' },
    { min: 75, max: 79, color: '#F59E0B', label: '75-79' },
    { min: 70, max: 74, color: '#EF4444', label: '70-74' },
    { min: 0, max: 69, color: '#B91C1C', label: '<70' },
  ];

  return (
    <div className={`bg-white/95 backdrop-blur-sm rounded-xl shadow-lg p-3 ${className}`}>
      <p className="text-xs font-semibold text-slate-700 mb-2">🧠 IQ-snitt per land</p>
      <div className="flex flex-col gap-1">
        {ranges.map(r => (
          <div key={r.label} className="flex items-center gap-2">
            <div 
              className="w-4 h-3 rounded-sm" 
              style={{ backgroundColor: r.color }}
            />
            <span className="text-[10px] text-slate-600">{r.label}</span>
          </div>
        ))}
      </div>
      <p className="text-[9px] text-slate-400 mt-2 pt-2 border-t border-slate-100">
        Klicka på land för metodik
      </p>
    </div>
  );
}

// ============================================================================
// IQ METHODOLOGY DIALOG
// ============================================================================

interface IQMethodologyDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  countryCode: string;
  countryName: string;
}

export function IQMethodologyDialog({ 
  open, 
  onOpenChange, 
  countryCode, 
  countryName 
}: IQMethodologyDialogProps) {
  const data = IQ_DATA[countryCode];
  
  if (!data) {
    return (
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>🧠 IQ-data för {countryName}</DialogTitle>
            <DialogDescription>Ingen data tillgänglig</DialogDescription>
          </DialogHeader>
          <p className="text-sm text-slate-600">
            Vi har ingen tillförlitlig IQ-data för {countryName}. 
            Detta kan bero på brist på studier eller för gamla mätningar.
          </p>
        </DialogContent>
      </Dialog>
    );
  }

  const color = getIQColor(data.score);
  
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <span className="text-2xl">🧠</span>
            IQ-statistik: {countryName}
          </DialogTitle>
          <DialogDescription>
            Genomsnittlig uppmätt intelligenskvot och mätmetodik
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 mt-4">
          {/* Score display */}
          <div className="flex items-center gap-4 p-4 rounded-xl" style={{ backgroundColor: `${color}15` }}>
            <div 
              className="w-16 h-16 rounded-full flex items-center justify-center text-white text-2xl font-bold shadow-lg"
              style={{ backgroundColor: color }}
            >
              {data.score}
            </div>
            <div>
              <p className="text-lg font-semibold text-slate-800">{getIQCategory(data.score)}</p>
              <p className="text-sm text-slate-600">Genomsnittligt IQ-poäng</p>
              <p className="text-xs text-slate-500 mt-1">
                Konfidensgrad: {data.confidence}% • År: {data.year}
              </p>
            </div>
          </div>

          {/* Global comparison */}
          <div className="bg-slate-50 rounded-xl p-3">
            <p className="text-xs font-medium text-slate-700 mb-2">📊 Global jämförelse</p>
            <div className="relative h-3 bg-slate-200 rounded-full overflow-hidden">
              <div 
                className="absolute inset-y-0 left-0 rounded-full transition-all"
                style={{ 
                  width: `${Math.min(100, Math.max(0, ((data.score - 60) / 50) * 100))}%`,
                  background: `linear-gradient(90deg, ${getIQColor(70)}, ${getIQColor(90)}, ${getIQColor(110)})` 
                }}
              />
              <div 
                className="absolute top-1/2 -translate-y-1/2 w-3 h-3 bg-white border-2 rounded-full shadow-md"
                style={{ 
                  left: `${Math.min(98, Math.max(2, ((data.score - 60) / 50) * 100))}%`,
                  borderColor: color,
                  transform: 'translate(-50%, -50%)'
                }}
              />
            </div>
            <div className="flex justify-between text-[10px] text-slate-500 mt-1">
              <span>Lägst (≈70)</span>
              <span>Medel (100)</span>
              <span>Högst (≈110)</span>
            </div>
          </div>

          {/* Methodology */}
          <div className="border border-slate-200 rounded-xl p-3">
            <p className="text-xs font-medium text-slate-700 mb-2 flex items-center gap-1.5">
              <span>🔬</span> Hur mättes detta?
            </p>
            <p className="text-sm text-slate-600 mb-3">{data.methodology}</p>
            
            <p className="text-xs font-medium text-slate-700 mb-1">Datakällor:</p>
            <div className="flex flex-wrap gap-1.5 mb-3">
              {data.studies.map((study, i) => (
                <span key={i} className="px-2 py-0.5 bg-blue-50 text-blue-700 rounded text-xs">
                  {study}
                </span>
              ))}
            </div>
            
            {data.sampleSize && (
              <p className="text-xs text-slate-500">
                📋 Urvalsstorlek: {data.sampleSize.toLocaleString('sv-SE')} personer
              </p>
            )}
          </div>

          {/* Caveats - CRITICAL for transparency */}
          <div className="bg-amber-50 border border-amber-200 rounded-xl p-3">
            <p className="text-xs font-medium text-amber-800 mb-2 flex items-center gap-1.5">
              <span>⚠️</span> Viktiga begränsningar
            </p>
            <ul className="space-y-1">
              {data.caveats.map((caveat, i) => (
                <li key={i} className="text-xs text-amber-700 flex items-start gap-1.5">
                  <span className="text-amber-500">•</span>
                  {caveat}
                </li>
              ))}
            </ul>
          </div>

          {/* General disclaimer */}
          <div className="bg-slate-100 rounded-xl p-3">
            <p className="text-[10px] text-slate-500 leading-relaxed">
              <strong>Om IQ-mätningar:</strong> Intelligenskvot (IQ) mäter specifika kognitiva 
              förmågor och är inte ett komplett mått på mänsklig potential eller värde. 
              Nationella genomsnitt påverkas starkt av utbildningssystem, ekonomiska förhållanden, 
              och testets kulturella bias. Dessa siffror bör tolkas med stor försiktighet.
            </p>
          </div>

          <SourceAttribution
            sources={[
              { name: 'PISA (OECD)', url: 'https://www.oecd.org/pisa/', type: 'primary' },
              { name: 'TIMSS', url: 'https://timss2019.org/', type: 'primary' },
              { name: 'Lynn & Vanhanen meta-analyser', type: 'secondary' },
            ]}
            lastUpdated="2024"
            confidence={data.confidence}
          />
        </div>
      </DialogContent>
    </Dialog>
  );
}

export default IQLegend;
