import { NextRequest, NextResponse } from 'next/server'
import OpenAI from 'openai'

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
})

// 言語検出関数
function detectLanguage(text: string): 'ja' | 'en' | 'zh' {
  const japanese = /[\u3040-\u309F\u30A0-\u30FF\u4E00-\u9FAF]/
  const chinese = /[\u4E00-\u9FFF]/
  const english = /^[a-zA-Z\s.,!?'"()-]+$/

  if (japanese.test(text)) return 'ja'
  if (chinese.test(text) && !japanese.test(text)) return 'zh'
  if (english.test(text)) return 'en'
  return 'ja' // デフォルト
}

// 言語別システムプロンプト
const getSystemPrompt = (language: string, industry: string = 'healthcare') => {
  const prompts = {
    ja: `あなたは介護施設の優秀な営業担当者です。
【重要】短く簡潔に、1回の返答は2-3行以内で応答してください。

以下の営業スキルを使って、相談者に寄り添いながら自然にサービスを提案してください：
1. 共感・傾聴: 相談者の悩みに共感し、労いの言葉をかける
2. 課題発掘: 潜在的な困りごとを質問で引き出す
3. 提案: 相談者の状況に最適なサービスを提案
4. クロージング: 見学予約や資料請求に自然に誘導

温かく親身になって対応してください。`,

    en: `You are an excellent sales representative for a care facility.
【IMPORTANT】Keep responses short and concise, 2-3 lines maximum.

Use the following sales skills to naturally propose services while empathizing with consultants:
1. Empathy & Listening: Show empathy for their concerns and offer words of encouragement
2. Needs Discovery: Ask questions to uncover potential problems
3. Proposal: Suggest optimal services based on their situation
4. Closing: Naturally guide them to facility tours or information requests

Please respond warmly and sincerely.`,

    zh: `您是护理机构的优秀销售代表。
【重要】请保持回复简短明了，每次回复最多2-3行。

请使用以下销售技巧，在共情咨询者的同时自然地提出服务建议：
1. 共情倾听：对他们的担忧表示同情并给予鼓励
2. 需求发掘：通过提问发现潜在问题
3. 方案提议：根据他们的情况建议最佳服务
4. 促成交易：自然引导至设施参观或资料申请

请温暖真诚地回应。`
  }

  return prompts[language as keyof typeof prompts] || prompts.ja
}

export async function POST(request: NextRequest) {
  try {
    const { message, conversationHistory = [], customerId, language } = await request.json()

    // 言語検出または指定言語使用
    const detectedLanguage = language || detectLanguage(message)

    // システムプロンプト生成
    const systemPrompt = getSystemPrompt(detectedLanguage)

    const messages = [
      { role: 'system', content: systemPrompt },
      ...conversationHistory,
      { role: 'user', content: message }
    ]

    const completion = await openai.chat.completions.create({
      model: 'gpt-4',
      messages: messages,
      max_tokens: 150,
      temperature: 0.7,
    })

    const reply = completion.choices[0].message.content

    return NextResponse.json({
      success: true,
      reply: reply,
      language: detectedLanguage,
      usage: completion.usage
    })

  } catch (error) {
    console.error('OpenAI API Error:', error)
    return NextResponse.json({
      success: false,
      error: 'AIとの通信でエラーが発生しました'
    }, { status: 500 })
  }
}
