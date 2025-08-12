
import React from 'react';
import { ClothingItem } from '../types';
import { Icon } from './Icon';

interface ClothingCardProps {
  item: ClothingItem;
  isSelected: boolean;
  onSelect: (item: ClothingItem) => void;
}

export const ClothingCard: React.FC<ClothingCardProps> = ({ item, isSelected, onSelect }) => {
  return (
    <div
      onClick={() => onSelect(item)}
      className="relative aspect-square cursor-pointer group"
    >
      <img
        src={item.imageDataUrl}
        alt={item.category}
        className="w-full h-full object-cover rounded-lg shadow-md group-hover:shadow-xl transition-all duration-300"
      />
      <div
        className={`absolute inset-0 rounded-lg transition-all duration-300 ${
          isSelected
            ? 'ring-4 ring-offset-2 ring-teal-500 bg-black/30'
            : 'group-hover:bg-black/20'
        }`}
      ></div>
      {isSelected && (
        <div className="absolute top-2 right-2 bg-teal-500 text-white rounded-full p-1.5 shadow-lg">
          <Icon path="M4.5 12.75l6 6 9-13.5" className="w-4 h-4" />
        </div>
      )}
    </div>
  );
};
