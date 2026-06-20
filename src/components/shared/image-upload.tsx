'use client'

import { useRef } from 'react'
import { Button } from '@/components/ui/button'
import { Loader2, Upload } from 'lucide-react'

interface ImageUploadProps {
  onUpload: (file: File) => Promise<string | null>
  isUploading: boolean
  accept?: string
  label?: string
}

/**
 * 通用图片上传按钮。
 * 点击 → 选择文件 → onUpload(file) → 返回 URL。
 */
export function ImageUpload({
  onUpload,
  isUploading,
  accept = 'image/*',
  label = '上传图片',
}: ImageUploadProps) {
  const inputRef = useRef<HTMLInputElement>(null)

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    await onUpload(file)
    // 清空 input 以便再次选择同一文件
    if (inputRef.current) inputRef.current.value = ''
  }

  return (
    <>
      <input
        ref={inputRef}
        type="file"
        accept={accept}
        onChange={handleFileChange}
        className="hidden"
      />
      <Button
        type="button"
        variant="outline"
        onClick={() => inputRef.current?.click()}
        disabled={isUploading}
      >
        {isUploading ? (
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
        ) : (
          <Upload className="mr-2 h-4 w-4" />
        )}
        {isUploading ? '上传中...' : label}
      </Button>
    </>
  )
}
