<script setup lang="ts">
import { onMounted, onUnmounted, ref } from 'vue'

interface AsciiCell {
  character: string
  x: number
  y: number
  centerX: number
  centerY: number
  opacity: number
  // Stable per-cell randomness keeps the reveal edge scattered without flickering.
  scatter: number
  phase: number
  color: string
}

const props = withDefaults(
  defineProps<{
    src: string
    fontSize?: number
    radius?: number
    scatterWidth?: number
    tintAmount?: number
    asciiCharacters?: string
  }>(),
  {
    fontSize: 64,
    // Characters are fully visible inside `radius`, then become increasingly sparse over `scatterWidth`.
    radius: 24,
    scatterWidth: 500,
    tintAmount: 0.475,
    asciiCharacters: '@%#*+=-:. ',
  },
)

const asciiCells: AsciiCell[] = []

// The reveal follows the cursor slowly; individual characters fade in faster than they fade out.
const revealEase = 0.025
const fadeOutEase = 0.04
const idleAmount = 0.12
const idleSpeed = 0.001

const imageCanvasEl = ref<HTMLCanvasElement | null>(null)
const asciiCanvasEl = ref<HTMLCanvasElement | null>(null)

async function setupAsciiCanvas(
  asciiCanvas: HTMLCanvasElement,
  asciiContext: CanvasRenderingContext2D,
  imageCanvas: HTMLCanvasElement,
) {
  await document.fonts.load('400 ' + props.fontSize + 'px "JetBrains Mono"')

  asciiCanvas.width = imageCanvas.width
  asciiCanvas.height = imageCanvas.height

  asciiContext.font = '400 ' + props.fontSize + 'px "JetBrains Mono", monospace'
  asciiContext.textBaseline = 'top'
}

function createReducedContext(
  img: HTMLImageElement,
  columns: number,
  rows: number,
): OffscreenCanvasRenderingContext2D | undefined {
  const reducedCanvas = new OffscreenCanvas(columns, rows)
  const reducedContext = reducedCanvas.getContext('2d')
  if (!reducedContext) return

  // Downscaling turns each reduced pixel into one brightness sample for one ASCII cell.
  reducedContext.imageSmoothingEnabled = true
  reducedContext.drawImage(img, 0, 0, columns, rows)

  return reducedContext
}

function getCellSize(asciiContext: CanvasRenderingContext2D) {
  const metrics = asciiContext.measureText('M')

  const cellWidth = metrics.width * 1.1
  const cellHeight = props.fontSize

  return { cellWidth, cellHeight }
}

function getColumnsAndRowsCount(
  asciiCanvas: HTMLCanvasElement,
  cellWidth: number,
  cellHeight: number,
) {
  const columns = Math.ceil(asciiCanvas.width / cellWidth)
  const rows = Math.ceil(asciiCanvas.height / cellHeight)

  return { columns, rows }
}

function pixelBrightnessPercentage(pixel: { red: number; green: number; blue: number }): number {
  const pixelBrightness = 0.2126 * pixel.red + 0.7152 * pixel.green + 0.0722 * pixel.blue
  return pixelBrightness / 255
}

function placeCharactersOnAsciiCanvas(
  pixels: ImageDataArray,
  rows: number,
  columns: number,
  cellWidth: number,
  cellHeight: number,
) {
  for (let row = 0; row < rows; row++) {
    for (let column = 0; column < columns; column++) {
      // ImageData is flat RGBA data, so each cell starts at its pixel index times four.
      const pixelIndex = (row * columns + column) * 4

      const red = pixels[pixelIndex]
      const green = pixels[pixelIndex + 1]
      const blue = pixels[pixelIndex + 2]
      const alpha = pixels[pixelIndex + 3]

      if (alpha === 0) continue

      const brightness = pixelBrightnessPercentage({ red, green, blue })

      const characterIndex = Math.floor(brightness * (props.asciiCharacters.length - 1))

      const character = props.asciiCharacters[characterIndex]

      const x = column * cellWidth
      const y = row * cellHeight

      const redTinted = 255 + (red - 255) * props.tintAmount
      const greenTinted = 255 + (green - 255) * props.tintAmount
      const blueTinted = 255 + (blue - 255) * props.tintAmount

      asciiCells.push({
        character,
        x,
        y,
        centerX: x + cellWidth / 2,
        centerY: y + cellHeight / 2,
        opacity: 0,
        scatter: Math.random(),
        phase: Math.random() * Math.PI * 2,
        color: `rgb(${redTinted}, ${greenTinted}, ${blueTinted})`,
      })
    }
  }
}

function drawRevealedCharacters(time: number) {
  const asciiCanvas = asciiCanvasEl.value
  const asciiContext = asciiCanvas?.getContext('2d')
  if (!asciiCanvas || !asciiContext) return

  asciiContext.clearRect(0, 0, asciiCanvas.width, asciiCanvas.height)

  for (const cell of asciiCells) {
    let isInside = false

    if (pointerActive) {
      const distanceX = cell.centerX - revealX
      const distanceY = cell.centerY - revealY

      const distance = Math.hypot(distanceX, distanceY)

      const outerRadius = props.radius + props.scatterWidth

      let visibilityProbability: number

      let scatter = cell.scatter
      if (distance <= props.radius) {
        visibilityProbability = 1
      } else if (distance >= outerRadius) {
        visibilityProbability = 0
      } else {
        scatter = cell.scatter + Math.sin(time * idleSpeed + cell.phase) * idleAmount
        // The outer band is probabilistic, which makes whole characters disappear unevenly.
        visibilityProbability = (outerRadius - distance) / (outerRadius - props.radius)
      }

      isInside = scatter < visibilityProbability

      cell.opacity = isInside ? 1 : 0
    } else {
      cell.opacity += (0 - cell.opacity) * fadeOutEase
    }

    if (cell.opacity > 0.01) {
      asciiContext.shadowColor = cell.color
      asciiContext.shadowBlur = 3

      asciiContext.globalAlpha = cell.opacity
      asciiContext.fillStyle = cell.color
      asciiContext.fillText(cell.character, cell.x, cell.y)
    } else {
      cell.opacity = 0
    }
  }

  asciiContext.globalAlpha = 1
}

let raf: number | null = null

let revealX = 0
let revealY = 0

let targetX = 0
let targetY = 0

let pointerActive = false

function onPointerMove(event: PointerEvent) {
  const asciiCanvas = asciiCanvasEl.value
  if (!asciiCanvas) return

  const rect = asciiCanvas.getBoundingClientRect()

  // Convert pointer coordinates from displayed CSS pixels to the canvas coordinate system.
  targetX = (event.clientX - rect.left) * (asciiCanvas.width / rect.width)
  targetY = (event.clientY - rect.top) * (asciiCanvas.height / rect.height)

  if (!pointerActive) {
    revealX = targetX
    revealY = targetY
    pointerActive = true
  }
}

function onPointerLeave() {
  pointerActive = false
}

function tick(time: number) {
  // Move the reveal center toward the pointer instead of snapping directly to it.
  revealX += (targetX - revealX) * revealEase
  revealY += (targetY - revealY) * revealEase

  drawRevealedCharacters(time)

  raf = requestAnimationFrame(tick)
}

onMounted(() => {
  const imageCanvas = imageCanvasEl.value
  const imageContext = imageCanvas?.getContext('2d')
  if (!imageCanvas || !imageContext) return

  const asciiCanvas = asciiCanvasEl.value
  const asciiContext = asciiCanvas?.getContext('2d')
  if (!asciiCanvas || !asciiContext) return

  const img = new Image()

  img.addEventListener('load', async () => {
    imageCanvas.width = img.naturalWidth
    imageCanvas.height = img.naturalHeight
    imageContext.drawImage(img, 0, 0)

    await setupAsciiCanvas(asciiCanvas, asciiContext, imageCanvas)

    const { cellWidth, cellHeight } = getCellSize(asciiContext)

    const { columns, rows } = getColumnsAndRowsCount(asciiCanvas, cellWidth, cellHeight)

    const reducedContext = createReducedContext(img, columns, rows)
    if (!reducedContext) return

    const pixels = reducedContext.getImageData(0, 0, columns, rows).data

    asciiCells.length = 0

    placeCharactersOnAsciiCanvas(pixels, rows, columns, cellWidth, cellHeight)
  })

  // Assigning the image source loads the image
  img.src = props.src

  raf = requestAnimationFrame(tick)
})

onUnmounted(() => {
  if (raf !== null) cancelAnimationFrame(raf)
})
</script>

<template>
  <div class="canvas-container" @pointermove="onPointerMove" @pointerleave="onPointerLeave">
    <canvas ref="imageCanvasEl" class="image-canvas"></canvas>
    <canvas ref="asciiCanvasEl" class="ascii-canvas"></canvas>
  </div>
</template>

<style lang="css">
.canvas-container {
  position: relative;
  display: inline-block;
}

.image-canvas {
  display: block;
}

.ascii-canvas {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
}
</style>
