import PluginManager from "@jbrowse/core/PluginManager";
export { configSchemaFactory } from "./configSchemaFactory";

export function stateModelFactory(
  pluginManager: PluginManager,
  configSchema: any,
) {
  const { types } = pluginManager.lib["mobx-state-tree"];
  const WigglePlugin = pluginManager.getPlugin(
    "WigglePlugin",
  ) as import("@jbrowse/plugin-wiggle").default;
  //@ts-ignore
  const { linearWiggleDisplayModelFactory } = WigglePlugin.exports;
  return types.compose(
    "LinearRiboSeqDisplay",
    linearWiggleDisplayModelFactory(pluginManager, configSchema),
    types
      .model({
        type: types.literal("LinearRiboSeqDisplay"),
      })
      .views(() => ({
        get rendererTypeName() {
          return "LinearRiboSeqRenderer";
        },
        get needsScalebar() {
          return true;
        },
        get regionTooLarge() {
          return false;
        },
      })),
  );
}

export type LinearRiboSeqDisplayModel = ReturnType<typeof stateModelFactory>;
