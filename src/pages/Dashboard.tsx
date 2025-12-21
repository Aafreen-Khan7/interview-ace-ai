import { useEffect, useState } from 'react';
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
  ArrowRight,
  LogOut,
  Loader2
} from 'lucide-react';
import { getUserAnalytics, getUserInterviews, UserAnalytics, FirestoreInterviewSession } from '@/services/firebaseService';
import { AreaChart, Area, XAxis, YAxis, ResponsiveContainer, Tooltip } from 'recharts';
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';

const Dashboard = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [analytics, setAnalytics] = useState<UserAnalytics | null>(null);
  const [recentSessions, setRecentSessions] = useState<FirestoreInterviewSession[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      if (!user) return;
      try {
        const [analyticsData, sessions] = await Promise.all([
          getUserAnalytics(user.id),
          getUserInterviews(user.id),
        ]);
        setAnalytics(analyticsData);
        setRecentSessions(sessions.slice(0, 5));
      } catch (error) {
        console.error('Error loading dashboard data:', error);
      } finally {
        setIsLoading(false);
      }
    };
    loadData();
  }, [user]);

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="fixed inset-0 bg-grid-pattern bg-grid opacity-20" />
      <div className="fixed top-0 right-0 w-96 h-96 bg-primary/10 rounded-full blur-[100px]" />
      
      <nav className="relative z-10 border-b border-border/50 backdrop-blur-sm">
        <div className="flex items-center justify-between p-4 max-w-7xl mx-auto">
          <Link to="/" className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-primary/20 flex items-center justify-center">
              <Brain className="w-5 h-5 text-primary" />
            </div>
            <span className="text-lg font-display font-bold">InterviewAI</span>
          </Link>
          <div className="flex items-center gap-4">
            <Link to="/setup">
              <Button className="bg-primary text-primary-foreground hover:bg-primary/90">
                <Play className="w-4 h-4 mr-2" />
                New Interview
              </Button>
            </Link>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="relative h-10 w-10 rounded-full">
                  <Avatar className="h-10 w-10">
                    <AvatarFallback className="bg-primary/20 text-primary">
                      {user?.name?.charAt(0)?.toUpperCase() || 'U'}
                    </AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56" align="end">
                <div className="flex items-center gap-2 p-2">
                  <Avatar className="h-8 w-8">
                    <AvatarFallback className="bg-primary/20 text-primary text-sm">
                      {user?.name?.charAt(0)?.toUpperCase() || 'U'}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex flex-col">
                    <p className="text-sm font-medium">{user?.name}</p>
                    <p className="text-xs text-muted-foreground">{user?.email}</p>
                  </div>
                </div>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <Link to="/profile" className="cursor-pointer">
                    Profile Settings
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleLogout} className="text-destructive cursor-pointer">
                  <LogOut className="w-4 h-4 mr-2" />
                  Logout
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </nav>

      <main className="relative z-10 max-w-7xl mx-auto p-6">
        <div className="mb-8">
          <h1 className="text-3xl font-display font-bold mb-2">Welcome back, {user?.name?.split(' ')[0]}!</h1>
          <p className="text-muted-foreground">Track your progress and continue improving.</p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {[
            { icon: Target, label: 'Total Sessions', value: analytics?.totalSessions || 0, color: 'text-primary' },
            { icon: TrendingUp, label: 'Average Score', value: `${analytics?.averageScore || 0}/10`, color: 'text-success' },
            { icon: Clock, label: 'This Week', value: recentSessions.filter(s => s.createdAt > new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)).length, color: 'text-info' },
            { icon: Award, label: 'Best Score', value: recentSessions.length > 0 ? `${Math.max(...recentSessions.map(s => s.totalScore))}/10` : '-', color: 'text-warning' },
          ].map((stat, i) => (
            <Card key={i} className="glass-card border-border/50">
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-secondary flex items-center justify-center">
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
          <Card className="lg:col-span-2 glass-card border-border/50">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <BarChart3 className="w-5 h-5 text-primary" />
                Performance Trend
              </CardTitle>
            </CardHeader>
            <CardContent>
              {analytics?.scoreHistory && analytics.scoreHistory.length > 0 ? (
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
                      <Tooltip contentStyle={{ backgroundColor: 'hsl(var(--card))', border: '1px solid hsl(var(--border))', borderRadius: '8px' }} />
                      <Area type="monotone" dataKey="score" stroke="hsl(var(--primary))" fill="url(#scoreGradient)" strokeWidth={2} />
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

          <Card className="glass-card border-border/50">
            <CardHeader>
              <CardTitle className="text-lg">Skill Breakdown</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {analytics?.skillBreakdown && analytics.skillBreakdown.length > 0 ? (
                analytics.skillBreakdown.map((skill, i) => (
                  <div key={i}>
                    <div className="flex justify-between text-sm mb-1">
                      <span>{skill.skill}</span>
                      <span className="text-muted-foreground">{skill.score}/10</span>
                    </div>
                    <Progress value={skill.score * 10} className="h-2" />
                  </div>
                ))
              ) : (
                <p className="text-muted-foreground text-sm">Complete interviews to see skill breakdown</p>
              )}
            </CardContent>
          </Card>
        </div>

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
                {recentSessions.map((session) => (
                  <div key={session.id} className="flex items-center justify-between p-4 rounded-lg bg-secondary/50 hover:bg-secondary transition-colors">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                        <Target className="w-5 h-5 text-primary" />
                      </div>
                      <div>
                        <p className="font-medium capitalize">{session.jobRole?.replace('-', ' ')}</p>
                        <p className="text-sm text-muted-foreground">
                          {session.createdAt.toLocaleDateString()} • {session.questions?.length || 0} questions
                          {session.resumeUsed && ' • Resume-based'}
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
      </main>
    </div>
  );
};

export default Dashboard;
