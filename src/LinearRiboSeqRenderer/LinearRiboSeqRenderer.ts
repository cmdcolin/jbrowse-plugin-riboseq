import PluginManager from '@jbrowse/core/PluginManager'
import { readConfObject } from '@jbrowse/core/configuration'
import { featureSpanPx } from '@jbrowse/core/util'
import { getOrigin } from '@jbrowse/plugin-wiggle'

export default function rendererFactory(pluginManager: PluginManager) {
  const WigglePlugin = pluginManager.getPlugin(
    'WigglePlugin',
  ) as import('@jbrowse/plugin-wiggle').default
  const {
    utils: { getScale },
    WiggleBaseRenderer,
  } = WigglePlugin.exports

  return class RiboSeqPlotRenderer extends WiggleBaseRenderer {
    // @ts-expect-error
    draw(ctx: CanvasRenderingContext2D, props: any) {
      const {
        features,
        regions,
        bpPerPx,
        scaleOpts,
        height: unadjustedHeight,
        displayCrossHatches,
        ticks: { values },
      } = props
      const [region] = regions
      const YSCALEBAR_LABEL_OFFSET = 5
      const height = unadjustedHeight - YSCALEBAR_LABEL_OFFSET * 2
      const opts = { ...scaleOpts, range: [0, height] }
      const width = (region.end - region.start) / bpPerPx

      const scale = getScale(opts)
      const toY = (n: number) => height - scale(n) + YSCALEBAR_LABEL_OFFSET
      const toHeight = (n: number) => toY(originY) - toY(n)
      const originY = 0

      const colors = { 0: 'yellow', 1: 'green', 2: 'red', 3: 'blue' } as Record<
        string,
        string
      >
      for (const feature of features.values()) {
        const [leftPx, rightPx] = featureSpanPx(feature, region, bpPerPx)
        const score = feature.get('score') as number
        ctx.fillStyle = colors[feature.get('color')] as string
        const w = Math.max(rightPx - leftPx, 10)
        ctx.fillRect(leftPx, toY(score), w, toHeight(score))
      }

      if (displayCrossHatches) {
        ctx.lineWidth = 1
        ctx.strokeStyle = 'rgba(200,200,200,0.8)'
        values.forEach((tick: number) => {
          ctx.beginPath()
          ctx.moveTo(0, Math.round(toY(tick)))
          ctx.lineTo(width, Math.round(toY(tick)))
          ctx.stroke()
        })
      }
    }
  }
}
