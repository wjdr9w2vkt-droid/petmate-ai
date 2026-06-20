'use client'

import { useState, useEffect } from 'react'
import { Lightbulb } from 'lucide-react'

const TIPS = [
  '夏季炎热，请确保宠物随时有充足的饮水哦~',
  '定期驱虫是保护宠物健康的重要措施，建议每3个月一次',
  '狗狗每天至少需要30分钟的运动时间',
  '猫咪是肉食动物，请选择高蛋白低碳水的猫粮',
  '不要给宠物喂食巧克力、葡萄、洋葱等人类食物',
  '定期检查宠物的牙齿健康，牙结石会影响食欲',
  '疫苗不是一劳永逸的，记得按时接种加强针',
  '宠物肥胖会引发多种疾病，控制饮食很重要',
  '每天花10分钟给宠物梳毛，可以减少毛球问题',
  '出门遛狗请务必牵绳，保护它人也保护它',
  '幼宠需要更多餐次，成宠一天2-3餐即可',
  '给宠物准备专属的安静空间，让它们有安全感',
]

/**
 * 养宠小贴士 — 随机展示。
 */
export function PetCareTip() {
  const [tip, setTip] = useState('')

  useEffect(() => {
    setTip(TIPS[Math.floor(Math.random() * TIPS.length)])
  }, [])

  if (!tip) return null

  return (
    <div className="flex items-start gap-2 rounded-lg bg-amber-50 p-3 dark:bg-amber-950">
      <Lightbulb className="mt-0.5 h-4 w-4 shrink-0 text-amber-500" />
      <p className="text-sm text-amber-800 dark:text-amber-200">{tip}</p>
    </div>
  )
}
