import { ConfigurationSchema } from "@jbrowse/core/configuration";
export { default } from "./LinearRiboSeqRenderer";

export const configSchema = ConfigurationSchema(
  "LinearRiboSeqRenderer",
  {
    color: {
      type: "color",
      description: "the color of the marks",
      defaultValue: "darkblue",
      contextVariable: ["feature"],
    },
  },
  { explicitlyTyped: true },
);
