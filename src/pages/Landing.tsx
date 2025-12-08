import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ArrowRight, Brain, Target, TrendingUp, Mic, MessageSquare, BarChart3 } from 'lucide-react';

const Landing = () => {
  return (
    <div className="min-h-screen bg-background overflow-hidden">
      {/* Background effects */}
      <div className="fixed inset-0 bg-grid-pattern bg-grid opacity-30" />
      <div className="fixed top-0 left-1/4 w-96 h-96 bg-primary/20 rounded-full blur-[100px] animate-pulse-glow" />
      <div className="fixed bottom-0 right-1/4 w-96 h-96 bg-accent/20 rounded-full blur-[100px] animate-pulse-glow" />
      
      {/* Navigation */}
      <nav className="relative z-10 flex items-center justify-between p-6 max-w-7xl mx-auto">
        <div className="flex items-center gap-2">
          <div className="w-10 h-10 rounded-lg bg-primary/20 flex items-center justify-center">
            <Brain className="w-6 h-6 text-primary" />
          </div>
          <span className="text-xl font-display font-bold">InterviewAI</span>
        </div>
        <div className="flex items-center gap-4">
          <Link to="/auth">
            <Button variant="ghost">Login</Button>
          </Link>
          <Link to="/auth">
            <Button className="bg-primary text-primary-foreground hover:bg-primary/90">
              Get Started
            </Button>
          </Link>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative z-10 max-w-7xl mx-auto px-6 pt-20 pb-32">
        <div className="text-center max-w-4xl mx-auto">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass-card mb-8 animate-slide-up">
            <span className="w-2 h-2 bg-primary rounded-full animate-pulse" />
            <span className="text-sm text-muted-foreground">AI-Powered Interview Practice</span>
          </div>
          
          <h1 className="text-5xl md:text-7xl font-display font-bold mb-6 animate-slide-up animation-delay-100">
            Master Your Next
            <span className="gradient-text"> Interview</span>
          </h1>
          
          <p className="text-xl text-muted-foreground mb-10 max-w-2xl mx-auto animate-slide-up animation-delay-200">
            Practice with an AI interviewer that adapts to your role, provides real-time feedback, 
            and helps you build confidence for the real thing.
          </p>
          
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 animate-slide-up animation-delay-300">
            <Link to="/setup">
              <Button size="lg" className="bg-primary text-primary-foreground hover:bg-primary/90 px-8 py-6 text-lg glow-effect">
                Start Free Practice
                <ArrowRight className="ml-2 w-5 h-5" />
              </Button>
            </Link>
            <Link to="/dashboard">
              <Button size="lg" variant="outline" className="px-8 py-6 text-lg border-border/50">
                View Dashboard
              </Button>
            </Link>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-8 max-w-2xl mx-auto mt-20 animate-slide-up animation-delay-400">
          {[
            { value: '10K+', label: 'Practice Sessions' },
            { value: '95%', label: 'Improvement Rate' },
            { value: '50+', label: 'Job Roles' },
          ].map((stat, i) => (
            <div key={i} className="text-center">
              <div className="text-3xl md:text-4xl font-display font-bold gradient-text">{stat.value}</div>
              <div className="text-sm text-muted-foreground mt-1">{stat.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Features Section */}
      <section className="relative z-10 max-w-7xl mx-auto px-6 py-20">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-display font-bold mb-4">
            Everything You Need to <span className="gradient-text">Succeed</span>
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Our platform combines AI technology with proven interview techniques to give you the edge.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[
            {
              icon: Brain,
              title: 'AI Question Generation',
              description: 'Dynamic questions tailored to your target role and experience level.',
            },
            {
              icon: Mic,
              title: 'Voice & Text Responses',
              description: 'Practice answering via voice or text, just like real interviews.',
            },
            {
              icon: Target,
              title: 'Real-time Feedback',
              description: 'Get instant analysis on clarity, relevance, and communication.',
            },
            {
              icon: BarChart3,
              title: 'Performance Analytics',
              description: 'Track your progress with detailed insights and skill breakdowns.',
            },
            {
              icon: MessageSquare,
              title: 'STAR Format Training',
              description: 'Learn to structure behavioral answers effectively.',
            },
            {
              icon: TrendingUp,
              title: 'Improvement Tracking',
              description: 'See your growth over time with comprehensive analytics.',
            },
          ].map((feature, i) => (
            <div 
              key={i} 
              className="glass-card rounded-xl p-6 hover:border-primary/30 transition-all duration-300 group"
            >
              <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4 group-hover:bg-primary/20 transition-colors">
                <feature.icon className="w-6 h-6 text-primary" />
              </div>
              <h3 className="text-lg font-semibold mb-2">{feature.title}</h3>
              <p className="text-muted-foreground text-sm">{feature.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative z-10 max-w-7xl mx-auto px-6 py-20">
        <div className="glass-card rounded-2xl p-12 text-center relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-primary/10 to-accent/10" />
          <div className="relative z-10">
            <h2 className="text-3xl md:text-4xl font-display font-bold mb-4">
              Ready to Ace Your Interview?
            </h2>
            <p className="text-muted-foreground mb-8 max-w-xl mx-auto">
              Join thousands of job seekers who have improved their interview skills with our AI platform.
            </p>
            <Link to="/setup">
              <Button size="lg" className="bg-primary text-primary-foreground hover:bg-primary/90 px-8 glow-effect">
                Start Practicing Now
                <ArrowRight className="ml-2 w-5 h-5" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative z-10 border-t border-border/50 py-8 mt-20">
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <Brain className="w-5 h-5 text-primary" />
            <span className="font-display font-semibold">InterviewAI</span>
          </div>
          <p className="text-sm text-muted-foreground">
            © 2024 InterviewAI. Built for job seekers.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Landing;
