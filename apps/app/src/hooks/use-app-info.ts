import { useEffect, useState } from "react"
import { PackageInfoSerializable } from "~/lib/backend-types.ts"
import { getAppInfo } from "~/lib/services/general-service.ts"

export const useAppInfo = () => {
  const [appInfo, setAppInfo] = useState<PackageInfoSerializable | null>(null)

  useEffect(() => {
    const setUp = async () => {
      setAppInfo((await getAppInfo()) as PackageInfoSerializable)
    }
    setUp()
  }, [])

  if (!appInfo) return null

  return appInfo
}
