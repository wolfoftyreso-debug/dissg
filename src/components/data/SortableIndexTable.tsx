/**
 * Sortable Index Table
 * 
 * Avanza-inspired sortable data tables for indices and indicators
 * Every row is clickable for infinite depth exploration
 */

import React, { useState, useMemo } from 'react';
import { cn } from '@/lib/utils';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { MiniSparkline } from './DataOverview';
import { IndexDrilldown } from './IndexDrilldown';
import { Settings } from 'lucide-react';

type SortDirection = 'asc' | 'desc' | null;
type SortField = 'name' | 'change' | 'value' | 'time';

export interface IndexItem {
  id: string;
  code: string;
  name: string;
  value: number;
  change: number;
  time: string;
  flag?: string;
  sparkData?: number[];
}

// Sort icon
const SortIcon: React.FC<{ direction: SortDirection }> = ({ direction }) => (
  <span className="ml-1 text-xs text-muted-foreground">
    {direction === 'asc' ? '↑' : direction === 'desc' ? '↓' : ''}
  </span>
);

// Sortable header cell
const SortHeader: React.FC<{
  label: string;
  field: SortField;
  currentField: SortField | null;
  direction: SortDirection;
  onSort: (field: SortField) => void;
  align?: 'left' | 'right';
}> = ({ label, field, currentField, direction, onSort, align = 'left' }) => (
  <th 
    className={cn(
      'px-3 py-2 text-xs font-medium text-muted-foreground cursor-pointer hover:text-foreground transition-colors select-none',
      align === 'right' && 'text-right'
    )}
    onClick={() => onSort(field)}
  >
    {label}
    {currentField === field && <SortIcon direction={direction} />}
  </th>
);

// Single row
const IndexRow: React.FC<{
  item: IndexItem;
  onClick?: () => void;
  showSparkline?: boolean;
}> = ({ item, onClick, showSparkline = false }) => {
  const isPositive = item.change >= 0;
  
  return (
    <tr 
      className="border-b border-border/50 last:border-0 hover:bg-muted/50 cursor-pointer transition-colors"
      onClick={onClick}
    >
      <td className="px-3 py-3">
        <div className="flex items-center gap-2">
          {item.flag && <span className="text-sm">{item.flag}</span>}
          <span className="font-medium text-sm">{item.name}</span>
        </div>
      </td>
      <td className={cn(
        'px-3 py-3 text-right font-mono text-sm',
        isPositive ? 'text-emerald-600' : 'text-red-600'
      )}>
        {isPositive ? '+' : ''}{item.change.toFixed(2)}%
      </td>
      {showSparkline && item.sparkData && (
        <td className="px-2 py-3 w-16">
          <MiniSparkline 
            data={item.sparkData} 
            color={isPositive ? 'positive' : 'negative'}
            height={20}
          />
        </td>
      )}
      <td className="px-3 py-3 text-right text-sm text-muted-foreground font-mono">
        {typeof item.value === 'number' 
          ? item.value.toLocaleString('sv-SE', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
          : item.value
        }
      </td>
      <td className="px-3 py-3 text-right text-xs text-muted-foreground">
        {item.time}
      </td>
    </tr>
  );
};

// Main component
export const SortableIndexTable: React.FC<{
  title: string;
  items: IndexItem[];
  showSparkline?: boolean;
  onItemClick?: (item: IndexItem) => void;
  className?: string;
}> = ({ title, items, showSparkline = false, onItemClick, className }) => {
  const [sortField, setSortField] = useState<SortField | null>(null);
  const [sortDirection, setSortDirection] = useState<SortDirection>(null);
  const [selectedItem, setSelectedItem] = useState<IndexItem | null>(null);
  const [drilldownOpen, setDrilldownOpen] = useState(false);

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      // Cycle: null -> desc -> asc -> null
      if (sortDirection === null) setSortDirection('desc');
      else if (sortDirection === 'desc') setSortDirection('asc');
      else { setSortField(null); setSortDirection(null); }
    } else {
      setSortField(field);
      setSortDirection('desc');
    }
  };

  const handleRowClick = (item: IndexItem) => {
    if (onItemClick) {
      onItemClick(item);
    } else {
      setSelectedItem(item);
      setDrilldownOpen(true);
    }
  };

  const sortedItems = useMemo(() => {
    if (!sortField || !sortDirection) return items;
    
    return [...items].sort((a, b) => {
      let comparison = 0;
      
      switch (sortField) {
        case 'name':
          comparison = a.name.localeCompare(b.name);
          break;
        case 'change':
          comparison = a.change - b.change;
          break;
        case 'value':
          comparison = a.value - b.value;
          break;
        case 'time':
          comparison = a.time.localeCompare(b.time);
          break;
      }
      
      return sortDirection === 'asc' ? comparison : -comparison;
    });
  }, [items, sortField, sortDirection]);

  return (
    <>
      <IndexDrilldown 
        open={drilldownOpen} 
        onOpenChange={setDrilldownOpen} 
        item={selectedItem}
      />
      <Card className={className}>
        <CardHeader className="pb-2 flex flex-row items-center justify-between">
          <CardTitle className="text-base font-medium">{title}</CardTitle>
          <button className="p-1 hover:bg-muted rounded transition-colors">
            <Settings className="w-4 h-4 text-muted-foreground" />
          </button>
        </CardHeader>
        <CardContent className="p-0">
          <table className="w-full">
            <thead className="bg-muted/30 border-b border-border">
              <tr>
                <SortHeader 
                  label="Index" 
                  field="name" 
                  currentField={sortField} 
                  direction={sortDirection}
                  onSort={handleSort}
                />
                <SortHeader 
                  label="+/−%" 
                  field="change" 
                  currentField={sortField} 
                  direction={sortDirection}
                  onSort={handleSort}
                  align="right"
                />
                {showSparkline && <th className="px-2 py-2 w-16"></th>}
                <SortHeader 
                  label="Senast" 
                  field="value" 
                  currentField={sortField} 
                  direction={sortDirection}
                  onSort={handleSort}
                  align="right"
                />
                <SortHeader 
                  label="Tid" 
                  field="time" 
                  currentField={sortField} 
                  direction={sortDirection}
                  onSort={handleSort}
                  align="right"
                />
              </tr>
            </thead>
            <tbody>
              {sortedItems.map((item) => (
                <IndexRow
                  key={item.id}
                  item={item}
                  onClick={() => handleRowClick(item)}
                  showSparkline={showSparkline}
                />
              ))}
            </tbody>
          </table>
        </CardContent>
      </Card>
    </>
  );
};

// Multi-category view with multiple sortable tables
export const IndexCategoryTables: React.FC<{ className?: string }> = ({ className }) => {
  // Generate sparkline data
  const spark = (trend: number) => Array.from({ length: 12 }, (_, i) => 
    50 + (Math.random() - 0.5) * 10 + (trend * i * 0.3)
  );

  // Sample data organized by category (like Avanza's market sections)
  const nordicIndices: IndexItem[] = [
    { id: '1', code: 'OMXS30', name: 'OMX Stockholm 30', value: 2543.21, change: 0.99, time: '17:29', flag: '🇸🇪', sparkData: spark(0.5) },
    { id: '2', code: 'OMXH25', name: 'OMX Helsinki 25', value: 5983.15, change: 0.79, time: '17:30', flag: '🇫🇮', sparkData: spark(0.3) },
    { id: '3', code: 'OMXC25', name: 'OMX Copenhagen 25', value: 1881.63, change: -2.16, time: '17:00', flag: '🇩🇰', sparkData: spark(-0.8) },
    { id: '4', code: 'OBX', name: 'Oslo Børs Index', value: 1765.77, change: 0.34, time: '16:25', flag: '🇳🇴', sparkData: spark(0.2) },
  ];

  const worldIndices: IndexItem[] = [
    { id: '5', code: 'SPX', name: 'S&P 500', value: 5558.87, change: -0.51, time: '22:04', flag: '🇺🇸', sparkData: spark(-0.3) },
    { id: '6', code: 'NDX', name: 'Nasdaq 100', value: 24891.24, change: -1.77, time: '23:06', flag: '🇺🇸', sparkData: spark(-0.9) },
    { id: '7', code: 'DJI', name: 'Dow Jones Industrial', value: 49501.30, change: 0.53, time: '22:39', flag: '🇺🇸', sparkData: spark(0.1) },
    { id: '8', code: 'NQCA', name: 'Nasdaq Kanada', value: 1892.35, change: 0.51, time: '22:10', flag: '🇨🇦', sparkData: spark(0.2) },
  ];

  const europeanIndices: IndexItem[] = [
    { id: '9', code: 'DAX', name: 'DAX', value: 24603.04, change: -0.72, time: '18:00', flag: '🇩🇪', sparkData: spark(-0.4) },
    { id: '10', code: 'CAC', name: 'CAC All-Share', value: 9578.08, change: 0.95, time: '17:35', flag: '🇫🇷', sparkData: spark(0.4) },
    { id: '11', code: 'FTSE', name: 'FTSE UK', value: 2065.90, change: 0.58, time: '18:15', flag: '🇬🇧', sparkData: spark(0.3) },
    { id: '12', code: 'FTSEMIB', name: 'Nasdaq Italien', value: 2613.84, change: 0.03, time: '17:45', flag: '🇮🇹', sparkData: spark(0.0) },
  ];

  const societalIndices: IndexItem[] = [
    { id: '13', code: 'LAMBDA-SE', name: 'Lambda Sverige', value: 0.94, change: -0.32, time: '00:00', flag: '🇸🇪', sparkData: spark(-0.2) },
    { id: '14', code: 'HDI-SE', name: 'HDI Sverige', value: 0.947, change: 0.12, time: '00:00', flag: '🇸🇪', sparkData: spark(0.1) },
    { id: '15', code: 'GINI-SE', name: 'GINI Sverige', value: 28.8, change: 0.85, time: '00:00', flag: '🇸🇪', sparkData: spark(0.3) },
    { id: '16', code: 'LAMBDA-EU', name: 'Lambda EU', value: 0.91, change: -0.18, time: '00:00', flag: '🇪🇺', sparkData: spark(-0.1) },
  ];

  const commodities: IndexItem[] = [
    { id: '17', code: 'GOLD', name: 'Guld', value: 4965.00, change: 0.36, time: '22:58', flag: '', sparkData: spark(0.2) },
    { id: '18', code: 'SILVER', name: 'Silver', value: 88.21, change: 3.39, time: '22:58', flag: '', sparkData: spark(1.2) },
    { id: '19', code: 'OIL', name: 'Olja', value: 68.68, change: 1.13, time: '22:58', flag: '', sparkData: spark(0.4) },
    { id: '20', code: 'COPPER', name: 'Koppar', value: 13365.00, change: 2.91, time: '18:00', flag: '', sparkData: spark(1.0) },
  ];

  const currencies: IndexItem[] = [
    { id: '21', code: 'USDSEK', name: 'USD/SEK', value: 8.994, change: 1.02, time: '23:21', flag: '', sparkData: spark(0.5) },
    { id: '22', code: 'EURSEK', name: 'EUR/SEK', value: 10.62, change: -0.95, time: '23:20', flag: '', sparkData: spark(-0.4) },
    { id: '23', code: 'GBPSEK', name: 'GBP/SEK', value: 12.27, change: 0.66, time: '23:21', flag: '', sparkData: spark(0.3) },
    { id: '24', code: 'NOKSEK', name: 'NOK/SEK', value: 0.9287, change: 0.36, time: '23:21', flag: '', sparkData: spark(0.1) },
  ];

  return (
    <div className={cn('space-y-6', className)}>
      {/* Top row - 3 columns */}
      <div className="grid md:grid-cols-3 gap-4">
        <SortableIndexTable 
          title="Nordiska index" 
          items={nordicIndices}
          showSparkline
        />
        <SortableIndexTable 
          title="Världsindex" 
          items={worldIndices}
          showSparkline
        />
        <SortableIndexTable 
          title="Europeiska index" 
          items={europeanIndices}
          showSparkline
        />
      </div>
      
      {/* Bottom row - 3 columns */}
      <div className="grid md:grid-cols-3 gap-4">
        <SortableIndexTable 
          title="Samhällsindex" 
          items={societalIndices}
          showSparkline
        />
        <SortableIndexTable 
          title="Råvaror" 
          items={commodities}
          showSparkline
        />
        <SortableIndexTable 
          title="Valutor" 
          items={currencies}
          showSparkline
        />
      </div>
    </div>
  );
};

export default SortableIndexTable;
