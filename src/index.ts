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
import { AdapterType } from '@jbrowse/core/pluggableElementTypes'
import { BaseFeatureDataAdapter } from '@jbrowse/core/data_adapters/BaseAdapter'
import { AugmentedRegion, Feature, Region } from '@jbrowse/core/util'
import { BaseOptions } from '@jbrowse/core/data_adapters/BaseAdapter/BaseOptions'
import { ObservableCreate } from '@jbrowse/core/util/rxjs'
import { firstValueFrom, toArray } from 'rxjs'
import { ConfigurationSchema } from '@jbrowse/core/configuration'

class AdapterClass extends BaseFeatureDataAdapter {
  freeResources(region: AugmentedRegion): void {}
  async getRefNames(opts?: BaseOptions | undefined) {
    const { subadapter } = await this.configurePre()
    return subadapter.getRefNames()
  }
  async configurePre() {
    const conf = this.getConf('subadapter')
    if (!conf) {
      throw new Error('no subadapter supplied')
    }
    if (!this.getSubAdapter) {
      throw new Error('no getSubAdapter routine')
    }
    const subadapter = await this.getSubAdapter(conf)
    return { subadapter: subadapter.dataAdapter as BaseFeatureDataAdapter }
  }
  getFeatures(query: Region, opts: any) {
    return ObservableCreate<Feature>(async observer => {
      const { subadapter } = await this.configurePre()

      const feats = await firstValueFrom(
        subadapter.getFeatures(query, opts).pipe(toArray()),
      )
      for (const feat of feats) {
        observer.next(feat)
      }
      observer.complete()
    })
  }
}
const configSchema = ConfigurationSchema(
  'RiboSeqAdapter',
  {
    subadapter: {
      type: 'frozen',
      defaultValue: null,
    },
  },
  { explicitlyTyped: true },
)

export default class AlignmentsPlugin extends Plugin {
  name = 'RiboSeqPlugin'

  install(pluginManager: PluginManager) {
    const WigglePlugin = pluginManager.getPlugin(
      'WigglePlugin',
    ) as import('@jbrowse/plugin-wiggle').default

    const { LinearWiggleDisplayReactComponent, XYPlotRendererReactComponent } =
      WigglePlugin.exports

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

    pluginManager.addAdapterType(() => {
      return new AdapterType({
        name: 'RiboSeqAdapter',
        AdapterClass,
        configSchema,
      })
    })

    pluginManager.addRendererType(() => {
      //@ts-expect-error
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
