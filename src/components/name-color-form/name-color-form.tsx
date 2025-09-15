import type { FC } from 'react'
import type { PolygonColor } from '@/types'
import { ColorPicker } from '@/components/color-picker'
import { Button } from '@/components/button'

interface NameColorFormProps {
  title: string
  name: string
  color: PolygonColor
  onNameChange: (name: string) => void
  onColorChange: (color: PolygonColor) => void
  onSave: () => void
  onCancel: () => void
  saveButtonText?: string
  cancelButtonText?: string
  className?: string
  isModal?: boolean
  isOpen?: boolean
}

export const NameColorForm: FC<NameColorFormProps> = ({
  title,
  name,
  color,
  onNameChange,
  onColorChange,
  onSave,
  onCancel,
  saveButtonText = 'Сохранить',
  cancelButtonText = 'Отмена',
  className = '',
  isModal = false,
  isOpen = true
}) => {
  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      onSave()
    } else if (e.key === 'Escape') {
      onCancel()
    }
  }

  const formContent = (
    <div className={`rounded-lg border bg-white p-4 shadow-lg ${className}`}>
      <h3 className="mb-3 text-lg font-semibold">{title}</h3>

      <div className="space-y-4">
        <div>
          <label className="mb-2 block text-sm font-medium text-gray-700">
            Название
          </label>
          <input
            type="text"
            value={name}
            onChange={e => onNameChange(e.target.value)}
            placeholder="Введите название..."
            className="w-full rounded-md border border-gray-300 px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
            autoFocus={isModal}
          />
        </div>

        <div>
          <label className="mb-2 block text-sm font-medium text-gray-700">
            Цвет
          </label>
          <ColorPicker selectedColor={color} onColorChange={onColorChange} />
        </div>

        <div className="flex gap-2 pt-2">
          <Button onClick={onSave} disabled={!name.trim()}>
            {saveButtonText}
          </Button>
          <Button onClick={onCancel} variant="secondary">
            {cancelButtonText}
          </Button>
        </div>
      </div>
    </div>
  )

  if (isModal) {
    if (!isOpen) return null

    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
        <div className="mx-4 w-full max-w-md" onKeyDown={handleKeyPress}>
          {formContent}
        </div>
      </div>
    )
  }

  return formContent
}
