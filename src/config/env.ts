const baseEnv = import.meta.env

// Конфигурация переменных окружения
export const env = {
  yandexMapBaseUrl: baseEnv.VITE_YANDEX_MAP_BASE_URL,
  yandexMapApiKey: baseEnv.VITE_YANDEX_API_KEY
}
