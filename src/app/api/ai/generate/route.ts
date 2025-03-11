import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import OpenAI from 'openai'

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
})

export async function POST(request: Request) {
  const session = await getServerSession()

  if (!session) {
    return new NextResponse("Unauthorized", { status: 401 })
  }

  try {
    const { prompt } = await request.json()

    const completion = await openai.chat.completions.create({
      model: "gpt-4-turbo-preview",
      messages: [
        {
          role: "system",
          content: `You are a process flow diagram generator. Given a prompt, generate a diagram in the following JSON format:
          {
            "nodes": [
              {
                "id": "string",
                "type": "rectangle|diamond|circle|sticky",
                "position": { "x": number, "y": number },
                "data": { "label": "string" }
              }
            ],
            "edges": [
              {
                "id": "string",
                "source": "node_id",
                "target": "node_id"
              }
            ]
          }
          
          Rules:
          1. Position nodes in a logical flow (top to bottom, left to right)
          2. Space nodes at least 150px apart
          3. Use appropriate shapes:
             - Rectangle: for processes/actions
             - Diamond: for decisions
             - Circle: for start/end points
             - Sticky: for notes/descriptions
          4. Create meaningful connections between nodes
          5. Keep labels concise and clear`
        },
        {
          role: "user",
          content: prompt
        }
      ],
      temperature: 0.7,
      response_format: { type: "json_object" }
    })

    const content = completion.choices[0].message.content
    if (!content) {
      throw new Error("No content generated")
    }

    const generatedDiagram = JSON.parse(content)
    return NextResponse.json(generatedDiagram)
  } catch (error) {
    console.error("Error generating diagram:", error)
    return new NextResponse("Error generating diagram", { status: 500 })
  }
} 