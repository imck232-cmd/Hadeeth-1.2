
import React, { useState, useMemo } from 'react';
import type { Hadith, SearchResult, CategorizedHadiths, User, Question } from './types';
import { SearchMode } from './types';

// ===== ICONS =====

export const UserIcon: React.FC<{ className?: string }> = ({ className = "w-8 h-8" }) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z" />
  </svg>
);

export const QuestionIcon: React.FC<{ className?: string }> = ({ className = "w-8 h-8" }) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M9.879 7.519c1.171-1.025 3.071-1.025 4.242 0 1.172 1.025 1.172 2.687 0 3.712-.203.179-.43.326-.67.442-.745.361-1.45.999-1.45 1.827v.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9 5.25h.008v.008H12v-.008Z" />
  </svg>
);

export const SendIcon: React.FC<{ className?: string }> = ({ className = "w-6 h-6" }) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M6 12 3.269 3.125A59.769 59.769 0 0 1 21.485 12 59.768 59.768 0 0 1 3.27 20.875L5.999 12Zm0 0h7.5" />
  </svg>
);

export const SearchIcon: React.FC<{ className?: string }> = ({ className = "w-8 h-8" }) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}>
    <path strokeLinecap="round" strokeLinejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" />
  </svg>
);

export const CategoryIcon: React.FC<{ className?: string }> = ({ className = "w-8 h-8" }) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6A2.25 2.25 0 0 1 6 3.75h2.25A2.25 2.25 0 0 1 10.5 6v2.25a2.25 2.25 0 0 1-2.25 2.25H6a2.25 2.25 0 0 1-2.25-2.25V6ZM3.75 15.75A2.25 2.25 0 0 1 6 13.5h2.25a2.25 2.25 0 0 1 2.25 2.25V18a2.25 2.25 0 0 1-2.25 2.25H6A2.25 2.25 0 0 1 3.75 18v-2.25ZM13.5 6a2.25 2.25 0 0 1 2.25-2.25H18A2.25 2.25 0 0 1 20.25 6v2.25A2.25 2.25 0 0 1 18 10.5h-2.25a2.25 2.25 0 0 1-2.25-2.25V6ZM13.5 15.75a2.25 2.25 0 0 1 2.25-2.25H18a2.25 2.25 0 0 1 2.25 2.25V18A2.25 2.25 0 0 1 18 20.25h-2.25A2.25 2.25 0 0 1 13.5 18v-2.25Z" />
  </svg>
);

export const ChevronDownIcon: React.FC<{ className?: string }> = ({ className = "w-6 h-6" }) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className={className}>
        <path strokeLinecap="round" strokeLinejoin="round" d="m19.5 8.25-7.5 7.5-7.5-7.5" />
    </svg>
);

export const BackButtonIcon: React.FC<{ className?: string }> = ({ className = "w-6 h-6" }) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5 3 12m0 0 7.5-7.5M3 12h18" />
    </svg>
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
            {React.cloneElement(icon as React.ReactElement, { className: "w-10 h-10" })}
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
    const [mode, setMode] = useState<SearchMode>(SearchMode.SIMILAR);

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
                        <SearchIcon className="w-6 h-6" />
                    </button>
                </div>
            </form>
            
            <div className="flex flex-wrap justify-center gap-4">
                {modes.map((m) => (
                    <button
                        key={m.id}
                        onClick={() => setMode(m.id)}
                        className={`px-6 py-2.5 rounded-2xl text-sm font-bold transition-all duration-300 border-2 ${
                            mode === m.id
                                ? 'bg-teal-600 border-teal-500 text-white shadow-xl shadow-teal-900/40 transform scale-105'
                                : 'bg-slate-800/50 border-slate-700/50 text-slate-400 hover:border-slate-500 hover:text-slate-200'
                        }`}
                        type="button"
                    >
                        {m.label}
                    </button>
                ))}
            </div>
        </div>
    );
};


interface HadithCardProps {
    hadith: Hadith;
}

export const HadithCard: React.FC<HadithCardProps> = ({ hadith }) => {
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
