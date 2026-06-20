'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useReminders, type Reminder } from '@/hooks/use-reminders'
import { usePets } from '@/hooks/use-pets'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Skeleton } from '@/components/ui/skeleton'
import { CuteDog } from '@/components/shared/pet-decoration'
import { ConfirmDialog } from '@/components/shared/confirm-dialog'
import { ArrowLeft, Plus, Trash2, CheckCircle2, Circle, Calendar, Loader2 } from 'lucide-react'
import { todayISO } from '@/lib/utils/date'

const REMINDER_TYPES: Record<string, { icon: string; label: string }> = {
  vaccine: { icon: '💉', label: '疫苗' },
  deworming: { icon: '🪱', label: '驱虫' },
  grooming: { icon: '✂️', label: '美容' },
  medical: { icon: '🏥', label: '体检' },
  birthday: { icon: '🎂', label: '生日' },
  anniversary: { icon: '🏠', label: '纪念日' },
  weight: { icon: '⚖️', label: '体重检查' },
  custom: { icon: '⭐', label: '自定义' },
}

function generateICS(r: Reminder, petName: string) {
  const start = new Date((r as any).due_date ?? r.dueDate)
  const end = new Date(start.getTime() + 3600000)
  const fmt = (d: Date) => d.toISOString().replace(/[-:]/g, '').slice(0, 15) + 'Z'
  return [
    'BEGIN:VCALENDAR', 'VERSION:2.0',
    'BEGIN:VEVENT',
    `SUMMARY:🐾 ${r.title} - ${petName}`,
    `DESCRIPTION:${(r as any).description ?? r.description ?? ''}`,
    `DTSTART:${fmt(start)}`, `DTEND:${fmt(end)}`,
    'END:VEVENT', 'END:VCALENDAR',
  ].join('\r\n')
}

function downloadICS(r: Reminder, petName: string) {
  const blob = new Blob([generateICS(r, petName)], { type: 'text/calendar' })
  const a = document.createElement('a')
  a.href = URL.createObjectURL(blob)
  a.download = `petmate-${r.title}.ics`
  a.click()
}

export default function RemindersPage() {
  const router = useRouter()
  const { reminders, isLoading, fetchReminders, createReminder, toggleComplete, deleteReminder } = useReminders()
  const { pets, fetchPets } = usePets()

  const [showForm, setShowForm] = useState(false)
  const [form, setForm] = useState({
    petId: '',
    type: 'custom' as string,
    title: '',
    description: '',
    dueDate: todayISO(),
    repeatType: 'none' as string,
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [deleteId, setDeleteId] = useState<string | null>(null)

  useEffect(() => { fetchPets(); fetchReminders() }, [fetchPets, fetchReminders])

  const petMap = Object.fromEntries(pets.map((p) => [p.id, (p as any).name ?? p.name]))

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!form.petId || !form.title.trim()) return
    setIsSubmitting(true)
    await createReminder({
      petId: form.petId,
      type: form.type,
      title: form.title,
      description: form.description || undefined,
      dueDate: form.dueDate,
      repeatType: form.repeatType === 'none' ? undefined : form.repeatType,
    })
    setForm({ petId: '', type: 'custom', title: '', description: '', dueDate: todayISO(), repeatType: 'none' })
    setShowForm(false)
    setIsSubmitting(false)
  }

  const upcoming = reminders.filter((r) => !(r as any).is_completed)
  const completed = reminders.filter((r) => (r as any).is_completed)

  return (
    <div className="container mx-auto max-w-lg p-4 pb-20 animate-fade-in-up">
      <div className="mb-4 flex items-center justify-between">
        <button onClick={() => router.back()} className="text-muted-foreground hover:text-foreground">
          <ArrowLeft className="h-5 w-5" />
        </button>
        <h1 className="text-lg font-semibold">🔔 提醒中心</h1>
        <Button size="sm" onClick={() => setShowForm(!showForm)} className="btn-primary h-8 text-xs">
          <Plus className="mr-1 h-3.5 w-3.5" />提醒
        </Button>
      </div>

      {/* 表单 */}
      {showForm && (
        <form onSubmit={handleSubmit} className="mb-6 space-y-3 rounded-2xl border border-border bg-card p-4 shadow-sm">
          <div className="space-y-1.5">
            <label className="text-sm font-medium">选择宠物 *</label>
            <select value={form.petId} onChange={(e) => setForm((f) => ({ ...f, petId: e.target.value }))} className="input-pet">
              <option value="">选择宠物</option>
              {pets.map((p) => (
                <option key={p.id} value={p.id}>{(p as any).name ?? p.name}</option>
              ))}
            </select>
          </div>
          <div className="flex flex-wrap gap-1.5">
            {Object.entries(REMINDER_TYPES).map(([key, { icon, label }]) => (
              <button key={key} type="button"
                onClick={() => setForm((f) => ({ ...f, type: key }))}
                className={`inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs transition-colors ${
                  form.type === key ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground hover:bg-accent'
                }`}
              >{icon} {label}</button>
            ))}
          </div>
          <Input placeholder="提醒标题 *" value={form.title} onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))} maxLength={200} />
          <Input placeholder="备注（可选）" value={form.description} onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))} />
          <div className="grid grid-cols-2 gap-3">
            <Input type="date" value={form.dueDate} onChange={(e) => setForm((f) => ({ ...f, dueDate: e.target.value }))} />
            <select value={form.repeatType} onChange={(e) => setForm((f) => ({ ...f, repeatType: e.target.value }))} className="input-pet">
              <option value="none">不重复</option>
              <option value="weekly">每周</option>
              <option value="monthly">每月</option>
              <option value="quarterly">每季度</option>
              <option value="yearly">每年</option>
            </select>
          </div>
          <div className="flex gap-2">
            <Button type="submit" disabled={isSubmitting || !form.petId || !form.title.trim()} className="btn-primary flex-1 h-9 text-sm">
              {isSubmitting ? <Loader2 className="mr-1 h-4 w-4 animate-spin" /> : null}保存
            </Button>
            <Button type="button" variant="ghost" onClick={() => setShowForm(false)}>取消</Button>
          </div>
        </form>
      )}

      {isLoading && <div className="space-y-3">{[1,2,3].map(i => <Skeleton key={i} className="h-16 rounded-2xl" />)}</div>}

      {!isLoading && reminders.length === 0 && (
        <div className="flex flex-col items-center py-16 text-center">
          <CuteDog size={80} />
          <h3 className="mt-4 font-semibold">暂无提醒</h3>
          <p className="mt-1 text-sm text-muted-foreground">创建提醒，不再忘记宠物的重要日子</p>
          <Button onClick={() => setShowForm(true)} className="btn-primary mt-4">+ 新建提醒</Button>
        </div>
      )}

      {/* 即将到来 */}
      {upcoming.length > 0 && (
        <div className="mb-6">
          <p className="mb-2 text-sm font-medium text-muted-foreground">📋 即将到来</p>
          <div className="space-y-2">
            {upcoming.map((r) => {
              const raw = r as any
              const daysLeft = Math.ceil((new Date(raw.due_date ?? r.dueDate).getTime() - Date.now()) / 86400000)
              const petName = petMap[raw.pet_id ?? r.petId] ?? '未知宠物'
              const typeInfo = REMINDER_TYPES[raw.type ?? r.type] ?? { icon: '📌', label: raw.type }
              const urgent = daysLeft < 0 ? 'text-danger' : daysLeft <= 3 ? 'text-danger' : daysLeft <= 14 ? 'text-warning' : 'text-muted-foreground'

              return (
                <div key={r.id} className="flex items-center gap-3 rounded-2xl border border-border bg-card p-3 shadow-sm">
                  <button onClick={() => toggleComplete(r.id, raw.is_completed ?? r.isCompleted)}>
                    <Circle className="h-5 w-5 text-muted-foreground hover:text-success" />
                  </button>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-1.5">
                      <span className="text-sm">{typeInfo.icon}</span>
                      <span className="font-medium text-sm truncate">{raw.title ?? r.title}</span>
                    </div>
                    <p className="text-xs text-muted-foreground">{petName}</p>
                  </div>
                  <div className="flex items-center gap-1 shrink-0">
                    <span className={`text-xs font-medium ${urgent}`}>
                      {daysLeft < 0 ? '已过期' : daysLeft === 0 ? '今天' : `${daysLeft}天后`}
                    </span>
                    <button onClick={() => downloadICS(r, petName)} className="p-1 text-muted-foreground hover:text-primary" title="添加到日历">
                      <Calendar className="h-4 w-4" />
                    </button>
                    <button onClick={() => setDeleteId(r.id)} className="p-1 text-muted-foreground hover:text-danger">
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      )}

      {/* 已完成 */}
      {completed.length > 0 && (
        <div>
          <p className="mb-2 text-sm font-medium text-muted-foreground">✅ 已完成</p>
          <div className="space-y-2">
            {completed.map((r) => {
              const raw = r as any
              const petName = petMap[raw.pet_id ?? r.petId] ?? '未知宠物'
              return (
                <div key={r.id} className="flex items-center gap-3 rounded-2xl border border-border bg-muted/30 p-3 opacity-60">
                  <button onClick={() => toggleComplete(r.id, raw.is_completed ?? r.isCompleted)}>
                    <CheckCircle2 className="h-5 w-5 text-success" />
                  </button>
                  <div className="min-w-0 flex-1">
                    <span className="text-sm line-through">{raw.title ?? r.title}</span>
                    <p className="text-xs text-muted-foreground">{petName}</p>
                  </div>
                  <button onClick={() => setDeleteId(r.id)} className="p-1 text-muted-foreground hover:text-danger">
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>
                </div>
              )
            })}
          </div>
        </div>
      )}

      <ConfirmDialog open={!!deleteId} title="删除提醒" description="确定删除这条提醒吗？" confirmLabel="删除" variant="destructive"
        onConfirm={async () => { if (deleteId) { await deleteReminder(deleteId); setDeleteId(null) } }}
        onCancel={() => setDeleteId(null)} />
    </div>
  )
}
