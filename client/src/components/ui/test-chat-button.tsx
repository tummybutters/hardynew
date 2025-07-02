import { MessageCircle } from 'lucide-react';

export default function TestChatButton() {
  return (
    <button 
      onClick={() => alert('Chat test working!')} 
      className="inline-flex items-center gap-2 text-gray-600 hover:text-[#FFB375] transition-colors duration-200"
    >
      <MessageCircle className="w-4 h-4" />
      <span className="text-sm font-medium">Test Chat</span>
    </button>
  );
}