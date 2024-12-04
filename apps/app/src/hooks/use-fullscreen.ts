import {useEffect, useState} from "react";
import {appWindow} from "@tauri-apps/api/window";

export const useFullscreen = () => {
    const [isFullscreen, setIsFullscreen] = useState<boolean | undefined>(
        undefined
    )

    useEffect(() => {
        const setUp = async () => {
            setIsFullscreen(await appWindow.isFullscreen())
        }
        setUp()
    }, [])

    const toggleFullscreen = async () => {
        await appWindow.setFullscreen(!(await appWindow.isFullscreen()))
        // Fetch updated value in case state mismatch
        setIsFullscreen(await appWindow.isFullscreen())
    }

    return {
        isFullscreen,
        toggleFullscreen,
    }
}