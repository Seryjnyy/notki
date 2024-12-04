import { useCallback, useEffect, useState } from "react"
import { appWindow } from "@tauri-apps/api/window"
import { debounce } from "lodash"
import { UnlistenFn } from "@tauri-apps/api/helpers/event"

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
    // Might not be needed because the listener will detect screen size change and update state
    setIsFullscreen(await appWindow.isFullscreen())
  }

  const updateFullscreen = useCallback(async () => {
    setIsFullscreen(await appWindow.isFullscreen())
  }, [])

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const debouncedUpdate = useCallback(debounce(updateFullscreen, 300), [
    updateFullscreen,
  ])

  useEffect(() => {
    // Track component mounting state
    let isMounted = true

    const listenToResize = async () => {
      const cleanup = await appWindow.onResized(() => {
        debouncedUpdate()
      })

      // Returns clean up logic
      // Call cleanup if component is still mounted
      return () => {
        if (isMounted) {
          cleanup()
        }
      }
    }

    // Set up listener
    let cleanupPromise: UnlistenFn
    listenToResize().then((cleanupFunc) => {
      cleanupPromise = cleanupFunc
    })

    return () => {
      // Prevent state updates if component unmounts
      isMounted = false

      // Call clean up if listening function started listening and returned a cleanup func
      if (cleanupPromise) {
        cleanupPromise()
      }
    }
  }, [debouncedUpdate])

  useEffect(() => {
    if (isFullscreen) {
      appWindow.setResizable(!isFullscreen)
    }
  }, [isFullscreen])

  return {
    isFullscreen,
    toggleFullscreen,
  }
}
