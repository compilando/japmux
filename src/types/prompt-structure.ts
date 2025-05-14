export interface PromptTranslation {
  languageCode: string;
  promptText: string;
}

export interface AssetTranslation {
  languageCode: string;
  value: string;
}

export interface PromptAsset {
  key: string;
  value: string;
  changeMessage: string;
  translations: AssetTranslation[];
}

export interface PromptVersion {
  promptText: string;
  changeMessage: string;
  assets: string[]; // Array of asset keys
  translations: PromptTranslation[];
}

export interface PromptDetail {
  name: string;
  description: string;
}

export interface LoadPromptStructureDto {
  prompt: PromptDetail;
  version: PromptVersion;
  assets: PromptAsset[];
} 