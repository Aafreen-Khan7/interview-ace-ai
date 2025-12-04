import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { 
  Brain, 
  Play, 
  TrendingUp, 
  Clock, 
  Target, 
  Award,
  BarChart3,
  Calendar,
  ArrowRight
} from 'lucide-react';
import { generateMockAnalytics } from '@/lib/mockData';
import { AreaChart, Area, XAxis, YAxis, ResponsiveContainer, Tooltip } from 'recharts';

const Dashboard = () => {
  const analytics = generateMockAnalytics();
  
  const recentSessions = JSON.parse(localStorage.getItem('interviewHistory') || '[]').slice(-5).reverse();

  return (
    <div className="min-h-screen bg-background">
      {/* Background effects */}
      <div className="fixed inset-0 bg-grid-pattern bg-grid opacity-20" />
      <div className="fixed top-0 right-0 w-96 h-96 bg-primary/10 rounded-full blur-[100px]" />
      
      {/* Navigation */}
      <nav className="relative z-10 border-b border-border/50 backdrop-blur-sm">
        <div className="flex items-center justify-between p-4 max-w-7xl mx-auto">
          <Link to="/" className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-primary/20 flex items-center justify-center">
              <Brain className="w-5 h-5 text-primary" />
            </div>
            <span className="text-lg font-display font-bold">InterviewAI</span>
          </Link>
          <Link to="/setup">
            <Button className="bg-primary text-primary-foreground hover:bg-primary/90">
              <Play className="w-4 h-4 mr-2" />
              New Interview
            </Button>
          </Link>
        </div>
      </nav>

      <main className="relative z-10 max-w-7xl mx-auto p-6">
        {/* Welcome Section */}
        <div className="mb-8">
          <h1 className="text-3xl font-display font-bold mb-2">Welcome back!</h1>
          <p className="text-muted-foreground">Track your progress and continue improving.</p>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {[
            { icon: Target, label: 'Total Sessions', value: analytics.totalSessions, color: 'text-primary' },
            { icon: TrendingUp, label: 'Average Score', value: `${analytics.averageScore}/10`, color: 'text-success' },
            { icon: Clock, label: 'This Week', value: Math.min(analytics.totalSessions, 3), color: 'text-info' },
            { icon: Award, label: 'Best Score', value: analytics.totalSessions > 0 ? '8/10' : '-', color: 'text-warning' },
          ].map((stat, i) => (
            <Card key={i} className="glass-card border-border/50">
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 rounded-lg bg-secondary flex items-center justify-center`}>
                    <stat.icon className={`w-5 h-5 ${stat.color}`} />
                  </div>
                  <div>
                    <p className="text-2xl font-display font-bold">{stat.value}</p>
                    <p className="text-xs text-muted-foreground">{stat.label}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Score Trend Chart */}
          <Card className="lg:col-span-2 glass-card border-border/50">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <BarChart3 className="w-5 h-5 text-primary" />
                Performance Trend
              </CardTitle>
            </CardHeader>
            <CardContent>
              {analytics.scoreHistory.length > 0 ? (
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={analytics.scoreHistory}>
                      <defs>
                        <linearGradient id="scoreGradient" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.3} />
                          <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0} />
                        </linearGradient>
                      </defs>
                      <XAxis dataKey="date" stroke="hsl(var(--muted-foreground))" fontSize={12} />
                      <YAxis domain={[0, 10]} stroke="hsl(var(--muted-foreground))" fontSize={12} />
                      <Tooltip 
                        contentStyle={{ 
                          backgroundColor: 'hsl(var(--card))', 
                          border: '1px solid hsl(var(--border))',
                          borderRadius: '8px'
                        }}
                      />
                      <Area 
                        type="monotone" 
                        dataKey="score" 
                        stroke="hsl(var(--primary))" 
                        fill="url(#scoreGradient)"
                        strokeWidth={2}
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              ) : (
                <div className="h-64 flex items-center justify-center text-muted-foreground">
                  <div className="text-center">
                    <BarChart3 className="w-12 h-12 mx-auto mb-4 opacity-50" />
                    <p>Complete your first interview to see trends</p>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Skills Breakdown */}
          <Card className="glass-card border-border/50">
            <CardHeader>
              <CardTitle className="text-lg">Skill Breakdown</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {analytics.skillBreakdown.map((skill, i) => (
                <div key={i}>
                  <div className="flex justify-between text-sm mb-1">
                    <span>{skill.skill}</span>
                    <span className="text-muted-foreground">{skill.score}/10</span>
                  </div>
                  <Progress value={skill.score * 10} className="h-2" />
                </div>
              ))}
            </CardContent>
          </Card>
        </div>

        {/* Recent Sessions */}
        <Card className="mt-6 glass-card border-border/50">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="flex items-center gap-2 text-lg">
              <Calendar className="w-5 h-5 text-primary" />
              Recent Sessions
            </CardTitle>
          </CardHeader>
          <CardContent>
            {recentSessions.length > 0 ? (
              <div className="space-y-3">
                {recentSessions.map((session: any, i: number) => (
                  <div 
                    key={i} 
                    className="flex items-center justify-between p-4 rounded-lg bg-secondary/50 hover:bg-secondary transition-colors"
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                        <Target className="w-5 h-5 text-primary" />
                      </div>
                      <div>
                        <p className="font-medium capitalize">{session.jobRole?.replace('-', ' ')}</p>
                        <p className="text-sm text-muted-foreground">
                          {new Date(session.createdAt).toLocaleDateString()} • {session.questions?.length || 0} questions
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-lg font-bold text-primary">{session.totalScore}/10</p>
                      <p className="text-xs text-muted-foreground capitalize">{session.difficulty}</p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12 text-muted-foreground">
                <Calendar className="w-12 h-12 mx-auto mb-4 opacity-50" />
                <p className="mb-4">No interview sessions yet</p>
                <Link to="/setup">
                  <Button className="bg-primary text-primary-foreground hover:bg-primary/90">
                    Start Your First Interview
                    <ArrowRight className="ml-2 w-4 h-4" />
                  </Button>
                </Link>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Improvement Areas */}
        {analytics.improvementAreas.length > 0 && analytics.totalSessions > 0 && (
          <Card className="mt-6 glass-card border-border/50">
            <CardHeader>
              <CardTitle className="text-lg">Areas for Improvement</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2">
                {analytics.improvementAreas.map((area, i) => (
                  <span 
                    key={i}
                    className="px-3 py-1.5 rounded-full bg-accent/20 text-accent-foreground text-sm"
                  >
                    {area}
                  </span>
                ))}
              </div>
            </CardContent>
          </Card>
        )}
      </main>
    </div>
  );
};

export default Dashboard;
