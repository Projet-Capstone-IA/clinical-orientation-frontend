import html2canvas from 'html2canvas';

export async function exportAsPng(element: HTMLElement, filename: string = 'export.png'): Promise<void> {
  try {
    const canvas = await html2canvas(element, {
      backgroundColor: null,
      scale: 2,
      useCORS: true,
    });

    const link = document.createElement('a');
    link.download = filename;
    link.href = canvas.toDataURL('image/png');
    link.click();
  } catch (error) {
    console.error('Export failed:', error);
    throw error;
  }
}
