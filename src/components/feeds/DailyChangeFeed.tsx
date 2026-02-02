/**
 * WAVE 9: BLOCK BU — DAILY "WHAT ACTUALLY CHANGED?" FEED
 * 
 * Daglig sammanfattning av verkliga förändringar.
 * Inga rubriker. Bara förändring.
 */

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  TrendingUp, 
  TrendingDown, 
  AlertTriangle, 
  Globe, 
  Calendar,
  ExternalLink,
  ChevronDown,
  ChevronUp,
  Info
} from 'lucide-react';
import { 
  ChangeObject, 
  CHANGE_LANGUAGE, 
  type ChangeType,
  type FeedLevel 
} from '@/config/dailyChangeConfig';

interface DailyChangeFeedProps {
  feedLevel?: FeedLevel;
}

export function DailyChangeFeed({ feedLevel = 'national' }: DailyChangeFeedProps) {
  const [expandedChanges, setExpandedChanges] = useState<Set<string>>(new Set());
  const [selectedLevel, setSelectedLevel] = useState<FeedLevel>(feedLevel);

  // Mock data for demonstration
  const mockChanges: ChangeObject[] = [
    {
      changeId: 'chg_se_unemp_2024',
      whatChanged: {
        entityType: 'kpi',
        entityId: 'kpi_unemployment',
        entityLabel: 'Arbetslöshet',
        previousValue: 7.2,
        currentValue: 7.8,
        changeType: 'acceleration'
      },
      where: {
        scope: 'national',
        countryCode: 'SE',
        label: 'Sverige'
      },
      when: {
        detectedAt: '2024-01-15T06:00:00Z',
        occurredAt: '2024-01-01',
        period: '2024-Q1'
      },
      magnitude: {
        absolute: 0.6,
        relative: 8.3,
        percentile: 85,
        severity: 'notable'
      },
      relatedFactors: [
        {
          factorId: 'policy_rate',
          factorType: 'economic_variable',
          factorLabel: 'Styrränta',
          relationship: 'precedes',
          strength: 0.45,
          lag: 9,
          confidence: 0.72,
          neutralDescription: 'Räntehöjningarna under 2023 föregick förändringen'
        }
      ],
      confidence: 0.88,
      linksToData: [
        {
          type: 'source',
          url: 'https://scb.se/',
          label: 'SCB'
        }
      ],
      generatedAt: '2024-01-15T06:15:00Z',
      method: 'time_series_analysis'
    },
    {
      changeId: 'chg_se_energy_2024',
      whatChanged: {
        entityType: 'kpi',
        entityId: 'kpi_energy_price',
        entityLabel: 'Elpriser',
        previousValue: 1.85,
        currentValue: 1.42,
        changeType: 'reversal'
      },
      where: {
        scope: 'national',
        countryCode: 'SE',
        label: 'Sverige'
      },
      when: {
        detectedAt: '2024-01-14T06:00:00Z',
        occurredAt: '2024-01-01',
        period: '2024-Q1'
      },
      magnitude: {
        absolute: -0.43,
        relative: -23.2,
        percentile: 15,
        severity: 'significant'
      },
      relatedFactors: [
        {
          factorId: 'weather_mild',
          factorType: 'event',
          factorLabel: 'Mild vinter',
          relationship: 'coincides',
          confidence: 0.65,
          neutralDescription: 'Mildare väder sammanföll med prisnedgången'
        }
      ],
      confidence: 0.92,
      linksToData: [
        {
          type: 'source',
          url: 'https://www.svk.se/',
          label: 'Svenska Kraftnät'
        }
      ],
      generatedAt: '2024-01-14T06:15:00Z',
      method: 'observational'
    }
  ];

  const toggleExpanded = (changeId: string) => {
    setExpandedChanges(prev => {
      const next = new Set(prev);
      if (next.has(changeId)) {
        next.delete(changeId);
      } else {
        next.add(changeId);
      }
      return next;
    });
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'extreme': return 'bg-red-500 text-white';
      case 'major': return 'bg-orange-500 text-white';
      case 'significant': return 'bg-yellow-500 text-black';
      case 'notable': return 'bg-blue-500 text-white';
      default: return 'bg-muted text-muted-foreground';
    }
  };

  const getChangeIcon = (changeType: ChangeType, magnitude?: number) => {
    if (changeType === 'reversal' || changeType === 'trend_break') {
      return <AlertTriangle className="h-4 w-4 text-yellow-500" />;
    }
    if (magnitude && magnitude > 0) {
      return <TrendingUp className="h-4 w-4 text-blue-500" />;
    }
    return <TrendingDown className="h-4 w-4 text-orange-500" />;
  };

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString('sv-SE', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  return (
    <Card>
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg flex items-center gap-2">
            <Calendar className="h-5 w-5 text-primary" />
            Vad förändrades idag?
          </CardTitle>
          <Badge variant="outline">{mockChanges.length} förändringar</Badge>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-4">
        {/* Feed Level Selector */}
        <Tabs value={selectedLevel} onValueChange={(v) => setSelectedLevel(v as FeedLevel)}>
          <TabsList className="grid grid-cols-4 w-full">
            <TabsTrigger value="global" className="text-xs">
              <Globe className="h-3 w-3 mr-1" />
              Global
            </TabsTrigger>
            <TabsTrigger value="regional" className="text-xs">Norden</TabsTrigger>
            <TabsTrigger value="national" className="text-xs">Sverige</TabsTrigger>
            <TabsTrigger value="thematic" className="text-xs">Ekonomi</TabsTrigger>
          </TabsList>
        </Tabs>

        {/* Changes List */}
        <div className="space-y-3">
          {mockChanges.map(change => {
            const isExpanded = expandedChanges.has(change.changeId);
            const changeLanguage = CHANGE_LANGUAGE[change.whatChanged.changeType];
            
            return (
              <div 
                key={change.changeId}
                className="border rounded-lg overflow-hidden"
              >
                {/* Change Header */}
                <button
                  className="w-full p-3 flex items-start gap-3 hover:bg-muted/50 transition-colors text-left"
                  onClick={() => toggleExpanded(change.changeId)}
                >
                  <div className="mt-0.5">
                    {getChangeIcon(change.whatChanged.changeType, change.magnitude.relative)}
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-medium">{change.whatChanged.entityLabel}</span>
                      <Badge variant="secondary" className="text-xs">
                        {change.where.label}
                      </Badge>
                      <Badge className={`text-xs ${getSeverityColor(change.magnitude.severity)}`}>
                        {change.magnitude.severity}
                      </Badge>
                    </div>
                    
                    <p className="text-sm text-muted-foreground mt-1">
                      {changeLanguage?.sv}: {change.whatChanged.previousValue} → {change.whatChanged.currentValue}
                      {change.magnitude.relative && (
                        <span className={change.magnitude.relative > 0 ? 'text-blue-500' : 'text-orange-500'}>
                          {' '}({change.magnitude.relative > 0 ? '+' : ''}{change.magnitude.relative.toFixed(1)}%)
                        </span>
                      )}
                    </p>
                    
                    <div className="flex items-center gap-2 mt-1 text-xs text-muted-foreground">
                      <span>{formatDate(change.when.occurredAt)}</span>
                      <span>•</span>
                      <span>Konfidens: {(change.confidence * 100).toFixed(0)}%</span>
                    </div>
                  </div>
                  
                  {isExpanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                </button>

                {/* Expanded Details */}
                {isExpanded && (
                  <div className="border-t p-3 space-y-3 bg-muted/30">
                    {/* Related Factors */}
                    {change.relatedFactors.length > 0 && (
                      <div>
                        <h4 className="text-sm font-medium mb-2">Relaterade faktorer</h4>
                        <div className="space-y-2">
                          {change.relatedFactors.map((factor, idx) => (
                            <div key={idx} className="text-sm p-2 bg-background rounded">
                              <div className="flex items-center gap-2">
                                <Badge variant="outline" className="text-xs">
                                  {factor.relationship}
                                </Badge>
                                <span className="font-medium">{factor.factorLabel}</span>
                                {factor.lag && (
                                  <span className="text-xs text-muted-foreground">
                                    ({factor.lag} mån fördröjning)
                                  </span>
                                )}
                              </div>
                              <p className="text-muted-foreground mt-1">
                                {factor.neutralDescription}
                              </p>
                              <div className="text-xs text-muted-foreground mt-1">
                                Konfidens: {(factor.confidence * 100).toFixed(0)}%
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Data Links */}
                    <div className="flex items-center gap-2">
                      <span className="text-sm text-muted-foreground">Källor:</span>
                      {change.linksToData.map((link, idx) => (
                        <Button key={idx} variant="outline" size="sm" className="h-7 text-xs" asChild>
                          <a href={link.url} target="_blank" rel="noopener noreferrer">
                            {link.label}
                            <ExternalLink className="h-3 w-3 ml-1" />
                          </a>
                        </Button>
                      ))}
                    </div>

                    {/* Methodology */}
                    <div className="text-xs text-muted-foreground">
                      Metod: {change.method.replace(/_/g, ' ')}
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Disclaimer */}
        <div className="flex items-start gap-2 p-2 bg-muted/30 rounded text-xs text-muted-foreground">
          <Info className="h-4 w-4 shrink-0 mt-0.5" />
          <p>
            "Relaterade faktorer" visar samvariation, inte nödvändigtvis orsak. 
            Eventuella fel härrör från ursprunglig datakälla.
          </p>
        </div>
      </CardContent>
    </Card>
  );
}

export default DailyChangeFeed;
