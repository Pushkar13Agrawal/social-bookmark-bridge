
import React from "react";
import { Button } from "@/components/ui/button";
import { GradientCard } from "@/components/ui/gradient-card";
import { Link } from "react-router-dom";
import { Bookmark, ArrowRight } from "lucide-react";

const Landing: React.FC = () => {
  return (
    <div className="min-h-screen flex flex-col">
      {/* Hero Section */}
      <div 
        className="flex-1 flex flex-col items-center justify-center px-4 sm:px-6 py-16 lg:py-24"
        style={{
          background: "linear-gradient(135deg, hsl(260, 80%, 98%) 0%, hsl(300, 60%, 96%) 100%)"
        }}
      >
        <div className="container mx-auto max-w-4xl text-center">
          <div className="inline-block p-2 bg-white/80 backdrop-blur-sm rounded-xl mb-6 shadow-sm">
            <Bookmark className="h-8 w-8 text-primary" />
          </div>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight mb-6">
            All Your Bookmarks <br /> 
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-primary to-accent">
              In One Place
            </span>
          </h1>
          <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-8">
            Connect your social media accounts and access all your saved content in a single, beautiful interface.
            Organize, search, and never lose track of important links again.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button asChild size="lg" className="gap-2">
              <Link to="/login">
                Get Started
                <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
            <Button asChild variant="outline" size="lg">
              <Link to="/about">Learn More</Link>
            </Button>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="py-16 bg-white">
        <div className="container mx-auto px-4 sm:px-6">
          <h2 className="text-3xl font-bold text-center mb-12">What Makes Us Special</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <GradientCard className="text-center" gradientFrom="from-primary/10" gradientTo="to-secondary/10" borderGlow={true}>
              <div className="w-12 h-12 bg-primary/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <Bookmark className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-2">All Your Platforms</h3>
              <p className="text-muted-foreground">
                Connect Twitter, Facebook, Instagram, LinkedIn, and more — all your bookmarks in one place.
              </p>
            </GradientCard>
            <GradientCard className="text-center" gradientFrom="from-secondary/10" gradientTo="to-accent/10" borderGlow={true}>
              <div className="w-12 h-12 bg-secondary/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <Bookmark className="h-6 w-6 text-secondary" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Cross-Device Access</h3>
              <p className="text-muted-foreground">
                Access your bookmarks from any device, anywhere, anytime with our cloud sync feature.
              </p>
            </GradientCard>
            <GradientCard className="text-center" gradientFrom="from-accent/10" gradientTo="to-primary/10" borderGlow={true}>
              <div className="w-12 h-12 bg-accent/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <Bookmark className="h-6 w-6 text-accent" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Easy Organization</h3>
              <p className="text-muted-foreground">
                Effortlessly search, filter, and organize your bookmarks by platform, tags, or custom categories.
              </p>
            </GradientCard>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-muted py-8">
        <div className="container mx-auto px-4 text-center">
          <p className="text-muted-foreground">
            © {new Date().getFullYear()} Social Bookmark Bridge. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Landing;
