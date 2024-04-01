import Plugin from '@jbrowse/core/Plugin'
import PluginManager from '@jbrowse/core/PluginManager'
import DisplayType from '@jbrowse/core/pluggableElementTypes/DisplayType'
import rendererFactory, {
  configSchema as rendererConfigSchema,
} from './LinearRiboSeqRenderer'
import {
  configSchemaFactory as displayConfigSchemaFactory,
  stateModelFactory as displayModelFactory,
} from './LinearRiboSeqDisplay'

export default class AlignmentsPlugin extends Plugin {
  name = 'GWASPlugin'

  install(pluginManager: PluginManager) {
    const WigglePlugin = pluginManager.getPlugin(
      'WigglePlugin',
    ) as import('@jbrowse/plugin-wiggle').default

    const {
      LinearWiggleDisplayReactComponent,
      XYPlotRendererReactComponent,
      //@ts-ignore
    } = WigglePlugin.exports

    pluginManager.addDisplayType(() => {
      const configSchema = displayConfigSchemaFactory(pluginManager)
      return new DisplayType({
        name: 'LinearRiboSeqDisplay',
        configSchema,
        stateModel: displayModelFactory(pluginManager, configSchema),
        trackType: 'FeatureTrack',
        viewType: 'LinearGenomeView',
        ReactComponent: LinearWiggleDisplayReactComponent,
      })
    })

    pluginManager.addRendererType(() => {
      //@ts-ignore
      const RiboSeqRenderer = new rendererFactory(pluginManager)
      const configSchema = rendererConfigSchema
      return new RiboSeqRenderer({
        name: 'LinearRiboSeqRenderer',
        ReactComponent: XYPlotRendererReactComponent,
        configSchema,
        pluginManager,
      })
    })
  }
}
