export type DiagramType = 'mindmap' | 'flowchart' | 'decisionTree';

export function generateMermaidDefinition(orientationData: any, type: DiagramType): string {
  const orientations = orientationData?.orientations || [];
  if (orientations.length === 0) return '';

  switch (type) {
    case 'mindmap':
      return buildMindmap(orientations);
    case 'flowchart':
      return buildFlowchart(orientations);
    case 'decisionTree':
      return buildDecisionTree(orientations);
    default:
      return '';
  }
}

function buildMindmap(orientations: any[]): string {
  let def = 'mindmap\n  root((Orientations))\n';
  orientations.forEach((item: any) => {
    const specialty = esc(item.specialty || 'Spécialité');
    def += `    ${specialty}\n`;
    if (item.possible_conditions?.length) {
      item.possible_conditions.forEach((cond: string) => {
        def += `      ${esc(cond)}\n`;
      });
    }
  });
  return def;
}

function buildFlowchart(orientations: any[]): string {
  let def = 'flowchart TD\n';
  def += '  A["𔗒 Orientations cliniques"]\n';

  orientations.forEach((item: any, idx: number) => {
    const specId = `B${idx}`;
    const specialty = esc(item.specialty || `Spécialité ${idx + 1}`, 20);
    def += `  A --> ${specId}["${specialty}"]\n`;

    if (item.possible_conditions?.length) {
      item.possible_conditions.forEach((cond: string, i: number) => {
        const condId = `C${idx}_${i}`;
        def += `  ${specId} -.-> ${condId}["${esc(cond, 25)}"]\n`;
      });
    }

    if (item.advice) {
      const advId = `D${idx}`;
      const shortAdvice = esc(item.advice, 40);
      def += `  ${specId} --> ${advId}["𔗔 ${shortAdvice}"]\n`;
    }
  });

  return def;
}

function buildDecisionTree(orientations: any[]): string {
  let def = 'flowchart TB\n';
  def += '  START{"𔗓 Analyse des symptômes"}\n';

  orientations.forEach((item: any, idx: number) => {
    const specId = `SPEC${idx}`;
    const specialty = esc(item.specialty || `Spécialité ${idx + 1}`, 20);
    def += `  START --> ${specId}["${specialty}"]\n`;

    if (item.possible_conditions?.length) {
      const condGroupId = `COND${idx}`;
      def += `  ${specId} --> ${condGroupId}{"Conditions"}\n`;
      item.possible_conditions.forEach((cond: string, i: number) => {
        def += `  ${condGroupId} --> ${condGroupId}_${i}["${esc(cond, 25)}"]\n`;
      });
    }
  });

  return def;
}

function esc(text: string, maxLen: number = 50): string {
  if (!text) return '';
  let clean = text.replace(/[\[\]\(\)\{\}<>"]/g, ' ').replace(/\s+/g, ' ').trim();
  
  if (clean.length <= maxLen) return clean;
  
  // Basic word wrap
  const words = clean.split(' ');
  let lines: string[] = [];
  let currentLine = '';
  
  words.forEach(word => {
    if ((currentLine + word).length > maxLen) {
      lines.push(currentLine.trim());
      currentLine = word + ' ';
    } else {
      currentLine += word + ' ';
    }
  });
  lines.push(currentLine.trim());
  
  return lines.join('<br/>');
}

