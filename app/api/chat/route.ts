import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const { input } = await request.json();

  if (!input) {
    return NextResponse.json({ message: "Input is required" }, { status: 400 });
  }

  try {
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${process.env.GEMINI_API_KEY}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          contents: [
            {
              parts: [{ text: input }],
            },
          ],
        }),
      }
    );

    const data = await response.json();

    if (data.candidates && data.candidates[0] && data.candidates[0].content) {
      return NextResponse.json({
        response: data.candidates[0].content.parts[0].text,
      });
    } else {
      throw new Error("Failed to generate content");
    }
  } catch (error) {
    console.error("Error calling Gemini API:", error);
    return NextResponse.json(
      { message: "Failed to generate AI response" },
      { status: 500 }
    );
  }
}
