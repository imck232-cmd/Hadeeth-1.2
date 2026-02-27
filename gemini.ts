import type { Hadith, CategorizedResult } from './types';
import { HADITH_DATA } from './data';

export const parseHadithData = (): Hadith[] => {
    console.log("Parsing Hadith data...");
    
    // تنظيف البيانات من أرقام الصفحات التي قد تعيق التعبير النمطي
    const cleanedData = HADITH_DATA.replace(/\[ص:\d+\]/g, '');
    
    const hadiths: Hadith[] = [];
    // تقسيم البيانات بناءً على نمط الرقم في بداية السطر
    const entries = cleanedData.split(/^\s*(?=\d+\s*[-])/m);

    for (const entry of entries) {
        const trimmedEntry = entry.trim();
        if (trimmedEntry === "") continue;

        // تقسيم المدخل بناءً على أول علامة "" لفصل الرأس عن الأقسام
        const parts = trimmedEntry.split('');
        const header = parts[0].trim();

        // استخراج المعرف والنص وما يلحقهما من معلومات الراوي والمصدر
        const headerMatch = header.match(/^(\d+)\s*-\s*"(.*?)"\s*([\s\S]*)$/);
        
        if (headerMatch) {
            const [, id, text, info] = headerMatch;

            const getSection = (key: string): string => {
                const regex = new RegExp(`\\s*${key}:\\s*([\\s\\S]*?)(?=\\n\\s*|$)`, 's');
                const match = trimmedEntry.match(regex);
                return match ? match[1].trim() : '';
            };

            // محاولة فصل المصدر (بين قوسين) عن الراوي
            let source = '';
            let narrator = info.trim();
            const sourceMatch = narrator.match(/^\((.*?)\)/);
            if (sourceMatch) {
                source = `(${sourceMatch[1].trim()})`;
                narrator = narrator.replace(sourceMatch[0], '').trim();
            }

            hadiths.push({
                id: parseInt(id, 10),
                text: text.trim().replace(/\s+/g, ' '),
                source: source,
                narrator: narrator,
                before: getSection('من قبله'),
                response: getSection('من رده'),
                other: getSection('عبارات أخرى'),
            });
        } else {
            console.warn("Could not parse entry header:", header.substring(0, 100));
        }
    }
    console.log(`Successfully parsed ${hadiths.length} hadiths.`);
    return hadiths;
};

export const searchHadiths = async (query: string, allHadiths: Hadith[]) => {
    console.log(`Local search for: "${query}"`);
    
    const normalizedQuery = query.trim().toLowerCase();
    if (!normalizedQuery) return { mainHadith: allHadiths[0], similarHadiths: [] };

    // تقسيم الاستعلام إلى كلمات للبحث عن تطابق متعدد
    const queryWords = normalizedQuery.split(/\s+/).filter(word => word.length > 2);

    // حساب قوة التطابق لكل حديث
    const scoredHadiths = allHadiths.map(hadith => {
        let score = 0;
        const text = hadith.text.toLowerCase();
        
        // تطابق كامل مع النص
        if (text.includes(normalizedQuery)) score += 100;
        
        // تطابق الكلمات الفردية
        queryWords.forEach(word => {
            if (text.includes(word)) score += 20;
        });

        return { hadith, score };
    });

    // تصفية وترتيب النتائج
    const results = scoredHadiths
        .filter(item => item.score > 0)
        .sort((a, b) => b.score - a.score)
        .map(item => item.hadith);

    if (results.length === 0) {
        throw new Error("لم يتم العثور على أحاديث مطابقة لبحثك.");
    }

    const mainHadith = results[0];
    const similarHadiths = results.slice(1, 6); // عرض حتى 5 أحاديث مشابهة

    return { mainHadith, similarHadiths };
};

export const categorizeHadiths = async (allHadiths: Hadith[]): Promise<CategorizedResult[]> => {
    // التجميع المحلي لتوفير استهلاك الـ API وضمان سرعة الاستجابة
    const categories: Record<string, Hadith[]> = {};
    const alphabet = "أبتثجحخدذرزسشصضطظعغفقكلمنهوي";

    allHadiths.forEach(hadith => {
        let firstChar = hadith.text.trim().charAt(0);
        // التعامل مع الهمزات
        if (["آ", "إ", "أ", "إ"].includes(firstChar)) firstChar = "أ";
        
        if (!alphabet.includes(firstChar)) {
            firstChar = "أخرى";
        }
        
        if (!categories[firstChar]) categories[firstChar] = [];
        categories[firstChar].push(hadith);
    });

    return Object.entries(categories).map(([category, hadiths]) => ({
        category,
        hadiths
    }));
};
