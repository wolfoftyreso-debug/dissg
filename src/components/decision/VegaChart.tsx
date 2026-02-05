/**
 * VEGA-LITE CHART RENDERER
 * 
 * Renders Vega-Lite specifications directly from API.
 * All charts include mandatory limitation annotations.
 */

import { useEffect, useRef, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { AlertTriangle, Download, Expand } from "lucide-react";
import { Button } from "@/components/ui/button";

interface VegaChartProps {
  spec: VegaLiteSpec | null;
  title?: string;
  limitations?: string[];
  isLoading?: boolean;
  height?: number;
  showDownload?: boolean;
}

interface VegaLiteSpec {
  $schema?: string;
  width?: number | "container";
  height?: number;
  data: { values: unknown[] };
  mark?: string | { type: string; [key: string]: unknown };
  encoding?: Record<string, unknown>;
  title?: string | { text: string; subtitle?: string };
  layer?: unknown[];
}

export function VegaChart({ 
  spec, 
  title, 
  limitations = [], 
  isLoading,
  height = 300,
  showDownload = true,
}: VegaChartProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!spec || !containerRef.current) return;

    // Simple SVG-based rendering for demo
    // In production, use vega-embed library
    renderChart();
  }, [spec]);

  const renderChart = () => {
    if (!spec || !containerRef.current) return;

    const container = containerRef.current;
    const data = spec.data?.values || [];
    
    if (data.length === 0) {
      setError("No data available");
      return;
    }

    // Clear previous content
    container.innerHTML = "";

    // Create SVG
    const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
    svg.setAttribute("width", "100%");
    svg.setAttribute("height", String(height));
    svg.setAttribute("viewBox", `0 0 600 ${height}`);

    // Get mark type
    const markType = typeof spec.mark === "string" ? spec.mark : spec.mark?.type || "point";

    // Render based on mark type
    try {
      switch (markType) {
        case "line":
          renderLineChart(svg, data as Record<string, unknown>[], spec.encoding);
          break;
        case "bar":
          renderBarChart(svg, data as Record<string, unknown>[], spec.encoding);
          break;
        case "rect":
          renderHeatmap(svg, data as Record<string, unknown>[], spec.encoding);
          break;
        case "area":
          renderAreaChart(svg, data as Record<string, unknown>[], spec.encoding);
          break;
        default:
          renderScatterPlot(svg, data as Record<string, unknown>[], spec.encoding);
      }

      container.appendChild(svg);
      setError(null);
    } catch (e) {
      setError("Failed to render chart");
      console.error("Chart render error:", e);
    }
  };

  const renderLineChart = (svg: SVGSVGElement, data: Record<string, unknown>[], encoding?: Record<string, unknown>) => {
    const xField = (encoding?.x as Record<string, unknown>)?.field as string || "x";
    const yField = (encoding?.y as Record<string, unknown>)?.field as string || "y";

    const values = data.map(d => ({
      x: Number(d[xField]) || data.indexOf(d),
      y: Number(d[yField]) || 0,
    }));

    const xMax = Math.max(...values.map(v => v.x));
    const yMax = Math.max(...values.map(v => v.y));
    const yMin = Math.min(...values.map(v => v.y));

    const padding = 50;
    const chartWidth = 600 - padding * 2;
    const chartHeight = height - padding * 2;

    // Draw axes
    const axisLine = document.createElementNS("http://www.w3.org/2000/svg", "line");
    axisLine.setAttribute("x1", String(padding));
    axisLine.setAttribute("y1", String(height - padding));
    axisLine.setAttribute("x2", String(600 - padding));
    axisLine.setAttribute("y2", String(height - padding));
    axisLine.setAttribute("stroke", "currentColor");
    axisLine.setAttribute("stroke-opacity", "0.3");
    svg.appendChild(axisLine);

    // Draw path
    const path = document.createElementNS("http://www.w3.org/2000/svg", "path");
    const pathData = values.map((v, i) => {
      const x = padding + (v.x / xMax) * chartWidth;
      const y = height - padding - ((v.y - yMin) / (yMax - yMin || 1)) * chartHeight;
      return `${i === 0 ? "M" : "L"} ${x} ${y}`;
    }).join(" ");

    path.setAttribute("d", pathData);
    path.setAttribute("fill", "none");
    path.setAttribute("stroke", "hsl(var(--primary))");
    path.setAttribute("stroke-width", "2");
    svg.appendChild(path);

    // Draw points
    values.forEach(v => {
      const circle = document.createElementNS("http://www.w3.org/2000/svg", "circle");
      const x = padding + (v.x / xMax) * chartWidth;
      const y = height - padding - ((v.y - yMin) / (yMax - yMin || 1)) * chartHeight;
      circle.setAttribute("cx", String(x));
      circle.setAttribute("cy", String(y));
      circle.setAttribute("r", "4");
      circle.setAttribute("fill", "hsl(var(--primary))");
      svg.appendChild(circle);
    });
  };

  const renderBarChart = (svg: SVGSVGElement, data: Record<string, unknown>[], encoding?: Record<string, unknown>) => {
    const xField = (encoding?.x as Record<string, unknown>)?.field as string || "x";
    const yField = (encoding?.y as Record<string, unknown>)?.field as string || "y";

    const padding = 50;
    const chartWidth = 600 - padding * 2;
    const chartHeight = height - padding * 2;
    const barWidth = chartWidth / data.length - 10;

    const values = data.map(d => Number(d[xField]) || Number(d[yField]) || 0);
    const maxVal = Math.max(...values);

    data.forEach((d, i) => {
      const value = Number(d[xField]) || Number(d[yField]) || 0;
      const barHeight = (value / maxVal) * chartHeight;
      
      const rect = document.createElementNS("http://www.w3.org/2000/svg", "rect");
      rect.setAttribute("x", String(padding + i * (barWidth + 10)));
      rect.setAttribute("y", String(height - padding - barHeight));
      rect.setAttribute("width", String(barWidth));
      rect.setAttribute("height", String(barHeight));
      rect.setAttribute("fill", "hsl(var(--primary))");
      rect.setAttribute("rx", "4");
      svg.appendChild(rect);
    });
  };

  const renderHeatmap = (svg: SVGSVGElement, data: Record<string, unknown>[], encoding?: Record<string, unknown>) => {
    const xField = (encoding?.x as Record<string, unknown>)?.field as string || "x";
    const yField = (encoding?.y as Record<string, unknown>)?.field as string || "y";

    const xValues = [...new Set(data.map(d => String(d[xField])))];
    const yValues = [...new Set(data.map(d => String(d[yField])))];

    const padding = 50;
    const cellWidth = (600 - padding * 2) / xValues.length;
    const cellHeight = (height - padding * 2) / yValues.length;

    data.forEach(d => {
      const xIdx = xValues.indexOf(String(d[xField]));
      const yIdx = yValues.indexOf(String(d[yField]));
      const value = Number(d.value) || Number(d.corr) || 0.5;

      const rect = document.createElementNS("http://www.w3.org/2000/svg", "rect");
      rect.setAttribute("x", String(padding + xIdx * cellWidth));
      rect.setAttribute("y", String(padding + yIdx * cellHeight));
      rect.setAttribute("width", String(cellWidth - 2));
      rect.setAttribute("height", String(cellHeight - 2));
      
      // Color based on value (-1 to 1 scale)
      const hue = value > 0 ? 210 : 20;
      const lightness = 50 + (1 - Math.abs(value)) * 40;
      rect.setAttribute("fill", `hsl(${hue}, 70%, ${lightness}%)`);
      svg.appendChild(rect);
    });
  };

  const renderAreaChart = (svg: SVGSVGElement, data: Record<string, unknown>[], encoding?: Record<string, unknown>) => {
    const xField = (encoding?.x as Record<string, unknown>)?.field as string || "x";
    const yField = (encoding?.y as Record<string, unknown>)?.field as string || "y";

    const values = data.map(d => ({
      x: Number(d[xField]) || data.indexOf(d),
      y: Number(d[yField]) || 0,
    }));

    const xMax = Math.max(...values.map(v => v.x));
    const yMax = Math.max(...values.map(v => v.y));
    const yMin = Math.min(...values.map(v => v.y));

    const padding = 50;
    const chartWidth = 600 - padding * 2;
    const chartHeight = height - padding * 2;

    // Draw area
    const path = document.createElementNS("http://www.w3.org/2000/svg", "path");
    let pathData = values.map((v, i) => {
      const x = padding + (v.x / xMax) * chartWidth;
      const y = height - padding - ((v.y - yMin) / (yMax - yMin || 1)) * chartHeight;
      return `${i === 0 ? "M" : "L"} ${x} ${y}`;
    }).join(" ");

    // Close the path
    const lastX = padding + chartWidth;
    const firstX = padding;
    pathData += ` L ${lastX} ${height - padding} L ${firstX} ${height - padding} Z`;

    path.setAttribute("d", pathData);
    path.setAttribute("fill", "hsl(var(--primary) / 0.2)");
    path.setAttribute("stroke", "hsl(var(--primary))");
    path.setAttribute("stroke-width", "2");
    svg.appendChild(path);
  };

  const renderScatterPlot = (svg: SVGSVGElement, data: Record<string, unknown>[], encoding?: Record<string, unknown>) => {
    const xField = (encoding?.x as Record<string, unknown>)?.field as string || "x";
    const yField = (encoding?.y as Record<string, unknown>)?.field as string || "y";

    const padding = 50;
    const chartWidth = 600 - padding * 2;
    const chartHeight = height - padding * 2;

    const xValues = data.map(d => Number(d[xField]) || 0);
    const yValues = data.map(d => Number(d[yField]) || 0);
    const xMax = Math.max(...xValues);
    const yMax = Math.max(...yValues);

    data.forEach(d => {
      const x = padding + (Number(d[xField]) / xMax) * chartWidth;
      const y = height - padding - (Number(d[yField]) / yMax) * chartHeight;

      const circle = document.createElementNS("http://www.w3.org/2000/svg", "circle");
      circle.setAttribute("cx", String(x));
      circle.setAttribute("cy", String(y));
      circle.setAttribute("r", "5");
      circle.setAttribute("fill", "hsl(var(--primary))");
      circle.setAttribute("opacity", "0.7");
      svg.appendChild(circle);
    });
  };

  const handleDownload = () => {
    if (!spec) return;
    const blob = new Blob([JSON.stringify(spec, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${title || "chart"}-spec.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <Skeleton className="h-6 w-48" />
        </CardHeader>
        <CardContent>
          <Skeleton className="h-[300px] w-full" />
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader className="pb-2">
        <div className="flex items-start justify-between">
          <div>
            <CardTitle className="text-base">{title}</CardTitle>
            {limitations.length > 0 && (
              <div className="mt-1 flex items-center gap-1 text-xs text-muted-foreground">
                <AlertTriangle className="h-3 w-3" />
                <span>{limitations[0]}</span>
              </div>
            )}
          </div>
          <div className="flex gap-1">
            {showDownload && (
              <Button variant="ghost" size="icon" className="h-7 w-7" onClick={handleDownload}>
                <Download className="h-3.5 w-3.5" />
              </Button>
            )}
            <Button variant="ghost" size="icon" className="h-7 w-7">
              <Expand className="h-3.5 w-3.5" />
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {error ? (
          <div className="flex h-[200px] items-center justify-center text-muted-foreground">
            <AlertTriangle className="mr-2 h-4 w-4" />
            {error}
          </div>
        ) : (
          <div ref={containerRef} className="w-full" style={{ height }} />
        )}
        <div className="mt-2 flex flex-wrap gap-1">
          <Badge variant="outline" className="text-[10px]">
            Vega-Lite v5
          </Badge>
          <Badge variant="outline" className="text-[10px]">
            No interpretation
          </Badge>
        </div>
      </CardContent>
    </Card>
  );
}
