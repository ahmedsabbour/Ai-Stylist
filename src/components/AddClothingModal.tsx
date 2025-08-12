
import React, { useState, useRef, useCallback } from 'react';
import { ClothingCategory } from '../types';
import { Icon } from './Icon';

interface AddClothingModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddItem: (category: ClothingCategory, imageDataUrl: string) => void;
}

export const AddClothingModal: React.FC<AddClothingModalProps> = ({ isOpen, onClose, onAddItem }) => {
  const [category, setCategory] = useState<ClothingCategory>(ClothingCategory.Tops);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      if (file.size > 4 * 1024 * 1024) { // 4MB limit
        setError("Image size cannot exceed 4MB.");
        return;
      }
      setError(null);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };
  
  const handleSave = useCallback(() => {
    if (imagePreview) {
      onAddItem(category, imagePreview);
      setImagePreview(null);
      setError(null);
      if(fileInputRef.current) fileInputRef.current.value = "";
      onClose();
    } else {
        setError("Please select an image to save.");
    }
  }, [imagePreview, category, onAddItem, onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex justify-center items-center p-4" onClick={onClose}>
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-md" onClick={(e) => e.stopPropagation()}>
        <div className="p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-2xl font-bold text-gray-800">Add New Clothing</h2>
            <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
                <Icon path="M6.28 5.22a.75.75 0 00-1.06 1.06L10.94 12l-5.72 5.72a.75.75 0 101.06 1.06L12 13.06l5.72 5.72a.75.75 0 101.06-1.06L13.06 12l5.72-5.72a.75.75 0 00-1.06-1.06L12 10.94 6.28 5.22z" />
            </button>
          </div>

          <div className="space-y-6">
            <div 
              onClick={() => fileInputRef.current?.click()}
              className="mt-2 flex justify-center items-center rounded-lg border-2 border-dashed border-gray-300 px-6 py-10 cursor-pointer hover:border-teal-500 transition-colors"
            >
              {imagePreview ? (
                <img src={imagePreview} alt="Preview" className="max-h-48 rounded-lg object-contain" />
              ) : (
                <div className="text-center">
                  <Icon path="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 001.5-1.5V6a1.5 1.5 0 00-1.5-1.5H3.75A1.5 1.5 0 002.25 6v12a1.5 1.5 0 001.5 1.5zm10.5-11.25h.008v.008h-.008V8.25zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z" className="mx-auto h-12 w-12 text-gray-400" />
                  <p className="mt-4 text-sm leading-6 text-gray-600">Click to upload or take a photo</p>
                  <p className="text-xs leading-5 text-gray-500">PNG, JPG, WEBP up to 4MB</p>
                </div>
              )}
            </div>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              capture="environment"
              className="hidden"
              onChange={handleFileChange}
            />
            
            <div>
              <label htmlFor="category" className="block text-sm font-medium leading-6 text-gray-900">Category</label>
              <select
                id="category"
                value={category}
                onChange={(e) => setCategory(e.target.value as ClothingCategory)}
                className="mt-2 block w-full rounded-md border-0 py-2.5 pl-3 pr-10 text-gray-900 ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-teal-600 sm:text-sm sm:leading-6"
              >
                {Object.values(ClothingCategory).map((cat) => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>

            {error && <p className="text-sm text-red-600">{error}</p>}

            <div className="flex justify-end space-x-4">
               <button type="button" onClick={onClose} className="rounded-md bg-white px-4 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50">
                Cancel
              </button>
              <button
                type="button"
                onClick={handleSave}
                disabled={!imagePreview}
                className="rounded-md bg-teal-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-teal-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-teal-600 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Save Item
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};