import { useCallback, useState } from "react";

// TODO : There are like 3 versions of useCopy/useClipboard hooks in the codebase, needs to be unified
// https://github.com/omeralpi/shadcn-phone-input/blob/main/hooks/use-copy.tsx
function useClipboard() {
    const [isCopied, setIsCopied] = useState(false);

    const copyToClipboard = useCallback(async (text: string) => {
        if (navigator.clipboard && window.isSecureContext) {
            // Navigator Clipboard API method'
            try {
                await navigator.clipboard.writeText(text);
                setIsCopied(true);
            } catch (err) {
                console.error(err);
                setIsCopied(false);
            }
        } else {
            // Clipboard API not available, use fallback
            const textArea = document.createElement("textarea");
            textArea.value = text;
            document.body.appendChild(textArea);
            textArea.focus();
            textArea.select();
            try {
                const successful: boolean = document.execCommand("copy");
                setIsCopied(successful);
            } catch (err) {
                console.error(err);
                setIsCopied(false);
            }
            document.body.removeChild(textArea);
        }
    }, []);

    return { isCopied, copyToClipboard };
}

export default useClipboard;
