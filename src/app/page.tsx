import ChatWidget from '@/components/ChatWidget'

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-green-50">
      {/* デモサイト */}
      <div className="max-w-4xl mx-auto p-8">
        <h1 className="text-4xl font-bold text-gray-800 mb-4">
          営業AIチャットボット デモ
        </h1>
        <p className="text-gray-600 text-lg mb-8">
          右下のチャットボタンをクリックして、多言語対応営業AIを体験してください
        </p>
        
        <div className="grid md:grid-cols-2 gap-8">
          <div className="bg-white p-6 rounded-lg shadow-sm">
            <h2 className="text-xl font-semibold mb-4">🇯🇵 日本語でお試し</h2>
            <p className="text-gray-600">「母の介護で困っています」と入力してみてください</p>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow-sm">
            <h2 className="text-xl font-semibold mb-4">🇺🇸 Try in English</h2>
            <p className="text-gray-600">Type "I need help with elderly care" and see the magic</p>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow-sm">
            <h2 className="text-xl font-semibold mb-4">🇨🇳 中文测试</h2>
            <p className="text-gray-600">输入"我需要养老院的帮助"来体验</p>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow-sm">
            <h2 className="text-xl font-semibold mb-4">⚡ 特徴</h2>
            <ul className="text-gray-600 space-y-2">
              <li>• 自動言語検出</li>
              <li>• GPT-4搭載営業AI</li>
              <li>• 業界特化プロンプト</li>
              <li>• 埋め込み対応</li>
            </ul>
          </div>
        </div>
      </div>

      {/* チャットウィジェット */}
      <ChatWidget
        customerId="demo"
        language="auto"
        primaryColor="#6366f1"
        botName="さくら苑"
        greetingMessage="こんにちは！介護のことでお困りではありませんか？😊"
      />
    </div>
  )
}
