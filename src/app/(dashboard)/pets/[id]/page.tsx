'use client'

import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { PetInfoTable } from '@/components/pets/pet-info-table'
import { ConfirmDialog } from '@/components/shared/confirm-dialog'
import { usePets } from '@/hooks/use-pets'
import { createClient } from '@/lib/supabase/client'
import { Loader2, Pencil, Trash2 } from 'lucide-react'
import { calcPetAge } from '@/lib/utils/pet-age'
import { WeightDisplay } from '@/components/records/weight-display'
import { WeightChart } from '@/components/records/weight-chart'
import { RecordCard } from '@/components/records/record-card'
import { VaccineList } from '@/components/vaccines/vaccine-list'
import { VaccineForm } from '@/components/vaccines/vaccine-form'
import { useVaccines } from '@/hooks/use-vaccines'
import { useRecords } from '@/hooks/use-records'
import type { Pet, GrowthRecord } from '@/types'

/**
 * 宠物详情页 /pets/[id]
 */
export default function PetDetailPage() {
  const params = useParams()
  const router = useRouter()
  const id = params.id as string
  const { fetchPet, deletePet } = usePets()

  const [pet, setPet] = useState<Pet | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [showDelete, setShowDelete] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)
  const [records, setRecords] = useState<GrowthRecord[]>([])
  const [showVaccineForm, setShowVaccineForm] = useState(false)
  const { vaccines, fetchVaccines, createVaccine, deleteVaccine, isSubmitting: vaxSubmitting } =
    useVaccines()
  const { deleteRecord } = useRecords()

  useEffect(() => {
    const supabase = createClient()
    fetchPet(id).then((data) => {
      setPet(data)
      setIsLoading(false)
    })
    // 加载最近记录
    supabase
      .from('growth_records')
      .select('*')
      .eq('pet_id', id)
      .order('recorded_at', { ascending: false })
      .limit(3)
      .then(({ data: recs }) => {
        if (recs) setRecords(recs as GrowthRecord[])
      })
    // 加载疫苗
    fetchVaccines(id)
  }, [id, fetchPet, fetchVaccines])

  const handleDelete = async () => {
    setIsDeleting(true)
    const ok = await deletePet(id)
    if (ok) {
      router.push('/pets')
    }
    setIsDeleting(false)
    setShowDelete(false)
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    )
  }

  if (!pet) {
    return (
      <div className="container mx-auto max-w-lg p-4 text-center">
        <p className="text-muted-foreground">宠物不存在或已被删除</p>
        <Link
          href="/pets"
          className="mt-4 inline-flex h-9 items-center justify-center rounded-lg bg-primary px-4 text-sm font-medium text-primary-foreground hover:bg-primary/80"
        >
          返回列表
        </Link>
      </div>
    )
  }

  const initials = pet.name.slice(0, 2).toUpperCase()
  const age = pet.birthday ? calcPetAge(pet.birthday) : null

  return (
    <div className="container mx-auto max-w-lg p-4 space-y-4">
      {/* 顶栏 */}
      <div className="flex items-center justify-between">
        <Button variant="ghost" size="sm" onClick={() => router.back()}>
          ← 返回
        </Button>
        <div className="flex gap-2">
          <Link
            href={`/pets/${id}/edit`}
            className="inline-flex h-8 items-center justify-center gap-1 rounded-lg border border-border bg-background px-2.5 text-sm font-medium hover:bg-muted"
          >
            <Pencil className="h-4 w-4" />
            编辑
          </Link>
          <Button
            variant="outline"
            size="sm"
            className="text-destructive hover:text-destructive"
            onClick={() => setShowDelete(true)}
          >
            <Trash2 className="mr-1 h-4 w-4" />
            删除
          </Button>
        </div>
      </div>

      {/* 头像 + 名称 */}
      <div className="flex flex-col items-center gap-2">
        <Avatar className="h-24 w-24">
          <AvatarImage src={(pet as any).avatar_url ?? pet.avatarUrl ?? undefined} />
          <AvatarFallback className="text-3xl">{initials}</AvatarFallback>
        </Avatar>
        <h1 className="text-2xl font-semibold">{pet.name}</h1>
        <p className="text-muted-foreground">
          {pet.breed || (pet.species === 'dog' ? '狗狗' : pet.species === 'cat' ? '猫咪' : '宠物')}
          {age && ` · ${age}`}
        </p>
      </div>

      {/* 标签页 */}
      <Tabs defaultValue="info">
        <TabsList className="w-full">
          <TabsTrigger value="info" className="flex-1">基本信息</TabsTrigger>
          <TabsTrigger value="health" className="flex-1">健康数据</TabsTrigger>
          <TabsTrigger value="vaccine" className="flex-1">疫苗</TabsTrigger>
          <TabsTrigger value="timeline" className="flex-1">时间轴</TabsTrigger>
          <TabsTrigger value="photos" className="flex-1">相册</TabsTrigger>
        </TabsList>
        <TabsContent value="info" className="mt-4">
          <PetInfoTable pet={pet} />
        </TabsContent>
        <TabsContent value="health" className="mt-4 space-y-4">
          <WeightDisplay
            latestWeight={records[0]?.weight ?? null}
            previousWeight={records[1]?.weight ?? null}
          />
          <WeightChart petId={id} />
          {records.length > 0 && (
            <div>
              <div className="mb-2 flex items-center justify-between">
                <h3 className="text-sm font-medium">最近记录</h3>
                <Link
                  href="/records"
                  className="text-xs text-muted-foreground hover:text-foreground"
                >
                  查看全部 →
                </Link>
              </div>
              <div className="space-y-2">
                {records.map((r) => (
                  <RecordCard key={r.id} record={r} onDelete={deleteRecord} />
                ))}
              </div>
            </div>
          )}
          {records.length === 0 && (
            <p className="py-8 text-center text-muted-foreground">暂无健康数据</p>
          )}
        </TabsContent>
        <TabsContent value="timeline" className="mt-4">
          <Link href={`/pets/${id}/timeline`}
            className="flex items-center justify-center gap-2 rounded-2xl border border-dashed p-8 text-muted-foreground hover:bg-muted/30 transition-colors">
            <span className="text-2xl">📖</span>
            <span className="text-sm font-medium">查看完整成长时间轴 →</span>
          </Link>
        </TabsContent>
        <TabsContent value="photos" className="mt-4">
          <Link href={`/pets/${id}/photos`}
            className="flex items-center justify-center gap-2 rounded-2xl border border-dashed p-8 text-muted-foreground hover:bg-muted/30 transition-colors">
            <span className="text-2xl">📸</span>
            <span className="text-sm font-medium">查看纪念相册 →</span>
          </Link>
        </TabsContent>
        <TabsContent value="vaccine" className="mt-4 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-medium">疫苗记录</h3>
            <button
              onClick={() => setShowVaccineForm(!showVaccineForm)}
              className="text-sm text-primary hover:underline"
            >
              {showVaccineForm ? '收起' : '+ 添加'}
            </button>
          </div>

          {showVaccineForm && (
            <VaccineForm
              petId={id}
              onSubmit={async (input) => {
                const result = await createVaccine(input)
                if (result) setShowVaccineForm(false)
                return result
              }}
              isSubmitting={vaxSubmitting}
              onCancel={() => setShowVaccineForm(false)}
            />
          )}

          <VaccineList vaccines={vaccines} onDelete={deleteVaccine} />
        </TabsContent>
      </Tabs>

      {/* 删除确认 */}
      <ConfirmDialog
        open={showDelete}
        title="删除宠物"
        description={`确定要删除「${pet.name}」吗？所有相关记录（成长记录、疫苗）将一并删除。此操作不可撤销。`}
        confirmLabel="确认删除"
        variant="destructive"
        isLoading={isDeleting}
        onConfirm={handleDelete}
        onCancel={() => setShowDelete(false)}
      />
    </div>
  )
}
