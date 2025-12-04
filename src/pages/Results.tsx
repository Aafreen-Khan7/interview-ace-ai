import { useLocation, useNavigate, Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { 
  Brain, 
  Trophy, 
  Target, 
  TrendingUp, 
  RotateCcw,
  Home,
  CheckCircle2,
  XCircle,
  Lightbulb
} from 'lucide-react';
import { InterviewSession } from '@/types/interview';
import { RadarChart, PolarGrid, PolarAngleAxis, Radar, ResponsiveContainer } from 'recharts';

const Results = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const session: InterviewSession = location.state?.session;

  if (!session) {
    navigate('/dashboard');
    return null;
  }

  const getScoreColor = (score: number) => {
    if (score >= 8) return 'text-success';
    if (score >= 6) return 'text-warning';
    return 'text-destructive';
  };

  const getScoreLabel = (score: number) => {
    if (score >= 9) return 'Excellent!';
    if (score >= 8) return 'Great Job!';
    if (score >= 6) return 'Good Progress';
    if (score >= 4) return 'Keep Practicing';
    return 'Needs Work';
  };

  // Aggregate feedback data
  const avgClarity = Math.round(session.feedback.reduce((a, f) => a + f.clarity, 0) / session.feedback.length);
  const avgRelevance = Math.round(session.feedback.reduce((a, f) => a + f.relevance, 0) / session.feedback.length);
  const avgTechnical = Math.round(session.feedback.reduce((a, f) => a + (f.technicalAccuracy || 0), 0) / session.feedback.length);
  const avgCommunication = Math.round(session.feedback.reduce((a, f) => a + f.communication, 0) / session.feedback.length);

  const radarData = [
    { skill: 'Clarity', value: avgClarity * 10 },
    { skill: 'Relevance', value: avgRelevance * 10 },
    { skill: 'Technical', value: avgTechnical * 10 },
    { skill: 'Communication', value: avgCommunication * 10 },
  ];

  const allStrengths = [...new Set(session.feedback.flatMap(f => f.strengths))].slice(0, 4);
  const allWeaknesses = [...new Set(session.feedback.flatMap(f => f.weaknesses))].slice(0, 4);
  const allImprovements = [...new Set(session.feedback.flatMap(f => f.improvements))].slice(0, 4);

  return (
    <div className="min-h-screen bg-background">
      {/* Background effects */}
      <div className="fixed inset-0 bg-grid-pattern bg-grid opacity-20" />
      <div className="fixed top-0 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-primary/10 rounded-full blur-[150px]" />
      
      {/* Header */}
      <header className="relative z-10 border-b border-border/50 backdrop-blur-sm">
        <div className="flex items-center justify-between p-4 max-w-5xl mx-auto">
          <Link to="/" className="flex items-center gap-2">
            <Brain className="w-6 h-6 text-primary" />
            <span className="font-display font-bold">InterviewAI</span>
          </Link>
        </div>
      </header>

      <main className="relative z-10 max-w-5xl mx-auto p-6 py-12">
        {/* Score Hero */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass-card mb-6">
            <Trophy className="w-4 h-4 text-primary" />
            <span className="text-sm">Interview Complete!</span>
          </div>
          
          <h1 className="text-4xl font-display font-bold mb-4">
            {getScoreLabel(session.totalScore)}
          </h1>
          
          <div className="flex items-center justify-center gap-4 mb-6">
            <div className={`text-7xl font-display font-bold ${getScoreColor(session.totalScore)}`}>
              {session.totalScore}
            </div>
            <div className="text-left">
              <div className="text-2xl text-muted-foreground">/10</div>
              <div className="text-sm text-muted-foreground">Overall Score</div>
            </div>
          </div>

          <div className="flex items-center justify-center gap-6 text-sm text-muted-foreground">
            <span className="capitalize">{session.jobRole.replace('-', ' ')}</span>
            <span>•</span>
            <span className="capitalize">{session.difficulty}</span>
            <span>•</span>
            <span>{session.questions.length} Questions</span>
          </div>
        </div>

        <div className="grid lg:grid-cols-2 gap-6 mb-8">
          {/* Skills Radar */}
          <Card className="glass-card border-border/50">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Target className="w-5 h-5 text-primary" />
                Performance Breakdown
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <RadarChart data={radarData}>
                    <PolarGrid stroke="hsl(var(--border))" />
                    <PolarAngleAxis 
                      dataKey="skill" 
                      tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 12 }}
                    />
                    <Radar
                      name="Score"
                      dataKey="value"
                      stroke="hsl(var(--primary))"
                      fill="hsl(var(--primary))"
                      fillOpacity={0.3}
                    />
                  </RadarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          {/* Score by Question */}
          <Card className="glass-card border-border/50">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-primary" />
                Question-by-Question
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {session.feedback.map((feedback, i) => (
                <div key={i}>
                  <div className="flex justify-between text-sm mb-1">
                    <span>Question {i + 1}</span>
                    <span className={getScoreColor(feedback.score)}>{feedback.score}/10</span>
                  </div>
                  <Progress value={feedback.score * 10} className="h-2" />
                </div>
              ))}
            </CardContent>
          </Card>
        </div>

        {/* Feedback Summary */}
        <div className="grid md:grid-cols-3 gap-6 mb-8">
          <Card className="glass-card border-success/20 bg-success/5">
            <CardContent className="p-6">
              <h3 className="font-semibold text-success flex items-center gap-2 mb-4">
                <CheckCircle2 className="w-5 h-5" />
                Your Strengths
              </h3>
              <ul className="space-y-2">
                {allStrengths.map((s, i) => (
                  <li key={i} className="text-sm text-muted-foreground flex items-start gap-2">
                    <span className="text-success mt-1">•</span>
                    {s}
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>

          <Card className="glass-card border-warning/20 bg-warning/5">
            <CardContent className="p-6">
              <h3 className="font-semibold text-warning flex items-center gap-2 mb-4">
                <XCircle className="w-5 h-5" />
                Areas to Improve
              </h3>
              <ul className="space-y-2">
                {allWeaknesses.map((w, i) => (
                  <li key={i} className="text-sm text-muted-foreground flex items-start gap-2">
                    <span className="text-warning mt-1">•</span>
                    {w}
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>

          <Card className="glass-card border-info/20 bg-info/5">
            <CardContent className="p-6">
              <h3 className="font-semibold text-info flex items-center gap-2 mb-4">
                <Lightbulb className="w-5 h-5" />
                Recommendations
              </h3>
              <ul className="space-y-2">
                {allImprovements.map((imp, i) => (
                  <li key={i} className="text-sm text-muted-foreground flex items-start gap-2">
                    <span className="text-info mt-1">•</span>
                    {imp}
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link to="/setup">
            <Button size="lg" className="bg-primary text-primary-foreground hover:bg-primary/90 glow-effect">
              <RotateCcw className="w-4 h-4 mr-2" />
              Practice Again
            </Button>
          </Link>
          <Link to="/dashboard">
            <Button size="lg" variant="outline" className="border-border/50">
              <Home className="w-4 h-4 mr-2" />
              Go to Dashboard
            </Button>
          </Link>
        </div>
      </main>
    </div>
  );
};

export default Results;
