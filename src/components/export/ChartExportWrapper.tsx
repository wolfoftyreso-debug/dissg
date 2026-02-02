import { useRef, ReactNode } from 'react';
import { ChartExportButton } from './ChartExportButton';
import { cn } from '@/lib/utils';

interface ChartExportWrapperProps {
  children: ReactNode;
  filename?: string;
  title?: string;
  showExportButton?: boolean;
  className?: string;
  headerClassName?: string;
}

/**
 * Wrapper component that provides export functionality for any chart
 * Usage:
 * <ChartExportWrapper filename="my-chart" title="Sales Data">
 *   <MyChart data={data} />
 * </ChartExportWrapper>
 */
export function ChartExportWrapper({
  children,
  filename = 'graf',
  title,
  showExportButton = true,
  className,
  headerClassName
}: ChartExportWrapperProps) {
  const chartRef = useRef<HTMLDivElement>(null);

  return (
    <div className={cn("relative", className)}>
      {/* Header with title and export button */}
      {(title || showExportButton) && (
        <div className={cn(
          "flex items-center justify-between mb-2",
          headerClassName
        )}>
          {title && (
            <h3 className="text-sm font-medium text-muted-foreground">
              {title}
            </h3>
          )}
          {showExportButton && (
            <ChartExportButton
              chartRef={chartRef}
              filename={filename}
              size="sm"
              variant="ghost"
            />
          )}
        </div>
      )}
      
      {/* Chart container (this is what gets exported) */}
      <div 
        ref={chartRef}
        className="bg-background p-4 rounded-lg"
      >
        {children}
      </div>
    </div>
  );
}
