import { useState } from 'react';
import { MessageCircle, X, Send } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface SimpleChatProps {
  className?: string;
  variant?: 'header' | 'hero';
}

export default function SimpleChat({ className = '', variant = 'header' }: SimpleChatProps) {
  const [open, setOpen] = useState(false);
  const [message, setMessage] = useState('');
  const [response, setResponse] = useState('');
  const [loading, setLoading] = useState(false);

  const sendMessage = async () => {
    if (!message.trim() || loading) return;
    
    setLoading(true);
    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message })
      });
      const data = await res.json();
      setResponse(data.response);
    } catch {
      setResponse("I'm offline right now. Please call us at (949) 734-0201!");
    }
    setLoading(false);
  };

  if (!open) {
    return (
      <div className={className}>
        <button
          onClick={() => setOpen(true)}
          className={
            variant === 'hero'
              ? 'group inline-flex items-center gap-2 text-white/90 hover:text-white transition'
              : 'group inline-flex items-center gap-2 text-gray-600 hover:text-[#FFB375] transition-colors duration-200'
          }
        >
          <MessageCircle className="w-4 h-4" />
          <span className="text-sm font-medium">Ask Ian</span>
        </button>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-md" onClick={() => setOpen(false)}>
      <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4 shadow-xl" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-800">Ask Ian</h3>
          <Button variant="ghost" size="icon" onClick={() => setOpen(false)}>
            <X className="w-4 h-4" />
          </Button>
        </div>
        
        <div className="space-y-4">
          <div>
            <input
              type="text"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && sendMessage()}
              placeholder="Ask about services, pricing..."
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#FFB375]"
              disabled={loading}
            />
            <Button 
              onClick={sendMessage} 
              disabled={!message.trim() || loading}
              className="w-full mt-2 bg-[#FFB375] hover:bg-[#EE432C] text-white"
            >
              {loading ? 'Asking...' : (
                <>
                  <Send className="w-4 h-4 mr-2" />
                  Ask Ian
                </>
              )}
            </Button>
          </div>
          
          {response && (
            <div className="p-3 bg-gray-50 rounded-md">
              <p className="text-gray-700 text-sm">{response}</p>
            </div>
          )}
          
          <div className="flex gap-2 text-xs">
            <button 
              onClick={() => {setMessage("What's the cost of paint correction?"); sendMessage();}}
              className="px-2 py-1 bg-gray-100 rounded text-gray-600 hover:bg-gray-200"
            >
              Pricing
            </button>
            <button 
              onClick={() => {setMessage("What areas do you serve?"); sendMessage();}}
              className="px-2 py-1 bg-gray-100 rounded text-gray-600 hover:bg-gray-200"
            >
              Service Areas
            </button>
            <button 
              onClick={() => {setMessage("How do I book?"); sendMessage();}}
              className="px-2 py-1 bg-gray-100 rounded text-gray-600 hover:bg-gray-200"
            >
              Booking
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}