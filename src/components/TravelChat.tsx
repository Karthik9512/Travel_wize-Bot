import React, { useState, useRef, useEffect } from 'react';
import { Button } from './ui/button-variants';
import { Input } from './ui/input';
import { Card } from './ui/card';
import { useToast } from '@/hooks/use-toast';
import { Send, MapPin, Calendar, Users, DollarSign, Heart } from 'lucide-react';

interface Message {
  id: string;
  content: string;
  isUser: boolean;
  timestamp: Date;
}

interface TripDetails {
  destination?: string;
  dates?: string;
  travelers?: number;
  budget?: string;
  style?: string;
  preferences?: string[];
}

const CONVERSATION_STEPS = [
  'greeting',
  'destination',
  'dates', 
  'travelers',
  'budget',
  'style',
  'preferences',
  'itinerary'
] as const;

type ConversationStep = typeof CONVERSATION_STEPS[number];

export const TravelChat: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      content: "Hi 👋, I'm your AI Travel Planner! Let's plan your perfect trip. May I know your destination and travel dates?",
      isUser: false,
      timestamp: new Date()
    }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [currentStep, setCurrentStep] = useState<ConversationStep>('destination');
  const [tripDetails, setTripDetails] = useState<TripDetails>({});
  const [webhookUrl, setWebhookUrl] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const addMessage = (content: string, isUser: boolean) => {
    const newMessage: Message = {
      id: Date.now().toString(),
      content,
      isUser,
      timestamp: new Date()
    };
    setMessages(prev => [...prev, newMessage]);
  };

  const getAIResponse = (userInput: string, step: ConversationStep): string => {
    const responses = {
      destination: `Great choice! Now, when are you planning to travel? Please share your travel dates.`,
      dates: `Perfect! How many travelers will be joining this adventure?`,
      travelers: `Wonderful! What's your approximate budget for this trip? (e.g., $1000-2000, luxury, budget-friendly)`,
      budget: `Excellent! What's your travel style? (adventure, relaxation, culture, family, solo, luxury, etc.)`,
      style: `Amazing! Any specific preferences? (beaches, mountains, city, historical, food, nightlife, shopping, etc.)`,
      preferences: `Perfect! I'm now creating your personalized itinerary. Let me put together the perfect travel plan for you! ✈️`,
      itinerary: generateItinerary()
    };
    
    return responses[step] || "I'm here to help you plan your perfect trip!";
  };

  const generateItinerary = (): string => {
    const { destination, dates, travelers, budget, style, preferences } = tripDetails;
    
    return `🎉 Here's your personalized travel itinerary for ${destination}!

**Trip Overview:**
📍 Destination: ${destination}
📅 Dates: ${dates}
👥 Travelers: ${travelers} ${travelers === 1 ? 'person' : 'people'}
💰 Budget: ${budget}
🎯 Style: ${style}

**Day 1: Arrival & City Exploration**
• Arrive and check into your accommodation
• Explore the main city center and local markets
• Try authentic local cuisine for dinner

**Day 2: Cultural Discovery**
• Visit historical landmarks and museums
• Local cultural experiences and guided tours
• Sunset viewing at popular scenic spots

**Day 3: Adventure & Nature**
• Outdoor activities based on your preferences
• Nature excursions or beach time
• Local food experiences and cooking classes

**Recommendations:**
🏨 **Accommodation:** Mid-range hotels with great reviews
🚗 **Transport:** Local public transport + ride-sharing
🍜 **Must-try Food:** Local specialties and hidden gem restaurants
💡 **Tips:** Best times to visit attractions, local customs

Would you like me to save this itinerary and send it to your email? Just provide your webhook URL for data storage!`;
  };

  const updateTripDetails = (userInput: string, step: ConversationStep) => {
    const updates: Partial<TripDetails> = {};
    
    switch (step) {
      case 'destination':
        updates.destination = userInput;
        break;
      case 'dates':
        updates.dates = userInput;
        break;
      case 'travelers':
        updates.travelers = parseInt(userInput) || 1;
        break;
      case 'budget':
        updates.budget = userInput;
        break;
      case 'style':
        updates.style = userInput;
        break;
      case 'preferences':
        updates.preferences = userInput.split(',').map(p => p.trim());
        break;
    }
    
    setTripDetails(prev => ({ ...prev, ...updates }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userMessage = input.trim();
    addMessage(userMessage, true);
    setInput('');
    setIsLoading(true);

    // Update trip details based on current step
    updateTripDetails(userMessage, currentStep);

    // Get next step
    const currentIndex = CONVERSATION_STEPS.indexOf(currentStep);
    const nextStep = CONVERSATION_STEPS[currentIndex + 1] || 'itinerary';
    
    setTimeout(() => {
      const aiResponse = getAIResponse(userMessage, nextStep);
      addMessage(aiResponse, false);
      setCurrentStep(nextStep);
      setIsLoading(false);

      // If we've completed the itinerary, trigger webhook
      if (nextStep === 'itinerary') {
        handleWebhookSubmission();
      }
    }, 1000);
  };

  const handleWebhookSubmission = async () => {
    if (!webhookUrl) return;

    try {
      const response = await fetch(webhookUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        mode: 'no-cors',
        body: JSON.stringify({
          tripDetails,
          timestamp: new Date().toISOString(),
          source: 'TravelWize AI'
        }),
      });

      toast({
        title: "Trip Saved! 🎉",
        description: "Your travel plan has been saved and will be emailed to you shortly.",
      });
    } catch (error) {
      console.error('Error sending to webhook:', error);
      toast({
        title: "Note",
        description: "Trip details collected. Please check your webhook configuration.",
        variant: "destructive",
      });
    }
  };

  const getStepIcon = (step: ConversationStep) => {
    const icons = {
      greeting: <Heart className="w-4 h-4" />,
      destination: <MapPin className="w-4 h-4" />,
      dates: <Calendar className="w-4 h-4" />,
      travelers: <Users className="w-4 h-4" />,
      budget: <DollarSign className="w-4 h-4" />,
      style: <Heart className="w-4 h-4" />,
      preferences: <Heart className="w-4 h-4" />,
      itinerary: <MapPin className="w-4 h-4" />
    };
    return icons[step];
  };

  return (
    <div className="flex flex-col h-full max-w-4xl mx-auto">
      {/* Chat Header */}
      <div className="bg-gradient-hero p-4 rounded-t-xl">
        <div className="flex items-center gap-3">
          <div className="bg-white/20 p-2 rounded-full">
            {getStepIcon(currentStep)}
          </div>
          <div>
            <h3 className="text-white font-semibold">TravelWize AI</h3>
            <p className="text-white/80 text-sm">Your Personal Travel Assistant</p>
          </div>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-white/50 backdrop-blur-sm">
        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex ${message.isUser ? 'justify-end' : 'justify-start'} animate-fade-in`}
          >
            <Card className={`max-w-[80%] p-3 ${
              message.isUser 
                ? 'bg-gradient-ocean text-white shadow-soft' 
                : 'bg-white shadow-soft border-0'
            }`}>
              <p className="text-sm whitespace-pre-wrap">{message.content}</p>
              <span className={`text-xs mt-2 block ${
                message.isUser ? 'text-white/70' : 'text-muted-foreground'
              }`}>
                {message.timestamp.toLocaleTimeString()}
              </span>
            </Card>
          </div>
        ))}
        {isLoading && (
          <div className="flex justify-start animate-fade-in">
            <Card className="bg-white shadow-soft border-0 p-3">
              <div className="flex items-center gap-2">
                <div className="animate-pulse flex space-x-1">
                  <div className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                  <div className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                  <div className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
                </div>
                <span className="text-sm text-muted-foreground">Planning your trip...</span>
              </div>
            </Card>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="p-4 bg-white/80 backdrop-blur-sm rounded-b-xl">
        {currentStep === 'itinerary' && (
          <div className="mb-4">
            <Input
              placeholder="Enter your webhook URL for saving trip data (optional)"
              value={webhookUrl}
              onChange={(e) => setWebhookUrl(e.target.value)}
              className="mb-2"
            />
          </div>
        )}
        
        <form onSubmit={handleSubmit} className="flex gap-2">
          <Input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Type your message..."
            disabled={isLoading}
            className="flex-1 border-0 shadow-soft focus:shadow-travel transition-smooth"
          />
          <Button
            type="submit"
            disabled={isLoading || !input.trim()}
            variant="travel"
            size="icon"
            className="shrink-0"
          >
            <Send className="w-4 h-4" />
          </Button>
        </form>
      </div>
    </div>
  );
};