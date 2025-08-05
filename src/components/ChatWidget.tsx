'use client'

import React, { useState, useRef, useEffect } from 'react'
import { Send, MessageCircle, X, User } from 'lucide-react'
import { Message } from '@/types'

interface ChatWidgetProps {
  customerId?: string
  language?: 'ja' | 'en' | 'zh' | 'auto'
  primaryColor?: string
  botName?: string
  greetingMessage?: string
}

export default function ChatWidget({
  customerId = 'demo',
  language = 'auto',
  primaryColor = '#6366f1',
  botName = 'さくら苑',
  greetingMessage = 'こんにちは！何でもお気軽にご相談ください。😊'
}: ChatWidgetProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [messages, setMessages] = useState<Message[]>([])
  const [inputValue, setInputValue] = useState('')
  const [isTyping, setIsTyping] = useState(false)
  const [detectedLanguage, setDetectedLanguage] = useState<string>('ja')
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const sendMessage = async () => {
    if (!inputValue.trim()) return

    const userMessage = inputValue
    setInputValue('')
    
    const newMessages = [...messages, { role: 'user' as const, content: userMessage }]
    setMessages(newMessages)
    setIsTyping(true)
    
    try {
      const conversationHistory = newMessages.map(msg => ({
        role: msg.role,
        content: msg.content
      }))

      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: userMessage,
          conversationHistory: conversationHistory.slice(0, -1),
          customerId,
          language: language === 'auto' ? undefined : language
        })
      })

      const data = await response.json()

      if (data.success) {
        setMessages(prev => [...prev, { role: 'assistant', content: data.reply }])
        setDetectedLanguage(data.language)
      } else {
        setMessages(prev => [...prev, { role: 'assistant', content: 'エラーが発生しました。' }])
      }
    } catch (error) {
      console.error('Error:', error)
      setMessages(prev => [...prev, { role: 'assistant', content: '接続エラーが発生しました。' }])
    } finally {
      setIsTyping(false)
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault()
      sendMessage()
    }
  }

  const startChat = () => {
    setIsOpen(true)
    if (messages.length === 0) {
      setTimeout(() => {
        setMessages([{ role: 'assistant', content: greetingMessage }])
      }, 500)
    }
  }

  const getLanguageText = () => {
    const texts = {
      ja: { placeholder: 'メッセージを入力してください...', send: '送信', guidance: 'ご質問がある方はこちら ↓' },
      en: { placeholder: 'Type your message...', send: 'Send', guidance: 'Questions? Click here ↓' },
      zh: { placeholder: '请输入您的消息...', send: '发送', guidance: '有问题请点击这里 ↓' }
    }
    return texts[detectedLanguage as keyof typeof texts] || texts.ja
  }

  const text = getLanguageText()

  return (
    <>
      {/* チャットボタン */}
      {!isOpen && (
        <>
          {/* 吹き出し案内 */}
          <div
            className="fixed bottom-28 right-10 bg-white text-gray-700 px-4 py-3 rounded-2xl shadow-lg text-sm font-medium z-[999] border animate-bounce"
          >
            {text.guidance}
          </div>
          
          <button
            onClick={startChat}
            className="fixed bottom-8 right-8 w-16 h-16 rounded-full text-white text-2xl shadow-lg hover:scale-110 transition-all z-[1000]"
            style={{ backgroundColor: primaryColor }}
          >
            💬
          </button>
        </>
      )}

      {/* チャットウィンドウ */}
      {isOpen && (
        <div className="fixed bottom-8 right-8 w-80 h-[600px] bg-black rounded-[30px] shadow-2xl flex flex-col overflow-hidden z-[1000] border-8 border-black">
          {/* ヘッダー */}
          <div
            className="text-white p-6 flex items-center justify-between"
            style={{ background: `linear-gradient(135deg, ${primaryColor} 0%, ${primaryColor}dd 100%)` }}
          >
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-white bg-opacity-20 rounded-full flex items-center justify-center text-2xl">
                🌸
              </div>
              <div>
                <div className="font-bold text-lg">{botName}</div>
                <div className="text-sm opacity-90">相談AI・オンライン</div>
              </div>
            </div>
            <button 
              onClick={() => setIsOpen(false)}
              className="w-8 h-8 bg-white bg-opacity-20 rounded-full flex items-center justify-center hover:bg-opacity-30 transition-colors"
            >
              <X size={16} />
            </button>
          </div>

          {/* メッセージエリア */}
          <div className="flex-1 p-6 overflow-y-auto bg-gray-50 space-y-4">
            {messages.map((message, index) => (
              <div
                key={index}
                className={`flex gap-3 ${message.role === 'user' ? 'flex-row-reverse' : 'flex-row'}`}
              >
                <div className="w-9 h-9 rounded-full flex items-center justify-center text-lg flex-shrink-0"
                     style={{ backgroundColor: message.role === 'user' ? '#e5e7eb' : '#e0e7ff' }}>
                  {message.role === 'user' ? '👤' : '👩‍⚕️'}
                </div>
                <div
                  className={`max-w-[75%] p-4 rounded-2xl text-sm leading-relaxed ${
                    message.role === 'user'
                      ? 'text-white shadow-none'
                      : 'bg-white text-gray-800 shadow-sm'
                  }`}
                  style={{
                    backgroundColor: message.role === 'user' ? primaryColor : undefined,
                    borderRadius: message.role === 'user' ? '20px 20px 4px 20px' : '20px 20px 20px 4px'
                  }}
                >
                  {message.content}
                </div>
              </div>
            ))}
            
            {isTyping && (
              <div className="flex gap-3">
                <div className="w-9 h-9 bg-blue-100 rounded-full flex items-center justify-center text-lg flex-shrink-0">
                  👩‍⚕️
                </div>
                <div className="bg-white p-4 rounded-2xl shadow-sm">
                  <div className="flex gap-1">
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{animationDelay: '0.1s'}}></div>
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* 入力エリア */}
          <div className="p-5 bg-white border-t">
            <div className="flex gap-3">
              <input
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder={text.placeholder}
                className="flex-1 p-4 border-2 border-gray-200 rounded-3xl outline-none focus:border-blue-400 bg-gray-50 text-gray-800"
              />
              <button
                onClick={sendMessage}
                disabled={!inputValue.trim()}
                className="w-12 h-12 rounded-full text-white transition-all flex items-center justify-center disabled:opacity-50"
                style={{ backgroundColor: inputValue.trim() ? primaryColor : '#9ca3af' }}
              >
                <Send size={18} />
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
