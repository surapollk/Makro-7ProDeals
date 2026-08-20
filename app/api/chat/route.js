
import { NextResponse } from "next/server";

export async function POST(req) {
  try {
    const { messages } = await req.json();

    const apiKey = "sk_Nm8Kr9eqnsJKFIsw1fxyPFsAr7lVCn69nNK24uzUaGeW91g0asKqoWDdZp7fTg0W";
    const baseUrl = "https://gen.ai.kku.ac.th/okmd/api/v1/chat/completions";

    const response = await fetch(baseUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${apiKey}`
      },
      body: JSON.stringify({
        model: "gemini-3.7-flash",
        messages: messages,
        temperature: 0.7,
        max_tokens: 1000,
      })
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("OKMD API Error:", errorText);
      return NextResponse.json({ error: "Failed to fetch from OKMD AI" }, { status: response.status });
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error("Chat API Error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

