
import React, { useState, useMemo, useEffect } from 'react';
import type { Hadith, SearchResult, CategorizedHadiths, User, Question, GeminiResult } from './types';
import { SearchMode } from './types';
import Markdown from 'react-markdown';
import { 
  User as UserIconLucide, 
  HelpCircle, 
  Send, 
  Search, 
  Copy, 
  LayoutGrid, 
  Globe, 
  Info, 
  ChevronDown, 
  ArrowRight,
  MessageCircle,
  LogOut
} from 'lucide-react';

// ===== ICONS =====

export const UserIcon: React.FC<{ className?: string }> = ({ className = "w-8 h-8" }) => (
  <UserIconLucide className={className} />
);

export const QuestionIcon: React.FC<{ className?: string }> = ({ className = "w-8 h-8" }) => (
  <HelpCircle className={className} />
);

export const SendIcon: React.FC<{ className?: string }> = ({ className = "w-6 h-6" }) => (
  <Send className={className} />
);

export const SearchIcon: React.FC<{ className?: string }> = ({ className = "w-8 h-8" }) => (
  <Search className={className} />
);

export const CopyIcon: React.FC<{ className?: string }> = ({ className = "w-6 h-6" }) => (
  <Copy className={className} />
);

export const WhatsAppIcon: React.FC<{ className?: string }> = ({ className = "w-6 h-6" }) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 24 24" className={className}>
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
  </svg>
);

export const CategoryIcon: React.FC<{ className?: string }> = ({ className = "w-8 h-8" }) => (
  <LayoutGrid className={className} />
);

export const GlobeIcon: React.FC<{ className?: string }> = ({ className = "w-8 h-8" }) => (
  <Globe className={className} />
);

export const InfoIcon: React.FC<{ className?: string }> = ({ className = "w-8 h-8" }) => (
  <Info className={className} />
);

export const ChevronDownIcon: React.FC<{ className?: string }> = ({ className = "w-6 h-6" }) => (
  <ChevronDown className={className} />
);

export const BackButtonIcon: React.FC<{ className?: string }> = ({ className = "w-6 h-6" }) => (
  <ArrowRight className={className} />
);

export const LogOutIcon: React.FC<{ className?: string }> = ({ className = "w-6 h-6" }) => (
  <LogOut className={className} />
);

// ===== LOGIN VIEW =====

interface LoginViewProps {
    onLogin: (username: string, isAdmin: boolean) => void;
}

export const LoginView: React.FC<LoginViewProps> = ({ onLogin }) => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');

    const handleLogin = (e: React.FormEvent) => {
        e.preventDefault();
        setError('');

        // Validation: "الحق بغيتي وإلى الله وجهتي" for Admin
        // or "الحق بغيتي [رقم]" for regular users
        const isAdmin = username === 'الحق بغيتي وإلى الله وجهتي';
        const isUser = /^الحق بغيتي \d+$/.test(username);

        if ((isAdmin || isUser) && password === '123') {
            onLogin(username, isAdmin);
        } else {
            setError('اسم المستخدم أو كلمة المرور غير صحيحة. المدير: الحق بغيتي وإلى الله وجهتي | المستخدم: الحق بغيتي [رقم]');
        }
    };

    return (
        <div className="max-w-md mx-auto mt-20 p-10 bg-slate-800/50 backdrop-blur-xl border border-slate-700/50 rounded-[3rem] shadow-2xl animate-in fade-in zoom-in-95 duration-700">
            <div className="flex justify-center mb-8">
                <div className="p-5 bg-teal-500/10 rounded-full shadow-inner">
                    <UserIcon className="w-16 h-16 text-teal-400" />
                </div>
            </div>
            <h2 className="text-3xl font-black text-center text-white mb-2">تسجيل الدخول</h2>
            <p className="text-slate-500 text-center mb-10 text-sm">أهلاً بك في منصة رفيقك البحثية</p>
            
            <form onSubmit={handleLogin} className="space-y-8">
                <div className="space-y-2">
                    <label className="block text-slate-400 text-sm font-bold mr-2">اسم المستخدم</label>
                    <input
                        type="text"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        placeholder="الحق بغيتي وإلى الله وجهتي"
                        className="w-full px-6 py-4 bg-slate-900/50 border border-slate-700 rounded-2xl text-white focus:outline-none focus:ring-2 focus:ring-teal-500 transition-all shadow-inner"
                        required
                    />
                </div>
                <div className="space-y-2">
                    <label className="block text-slate-400 text-sm font-bold mr-2">كلمة المرور</label>
                    <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="••••••••"
                        className="w-full px-6 py-4 bg-slate-900/50 border border-slate-700 rounded-2xl text-white focus:outline-none focus:ring-2 focus:ring-teal-500 transition-all shadow-inner"
                        required
                    />
                </div>
                
                {error && (
                    <div className="bg-red-500/10 border border-red-500/20 p-4 rounded-xl">
                        <p className="text-red-400 text-xs text-center leading-relaxed">{error}</p>
                    </div>
                )}
                
                <button
                    type="submit"
                    className="w-full py-5 bg-teal-600 hover:bg-teal-500 text-white font-black rounded-2xl transition-all shadow-xl shadow-teal-900/40 transform hover:scale-[1.02] active:scale-95"
                >
                    دخول للمنصة
                </button>
            </form>
        </div>
    );
};

// ===== QA VIEW =====

interface QAViewProps {
    user: User;
    questions: Question[];
    onAddQuestion: (text: string) => void;
    onAnswerQuestion: (id: string, answer: string) => void;
}

export const QAView: React.FC<QAViewProps> = ({ user, questions, onAddQuestion, onAnswerQuestion }) => {
    const [newQuestion, setNewQuestion] = useState('');
    const [searchQuery, setSearchQuery] = useState('');
    const [answeringId, setAnsweringId] = useState<string | null>(null);
    const [answerText, setAnswerText] = useState('');

    const filteredQuestions = useMemo(() => {
        if (!searchQuery.trim()) return questions;
        const q = searchQuery.toLowerCase();
        return questions.filter(qObj => 
            qObj.text.toLowerCase().includes(q) || 
            (qObj.answer && qObj.answer.toLowerCase().includes(q))
        );
    }, [questions, searchQuery]);

    const handleAddQuestion = (e: React.FormEvent) => {
        e.preventDefault();
        if (newQuestion.trim()) {
            onAddQuestion(newQuestion.trim());
            setNewQuestion('');
        }
    };

    const handleAnswerSubmit = (id: string) => {
        if (answerText.trim()) {
            onAnswerQuestion(id, answerText.trim());
            setAnsweringId(null);
            setAnswerText('');
        }
    };

    return (
        <div className="max-w-4xl mx-auto space-y-10 animate-in fade-in duration-700">
            {/* Add Question Form */}
            <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 p-8 rounded-3xl shadow-2xl">
                <div className="flex items-center gap-3 mb-6">
                    <div className="p-2 bg-teal-500/10 rounded-xl">
                        <QuestionIcon className="w-6 h-6 text-teal-400" />
                    </div>
                    <h3 className="text-2xl font-bold text-white">اطرح سؤالاً جديداً</h3>
                </div>
                <form onSubmit={handleAddQuestion} className="flex flex-col sm:flex-row gap-4">
                    <input
                        type="text"
                        value={newQuestion}
                        onChange={(e) => setNewQuestion(e.target.value)}
                        placeholder="اكتب سؤالك هنا بوضوح..."
                        className="flex-grow px-6 py-4 bg-slate-900 border border-slate-700 rounded-2xl text-white focus:outline-none focus:ring-2 focus:ring-teal-500 transition-all shadow-inner"
                    />
                    <button
                        type="submit"
                        className="px-8 py-4 bg-teal-600 hover:bg-teal-500 text-white rounded-2xl font-bold transition-all flex items-center justify-center gap-2 shadow-lg shadow-teal-900/40 transform hover:scale-105 active:scale-95"
                    >
                        <SendIcon />
                        <span>إرسال السؤال</span>
                    </button>
                </form>
            </div>

            {/* Search Questions */}
            <div className="relative group">
                <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="البحث في الأسئلة والأجوبة السابقة..."
                    className="w-full px-6 py-4 pr-14 bg-slate-800/80 border border-slate-700 rounded-2xl text-white focus:outline-none focus:ring-2 focus:ring-teal-500 transition-all shadow-lg group-hover:border-slate-600"
                />
                <SearchIcon className="absolute left-5 top-1/2 -translate-y-1/2 w-6 h-6 text-slate-500 group-hover:text-teal-400 transition-colors" />
            </div>

            {/* Questions List */}
            <div className="grid gap-6">
                {filteredQuestions.length === 0 ? (
                    <div className="text-center py-16 bg-slate-800/20 rounded-3xl border border-dashed border-slate-700">
                        <p className="text-slate-500 text-lg">لا توجد أسئلة تطابق بحثك حالياً.</p>
                    </div>
                ) : (
                    filteredQuestions.map(q => (
                        <div key={q.id} className="bg-slate-800/40 backdrop-blur-sm border border-slate-700/50 p-8 rounded-3xl shadow-xl hover:border-teal-500/30 transition-all group animate-in fade-in slide-in-from-bottom-4 duration-500">
                            <div className="flex justify-between items-start gap-6 mb-6">
                                <div className="flex-grow">
                                    <p className="text-xl font-bold text-white mb-3 leading-relaxed">{q.text}</p>
                                    <div className="flex flex-wrap items-center gap-3 text-xs text-slate-500">
                                        <span className="bg-slate-700/50 px-3 py-1 rounded-full border border-slate-600/30">السائل: {q.author}</span>
                                        <span className="flex items-center gap-1.5">
                                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4">
                                                <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 0 1 2.25-2.25h13.5A2.25 2.25 0 0 1 21 7.5v11.25m-18 0A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75m-18 0v-7.5A2.25 2.25 0 0 1 5.25 9h13.5A2.25 2.25 0 0 1 21 11.25v7.5" />
                                            </svg>
                                            {new Date(q.timestamp).toLocaleString('ar-EG', { dateStyle: 'full', timeStyle: 'short' })}
                                        </span>
                                    </div>
                                </div>
                                {user.isAdmin && answeringId !== q.id && (
                                    <button
                                        onClick={() => setAnsweringId(q.id)}
                                        className="px-6 py-2.5 bg-teal-600 hover:bg-teal-500 text-white rounded-xl text-sm font-bold transition-all shadow-lg shadow-teal-900/20 shrink-0 transform hover:scale-105"
                                    >
                                        إضافة إجابة
                                    </button>
                                )}
                            </div>

                            {q.answer ? (
                                <div className="mt-6">
                                    <button
                                        onClick={() => {
                                            const el = document.getElementById(`answer-${q.id}`);
                                            if (el) el.classList.toggle('hidden');
                                        }}
                                        className="flex items-center gap-2 text-teal-400 hover:text-teal-300 font-bold text-sm mb-3 bg-teal-500/5 px-4 py-2 rounded-lg border border-teal-500/20 transition-all"
                                    >
                                        <ChevronDownIcon className="w-4 h-4" />
                                        <span>نص الإجابة</span>
                                    </button>
                                    <div id={`answer-${q.id}`} className="hidden p-6 bg-slate-900/60 border-r-4 border-teal-500 rounded-2xl shadow-inner animate-in fade-in slide-in-from-top-2 duration-300">
                                        <p className="text-teal-400 font-black text-xs uppercase tracking-widest mb-2">إجابة المدير العام ({q.answeredBy}):</p>
                                        <p className="text-slate-200 text-lg leading-relaxed">{q.answer}</p>
                                        <div className="flex items-center gap-1.5 text-[10px] text-slate-500 mt-4 pt-4 border-t border-slate-800">
                                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-3.5 h-3.5">
                                                <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
                                            </svg>
                                            تمت الإجابة في: {new Date(q.answerTimestamp!).toLocaleString('ar-EG', { dateStyle: 'long', timeStyle: 'short' })}
                                        </div>
                                    </div>
                                </div>
                            ) : answeringId === q.id ? (
                                <div className="mt-6 space-y-4 animate-in fade-in slide-in-from-top-2 duration-300">
                                    <textarea
                                        value={answerText}
                                        onChange={(e) => setAnswerText(e.target.value)}
                                        placeholder="اكتب الإجابة الفقهية أو التوضيحية هنا..."
                                        className="w-full p-5 bg-slate-900 border border-slate-700 rounded-2xl text-white focus:outline-none focus:ring-2 focus:ring-teal-500 h-40 shadow-inner"
                                    />
                                    <div className="flex justify-end gap-3">
                                        <button
                                            onClick={() => {
                                                setAnsweringId(null);
                                                setAnswerText('');
                                            }}
                                            className="px-6 py-2.5 text-slate-400 hover:text-white font-bold transition-colors"
                                        >
                                            إلغاء
                                        </button>
                                        <button
                                            onClick={() => handleAnswerSubmit(q.id)}
                                            className="px-8 py-2.5 bg-teal-600 hover:bg-teal-500 text-white rounded-xl font-bold shadow-lg shadow-teal-900/20 transition-all transform hover:scale-105"
                                        >
                                            حفظ ونشر الإجابة
                                        </button>
                                    </div>
                                </div>
                            ) : (
                                <div className="mt-6 flex items-center gap-2 text-slate-500 italic text-sm bg-slate-900/30 p-3 rounded-xl border border-slate-800/50">
                                    <div className="w-2 h-2 bg-slate-700 rounded-full animate-pulse"></div>
                                    بانتظار إجابة المدير العام...
                                </div>
                            )}
                        </div>
                    ))
                )}
            </div>
        </div>
    );
};

// ===== UI COMPONENTS =====

export const Spinner: React.FC = () => (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-950/80 backdrop-blur-md">
        <div className="relative flex flex-col items-center">
            <div className="w-24 h-24 border-4 border-teal-500/20 border-t-teal-500 rounded-full animate-spin"></div>
            <div className="absolute top-0 w-24 h-24 border-4 border-transparent border-b-teal-500/50 rounded-full animate-spin [animation-duration:1.5s]"></div>
            <p className="mt-6 text-teal-400 font-black tracking-[0.2em] animate-pulse text-sm">جاري التحميل...</p>
        </div>
    </div>
);

interface IconButtonProps {
    // FIX: Changed onClick type to accept a MouseEvent, which is expected for a button's onClick handler.
    onClick: (event: React.MouseEvent<HTMLButtonElement>) => void;
    icon: React.ReactNode;
    label: string;
}

export const IconButton: React.FC<IconButtonProps> = ({ onClick, icon, label }) => (
    <button
        onClick={onClick}
        className="group flex flex-col items-center justify-center w-56 h-56 bg-slate-800/40 backdrop-blur-md border border-slate-700/50 rounded-[2.5rem] shadow-2xl text-slate-300 hover:bg-teal-600/10 hover:text-white hover:border-teal-500/50 transition-all duration-500 transform hover:-translate-y-2 focus:outline-none focus:ring-4 focus:ring-teal-500/20"
    >
        <div className="mb-4 p-5 bg-slate-900/50 rounded-3xl text-teal-400 group-hover:scale-110 group-hover:bg-teal-500/20 transition-all duration-500 shadow-inner">
            {React.cloneElement(icon as React.ReactElement<{ className?: string }>, { className: "w-10 h-10" })}
        </div>
        <span className="text-xl font-bold tracking-tight">{label}</span>
    </button>
);

interface SearchBarProps {
    onSearch: (query: string, mode: SearchMode) => void;
    isSearching: boolean;
}

export const SearchBar: React.FC<SearchBarProps> = ({ onSearch, isSearching }) => {
    const [query, setQuery] = useState('');
    const [mode, setMode] = useState<SearchMode>(SearchMode.EXACT);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (query.trim()) {
            onSearch(query.trim(), mode);
        }
    };

    const modes = [
        { id: SearchMode.EXACT, label: 'تطابق تام' },
        { id: SearchMode.ALL_WORDS, label: 'جميع الكلمات' },
        { id: SearchMode.SIMILAR, label: 'بحث مشابه' },
        { id: SearchMode.GEMINI, label: 'البحث عبر النت', icon: <GlobeIcon className="w-5 h-5" /> },
    ];

    return (
        <div className="w-full max-w-3xl mx-auto my-8 animate-in fade-in slide-in-from-top-4 duration-700">
            <form onSubmit={handleSubmit} className="mb-6">
                <div className="relative group">
                    <input
                        type="text"
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                        placeholder="اكتب كلمة أو جزءاً من الحديث للبحث..."
                        className="w-full px-8 py-5 pr-16 text-xl text-white bg-slate-800/50 backdrop-blur-md border-2 border-slate-700/50 rounded-3xl focus:outline-none focus:ring-4 focus:ring-teal-500/20 focus:border-teal-500/50 transition-all shadow-2xl group-hover:border-slate-600"
                        disabled={isSearching}
                    />
                    <button
                        type="submit"
                        className="absolute left-3 top-1/2 -translate-y-1/2 p-4 bg-teal-600 text-white rounded-2xl hover:bg-teal-500 transition-all disabled:bg-slate-700 disabled:cursor-not-allowed shadow-lg shadow-teal-900/40 transform hover:scale-105 active:scale-95"
                        disabled={isSearching}
                    >
                        {mode === SearchMode.GEMINI ? <GlobeIcon className="w-6 h-6" /> : <SearchIcon className="w-6 h-6" />}
                    </button>
                </div>
            </form>
            
            <div className="flex flex-wrap justify-center gap-4">
                {modes.map((m) => (
                    <button
                        key={m.id}
                        onClick={() => setMode(m.id)}
                        className={`px-6 py-2.5 rounded-2xl text-sm font-bold transition-all duration-300 border-2 flex items-center gap-2 ${
                            mode === m.id
                                ? 'bg-teal-600 border-teal-500 text-white shadow-xl shadow-teal-900/40 transform scale-105'
                                : 'bg-slate-800/50 border-slate-700/50 text-slate-400 hover:border-slate-500 hover:text-slate-200'
                        }`}
                        type="button"
                    >
                        {m.icon}
                        {m.label}
                    </button>
                ))}
            </div>
        </div>
    );
};

export const GeminiResultCard: React.FC<{ result: string }> = ({ result }) => {
    const handleCopy = () => copyToClipboard(result);
    const handleWhatsApp = () => shareToWhatsApp(result + "\n\n--- 🌿 رفيقك في البحث عن الأحاديث 🌿 ---");

    return (
        <div className="bg-slate-800 border border-teal-500/30 rounded-2xl p-6 mb-6 shadow-xl animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="flex justify-between items-center mb-6 border-b border-slate-700/50 pb-4">
                <div className="flex items-center gap-3">
                    <div className="p-2 bg-teal-500/20 rounded-lg">
                        <GlobeIcon className="w-6 h-6 text-teal-400" />
                    </div>
                    <h3 className="text-lg font-bold text-white">نتائج البحث عبر الذكاء الاصطناعي (جيمناي)</h3>
                </div>
                <div className="flex gap-2">
                    <button
                        onClick={handleCopy}
                        className="p-2 text-slate-400 hover:text-teal-400 hover:bg-teal-500/10 rounded-lg transition-all"
                        title="نسخ النتائج"
                    >
                        <CopyIcon className="w-5 h-5" />
                    </button>
                    <button
                        onClick={handleWhatsApp}
                        className="p-2 text-slate-400 hover:text-green-400 hover:bg-green-500/10 rounded-lg transition-all"
                        title="إرسال عبر واتساب"
                    >
                        <WhatsAppIcon className="w-5 h-5" />
                    </button>
                </div>
            </div>
            
            <div className="markdown-body text-right" dir="rtl">
                <Markdown>{result}</Markdown>
            </div>
            
            <div className="mt-8 pt-4 border-t border-slate-700/50 text-xs text-slate-500 flex items-center gap-2 italic">
                <InfoIcon className="w-4 h-4" />
                تم توليد هذه النتائج بواسطة الذكاء الاصطناعي بناءً على المصادر المعتمدة.
            </div>
        </div>
    );
};


// ===== HELPERS =====

const HADITH_SYMBOLS: Record<string, string> = {
    'خ': 'البخاري',
    'م': 'مسلم',
    'ق': 'المتفق عليه (البخاري ومسلم)',
    'د': 'أبو داود',
    'ت': 'الترمذي',
    'هـ': 'ابن ماجه',
    'ن': 'النسائي',
    'حم': 'مسند الإمام أحمد',
    'ك': 'الحاكم في المستدرك',
    'حب': 'ابن حبان',
    'طب': 'الطبراني في المعجم الكبير',
    'طس': 'الطبراني في المعجم الأوسط',
    'طص': 'الطبراني في المعجم الصغير',
    'حل': 'أبو نعيم في الحلية',
    'فر': 'الديلمي في مسند الفردوس',
    'هب': 'البيهقي في شعب الإيمان',
    'خد': 'البخاري في الأدب المفرد',
    'صح': 'لبيان أن الحديث صحيح',
    'عم': 'عبد الله بن أحمد في زوائد المسند'
};

const getSymbolsFromHadith = (hadith: Hadith): { symbol: string; meaning: string }[] => {
    const foundSymbols: { symbol: string; meaning: string }[] = [];
    const allText = `${hadith.text} ${hadith.source} ${hadith.narrator} ${hadith.before} ${hadith.response} ${hadith.other}`;
    
    Object.entries(HADITH_SYMBOLS).forEach(([symbol, meaning]) => {
        const escapedSymbol = symbol.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
        // Regex to find symbol as a standalone word or within parentheses/punctuation
        const regex = new RegExp(`(^|\\s|[()\\-.,:;])(${escapedSymbol})(\\s|[()\\-.,:;]|$)`, 'g');
        
        if (regex.test(allText)) {
            foundSymbols.push({ symbol, meaning });
        }
    });
    
    return foundSymbols;
};

const formatHadithForShare = (hadith: Hadith): string => {
    let text = `✨ *الحديث رقم ${hadith.id}* ✨\n\n`;
    text += `📜 "${hadith.text.trim()}"\n\n`;
    if (hadith.source || hadith.narrator) {
        text += `👤 *الراوي/المصدر:* ${hadith.source} ${hadith.narrator}\n`;
    }
    
    const isValidSection = (val?: string) => val && val.trim() !== '' && val.trim() !== 'لم نجد من قبله إلى الآن؛ ولعلنا نجد في المرحلة الثانية من التحقيق.';

    if (isValidSection(hadith.before)) {
        text += `\n🔹 *من قبل الحديث:* \n${hadith.before}\n`;
    }
    if (isValidSection(hadith.response)) {
        text += `\n🔸 *من رد الحديث:* \n${hadith.response}\n`;
    }
    if (isValidSection(hadith.other)) {
        text += `\n📝 *عبارات أخرى:* \n${hadith.other}\n`;
    }

    const symbols = getSymbolsFromHadith(hadith);
    if (symbols.length > 0) {
        text += `\n📖 *معاني الرموز:* \n`;
        symbols.forEach(s => {
            text += `▫️ ${s.symbol} = ${s.meaning}\n`;
        });
    }
    
    text += `\n--- 🌿 رفيقك في البحث عن الأحاديث 🌿 ---`;
    return text;
};

const copyToClipboard = async (text: string) => {
    try {
        await navigator.clipboard.writeText(text);
        alert('تم نسخ النص بنجاح!');
    } catch (err) {
        console.error('Failed to copy: ', err);
        alert('فشل النسخ، يرجى المحاولة مرة أخرى.');
    }
};

const shareToWhatsApp = (text: string) => {
    const url = `https://api.whatsapp.com/send?text=${encodeURIComponent(text)}`;
    window.open(url, '_blank');
};

interface HadithCardProps {
    hadith: Hadith;
}

export const HadithCard: React.FC<HadithCardProps> = ({ hadith }) => {
    const handleCopy = () => copyToClipboard(formatHadithForShare(hadith));
    const handleWhatsApp = () => shareToWhatsApp(formatHadithForShare(hadith));

    const symbols = useMemo(() => getSymbolsFromHadith(hadith), [hadith]);

    const renderField = (label: string, value?: string) => {
        if (!value || value.trim() === '' || value.trim() === 'لم نجد من قبله إلى الآن؛ ولعلنا نجد في المرحلة الثانية من التحقيق.') return null;
        return (
            <div className="mt-4 group/field">
                <h4 className="text-sm font-bold text-teal-500/80 mb-1 flex items-center gap-2">
                    <span className="w-1 h-4 bg-teal-500 rounded-full"></span>
                    {label}
                </h4>
                <p className="text-slate-300 whitespace-pre-wrap leading-relaxed bg-slate-900/30 p-3 rounded-lg border border-slate-700/30 group-hover/field:border-teal-500/20 transition-colors">
                    {value}
                </p>
            </div>
        );
    };

    return (
        <div className="bg-slate-800 border border-slate-700 rounded-2xl p-6 mb-6 shadow-lg transition-all duration-300 hover:shadow-teal-900/10 hover:border-teal-500/30 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="flex flex-col sm:flex-row justify-between items-start gap-4 mb-4">
                <div className="flex-grow">
                    <p className="text-xl font-medium text-white leading-relaxed text-right" dir="rtl">
                        <span className="text-2xl font-black text-teal-400 ml-2">#{hadith.id}</span>
                        "{hadith.text.trim()}"
                    </p>
                </div>
            </div>
            
            <div className="flex flex-wrap gap-2 mb-4">
                {hadith.source && (
                    <span className="px-3 py-1 bg-slate-900 text-teal-400 text-xs font-bold rounded-full border border-slate-700">
                        {hadith.source}
                    </span>
                )}
                {hadith.narrator && (
                    <span className="px-3 py-1 bg-slate-900 text-slate-400 text-xs rounded-full border border-slate-700">
                        الراوي: {hadith.narrator}
                    </span>
                )}
            </div>

            <div className="border-t border-slate-700/50 pt-2">
                {renderField("من قبل الحديث", hadith.before)}
                {renderField("من رد الحديث", hadith.response)}
                {renderField("عبارات أخرى ذات صلة", hadith.other)}
            </div>

            {symbols.length > 0 && (
                <div className="mt-4 pt-4 border-t border-slate-700/30">
                    <div className="flex flex-wrap gap-x-4 gap-y-2 bg-slate-900/40 p-3 rounded-xl border border-slate-700/20">
                        {symbols.map((s, idx) => (
                            <div key={idx} className="text-[11px] text-slate-400 flex items-center gap-1">
                                <span className="text-teal-400 font-bold bg-slate-800 px-1.5 py-0.5 rounded border border-slate-700">{s.symbol}</span>
                                <span>=</span>
                                <span className="font-medium">{s.meaning}</span>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            <div className="mt-6 flex justify-end gap-3 border-t border-slate-700/30 pt-4">
                <button
                    onClick={handleCopy}
                    className="flex items-center gap-2 px-4 py-2 bg-slate-900 border border-slate-700 text-slate-400 hover:text-white hover:border-slate-500 rounded-xl text-xs font-bold transition-all"
                    title="نسخ الحديث"
                >
                    <CopyIcon className="w-4 h-4" />
                    <span>نسخ</span>
                </button>
                <button
                    onClick={handleWhatsApp}
                    className="flex items-center gap-2 px-4 py-2 bg-green-600/10 border border-green-600/30 text-green-500 hover:bg-green-600 hover:text-white rounded-xl text-xs font-bold transition-all"
                    title="إرسال عبر واتساب"
                >
                    <WhatsAppIcon className="w-4 h-4" />
                    <span>واتساب</span>
                </button>
            </div>
        </div>
    );
};

interface SearchResultsProps {
    results: SearchResult | null;
    onFindSimilar?: (text: string) => void;
}

export const SearchResults: React.FC<SearchResultsProps> = ({ results, onFindSimilar }) => {
    if (!results) {
        return <div className="text-center text-slate-400 mt-8">لا توجد نتائج لعرضها.</div>;
    }

    const handleCopyAll = () => {
        const allText = results.results.map(h => formatHadithForShare(h)).join('\n\n====================\n\n');
        copyToClipboard(allText);
    };

    const handleWhatsAppAll = () => {
        const allText = results.results.map(h => formatHadithForShare(h)).join('\n\n====================\n\n');
        shareToWhatsApp(allText);
    };

    if (results.totalCount === 0) {
        return (
            <div className="mt-12 text-center p-12 bg-slate-800/30 rounded-[3rem] border border-dashed border-slate-700/50 animate-in fade-in zoom-in duration-700">
                <div className="inline-flex p-6 bg-slate-900/50 rounded-full mb-6 border border-slate-700/30 shadow-inner">
                    <SearchIcon className="w-12 h-12 text-slate-600" />
                </div>
                <h3 className="text-2xl font-bold text-white mb-3">لم يتم العثور على نتائج</h3>
                <p className="text-slate-400 max-w-md mx-auto leading-relaxed">
                    عذراً، لم نجد أي أحاديث تطابق بحثك في قاعدة البيانات المحلية. جرب استخدام كلمات مفتاحية أخرى أو استخدم <span className="text-teal-400 font-bold">"البحث عبر النت"</span> للحصول على نتائج من المصادر العالمية.
                </p>
            </div>
        );
    }

    return (
        <div className="mt-6 space-y-8">
            <div className="flex flex-col sm:flex-row justify-between items-center bg-slate-800/50 p-4 rounded-2xl border border-slate-700/50 gap-4">
                <div className="flex items-center gap-3">
                    <div className="p-2 bg-teal-500/10 rounded-xl">
                        <SearchIcon className="w-6 h-6 text-teal-400" />
                    </div>
                    <div>
                        <h3 className="text-white font-bold text-lg">نتائج البحث</h3>
                        <p className="text-slate-500 text-xs">تم العثور على {results.totalCount} حديث في قاعدة البيانات</p>
                    </div>
                </div>
                <div className="flex gap-2">
                    <button
                        onClick={handleCopyAll}
                        className="flex items-center gap-2 px-4 py-2 bg-slate-700 hover:bg-slate-600 text-white rounded-xl text-xs font-bold transition-all border border-slate-600"
                    >
                        <CopyIcon className="w-4 h-4" />
                        <span>نسخ الكل</span>
                    </button>
                    <button
                        onClick={handleWhatsAppAll}
                        className="flex items-center gap-2 px-4 py-2 bg-green-600 hover:bg-green-500 text-white rounded-xl text-xs font-bold transition-all border border-green-500 shadow-lg shadow-green-900/20"
                    >
                        <WhatsAppIcon className="w-4 h-4" />
                        <span>إرسال الكل</span>
                    </button>
                </div>
            </div>
            
            <div className="space-y-8">
                {results.results.map((hadith, index) => (
                    <div key={hadith.id} className="relative group">
                        <HadithCard hadith={hadith} />
                        {index === 0 && onFindSimilar && (
                            <div className="flex justify-center -mt-3 relative z-10">
                                <button
                                    onClick={() => onFindSimilar(hadith.text)}
                                    className="px-8 py-3 bg-teal-600 hover:bg-teal-500 text-white rounded-full text-sm font-bold transition-all shadow-xl shadow-teal-900/40 flex items-center gap-2 transform hover:scale-105 active:scale-95"
                                >
                                    <SearchIcon className="w-4 h-4" />
                                    <span>البحث عن أحاديث مشابهة لهذا النص</span>
                                </button>
                            </div>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
};


const AccordionItem: React.FC<{ title: string; children: React.ReactNode }> = ({ title, children }) => {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <div className="border-b border-slate-700/50 last:border-0 overflow-hidden">
            <button
                onClick={() => setIsOpen(!isOpen)}
                className={`w-full flex justify-between items-center py-5 px-6 text-right text-xl font-bold transition-all duration-300 ${
                    isOpen ? 'bg-teal-500/10 text-teal-400' : 'text-white hover:bg-slate-700/50'
                }`}
            >
                <div className="flex items-center gap-3">
                    <div className={`p-1.5 rounded-lg transition-colors ${isOpen ? 'bg-teal-500/20' : 'bg-slate-700'}`}>
                        <CategoryIcon className="w-5 h-5" />
                    </div>
                    <span>{title}</span>
                </div>
                <ChevronDownIcon className={`w-6 h-6 transition-transform duration-500 ${isOpen ? 'rotate-180 text-teal-400' : 'text-slate-500'}`} />
            </button>
            <div
                className={`transition-all duration-500 ease-in-out ${
                    isOpen ? 'max-h-[20000px] opacity-100' : 'max-h-0 opacity-0'
                }`}
            >
                <div className="p-6 bg-slate-900/40 space-y-4">
                    {children}
                </div>
            </div>
        </div>
    );
};

interface CategoryViewProps {
    categorizedData: CategorizedHadiths | null;
}

export const CategoryView: React.FC<CategoryViewProps> = ({ categorizedData }) => {
    if (!categorizedData) {
        return <div className="text-center text-slate-400 mt-8">لا توجد تصنيفات لعرضها.</div>;
    }

    const sortedCategories = Object.keys(categorizedData).sort((a, b) => a.localeCompare(b, 'ar'));

    return (
        <div className="mt-8 w-full max-w-4xl mx-auto bg-slate-800/30 rounded-3xl border border-slate-700/50 shadow-2xl overflow-hidden backdrop-blur-sm">
            <div className="bg-slate-800/80 p-6 border-b border-slate-700/50">
                <h2 className="text-2xl font-bold text-teal-400 flex items-center gap-3">
                    <CategoryIcon className="w-8 h-8" />
                    الأحاديث حسب الأبواب الفقهية
                </h2>
                <p className="text-slate-500 text-sm mt-1">تصفح أحاديث الجامع الصغير مرتبة حسب الحرف الأول</p>
            </div>
            {sortedCategories.map(category => (
                <AccordionItem key={category} title={`باب ${category}`}>
                    {categorizedData[category].map(hadith => (
                        <HadithCard key={hadith.id} hadith={hadith} />
                    ))}
                </AccordionItem>
            ))}
        </div>
    );
};
