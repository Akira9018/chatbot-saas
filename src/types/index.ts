export interface Customer {
  id: string
  company_name: string
  industry: string
  website_url?: string
  contact_email: string
  created_at: string
  updated_at: string
}

export interface ChatbotConfig {
  id: string
  customer_id: string
  bot_name: string
  primary_color: string
  language: 'ja' | 'en' | 'zh'
  auto_detect_language: boolean
  greeting_message: string
  created_at: string
  updated_at: string
}

export interface Conversation {
  id: string
  customer_id: string
  user_message: string
  bot_response: string
  language: string
  created_at: string
}

export interface Message {
  role: 'user' | 'assistant'
  content: string
}
