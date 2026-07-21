import { useState, useRef } from 'react'
import { Camera, Upload, Trash2, Loader2, Sparkles } from 'lucide-react'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { toast } from 'sonner'
import { getSpeciesPlaceholder } from '../utils/placeholders'

interface AnimalPhotoUploadProps {
  value: string
  onChange: (val: string) => void
  species: string
}

export function AnimalPhotoUpload({ value, onChange, species }: AnimalPhotoUploadProps) {
  const [isDragOver, setIsDragOver] = useState(false)
  const [loading, setLoading] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFile = (file: File) => {
    if (!file) return
    if (!['image/jpeg', 'image/png', 'image/webp'].includes(file.type)) {
      toast.error('Only JPG, PNG, and WEBP images are supported.')
      return
    }

    if (file.size > 5 * 1024 * 1024) {
      toast.error('File size exceeds the 5MB limit.')
      return
    }

    setLoading(true)
    const reader = new FileReader()
    reader.onload = (e) => {
      const base64 = e.target?.result as string
      onChange(base64)
      setLoading(false)
    }
    reader.onerror = () => {
      toast.error('Failed to read file.')
      setLoading(false)
    }
    reader.readAsDataURL(file)
  }

  const onDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragOver(true)
  }

  const onDragLeave = () => {
    setIsDragOver(false)
  }

  const onDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragOver(false)
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0])
    }
  }

  const onFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      handleFile(e.target.files[0])
    }
  }

  const triggerUpload = () => {
    fileInputRef.current?.click()
  }

  const removePhoto = (e: React.MouseEvent) => {
    e.stopPropagation()
    onChange('')
  }

  const currentPlaceholder = getSpeciesPlaceholder(species)
  const isPresetSelected = value.startsWith('/images/animals/')

  return (
    <div className='space-y-2'>
      <span className='text-sm font-medium text-foreground'>Animal Photo</span>
      
      <div
        onDragOver={onDragOver}
        onDragLeave={onDragLeave}
        onDrop={onDrop}
        onClick={triggerUpload}
        className={cn(
          'relative h-44 w-full rounded-lg border-2 border-dashed flex flex-col items-center justify-center cursor-pointer overflow-hidden group transition-all duration-300 border-teal-500/20 bg-muted/20 hover:border-teal-500/40 hover:bg-muted/30',
          isDragOver && 'border-teal-500 bg-teal-500/5'
        )}
      >
        {/* Invisible file input */}
        <input
          type='file'
          ref={fileInputRef}
          onChange={onFileChange}
          accept='image/png, image/jpeg, image/webp'
          className='hidden'
        />

        {/* Display current image (either uploaded URL/base64 or species placeholder) */}
        <img
          src={value || currentPlaceholder}
          alt='Preview'
          className='absolute inset-0 w-full h-full object-cover transition-transform duration-300 group-hover:scale-105'
        />
        
        {/* Cover layer on hover */}
        <div className='absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col items-center justify-center text-white gap-2'>
          <Camera className='h-8 w-8 animate-pulse text-white' />
          <span className='text-xs font-semibold'>Upload / Drop Photo</span>
        </div>

        {/* Center overlay indicator if no custom photo uploaded yet */}
        {!value && (
          <div className='absolute bottom-2 left-0 right-0 text-center pointer-events-none group-hover:opacity-0 transition-opacity duration-200'>
            <span className='inline-flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider bg-black/60 text-teal-400 px-2 py-0.5 rounded'>
              <Upload className='h-3 w-3' /> Species Auto-Placeholder
            </span>
          </div>
        )}

        {/* Preset selected indicator */}
        {isPresetSelected && (
          <div className='absolute bottom-2 left-2 text-center pointer-events-none'>
            <span className='inline-flex items-center gap-1 text-[9px] font-bold uppercase bg-teal-600/90 text-white px-1.5 py-0.5 rounded shadow'>
              <Sparkles className='h-2.5 w-2.5' /> Manual Preset
            </span>
          </div>
        )}

        {/* Loading overlay */}
        {loading && (
          <div className='absolute inset-0 bg-black/60 flex items-center justify-center text-white'>
            <Loader2 className='h-8 w-8 animate-spin' />
          </div>
        )}

        {/* Remove button if custom image or preset is chosen */}
        {value && (
          <Button
            type='button'
            variant='destructive'
            size='icon'
            onClick={removePhoto}
            className='absolute top-2 right-2 h-7 w-7 rounded-full shadow-lg z-20 transition-transform hover:scale-110'
          >
            <Trash2 className='h-3.5 w-3.5' />
          </Button>
        )}
      </div>

      {/* Manual Preset Selection Dropdown */}
      <div className='flex items-center gap-2 mt-1 w-full bg-muted/20 p-2 rounded-lg border border-teal-500/5'>
        <span className='text-[11px] font-bold text-muted-foreground shrink-0'>MANUAL PRESET:</span>
        <select
          onChange={(e) => {
            if (e.target.value) {
              onChange(e.target.value)
            } else {
              onChange('')
            }
          }}
          value={isPresetSelected ? value : ''}
          className='flex h-8 w-full rounded-md border border-teal-500/10 bg-background px-2 py-1 text-xs shadow-sm focus:outline-none focus:ring-1 focus:ring-ring text-foreground'
        >
          <option value=''>-- Auto-Detect Placeholder --</option>
          <option value='/images/animals/dog-placeholder.jpg'>Dog Preset</option>
          <option value='/images/animals/cat-placeholder.jpg'>Cat Preset</option>
          <option value='/images/animals/bird-placeholder.jpg'>Bird Preset</option>
          <option value='/images/animals/rabbit-placeholder.jpg'>Rabbit Preset</option>
          <option value='/images/animals/snake-placeholder.jpg'>Snake / Reptile Preset</option>
          <option value='/images/animals/monkey-placeholder.jpg'>Monkey Preset</option>
          <option value='/images/animals/chicken-placeholder.jpg'>Chicken / Poultry Preset</option>
          <option value='/images/animals/goat-placeholder.jpg'>Goat Preset</option>
          <option value='/images/animals/pig-placeholder.jpg'>Pig Preset</option>
          <option value='/images/animals/horse-placeholder.jpg'>Horse Preset</option>
          <option value='/images/animals/cow-placeholder.jpg'>Cow Preset</option>
          <option value='/images/animals/default-placeholder.jpg'>Default Preset</option>
        </select>
      </div>

      <p className='text-[10px] text-muted-foreground text-center'>
        Supports JPG, PNG, and WEBP. Drag & drop or click to upload custom photo.
      </p>
    </div>
  )
}
