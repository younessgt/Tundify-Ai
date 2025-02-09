const catchAsync = require("../utils/catchAsync");
const AppError = require("../utils/appError");
const { GoogleGenerativeAI } = require("@google/generative-ai");
const { text } = require("express");

exports.geminiTranslate = catchAsync(async (req, resp, next) => {
  let { targetLanguage, transcription } = req.body;

  if (!targetLanguage || !transcription) {
    return next(
      new AppError("Please provide target language and transcription")
    );
  }

  if (targetLanguage) {
    switch (targetLanguage) {
      case "en":
        targetLanguage = "english";
        break;
      case "fr":
        targetLanguage = "french";
        break;
      case "es":
        targetLanguage = "spanish";
        break;

      case "ary":
        targetLanguage = "Moroccan Darija";
        break;
      default:
        targetLanguage = "english";
    }
  }
  const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

  const model = genAI.getGenerativeModel({
    model: "gemini-1.5-flash",
    systemInstruction:
      "You are the best translator in the world. Your task is to translate the given text accurately and precisely, without adding, omitting, or modifying any information beyond the translation itself",
  });

  const prompt = `Translate this :${transcription} to ${targetLanguage}`;
  const result = await model.generateContent(prompt);
  console.log(result.response.text());
  resp.status(200).json({
    status: "success",
    text: result.response.text(),
  });
});
