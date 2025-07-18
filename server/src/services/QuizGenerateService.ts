import axios from "axios";
export const generateQuiz = async (text: string) => {
  const apiUrl: string | undefined = process.env.OPEN_ROUTER_BASE_URL;
  const apiKey: string | undefined = process.env.OPEN_ROUTER_API_KEY;
  const aiModel: string | undefined = process.env.AI_MODEL;

  if (!apiUrl || !aiModel || !apiKey) {
    return null;
  }
  const reqBody = {
    model: aiModel,
    messages: [
      {
        role: "user",
        content: `
                command: From the given text, create multiple-choice questions. Respond with a valid JSON object only. Do not include any explanation, markdown, or extra text of any kind. The response must start and end with a raw JSON object — nothing else.

The JSON structure must be:
{
  "questions": [
    {
      "id": "number"
      "question": "string",
      "choices": ["string", "string", "string", "string"],
      "answer": number (0 to 3, index of correct choice)
    },
    ...
  ]
}.
                text: ${text}.`,
      },
    ],
  };
  const response = await axios.post(apiUrl, reqBody, {
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
  });
  return response.data.choices[0].message.content || null;
};
