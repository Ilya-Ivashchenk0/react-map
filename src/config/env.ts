const baseEnv = import.meta.env

export const env = {
  yandexMapBaseUrl: baseEnv.VITE_YANDEX_MAP_BASE_URL,
  yandexMapApiKey: baseEnv.VITE_YANDEX_API_KEY
}
