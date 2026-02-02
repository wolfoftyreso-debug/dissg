import { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Download, Image, FileCode, Loader2 } from 'lucide-react';
import { exportChart, generateFilename, ExportFormat } from '@/lib/export/chartExport';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';

interface ChartExportButtonProps {
  chartRef: React.RefObject<HTMLDivElement>;
  filename?: string;
  className?: string;
  variant?: 'default' | 'ghost' | 'outline';
  size?: 'default' | 'sm' | 'icon';
}

export function ChartExportButton({
  chartRef,
  filename = 'graf',
  className,
  variant = 'outline',
  size = 'sm'
}: ChartExportButtonProps) {
  const [isExporting, setIsExporting] = useState(false);

  const handleExport = async (format: ExportFormat) => {
    if (!chartRef.current) {
      toast.error('Kunde inte hitta grafen');
      return;
    }

    setIsExporting(true);
    
    try {
      await exportChart(chartRef.current, {
        format,
        filename: generateFilename(filename),
        scale: 2,
        backgroundColor: '#ffffff'
      });
      
      toast.success(`Graf exporterad som ${format.toUpperCase()}`);
    } catch (error) {
      console.error('Export failed:', error);
      toast.error('Export misslyckades');
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button 
          variant={variant} 
          size={size}
          className={cn("min-w-[44px] min-h-[44px]", className)}
          disabled={isExporting}
        >
          {isExporting ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : (
            <Download className="w-4 h-4" />
          )}
          {size !== 'icon' && (
            <span className="ml-2">Exportera</span>
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem 
          onClick={() => handleExport('png')}
          className="min-h-[44px] cursor-pointer"
        >
          <Image className="w-4 h-4 mr-2" />
          Exportera som PNG
          <span className="ml-auto text-xs text-muted-foreground">
            Bild
          </span>
        </DropdownMenuItem>
        <DropdownMenuItem 
          onClick={() => handleExport('svg')}
          className="min-h-[44px] cursor-pointer"
        >
          <FileCode className="w-4 h-4 mr-2" />
          Exportera som SVG
          <span className="ml-auto text-xs text-muted-foreground">
            Vektor
          </span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
