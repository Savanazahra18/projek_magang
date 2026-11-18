const readBoolean = (value: string | undefined, fallback: boolean) => {
  if (value === undefined || value.trim() === '') return fallback
  return value.toLowerCase() === 'true'
}

export const env = {
  appEnv: process.env.NEXT_PUBLIC_APP_ENV || 'development',
  apiBaseUrl: (process.env.NEXT_PUBLIC_API_BASE_URL || '').replace(/\/$/, ''),
  useDemoData: readBoolean(process.env.NEXT_PUBLIC_USE_DEMO_DATA, true),
} as const

export const isApiConfigured = Boolean(env.apiBaseUrl)
