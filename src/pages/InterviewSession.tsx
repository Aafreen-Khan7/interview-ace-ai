import { useState, useEffect, useRef, useCallback } from 'react';
import { useLocation, useNavigate, Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Progress } from '@/components/ui/progress';
import { Card, CardContent } from '@/components/ui/card';
import { 
  Brain, 
  Mic, 
  MicOff, 
  Send, 
  Camera,
  CameraOff,
  Loader2,
  CheckCircle2,
  XCircle,
  ArrowRight
} from 'lucide-react';
import { useInterview } from '@/hooks/useInterview';
import { QuestionFeedback } from '@/types/interview';
import { cn } from '@/lib/utils';

const InterviewSession = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const config = location.state?.config;
  
  const {
    session,
    currentQuestionIndex,
    isLoading,
    startInterview,
    submitAnswer,
    nextQuestion,
    endInterview,
    currentQuestion,
    progress
  } = useInterview();

  const [answer, setAnswer] = useState('');
  const [isRecording, setIsRecording] = useState(false);
  const [cameraEnabled, setCameraEnabled] = useState(false);
  const [currentFeedback, setCurrentFeedback] = useState<QuestionFeedback | null>(null);
  const [showFeedback, setShowFeedback] = useState(false);
  
  const videoRef = useRef<HTMLVideoElement>(null);
  const mediaStreamRef = useRef<MediaStream | null>(null);

  useEffect(() => {
    if (!config) {
      navigate('/setup');
      return;
    }
    startInterview(config);
  }, [config, navigate, startInterview]);

  const toggleCamera = useCallback(async () => {
    if (cameraEnabled) {
      mediaStreamRef.current?.getTracks().forEach(track => track.stop());
      setCameraEnabled(false);
    } else {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: true });
        mediaStreamRef.current = stream;
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }
        setCameraEnabled(true);
      } catch (err) {
        console.error('Camera access denied:', err);
      }
    }
  }, [cameraEnabled]);

  const handleSubmitAnswer = async () => {
    if (!answer.trim() || isLoading) return;
    
    const feedback = await submitAnswer(answer);
    setCurrentFeedback(feedback);
    setShowFeedback(true);
    setAnswer('');
  };

  const handleNextQuestion = () => {
    if (session && currentQuestionIndex >= session.questions.length - 1) {
      const completedSession = endInterview();
      navigate('/results', { state: { session: completedSession } });
    } else {
      nextQuestion();
      setShowFeedback(false);
      setCurrentFeedback(null);
    }
  };

  const toggleRecording = () => {
    setIsRecording(!isRecording);
    // Voice recording would be implemented here with Web Speech API
  };

  if (!session || !currentQuestion) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-12 h-12 animate-spin text-primary mx-auto mb-4" />
          <p className="text-muted-foreground">Preparing your interview...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Background effects */}
      <div className="fixed inset-0 bg-grid-pattern bg-grid opacity-10" />
      
      {/* Header */}
      <header className="relative z-10 border-b border-border/50 backdrop-blur-sm">
        <div className="flex items-center justify-between p-4 max-w-6xl mx-auto">
          <Link to="/" className="flex items-center gap-2">
            <Brain className="w-6 h-6 text-primary" />
            <span className="font-display font-bold">InterviewAI</span>
          </Link>
          <div className="flex items-center gap-4">
            <span className="text-sm text-muted-foreground">
              Question {currentQuestionIndex + 1} of {session.questions.length}
            </span>
            <Progress value={progress} className="w-32 h-2" />
          </div>
        </div>
      </header>

      <main className="relative z-10 max-w-6xl mx-auto p-6">
        <div className="grid lg:grid-cols-3 gap-6">
          {/* Camera Preview */}
          <div className="lg:col-span-1 order-2 lg:order-1">
            <Card className="glass-card border-border/50 overflow-hidden">
              <CardContent className="p-0">
                <div className="aspect-[4/3] bg-secondary relative">
                  {cameraEnabled ? (
                    <video 
                      ref={videoRef}
                      autoPlay 
                      muted 
                      playsInline
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <div className="text-center">
                        <CameraOff className="w-12 h-12 text-muted-foreground mx-auto mb-2" />
                        <p className="text-sm text-muted-foreground">Camera off</p>
                      </div>
                    </div>
                  )}
                  
                  {/* Camera controls */}
                  <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
                    <Button
                      size="icon"
                      variant={cameraEnabled ? "default" : "secondary"}
                      onClick={toggleCamera}
                      className="rounded-full"
                    >
                      {cameraEnabled ? <Camera className="w-4 h-4" /> : <CameraOff className="w-4 h-4" />}
                    </Button>
                    <Button
                      size="icon"
                      variant={isRecording ? "destructive" : "secondary"}
                      onClick={toggleRecording}
                      className="rounded-full"
                    >
                      {isRecording ? <Mic className="w-4 h-4" /> : <MicOff className="w-4 h-4" />}
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Interview Info */}
            <Card className="glass-card border-border/50 mt-4">
              <CardContent className="p-4">
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Role</span>
                    <span className="capitalize">{session.jobRole.replace('-', ' ')}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Difficulty</span>
                    <span className="capitalize">{session.difficulty}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Type</span>
                    <span className="capitalize">{currentQuestion.type}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Question & Answer Area */}
          <div className="lg:col-span-2 order-1 lg:order-2 space-y-6">
            {!showFeedback ? (
              <>
                {/* Question Card */}
                <Card className="glass-card border-primary/30 glow-effect">
                  <CardContent className="p-6">
                    <div className="flex items-start gap-4">
                      <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0">
                        <Brain className="w-5 h-5 text-primary" />
                      </div>
                      <div>
                        <p className="text-xs text-primary mb-2 uppercase tracking-wide">
                          {currentQuestion.type} Question
                        </p>
                        <p className="text-lg font-medium leading-relaxed">
                          {currentQuestion.question}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Answer Input */}
                <Card className="glass-card border-border/50">
                  <CardContent className="p-6">
                    <p className="text-sm text-muted-foreground mb-4 flex items-center gap-2">
                      {currentQuestion.answerMode === 'voice' ? (
                        <>
                          <Mic className="w-4 h-4" />
                          Voice response recommended, or type below
                        </>
                      ) : (
                        <>Type your answer below</>
                      )}
                    </p>
                    <Textarea
                      value={answer}
                      onChange={(e) => setAnswer(e.target.value)}
                      placeholder="Type your answer here..."
                      className="min-h-[150px] bg-secondary/50 border-border/50 resize-none"
                      disabled={isLoading}
                    />
                    <div className="flex justify-between items-center mt-4">
                      <span className="text-xs text-muted-foreground">
                        {answer.length} characters
                      </span>
                      <Button
                        onClick={handleSubmitAnswer}
                        disabled={!answer.trim() || isLoading}
                        className="bg-primary text-primary-foreground hover:bg-primary/90"
                      >
                        {isLoading ? (
                          <>
                            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                            Evaluating...
                          </>
                        ) : (
                          <>
                            Submit Answer
                            <Send className="w-4 h-4 ml-2" />
                          </>
                        )}
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </>
            ) : (
              /* Feedback Display */
              <Card className="glass-card border-border/50 animate-scale-in">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-6">
                    <h3 className="text-xl font-display font-bold">Question Feedback</h3>
                    <div className="flex items-center gap-2">
                      <span className="text-3xl font-display font-bold text-primary">
                        {currentFeedback?.score}
                      </span>
                      <span className="text-muted-foreground">/10</span>
                    </div>
                  </div>

                  {/* Score Breakdown */}
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                    {[
                      { label: 'Clarity', value: currentFeedback?.clarity },
                      { label: 'Relevance', value: currentFeedback?.relevance },
                      { label: 'Technical', value: currentFeedback?.technicalAccuracy },
                      { label: 'Communication', value: currentFeedback?.communication },
                    ].map((metric, i) => (
                      <div key={i} className="text-center p-3 rounded-lg bg-secondary/50">
                        <p className="text-2xl font-bold">{metric.value}</p>
                        <p className="text-xs text-muted-foreground">{metric.label}</p>
                      </div>
                    ))}
                  </div>

                  {/* Strengths & Weaknesses */}
                  <div className="grid md:grid-cols-2 gap-4 mb-6">
                    <div className="p-4 rounded-lg bg-success/10 border border-success/20">
                      <h4 className="font-semibold text-success flex items-center gap-2 mb-2">
                        <CheckCircle2 className="w-4 h-4" />
                        Strengths
                      </h4>
                      <ul className="space-y-1">
                        {currentFeedback?.strengths.map((s, i) => (
                          <li key={i} className="text-sm text-muted-foreground">• {s}</li>
                        ))}
                      </ul>
                    </div>
                    <div className="p-4 rounded-lg bg-warning/10 border border-warning/20">
                      <h4 className="font-semibold text-warning flex items-center gap-2 mb-2">
                        <XCircle className="w-4 h-4" />
                        Areas to Improve
                      </h4>
                      <ul className="space-y-1">
                        {currentFeedback?.weaknesses.map((w, i) => (
                          <li key={i} className="text-sm text-muted-foreground">• {w}</li>
                        ))}
                      </ul>
                    </div>
                  </div>

                  {/* Improvements */}
                  <div className="p-4 rounded-lg bg-info/10 border border-info/20 mb-6">
                    <h4 className="font-semibold text-info mb-2">Suggestions</h4>
                    <ul className="space-y-1">
                      {currentFeedback?.improvements.map((imp, i) => (
                        <li key={i} className="text-sm text-muted-foreground">• {imp}</li>
                      ))}
                    </ul>
                  </div>

                  <Button
                    onClick={handleNextQuestion}
                    className="w-full bg-primary text-primary-foreground hover:bg-primary/90"
                  >
                    {currentQuestionIndex >= session.questions.length - 1 ? (
                      <>
                        View Final Results
                        <ArrowRight className="w-4 h-4 ml-2" />
                      </>
                    ) : (
                      <>
                        Next Question
                        <ArrowRight className="w-4 h-4 ml-2" />
                      </>
                    )}
                  </Button>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default InterviewSession;
