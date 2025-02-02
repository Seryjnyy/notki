import React, { useMemo } from "react"
import { defaults, useNoteSettings } from "@repo/lib/stores/note-settings-store"

export default function useNoteStyleSettings() {
  const style = useNoteSettings.use.style()
  const setStyle = useNoteSettings.use.setStyle()
  const resetStyle = useNoteSettings.use.resetStyle()

  const limits = useMemo(() => {
    return {
      elevation: { max: 300, min: 0 },
    } as const
  }, [])

  const updateElevation = React.useCallback(
    (size: number) => {
      if (size < limits.elevation.min || size > limits.elevation.max) return

      setStyle({ ...style, elevation: size })
    },
    [style, setStyle]
  )

  const resetElevation = React.useCallback(() => {
    setStyle({ ...style, elevation: defaults.style.elevation })
  }, [defaults.style.elevation, setStyle, style])

  return {
    style,
    limits,
    updateElevation,
    resetStyle,
    resetElevation,
  }
}
