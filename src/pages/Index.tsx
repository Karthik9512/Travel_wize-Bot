import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button-variants';
import { Card } from '@/components/ui/card';
import { TravelChat } from '@/components/TravelChat';
import { Plane, MapPin, Calendar, Users, Sparkles } from 'lucide-react';
import heroImage from '@/assets/travel-hero.jpg';

const Index = () => {
  const [showChat, setShowChat] = useState(false);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  if (showChat) {
    return (
      <div className="min-h-screen bg-gradient-hero p-4">
        <div className="container mx-auto py-8">
          <Button
            onClick={() => setShowChat(false)}
            variant="ghost"
            className="mb-4 text-white hover:bg-white/20"
          >
            ← Back to Home
          </Button>
          <div className="bg-white/90 backdrop-blur-sm rounded-xl shadow-travel overflow-hidden" style={{ height: 'calc(100vh - 160px)' }}>
            <TravelChat />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
        {/* Background Image */}
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{ backgroundImage: `url(${heroImage})` }}
        >
          <div className="absolute inset-0 bg-gradient-hero/70 backdrop-blur-[1px]"></div>
        </div>
        
        {/* Content */}
        <div className={`relative z-10 text-center px-4 max-w-4xl mx-auto transition-all duration-1000 ${
          isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
        }`}>
          <div className="bg-white/10 backdrop-blur-md rounded-3xl p-8 md:p-12 shadow-travel border border-white/20">
            <div className="flex items-center justify-center mb-6">
              <div className="bg-white/20 p-4 rounded-full animate-float">
                <Plane className="w-12 h-12 text-white" />
              </div>
            </div>
            
            <h1 className="text-5xl md:text-7xl font-bold text-white mb-6 leading-tight">
              TravelWize
              <span className="bg-gradient-sunset bg-clip-text text-transparent"> AI</span>
            </h1>
            
            <p className="text-xl md:text-2xl text-white/90 mb-8 leading-relaxed">
              Your intelligent travel companion that creates personalized itineraries 
              tailored to your dreams and budget ✈️
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
              <Button
                onClick={() => setShowChat(true)}
                variant="travel"
                size="xl"
                className="group"
              >
                <Sparkles className="w-5 h-5 mr-2 group-hover:animate-spin transition-transform" />
                Start Planning My Trip
              </Button>
              
              <Button
                variant="sky"
                size="xl"
                className="border border-white/30"
              >
                <MapPin className="w-5 h-5 mr-2" />
                Explore Features
              </Button>
            </div>

            {/* Feature Cards */}
            <div className="grid md:grid-cols-3 gap-6 mt-16">
              <Card className="bg-white/10 backdrop-blur-sm border-white/20 p-6 text-center hover:bg-white/20 transition-smooth">
                <div className="bg-primary/20 p-3 rounded-full w-fit mx-auto mb-4">
                  <MapPin className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-white font-semibold text-lg mb-2">Smart Destinations</h3>
                <p className="text-white/80">AI-powered recommendations based on your preferences and budget</p>
              </Card>
              
              <Card className="bg-white/10 backdrop-blur-sm border-white/20 p-6 text-center hover:bg-white/20 transition-smooth">
                <div className="bg-accent/20 p-3 rounded-full w-fit mx-auto mb-4">
                  <Calendar className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-white font-semibold text-lg mb-2">Perfect Timing</h3>
                <p className="text-white/80">Optimized schedules with the best times to visit each location</p>
              </Card>
              
              <Card className="bg-white/10 backdrop-blur-sm border-white/20 p-6 text-center hover:bg-white/20 transition-smooth">
                <div className="bg-sunset/20 p-3 rounded-full w-fit mx-auto mb-4">
                  <Users className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-white font-semibold text-lg mb-2">Group Friendly</h3>
                <p className="text-white/80">Plans that work for solo travelers, couples, families, and groups</p>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-20 bg-background">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-foreground mb-4">How TravelWize Works</h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Simple conversations that lead to extraordinary adventures
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            <div className="text-center">
              <div className="bg-gradient-ocean w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6 shadow-travel">
                <span className="text-2xl font-bold text-white">1</span>
              </div>
              <h3 className="text-xl font-semibold mb-4">Chat About Your Dreams</h3>
              <p className="text-muted-foreground">Tell our AI about your destination, dates, budget, and travel style through friendly conversation</p>
            </div>

            <div className="text-center">
              <div className="bg-gradient-sunset w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6 shadow-travel">
                <span className="text-2xl font-bold text-white">2</span>
              </div>
              <h3 className="text-xl font-semibold mb-4">Get Personalized Plans</h3>
              <p className="text-muted-foreground">Receive custom itineraries with daily activities, restaurant recommendations, and hidden gems</p>
            </div>

            <div className="text-center">
              <div className="bg-gradient-sky w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6 shadow-travel">
                <span className="text-2xl font-bold text-white">3</span>
              </div>
              <h3 className="text-xl font-semibold mb-4">Save & Share</h3>
              <p className="text-muted-foreground">Your travel plans are automatically saved and can be emailed to you for easy access</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Index;