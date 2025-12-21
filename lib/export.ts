import { toPng, toSvg, toBlob, toJpeg, toCanvas } from 'html-to-image';

export const downloadImage = async (nodeId: string, format: 'png' | 'svg' | 'jpeg' | 'webp', fileName: string = 'syntaray', pixelRatio: number = 2) => {
    const node = document.getElementById(nodeId);
    if (!node) return;

    try {
        const options = {
            pixelRatio,
            cacheBust: true,
            filter: (node: HTMLElement) => {
                const classList = node.classList;
                return !classList?.contains('export-exclude');
            },
            backgroundColor: (format === 'jpeg') ? '#ffffff' : undefined,
        };

        let dataUrl;
        if (format === 'png') {
            dataUrl = await toPng(node, options);
        } else if (format === 'jpeg') {
            dataUrl = await toJpeg(node, { ...options, quality: 0.95 });
        } else if (format === 'webp') {
            const canvas = await toCanvas(node, options);
            dataUrl = canvas.toDataURL('image/webp', 0.9);
        } else {
            dataUrl = await toSvg(node, options);
        }

        const link = document.createElement('a');
        link.download = `${fileName}.${format === 'jpeg' ? 'jpg' : format}`;
        link.href = dataUrl;
        link.click();
    } catch (err) {
        console.error('Export failed', err);
        throw err;
    }
};

export const copyImageToClipboard = async (nodeId: string, pixelRatio: number = 2) => {
    const node = document.getElementById(nodeId);
    if (!node) return;

    try {
        // use toBlob directly for clipboard
        const blob = await toBlob(node, {
            pixelRatio,
            cacheBust: true,
            filter: (node: HTMLElement) => {
                const classList = node.classList;
                return !classList?.contains('export-exclude');
            },
        });

        if (!blob) throw new Error('Failed to generate blob');

        await navigator.clipboard.write([
            new ClipboardItem({
                'image/png': blob
            })
        ]);
    } catch (err) {
        console.error('Copy failed:', err);
        if (err instanceof Error && err.message.includes('cssRules')) {
            alert("Security Error: Browser restricted access to some styles. Try downloading the image instead or use a different browser.");
        }
        throw err;
    }
};
