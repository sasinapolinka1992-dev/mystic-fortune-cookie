import { GoogleGenAI, Type } from "@google/genai";
import { FortuneData } from "../types";

// Темы для направления мысли нейросети, чтобы карты всегда были разными
const MYSTIC_THEMES = [
  "Внутренняя сила и скрытые таланты",
  "Неожиданные перемены и новые пути",
  "Гармония с природой и космосом",
  "Секреты прошлого и их влияние на будущее",
  "Любовь, тепло и человеческие связи",
  "Преодоление страхов и иллюзий",
  "Время, терпение и циклы жизни",
  "Магия повседневности и знаки судьбы",
  "Интуиция, сны и подсознание"
];

// Массив резервных карт на случай, если API не ответит
const FALLBACK_CARDS: FortuneData[] = [
  { cardName: "Космическое Око", text: "Доверься своей интуиции. То, что ты ищешь, уже находится внутри тебя.", imageUrl: "" },
  { cardName: "Шепот Звезд", text: "Скоро произойдет неожиданная встреча, которая осветит твой дальнейший путь.", imageUrl: "" },
  { cardName: "Лунная Тропа", text: "Не бойся темноты. Именно в моменты неопределенности рождаются самые яркие идеи.", imageUrl: "" },
  { cardName: "Золотой Лотос", text: "Время расцвета близко. Сохраняй спокойствие, дыши глубоко и продолжай свой труд.", imageUrl: "" },
  { cardName: "Песочные Часы", text: "Не торопи события. Всему свое время, и твой звездный час уже на подходе.", imageUrl: "" },
  { cardName: "Зеркало Истины", text: "Загляни в себя без страха. Твоя главная сила скрывается там, где ты привык видеть слабость.", imageUrl: "" },
  { cardName: "Танец Ветров", text: "Отпусти контроль. Позволь потоку жизни унести тебя туда, где ты должен быть прямо сейчас.", imageUrl: "" }
];

export const fetchFortune = async (): Promise<FortuneData> => {
  try {
    let apiKey = "";
    try {
      apiKey = process.env.API_KEY || "";
    } catch (envError) {
      console.warn("process is not defined in this environment");
    }

    if (!apiKey) {
      console.warn("API_KEY is missing. Returning random fallback card.");
      return getFallbackCard();
    }

    const ai = new GoogleGenAI({ apiKey });

    // Выбираем случайную тему и генерируем уникальный seed, чтобы избежать кэширования и повторов
    const randomTheme = MYSTIC_THEMES[Math.floor(Math.random() * MYSTIC_THEMES.length)];
    const randomSeed = Math.floor(Math.random() * 1000000);

    const prompt = `Ты - мистический оракул. Вытяни случайную, абсолютно уникальную карту оракула (не классическое Таро, придумай свою собственную). 
Сфокусируй предсказание на теме: "${randomTheme}". 
Придумай красивое мистическое название для карты на русском языке и короткое, глубокое предсказание-совет. Убедись, что эта генерация уникальна (Random Seed: ${randomSeed}).`;

    // 1. Просим ИИ придумать концепт карты и предсказание
    const textResponse = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: prompt,
      config: {
        temperature: 1.2, // Повышаем креативность и вариативность
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            cardName: { type: Type.STRING, description: "Название карты на русском, например 'Светящийся Лотос' или 'Лунная Сова'" },
            text: { type: Type.STRING, description: "Короткое, красивое мистическое предсказание на русском языке" },
            imagePrompt: { type: Type.STRING, description: "Detailed visual description of the card for an image generator, in English. Magical vibe, highly detailed digital painting, ethereal, fantasy art style." }
          },
          required: ["cardName", "text", "imagePrompt"]
        }
      }
    });

    // Безопасный парсинг JSON (на случай если ИИ обернет его в ```json)
    let cleanText = textResponse.text || "{}";
    cleanText = cleanText.replace(/```json/gi, '').replace(/```/g, '').trim();
    
    let parsed: any = {};
    try {
      parsed = JSON.parse(cleanText);
    } catch (parseError) {
      console.error("Failed to parse Gemini text:", parseError);
      return getFallbackCard();
    }

    const { cardName, text, imagePrompt } = parsed;

    // 2. Генерируем изображение на основе концепта
    let imageUrl = "";
    if (imagePrompt) {
      try {
        const imageResponse = await ai.models.generateContent({
          model: 'gemini-2.5-flash-image',
          contents: `A beautiful mystical oracle tarot card art depicting: ${imagePrompt}. Highly detailed, ethereal, magical vibe, digital painting, fantasy art style. Centered composition. No text, no words on the image. (Seed: ${randomSeed})`,
          config: {
            imageConfig: { aspectRatio: "3:4" }
          }
        });

        // Ищем часть с картинкой в ответе
        for (const part of imageResponse.candidates?.[0]?.content?.parts || []) {
          if (part.inlineData) {
            imageUrl = `data:${part.inlineData.mimeType};base64,${part.inlineData.data}`;
            break;
          }
        }
      } catch (imgError) {
        console.error("Image generation failed:", imgError);
        // Если картинка не сгенерировалась, не ломаем приложение, просто не будет картинки
      }
    }

    return {
      cardName: cardName || "Таинственная Карта",
      text: text || "Звезды молчат, но твой путь ясен.",
      imageUrl: imageUrl
    };

  } catch (error) {
    console.error("Gemini API Error:", error);
    return getFallbackCard();
  }
};

// Резервная карта, если ИИ недоступен или нет ключа (теперь выдает случайную из списка!)
function getFallbackCard(): FortuneData {
  const randomIndex = Math.floor(Math.random() * FALLBACK_CARDS.length);
  return FALLBACK_CARDS[randomIndex];
}
