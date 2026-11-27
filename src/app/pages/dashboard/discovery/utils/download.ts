/*
   Download Helper

   Client-side Blob download utility shared across discovery export actions
   such as JSON production manifests and CSV privilege logs.
*/

// Helpers
export function downloadTextFile(filename: string, content: string, mimeType: string): void {
    if (typeof document === 'undefined') {
        return;
    }

    const blob = new Blob([content], { type: mimeType });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');

    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    URL.revokeObjectURL(url);
}
