import { AssetItem, AssetCategory, AssetType } from '../types/assests.types';
import { DUMMY_ASSETS, DUMMY_ASSET_CATEGORIES, DUMMY_ASSET_TYPES } from '../data/dummy';

export const fetchAssets = async (): Promise<AssetItem[]> => {
    return new Promise((resolve) => {
        setTimeout(() => resolve(DUMMY_ASSETS), 800);
    });
};

export const fetchAssetCategories = async (): Promise<AssetCategory[]> => {
    return new Promise((resolve) => {
        setTimeout(() => resolve(DUMMY_ASSET_CATEGORIES), 300);
    });
};

export const fetchAssetTypes = async (): Promise<AssetType[]> => {
    return new Promise((resolve) => {
        setTimeout(() => resolve(DUMMY_ASSET_TYPES), 300);
    });
};

export const saveAsset = async (asset: Partial<AssetItem>): Promise<AssetItem> => {
    return new Promise((resolve) => {
        setTimeout(() => {
            // Mock saving
            const newAsset = { ...asset, id: Date.now().toString() } as AssetItem;
            resolve(newAsset);
        }, 1000);
    });
};
