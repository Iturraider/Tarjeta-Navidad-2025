
import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });

export const generateChristmasWish = async (lang: 'ca' | 'es') => {
  const prompt = lang === 'ca' 
    ? "Escriu una breu i bonica felicitació de Nadal i Reis en català de part de la família Iturralde Matencio (formada per Javi, Salut, Arlet, Enzo i el bebè que ve en camí). Ha de fer referència al naixement del nen Jesús i a la il·lusió dels Reis Mags. Ha de ser càlida, festiva i poètica. Màxim 3 frases."
    : "Escribe una breve y bonita felicitación de Navidad y Reyes en castellano de parte de la familia Iturralde Matencio (formada por por Javi, Salut, Arlet, Enzo y el bebé que viene en camino). Debe hacer referencia al nacimiento del niño Jesús y a la ilusión de los Reyes Magos. Debe ser cálida, festiva y poética. Máximo 3 frases.";

  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: prompt,
      config: {
        temperature: 0.8,
        topP: 0.9,
      }
    });
    
    const fallback = lang === 'ca'
      ? "Que la llum de l'estel d'Orient i la joia del naixement del nen Jesús omplin els vostres cors. Molt bon Nadal i feliços Reis de part de tota la família!"
      : "Que la luz de la estrella de Oriente y la alegría del nacimiento del niño Jesús llenen vuestros corazones. ¡Feliz Navidad y felices Reyes de parte de toda la familia!";

    return response.text || fallback;
  } catch (error) {
    console.error("Error generating wish with Gemini API");
    return lang === 'ca' 
      ? "Que aquest Nadal la màgia del pessebre i la il·lusió dels Reis Mags ens uneixi a tots. Amb tot el nostre afecte, família Iturralde Matencio."
      : "Que esta Navidad la magia del pesebre y la ilusión de los Reyes Magos nos una a todos. Con todo nuestro afecto, familia Iturralde Matencio.";
  }
};
