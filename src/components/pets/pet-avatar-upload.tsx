'use client'

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { ImageUpload } from '@/components/shared/image-upload'
import { useImageUpload } from '@/hooks/use-image-upload'

interface PetAvatarUploadProps {
  currentUrl: string | null
  onUploaded: (url: string | null) => void
}

/**
 * 宠物头像上传 + 预览。
 */
export function PetAvatarUpload({ currentUrl, onUploaded }: PetAvatarUploadProps) {
  const { upload, isUploading } = useImageUpload()

  const handleUpload = async (file: File) => {
    const url = await upload(file, 'avatars')
    if (url) {
      onUploaded(url)
    }
    return url
  }

  return (
    <div className="flex flex-col items-center gap-3">
      <Avatar className="h-20 w-20">
        <AvatarImage src={currentUrl ?? undefined} />
        <AvatarFallback className="text-2xl">🐾</AvatarFallback>
      </Avatar>
      <ImageUpload onUpload={handleUpload} isUploading={isUploading} label="上传头像" />
    </div>
  )
}
