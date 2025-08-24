import { program } from 'commander';
import {processContent} from './index';
import * as fs from 'fs';
import * as path from 'path';

// 定义选项接口
interface CliOptions {
    output?: string;
    type: string;
    help?: string;
}

// 显示示例用法
function showExamples() {
    return '\n示例:\n' +
    '  $ hemyrender.exe -t katex "E = mc^2"\n' +
    '  $ hemyrender.exe -t katex "\\sum_{i=1}^n i = \\frac{n(n+1)}{2}" -o formula.svg\n' +
    '  $ hemyrender.exe -t mermaid "graph TD; A-->B; A-->C; B-->D; C-->D;"\n' +
    '  $ hemyrender.exe -t mermaid diagram.txt -o diagram.svg\n' +
    '  $ hemyrender.exe --type latex --output output.svg "x(t) = \\frac{a_0}{2} + \\sum_{n=1}^{\\infty} \\left( a_n \\cos\\left(\\frac{2\\pi nt}{T}\\right) + b_n \\sin\\left(\\frac{2\\pi nt}{T}\\right) \\right)"\n'
}

program
    .name('hemyrender')
    .version('1.0.0', '-v, --version', '显示版本信息')
    .description('将Latex、Mermaid、Material、PlantUML等格式的文本渲染为SVG')
    .usage('[选项] <内容或文件路径>')
    .requiredOption('-t, --type <type>', '要渲染的文本类型 (katex/latex/math, mermaid, material, plantuml/uml)')
    .argument('<content>', '要渲染的文本内容或包含内容的文件路径')
    .option('-o, --output <file>', '将输出保存到指定的SVG文件')
    .helpOption('-h, --help', '显示帮助信息')
    .addHelpText('after', showExamples())
    .action(async (content: string, options: CliOptions) => {
        try {
            // 检查内容是否是文件路径
            let inputContent = content;
            if (fs.existsSync(content) && fs.statSync(content).isFile()) {
                inputContent = fs.readFileSync(content, 'utf8');
            }

            // 处理内容
            const svgOutput = await processContent(inputContent, options.type);

            // 如果有输出文件选项，写入文件
            if (options.output) {
                // 确保输出目录存在
                const outputDir = path.dirname(options.output);
                if (!fs.existsSync(outputDir)) {
                    fs.mkdirSync(outputDir, { recursive: true });
                }

                fs.writeFileSync(options.output, svgOutput);
            } else {
                // 否则直接输出到控制台
                console.log(svgOutput);
            }

            process.exit(0);
        } catch (error: any) {
            console.error('错误:', error.message);
            process.exit(1);
        }
    });

// 如果没有提供任何参数，显示帮助信息
if (process.argv.length <= 2) {
    program.help();
}

// 解析命令行参数
program.parse();