<script setup lang="ts">
const props = withDefaults(defineProps<{
  points: number[]
  width?: number
  height?: number
  strokeWidth?: number
  smooth?: boolean
}>(), {
  width: 400,
  height: 56,
  strokeWidth: 2,
  smooth: true
})

const pathD = computed(() => {
  const pts = props.points
  const n = pts.length
  if (!n) return ''
  const w = props.width
  const h = props.height
  const max = Math.max(...pts, 1)
  const min = Math.min(...pts, 0)
  const range = Math.max(max - min, 1)
  const stepX = n > 1 ? w / (n - 1) : w

  const toY = (v: number) => {
    const y = h - ((v - min) / range) * (h - 6) - 3 // padding 3px
    return isFinite(y) ? y : h / 2
  }

  let d = `M 0 ${toY(pts[0])}`
  if (!props.smooth) {
    for (let i = 1; i < n; i++) d += ` L ${i * stepX} ${toY(pts[i])}`
    return d
  }
  // smooth with simple quadratic beziers
  for (let i = 1; i < n; i++) {
    const x = i * stepX
    const y = toY(pts[i])
    const prevX = (i - 1) * stepX
    const prevY = toY(pts[i - 1])
    const cx = (prevX + x) / 2
    d += ` Q ${cx} ${prevY} ${x} ${y}`
  }
  return d
})
</script>

<template>
  <svg :width="width" :height="height" viewBox="0 0 400 56" preserveAspectRatio="none" class="w-full">
    <defs>
      <linearGradient id="spark" x1="0" y1="0" x2="1" y2="0">
        <stop offset="0%" stop-color="rgb(20 169 255)" />
        <stop offset="100%" stop-color="rgb(110 231 255)" />
      </linearGradient>
    </defs>
    <path :d="pathD" fill="none" stroke="url(#spark)" :stroke-width="strokeWidth" stroke-linecap="round" />
  </svg>
</template>
