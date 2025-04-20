
import { toast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";

// Generate a random username combining adjectives and nouns
export const generateRandomUsername = (): string => {
  const adjectives = [
    "Happy", "Clever", "Brave", "Calm", "Eager", 
    "Gentle", "Honest", "Jolly", "Kind", "Lively",
    "Mighty", "Noble", "Polite", "Quick", "Royal"
  ];
  
  const nouns = [
    "Tiger", "Eagle", "Dolphin", "Panda", "Wolf",
    "Lion", "Falcon", "Dragon", "Phoenix", "Bear",
    "Hawk", "Lynx", "Raven", "Cobra", "Jaguar"
  ];
  
  const randomAdjective = adjectives[Math.floor(Math.random() * adjectives.length)];
  const randomNoun = nouns[Math.floor(Math.random() * nouns.length)];
  const randomNumber = Math.floor(Math.random() * 1000);
  
  return `${randomAdjective}${randomNoun}${randomNumber}`;
};

// Reset password using Supabase
export const resetPassword = async (email: string): Promise<boolean> => {
  try {
    const { error } = await supabase.auth.resetPasswordForEmail(email);
    
    if (error) throw error;
    
    toast({
      title: "Password Reset Email Sent",
      description: "Check your email for a link to reset your password.",
    });
    
    return true;
  } catch (error) {
    console.error("Error resetting password:", error);
    throw error;
  }
};
