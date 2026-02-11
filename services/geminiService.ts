import { GoogleGenAI, Type } from "@google/genai";
import { FortuneData } from "../types";

export const fetchFortune = async (): Promise<FortuneData> => {
  try {
    let apiKey = "";
    try {
      apiKey = process.env.API_KEY || "";
    } catch (envError) {
      console.warn("process is not defined in this environment");
    }

    if (!apiKey) {
      console.warn("API_KEY is missing. Returning fallback card.");
      return getFallbackCard();
    }

    const ai = new GoogleGenAI({ apiKey });

    // 1. Просим ИИ придумать концепт карты и предсказание
    const textResponse = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: "Ты - мистический оракул. Вытяни случайную, уникальную карту оракула (не обязательно классическое Таро, придумай свою). Придумай красивое мистическое название для карты на русском языке и короткое, глубокое предсказание-совет.",
      config: {
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
          contents: `A beautiful mystical oracle tarot card art depicting: ${imagePrompt}. Highly detailed, ethereal, magical vibe, digital painting, fantasy art style. Centered composition. No text, no words on the image.`,
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

// Резервная карта, если ИИ недоступен или нет ключа
function getFallbackCard(): FortuneData {
  return {
    cardName: "Космическое Око",
    text: "Доверься своей интуиции. То, что ты ищешь, уже находится внутри тебя.",
    imageUrl: "" // Без картинки отобразится красивая SVG-заглушка
  };
}
