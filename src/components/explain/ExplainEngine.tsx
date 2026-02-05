 /**
  * EXPLAIN THIS LIKE I'M HUMAN (ETLIH)
  * Full indicator selector with all available metrics
  */
 
 import React, { useState, useCallback } from 'react';
 import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
 import { Button } from '@/components/ui/button';
 import { Badge } from '@/components/ui/badge';
 import { Alert, AlertDescription } from '@/components/ui/alert';
 import { Separator } from '@/components/ui/separator';
 import { Skeleton } from '@/components/ui/skeleton';
 import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
 import { ScrollArea } from '@/components/ui/scroll-area';
 import {
   ETLIH_CORE_PRINCIPLE,
   ETLIH_NEVER_DOES,
   EXPLANATION_LEVELS,
   DOES_NOT_MEAN,
   LANGUAGE_PRINCIPLES,
   READABILITY_TARGET,
   LINKED_RESOURCES,
   getApplicableWarnings,
   getLevelConfig,
   type ExplanationLevel,
   type DataContext
 } from '@/config/explainEngineConfig';
 
 const INDICATOR_CATEGORIES = [
   { id: 'economy', label: 'Ekonomi', marker: '[E]' },
   { id: 'health', label: 'Hälsa', marker: '[H]' },
   { id: 'labor', label: 'Arbete', marker: '[A]' },
   { id: 'education', label: 'Utbildning', marker: '[U]' },
   { id: 'environment', label: 'Miljö', marker: '[M]' },
   { id: 'demographics', label: 'Demografi', marker: '[D]' },
   { id: 'governance', label: 'Styrning', marker: '[G]' },
   { id: 'social', label: 'Sociala', marker: '[S]' },
 ];
 
 const AVAILABLE_INDICATORS = [
   { id: 'gdp_per_capita', label: 'BNP per capita', category: 'economy', sensitivity: 'low' as const },
   { id: 'gdp_growth', label: 'BNP-tillväxt', category: 'economy', sensitivity: 'low' as const },
   { id: 'inflation_rate', label: 'Inflationstakt', category: 'economy', sensitivity: 'low' as const },
   { id: 'gini_coefficient', label: 'Gini-koefficient', category: 'economy', sensitivity: 'medium' as const },
   { id: 'life_expectancy', label: 'Förväntad livslängd', category: 'health', sensitivity: 'low' as const },
   { id: 'infant_mortality', label: 'Spädbarnsdödlighet', category: 'health', sensitivity: 'low' as const },
   { id: 'healthcare_spending', label: 'Vårdutgifter', category: 'health', sensitivity: 'low' as const },
   { id: 'unemployment_rate', label: 'Arbetslöshet', category: 'labor', sensitivity: 'low' as const },
   { id: 'median_wage', label: 'Medianlön', category: 'labor', sensitivity: 'low' as const },
   { id: 'gender_pay_gap', label: 'Lönegap (kön)', category: 'labor', sensitivity: 'medium' as const },
   { id: 'pisa_score', label: 'PISA-resultat', category: 'education', sensitivity: 'low' as const },
   { id: 'tertiary_enrollment', label: 'Högskoleinskrivning', category: 'education', sensitivity: 'low' as const },
   { id: 'co2_emissions', label: 'CO₂-utsläpp', category: 'environment', sensitivity: 'low' as const },
   { id: 'renewable_energy', label: 'Förnybar energi', category: 'environment', sensitivity: 'low' as const },
   { id: 'population', label: 'Befolkning', category: 'demographics', sensitivity: 'low' as const },
   { id: 'net_migration', label: 'Nettomigration', category: 'demographics', sensitivity: 'medium' as const },
   { id: 'democracy_index', label: 'Demokratiindex', category: 'governance', sensitivity: 'medium' as const },
   { id: 'corruption_index', label: 'Korruptionsindex', category: 'governance', sensitivity: 'medium' as const },
   { id: 'crime_rate', label: 'Brottslighet', category: 'social', sensitivity: 'medium' as const },
   { id: 'lgbtq_rights', label: 'HBTQ+-rättigheter', category: 'social', sensitivity: 'high' as const },
 ];
 
 const GEOGRAPHY_OPTIONS = [
   { id: 'SE', label: 'Sverige', type: 'national' as const },
   { id: 'NO', label: 'Norge', type: 'national' as const },
   { id: 'DK', label: 'Danmark', type: 'national' as const },
   { id: 'DE', label: 'Tyskland', type: 'national' as const },
   { id: 'US', label: 'USA', type: 'national' as const },
   { id: 'GLOBAL', label: 'Global', type: 'global' as const },
 ];
 
 const TIME_PERIODS = [
   { id: '2020-2024', label: '2020-2024', span: 'medium' as const },
   { id: '2014-2024', label: '2014-2024', span: 'long' as const },
   { id: '2000-2024', label: '2000-2024', span: 'long' as const },
 ];
 
 const useExplainStream = () => {
   const [isLoading, setIsLoading] = useState(false);
   const [explanation, setExplanation] = useState('');
   const [error, setError] = useState<string | null>(null);
   const explain = useCallback(async (context: DataContext, level: ExplanationLevel) => {
     setIsLoading(true); setExplanation(''); setError(null);
     try {
       const resp = await fetch(`${import.meta.env.VITE_SUPABASE_URL}/functions/v1/ai-explain`, {
         method: "POST", headers: { "Content-Type": "application/json", Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY}` },
         body: JSON.stringify({ context, level, language: 'sv' }),
       });
       if (!resp.ok || !resp.body) throw new Error("Failed");
       const reader = resp.body.getReader(); const decoder = new TextDecoder(); let buf = "", full = "";
       while (true) { const { done, value } = await reader.read(); if (done) break; buf += decoder.decode(value, { stream: true });
         let idx; while ((idx = buf.indexOf("\n")) !== -1) { let ln = buf.slice(0, idx); buf = buf.slice(idx + 1);
           if (!ln.startsWith("data: ")) continue; const js = ln.slice(6).trim(); if (js === "[DONE]") break;
           try { const p = JSON.parse(js); const c = p.choices?.[0]?.delta?.content; if (c) { full += c; setExplanation(full); } } catch {} } }
     } catch { setError('Kunde inte generera förklaring.'); } finally { setIsLoading(false); }
   }, []);
   return { explain, explanation, isLoading, error };
 };
 
 export const ExplainEngine: React.FC<{ context: DataContext; visibilityReasons?: string[]; onClose?: () => void }> = ({ context, visibilityReasons = [], onClose }) => {
   const [level, setLevel] = useState<ExplanationLevel>('quick');
   const { explain, explanation, isLoading, error } = useExplainStream();
   const cfg = getLevelConfig(level);
   return (
     <Card className="max-w-2xl">
       <CardHeader><div className="flex items-center gap-2"><span className="font-mono text-primary">[AI]</span><CardTitle>Förklara för mig</CardTitle></div><CardDescription>{ETLIH_CORE_PRINCIPLE.sv}</CardDescription></CardHeader>
       <CardContent className="space-y-4">
         <div className="p-3 bg-muted/30 rounded-sm flex flex-wrap gap-2"><Badge variant="secondary">{context.indicatorLabel}</Badge><Badge variant="outline">{context.geographyLabel}</Badge><Badge variant="outline">{context.timePeriod}</Badge></div>
         <div className="grid grid-cols-3 gap-2">{EXPLANATION_LEVELS.map(l => (<button key={l.id} onClick={() => setLevel(l.id)} className={`p-3 rounded-sm border text-left ${level === l.id ? 'border-primary bg-primary/5' : 'border-border'}`}><div className="flex items-center gap-2"><div className="w-2 h-2 rounded-sm" style={{ backgroundColor: l.color }} /><span className="text-sm font-medium">{l.labelSv}</span></div><div className="text-xs text-muted-foreground font-mono mt-1">[T] {l.durationSv}</div></button>))}</div>
         <Button onClick={() => explain(context, level)} disabled={isLoading} className="w-full">{isLoading ? 'Genererar...' : `Förklara [→]`}</Button>
         {error && <Alert><AlertDescription>{error}</AlertDescription></Alert>}
         {explanation && <Card className="border-l-2" style={{ borderLeftColor: cfg.color }}><CardContent className="pt-4 prose prose-sm dark:prose-invert"><p className="whitespace-pre-wrap">{explanation}</p></CardContent></Card>}
         <Separator />
         <div className="flex flex-wrap gap-2">{ETLIH_NEVER_DOES.map((n, i) => <Badge key={i} variant="outline" className="font-mono text-xs">[X] {n.sv}</Badge>)}</div>
       </CardContent>
     </Card>
   );
 };
 
 export const ExplainEngineDemo: React.FC = () => {
   const [ind, setInd] = useState('gdp_per_capita');
   const [geo, setGeo] = useState('SE');
   const [time, setTime] = useState('2014-2024');
   const [cat, setCat] = useState<string | null>(null);
   const indicator = AVAILABLE_INDICATORS.find(i => i.id === ind);
   const geography = GEOGRAPHY_OPTIONS.find(g => g.id === geo);
   const period = TIME_PERIODS.find(t => t.id === time);
   const filtered = cat ? AVAILABLE_INDICATORS.filter(i => i.category === cat) : AVAILABLE_INDICATORS;
   const ctx: DataContext = { indicator: ind, indicatorLabel: indicator?.label || '', geography: geography?.type || 'national', geographyLabel: geography?.label || '', timePeriod: time, timeSpan: period?.span || 'medium', zoomLevel: 'overview', sensitivity: indicator?.sensitivity || 'low', dataQuality: 80, uncertainty: 12, currentValue: 50000, trend: 'up', changePercent: 5 };
   return (
     <div className="space-y-6 p-4 max-w-4xl mx-auto">
       <div className="text-center"><h1 className="text-2xl font-bold flex items-center justify-center gap-2"><span className="font-mono text-primary">[AI]</span> Explain This Like I'm Human</h1><p className="text-muted-foreground">Förklara exakt det jag tittar på – på rätt nivå.</p></div>
       <Alert className="bg-primary/5 border-primary/20"><AlertDescription><span className="font-mono text-xs mr-2">[i]</span><strong>Kärnprincip:</strong> {ETLIH_CORE_PRINCIPLE.sv}</AlertDescription></Alert>
       <div className="p-4 bg-muted/20 rounded-sm border space-y-4">
         <div className="text-[10px] font-mono text-muted-foreground uppercase tracking-wider">VÄLJ DATA ATT FÖRKLARA</div>
         <div className="flex flex-wrap gap-1"><Button variant={cat === null ? "secondary" : "ghost"} size="sm" className="h-7 text-xs font-mono" onClick={() => setCat(null)}>[*] Alla</Button>{INDICATOR_CATEGORIES.map(c => <Button key={c.id} variant={cat === c.id ? "secondary" : "ghost"} size="sm" className="h-7 text-xs font-mono" onClick={() => setCat(c.id)}>{c.marker} {c.label}</Button>)}</div>
         <div className="grid md:grid-cols-3 gap-3">
           <div><label className="text-[10px] font-mono text-muted-foreground uppercase block mb-1">Indikator</label><Select value={ind} onValueChange={setInd}><SelectTrigger className="h-9 bg-background"><SelectValue /></SelectTrigger><SelectContent className="bg-background"><ScrollArea className="h-60">{filtered.map(i => <SelectItem key={i.id} value={i.id}>{i.label}</SelectItem>)}</ScrollArea></SelectContent></Select></div>
           <div><label className="text-[10px] font-mono text-muted-foreground uppercase block mb-1">Geografi</label><Select value={geo} onValueChange={setGeo}><SelectTrigger className="h-9 bg-background"><SelectValue /></SelectTrigger><SelectContent className="bg-background">{GEOGRAPHY_OPTIONS.map(g => <SelectItem key={g.id} value={g.id}>{g.label}</SelectItem>)}</SelectContent></Select></div>
           <div><label className="text-[10px] font-mono text-muted-foreground uppercase block mb-1">Period</label><Select value={time} onValueChange={setTime}><SelectTrigger className="h-9 bg-background"><SelectValue /></SelectTrigger><SelectContent className="bg-background">{TIME_PERIODS.map(t => <SelectItem key={t.id} value={t.id}>{t.label}</SelectItem>)}</SelectContent></Select></div>
         </div>
       </div>
       <ExplainEngine context={ctx} />
     </div>
   );
 };
 
 export default ExplainEngine;