'use client'

import { useState, useEffect } from 'react'
import { useAuth } from '@/hooks/use-auth'
import { createClient } from '@/lib/supabase/client'
import { useApiSettingsStore } from '@/stores/api-settings-store'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { useImageUpload } from '@/hooks/use-image-upload'
import { LogOut, Loader2, Save, Camera } from 'lucide-react'
import { toast } from 'sonner'
import { useRouter } from 'next/navigation'

function RedirectToLogin() {
  const router = useRouter()
  useEffect(() => { router.push('/login') }, [router])
  return <div className="flex items-center justify-center py-20"><Loader2 className="h-8 w-8 animate-spin text-muted-foreground" /></div>
}

export default function ProfilePage() {
  const { user, isLoading, signOut } = useAuth()
  const [displayName, setDisplayName] = useState('')
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null)
  const [isSaving, setIsSaving] = useState(false)
  const router = useRouter()
  const { upload, isUploading } = useImageUpload()

  // API 设置
  const { apiKey, model, baseUrl, setApiKey, setModel, setBaseUrl } = useApiSettingsStore()
  const [localKey, setLocalKey] = useState(apiKey)
  const [localModel, setLocalModel] = useState(model)
  const [localBaseUrl, setLocalBaseUrl] = useState(baseUrl)
  const [showKey, setShowKey] = useState(false)

  useEffect(() => {
    if (!user) return
    const supabase = createClient()
    supabase.from('profiles').select('display_name, avatar_url').eq('id', user.id).single().then(({ data }) => {
      if (data) {
        if (data.display_name) setDisplayName(data.display_name)
        if ((data as any).avatar_url) setAvatarUrl((data as any).avatar_url)
      }
    })
  }, [user])

  const handleSaveName = async () => {
    if (!user) return
    setIsSaving(true)
    const supabase = createClient()
    const { error } = await supabase
      .from('profiles')
      .upsert({ id: user.id, display_name: displayName, avatar_url: avatarUrl }, { onConflict: 'id' })
    if (error) {
      console.error('[Profile] save error:', error)
      toast.error('保存失败: ' + error.message)
    } else {
      toast.success('昵称已更新')
    }
    setIsSaving(false)
  }

  const handleAvatarUpload = async (file: File) => {
    const url = await upload(file, 'avatars')
    if (url) {
      setAvatarUrl(url)
      // 立即保存头像 URL 到数据库
      const supabase = createClient()
      await supabase.from('profiles').upsert({ id: user!.id, avatar_url: url }, { onConflict: 'id' })
      toast.success('头像已更新')
    }
  }

  const handleSaveApi = () => {
    setApiKey(localKey)
    setModel(localModel)
    setBaseUrl(localBaseUrl)
    toast.success('API 设置已保存')
  }

  const handleLogout = async () => { await signOut() }

  if (isLoading) return <div className="flex items-center justify-center py-20"><Loader2 className="h-8 w-8 animate-spin text-muted-foreground" /></div>
  if (!user) return <RedirectToLogin />

  const initials = user.email?.slice(0, 2).toUpperCase() ?? '?'

  return (
    <div className="container mx-auto max-w-md space-y-6 p-4">
      {/* 用户信息 */}
      <Card>
        <CardHeader className="text-center">
          <div className="relative mx-auto inline-block">
            <Avatar className="h-20 w-20">
              <AvatarImage src={avatarUrl ?? undefined} />
              <AvatarFallback className="text-2xl">{initials}</AvatarFallback>
            </Avatar>
            <label className="absolute bottom-0 right-0 flex h-7 w-7 cursor-pointer items-center justify-center rounded-full bg-primary text-primary-foreground shadow hover:bg-primary/80">
              <Camera className="h-3.5 w-3.5" />
              <input
                type="file"
                accept="image/*"
                className="hidden"
                disabled={isUploading}
                onChange={async (e) => {
                  const file = e.target.files?.[0]
                  if (file) await handleAvatarUpload(file)
                }}
              />
            </label>
          </div>
          <CardTitle className="mt-2">{displayName || '未设置昵称'}</CardTitle>
          <CardDescription>{user.email}</CardDescription>
        </CardHeader>
      </Card>

      {/* 编辑昵称 */}
      <Card>
        <CardHeader><CardTitle className="text-base">编辑昵称</CardTitle><CardDescription>设置一个你喜欢的昵称</CardDescription></CardHeader>
        <CardContent>
          <div className="flex gap-2">
            <Input placeholder="输入昵称" value={displayName} onChange={(e) => setDisplayName(e.target.value)} maxLength={50} />
            <Button onClick={handleSaveName} disabled={isSaving} size="icon">
              {isSaving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* API 设置 */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">🤖 AI API 设置</CardTitle>
          <CardDescription>
            配置你的 API Key 即可使用 AI 助手。支持 OpenAI / DeepSeek 等兼容接口。
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          {/* API Key */}
          <div className="space-y-1.5">
            <label className="text-sm font-medium">API Key</label>
            <div className="relative">
              <Input
                type={showKey ? 'text' : 'password'}
                placeholder="sk-..."
                value={localKey}
                onChange={(e) => setLocalKey(e.target.value)}
              />
              <button
                type="button"
                onClick={() => setShowKey(!showKey)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-muted-foreground hover:text-foreground"
              >
                {showKey ? '隐藏' : '显示'}
              </button>
            </div>
          </div>

          {/* Model */}
          <div className="space-y-1.5">
            <label className="text-sm font-medium">模型</label>
            <Input
              placeholder="deepseek-chat"
              value={localModel}
              onChange={(e) => setLocalModel(e.target.value)}
            />
          </div>

          {/* Base URL */}
          <div className="space-y-1.5">
            <label className="text-sm font-medium">API 地址</label>
            <Input
              placeholder="https://api.deepseek.com"
              value={localBaseUrl}
              onChange={(e) => setLocalBaseUrl(e.target.value)}
            />
          </div>

          <Button onClick={handleSaveApi} className="w-full">
            <Save className="mr-2 h-4 w-4" />
            保存 API 设置
          </Button>
        </CardContent>
      </Card>

      {/* 登出 */}
      <Button variant="destructive" className="w-full" onClick={handleLogout}>
        <LogOut className="mr-2 h-4 w-4" />退出登录
      </Button>
    </div>
  )
}
