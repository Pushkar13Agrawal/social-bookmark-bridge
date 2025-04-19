
import { toast } from "@/components/ui/use-toast";

// User type definition
export interface User {
  id: string;
  username: string;
  email: string;
}

// Simple in-memory storage for demo purposes
// In a real app, this would use proper backend authentication
let currentUser: User | null = null;

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

// Mock user database
const userDb: User[] = [
  {
    id: "1",
    username: "DemoUser123",
    email: "demo@example.com",
  }
];

// Register a new user
export const registerUser = (email: string, password: string): Promise<User> => {
  // In a real app, this would make an API call to register the user
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      // Check if email already exists
      const existingUser = userDb.find(user => user.email === email);
      if (existingUser) {
        reject(new Error("Email already registered"));
        return;
      }
      
      // Create new user with random username
      const newUser: User = {
        id: (userDb.length + 1).toString(),
        username: generateRandomUsername(),
        email: email,
      };
      
      // Store user in our mock database
      userDb.push(newUser);
      
      // Set as current user
      currentUser = newUser;
      
      // Store in local storage for persistence
      localStorage.setItem("currentUser", JSON.stringify(newUser));
      
      resolve(newUser);
    }, 1000);
  });
};

// Login user
export const loginUser = (email: string, password: string): Promise<User> => {
  // In a real app, this would validate credentials with a backend
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const user = userDb.find(user => user.email === email);
      
      if (!user) {
        reject(new Error("Invalid email or password"));
        return;
      }
      
      // Set as current user
      currentUser = user;
      
      // Store in local storage for persistence
      localStorage.setItem("currentUser", JSON.stringify(user));
      
      resolve(user);
    }, 1000);
  });
};

// Check if user is logged in
export const getCurrentUser = (): User | null => {
  if (currentUser) return currentUser;
  
  // Try to get from local storage
  const storedUser = localStorage.getItem("currentUser");
  if (storedUser) {
    currentUser = JSON.parse(storedUser);
    return currentUser;
  }
  
  return null;
};

// Logout user
export const logoutUser = (): void => {
  currentUser = null;
  localStorage.removeItem("currentUser");
};

// Reset password
export const resetPassword = (email: string): Promise<boolean> => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const user = userDb.find(user => user.email === email);
      
      if (!user) {
        reject(new Error("Email not found"));
        return;
      }
      
      // In a real app, this would send a password reset email
      toast({
        title: "Password Reset Email Sent",
        description: "Check your email for a link to reset your password.",
      });
      
      resolve(true);
    }, 1000);
  });
};
