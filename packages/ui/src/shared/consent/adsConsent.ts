export type AdsConsent = {
  contextualAds: boolean
}

const CONSENT_STORAGE_KEY = "ads-consent"

export function getAdsConsent(): AdsConsent {
  if (typeof window === "undefined") {
    return { contextualAds: false }
  }

  const value = window.localStorage.getItem(CONSENT_STORAGE_KEY)
  if (!value) {
    return { contextualAds: false }
  }

  try {
    const parsed = JSON.parse(value)
    return {
      contextualAds: Boolean(parsed?.contextualAds),
    }
  } catch {
    return { contextualAds: value === "1" || value === "true" }
  }
}
