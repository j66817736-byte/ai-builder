import { featureTemplates, type FeatureName } from "../templates/featureTemplates.js";

export function isFeatureName(value: string): value is FeatureName {
  return Object.prototype.hasOwnProperty.call(featureTemplates, value.toLowerCase());
}

export function getFeatureDescription(feature: FeatureName): string {
  return featureTemplates[feature].description;
}

export async function generateFeature(feature: FeatureName): Promise<string> {
  if (!isFeatureName(feature)) {
    throw new Error(`Funcionalidad no disponible: ${String(feature)}. Opciones: ${Object.keys(featureTemplates).join(", ")}`);
  }
  return featureTemplates[feature].template;
}
