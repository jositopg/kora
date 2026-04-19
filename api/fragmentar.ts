import Anthropic from '@anthropic-ai/sdk'
import type { VercelRequest, VercelResponse } from '@vercel/node'

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY })

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  const { texto } = req.body as { texto?: string }
  if (!texto || texto.trim().length < 10) {
    return res.status(400).json({ error: 'Texto demasiado corto' })
  }

  const message = await client.messages.create({
    model: 'claude-haiku-4-5-20251001',
    max_tokens: 1024,
    messages: [
      {
        role: 'user',
        content: `Eres un asistente de psicología. El siguiente texto es el relato personal de alguien describiendo una situación que le preocupa.

Tu tarea es identificar las ideas, preocupaciones o aspectos concretos que la persona menciona. Cada fragmento debe ser una idea completa y con sentido propio, redactada en primera persona tal como la expresa la persona (o muy cerca de cómo lo dice).

Devuelve ÚNICAMENTE un array JSON válido de strings, sin ningún texto adicional, sin markdown, sin explicaciones. Entre 3 y 8 fragmentos.

Texto:
"""
${texto}
"""`,
      },
    ],
  })

  const raw = message.content[0].type === 'text' ? message.content[0].text.trim() : '[]'

  let fragmentos: string[] = []
  try {
    fragmentos = JSON.parse(raw)
    if (!Array.isArray(fragmentos)) fragmentos = []
  } catch {
    fragmentos = []
  }

  return res.status(200).json({ fragmentos })
}
