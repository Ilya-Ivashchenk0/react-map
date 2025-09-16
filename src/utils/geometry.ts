// Утилиты для работы с геометрией

export const calculateDistance = (
  point1: [number, number],
  point2: [number, number]
): number => {
  const R = 6371000 // Радиус Земли в метрах
  const lat1 = (point1[1] * Math.PI) / 180
  const lat2 = (point2[1] * Math.PI) / 180
  const deltaLat = ((point2[1] - point1[1]) * Math.PI) / 180
  const deltaLon = ((point2[0] - point1[0]) * Math.PI) / 180

  const a =
    Math.sin(deltaLat / 2) * Math.sin(deltaLat / 2) +
    Math.cos(lat1) *
      Math.cos(lat2) *
      Math.sin(deltaLon / 2) *
      Math.sin(deltaLon / 2)
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))

  return R * c
}

export const calculatePolygonArea = (points: [number, number][]): number => {
  if (points.length < 3) return 0

  let area = 0
  const n = points.length

  for (let i = 0; i < n; i++) {
    const j = (i + 1) % n
    area += points[i][0] * points[j][1]
    area -= points[j][0] * points[i][1]
  }

  area = Math.abs(area) / 2

  // Конвертируем из градусов в квадратные метры (приблизительно)
  const R = 6371000 // Радиус Земли в метрах
  const lat = points[0][1] * (Math.PI / 180)
  const scale = Math.cos(lat) * R * R

  return area * scale
}

export const isPointInPolygon = (
  point: [number, number],
  polygon: [number, number][]
): boolean => {
  let inside = false
  const x = point[0]
  const y = point[1]

  for (let i = 0, j = polygon.length - 1; i < polygon.length; j = i++) {
    const xi = polygon[i][0]
    const yi = polygon[i][1]
    const xj = polygon[j][0]
    const yj = polygon[j][1]

    if (yi > y !== yj > y && x < ((xj - xi) * (y - yi)) / (yj - yi) + xi) {
      inside = !inside
    }
  }

  return inside
}

export const getPolygonCentroid = (
  points: [number, number][]
): [number, number] => {
  if (points.length === 0) return [0, 0]

  let x = 0
  let y = 0

  for (const point of points) {
    x += point[0]
    y += point[1]
  }

  return [x / points.length, y / points.length]
}
