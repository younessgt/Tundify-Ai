import axios from "axios";

const GEMINI_ENDPOINT = `${process.env.NEXT_PUBLIC_API_ENDPOINT}/gemini/translate`;

export const geminiTranslate = async (
  targetLanguage,
  transcription,
  accessToken
) => {
  let response;
  try {
    response = await axios.post(
      GEMINI_ENDPOINT,
      {
        targetLanguage,
        transcription,
      },
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
        withCredentials: true,
      }
    );
  } catch (error) {
    console.log("gemini", error);
    throw new Error(error);
  }

  return response.data.text;
};
