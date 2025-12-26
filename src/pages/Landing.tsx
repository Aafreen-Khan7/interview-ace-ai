import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import {
  ArrowRight,
  Brain,
  Target,
  TrendingUp,
  Mic,
  MessageSquare,
  BarChart3,
  Shield,
  Clock,
  Users,
  Award,
  CheckCircle,
  Star,
  Zap,
  Sparkles,
  Linkedin,
  Twitter,
  Github,
  Mail,
  Heart,
  ChevronRight,
  PlayCircle,
  Video,
  FileText,
  Headphones,
  Code,
  Cpu,
  Database,
  Globe,
  Cloud,
  Smartphone
} from 'lucide-react';

const Landing = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-gray-900 text-white overflow-hidden">
      {/* Animated Background Elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-500/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-purple-500/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-cyan-500/10 rounded-full blur-2xl animate-pulse delay-500"></div>
        <div className="absolute top-10 right-10 w-40 h-40 bg-gradient-to-r from-blue-600/10 to-purple-600/10 rounded-full blur-2xl"></div>
      </div>

      {/* Navigation */}
      <nav className="relative z-50 bg-gray-800/30 backdrop-blur-xl border-b border-gray-700/30">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl flex items-center justify-center">
                <Brain className="h-6 w-6 text-white" />
              </div>
              <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-400">
                InterviewAceAI
              </span>
            </div>
            <div className="flex items-center space-x-6">
              <Link to="/auth">
                <Button variant="ghost" className="text-gray-300 hover:text-white hover:bg-gray-700/50">
                  Sign In
                </Button>
              </Link>
              <Link to="/setup">
                <Button className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white px-6">
                  Start Free Trial
                  <Sparkles className="ml-2 h-4 w-4" />
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative z-10 max-w-7xl mx-auto px-6 pt-24 pb-32">
        <div className="text-center max-w-5xl mx-auto">
          {/* Badge */}
          <div className="inline-flex items-center space-x-2 px-6 py-3 bg-gradient-to-r from-blue-500/20 to-purple-500/20 backdrop-blur-sm rounded-full border border-blue-500/30 mb-10 animate-in fade-in">
            <div className="w-2 h-2 bg-gradient-to-r from-blue-400 to-cyan-400 rounded-full animate-pulse"></div>
            <span className="text-sm font-medium text-blue-300">AI-Powered Interview Mastery</span>
            <div className="w-2 h-2 bg-gradient-to-r from-purple-400 to-pink-400 rounded-full animate-pulse"></div>
          </div>
          
          {/* Main Heading */}
          <h1 className="text-6xl md:text-8xl font-bold mb-8 leading-tight animate-in fade-in slide-in-from-bottom-5">
            Master Your Next
            <span className="block bg-clip-text text-transparent bg-gradient-to-r from-blue-400 via-cyan-400 to-purple-400 mt-4">
              Technical Interview
            </span>
          </h1>
          
          {/* Subtitle */}
          <p className="text-xl text-gray-300 mb-12 max-w-3xl mx-auto leading-relaxed animate-in fade-in slide-in-from-bottom-5 delay-100">
            Experience realistic mock interviews with AI-powered feedback, proctoring, 
            and detailed analytics to boost your confidence and skills.
          </p>
          
          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-6 animate-in fade-in slide-in-from-bottom-5 delay-200">
            <Link to="/setup" className="w-full sm:w-auto">
              <Button 
                size="lg" 
                className="w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white px-10 py-7 text-lg font-semibold rounded-xl shadow-2xl hover:shadow-3xl transition-all hover:scale-105"
              >
                <PlayCircle className="mr-3 h-6 w-6" />
                Start Free Practice
                <ArrowRight className="ml-3 h-5 w-5" />
              </Button>
            </Link>
            <Link to="/dashboard" className="w-full sm:w-auto">
              <Button 
                size="lg" 
                variant="outline" 
                className="w-full border-gray-600 hover:border-blue-500 hover:bg-gray-800/50 text-gray-300 px-10 py-7 text-lg rounded-xl backdrop-blur-sm"
              >
                
                View Dashboard
              </Button>
            </Link>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-3xl mx-auto mt-24 animate-in fade-in slide-in-from-bottom-5 delay-300">
          {[
            { value: '10K+', label: 'Practice Sessions', icon: <Target className="h-5 w-5 text-blue-400" />, color: 'from-blue-500 to-blue-600' },
            { value: '95%', label: 'Improvement Rate', icon: <TrendingUp className="h-5 w-5 text-green-400" />, color: 'from-green-500 to-green-600' },
            { value: '50+', label: 'Job Roles', icon: <Users className="h-5 w-5 text-purple-400" />, color: 'from-purple-500 to-purple-600' },
          ].map((stat, i) => (
            <div 
              key={i} 
              className="bg-gray-800/40 backdrop-blur-sm border border-gray-700/50 rounded-2xl p-8 text-center hover:border-gray-600/50 transition-all group"
            >
              <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-gray-800 to-gray-900 rounded-2xl mb-6 group-hover:scale-110 transition-transform">
                <div className={`w-12 h-12 bg-gradient-to-r ${stat.color} rounded-xl flex items-center justify-center`}>
                  {stat.icon}
                </div>
              </div>
              <div className="text-4xl md:text-5xl font-bold bg-gradient-to-r bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-300">
                {stat.value}
              </div>
              <div className="text-gray-400 mt-3">{stat.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Features Section */}
      <section className="relative z-10 max-w-7xl mx-auto px-6 py-24">
        <div className="text-center mb-20">
          <div className="inline-flex items-center space-x-2 px-4 py-2 bg-gray-800/50 rounded-full mb-6">
            <Zap className="h-4 w-4 text-yellow-400" />
            <span className="text-sm font-medium text-yellow-300">POWERFUL FEATURES</span>
          </div>
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            Everything You Need to{' '}
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-400">
              Succeed
            </span>
          </h2>
          <p className="text-gray-400 max-w-2xl mx-auto text-lg">
            Our platform combines cutting-edge AI technology with proven interview techniques 
            to give you the competitive edge.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {[
            {
              icon: <Brain className="h-8 w-8 text-blue-400" />,
              title: 'AI Question Generation',
              description: 'Dynamic questions tailored to your target role and experience level.',
              color: 'from-blue-500/20 to-blue-600/20',
              border: 'border-blue-500/30'
            },
            {
              icon: <Mic className="h-8 w-8 text-green-400" />,
              title: 'Voice & Text Responses',
              description: 'Practice answering via voice or text, just like real interviews.',
              color: 'from-green-500/20 to-green-600/20',
              border: 'border-green-500/30'
            },
            {
              icon: <Shield className="h-8 w-8 text-purple-400" />,
              title: 'Real-time Proctoring',
              description: 'AI-powered monitoring to ensure interview integrity.',
              color: 'from-purple-500/20 to-purple-600/20',
              border: 'border-purple-500/30'
            },
            {
              icon: <BarChart3 className="h-8 w-8 text-amber-400" />,
              title: 'Performance Analytics',
              description: 'Track your progress with detailed insights and skill breakdowns.',
              color: 'from-amber-500/20 to-amber-600/20',
              border: 'border-amber-500/30'
            },
            {
              icon: <MessageSquare className="h-8 w-8 text-cyan-400" />,
              title: 'STAR Format Training',
              description: 'Learn to structure behavioral answers effectively.',
              color: 'from-cyan-500/20 to-cyan-600/20',
              border: 'border-cyan-500/30'
            },
            {
              icon: <Clock className="h-8 w-8 text-pink-400" />,
              title: 'Time Management',
              description: 'Practice pacing with intelligent time tracking.',
              color: 'from-pink-500/20 to-pink-600/20',
              border: 'border-pink-500/30'
            },
          ].map((feature, i) => (
            <div 
              key={i} 
              className={`bg-gradient-to-br ${feature.color} backdrop-blur-sm border ${feature.border} rounded-2xl p-8 hover:scale-[1.02] transition-all duration-300 group hover:shadow-2xl`}
            >
              <div className="w-16 h-16 bg-gradient-to-br from-gray-900 to-gray-800 rounded-2xl flex items-center justify-center mb-6 group-hover:rotate-12 transition-transform">
                {feature.icon}
              </div>
              <h3 className="text-xl font-bold mb-4 group-hover:text-white transition-colors">{feature.title}</h3>
              <p className="text-gray-300 leading-relaxed">{feature.description}</p>
              <div className="mt-6 pt-6 border-t border-gray-700/50">
                <div className="flex items-center text-sm text-gray-400 group-hover:text-gray-300">
                  <ChevronRight className="h-4 w-4 mr-2" />
                  Learn more about this feature
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Tech Stack Section */}
      <section className="relative z-10 max-w-7xl mx-auto px-6 py-24">
        <div className="text-center mb-16">
          <h3 className="text-3xl font-bold mb-4">Supporting Top Tech Roles</h3>
          <p className="text-gray-400 max-w-2xl mx-auto">
            We cover the most in-demand technical roles with specialized interview preparation
          </p>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
          {[
            { name: 'Frontend', icon: <Code className="h-8 w-8" />, color: 'from-blue-500 to-blue-600' },
            { name: 'Backend', icon: <Cpu className="h-8 w-8" />, color: 'from-green-500 to-green-600' },
            { name: 'Full Stack', icon: <Globe className="h-8 w-8" />, color: 'from-purple-500 to-purple-600' },
            { name: 'DevOps', icon: <Cloud className="h-8 w-8" />, color: 'from-amber-500 to-amber-600' },
            { name: 'Mobile', icon: <Smartphone className="h-8 w-8" />, color: 'from-red-500 to-red-600' },
            { name: 'Data Eng', icon: <Database className="h-8 w-8" />, color: 'from-cyan-500 to-cyan-600' },
          ].map((tech, i) => (
            <div key={i} className="bg-gray-800/40 backdrop-blur-sm border border-gray-700/50 rounded-xl p-6 text-center hover:border-gray-600 transition-colors">
              <div className={`w-14 h-14 bg-gradient-to-r ${tech.color} rounded-xl flex items-center justify-center mx-auto mb-4`}>
                <div className="text-white">{tech.icon}</div>
              </div>
              <div className="font-semibold">{tech.name}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Testimonial Section */}
      <section className="relative z-10 max-w-7xl mx-auto px-6 py-24">
        <div className="bg-gradient-to-br from-gray-800/60 to-gray-900/60 backdrop-blur-xl border border-gray-700/50 rounded-3xl p-12">
          <div className="text-center mb-12">
            <div className="inline-flex items-center space-x-2 mb-6">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="h-6 w-6 fill-yellow-400 text-yellow-400" />
              ))}
            </div>
            <h3 className="text-3xl font-bold mb-4">Trusted by Developers Worldwide</h3>
            <p className="text-gray-400 max-w-2xl mx-auto">
              Join thousands of developers who have transformed their interview skills
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              { name: "Sarah Chen", role: "Senior Frontend Dev", company: "TechCorp", text: "Landed my dream job after 2 weeks of practice!" },
              { name: "Alex Rodriguez", role: "Backend Engineer", company: "StartupXYZ", text: "The AI feedback helped me identify weaknesses I didn't know I had." },
              { name: "Priya Sharma", role: "Full Stack Developer", company: "GlobalTech", text: "From 5 rejections to 3 offers in one month." },
            ].map((testimonial, i) => (
              <div key={i} className="bg-gray-900/50 rounded-2xl p-8 border border-gray-700/50">
                <div className="flex items-center mb-6">
                  <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-bold mr-4">
                    {testimonial.name.charAt(0)}
                  </div>
                  <div>
                    <div className="font-bold">{testimonial.name}</div>
                    <div className="text-sm text-gray-400">{testimonial.role} • {testimonial.company}</div>
                  </div>
                </div>
                <p className="text-gray-300 italic">"{testimonial.text}"</p>
                <div className="flex items-center mt-6 pt-6 border-t border-gray-700/50">
                  <Award className="h-5 w-5 text-yellow-400 mr-2" />
                  <span className="text-sm text-gray-400">Success Story</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA Section */}
      <section className="relative z-10 max-w-7xl mx-auto px-6 py-24">
        <div className="bg-gradient-to-br from-blue-900/40 to-purple-900/40 backdrop-blur-xl border border-blue-700/30 rounded-3xl p-16 text-center relative overflow-hidden">
          <div className="absolute -top-20 -right-20 w-64 h-64 bg-blue-500/10 rounded-full blur-3xl"></div>
          <div className="absolute -bottom-20 -left-20 w-64 h-64 bg-purple-500/10 rounded-full blur-3xl"></div>
          
          <div className="relative z-10">
            <div className="inline-flex items-center justify-center w-24 h-24 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-3xl mb-8 mx-auto">
              <Brain className="h-12 w-12 text-white" />
            </div>
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              Ready to Ace Your Interview?
            </h2>
            <p className="text-xl text-gray-300 mb-10 max-w-2xl mx-auto">
              Join thousands of job seekers who have improved their interview skills with our AI platform.
              No credit card required for free trial.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
              <Link to="/setup" className="w-full sm:w-auto">
                <Button 
                  size="lg" 
                  className="w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white px-12 py-8 text-lg font-semibold rounded-xl shadow-2xl hover:shadow-3xl transition-all hover:scale-105"
                >
                  <Zap className="mr-3 h-6 w-6" />
                  Start Your Free Trial
                  <ArrowRight className="ml-3 h-5 w-5" />
                </Button>
              </Link>
              <Link to="/auth" className="w-full sm:w-auto">
                <Button 
                  size="lg" 
                  variant="outline" 
                  className="w-full border-gray-600 hover:border-blue-500 hover:bg-gray-800/50 text-gray-300 px-10 py-8 text-lg rounded-xl backdrop-blur-sm"
                >
                  <Headphones className="mr-3 h-6 w-6" />
                  Book a Demo
                </Button>
              </Link>
            </div>
            <div className="mt-10 flex flex-wrap items-center justify-center gap-8 text-sm text-gray-400">
              <div className="flex items-center">
                <CheckCircle className="h-5 w-5 text-green-400 mr-2" />
                <span>No credit card required</span>
              </div>
              <div className="flex items-center">
                <Clock className="h-5 w-5 text-blue-400 mr-2" />
                <span>7-day free trial</span>
              </div>
              <div className="flex items-center">
                <FileText className="h-5 w-5 text-purple-400 mr-2" />
                <span>Cancel anytime</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Enhanced Footer */}
      <footer className="relative z-10 bg-gradient-to-b from-gray-900 to-black border-t border-gray-800 pt-16 pb-12 mt-32">
        <div className="max-w-7xl mx-auto px-6">
          {/* Footer Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-12 mb-16">
            {/* Brand Column */}
            <div className="lg:col-span-2">
              <div className="flex items-center space-x-3 mb-6">
                <div className="w-12 h-12 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl flex items-center justify-center">
                  <Brain className="h-7 w-7 text-white" />
                </div>
                <div>
                  <div className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-400">
                    InterviewAceAI
                  </div>
                  <div className="text-sm text-gray-400">AI-Powered Interview Excellence</div>
                </div>
              </div>
              <p className="text-gray-400 max-w-md mb-8 leading-relaxed">
                We're on a mission to help developers worldwide ace their technical interviews 
                through AI-powered practice and personalized feedback.
              </p>
              <div className="flex items-center space-x-4">
                <a href="#" className="w-10 h-10 bg-gray-800 hover:bg-gray-700 rounded-lg flex items-center justify-center transition-colors">
                  <Twitter className="h-5 w-5 text-gray-400 hover:text-blue-400" />
                </a>
                <a href="#" className="w-10 h-10 bg-gray-800 hover:bg-gray-700 rounded-lg flex items-center justify-center transition-colors">
                  <Linkedin className="h-5 w-5 text-gray-400 hover:text-blue-600" />
                </a>
                <a href="#" className="w-10 h-10 bg-gray-800 hover:bg-gray-700 rounded-lg flex items-center justify-center transition-colors">
                  <Github className="h-5 w-5 text-gray-400 hover:text-white" />
                </a>
                <a href="#" className="w-10 h-10 bg-gray-800 hover:bg-gray-700 rounded-lg flex items-center justify-center transition-colors">
                  <Mail className="h-5 w-5 text-gray-400 hover:text-red-400" />
                </a>
              </div>
            </div>

            {/* Product Links */}
            <div>
              <h4 className="text-lg font-bold mb-6 flex items-center">
                <Sparkles className="h-5 w-5 mr-2 text-blue-400" />
                Product
              </h4>
              <ul className="space-y-4">
                {['Features', 'Pricing', 'Use Cases', 'Roadmap', 'Changelog'].map((item) => (
                  <li key={item}>
                    <a href="#" className="text-gray-400 hover:text-white hover:pl-2 transition-all flex items-center">
                      <ChevronRight className="h-4 w-4 mr-2 opacity-0 group-hover:opacity-100" />
                      {item}
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            {/* Resources Links */}
            <div>
              <h4 className="text-lg font-bold mb-6 flex items-center">
                <FileText className="h-5 w-5 mr-2 text-green-400" />
                Resources
              </h4>
              <ul className="space-y-4">
                {['Documentation', 'Blog', 'Tutorials', 'Community', 'Support'].map((item) => (
                  <li key={item}>
                    <a href="#" className="text-gray-400 hover:text-white hover:pl-2 transition-all flex items-center">
                      <ChevronRight className="h-4 w-4 mr-2 opacity-0 group-hover:opacity-100" />
                      {item}
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            {/* Company Links */}
            <div>
              <h4 className="text-lg font-bold mb-6 flex items-center">
                <Users className="h-5 w-5 mr-2 text-purple-400" />
                Company
              </h4>
              <ul className="space-y-4">
                {['About Us', 'Careers', 'Contact', 'Privacy', 'Terms'].map((item) => (
                  <li key={item}>
                    <a href="#" className="text-gray-400 hover:text-white hover:pl-2 transition-all flex items-center">
                      <ChevronRight className="h-4 w-4 mr-2 opacity-0 group-hover:opacity-100" />
                      {item}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Newsletter */}
          <div className="bg-gradient-to-r from-gray-800/50 to-gray-900/50 backdrop-blur-sm border border-gray-700/50 rounded-2xl p-8 mb-12">
            <div className="flex flex-col md:flex-row items-center justify-between">
              <div className="mb-6 md:mb-0 md:mr-8">
                <h4 className="text-xl font-bold mb-2">Stay Updated</h4>
                <p className="text-gray-400">Get the latest interview tips and platform updates</p>
              </div>
              <div className="flex w-full md:w-auto">
                <input 
                  type="email" 
                  placeholder="Your email address" 
                  className="flex-1 md:w-80 px-6 py-3 bg-gray-900 border border-gray-700 rounded-l-xl focus:outline-none focus:border-blue-500 text-white"
                />
                <Button className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 rounded-l-none rounded-r-xl px-8">
                  Subscribe
                </Button>
              </div>
            </div>
          </div>

          {/* Bottom Bar */}
          <div className="pt-8 border-t border-gray-800">
            <div className="flex flex-col  md:flex-row items-center justify-between gap-6">
              <div className="flex items-center space-x-2 text-gray-500">
                <span>© 2024 InterviewAceAI. All rights reserved.</span>
              </div>
              <div className="flex items-center space-x-6 text-sm text-gray-500">
                <a href="#" className="hover:text-gray-300 transition-colors">Privacy Policy</a>
                <span>•</span>
                <a href="#" className="hover:text-gray-300 transition-colors">Terms of Service</a>
                <span>•</span>
                <a href="#" className="hover:text-gray-300 transition-colors">Cookie Policy</a>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Landing;