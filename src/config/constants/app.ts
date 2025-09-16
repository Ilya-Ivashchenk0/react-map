// Константы приложения

export const MAP_DEFAULTS = {
  DEFAULT_CENTER: [30.314809, 59.938848] as [number, number],
  DEFAULT_ZOOM: 10,
  MIN_POLYGON_POINTS: 3,
  POINT_SKIP_INTERVAL: 10
} as const

export const UI_CONFIG = {
  MAX_LIST_WIDTH: 'max-w-xs',
  MAX_LIST_HEIGHT: 'max-h-64',
  MODAL_Z_INDEX: 'z-50',
  CONTROLS_Z_INDEX: 'z-10'
} as const

export const MESSAGES = {
  LOADING_MAP: 'Загрузка карты...',
  POLYGON_TITLE: 'Настройки полигона',
  MARKER_TITLE: 'Создание маркера',
  POLYGON_LIST_TITLE: 'Полигоны',
  MARKER_LIST_TITLE: 'Маркеры',
  DRAW_POLYGON_BUTTON: 'Рисовать полигон',
  SAVE_BUTTON: 'Сохранить',
  CANCEL_BUTTON: 'Отмена',
  CLEAR_BUTTON: 'Очистить',
  RESET_BUTTON: 'Сбросить',
  ADD_MARKER_HINT: 'Кликните на карту для добавления маркера',
  POINTS_COUNT: (count: number) => `${count} точек`
} as const

export const PERFORMANCE = {
  MIN_POINT_DISTANCE: 0.00001,
  MOUSE_DEBOUNCE_MS: 16
} as const
