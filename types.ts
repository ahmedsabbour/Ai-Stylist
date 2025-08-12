
export enum ClothingCategory {
  Tops = 'Tops',
  Bottoms = 'Bottoms',
  Shoes = 'Shoes',
}

export interface ClothingItem {
  id: string;
  category: ClothingCategory;
  imageDataUrl: string;
}
