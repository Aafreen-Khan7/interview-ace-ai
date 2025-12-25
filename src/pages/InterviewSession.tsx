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
  ArrowRight,
  Clock,
  TrendingUp,
  TrendingDown
} from 'lucide-react';
import { useInterview } from '@/hooks/useInterview';
import { InterviewTimer } from '@/components/InterviewTimer';
import ProctoringOverlay from '@/components/ProctoringOverlay';
import useProctor from '@/hooks/useProctor';
import useProctorStore from '@/store/useProctorStore';
import { QuestionFeedback } from '@/types/interview';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';

const InterviewSession = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const config = location.state?.config;
  
  const {
    session,
    currentQuestionIndex,
    isLoading,
    isGenerating,
    startInterview,
    submitAnswer,
    nextQuestion,
    endInterview,
    currentQuestion,
    progress,
    error,
    timeLimit
  } = useInterview();

  const [answer, setAnswer] = useState('');
  const [isRecording, setIsRecording] = useState(false);
  const [cameraEnabled, setCameraEnabled] = useState(false);
  const [currentFeedback, setCurrentFeedback] = useState<QuestionFeedback | null>(null);
  const [showFeedback, setShowFeedback] = useState(false);
  const [timerActive, setTimerActive] = useState(false);
  const [elapsedTime, setElapsedTime] = useState(0);
  
  const videoRef = useRef<HTMLVideoElement>(null);
  const mediaStreamRef = useRef<MediaStream | null>(null);
  const [mediaStream, setMediaStream] = useState<MediaStream | null>(null);
  const startProctor = useProctorStore((s) => s.start);
  const stopProctor = useProctorStore((s) => s.stop);

  // Callback ref to ensure video element gets the stream immediately when mounted
  const setVideoRef = useCallback((element: HTMLVideoElement | null) => {
    videoRef.current = element;
    if (element && mediaStreamRef.current) {
      element.srcObject = mediaStreamRef.current;
    }
  }, []);

  useEffect(() => {
    if (!config) {
      navigate('/setup');
      return;
    }

    const init = async () => {
      if (config.proctorEnabled) {
        try {
          const stream = await navigator.mediaDevices.getUserMedia({ video: true });
          mediaStreamRef.current = stream;
          setMediaStream(stream);
          if (videoRef.current) videoRef.current.srcObject = stream;
          setCameraEnabled(true);
          startProctor();

          // wait for proctor init (ready or error) with timeout
          const start = Date.now();
          const timeout = 10000; // ms
          while (true) {
            const st = useProctorStore.getState().status;
            if (st === 'ready') break;
            if (st === 'error') {
              toast.error('Proctoring failed to initialize. Please check your browser or model files.');
              // stop proctor and return to setup
              stopProctor();
              navigate('/setup');
              return;
            }
            if (Date.now() - start > timeout) {
              toast.error('Proctoring initialization timed out. Please try again.');
              stopProctor();
              navigate('/setup');
              return;
            }
            // small delay
            // eslint-disable-next-line no-await-in-loop
            await new Promise((r) => setTimeout(r, 200));
          }
        } catch (err) {
          console.error('Camera permission required for proctoring', err);
          toast.error('Camera permission is required for proctoring. Please enable it to continue.');
          navigate('/setup');
          return;
        }
      }

      startInterview(config);
    };

    init();
  }, [config, navigate, startInterview, startProctor]);

  // Ensure video stream is attached when camera is enabled
  useEffect(() => {
    if (cameraEnabled && videoRef.current && mediaStreamRef.current) {
      videoRef.current.srcObject = mediaStreamRef.current;
    }
  }, [cameraEnabled]);

  // Start timer when question loads
  useEffect(() => {
    if (session && currentQuestion && !showFeedback) {
      setTimerActive(true);
      setElapsedTime(0);
    }
  }, [session, currentQuestion, showFeedback, currentQuestionIndex]);

  const toggleCamera = useCallback(async () => {
    // If proctoring is required, prevent turning off camera
    if (cameraEnabled) {
      if (config?.proctorEnabled) {
        toast.warning('Camera must remain enabled for proctored interviews.');
        return;
      }
      mediaStreamRef.current?.getTracks().forEach(track => track.stop());
      stopProctor();
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
  }, [cameraEnabled, config, stopProctor]);

  const handleTimeUp = useCallback(() => {
    toast.warning("Time's up! Submitting your current answer...");
    if (answer.trim()) {
      handleSubmitAnswer();
    } else {
      // Auto-submit with empty answer penalty
      handleSubmitAnswer();
    }
  }, [answer]);

  const handleTimeUpdate = useCallback((elapsed: number) => {
    setElapsedTime(elapsed);
  }, []);

  // Initialize proctoring hook (reads store.enabled internally)
  const handleProctorWarning = useCallback((type: string, message?: string) => {
    if (message) toast.warning(message);
  }, []);

  useProctor({ videoRef, onWarning: handleProctorWarning });

  const handleSubmitAnswer = async () => {
    if (isLoading) return;
    
    setTimerActive(false);
    const timeTaken = elapsedTime;
    
    try {
      const feedback = await submitAnswer(answer || "(No answer provided)", timeTaken);
      setCurrentFeedback(feedback);
      setShowFeedback(true);
      setAnswer('');
    } catch (err) {
      // Error handled in hook
    }
  };

  const handleNextQuestion = async () => {
    if (session && currentQuestionIndex >= session.questions.length - 1) {
      const completedSession = await endInterview();
      navigate('/results', { state: { session: completedSession } });
    } else {
      nextQuestion();
      setShowFeedback(false);
      setCurrentFeedback(null);
      setElapsedTime(0);
    }
  };

  const toggleRecording = () => {
    setIsRecording(!isRecording);
  };

  if (error) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 rounded-full bg-destructive/20 flex items-center justify-center mx-auto mb-4">
            <Brain className="w-8 h-8 text-destructive" />
          </div>
          <p className="text-destructive mb-4">{error}</p>
          <Button onClick={() => navigate('/setup')} variant="outline">
            Go Back to Setup
          </Button>
        </div>
      </div>
    );
  }

  if (isGenerating || !session || !currentQuestion) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-12 h-12 animate-spin text-primary mx-auto mb-4" />
          <p className="text-muted-foreground">
            {isGenerating ? 'Generating AI questions...' : 'Preparing your interview...'}
          </p>
          {isGenerating && (
            <p className="text-xs text-muted-foreground mt-2">This may take a few seconds</p>
          )}
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
        {config?.proctorEnabled && (
          <ProctoringOverlay enabledByDefault={true} videoRef={videoRef} cameraEnabled={cameraEnabled} stream={mediaStream} />
        )}
        <div className="grid lg:grid-cols-3 gap-6">
          {/* Camera Preview */}
          <div className="lg:col-span-1 order-2 lg:order-1">
            <Card className="glass-card border-border/50 overflow-hidden">
              <CardContent className="p-0">
                <div className="aspect-[4/3] bg-secondary relative">
                  {cameraEnabled ? (
                    <video 
                      ref={setVideoRef}
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
                {/* Timer and Question Card */}
                <div className="flex gap-4">
                  {/* Timer */}
                  <Card className="glass-card border-border/50 flex-shrink-0">
                    <CardContent className="p-4">
                      <InterviewTimer
                        timeLimit={currentQuestion.timeLimit || timeLimit}
                        isActive={timerActive && !isLoading}
                        onTimeUp={handleTimeUp}
                        onTimeUpdate={handleTimeUpdate}
                      />
                    </CardContent>
                  </Card>
                  
                  {/* Question Card */}
                  <Card className="glass-card border-primary/30 glow-effect flex-1">
                    <CardContent className="p-6">
                      <div className="flex items-start gap-4">
                        <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0">
                          <Brain className="w-5 h-5 text-primary" />
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center justify-between mb-2">
                            <p className="text-xs text-primary uppercase tracking-wide">
                              {currentQuestion.type} Question
                            </p>
                            <span className="text-xs text-muted-foreground flex items-center gap-1">
                              <Clock className="w-3 h-3" />
                              {Math.floor((currentQuestion.timeLimit || timeLimit) / 60)}:{((currentQuestion.timeLimit || timeLimit) % 60).toString().padStart(2, '0')} limit
                            </span>
                          </div>
                          <p className="text-lg font-medium leading-relaxed">
                            {currentQuestion.question}
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>

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
                        disabled={isLoading}
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
                    <div className="flex items-center gap-4">
                      {/* Time bonus display */}
                      {currentFeedback?.timeBonus !== 0 && (
                        <div className={cn(
                          "flex items-center gap-1 px-2 py-1 rounded-full text-sm font-medium",
                          currentFeedback?.timeBonus && currentFeedback.timeBonus > 0 
                            ? "bg-success/20 text-success" 
                            : "bg-destructive/20 text-destructive"
                        )}>
                          {currentFeedback?.timeBonus && currentFeedback.timeBonus > 0 ? (
                            <TrendingUp className="w-3 h-3" />
                          ) : (
                            <TrendingDown className="w-3 h-3" />
                          )}
                          {currentFeedback?.timeBonus && currentFeedback.timeBonus > 0 ? '+' : ''}
                          {currentFeedback?.timeBonus?.toFixed(1)} time bonus
                        </div>
                      )}
                      <div className="flex items-center gap-2">
                        <span className="text-3xl font-display font-bold text-primary">
                          {currentFeedback?.adjustedScore.toFixed(1)}
                        </span>
                        <span className="text-muted-foreground">/10</span>
                      </div>
                    </div>
                  </div>

                  {/* Time taken display */}
                  <div className="flex items-center gap-2 mb-4 text-sm text-muted-foreground">
                    <Clock className="w-4 h-4" />
                    Time taken: {Math.floor((currentFeedback?.timeTaken || 0) / 60)}:{((currentFeedback?.timeTaken || 0) % 60).toString().padStart(2, '0')}
                    <span className="mx-2">•</span>
                    Base score: {currentFeedback?.score}/10
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
