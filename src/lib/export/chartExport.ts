// Chart export utilities for PNG and SVG

export type ExportFormat = 'png' | 'svg';

export interface ExportOptions {
  format: ExportFormat;
  filename?: string;
  scale?: number; // For PNG quality (default: 2)
  backgroundColor?: string;
}

/**
 * Export a chart container element to PNG or SVG
 */
export async function exportChart(
  element: HTMLElement,
  options: ExportOptions
): Promise<void> {
  const { format, filename = 'chart', scale = 2, backgroundColor = '#ffffff' } = options;

  if (format === 'svg') {
    await exportAsSvg(element, filename);
  } else {
    await exportAsPng(element, filename, scale, backgroundColor);
  }
}

/**
 * Export element as PNG using html2canvas
 */
async function exportAsPng(
  element: HTMLElement,
  filename: string,
  scale: number,
  backgroundColor: string
): Promise<void> {
  const html2canvas = (await import('html2canvas')).default;
  
  const canvas = await html2canvas(element, {
    scale,
    backgroundColor,
    useCORS: true,
    logging: false,
    allowTaint: true,
  });

  const dataUrl = canvas.toDataURL('image/png');
  downloadFile(dataUrl, `${filename}.png`);
}

/**
 * Export SVG elements from the container
 */
async function exportAsSvg(
  element: HTMLElement,
  filename: string
): Promise<void> {
  // Find SVG element within the container
  const svgElement = element.querySelector('svg');
  
  if (!svgElement) {
    console.error('No SVG element found in container');
    return;
  }

  // Clone the SVG to avoid modifying the original
  const clonedSvg = svgElement.cloneNode(true) as SVGElement;
  
  // Get computed styles and inline them
  inlineStyles(svgElement, clonedSvg);
  
  // Ensure SVG has proper dimensions
  const bbox = svgElement.getBoundingClientRect();
  clonedSvg.setAttribute('width', String(bbox.width));
  clonedSvg.setAttribute('height', String(bbox.height));
  clonedSvg.setAttribute('xmlns', 'http://www.w3.org/2000/svg');

  // Serialize to string
  const serializer = new XMLSerializer();
  let svgString = serializer.serializeToString(clonedSvg);
  
  // Add XML declaration
  svgString = '<?xml version="1.0" encoding="UTF-8"?>\n' + svgString;

  // Create blob and download
  const blob = new Blob([svgString], { type: 'image/svg+xml;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  downloadFile(url, `${filename}.svg`);
  URL.revokeObjectURL(url);
}

/**
 * Inline computed styles into SVG elements for export
 */
function inlineStyles(source: Element, target: Element): void {
  const computedStyle = window.getComputedStyle(source);
  
  // Key SVG styling properties to inline
  const stylesToCopy = [
    'fill', 'stroke', 'stroke-width', 'stroke-dasharray',
    'font-family', 'font-size', 'font-weight', 'text-anchor',
    'dominant-baseline', 'opacity'
  ];

  const style = stylesToCopy
    .map(prop => {
      const value = computedStyle.getPropertyValue(prop);
      return value ? `${prop}: ${value}` : '';
    })
    .filter(Boolean)
    .join('; ');

  if (style && target instanceof SVGElement) {
    target.setAttribute('style', style);
  }

  // Recursively process children
  const sourceChildren = source.children;
  const targetChildren = target.children;
  
  for (let i = 0; i < sourceChildren.length; i++) {
    if (targetChildren[i]) {
      inlineStyles(sourceChildren[i], targetChildren[i]);
    }
  }
}

/**
 * Trigger file download
 */
function downloadFile(url: string, filename: string): void {
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

/**
 * Generate a timestamped filename
 */
export function generateFilename(baseName: string): string {
  const date = new Date();
  const timestamp = date.toISOString().slice(0, 10);
  return `${baseName}-${timestamp}`;
}
