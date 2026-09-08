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

export const highlightCode = async (code: string, lang: string, theme: string, showLineNumbers?: boolean, highlightedLines: number[] = []) => {
    const highlighter = await initializeHighlighter();

    // Shiki's option and hast node types are not re-exported by the bundle entry.
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const options: any = {
        lang,
        theme,
    };

    options.transformers = [
        {
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            line(node: any, line: number) {
                // Dimming logic
                if (highlightedLines.length > 0 && !highlightedLines.includes(line)) {
                    node.properties.style = (node.properties.style || '') + 'opacity: 0.3; filter: grayscale(0.5); transition: opacity 0.3s;';
                }

                // Line numbers
                if (showLineNumbers) {
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
        }
    ];

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

// Helper function to calculate luminance from hex color
const getLuminance = (hex: string): number => {
    // Remove # if present
    const color = hex.replace('#', '');

    // Convert to RGB
    const r = parseInt(color.substring(0, 2), 16) / 255;
    const g = parseInt(color.substring(2, 4), 16) / 255;
    const b = parseInt(color.substring(4, 6), 16) / 255;

    // Apply gamma correction
    const [rs, gs, bs] = [r, g, b].map(c =>
        c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4)
    );

    // Calculate relative luminance
    return 0.2126 * rs + 0.7152 * gs + 0.0722 * bs;
};

// Get contrasting text color based on background
export const getContrastColor = (bgColor: string): string => {
    const luminance = getLuminance(bgColor);
    // If background is light (luminance > 0.5), use dark text, otherwise use light text
    return luminance > 0.5 ? 'rgba(0, 0, 0, 0.7)' : 'rgba(255, 255, 255, 0.7)';
};
