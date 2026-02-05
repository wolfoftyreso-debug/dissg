/**
 * DECISION PREPARATION DOCUMENT GENERATOR
 * 
 * Generates structured preparation documents for board decisions.
 * NEVER recommends. ONLY exposes.
 */

import type {
  DecisionInput,
  DecisionPreparationDocument,
  DecisionAlternative,
  ConsequenceDimension,
  RelevantDataPoint,
  KnowledgeStatus,
  IrreversibilityLevel,
} from './types';

/**
 * DPD GENERATOR
 */
class DPDGenerator {
  private documents: Map<string, DecisionPreparationDocument> = new Map();

  /**
   * GENERATE DPD
   */
  generateDPD(input: DecisionInput): DecisionPreparationDocument {
    const dpd_id = `DPD-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    
    const dpd: DecisionPreparationDocument = {
      dpd_id,
      generated_at: new Date().toISOString(),
      version: '1.0',
      
      overview: {
        decision_subject: input.decision_context,
        population_affected: input.scope.population_affected,
        time_horizon: input.scope.time_horizon,
        irreversibility: this.assessIrreversibility(input),
        organization_type: input.organization_type,
        geo_scope: input.scope.geo,
      },
      
      alternatives: this.generateAlternatives(input),
      relevant_data: this.gatherRelevantData(input),
      relevant_indexes: this.gatherRelevantIndexes(input),
      consequence_surfaces: this.mapConsequenceSurfaces(input),
      knowledge_status: this.assessKnowledgeStatus(input),
      
      disclaimers: {
        not_a_recommendation: true,
        does_not_replace_responsibility: true,
        assumes_stated_assumptions: true,
        does_not_apply_to_individuals: true,
        custom: this.generateCustomDisclaimers(input),
      },
      
      constraints_acknowledged: input.constraints,
      assumptions_explicit: this.extractAssumptions(input),
    };
    
    this.documents.set(dpd_id, dpd);
    return dpd;
  }

  /**
   * ASSESS IRREVERSIBILITY
   */
  private assessIrreversibility(input: DecisionInput): IrreversibilityLevel {
    const context = input.decision_context.toLowerCase();
    
    if (context.includes('permanent') || context.includes('demolition')) {
      return 'permanent';
    }
    if (context.includes('major') || context.includes('structural')) {
      return 'high';
    }
    if (context.includes('investment') || context.includes('contract')) {
      return 'medium';
    }
    return 'low';
  }

  /**
   * GENERATE ALTERNATIVES (NEUTRAL)
   */
  private generateAlternatives(input: DecisionInput): DecisionAlternative[] {
    // Standard alternatives structure - content would be filled by domain logic
    return [
      {
        id: 'alt_a',
        label: 'Alternativ A: Full genomförande nu',
        description: 'Genomför beslutad åtgärd i sin helhet inom närmaste period',
        assumptions: ['Tillräcklig likviditet', 'Resurser tillgängliga'],
        requires: ['Fullständig finansiering', 'Kapacitet'],
        blocks: ['Parallella investeringar'],
      },
      {
        id: 'alt_b',
        label: 'Alternativ B: Delvis genomförande',
        description: 'Genomför del av åtgärden, skjut upp resterande',
        assumptions: ['Delning är tekniskt möjlig', 'Ingen väsentlig effektförlust'],
        requires: ['Delvis finansiering'],
        blocks: [],
      },
      {
        id: 'alt_c',
        label: 'Alternativ C: Avvakta och omvärdera',
        description: 'Skjut upp beslut till senare tillfälle med ny bedömning',
        assumptions: ['Situationen förändras', 'Ingen akut risk'],
        requires: ['Acceptabel risk vid uppskjutande'],
        blocks: [],
      },
    ];
  }

  /**
   * GATHER RELEVANT DATA
   */
  private gatherRelevantData(input: DecisionInput): RelevantDataPoint[] {
    // Would connect to actual data sources
    return [
      {
        source: 'Kostnadsindex',
        metric: 'Kostnadsutveckling',
        baseline: 100,
        current: 112,
        trend: 'declining',
        uncertainty: 0.15,
        last_updated: new Date().toISOString(),
      },
      {
        source: 'Ränteindex',
        metric: 'Finansieringskostnad',
        baseline: 2.5,
        current: 3.8,
        trend: 'stable',
        uncertainty: 0.2,
        last_updated: new Date().toISOString(),
      },
    ];
  }

  /**
   * GATHER RELEVANT INDEXES
   */
  private gatherRelevantIndexes(input: DecisionInput): DecisionPreparationDocument['relevant_indexes'] {
    // Would connect to system indexes
    return [
      {
        index_id: 'liquidity_pressure',
        index_name: 'Likviditetsbelastning',
        value: 0.65,
        trend: 'stable',
        relevance: 'primary',
      },
      {
        index_id: 'risk_exposure',
        index_name: 'Riskexponering',
        value: 0.42,
        trend: 'increasing',
        relevance: 'secondary',
      },
    ];
  }

  /**
   * MAP CONSEQUENCE SURFACES
   */
  private mapConsequenceSurfaces(
    input: DecisionInput
  ): Record<string, ConsequenceDimension[]> {
    const dimensions: ConsequenceDimension[] = [
      {
        dimension: 'Ekonomi',
        visible_effect: true,
        uncertainty: 'medium',
        time_dependency: '1-5 år',
        notes: null,
      },
      {
        dimension: 'Likviditet',
        visible_effect: true,
        uncertainty: 'low',
        time_dependency: '0-1 år',
        notes: null,
      },
      {
        dimension: 'Risk över tid',
        visible_effect: true,
        uncertainty: 'high',
        time_dependency: '5-30 år',
        notes: 'Svår att kvantifiera',
      },
      {
        dimension: 'Reversibilitet',
        visible_effect: false,
        uncertainty: 'low',
        time_dependency: 'Permanent',
        notes: null,
      },
    ];

    return {
      alt_a: dimensions,
      alt_b: dimensions.map(d => ({ ...d, uncertainty: 'medium' as const })),
      alt_c: dimensions.map(d => ({ ...d, visible_effect: false })),
    };
  }

  /**
   * ASSESS KNOWLEDGE STATUS
   */
  private assessKnowledgeStatus(input: DecisionInput): KnowledgeStatus {
    return {
      known: [
        'Nuvarande kostnadsläge',
        'Befintlig likviditet',
        'Regelverk och krav',
        'Historiska jämförelsetal',
      ],
      uncertain: [
        'Framtida kostnadsutveckling',
        'Ränteutveckling',
        'Teknisk livslängd',
        'Regulatoriska förändringar',
      ],
      unknown: [
        'Oförutsedda händelser',
        'Marknadsstörningar',
        'Långsiktiga systemeffekter',
      ],
    };
  }

  /**
   * GENERATE CUSTOM DISCLAIMERS
   */
  private generateCustomDisclaimers(input: DecisionInput): string[] {
    const disclaimers: string[] = [];
    
    if (input.scope.time_horizon.includes('30')) {
      disclaimers.push('Långsiktiga prognoser har inherent hög osäkerhet');
    }
    
    if (input.scope.population_affected > 100) {
      disclaimers.push('Beslut påverkar många individer med varierande situation');
    }
    
    return disclaimers;
  }

  /**
   * EXTRACT ASSUMPTIONS
   */
  private extractAssumptions(input: DecisionInput): string[] {
    return [
      'Ekonomiska förhållanden förblir stabila',
      'Inga extraordinära händelser inträffar',
      'Tillgänglig data är korrekt',
      'Nuvarande regelverk gäller',
    ];
  }

  /**
   * GET DPD
   */
  getDPD(dpdId: string): DecisionPreparationDocument | null {
    return this.documents.get(dpdId) || null;
  }

  /**
   * LIST ALL DPDs
   */
  listDPDs(): DecisionPreparationDocument[] {
    return Array.from(this.documents.values());
  }
}

/**
 * SINGLETON
 */
export const dpdGenerator = new DPDGenerator();
