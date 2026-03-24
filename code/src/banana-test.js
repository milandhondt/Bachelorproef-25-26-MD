import "dotenv/config";

const res = await fetch("http://localhost:11434/api/generate", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({
    model: process.env.MODEL,
    prompt: "Say banana",
    stream: false,
  }),
});

const data = await res.json();
console.log(data.response);
