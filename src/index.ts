import { katexRenderToString,katexRenderMathInText } from './renders/KatexRender';
import { MermaidRenderAllGraph, loadMermaidLibrary } from './renders/MermaidRender';

/**
 * 主函数：处理LaTeX公式并返回SVG
 * @param latexFormula LaTeX公式字符串
 * @returns SVG源码
 */
export async function processContent(content: string, type: string): Promise<string> {
    switch (type.toLowerCase()) {
        case 'katex':
        case 'latex':
        case 'math':
            // Katex 渲染
            return katexRenderMathInText(content);

        case 'mermaid':
            // Mermaid 渲染
            return await MermaidRenderAllGraph(`\`\`\`mermaid\n${content}\n\`\`\``);

        case 'material':
            // Material 渲染
            // return await renderMaterial(content);
            throw new Error('Material rendering not implemented yet');

        case 'plantuml':
            // PlantUML 渲染
            // return await renderPlantUML(content);
            throw new Error('PlantUML rendering not implemented yet');

        default:
            throw new Error(`Unsupported type: ${type}. Supported types are: katex, mermaid, material, plantuml`);
    }
}

// 当作为模块被导入时，不执行CLI代码
// 使用ES模块的方式检查是否为主模块
if (require.main === module) {
    // 这里将在CLI模式下执行
    require('./cli');
}