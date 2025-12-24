import { useState, useRef } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Slider } from '@/components/ui/slider';
import { useToast } from '@/hooks/use-toast';
import { 
  Brain, 
  ArrowRight, 
  ArrowLeft,
  CheckCircle2,
  Upload,
  FileText,
  X,
  Loader2
} from 'lucide-react';
import { JOB_ROLES, DIFFICULTIES, ROUND_TYPES, JobRole, Difficulty, RoundType } from '@/types/interview';
import { parseResume } from '@/lib/gemini';
import { cn } from '@/lib/utils';

const InterviewSetup = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const [step, setStep] = useState(1);
  const [selectedRole, setSelectedRole] = useState<JobRole | null>(null);
  const [selectedDifficulty, setSelectedDifficulty] = useState<Difficulty>('intermediate');
  const [selectedRoundType, setSelectedRoundType] = useState<RoundType>('mixed');
  const [questionCount, setQuestionCount] = useState(5);
  
  // Resume state
  const [resumeFile, setResumeFile] = useState<File | null>(null);
  const [resumeContent, setResumeContent] = useState<string | null>(null);
  const [isParsingResume, setIsParsingResume] = useState(false);

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    const validTypes = ['application/pdf', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
    if (!validTypes.includes(file.type)) {
      toast({
        title: 'Invalid file type',
        description: 'Please upload a PDF or DOCX file',
        variant: 'destructive',
      });
      return;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast({
        title: 'File too large',
        description: 'Please upload a file smaller than 5MB',
        variant: 'destructive',
      });
      return;
    }

    setResumeFile(file);
    setIsParsingResume(true);

    try {
      // Convert file to base64
      const reader = new FileReader();
      reader.onload = async () => {
        const base64 = (reader.result as string).split(',')[1];
        const parsedContent = await parseResume(base64, file.type);
        setResumeContent(parsedContent);
        toast({
          title: 'Resume parsed successfully',
          description: 'Your interview will include personalized questions based on your resume',
        });
      };
      reader.readAsDataURL(file);
    } catch (error) {
      console.error('Error parsing resume:', error);
      toast({
        title: 'Failed to parse resume',
        description: 'Questions will be role-based instead',
        variant: 'destructive',
      });
      setResumeFile(null);
    } finally {
      setIsParsingResume(false);
    }
  };

  const removeResume = () => {
    setResumeFile(null);
    setResumeContent(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleStart = () => {
    if (!selectedRole) return;
    
    const config = {
      jobRole: selectedRole,
      difficulty: selectedDifficulty,
      roundType: selectedRoundType,
      questionCount,
      resumeContent: resumeContent || undefined,
    };
    
    navigate('/interview', { state: { config } });
  };

  const canProceed = () => {
    if (step === 1) return selectedRole !== null;
    return true;
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Background effects */}
      <div className="fixed inset-0 bg-grid-pattern bg-grid opacity-20" />
      <div className="fixed top-1/4 left-1/4 w-96 h-96 bg-primary/10 rounded-full blur-[100px]" />
      <div className="fixed bottom-1/4 right-1/4 w-96 h-96 bg-accent/10 rounded-full blur-[100px]" />
      
      {/* Navigation */}
      <nav className="relative z-10 border-b border-border/50 backdrop-blur-sm">
        <div className="flex items-center justify-between p-4 max-w-4xl mx-auto">
          <Link to="/" className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-primary/20 flex items-center justify-center">
              <Brain className="w-5 h-5 text-primary" />
            </div>
            <span className="text-lg font-display font-bold">PrepBot</span>
          </Link>
          <Link to="/dashboard">
            <Button variant="ghost" size="sm">Dashboard</Button>
          </Link>
        </div>
      </nav>

      <main className="relative z-10 max-w-4xl mx-auto p-6 pt-12">
        {/* Progress Indicator */}
        <div className="flex items-center justify-center gap-2 mb-12">
          {[1, 2, 3].map((s) => (
            <div 
              key={s}
              className={cn(
                "w-3 h-3 rounded-full transition-all duration-300",
                s === step ? "w-8 bg-primary" : s < step ? "bg-primary" : "bg-secondary"
              )}
            />
          ))}
        </div>

        {/* Step 1: Role Selection */}
        {step === 1 && (
          <div className="animate-fade-in">
            <div className="text-center mb-8">
              <h1 className="text-3xl font-display font-bold mb-2">Select Your Target Role</h1>
              <p className="text-muted-foreground">Choose the position you're preparing for</p>
            </div>
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {JOB_ROLES.map((role) => (
                <Card 
                  key={role.value}
                  className={cn(
                    "cursor-pointer transition-all duration-300 border-2",
                    selectedRole === role.value 
                      ? "border-primary bg-primary/10 glow-effect" 
                      : "border-border/50 hover:border-primary/50 glass-card"
                  )}
                  onClick={() => setSelectedRole(role.value)}
                >
                  <CardContent className="p-4 text-center">
                    <div className="text-3xl mb-2">{role.icon}</div>
                    <p className="font-medium text-sm">{role.label}</p>
                    {selectedRole === role.value && (
                      <CheckCircle2 className="w-5 h-5 text-primary mx-auto mt-2" />
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}

        {/* Step 2: Difficulty, Round Type & Resume */}
        {step === 2 && (
          <div className="animate-fade-in space-y-8">
            <div className="text-center mb-8">
              <h1 className="text-3xl font-display font-bold mb-2">Configure Your Interview</h1>
              <p className="text-muted-foreground">Set the difficulty, type of questions, and optionally upload your resume</p>
            </div>
            
            {/* Resume Upload */}
            <div>
              <h3 className="text-lg font-semibold mb-4">Resume (Optional)</h3>
              <Card className="glass-card border-border/50">
                <CardContent className="p-6">
                  {!resumeFile ? (
                    <div 
                      className="border-2 border-dashed border-border/50 rounded-lg p-8 text-center cursor-pointer hover:border-primary/50 transition-colors"
                      onClick={() => fileInputRef.current?.click()}
                    >
                      <Upload className="w-10 h-10 text-muted-foreground mx-auto mb-4" />
                      <p className="font-medium mb-1">Upload your resume</p>
                      <p className="text-sm text-muted-foreground mb-4">
                        Get personalized questions based on your experience
                      </p>
                      <p className="text-xs text-muted-foreground">PDF or DOCX, max 5MB</p>
                      <input
                        ref={fileInputRef}
                        type="file"
                        accept=".pdf,.docx"
                        onChange={handleFileSelect}
                        className="hidden"
                      />
                    </div>
                  ) : (
                    <div className="flex items-center justify-between p-4 bg-secondary/50 rounded-lg">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg bg-primary/20 flex items-center justify-center">
                          <FileText className="w-5 h-5 text-primary" />
                        </div>
                        <div>
                          <p className="font-medium">{resumeFile.name}</p>
                          <p className="text-sm text-muted-foreground">
                            {isParsingResume ? 'Analyzing...' : 'Ready for personalized questions'}
                          </p>
                        </div>
                      </div>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={removeResume}
                        disabled={isParsingResume}
                      >
                        {isParsingResume ? (
                          <Loader2 className="w-4 h-4 animate-spin" />
                        ) : (
                          <X className="w-4 h-4" />
                        )}
                      </Button>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>

            {/* Difficulty Selection */}
            <div>
              <h3 className="text-lg font-semibold mb-4">Difficulty Level</h3>
              <div className="grid grid-cols-3 gap-4">
                {DIFFICULTIES.map((diff) => (
                  <Card 
                    key={diff.value}
                    className={cn(
                      "cursor-pointer transition-all duration-300 border-2",
                      selectedDifficulty === diff.value 
                        ? "border-primary bg-primary/10" 
                        : "border-border/50 hover:border-primary/50 glass-card"
                    )}
                    onClick={() => setSelectedDifficulty(diff.value)}
                  >
                    <CardContent className="p-4 text-center">
                      <p className="font-semibold">{diff.label}</p>
                      <p className="text-xs text-muted-foreground mt-1">{diff.description}</p>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>

            {/* Round Type Selection */}
            <div>
              <h3 className="text-lg font-semibold mb-4">Question Type</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {ROUND_TYPES.map((type) => (
                  <Card 
                    key={type.value}
                    className={cn(
                      "cursor-pointer transition-all duration-300 border-2",
                      selectedRoundType === type.value 
                        ? "border-primary bg-primary/10" 
                        : "border-border/50 hover:border-primary/50 glass-card"
                    )}
                    onClick={() => setSelectedRoundType(type.value)}
                  >
                    <CardContent className="p-4 text-center">
                      <p className="font-semibold">{type.label}</p>
                      <p className="text-xs text-muted-foreground mt-1">{type.description}</p>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Step 3: Final Configuration */}
        {step === 3 && (
          <div className="animate-fade-in">
            <div className="text-center mb-8">
              <h1 className="text-3xl font-display font-bold mb-2">Final Setup</h1>
              <p className="text-muted-foreground">Review and start your interview</p>
            </div>
            
            {/* Question Count */}
            <Card className="glass-card border-border/50 mb-8">
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold">Number of Questions</h3>
                  <span className="text-2xl font-display font-bold text-primary">{questionCount}</span>
                </div>
                <Slider
                  value={[questionCount]}
                  onValueChange={(v) => setQuestionCount(v[0])}
                  min={3}
                  max={10}
                  step={1}
                  className="w-full"
                />
                <div className="flex justify-between text-xs text-muted-foreground mt-2">
                  <span>Quick (3)</span>
                  <span>Full (10)</span>
                </div>
              </CardContent>
            </Card>

            {/* Summary */}
            <Card className="glass-card border-border/50">
              <CardContent className="p-6">
                <h3 className="text-lg font-semibold mb-4">Interview Summary</h3>
                <div className="space-y-3">
                  <div className="flex justify-between py-2 border-b border-border/50">
                    <span className="text-muted-foreground">Target Role</span>
                    <span className="font-medium capitalize">{selectedRole?.replace('-', ' ')}</span>
                  </div>
                  <div className="flex justify-between py-2 border-b border-border/50">
                    <span className="text-muted-foreground">Difficulty</span>
                    <span className="font-medium capitalize">{selectedDifficulty}</span>
                  </div>
                  <div className="flex justify-between py-2 border-b border-border/50">
                    <span className="text-muted-foreground">Question Type</span>
                    <span className="font-medium capitalize">{selectedRoundType}</span>
                  </div>
                  <div className="flex justify-between py-2 border-b border-border/50">
                    <span className="text-muted-foreground">Questions</span>
                    <span className="font-medium">{questionCount}</span>
                  </div>
                  <div className="flex justify-between py-2">
                    <span className="text-muted-foreground">Resume</span>
                    <span className="font-medium flex items-center gap-2">
                      {resumeContent ? (
                        <>
                          <CheckCircle2 className="w-4 h-4 text-primary" />
                          Personalized
                        </>
                      ) : (
                        'Role-based'
                      )}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Navigation Buttons */}
        <div className="flex items-center justify-between mt-8">
          <Button 
            variant="outline" 
            onClick={() => setStep(s => Math.max(1, s - 1))}
            disabled={step === 1}
            className="border-border/50"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back
          </Button>
          
          {step < 3 ? (
            <Button 
              onClick={() => setStep(s => s + 1)}
              disabled={!canProceed() || isParsingResume}
              className="bg-primary text-primary-foreground hover:bg-primary/90"
            >
              Continue
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          ) : (
            <Button 
              onClick={handleStart}
              className="bg-primary text-primary-foreground hover:bg-primary/90 glow-effect"
            >
              Start Interview
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          )}
        </div>
      </main>
    </div>
  );
};

export default InterviewSetup;
