<script setup lang="ts">
import { onMounted, onUnmounted, ref, watch, computed } from 'vue'

const props = withDefaults(defineProps<{
  points: number[]
  width?: number | string
  height?: number | string
  color?: string
  fillColor?: string
  strokeWidth?: number
  smooth?: boolean
}>(), {
  width: '100%',
  height: '100%',
  color: '#3b82f6',
  fillColor: 'rgba(59, 130, 246, 0.1)',
  strokeWidth: 2,
  smooth: true
})

const canvasRef = ref<HTMLCanvasElement | null>(null)
const canvasWidth = ref(0)
const canvasHeight = ref(0)
let observer: ResizeObserver | null = null

const containerStyle = computed(() => ({
  width: typeof props.width === 'number' ? `${props.width}px` : props.width,
  height: typeof props.height === 'number' ? `${props.height}px` : props.height,
  position: 'relative'
}))

const drawSparkline = () => {
  const canvas = canvasRef.value
  if (!canvas) return

  const ctx = canvas.getContext('2d')
  if (!ctx) return

  const { points } = props
  if (!points.length) return

  const width = canvas.width = canvas.offsetWidth * 2
  const height = canvas.height = canvas.offsetHeight * 2
  const padding = 2

  // Set canvas display size
  canvas.style.width = '100%'
  canvas.style.height = '100%'

  // Clear canvas
  ctx.clearRect(0, 0, width, height)

  // Calculate points
  const max = Math.max(...points)
  const min = Math.min(...points)
  const range = max - min || 1

  const step = width / (points.length - 1 || 1)

  // Draw area
  ctx.beginPath()
  ctx.moveTo(0, height)

  points.forEach((point, i) => {
    const x = i * step
    const y = height - ((point - min) / range * (height - padding * 2) + padding)

    if (i === 0) {
      ctx.moveTo(x, y)
    } else if (props.smooth && i < points.length - 1) {
      const nextX = (i + 1) * step
      const nextY = height - ((points[i + 1] - min) / range * (height - padding * 2) + padding)
      const cp1x = x + (nextX - x) * 0.3
      const cp1y = y
      const cp2x = x + (nextX - x) * 0.7
      const cp2y = nextY
      ctx.bezierCurveTo(cp1x, cp1y, cp2x, cp2y, nextX, nextY)
    } else {
      ctx.lineTo(x, y)
    }
  })

  // Close the path for the fill
  ctx.lineTo(width, height)
  ctx.closePath()

  // Fill the area
  const gradient = ctx.createLinearGradient(0, 0, 0, height)
  gradient.addColorStop(0, props.fillColor)
  gradient.addColorStop(1, 'rgba(59, 130, 246, 0)')

  ctx.fillStyle = gradient
  ctx.fill()

  // Draw the line
  ctx.beginPath()
  points.forEach((point, i) => {
    const x = i * step
    const y = height - ((point - min) / range * (height - padding * 2) + padding)

    if (i === 0) {
      ctx.moveTo(x, y)
    } else if (props.smooth && i < points.length - 1) {
      const nextX = (i + 1) * step
      const nextY = height - ((points[i + 1] - min) / range * (height - padding * 2) + padding)
      const cp1x = x + (nextX - x) * 0.3
      const cp1y = y
      const cp2x = x + (nextX - x) * 0.7
      const cp2y = nextY
      ctx.bezierCurveTo(cp1x, cp1y, cp2x, cp2y, nextX, nextY)
    } else {
      ctx.lineTo(x, y)
    }
  })

  ctx.strokeStyle = props.color
  ctx.lineWidth = props.strokeWidth
  ctx.lineCap = 'round'
  ctx.lineJoin = 'round'
  ctx.stroke()
}

const handleResize = () => {
  if (canvasRef.value) {
    canvasWidth.value = canvasRef.value.offsetWidth
    canvasHeight.value = canvasRef.value.offsetHeight
    drawSparkline()
  }
}

onMounted(() => {
  // Initial draw
  requestAnimationFrame(() => {
    handleResize()
  })

  // Set up resize observer
  if (canvasRef.value) {
    observer = new ResizeObserver(handleResize)
    observer.observe(canvasRef.value.parentElement || document.body)
  }

  window.addEventListener('resize', handleResize)
})

onUnmounted(() => {
  if (observer) {
    observer.disconnect()
  }
  window.removeEventListener('resize', handleResize)
})

// Watch for changes to points
watch(() => [...props.points], () => {
  drawSparkline()
}, { deep: true })
</script>

<template>
  <div :style="containerStyle" class="sparkline-container">
    <canvas ref="canvasRef" class="sparkline-canvas"></canvas>
  </div>
</template>

<style scoped>
.sparkline-container {
  position: relative;
  overflow: hidden;
}

.sparkline-canvas {
  display: block;
  width: 100%;
  height: 100%;
}
</style>
