
import React, { useState } from 'react';
import type { Hadith, SearchResult, CategorizedHadiths } from './types';
import { SearchMode } from './types';

// ===== ICONS =====

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
}

export const SearchResults: React.FC<SearchResultsProps> = ({ results }) => {
    if (!results) {
        return <div className="text-center text-slate-400 mt-8">لا توجد نتائج لعرضها.</div>;
    }
    return (
        <div className="mt-6">
            <h2 className="text-3xl font-bold text-center text-teal-400 mb-6 pb-2 border-b-2 border-slate-700">النتيجة الرئيسية</h2>
            <HadithCard hadith={results.mainHadith} />

            {results.similarHadiths.length > 0 && (
                <div className="mt-12">
                    <h2 className="text-3xl font-bold text-center text-teal-400 mb-6 pb-2 border-b-2 border-slate-700">أحاديث مشابهة</h2>
                    {results.similarHadiths.map(hadith => (
                        <HadithCard key={hadith.id} hadith={hadith} />
                    ))}
                </div>
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