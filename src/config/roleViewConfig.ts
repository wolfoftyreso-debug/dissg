import { AppRole } from '@/hooks/useUserRole';

export interface RoleViewConfig {
  role: AppRole;
  displayName: string;
  description: string;
  dashboardTitle: string;
  focusAreas: string[];
  allowedNavItems: string[];
  kpiFilters: {
    showAll: boolean;
    categories?: string[];
    responsibilityAreas?: string[];
  };
  features: {
    canPrioritizeActions: boolean;
    canViewAllKPIs: boolean;
    canViewDepartmentKPIs: boolean;
    canViewAgencyKPIs: boolean;
    canEditWeights: boolean;
    canAddActions: boolean;
    canApproveActions: boolean;
    canViewSensitiveData: boolean;
    canExportData: boolean;
    canManageUsers: boolean;
  };
  defaultTimeframe: 'week' | 'month' | 'quarter' | 'year';
  priorityThreshold: number; // Only show actions above this priority score
}

export const ROLE_VIEW_CONFIGS: Record<AppRole, RoleViewConfig> = {
  public: {
    role: 'public',
    displayName: 'Allmänhet',
    description: 'Öppen tillgång till aggregerad data och transparensinformation',
    dashboardTitle: 'Sveriges Lägesbild',
    focusAreas: ['Övergripande trender', 'Offentliga beslut', 'Politikerprofiler'],
    allowedNavItems: ['overview', 'indicators', 'decisions'],
    kpiFilters: {
      showAll: true,
    },
    features: {
      canPrioritizeActions: false,
      canViewAllKPIs: true,
      canViewDepartmentKPIs: false,
      canViewAgencyKPIs: false,
      canEditWeights: false,
      canAddActions: false,
      canApproveActions: false,
      canViewSensitiveData: false,
      canExportData: false,
      canManageUsers: false,
    },
    defaultTimeframe: 'quarter',
    priorityThreshold: 0,
  },

  researcher: {
    role: 'researcher',
    displayName: 'Forskare / Analytiker',
    description: 'Utökad datatillgång för analys och forskning',
    dashboardTitle: 'Analysverktyg',
    focusAreas: ['Detaljerad data', 'Historiska trender', 'Korrelationsanalys'],
    allowedNavItems: ['overview', 'indicators', 'analysis', 'decisions'],
    kpiFilters: {
      showAll: true,
    },
    features: {
      canPrioritizeActions: false,
      canViewAllKPIs: true,
      canViewDepartmentKPIs: true,
      canViewAgencyKPIs: true,
      canEditWeights: false,
      canAddActions: false,
      canApproveActions: false,
      canViewSensitiveData: false,
      canExportData: true,
      canManageUsers: false,
    },
    defaultTimeframe: 'year',
    priorityThreshold: 0,
  },

  department_lead: {
    role: 'department_lead',
    displayName: 'Myndighetschef',
    description: 'Fokuserad vy för myndighetsspecifika indikatorer och åtgärder',
    dashboardTitle: 'Myndighetsöversikt',
    focusAreas: ['Myndighetens KPI:er', 'Operativa åtgärder', 'Rapportering uppåt'],
    allowedNavItems: ['overview', 'indicators', 'responsibility', 'analysis', 'decisions'],
    kpiFilters: {
      showAll: false,
      responsibilityAreas: [], // Filled dynamically based on user's assigned areas
    },
    features: {
      canPrioritizeActions: true,
      canViewAllKPIs: false,
      canViewDepartmentKPIs: true,
      canViewAgencyKPIs: true,
      canEditWeights: false,
      canAddActions: true,
      canApproveActions: false,
      canViewSensitiveData: true,
      canExportData: true,
      canManageUsers: false,
    },
    defaultTimeframe: 'month',
    priorityThreshold: 40,
  },

  minister: {
    role: 'minister',
    displayName: 'Statsråd',
    description: 'Departementsfokuserad vy med beslutsunderlag',
    dashboardTitle: 'Departementsöversikt',
    focusAreas: ['Departementets KPI:er', 'Prioriterade åtgärder', 'Tvärsektoriella beroenden'],
    allowedNavItems: ['overview', 'indicators', 'responsibility', 'analysis', 'decisions'],
    kpiFilters: {
      showAll: false,
      categories: [], // Filled dynamically based on department
    },
    features: {
      canPrioritizeActions: true,
      canViewAllKPIs: true,
      canViewDepartmentKPIs: true,
      canViewAgencyKPIs: true,
      canEditWeights: true,
      canAddActions: true,
      canApproveActions: true,
      canViewSensitiveData: true,
      canExportData: true,
      canManageUsers: false,
    },
    defaultTimeframe: 'quarter',
    priorityThreshold: 50,
  },

  prime_minister: {
    role: 'prime_minister',
    displayName: 'Statsminister',
    description: 'Fullständig systemöversikt med strategiskt beslutsstöd',
    dashboardTitle: 'Statsministerns Lägesbild',
    focusAreas: ['Systemrisk', 'Kritiska indikatorer', 'Strategiska beslut', 'Tvärsektoriell analys'],
    allowedNavItems: ['overview', 'indicators', 'responsibility', 'analysis', 'decisions'],
    kpiFilters: {
      showAll: true,
    },
    features: {
      canPrioritizeActions: true,
      canViewAllKPIs: true,
      canViewDepartmentKPIs: true,
      canViewAgencyKPIs: true,
      canEditWeights: true,
      canAddActions: true,
      canApproveActions: true,
      canViewSensitiveData: true,
      canExportData: true,
      canManageUsers: true,
    },
    defaultTimeframe: 'quarter',
    priorityThreshold: 60, // Only show high-priority items
  },

  system_admin: {
    role: 'system_admin',
    displayName: 'Systemadministratör',
    description: 'Full systemåtkomst för teknisk administration',
    dashboardTitle: 'Systemadministration',
    focusAreas: ['Systemhälsa', 'Datakvalitet', 'Användarhantering'],
    allowedNavItems: ['overview', 'indicators', 'responsibility', 'analysis', 'decisions'],
    kpiFilters: {
      showAll: true,
    },
    features: {
      canPrioritizeActions: true,
      canViewAllKPIs: true,
      canViewDepartmentKPIs: true,
      canViewAgencyKPIs: true,
      canEditWeights: true,
      canAddActions: true,
      canApproveActions: true,
      canViewSensitiveData: true,
      canExportData: true,
      canManageUsers: true,
    },
    defaultTimeframe: 'week',
    priorityThreshold: 0,
  },

  // Swedish government roles
  statsminister: {
    role: 'statsminister',
    displayName: 'Statsminister',
    description: 'Högsta regeringsnivå med fullständig systemöversikt',
    dashboardTitle: 'Statsministerns Lägesbild',
    focusAreas: ['Systemrisk', 'Kritiska indikatorer', 'Strategiska beslut', 'Tvärsektoriell analys'],
    allowedNavItems: ['overview', 'indicators', 'responsibility', 'analysis', 'decisions', 'admin'],
    kpiFilters: {
      showAll: true,
    },
    features: {
      canPrioritizeActions: true,
      canViewAllKPIs: true,
      canViewDepartmentKPIs: true,
      canViewAgencyKPIs: true,
      canEditWeights: true,
      canAddActions: true,
      canApproveActions: true,
      canViewSensitiveData: true,
      canExportData: true,
      canManageUsers: true,
    },
    defaultTimeframe: 'quarter',
    priorityThreshold: 60,
  },

  departementsansvarig: {
    role: 'departementsansvarig',
    displayName: 'Departementsansvarig',
    description: 'Departementsövergripande ansvar med fokus på sektorspecifika KPI:er',
    dashboardTitle: 'Departementsöversikt',
    focusAreas: ['Departementets KPI:er', 'Prioriterade åtgärder', 'Tvärsektoriella beroenden'],
    allowedNavItems: ['overview', 'indicators', 'responsibility', 'analysis', 'decisions'],
    kpiFilters: {
      showAll: false,
      categories: [],
    },
    features: {
      canPrioritizeActions: true,
      canViewAllKPIs: true,
      canViewDepartmentKPIs: true,
      canViewAgencyKPIs: true,
      canEditWeights: true,
      canAddActions: true,
      canApproveActions: true,
      canViewSensitiveData: true,
      canExportData: true,
      canManageUsers: false,
    },
    defaultTimeframe: 'quarter',
    priorityThreshold: 50,
  },

  operativ: {
    role: 'operativ',
    displayName: 'Operativ nivå',
    description: 'Regional och kommunal operativ nivå med fokus på genomförande',
    dashboardTitle: 'Operativ Översikt',
    focusAreas: ['Regionala KPI:er', 'Operativa åtgärder', 'Lokal anpassning'],
    allowedNavItems: ['overview', 'indicators', 'responsibility', 'analysis'],
    kpiFilters: {
      showAll: false,
      responsibilityAreas: [],
    },
    features: {
      canPrioritizeActions: true,
      canViewAllKPIs: false,
      canViewDepartmentKPIs: true,
      canViewAgencyKPIs: true,
      canEditWeights: false,
      canAddActions: true,
      canApproveActions: false,
      canViewSensitiveData: true,
      canExportData: true,
      canManageUsers: false,
    },
    defaultTimeframe: 'month',
    priorityThreshold: 40,
  },
};

// Department to category mappings
export const DEPARTMENT_CATEGORIES: Record<string, string[]> = {
  'Socialdepartementet': ['demografi_halsa'],
  'Arbetsmarknadsdepartementet': ['arbete_produktivitet'],
  'Finansdepartementet': ['ekonomisk_barkraft', 'infrastruktur'],
  'Justitiedepartementet': ['social_stabilitet'],
  'Utbildningsdepartementet': ['karnsystem_funktion'],
  'Statsrådsberedningen': ['systemrisk_styrning'],
};

// Agency to responsibility area mappings
export const AGENCY_RESPONSIBILITY_AREAS: Record<string, string[]> = {
  'Socialstyrelsen': ['halsa'],
  'Arbetsförmedlingen': ['arbete'],
  'Skolverket': ['utbildning'],
  'Polismyndigheten': ['trygghet'],
  'Skatteverket': ['ekonomi'],
  'Trafikverket': ['infrastruktur'],
  'Migrationsverket': ['integration'],
  'Naturvårdsverket': ['miljo'],
};

export function getRoleConfig(role: AppRole): RoleViewConfig {
  return ROLE_VIEW_CONFIGS[role] || ROLE_VIEW_CONFIGS.public;
}

export function canAccessFeature(
  role: AppRole,
  feature: keyof RoleViewConfig['features']
): boolean {
  const config = getRoleConfig(role);
  return config.features[feature];
}
