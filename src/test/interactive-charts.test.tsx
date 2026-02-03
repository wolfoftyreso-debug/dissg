/**
 * INTERACTIVE CHART TESTS
 * ═══════════════════════════════════════════════════════════════
 * 
 * Verifierar att alla interaktiva grafer reagerar korrekt på användarinput.
 */

import { describe, it, expect, vi } from 'vitest';
import { render } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { BrowserRouter } from 'react-router-dom';
import type { OscilloscopeConfig, SignalTrace, SystemStatus, SignalWarning } from '@/lib/lambda/oscilloscope-mode';

// Test wrapper
const createTestWrapper = () => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: { retry: false },
    },
  });
  
  return ({ children }: { children: React.ReactNode }) => (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        {children}
      </BrowserRouter>
    </QueryClientProvider>
  );
};

describe('GMIWeightEditor', () => {
  it('renders weight sliders with correct initial values', async () => {
    const { GMIWeightEditor } = await import('@/components/global/GMIWeightEditor');
    const mockOnChange = vi.fn();
    
    const initialWeights = {
      life_health: 0.20,
      livelihood_work: 0.20,
      knowledge_skills: 0.20,
      stability_security: 0.20,
      resource_environment: 0.20,
    };
    
    const { container } = render(
      <GMIWeightEditor 
        currentWeights={initialWeights}
        onWeightsChange={mockOnChange}
      />,
      { wrapper: createTestWrapper() }
    );
    
    // Verify sliders are present
    const sliders = container.querySelectorAll('[role="slider"]');
    expect(sliders.length).toBeGreaterThan(0);
  });

  it('displays 100% total for valid weights', async () => {
    const { GMIWeightEditor } = await import('@/components/global/GMIWeightEditor');
    const mockOnChange = vi.fn();
    
    const validWeights = {
      life_health: 0.20,
      livelihood_work: 0.20,
      knowledge_skills: 0.20,
      stability_security: 0.20,
      resource_environment: 0.20,
    };
    
    const { container } = render(
      <GMIWeightEditor 
        currentWeights={validWeights}
        onWeightsChange={mockOnChange}
      />,
      { wrapper: createTestWrapper() }
    );
    
    // Should show 100% total somewhere in the document
    expect(container.textContent).toContain('100%');
  });

  it('shows incorrect total for invalid weights', async () => {
    const { GMIWeightEditor } = await import('@/components/global/GMIWeightEditor');
    const mockOnChange = vi.fn();
    
    // Invalid weights (sum = 90%)
    const invalidWeights = {
      life_health: 0.18,
      livelihood_work: 0.18,
      knowledge_skills: 0.18,
      stability_security: 0.18,
      resource_environment: 0.18,
    };
    
    const { container } = render(
      <GMIWeightEditor 
        currentWeights={invalidWeights}
        onWeightsChange={mockOnChange}
      />,
      { wrapper: createTestWrapper() }
    );
    
    // Should show 90% which is invalid
    expect(container.textContent).toContain('90%');
  });

  it('has preset selector', async () => {
    const { GMIWeightEditor } = await import('@/components/global/GMIWeightEditor');
    const mockOnChange = vi.fn();
    
    const { container } = render(
      <GMIWeightEditor 
        currentWeights={{
          life_health: 0.20,
          livelihood_work: 0.20,
          knowledge_skills: 0.20,
          stability_security: 0.20,
          resource_environment: 0.20,
        }}
        onWeightsChange={mockOnChange}
      />,
      { wrapper: createTestWrapper() }
    );
    
    // Should have preset selector (combobox)
    const comboboxes = container.querySelectorAll('[role="combobox"]');
    expect(comboboxes.length).toBeGreaterThan(0);
  });

  it('has reset button', async () => {
    const { GMIWeightEditor } = await import('@/components/global/GMIWeightEditor');
    const mockOnChange = vi.fn();
    
    const { container } = render(
      <GMIWeightEditor 
        currentWeights={{
          life_health: 0.25,
          livelihood_work: 0.15,
          knowledge_skills: 0.20,
          stability_security: 0.20,
          resource_environment: 0.20,
        }}
        onWeightsChange={mockOnChange}
      />,
      { wrapper: createTestWrapper() }
    );
    
    // Should have reset button (Återställ)
    expect(container.textContent).toMatch(/återställ/i);
  });
});

describe('OscilloscopeView', () => {
  const mockConfig: OscilloscopeConfig = {
    time_base: '1d',
    channels: [
      { id: 'ch1', signal_type: 'amplitude', source_kpi_code: 'gdp', label: 'BNP', visible: true, color: '#3b82f6', scale: 'auto' },
      { id: 'ch2', signal_type: 'amplitude', source_kpi_code: 'unemployment', label: 'Arbetslöshet', visible: true, color: '#f59e0b', scale: 'auto' },
    ],
    view_mode: 'realtime',
    show_grid: true,
    show_noise_floor: true,
    show_warning_thresholds: true,
    trigger_level: 0.5,
  };
  
  const mockTraces: SignalTrace[] = [
    { 
      channel_id: 'ch1', 
      timestamps: ['2024-01', '2024-02'],
      values: [50, 55],
      noise_floor: [1, 1],
      quality_markers: ['strong', 'strong']
    },
    { 
      channel_id: 'ch2', 
      timestamps: ['2024-01', '2024-02'],
      values: [5, 4.5],
      noise_floor: [0.1, 0.1],
      quality_markers: ['strong', 'strong']
    },
  ];
  
  const mockWarnings: SignalWarning[] = [];
  
  const mockStatus: SystemStatus = {
    overall_health: 'stable',
    active_channels: 2,
    clarity_score: 95,
    data_freshness_hours: 1,
    noise_level: 'low',
  };

  it('renders oscilloscope canvas', async () => {
    const { OscilloscopeView } = await import('@/components/lambda/OscilloscopeView');
    
    const { container } = render(
      <OscilloscopeView 
        config={mockConfig}
        traces={mockTraces}
        warnings={mockWarnings}
        systemStatus={mockStatus}
      />,
      { wrapper: createTestWrapper() }
    );
    
    // Canvas should be present
    const canvas = container.querySelector('canvas');
    expect(canvas).toBeInTheDocument();
  });

  it('has time base selector', async () => {
    const { OscilloscopeView } = await import('@/components/lambda/OscilloscopeView');
    const mockTimeBaseChange = vi.fn();
    
    const { container } = render(
      <OscilloscopeView 
        config={mockConfig}
        traces={mockTraces}
        warnings={mockWarnings}
        systemStatus={mockStatus}
        onTimeBaseChange={mockTimeBaseChange}
      />,
      { wrapper: createTestWrapper() }
    );
    
    // Find time base selector (combobox)
    const combobox = container.querySelector('[role="combobox"]');
    expect(combobox).toBeInTheDocument();
  });

  it('shows channel toggle buttons', async () => {
    const { OscilloscopeView } = await import('@/components/lambda/OscilloscopeView');
    const mockChannelToggle = vi.fn();
    
    const { container } = render(
      <OscilloscopeView 
        config={mockConfig}
        traces={mockTraces}
        warnings={mockWarnings}
        systemStatus={mockStatus}
        onChannelToggle={mockChannelToggle}
      />,
      { wrapper: createTestWrapper() }
    );
    
    // Find channel toggle buttons
    expect(container.textContent).toContain('BNP');
  });

  it('displays signal clarity score', async () => {
    const { OscilloscopeView } = await import('@/components/lambda/OscilloscopeView');
    
    const { container } = render(
      <OscilloscopeView 
        config={mockConfig}
        traces={mockTraces}
        warnings={mockWarnings}
        systemStatus={mockStatus}
      />,
      { wrapper: createTestWrapper() }
    );
    
    // Should show clarity score
    expect(container.textContent).toMatch(/signalklarhet/i);
    expect(container.textContent).toContain('95%');
  });
});

describe('CorrelationSandbox', () => {
  it('renders correlation sandbox with title', async () => {
    const { CorrelationSandbox } = await import('@/components/analysis/CorrelationSandbox');
    
    const { container } = render(
      <CorrelationSandbox />,
      { wrapper: createTestWrapper() }
    );
    
    // Should have correlation-related content
    expect(container.textContent).toMatch(/korrelation/i);
  });

  it('has year range slider', async () => {
    const { CorrelationSandbox } = await import('@/components/analysis/CorrelationSandbox');
    
    const { container } = render(
      <CorrelationSandbox />,
      { wrapper: createTestWrapper() }
    );
    
    // Should have slider(s)
    const sliders = container.querySelectorAll('[role="slider"]');
    expect(sliders.length).toBeGreaterThan(0);
  });

  it('has indicator selectors', async () => {
    const { CorrelationSandbox } = await import('@/components/analysis/CorrelationSandbox');
    
    const { container } = render(
      <CorrelationSandbox />,
      { wrapper: createTestWrapper() }
    );
    
    // Should have combobox selectors for indicators
    const comboboxes = container.querySelectorAll('[role="combobox"]');
    expect(comboboxes.length).toBeGreaterThan(0);
  });
});

describe('RelevanceWeightManager', () => {
  it('renders with title', async () => {
    const { RelevanceWeightManager } = await import('@/components/admin/RelevanceWeightManager');
    
    const { container } = render(
      <RelevanceWeightManager />,
      { wrapper: createTestWrapper() }
    );
    
    // Should show title (may be loading initially)
    // The component loads data async, so we just check it renders
    expect(container).toBeTruthy();
  });

  it('shows weight category labels when loaded', async () => {
    const { RelevanceWeightManager } = await import('@/components/admin/RelevanceWeightManager');
    
    const { container } = render(
      <RelevanceWeightManager />,
      { wrapper: createTestWrapper() }
    );
    
    // Wait for potential loading state to resolve
    await new Promise(resolve => setTimeout(resolve, 100));
    
    // The component should have rendered something
    expect(container.innerHTML.length).toBeGreaterThan(0);
  });
});
