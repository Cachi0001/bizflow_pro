import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const AIVoiceButton = ({ subscriptionTier }) => {
  const [isListening, setIsListening] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);

  const handleVoiceCommand = async () => {
    if (subscriptionTier !== 'premium') {
      console.log('Voice commands available for Silver tier only');
      return;
    }

    setIsListening(true);
    
    // Simulate voice recognition
    setTimeout(() => {
      setIsListening(false);
      setIsProcessing(true);
      
      // Simulate processing
      setTimeout(() => {
        setIsProcessing(false);
        console.log('Voice command processed');
      }, 2000);
    }, 3000);
  };

  if (subscriptionTier === 'free') {
    return (
      <div className="card p-6 relative">
        <div className="absolute inset-0 bg-white bg-opacity-80 backdrop-blur-sm rounded-lg flex items-center justify-center z-10">
          <div className="text-center">
            <div className="w-16 h-16 bg-accent-100 rounded-full flex items-center justify-center mx-auto mb-3">
              <Icon name="Mic" size={24} color="var(--color-accent-600)" />
            </div>
            <h3 className="text-lg font-semibold text-text-primary mb-2">
              AI Voice Commands
            </h3>
            <p className="text-sm text-text-secondary mb-4">
              Upgrade to Silver for voice-powered business management
            </p>
            <button className="px-4 py-2 bg-accent text-white rounded-lg text-sm font-medium hover:bg-accent-600 transition-colors">
              Upgrade to Silver
            </button>
          </div>
        </div>
        
        <div className="blur-sm">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-text-primary">Voice Assistant</h3>
            <div className="w-12 h-12 bg-primary-100 rounded-full flex items-center justify-center">
              <Icon name="Mic" size={24} color="var(--color-primary-600)" />
            </div>
          </div>
          <p className="text-sm text-text-secondary mb-4">
            Say commands like "Create new invoice for John" or "Show me this month's expenses"
          </p>
          <Button variant="primary" size="lg" className="w-full">
            Start Voice Command
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="card p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-text-primary">AI Voice Assistant</h3>
        <div className={`w-12 h-12 rounded-full flex items-center justify-center transition-colors duration-200 ${
          isListening ? 'bg-error-100 animate-pulse' : isProcessing ?'bg-warning-100' : 'bg-primary-100'
        }`}>
          <Icon 
            name={isProcessing ? "Brain" : "Mic"} 
            size={24} 
            color={
              isListening ? "var(--color-error-600)" :
              isProcessing ? "var(--color-warning-600)" : "var(--color-primary-600)"
            }
          />
        </div>
      </div>
      
      <p className="text-sm text-text-secondary mb-4">
        {isListening ? "Listening... Speak your command": isProcessing ?"Processing your request...": "Say commands like \"Create invoice for John\" or \"Show expenses\""}
      </p>
      
      <Button 
        variant={isListening ? "danger" : "primary"}
        size="lg" 
        className="w-full"
        onClick={handleVoiceCommand}
        disabled={isProcessing}
        loading={isProcessing}
      >
        {isListening ? "Stop Listening" : "Start Voice Command"}
      </Button>
      
      {subscriptionTier === 'premium' && (
        <div className="mt-4 p-3 bg-success-50 rounded-lg">
          <div className="flex items-center space-x-2">
            <Icon name="CheckCircle" size={16} color="var(--color-success-600)" />
            <span className="text-sm text-success-800 font-medium">
              AI Voice Commands Active
            </span>
          </div>
          <p className="text-xs text-success-700 mt-1">
            Try: "Create invoice", "Add expense", "Show reports"
          </p>
        </div>
      )}
    </div>
  );
};

export default AIVoiceButton;