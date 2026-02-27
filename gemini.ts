
import { GoogleGenAI, Type } from "@google/genai";
import type { Hadith, CategorizedResult } from './types';
import { HADITH_DATA } from './data';

// Lazy initialization to avoid crash if API_KEY is missing during module load
let aiInstance: GoogleGenAI | null = null;

const getAI = () => {
    if (!aiInstance) {
        const apiKey = process.env.API_KEY || process.env.GEMINI_API_KEY;
        if (!apiKey) {
            console.warn("Gemini API Key is missing. Search functionality will not work.");
        }
        aiInstance = new GoogleGenAI({ apiKey: apiKey || 'MISSING_KEY' });
    }
    return aiInstance;
};

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

const hadithPropertiesSchema = {
    id: { type: Type.INTEGER },
    text: { type: Type.STRING },
    source: { type: Type.STRING },
    narrator: { type: Type.STRING },
    before: { type: Type.STRING },
    response: { type: Type.STRING },
    other: { type: Type.STRING },
};

export const searchHadiths = async (query: string, allHadiths: Hadith[]) => {
    console.log(`Searching for: "${query}"`);
    const prompt = `
أنت مساعد خبير في علوم الحديث النبوي. سأزودك باستعلام بحث من المستخدم ومجموعة كاملة من الأحاديث بصيغة JSON.
مهمتك هي:
1. العثور على الحديث الأكثر تطابقًا وصلةً باستعلام البحث.
2. العثور على أحاديث أخرى مشابهة بنسبة 70% على الأقل.
3. الرد بصيغة JSON فقط وفقاً للمخطط.

استعلام البحث: "${query}"

مجموعة الأحاديث الكاملة (مختصرة للبحث):
${JSON.stringify(allHadiths.map(h => ({ id: h.id, text: h.text })))}
`;

    try {
        const ai = getAI();
        const response = await ai.models.generateContent({
            model: 'gemini-3-flash-preview',
            contents: prompt,
            config: {
                responseMimeType: 'application/json',
                responseSchema: {
                    type: Type.OBJECT,
                    properties: {
                        mainHadithId: { type: Type.INTEGER },
                        similarHadithIds: { 
                            type: Type.ARRAY, 
                            items: { type: Type.INTEGER } 
                        },
                    },
                    required: ['mainHadithId', 'similarHadithIds']
                },
            },
        });

        const resultIds = JSON.parse(response.text);
        
        // ربط المعرفات بالكائنات الكاملة من المصفوفة المحلية لتوفير التكاليف وضمان الدقة
        const mainHadith = allHadiths.find(h => h.id === resultIds.mainHadithId) || allHadiths[0];
        const similarHadiths = (resultIds.similarHadithIds as number[])
            .map(id => allHadiths.find(h => h.id === id))
            .filter((h): h is Hadith => !!h && h.id !== mainHadith.id);

        return { mainHadith, similarHadiths };

    } catch (error) {
        console.error("Error calling Gemini API for search:", error);
        throw new Error("حدث خطأ أثناء البحث. يرجى المحاولة مرة أخرى.");
    }
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
