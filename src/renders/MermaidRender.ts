// 存储mermaid字符和svg的映射关系
const mermaidToSvgMap: Map<string, string> = new Map();

function storeMermaidMapping(mermaidCode: string, svgString: string): void {
    mermaidToSvgMap.set(mermaidCode, svgString);
}

function querySvgByMermaidCode(mermaidCode: string): string | undefined {
    return mermaidToSvgMap.get(mermaidCode);
}

// 加载Mermaid库
function loadMermaidLibrary(): Promise<void> {
    return new Promise((resolve, reject) => {
        // 检查是否已经加载
        if (typeof (window as any).mermaid !== 'undefined') {
            resolve();
            return;
        }

        // 创建CSS链接
        const cssLink = document.createElement('link');
        cssLink.rel = 'stylesheet';
        cssLink.href = 'https://cdn.jsdelivr.net/npm/mermaid@10.9.1/dist/mermaid.min.css';
        document.head.appendChild(cssLink);

        // 创建脚本标签
        const script = document.createElement('script');
        script.src = 'https://cdn.jsdelivr.net/npm/mermaid@10.9.1/dist/mermaid.min.js';
        script.onload = () => resolve();
        script.onerror = () => reject(new Error('Failed to load Mermaid library'));
        document.head.appendChild(script);
    });
}

// 等待异步渲染结果
async function waitAsyncRenderResult(text: string): Promise<string> {
    try {
        // 确保Mermaid库已加载
        await loadMermaidLibrary();

        // 初始化Mermaid
        (window as any).mermaid.initialize({
            startOnLoad: false,
            theme: 'default'
        });

        // 创建临时容器
        const container = document.createElement('div');
        container.className = 'mermaid';
        container.textContent = text;
        container.style.position = 'absolute';
        container.style.left = '-9999px'; // 移出视口
        document.body.appendChild(container);

        // 渲染图表
        return new Promise((resolve) => {
            try {
                (window as any).mermaid.init(undefined, [container], (svgCode: string) => {
                    document.body.removeChild(container);
                    resolve(svgCode);
                });
            } catch (error) {
                document.body.removeChild(container);
                console.error('Mermaid render error:', error);
                resolve(text); // 返回原始文本
            }
        });
    } catch (error) {
        console.error('Failed to load or initialize Mermaid:', error);
        return text;
    }
}

// 渲染所有Mermaid图表
async function MermaidRenderAllGraph(text: string): Promise<string> {
    let renderResult = text;
    let match: RegExpExecArray | null = null;
    const regex = /```mermaid([\s\S]*?)```/g;

    // 使用全局搜索来查找所有匹配项
    while ((match = regex.exec(text)) !== null) {
        const graphDesc = match[1].trim();
        let mermaidRenderSvgString = '';

        // 从已经存储的map中获取
        const mapSvg = querySvgByMermaidCode(graphDesc);
        if (mapSvg !== undefined) {
            mermaidRenderSvgString = mapSvg;
        } else {
            try {
                mermaidRenderSvgString = await waitAsyncRenderResult(graphDesc);
                storeMermaidMapping(graphDesc, mermaidRenderSvgString);
            } catch (error) {
                console.error('Mermaid render error:', error);
                mermaidRenderSvgString = graphDesc;
            }
        }

        // 将结果包装在pre标签中
        mermaidRenderSvgString = `<div class="mermaid-container">${mermaidRenderSvgString}</div>`;
        renderResult = renderResult.replace(match[0], mermaidRenderSvgString);
    }

    return renderResult;
}

// 导出函数
export { MermaidRenderAllGraph, loadMermaidLibrary };