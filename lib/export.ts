import { toPng, toSvg, toBlob } from 'html-to-image';

export const downloadImage = async (nodeId: string, format: 'png' | 'svg', fileName: string = 'syntaray') => {
    const node = document.getElementById(nodeId);
    if (!node) return;

    try {
        const options = {
            pixelRatio: 2,
            cacheBust: true,
            filter: (node: HTMLElement) => {
                const classList = node.classList;
                return !classList?.contains('export-exclude');
            },
        };

        let dataUrl;
        if (format === 'png') {
            dataUrl = await toPng(node, options);
        } else {
            dataUrl = await toSvg(node, options);
        }

        const link = document.createElement('a');
        link.download = `${fileName}.${format}`;
        link.href = dataUrl;
        link.click();
    } catch (err) {
        console.error('Export failed', err);
        throw err;
    }
};

export const copyImageToClipboard = async (nodeId: string) => {
    const node = document.getElementById(nodeId);
    if (!node) return;

    try {
        // use toBlob directly for clipboard
        const blob = await toBlob(node, {
            pixelRatio: 2,
            cacheBust: true,
            filter: (node: HTMLElement) => {
                const classList = node.classList;
                return !classList?.contains('export-exclude');
            },
            // If cssRules error persists, font embedding might be the culprit
            // in some environments. We try to be safe here.
        });

        if (!blob) throw new Error('Failed to generate blob');

        await navigator.clipboard.write([
            new ClipboardItem({
                'image/png': blob
            })
        ]);
    } catch (err) {
        console.error('Copy failed:', err);

        // Fallback or more specific error message
        if (err instanceof Error && err.message.includes('cssRules')) {
            alert("Security Error: Browser restricted access to some styles. Try downloading the image instead or use a different browser.");
        }
        throw err;
    }
};
