
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
        <div className="max-w-md mx-auto mt-12 p-8 bg-slate-800 border border-slate-700 rounded-3xl shadow-2xl">
            <div className="flex justify-center mb-6 text-teal-400">
                <UserIcon className="w-16 h-16" />
            </div>
            <h2 className="text-2xl font-bold text-center text-white mb-8">تسجيل الدخول</h2>
            <form onSubmit={handleLogin} className="space-y-6">
                <div>
                    <label className="block text-slate-400 mb-2 mr-2">اسم المستخدم</label>
                    <input
                        type="text"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        placeholder="الحق بغيتي وإلى الله وجهتي"
                        className="w-full px-4 py-3 bg-slate-900 border border-slate-700 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-teal-500"
                        required
                    />
                </div>
                <div>
                    <label className="block text-slate-400 mb-2 mr-2">كلمة المرور</label>
                    <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="•••"
                        className="w-full px-4 py-3 bg-slate-900 border border-slate-700 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-teal-500"
                        required
                    />
                </div>
                {error && <p className="text-red-400 text-sm text-center">{error}</p>}
                <button
                    type="submit"
                    className="w-full py-3 bg-teal-600 hover:bg-teal-500 text-white font-bold rounded-xl transition-colors shadow-lg shadow-teal-900/20"
                >
                    دخول
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
        <div className="max-w-4xl mx-auto space-y-8">
            {/* Add Question Form */}
            <div className="bg-slate-800 border border-slate-700 p-6 rounded-2xl shadow-lg">
                <h3 className="text-xl font-bold text-teal-400 mb-4">اطرح سؤالاً جديداً</h3>
                <form onSubmit={handleAddQuestion} className="flex gap-3">
                    <input
                        type="text"
                        value={newQuestion}
                        onChange={(e) => setNewQuestion(e.target.value)}
                        placeholder="اكتب سؤالك هنا..."
                        className="flex-grow px-4 py-3 bg-slate-900 border border-slate-700 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-teal-500"
                    />
                    <button
                        type="submit"
                        className="px-6 py-3 bg-teal-600 hover:bg-teal-500 text-white rounded-xl transition-colors flex items-center gap-2"
                    >
                        <SendIcon />
                        <span>إرسال</span>
                    </button>
                </form>
            </div>

            {/* Search Questions */}
            <div className="relative">
                <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="البحث في الأسئلة والأجوبة..."
                    className="w-full px-5 py-3 pr-12 bg-slate-800 border border-slate-700 rounded-full text-white focus:outline-none focus:ring-2 focus:ring-teal-500"
                />
                <SearchIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-6 h-6 text-slate-400" />
            </div>

            {/* Questions List */}
            <div className="grid gap-4">
                {filteredQuestions.length === 0 ? (
                    <p className="text-center text-slate-500 py-8">لا توجد أسئلة تطابق بحثك.</p>
                ) : (
                    filteredQuestions.map(q => (
                        <div key={q.id} className="bg-slate-800 border border-slate-700 p-6 rounded-xl shadow-md hover:border-teal-500/50 transition-colors">
                            <div className="flex justify-between items-start gap-4 mb-4">
                                <div className="flex-grow">
                                    <p className="text-lg font-semibold text-white mb-1">{q.text}</p>
                                    <div className="flex items-center gap-2 text-xs text-slate-500">
                                        <span className="bg-slate-700/50 px-2 py-0.5 rounded">بواسطة: {q.author}</span>
                                        <span className="flex items-center gap-1">
                                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-3 h-3">
                                                <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 0 1 2.25-2.25h13.5A2.25 2.25 0 0 1 21 7.5v11.25m-18 0A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75m-18 0v-7.5A2.25 2.25 0 0 1 5.25 9h13.5A2.25 2.25 0 0 1 21 11.25v7.5" />
                                            </svg>
                                            {new Date(q.timestamp).toLocaleString('ar-EG', { dateStyle: 'full', timeStyle: 'short' })}
                                        </span>
                                    </div>
                                </div>
                                {user.isAdmin && answeringId !== q.id && (
                                    <button
                                        onClick={() => setAnsweringId(q.id)}
                                        className="px-4 py-2 bg-teal-600/20 border border-teal-500/50 text-teal-400 hover:bg-teal-600 hover:text-white rounded-lg text-sm font-bold transition-all shrink-0"
                                    >
                                        الإجابة
                                    </button>
                                )}
                            </div>

                            {q.answer ? (
                                <div className="mt-4">
                                    <button
                                        onClick={() => {
                                            const el = document.getElementById(`answer-${q.id}`);
                                            if (el) el.classList.toggle('hidden');
                                        }}
                                        className="flex items-center gap-2 text-teal-400 hover:text-teal-300 font-bold text-sm mb-2"
                                    >
                                        <ChevronDownIcon className="w-4 h-4" />
                                        <span>نص الإجابة</span>
                                    </button>
                                    <div id={`answer-${q.id}`} className="hidden p-4 bg-slate-900/50 border-r-4 border-teal-500 rounded-l-lg transition-all">
                                        <p className="text-teal-400 font-bold text-xs mb-1">الإجابة (بواسطة {q.answeredBy}):</p>
                                        <p className="text-slate-200">{q.answer}</p>
                                        <div className="flex items-center gap-1 text-[10px] text-slate-500 mt-3">
                                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-3 h-3">
                                                <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
                                            </svg>
                                            {new Date(q.answerTimestamp!).toLocaleString('ar-EG', { dateStyle: 'long', timeStyle: 'short' })}
                                        </div>
                                    </div>
                                </div>
                            ) : answeringId === q.id ? (
                                <div className="mt-4 space-y-3">
                                    <textarea
                                        value={answerText}
                                        onChange={(e) => setAnswerText(e.target.value)}
                                        placeholder="اكتب الإجابة هنا..."
                                        className="w-full p-3 bg-slate-900 border border-slate-700 rounded-lg text-white focus:outline-none focus:ring-1 focus:ring-teal-500 h-24"
                                    />
                                    <div className="flex justify-end gap-2">
                                        <button
                                            onClick={() => setAnsweringId(null)}
                                            className="px-4 py-2 text-slate-400 hover:text-white text-sm"
                                        >
                                            إلغاء
                                        </button>
                                        <button
                                            onClick={() => handleAnswerSubmit(q.id)}
                                            className="px-4 py-2 bg-teal-600 hover:bg-teal-500 text-white rounded-lg text-sm font-bold"
                                        >
                                            حفظ الإجابة
                                        </button>
                                    </div>
                                </div>
                            ) : (
                                <p className="text-sm text-slate-500 italic mt-2">بانتظار إجابة المدير العام...</p>
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
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
        <div className="animate-spin rounded-full h-32 w-32 border-t-4 border-b-4 border-teal-400"></div>
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
        className="flex flex-col items-center justify-center w-48 h-48 bg-slate-800 border border-slate-700 rounded-2xl shadow-lg text-slate-300 hover:bg-slate-700 hover:text-white hover:border-teal-400 transition-all duration-300 transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-opacity-75"
    >
        <div className="mb-3 text-teal-400">{icon}</div>
        <span className="text-xl font-semibold">{label}</span>
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
        <div className="w-full max-w-2xl mx-auto my-4">
            <form onSubmit={handleSubmit} className="mb-4">
                <div className="relative">
                    <input
                        type="text"
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                        placeholder="اكتب كلمة أو جزءاً من الحديث للبحث..."
                        className="w-full px-5 py-3 pr-12 text-lg text-white bg-slate-800 border-2 border-slate-700 rounded-full focus:outline-none focus:ring-2 focus:ring-teal-500 transition-colors"
                        disabled={isSearching}
                    />
                    <button
                        type="submit"
                        className="absolute left-2 top-1/2 -translate-y-1/2 p-2 bg-teal-600 text-white rounded-full hover:bg-teal-500 transition-colors disabled:bg-slate-600 disabled:cursor-not-allowed"
                        disabled={isSearching}
                    >
                        <SearchIcon className="w-6 h-6" />
                    </button>
                </div>
            </form>
            
            <div className="flex flex-wrap justify-center gap-3">
                {modes.map((m) => (
                    <button
                        key={m.id}
                        onClick={() => setMode(m.id)}
                        className={`px-4 py-1.5 rounded-full text-sm font-medium transition-all duration-200 border ${
                            mode === m.id
                                ? 'bg-teal-600 border-teal-500 text-white shadow-lg shadow-teal-900/40'
                                : 'bg-slate-800 border-slate-700 text-slate-400 hover:border-slate-500 hover:text-slate-200'
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
        if (!value || value.trim() === 'لم نجد من قبله إلى الآن؛ ولعلنا نجد في المرحلة الثانية من التحقيق.') return null;
        return (
            <div className="mt-4">
                <h4 className="text-lg font-bold text-teal-400 mb-1">{label}</h4>
                <p className="text-slate-300 whitespace-pre-wrap">{value}</p>
            </div>
        );
    };

    return (
        <div className="bg-slate-800 border border-slate-700 rounded-xl p-6 mb-4 shadow-md transition-shadow hover:shadow-lg hover:shadow-teal-900/20">
            <p className="text-xl font-medium text-white mb-2 leading-relaxed">
                <span className="text-2xl font-bold text-teal-400">{hadith.id} -</span> "{hadith.text.trim()}"
            </p>
            <p className="text-md text-slate-400 mb-4">{hadith.source} {hadith.narrator}</p>
            <div className="border-t border-slate-700 pt-4">
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
    const [showSimilar, setShowSimilar] = useState(false);

    if (!results) {
        return <div className="text-center text-slate-400 mt-8">لا توجد نتائج لعرضها.</div>;
    }

    const handleFindSimilar = () => {
        if (onFindSimilar) {
            onFindSimilar(results.mainHadith.text);
        }
        setShowSimilar(true);
    };

    return (
        <div className="mt-6 space-y-6">
            <div className="relative">
                <HadithCard hadith={results.mainHadith} />
                <div className="flex justify-center mt-2">
                    <button
                        onClick={handleFindSimilar}
                        className="px-6 py-2 bg-teal-600/20 border border-teal-500/50 text-teal-400 hover:bg-teal-600 hover:text-white rounded-full text-sm font-bold transition-all shadow-lg shadow-teal-900/10 flex items-center gap-2"
                    >
                        <SearchIcon className="w-4 h-4" />
                        <span>البحث عن أحاديث مشابهة</span>
                    </button>
                </div>
            </div>

            {showSimilar && results.similarHadiths.length > 0 && (
                <div className="pt-8 border-t border-slate-700 space-y-6">
                    <h3 className="text-center text-teal-500 font-bold text-lg mb-4">نتائج مشابهة في المعنى</h3>
                    {results.similarHadiths.map(hadith => (
                        <HadithCard key={hadith.id} hadith={hadith} />
                    ))}
                </div>
            )}
            
            {showSimilar && results.similarHadiths.length === 0 && (
                <p className="text-center text-slate-500 italic">لم نجد أحاديث مشابهة لهذا النص.</p>
            )}
        </div>
    );
};


const AccordionItem: React.FC<{ title: string; children: React.ReactNode }> = ({ title, children }) => {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <div className="border-b border-slate-700">
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="w-full flex justify-between items-center py-4 px-2 text-right text-xl font-semibold text-white hover:bg-slate-800 transition-colors"
            >
                <span>{title}</span>
                <ChevronDownIcon className={`w-6 h-6 transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`} />
            </button>
            <div
                className={`overflow-hidden transition-all duration-300 ease-in-out ${isOpen ? 'max-h-[10000px] opacity-100' : 'max-h-0 opacity-0'}`}
            >
                <div className="p-4 bg-slate-900/50">
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
        <div className="mt-6 w-full max-w-4xl mx-auto bg-slate-800/50 rounded-lg border border-slate-700 shadow-lg">
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