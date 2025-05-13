
import React from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, Bookmark, CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";

const About: React.FC = () => {
  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <div className="bg-white border-b py-4">
        <div className="container mx-auto px-4 flex items-center">
          <Button variant="ghost" size="sm" asChild className="mr-4">
            <Link to="/">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Home
            </Link>
          </Button>
          <div className="flex items-center">
            <Bookmark className="h-6 w-6 text-primary mr-2" />
            <h1 className="text-xl font-semibold">Social Bookmark Bridge</h1>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 container mx-auto px-4 py-12 max-w-4xl">
        <h1 className="text-3xl font-bold mb-8">About Social Bookmark Bridge</h1>
        
        <div className="prose prose-lg max-w-none mb-12">
          <p className="text-xl text-muted-foreground mb-6">
            Social Bookmark Bridge is the ultimate solution for managing your digital content across all your social platforms.
          </p>
          
          <h2 className="text-2xl font-semibold mt-8 mb-4">Our Mission</h2>
          <p>
            In today's digital landscape, we save content across multiple platforms - tweets on Twitter, posts on Facebook, 
            articles on LinkedIn, photos on Instagram, and videos on YouTube. Social Bookmark Bridge was created to solve 
            the fragmentation problem by bringing all your saved content into one beautiful, organized interface.
          </p>
          
          <h2 className="text-2xl font-semibold mt-8 mb-4">How It Works</h2>
          <p>
            Our platform seamlessly connects with your social media accounts through secure API integrations. 
            Once connected, we automatically sync your bookmarks and saved items, organizing them in one 
            searchable, filterable interface. You can add tags, set reminders, and organize your content 
            the way that makes sense to you.
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 my-10">
            <div className="bg-primary/5 p-6 rounded-lg">
              <div className="w-12 h-12 bg-primary/20 rounded-full flex items-center justify-center mb-4">
                <CheckCircle className="h-6 w-6 text-primary" />
              </div>
              <h3 className="font-semibold mb-2">Unified Experience</h3>
              <p className="text-sm text-muted-foreground">
                Access all your bookmarks in one place with a consistent interface, regardless of their original platform.
              </p>
            </div>
            
            <div className="bg-secondary/5 p-6 rounded-lg">
              <div className="w-12 h-12 bg-secondary/20 rounded-full flex items-center justify-center mb-4">
                <CheckCircle className="h-6 w-6 text-secondary" />
              </div>
              <h3 className="font-semibold mb-2">Smart Organization</h3>
              <p className="text-sm text-muted-foreground">
                Automatically categorize your content and add custom tags to make finding what you need effortless.
              </p>
            </div>
            
            <div className="bg-accent/5 p-6 rounded-lg">
              <div className="w-12 h-12 bg-accent/20 rounded-full flex items-center justify-center mb-4">
                <CheckCircle className="h-6 w-6 text-accent" />
              </div>
              <h3 className="font-semibold mb-2">Reminder System</h3>
              <p className="text-sm text-muted-foreground">
                Set reminders for content you want to revisit, ensuring nothing important gets forgotten.
              </p>
            </div>
          </div>
          
          <h2 className="text-2xl font-semibold mt-8 mb-4">Privacy and Security</h2>
          <p>
            We take your privacy seriously. Social Bookmark Bridge uses read-only access to your social accounts, 
            meaning we can only see what you've saved - we can never post on your behalf or access private 
            communications. All your data is encrypted and stored securely.
          </p>
        </div>
        
        {/* FAQ Section */}
        <div className="mt-16">
          <h2 className="text-2xl font-bold mb-6">Frequently Asked Questions</h2>
          
          <Accordion type="single" collapsible className="w-full">
            <AccordionItem value="item-1">
              <AccordionTrigger>Which social platforms do you support?</AccordionTrigger>
              <AccordionContent>
                We currently support Twitter, Facebook, Instagram, LinkedIn, YouTube, Pinterest, and Reddit. 
                We're constantly adding more platforms based on user feedback and demand.
              </AccordionContent>
            </AccordionItem>
            
            <AccordionItem value="item-2">
              <AccordionTrigger>How often are my bookmarks synced?</AccordionTrigger>
              <AccordionContent>
                By default, we sync your bookmarks every 24 hours. Premium users can enable real-time syncing 
                for instant updates whenever you save new content on any of your connected platforms.
              </AccordionContent>
            </AccordionItem>
            
            <AccordionItem value="item-3">
              <AccordionTrigger>Is there a limit to how many bookmarks I can save?</AccordionTrigger>
              <AccordionContent>
                Free accounts can manage up to 500 bookmarks. Premium accounts have unlimited bookmark storage 
                and additional features like advanced filtering, priority support, and custom integration options.
              </AccordionContent>
            </AccordionItem>
            
            <AccordionItem value="item-4">
              <AccordionTrigger>Can I export my bookmarks?</AccordionTrigger>
              <AccordionContent>
                Yes! All users can export their bookmarks in multiple formats including CSV, JSON, and HTML. 
                This makes it easy to back up your data or transfer it to other services if needed.
              </AccordionContent>
            </AccordionItem>
            
            <AccordionItem value="item-5">
              <AccordionTrigger>What happens if I disconnect a social account?</AccordionTrigger>
              <AccordionContent>
                When you disconnect a social account, we'll maintain your existing bookmarks from that platform 
                in your library. However, we won't receive any new bookmarks from that platform until you reconnect. 
                You can choose to delete all bookmarks from a specific platform at any time.
              </AccordionContent>
            </AccordionItem>
            
            <AccordionItem value="item-6">
              <AccordionTrigger>How do I set up reminder notifications?</AccordionTrigger>
              <AccordionContent>
                You can set reminders for any bookmark by clicking on it and selecting the "Set Reminder" option. 
                Choose your preferred date and time, and we'll send you a notification through email, browser notification, 
                or our mobile app (if installed). Premium users can set recurring reminders and customize notification channels.
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </div>
        
        {/* CTA Section */}
        <div className="mt-16 bg-gradient-to-r from-primary/10 to-accent/10 p-8 rounded-lg text-center">
          <h3 className="text-2xl font-bold mb-4">Ready to organize your digital life?</h3>
          <p className="text-lg mb-6">
            Join thousands of users who have simplified their online experience with Social Bookmark Bridge.
          </p>
          <Button asChild size="lg" className="gap-2">
            <Link to="/login">
              Get Started Today
              <ArrowLeft className="h-4 w-4 ml-2 rotate-180" />
            </Link>
          </Button>
        </div>
      </div>
      
      {/* Footer */}
      <footer className="bg-muted py-8 mt-12">
        <div className="container mx-auto px-4 text-center">
          <p className="text-muted-foreground">
            © {new Date().getFullYear()} Social Bookmark Bridge. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default About;
