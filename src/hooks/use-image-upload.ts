'use client'

import { useState } from 'react'
import imageCompression from 'browser-image-compression'
import { toast } from 'sonner'
import { UPLOAD_LIMIT } from '@/lib/constants'

/**
 * 图片上传 Hook。
 * 前端压缩 → POST /api/upload → 返回 Supabase Storage URL。
 */
export function useImageUpload() {
  const [isUploading, setIsUploading] = useState(false)

  /**
   * 上传单张图片
   * @param file 原始文件
   * @param bucket 存储桶名 ('avatars' | 'photos')
   * @returns 上传后的 public URL，失败返回 null
   */
  const upload = async (file: File, bucket: 'avatars' | 'photos'): Promise<string | null> => {
    // 文件类型校验
    if (!file.type.startsWith('image/')) {
      toast.error('请选择图片文件')
      return null
    }

    // 文件大小校验
    if (file.size > UPLOAD_LIMIT.MAX_FILE_SIZE_MB * 1024 * 1024) {
      toast.error(`图片大小不能超过 ${UPLOAD_LIMIT.MAX_FILE_SIZE_MB}MB`)
      return null
    }

    setIsUploading(true)

    try {
      // 前端压缩
      const compressed = await imageCompression(file, {
        maxSizeMB: 0.5,
        maxWidthOrHeight: UPLOAD_LIMIT.MAX_WIDTH_PX,
        useWebWorker: true,
        fileType: 'image/webp',
      })

      // 构建 FormData
      const formData = new FormData()
      formData.append('file', compressed, `${Date.now()}.webp`)
      formData.append('bucket', bucket)

      // 调用上传 API
      const res = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      })

      if (!res.ok) {
        const err = await res.json().catch(() => ({ message: '上传失败' }))
        throw new Error(err.message || '上传失败')
      }

      const { url } = await res.json()
      return url as string
    } catch (err) {
      console.error('[useImageUpload] upload error:', err)
      toast.error(err instanceof Error ? err.message : '图片上传失败')
      return null
    } finally {
      setIsUploading(false)
    }
  }

  return { upload, isUploading }
}
