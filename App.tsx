import React, { useState, useEffect, useCallback } from 'react';
import {
  CategoryIcon,
  SearchIcon,
  IconButton,
  Spinner,
  SearchBar,
  SearchResults,
  CategoryView,
  BackButtonIcon
} from './components';
import { View, Hadith, SearchResult, CategorizedHadiths, SearchMode } from './types';
import { parseHadithData, searchHadiths, categorizeHadiths } from './gemini';

const App: React.FC = () => {
  const [view, setView] = useState<View>(View.HOME);
  const [allHadiths, setAllHadiths] = useState<Hadith[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [searchResult, setSearchResult] = useState<SearchResult | null>(null);
  const [categorizedData, setCategorizedData] = useState<CategorizedHadiths | null>(null);

  useEffect(() => {
    // تحميل وتحليل بيانات الأحاديث عند تحميل المكون
    try {
      console.log("Component mounted, parsing data...");
      const parsedHadiths = parseHadithData();
      setAllHadiths(parsedHadiths);
    } catch (e) {
      console.error("Failed to parse hadith data:", e);
      setError("فشل تحميل بيانات الأحاديث.");
    } finally {
      setIsLoading(false);
    }
  }, []);

  const handleSearchClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    setView(View.SEARCH);
    setError(null);
    setSearchResult(null);
  };

  const handleClassifyClick = useCallback(async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    console.log("Classify button clicked.");
    // إذا كانت البيانات مصنفة بالفعل، اعرضها مباشرة
    if (categorizedData) {
        setView(View.CLASSIFY);
        return;
    }
    
    setIsLoading(true);
    setError(null);
    try {
      const results = await categorizeHadiths(allHadiths);
      // تحويل مصفوفة الفئات إلى كائن لتسهيل الوصول إليها
      const hadithsByCategory: CategorizedHadiths = results.reduce((acc, category) => {
        acc[category.category] = category.hadiths;
        return acc;
      }, {} as CategorizedHadiths);
      setCategorizedData(hadithsByCategory);
      setView(View.CLASSIFY);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "حدث خطأ غير متوقع.";
      console.error("Classification failed:", errorMessage);
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  }, [allHadiths, categorizedData]);

  const handleSearchSubmit = useCallback(async (query: string, mode: SearchMode) => {
    console.log(`Submitting search [${mode}] for: "${query}"`);
    setIsLoading(true);
    setError(null);
    try {
      const result = await searchHadiths(query, allHadiths, mode);
      setSearchResult(result);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "حدث خطأ غير متوقع.";
      console.error("Search failed:", errorMessage);
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  }, [allHadiths]);

  const handleBack = () => {
    setView(View.HOME);
    setError(null);
  };

  const renderContent = () => {
    switch (view) {
      case View.SEARCH:
        return (
          <>
            <SearchBar onSearch={handleSearchSubmit} isSearching={isLoading} />
            {error && <p className="text-center text-red-400 my-4">{error}</p>}
            {searchResult && <SearchResults results={searchResult} />}
          </>
        );
      case View.CLASSIFY:
        return (
          <>
            <h2 className="text-3xl font-bold text-center text-teal-400 mb-6 pb-2 border-b-2 border-slate-700">الأحاديث حسب الأبواب</h2>
            {error && <p className="text-center text-red-400 my-4">{error}</p>}
            <CategoryView categorizedData={categorizedData} />
          </>
        );
      case View.HOME:
      default:
        return (
          <div className="flex flex-col md:flex-row items-center justify-center gap-8" data-group="main-actions">
            <IconButton
              onClick={handleSearchClick}
              icon={<SearchIcon />}
              label="البحث عن الحديث"
            />
            <IconButton
              onClick={handleClassifyClick}
              icon={<CategoryIcon />}
              label="تصنيف الأحاديث"
            />
          </div>
        );
    }
  };

  return (
    <div className="min-h-screen bg-slate-900 text-white p-4 sm:p-8 flex flex-col">
      {isLoading && <Spinner />}
      
      <header className="text-center mb-8">
        <h1 className="text-4xl sm:text-5xl font-bold text-teal-400 drop-shadow-[0_2px_4px_rgba(0,255,255,0.2)]">
          رفيقك في البحث عن الأحاديث النبوية
        </h1>
        <p className="text-slate-400 mt-2 text-lg">أداة لاستكشاف أحاديث الجامع الصغير وحكمها</p>
      </header>

      <main className="flex-grow container mx-auto px-4">
        {view !== View.HOME && (
          <button
            onClick={handleBack}
            className="flex items-center gap-2 mb-6 text-teal-400 hover:text-teal-300 transition-colors"
            aria-label="العودة للصفحة الرئيسية"
          >
            <BackButtonIcon />
            <span>العودة</span>
          </button>
        )}
        {renderContent()}
      </main>

      <footer className="text-center text-slate-500 mt-12 py-4 border-t border-slate-800">
        <p>جميع الحقوق محفوظة لدى طالب رضا الرحمن إبراهيم دخان</p>
        <p className="mt-1 text-sm">البرنامج لا زال قيد التجربة والتطوير</p>
      </footer>
    </div>
  );
};

export default App;
