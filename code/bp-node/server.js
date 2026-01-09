import "dotenv/config";
import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

const response = await openai.responses.create({
  model: "gpt-5-nano",
  input: "output 'banana' if this is working",
});

console.log(response.output_text);
