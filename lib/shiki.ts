import { createHighlighter, type Highlighter } from 'shiki';

let highlighterInstance: Highlighter | null = null;

export const initializeHighlighter = async () => {
    if (highlighterInstance) return highlighterInstance;

    highlighterInstance = await createHighlighter({
        themes: [
            'andromeeda', 'aurora-x', 'ayu-dark', 'catppuccin-latte', 'catppuccin-frappe',
            'catppuccin-macchiato', 'catppuccin-mocha', 'dark-plus', 'dracula', 'dracula-soft',
            'github-dark', 'github-dark-dimmed', 'github-light', 'light-plus', 'material-theme',
            'material-theme-lighter', 'material-theme-darker', 'material-theme-ocean',
            'material-theme-palenight', 'min-dark', 'min-light', 'monokai', 'night-owl',
            'nord', 'one-dark-pro', 'poimandres', 'rose-pine', 'rose-pine-dawn', 'rose-pine-moon',
            'slack-dark', 'slack-ochin', 'solarized-dark', 'solarized-light', 'synthwave-84',
            'tokyo-night', 'vitesse-dark', 'vitesse-light'
        ],
        langs: [
            'javascript', 'typescript', 'tsx', 'jsx', 'python', 'html', 'css',
            'json', 'bash', 'go', 'rust', 'java', 'c', 'cpp', 'csharp', 'php',
            'kotlin', 'swift', 'ruby', 'sql', 'yaml', 'markdown', 'vue', 'svelte'
        ],
    });

    return highlighterInstance;
};

export const highlightCode = async (code: string, lang: string, theme: string, showLineNumbers?: boolean) => {
    const highlighter = await initializeHighlighter();

    const options: any = {
        lang,
        theme,
    };

    if (showLineNumbers) {
        options.transformers = [
            {
                line(node: any, line: number) {
                    node.children.unshift({
                        type: 'element',
                        tagName: 'span',
                        properties: {
                            class: 'line-number',
                            style: 'display: inline-block; width: 1.5rem; margin-right: 1.5rem; text-align: right; color: rgba(128, 128, 128, 0.4); font-size: 0.9em; user-select: none;'
                        },
                        children: [{ type: 'text', value: line.toString() }]
                    });
                }
            }
        ];
    }

    try {
        return highlighter.codeToHtml(code, options);
    } catch (e) {
        options.lang = 'text';
        return highlighter.codeToHtml(code, options);
    }
};

export const getThemeColors = async (theme: string) => {
    const highlighter = await initializeHighlighter();
    const themeData = highlighter.getTheme(theme);
    return {
        bg: typeof themeData.bg === 'string' ? themeData.bg : '#1e1e1e', // fallback
        fg: typeof themeData.fg === 'string' ? themeData.fg : '#ffffff',
    };
};
