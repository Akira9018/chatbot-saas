import ChatWidget from '@/components/ChatWidget'

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-green-50">
      <div className="max-w-4xl mx-auto p-8">
        <h1 className="text-4xl font-bold text-gray-800 mb-4">
          AI Chatbot Demo
        </h1>
        <p className="text-gray-600 text-lg mb-8">
          Click the chat button in the bottom right to experience our multilingual sales AI
        </p>
        
        <div className="grid md:grid-cols-2 gap-8">
          <div className="bg-white p-6 rounded-lg shadow-sm">
            <h2 className="text-xl font-semibold mb-4">🇯🇵 Japanese Test</h2>
            <p className="text-gray-600">Try: I need help with elderly care</p>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow-sm">
            <h2 className="text-xl font-semibold mb-4">🇺🇸 English Test</h2>
            <p className="text-gray-600">Type: I need help with elderly care</p>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow-sm">
            <h2 className="text-xl font-semibold mb-4">🇨🇳 Chinese Test</h2>
            <p className="text-gray-600">Type: I need help with elderly care</p>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow-sm">
            <h2 className="text-xl font-semibold mb-4">⚡ Features</h2>
            <ul className="text-gray-600 space-y-2">
              <li>• Auto language detection</li>
              <li>• GPT-4 powered sales AI</li>
              <li>• Industry-specific prompts</li>
              <li>• Embeddable widget</li>
            </ul>
          </div>
        </div>
      </div>

      <ChatWidget
        customerId="demo"
        language="auto"
        primaryColor="#6366f1"
        botName="Care Bot"
        greetingMessage="Hello! How can I help you with care services today?"
      />
    </div>
  )
}
