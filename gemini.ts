import { GoogleGenAI } from "@google/genai";
import type { Hadith, CategorizedResult } from './types';
import { SearchMode } from './types';
import { HADITH_DATA } from './data';

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || '' });

export const searchViaGemini = async (query: string): Promise<string> => {
    console.log(`Gemini search for: "${query}"`);
    
    const systemInstruction = `أنت خبير متخصص في علوم الحديث النبوي ومحقق حديثي رقمي دقيق. مهمتك هي تزويد المستخدم بنتائج دقيقة وموثقة 100% عند استلام أي استعلام عن حديث نبوي عبر زر 'البحث عبر النت'.

قاعدة صارمة جداً: يجب أن تعتمد في بحثك وتخريجك وأحكامك حصراً على المصادر التالية: (موقع الدرر السنية dorar.net، قسم الحديث في إسلام ويب islamweb.net، المكتبة الشاملة، وجامع خادم الحرمين للسنة النبوية). يُمنع منعاً باتاً التأليف، أو استنتاج أحكام من تلقاء نفسك، أو النقل من منتديات ومواقع غير متخصصة.

عند استلام أي طلب بحث عن حديث، يجب أن يكون الإخراج النهائي ثابتاً وملتزماً بالهيكلية التالية حرفياً، مع ذكر اسم المصدر الذي نقلت منه بجانب كل معلومة:

أ/ نص الحديث:
[اكتب نص الحديث كاملاً ومضبوطاً بالشكل قدر الإمكان بناءً على المصادر].

ب/ التخريج:
[اذكر من أخرج الحديث في كتب السنة المعتبرة مع ذكر اسم الكتاب، مثل: أخرجه البخاري (رقم)، ومسلم (رقم)، والترمذي (رقم)].

ج/ الراوي الأعلى:
[اذكر اسم الصحابي راوي الحديث، مثلاً: أبو هريرة رضي الله عنه].

د/ الحكم على الحديث:

من قَبِل الحديث: [اذكر أسماء العلماء الذين صححوا أو حسنوا الحديث + خلاصة رأيهم بالنص، مثلاً: الألباني: (صحيح)].

من رد الحديث: [اذكر أسماء العلماء الذين ضعفوا أو حكموا بوضع الحديث + خلاصة رأيهم بالنص، مثلاً: ابن الجوزي: (موضوع)].

عبارات أخرى: [اذكر العلماء الذين لهم عبارات غير واضحة في القبول أو الرد + خلاصة رأيهم بالنص، مثلاً: أبو حاتم الرازي: (منكر الحديث)، أو الإمام أحمد: (فيه لين)].

هـ/ الأحاديث المشابهة:
[ابحث عن حديث أو حديثين يشابهان الحديث المبحوث عنه في المعنى المطلوب. يجب أن تطبق على كل حديث مشابه نفس الهيكلية السابقة تماماً كما يلي]:

الحديث المشابه الأول:
أ/ نص الحديث: [النص]
ب/ التخريج: [من أخرجه]
ج/ الراوي الأعلى: [اسم الراوي]
د/ الحكم على الحديث: 
- من قَبِل الحديث: [الأسماء والنص]
- من رد الحديث: [الأسماء والنص]
- عبارات أخرى: [الأسماء والنص]

ملاحظة أخيرة لك كنموذج ذكاء اصطناعي: إذا لم تعثر على الحديث في المصادر المحددة أو لم تجد أحكاماً صريحة للعلماء، يجب أن تقول بوضوح: 'لم أقف على هذا الحديث أو هذا الحكم في المصادر المعتمدة'، ولا تقم بتوليد أي معلومات غير موثقة.`;

    try {
        const response = await ai.models.generateContent({
            model: "gemini-3-flash-preview",
            contents: query,
            config: {
                systemInstruction: systemInstruction,
            }
        });
        
        return response.text || "لم يتم العثور على نتائج.";
    } catch (error) {
        console.error("Gemini API Error:", error);
        throw new Error("حدث خطأ أثناء الاتصال بالذكاء الاصطناعي. يرجى المحاولة لاحقاً.");
    }
};

/**
 * وظيفة لتطبيع النص العربي (إزالة التشكيل، توحيد الهمزات، إزالة علامات الترقيم)
 */
const normalizeArabic = (text: string): string => {
    return text
        .replace(/[\u064B-\u065F]/g, "") // إزالة التشكيل
        .replace(/[أإآ]/g, "ا") // توحيد الألف
        .replace(/ة/g, "ه") // توحيد التاء المربوطة
        .replace(/ى/g, "ي") // توحيد الألف المقصورة
        .replace(/[^\u0621-\u064A\s\d]/g, "") // إزالة علامات الترقيم والرموز غير العربية
        .replace(/\s+/g, " ") // توحيد المسافات
        .trim();
};

export const parseHadithData = (): Hadith[] => {
    console.log("Parsing Hadith data...");
    
    // تنظيف البيانات من أرقام الصفحات التي قد تعيق التعبير النمطي
    const cleanedData = HADITH_DATA.replace(/\[ص:\d+\]/g, '');
    
    const hadiths: Hadith[] = [];
    const seenIds = new Set<number>();
    
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
            const [, idStr, text, info] = headerMatch;
            const id = parseInt(idStr, 10);

            // تخطي إذا كان المعرف مكرراً
            if (seenIds.has(id)) {
                console.warn(`Duplicate Hadith ID found and skipped: ${id}`);
                continue;
            }
            seenIds.add(id);

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
                id: id,
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

export const searchHadiths = async (query: string, allHadiths: Hadith[], mode: SearchMode = SearchMode.SIMILAR) => {
    console.log(`Local search [${mode}] for: "${query}"`);
    
    const normalizedQuery = normalizeArabic(query);
    if (!normalizedQuery) return { results: [], totalCount: 0 };

    const queryWords = normalizedQuery.split(/\s+/).filter(word => word.length > 1);

    let results: Hadith[] = [];

    if (mode === SearchMode.EXACT) {
        // تطابق تام: النص يحتوي على الجملة كاملة كما هي
        results = allHadiths.filter(hadith => {
            const normalizedText = normalizeArabic(hadith.text);
            // البحث عن الجملة كاملة
            return normalizedText.includes(normalizedQuery);
        });
    } else if (mode === SearchMode.ALL_WORDS) {
        // تطابق جميع الكلمات: يجب أن يحتوي النص على كل كلمة في الاستعلام
        results = allHadiths.filter(hadith => {
            const normalizedText = normalizeArabic(hadith.text);
            return queryWords.every(word => normalizedText.includes(word));
        });
    } else {
        // بحث مشابه: حساب قوة التطابق
        const scoredHadiths = allHadiths.map(hadith => {
            let score = 0;
            const normalizedText = normalizeArabic(hadith.text);
            
            // تطابق كامل مع النص (أولوية قصوى)
            if (normalizedText.includes(normalizedQuery)) {
                score += 100;
            }
            
            // تطابق الكلمات الفردية
            let matchedWordsCount = 0;
            queryWords.forEach(word => {
                if (normalizedText.includes(word)) {
                    score += 20;
                    matchedWordsCount++;
                }
            });

            return { hadith, score, matchedWordsCount };
        });

        results = scoredHadiths
            .filter(item => {
                // إذا وجدنا الجملة كاملة، نقبلها فوراً
                if (item.score >= 100) return true;
                
                // إذا كان البحث من كلمة واحدة، يجب أن تطابق الكلمة
                if (queryWords.length <= 1) return item.matchedWordsCount > 0;
                
                // للبحث المتعدد الكلمات: يجب أن يطابق على الأقل كلمتين أو نصف الكلمات (أيهما أكبر)
                // لضمان عدم ظهور نتائج غير ذات صلة
                const minRequired = Math.max(2, Math.ceil(queryWords.length / 2));
                return item.matchedWordsCount >= minRequired;
            })
            .sort((a, b) => b.score - a.score)
            .map(item => item.hadith);
    }

    if (results.length === 0) {
        throw new Error("لم يتم العثور على أحاديث مطابقة لبحثك في هذا الوضع.");
    }

    return { 
        results: results, 
        totalCount: results.length 
    };
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
