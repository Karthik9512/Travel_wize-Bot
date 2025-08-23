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
  currentCity?: string;
  dates?: string;
  duration?: string;
  travelers?: number;
  budget?: string;
  transport?: string;
  preferences?: string[];
  pace?: string;
  email?: string;
}

const CONVERSATION_STEPS = [
  'greeting',
  'destination',
  'currentCity',
  'dates',
  'duration',
  'budget',
  'transport',
  'travelers',
  'preferences',
  'pace',
  'email',
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
  const [webhookUrl, setWebhookUrl] = useState('https://karthiktheru.app.n8n.cloud/webhook-test/travel-agent');
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
      destination: `Great choice! What's your current city or starting point?`,
      currentCity: `Perfect! When are you planning to travel? Please share your travel dates.`,
      dates: `Excellent! How many days/nights will your trip be?`,
      duration: `Got it! What's your approximate budget for this trip? (e.g., $1000-2000, luxury, budget-friendly)`,
      budget: `Wonderful! What's your preferred mode of transport? (flight, train, car, bus, etc.)`,
      transport: `Perfect! How many people will be traveling?`,
      travelers: `Great! Any specific preferences? (adventure, culture, relaxation, food, shopping, nightlife, beaches, mountains, historical sites, etc.)`,
      preferences: `Awesome! What's your preferred travel pace? (slow and relaxed, moderate, fast-paced/packed schedule)`,
      pace: `Perfect! What's your email address so I can send you the itinerary?`,
      email: `Excellent! I'm now creating your personalized itinerary with the structured format. Let me put together the perfect travel plan for you! ✈️`,
      itinerary: generateItinerary()
    };
    
    return responses[step] || "I'm here to help you plan your perfect trip!";
  };

  const generateItinerary = (): string => {
    const { destination, currentCity, dates, duration, travelers, budget, transport, preferences } = tripDetails;
    
    return `🎉 **Trip Overview**
A ${duration} trip from ${currentCity} to ${destination} for ${travelers} ${travelers === 1 ? 'person' : 'people'} with ${budget} budget using ${transport}.

**Day-by-Day Itinerary**

**Day 1: Arrival & Initial Exploration**
• Arrive in ${destination} via ${transport}
• Check into accommodation and get settled
• Explore the main city center and local markets
• Try authentic local cuisine for dinner
• Evening: Rest and prepare for tomorrow's adventures

**Day 2: Cultural Discovery & Attractions**
• Morning: Visit historical landmarks and museums
• Afternoon: Local cultural experiences and guided tours
• Evening: Sunset viewing at popular scenic spots
• Dinner at recommended local restaurants

**Day 3: Adventure & Local Experiences**
• Outdoor activities based on your preferences: ${preferences?.join(', ')}
• Nature excursions or city exploration
• Local food experiences and shopping
• Departure preparations if final day

**Food & Dining Suggestions**
🍜 Try local specialties and street food
🥘 Visit traditional restaurants for authentic cuisine
☕ Experience local cafes and food markets
🍽️ Budget-friendly: Local eateries and food courts

**Travel & Transport Tips**
🚗 Local transport: Public buses, metro, or ride-sharing
🎫 Book transport tickets in advance for better prices
📱 Use local transport apps for easy navigation
🚶 Walking is great for exploring city centers

**Budget & Money-Saving Tips**
💰 Use local currency and avoid tourist traps
🎟️ Look for city tourist passes for multiple attractions
🏨 Book accommodations in advance for better rates
💳 Carry both cash and cards for different vendors

**Final Recommendations**
✈️ Check weather forecast and pack accordingly
📱 Download offline maps and translation apps
🏥 Keep emergency contacts and travel insurance handy
📸 Respect local customs and photography rules

Would you like me to save this itinerary and send it to your email? Just provide your webhook URL for data storage!`;
  };

  const updateTripDetails = (userInput: string, step: ConversationStep) => {
    const updates: Partial<TripDetails> = {};
    
    switch (step) {
      case 'destination':
        updates.destination = userInput;
        break;
      case 'currentCity':
        updates.currentCity = userInput;
        break;
      case 'dates':
        updates.dates = userInput;
        break;
      case 'duration':
        updates.duration = userInput;
        break;
      case 'budget':
        updates.budget = userInput;
        break;
      case 'transport':
        updates.transport = userInput;
        break;
      case 'travelers':
        updates.travelers = parseInt(userInput) || 1;
        break;
      case 'preferences':
        updates.preferences = userInput.split(',').map(p => p.trim());
        break;
      case 'pace':
        updates.pace = userInput;
        break;
      case 'email':
        updates.email = userInput;
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
    const finalWebhookUrl = webhookUrl;

    // Parse dates from the dates string
    const [startDate, endDate] = tripDetails.dates?.includes('to') 
      ? tripDetails.dates.split(' to ').map(d => d.trim())
      : [tripDetails.dates, tripDetails.dates];

    try {
      const response = await fetch(finalWebhookUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        mode: 'no-cors',
        body: JSON.stringify({
          "body": {
            "chatInput": {
              "Departure": tripDetails.currentCity || "",
              "Destination": tripDetails.destination || "",
              "StartDate": startDate || "",
              "EndDate": endDate || startDate || "",
              "Travelers": tripDetails.travelers?.toString() || "1",
              "Budget": tripDetails.budget || "",
              "Preferences": tripDetails.preferences?.join(', ') || "",
              "Activity": tripDetails.preferences?.join(', ') || "",
              "Pace": tripDetails.pace || "",
              "Gmail": tripDetails.email || ""
            }
          }
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
      currentCity: <MapPin className="w-4 h-4" />,
      dates: <Calendar className="w-4 h-4" />,
      duration: <Calendar className="w-4 h-4" />,
      budget: <DollarSign className="w-4 h-4" />,
      transport: <MapPin className="w-4 h-4" />,
      travelers: <Users className="w-4 h-4" />,
      preferences: <Heart className="w-4 h-4" />,
      pace: <Calendar className="w-4 h-4" />,
      email: <Send className="w-4 h-4" />,
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