import { getColorValue, MESSAGES, UI_CONFIG } from '@/config/constants'
import type { PolygonMarkerListProps } from './types'
import type { Marker, Polygon } from '@/types'
import { Button } from '../button'

export const PolygonMarkerList = ({
  type,
  items,
  selectedId,
  onSelect,
  onReset,
  title
}: PolygonMarkerListProps) => {
  if (items.length === 0) return null

  return (
    <div
      className={`absolute top-4 right-4 ${UI_CONFIG.CONTROLS_Z_INDEX} ${UI_CONFIG.MAX_LIST_WIDTH} rounded-lg bg-white p-4 shadow-lg`}
    >
      <h3 className="mb-3 text-lg font-semibold">{title}</h3>
      <div className={`${UI_CONFIG.MAX_LIST_HEIGHT} space-y-2 overflow-y-auto`}>
        {items.map(item => (
          <div
            key={item.id}
            className={`m-1 cursor-pointer rounded p-2 transition-colors ${
              type === 'polygon' && selectedId === item.id
                ? 'bg-blue-100 outline-2 outline-blue-500'
                : 'bg-gray-50 hover:bg-gray-100'
            }`}
            onClick={() => onSelect?.(selectedId === item.id ? null : item.id)}
          >
            <div className="flex items-center gap-2">
              <div
                className="h-4 w-4 rounded"
                style={{
                  backgroundColor: getColorValue(
                    (item as Polygon).color || (item as Marker).color
                  )
                }}
              />
              <span className="text-sm font-medium">
                {type === 'polygon'
                  ? (item as Polygon).name
                  : (item as Marker).title}
              </span>
            </div>
            {type === 'polygon' && (
              <div className="mt-1 text-xs text-gray-500">
                {MESSAGES.POINTS_COUNT((item as Polygon).points.length)}
              </div>
            )}
          </div>
        ))}
        <Button className="mt-4" variant="danger" onClick={onReset}>
          {MESSAGES.RESET_BUTTON}
        </Button>
      </div>
    </div>
  )
}
