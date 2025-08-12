import React, { useState, useCallback, useMemo } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { Header } from './components/Header';
import { ClothingCard } from './components/ClothingCard';
import { AddClothingModal } from './components/AddClothingModal';
import { LoadingSpinner } from './components/LoadingSpinner';
import { Icon } from './components/Icon';
import { ClothingItem, ClothingCategory } from './types';
import { getOutfitSuggestion } from './services/geminiService';

const App: React.FC = () => {
  const [clothingItems, setClothingItems] = useState<ClothingItem[]>([]);
  const [selectedItems, setSelectedItems] = useState<ClothingItem[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [suggestion, setSuggestion] = useState<string>('');
  const [error, setError] = useState<string>('');
  
  const handleAddItem = useCallback((category: ClothingCategory, imageDataUrl: string) => {
    const newItem: ClothingItem = {
      id: `item-${Date.now()}`,
      category,
      imageDataUrl,
    };
    setClothingItems((prev) => [...prev, newItem]);
  }, []);

  const handleSelect = useCallback((item: ClothingItem) => {
    setSelectedItems((prev) =>
      prev.find((i) => i.id === item.id)
        ? prev.filter((i) => i.id !== item.id)
        : [...prev, item]
    );
  }, []);
  
  const handleGetSuggestion = useCallback(async () => {
    if (selectedItems.length === 0) {
      setError("Please select at least one item to get a style suggestion.");
      return;
    }
    setError('');
    setIsLoading(true);
    setSuggestion('');
    try {
      const result = await getOutfitSuggestion(selectedItems);
      setSuggestion(result);
    } catch (e: any) {
      setError(e.message || "An unexpected error occurred.");
    } finally {
      setIsLoading(false);
    }
  }, [selectedItems]);

  const wardrobe = useMemo(() => {
    return Object.values(ClothingCategory).map((category) => ({
      category,
      items: clothingItems.filter((item) => item.category === category),
    }));
  }, [clothingItems]);

  const renderWardrobeSection = (title: string, items: ClothingItem[]) => (
    <div key={title}>
      <h2 className="text-xl font-semibold text-gray-700 mb-4">{title}</h2>
      {items.length > 0 ? (
        <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-4">
          {items.map((item) => (
            <ClothingCard
              key={item.id}
              item={item}
              isSelected={!!selectedItems.find((i) => i.id === item.id)}
              onSelect={handleSelect}
            />
          ))}
        </div>
      ) : (
        <div className="text-center py-8 bg-gray-100 rounded-lg">
          <p className="text-gray-500">No {title.toLowerCase()} yet.</p>
          <p className="text-sm text-gray-400">Click the '+' button to add some!</p>
        </div>
      )}
    </div>
  );

  // Check for API key at the top level of the app.
  if (!process.env.API_KEY) {
    return (
      <div className="min-h-screen bg-red-50 flex items-center justify-center p-4">
        <div className="bg-white p-8 rounded-lg shadow-md text-center max-w-lg">
          <h1 className="text-2xl font-bold text-red-700 mb-4">Configuration Error</h1>
          <p className="text-gray-700">
            The Gemini API key is missing. Please add it to your environment variables to continue.
          </p>
          <p className="mt-4 text-sm text-gray-500">
            If you are deploying on Vercel, add an environment variable named <code className="bg-red-100 text-red-800 px-1 py-0.5 rounded">API_KEY</code> in your project settings.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <main className="max-w-4xl mx-auto p-4 sm:p-6 lg:p-8 space-y-8">
        <div id="stylist" className="bg-white p-6 rounded-xl shadow-sm">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Outfit Creator</h2>
          {error && <p className="text-red-500 mb-4">{error}</p>}
          
          <div className="mb-6 flex flex-wrap gap-4 items-center">
            {selectedItems.length > 0 ? selectedItems.map(item => (
                <img key={item.id} src={item.imageDataUrl} alt="Selected Item" className="w-20 h-20 rounded-lg object-cover shadow-md" />
            )) : <p className="text-gray-500">Select items from your wardrobe below to create an outfit.</p>}
          </div>

          <button
            onClick={handleGetSuggestion}
            disabled={isLoading || selectedItems.length === 0}
            className="w-full sm:w-auto flex items-center justify-center gap-2 rounded-md bg-teal-600 px-6 py-3 text-base font-semibold text-white shadow-sm hover:bg-teal-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-teal-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
          >
            {isLoading ? <LoadingSpinner /> : <Icon path="M9.813 15.904L9 15l.813.904L9.937 15l-.124.904zm4.374 0L15 15l-.813.904L14.063 15l.124.904zm-4.374-1.808L9 15l.813-.904L9.937 15l-.124-.904zm4.374 0L15 15l-.813-.904L14.063 15l.124-.904zM12 1.5c-5.247 0-9.5 4.253-9.5 9.5s4.253 9.5 9.5 9.5 9.5-4.253 9.5-9.5S17.247 1.5 12 1.5z" className="w-5 h-5"/>}
            {isLoading ? 'Thinking...' : 'Get Style Suggestion'}
          </button>
          
          {(isLoading || suggestion) && (
            <div className="mt-6 p-5 bg-teal-50/50 rounded-lg border border-teal-200">
                {isLoading ? (
                    <div className="flex flex-col items-center justify-center text-center text-teal-700">
                        <LoadingSpinner />
                        <p className="mt-2 font-medium">Mixing and matching...</p>
                        <p className="text-sm">Your personal stylist is at work!</p>
                    </div>
                ) : (
                    <div className="prose prose-teal max-w-none prose-headings:font-bold prose-h2:text-xl">
                        <ReactMarkdown remarkPlugins={[remarkGfm]}>{suggestion}</ReactMarkdown>
                    </div>
                )}
            </div>
          )}
        </div>

        <div id="wardrobe" className="bg-white p-6 rounded-xl shadow-sm space-y-6">
          <div className="flex justify-between items-center">
             <h2 className="text-2xl font-bold text-gray-800">My Wardrobe</h2>
          </div>
          {wardrobe.map(({ category, items }) => renderWardrobeSection(category, items))}
        </div>
      </main>
      
      <button
        onClick={() => setIsModalOpen(true)}
        className="fixed bottom-6 right-6 bg-teal-600 text-white p-4 rounded-full shadow-lg hover:bg-teal-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500 transition-transform hover:scale-110"
        aria-label="Add new clothing item"
      >
        <Icon path="M12 4.5v15m7.5-7.5h-15" className="w-7 h-7" />
      </button>

      <AddClothingModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onAddItem={handleAddItem}
      />
    </div>
  );
};

export default App;