import React, { useState, useEffect, useCallback } from 'react';
import { 
  CategoryIcon,
  SearchIcon,
  IconButton,
  Spinner,
  SearchBar,
  SearchResults,
  GeminiResultCard,
  CategoryView,
  BackButtonIcon,
  LoginView,
  QAView,
  QuestionIcon,
  LogOutIcon
} from './components';
import { View, Hadith, SearchResult, CategorizedHadiths, SearchMode, User, Question, GeminiResult } from './types';
import { parseHadithData, searchHadiths, categorizeHadiths, searchViaGemini } from './gemini';

const App: React.FC = () => {
  const [view, setView] = useState<View>(View.LOGIN);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [allHadiths, setAllHadiths] = useState<Hadith[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [searchResult, setSearchResult] = useState<SearchResult | null>(null);
  const [geminiResult, setGeminiResult] = useState<string | null>(null);
  const [categorizedData, setCategorizedData] = useState<CategorizedHadiths | null>(null);

  // Load data from localStorage
  useEffect(() => {
    const savedUser = localStorage.getItem('hadith_user');
    const savedQuestions = localStorage.getItem('hadith_questions');
    
    if (savedUser) {
      setCurrentUser(JSON.parse(savedUser));
      setView(View.DASHBOARD);
    }
    
    if (savedQuestions) {
      setQuestions(JSON.parse(savedQuestions));
    }
  }, []);

  // Save questions to localStorage
  useEffect(() => {
    localStorage.setItem('hadith_questions', JSON.stringify(questions));
  }, [questions]);

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

  const handleLogin = (username: string, isAdmin: boolean) => {
    const user = { username, isAdmin };
    setCurrentUser(user);
    localStorage.setItem('hadith_user', JSON.stringify(user));
    setView(View.DASHBOARD);
  };

  const handleLogout = () => {
    setCurrentUser(null);
    localStorage.removeItem('hadith_user');
    setView(View.LOGIN);
  };

  const handleAddQuestion = (text: string) => {
    if (!currentUser) return;
    const newQ: Question = {
      id: Date.now().toString(),
      text,
      author: currentUser.username,
      timestamp: Date.now(),
    };
    setQuestions(prev => [newQ, ...prev]);
  };

  const handleAnswerQuestion = (id: string, answer: string) => {
    if (!currentUser?.isAdmin) return;
    setQuestions(prev => prev.map(q => 
      q.id === id ? { 
        ...q, 
        answer, 
        answeredBy: currentUser.username, 
        answerTimestamp: Date.now() 
      } : q
    ));
  };

  const handleSearchClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    setView(View.SEARCH);
    setError(null);
    setSearchResult(null);
    setGeminiResult(null);
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
    setSearchResult(null);
    setGeminiResult(null);
    
    try {
      if (mode === SearchMode.GEMINI) {
        const result = await searchViaGemini(query);
        setGeminiResult(result);
      } else {
        const result = await searchHadiths(query, allHadiths, mode);
        setSearchResult(result);
      }
      // Scroll to top of results
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "حدث خطأ غير متوقع.";
      console.error("Search failed:", errorMessage);
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  }, [allHadiths]);

  const handleFindSimilar = useCallback(async (text: string) => {
    console.log(`Finding similar hadiths for: "${text.substring(0, 50)}..."`);
    // نستخدم دائماً وضع SIMILAR هنا للبحث عن تشابه المعنى
    try {
      const result = await searchHadiths(text, allHadiths, SearchMode.SIMILAR);
      setSearchResult(result);
    } catch (err) {
      console.error("Similarity search failed:", err);
    }
  }, [allHadiths]);

  const handleBack = () => {
    setView(View.DASHBOARD);
    setError(null);
  };

  const renderContent = () => {
    if (!currentUser && view !== View.LOGIN) {
        return <LoginView onLogin={handleLogin} />;
    }

    switch (view) {
      case View.LOGIN:
        return <LoginView onLogin={handleLogin} />;
      case View.DASHBOARD:
        return (
          <div className="flex flex-col md:flex-row flex-wrap items-center justify-center gap-8 py-12">
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
            <IconButton
              onClick={() => setView(View.QA)}
              icon={<QuestionIcon />}
              label="الأسئلة والأجوبة"
            />
          </div>
        );
      case View.HOME:
      case View.SEARCH:
        return (
          <>
            <SearchBar onSearch={handleSearchSubmit} isSearching={isLoading} />
            {error && <p className="text-center text-red-400 my-4">{error}</p>}
            {geminiResult && <GeminiResultCard result={geminiResult} />}
            {searchResult && <SearchResults results={searchResult} onFindSimilar={handleFindSimilar} />}
          </>
        );
      case View.CLASSIFY:
        return (
          <>
            {error && <p className="text-center text-red-400 my-4">{error}</p>}
            <CategoryView categorizedData={categorizedData} />
          </>
        );
      case View.QA:
        return (
          <QAView 
            user={currentUser!} 
            questions={questions} 
            onAddQuestion={handleAddQuestion} 
            onAnswerQuestion={handleAnswerQuestion} 
          />
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-slate-900 text-white p-4 sm:p-8 flex flex-col">
      {isLoading && <Spinner />}
      
      <header className="mb-10 border-b border-slate-800 pb-6">
        <div className="flex flex-col lg:flex-row justify-between items-center gap-6">
          <div className="flex-grow text-center lg:text-right">
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-teal-400 drop-shadow-[0_2px_4px_rgba(0,255,255,0.2)]">
              رفيقك في البحث عن الأحاديث النبوية
            </h1>
            <p className="text-slate-400 mt-2 text-lg">أداة لاستكشاف أحاديث الجامع الصغير وحكمها</p>
          </div>

          {currentUser && (
            <div className="flex items-center gap-4 bg-slate-800/80 p-3 px-5 rounded-2xl border border-slate-700 shadow-xl">
              <div className="text-right">
                <p className="text-[10px] text-slate-500 uppercase tracking-widest mb-0.5">المستخدم الحالي</p>
                <p className="text-sm font-bold text-teal-400">{currentUser.username}</p>
              </div>
              <div className="h-8 w-px bg-slate-700 mx-1"></div>
              <button 
                onClick={handleLogout}
                className="flex items-center gap-2 px-4 py-2 bg-red-500/10 hover:bg-red-600 text-red-500 hover:text-white rounded-xl transition-all text-sm font-bold border border-red-500/20 shadow-lg shadow-red-900/10"
              >
                <span>الخروج</span>
                <LogOutIcon className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>
      </header>

      <main className="flex-grow container mx-auto px-4">
        {view !== View.DASHBOARD && view !== View.LOGIN && (
          <button
            onClick={handleBack}
            className="flex items-center gap-2 mb-6 text-teal-400 hover:text-teal-300 transition-colors"
            aria-label="العودة للوحة التحكم"
          >
            <BackButtonIcon />
            <span>العودة للوحة التحكم</span>
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
