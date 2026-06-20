'use client'

import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import { useTimeline, type TimelineEvent } from '@/hooks/use-timeline'
import { useImageUpload } from '@/hooks/use-image-upload'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Skeleton } from '@/components/ui/skeleton'
import { CuteDog } from '@/components/shared/pet-decoration'
import { ConfirmDialog } from '@/components/shared/confirm-dialog'
import { ArrowLeft, Plus, Camera, Trash2, Star, Pencil, Loader2 } from 'lucide-react'
import { formatDateShort, todayISO } from '@/lib/utils/date'

const EVENT_TYPES: Record<string, { icon: string; label: string }> = {
  arrived_home: { icon: '🏠', label: '到家' },
  birthday: { icon: '🎂', label: '生日' },
  vaccine: { icon: '💉', label: '疫苗' },
  deworming: { icon: '🪱', label: '驱虫' },
  grooming: { icon: '✂️', label: '美容' },
  weight: { icon: '⚖️', label: '体重' },
  medical: { icon: '🏥', label: '医疗' },
  training: { icon: '🎯', label: '训练' },
  milestone: { icon: '⭐', label: '里程碑' },
  photo: { icon: '📸', label: '照片' },
  note: { icon: '📝', label: '笔记' },
}

export default function TimelinePage() {
  const params = useParams()
  const router = useRouter()
  const id = params.id as string
  const { events, isLoading, fetchEvents, createEvent, updateEvent, deleteEvent } = useTimeline(id)
  const { upload, isUploading } = useImageUpload()

  const [showForm, setShowForm] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [form, setForm] = useState({
    eventType: 'note',
    title: '',
    description: '',
    eventDate: todayISO(),
    isMilestone: false,
  })
  const [photoUrl, setPhotoUrl] = useState<string | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [deleteId, setDeleteId] = useState<string | null>(null)

  useEffect(() => { fetchEvents() }, [fetchEvents])

  const resetForm = () => {
    setForm({ eventType: 'note', title: '', description: '', eventDate: todayISO(), isMilestone: false })
    setPhotoUrl(null)
    setEditingId(null)
    setShowForm(false)
  }

  const startEdit = (e: TimelineEvent) => {
    const raw = e as any
    setEditingId(e.id)
    setForm({
      eventType: raw.event_type ?? e.eventType,
      title: raw.title ?? e.title,
      description: raw.description ?? e.description ?? '',
      eventDate: (raw.event_date ?? e.eventDate).slice(0, 10),
      isMilestone: raw.is_milestone ?? e.isMilestone,
    })
    setPhotoUrl(raw.photo_url ?? e.photoUrl ?? null)
    setShowForm(true)
  }

  const handleSubmit = async (ev: React.FormEvent) => {
    ev.preventDefault()
    if (!form.title.trim()) return
    setIsSubmitting(true)
    if (editingId) {
      await updateEvent(editingId, {
        eventType: form.eventType,
        title: form.title,
        description: form.description || undefined,
        photoUrl: photoUrl ?? undefined,
        eventDate: form.eventDate,
        isMilestone: form.isMilestone,
      })
    } else {
      await createEvent({
        petId: id,
        eventType: form.eventType,
        title: form.title,
        description: form.description || undefined,
        photoUrl: photoUrl || undefined,
        eventDate: form.eventDate,
        isMilestone: form.isMilestone,
      })
    }
    resetForm()
    setIsSubmitting(false)
  }

  const handlePhotoUpload = async (file: File) => {
    const url = await upload(file, 'photos')
    if (url) setPhotoUrl(url)
  }

  // 按年月分组
  const grouped = events.reduce(
    (acc, e) => {
      const ym = (e as any).event_date?.slice(0, 7) ?? e.eventDate.slice(0, 7)
      if (!acc[ym]) acc[ym] = []
      acc[ym].push(e)
      return acc
    },
    {} as Record<string, TimelineEvent[]>
  )

  return (
    <div className="container mx-auto max-w-lg p-4 pb-20 animate-fade-in-up">
      {/* 顶栏 */}
      <div className="mb-4 flex items-center justify-between">
        <button onClick={() => router.back()} className="text-muted-foreground hover:text-foreground">
          <ArrowLeft className="h-5 w-5" />
        </button>
        <h1 className="text-lg font-semibold">
          {editingId ? '✏️ 编辑事件' : '📖 成长时间轴'}
        </h1>
        <Button size="sm" onClick={() => setShowForm(!showForm)} className="btn-primary h-8 text-xs">
          <Plus className="mr-1 h-3.5 w-3.5" />事件
        </Button>
      </div>

      {/* 新增表单 */}
      {showForm && (
        <form onSubmit={handleSubmit} className="mb-6 space-y-3 rounded-2xl border border-border bg-card p-4 shadow-sm">
          <div className="flex flex-wrap gap-1.5">
            {Object.entries(EVENT_TYPES).map(([key, { icon, label }]) => (
              <button
                key={key}
                type="button"
                onClick={() => setForm((f) => ({ ...f, eventType: key }))}
                className={`inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs transition-colors ${
                  form.eventType === key
                    ? 'bg-primary text-primary-foreground'
                    : 'bg-muted text-muted-foreground hover:bg-accent'
                }`}
              >
                {icon} {label}
              </button>
            ))}
          </div>
          <Input placeholder="事件标题 *" value={form.title} onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))} maxLength={200} />
          <textarea className="input-pet min-h-[60px] resize-y" placeholder="描述（可选）" value={form.description} onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))} rows={2} />
          <div className="flex gap-3">
            <Input type="date" value={form.eventDate} onChange={(e) => setForm((f) => ({ ...f, eventDate: e.target.value }))} max={todayISO()} />
            <label className="flex cursor-pointer items-center gap-1 text-sm text-muted-foreground hover:text-foreground">
              <input type="file" accept="image/*" className="hidden" onChange={async (e) => { const f = e.target.files?.[0]; if (f) await handlePhotoUpload(f) }} disabled={isUploading} />
              <Camera className="h-4 w-4" /> {isUploading ? '...' : '照片'}
            </label>
          </div>
          {photoUrl && <img src={photoUrl} alt="" className="h-20 rounded-lg object-cover" />}
          <label className="flex items-center gap-2 text-sm">
            <input type="checkbox" checked={form.isMilestone} onChange={(e) => setForm((f) => ({ ...f, isMilestone: e.target.checked }))} />
            <Star className="h-4 w-4 text-amber-400" /> 标记为里程碑
          </label>
          <div className="flex gap-2">
            <Button type="submit" disabled={isSubmitting || !form.title.trim()} className="btn-primary flex-1 h-9 text-sm">
              {isSubmitting ? <Loader2 className="mr-1 h-4 w-4 animate-spin" /> : null}保存
            </Button>
            <Button type="button" variant="ghost" onClick={resetForm}>取消</Button>
          </div>
        </form>
      )}

      {/* 加载态 */}
      {isLoading && (
        <div className="space-y-3">
          {[1,2,3].map(i => <Skeleton key={i} className="h-24 rounded-2xl" />)}
        </div>
      )}

      {/* 空状态 */}
      {!isLoading && events.length === 0 && (
        <div className="flex flex-col items-center py-16 text-center">
          <CuteDog size={80} />
          <h3 className="mt-4 font-semibold">还没有故事</h3>
          <p className="mt-1 text-sm text-muted-foreground">从添加第一张照片或事件开始吧</p>
          <Button onClick={() => setShowForm(true)} className="btn-primary mt-4">+ 添加事件</Button>
        </div>
      )}

      {/* 时间轴 */}
      {!isLoading && Object.entries(grouped).map(([ym, items]) => (
        <div key={ym} className="mb-6">
          <div className="mb-3 flex items-center gap-3">
            <span className="text-sm font-semibold text-muted-foreground">
              {ym.replace('-', '年')}月
            </span>
            <div className="flex-1 border-t border-border" />
          </div>
          <div className="space-y-2">
            {items.map((e) => {
              const raw = e as any
              const evtType = raw.event_type ?? e.eventType
              const evtDate = raw.event_date ?? e.eventDate
              const evtTitle = raw.title ?? e.title
              const evtDesc = raw.description ?? e.description
              const evtPhoto = raw.photo_url ?? e.photoUrl
              const evtMilestone = raw.is_milestone ?? e.isMilestone
              const typeInfo = EVENT_TYPES[evtType] ?? { icon: '📌', label: evtType }

              return (
                <div key={e.id} className={`relative flex gap-3 rounded-2xl border p-4 transition-all duration-200 hover:shadow-sm ${evtMilestone ? 'border-amber-200 bg-amber-50/30' : 'border-border bg-card'}`}>
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-muted text-xl">
                    {typeInfo.icon}
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      {evtMilestone && <Star className="h-3.5 w-3.5 text-amber-400" />}
                      <p className="font-medium text-sm">{evtTitle}</p>
                    </div>
                    {evtDesc && <p className="mt-1 text-xs text-muted-foreground line-clamp-2">{evtDesc}</p>}
                    {evtPhoto && <img src={evtPhoto} alt="" className="mt-2 h-24 rounded-lg object-cover" />}
                    <p className="mt-1 text-xs text-muted-foreground">{formatDateShort(evtDate)}</p>
                  </div>
                  <div className="flex shrink-0 gap-0.5">
                    <button onClick={() => startEdit(e)} className="p-1 text-muted-foreground hover:text-foreground">
                      <Pencil className="h-3.5 w-3.5" />
                    </button>
                    <button onClick={() => setDeleteId(e.id)} className="p-1 text-muted-foreground hover:text-danger">
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      ))}

      <ConfirmDialog
        open={!!deleteId}
        title="删除事件"
        description="确定要删除这个时间轴事件吗？"
        confirmLabel="删除"
        variant="destructive"
        onConfirm={async () => { if (deleteId) { await deleteEvent(deleteId); setDeleteId(null) } }}
        onCancel={() => setDeleteId(null)}
      />
    </div>
  )
}
