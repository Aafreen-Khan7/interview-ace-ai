import { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Brain, ArrowLeft, Loader2, Camera, Trash2 } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { getUserProfile, updateUserProfile } from '@/services/firebaseService';
import { uploadProfilePhoto, deleteProfilePhoto } from '@/services/firebaseService';
import { toast } from '@/components/ui/use-toast';
import { UserProfile } from '@/types/interview';

const EXPERIENCE_LEVELS = ['Undergraduate', 'Graduate', 'Entry-level', 'Mid-level', 'Senior', 'Executive'];

const Profile = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [isUploadingPhoto, setIsUploadingPhoto] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [tempPhotoFile, setTempPhotoFile] = useState<File | null>(null);
  const [tempPhotoPreview, setTempPhotoPreview] = useState<string | null>(null);

  // Form state
  const [formData, setFormData] = useState({
    name: '',
    role: '',
    about: '',
    description: '',
    phone: '',
    location: '',
    linkedin: '',
    github: '',
    portfolio: '',
    skills: '',
    avatar: '',
  });

  useEffect(() => {
    loadProfile();
  }, [user]);

  const loadProfile = async () => {
    if (!user) return;
    try {
      const profileData = await getUserProfile(user.id);
      if (profileData) {
        setProfile(profileData);
        setFormData({
          name: profileData.name || '',
          role: profileData.role || '',
          about: profileData.about || '',
          description: profileData.description || '',
          phone: profileData.phone || '',
          location: profileData.location || '',
          linkedin: profileData.linkedin || '',
          github: profileData.github || '',
          portfolio: profileData.portfolio || '',
          skills: profileData.skills || '',
          avatar: profileData.avatar || '',
        });
      }
    } catch (error) {
      console.error('Error loading profile:', error);
      toast({ title: 'Error', description: 'Failed to load profile', variant: 'destructive' });
    } finally {
      setIsLoading(false);
    }
  };

  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast({ title: 'Error', description: 'File size must be less than 5MB', variant: 'destructive' });
      return;
    }

    // Validate file type
    if (!file.type.startsWith('image/')) {
      toast({ title: 'Error', description: 'Please select a valid image file', variant: 'destructive' });
      return;
    }

    setTempPhotoFile(file);
    const reader = new FileReader();
    reader.onload = (e) => {
      setTempPhotoPreview(e.target?.result as string);
    };
    reader.readAsDataURL(file);
  };

  const handleUploadPhoto = async () => {
    if (!tempPhotoFile || !user) return;

    setIsUploadingPhoto(true);
    try {
      console.log('=== Starting Photo Upload ===');
      console.log('User ID:', user.id);
      console.log('File:', tempPhotoFile.name, 'Size:', tempPhotoFile.size);
      
      const photoUrl = await uploadProfilePhoto(user.id, tempPhotoFile);
      
      console.log('=== Upload Complete ===');
      console.log('Returned URL:', photoUrl);
      console.log('URL is empty?', !photoUrl || photoUrl.trim() === '');
      
      setProfile(prev => prev ? { ...prev, avatar: photoUrl } : null);
      setFormData(prev => ({ ...prev, avatar: photoUrl }));
      setTempPhotoFile(null);
      setTempPhotoPreview(null);
      toast({ title: 'Success', description: 'Profile photo updated successfully' });
    } catch (error) {
      console.error('Error uploading photo:', error);
      toast({ title: 'Error', description: 'Failed to upload photo. Check console for details.', variant: 'destructive' });
    } finally {
      setIsUploadingPhoto(false);
    }
  };

  const handleDeletePhoto = async () => {
    if (!user || !profile?.avatar || !profile.avatar.trim()) return;

    setIsUploadingPhoto(true);
    try {
      await deleteProfilePhoto(user.id);
      setProfile(prev => prev ? { ...prev, avatar: '' } : null);
      setShowDeleteConfirm(false);
      toast({ title: 'Success', description: 'Profile photo deleted' });
    } catch (error) {
      console.error('Error deleting photo:', error);
      toast({ title: 'Error', description: 'Failed to delete photo', variant: 'destructive' });
    } finally {
      setIsUploadingPhoto(false);
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSave = async () => {
    if (!user) return;

    setIsSaving(true);
    try {
      await updateUserProfile(user.id, {
        ...formData,
      });
      setProfile(prev => prev ? { ...prev, ...formData } : null);
      toast({ title: 'Success', description: 'Profile updated successfully' });
    } catch (error) {
      console.error('Error saving profile:', error);
      toast({ title: 'Error', description: 'Failed to save profile', variant: 'destructive' });
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  const displayAvatar = tempPhotoPreview || (profile?.avatar && profile.avatar.trim() ? profile.avatar : null);
  const displayName = formData.name.split(' ')[0] || 'U';

  return (
    <div className="min-h-screen bg-background">
      <div className="fixed inset-0 bg-grid-pattern bg-grid opacity-20" />
      <div className="fixed top-0 right-0 w-96 h-96 bg-primary/10 rounded-full blur-[100px]" />

      {/* Navigation */}
      <nav className="relative z-10 border-b border-border/50 backdrop-blur-sm">
        <div className="flex items-center justify-between p-4 max-w-7xl mx-auto">
          <Link to="/" className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-primary/20 flex items-center justify-center">
              <Brain className="w-5 h-5 text-primary" />
            </div>
            <span className="text-lg font-display font-bold">PrepBot</span>
          </Link>
          <Link to="/dashboard">
            <Button variant="ghost">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Dashboard
            </Button>
          </Link>
        </div>
      </nav>

      <main className="relative z-10 max-w-2xl mx-auto p-6">
        <div className="mb-8">
          <h1 className="text-3xl font-display font-bold mb-2">Profile Settings</h1>
          <p className="text-muted-foreground">Manage your account information and preferences.</p>
        </div>

        {/* Profile Photo Section */}
        <Card className="glass-card border-border/50 mb-6">
          <CardHeader>
            <CardTitle className="text-lg">Profile Photo</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center gap-6">
              <Avatar className="h-24 w-24">
                <AvatarImage src={displayAvatar} alt={formData.name} />
                <AvatarFallback className="bg-primary/20 text-primary text-lg">
                  {displayName.toUpperCase()}
                </AvatarFallback>
              </Avatar>

              <div className="flex-1 space-y-3">
                {!tempPhotoFile ? (
                  <>
                    <div className="flex items-center gap-2">
                      <Input
                        type="file"
                        accept="image/*"
                        onChange={handlePhotoChange}
                        className="cursor-pointer"
                        disabled={isUploadingPhoto}
                      />
                      <Button
                        size="sm"
                        variant="outline"
                        disabled={!tempPhotoFile || isUploadingPhoto}
                      >
                        <Camera className="w-4 h-4" />
                      </Button>
                    </div>
                    <p className="text-xs text-muted-foreground">
                      Max 5MB • JPG, PNG, or GIF
                    </p>
                    {profile?.avatar && profile.avatar.trim() && (
                      <Button
                        size="sm"
                        variant="destructive"
                        onClick={() => setShowDeleteConfirm(true)}
                        disabled={isUploadingPhoto}
                      >
                        <Trash2 className="w-4 h-4 mr-2" />
                        Delete Current Photo
                      </Button>
                    )}
                  </>
                ) : (
                  <div className="space-y-3">
                    <p className="text-sm font-medium">Preview</p>
                    <div className="flex gap-2">
                      <Button
                        onClick={handleUploadPhoto}
                        disabled={isUploadingPhoto}
                        className="bg-primary text-primary-foreground hover:bg-primary/90"
                      >
                        {isUploadingPhoto ? (
                          <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        ) : (
                          <Camera className="w-4 h-4 mr-2" />
                        )}
                        Upload Photo
                      </Button>
                      <Button
                        variant="outline"
                        onClick={() => {
                          setTempPhotoFile(null);
                          setTempPhotoPreview(null);
                        }}
                        disabled={isUploadingPhoto}
                      >
                        Cancel
                      </Button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Profile Information Section */}
        <Card className="glass-card border-border/50">
          <CardHeader>
            <CardTitle className="text-lg">Profile Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Name */}
            <div>
              <label className="text-sm font-medium mb-2 block">Name</label>
              <Input
                value={formData.name}
                onChange={(e) => handleInputChange('name', e.target.value)}
                placeholder="Enter your full name"
                className="bg-secondary/50 border-border/50"
              />
            </div>

            {/* Role */}
            <div>
              <label className="text-sm font-medium mb-2 block">Experience Level</label>
              <Select value={formData.role} onValueChange={(value) => handleInputChange('role', value)}>
                <SelectTrigger className="bg-secondary/50 border-border/50">
                  <SelectValue placeholder="Select your experience level" />
                </SelectTrigger>
                <SelectContent>
                  {EXPERIENCE_LEVELS.map((level) => (
                    <SelectItem key={level} value={level}>
                      {level}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* About */}
            <div>
              <label className="text-sm font-medium mb-2 block">About</label>
              <Textarea
                value={formData.about}
                onChange={(e) => handleInputChange('about', e.target.value)}
                placeholder="Tell us about yourself"
                className="bg-secondary/50 border-border/50 min-h-24 resize-none"
              />
            </div>

            {/* Description */}
            <div>
              <label className="text-sm font-medium mb-2 block">Description</label>
              <Textarea
                value={formData.description}
                onChange={(e) => handleInputChange('description', e.target.value)}
                placeholder="Add a personal description"
                className="bg-secondary/50 border-border/50 min-h-24 resize-none"
              />
            </div>

            {/* Skills */}
            <div>
              <label className="text-sm font-medium mb-2 block">Skills</label>
              <Input
                value={formData.skills}
                onChange={(e) => handleInputChange('skills', e.target.value)}
                placeholder="e.g. JavaScript, React, Python"
                className="bg-secondary/50 border-border/50"
              />
            </div>

            {/* Phone Number */}
            <div>
              <label className="text-sm font-medium mb-2 block">Phone Number</label>
              <Input
                value={formData.phone}
                onChange={(e) => handleInputChange('phone', e.target.value)}
                placeholder="Enter your phone number"
                type="tel"
                className="bg-secondary/50 border-border/50"
              />
            </div>

            {/* Location */}
            <div>
              <label className="text-sm font-medium mb-2 block">Location / City</label>
              <Input
                value={formData.location}
                onChange={(e) => handleInputChange('location', e.target.value)}
                placeholder="Enter your city/location"
                className="bg-secondary/50 border-border/50"
              />
            </div>

            {/* LinkedIn */}
            <div>
              <label className="text-sm font-medium mb-2 block">LinkedIn</label>
              <Input
                value={formData.linkedin}
                onChange={(e) => handleInputChange('linkedin', e.target.value)}
                placeholder="https://linkedin.com/in/yourprofile"
                type="url"
                className="bg-secondary/50 border-border/50"
              />
            </div>

            {/* GitHub */}
            <div>
              <label className="text-sm font-medium mb-2 block">GitHub</label>
              <Input
                value={formData.github}
                onChange={(e) => handleInputChange('github', e.target.value)}
                placeholder="https://github.com/yourprofile"
                type="url"
                className="bg-secondary/50 border-border/50"
              />
            </div>

            {/* Portfolio */}
            <div>
              <label className="text-sm font-medium mb-2 block">Portfolio</label>
              <Input
                value={formData.portfolio}
                onChange={(e) => handleInputChange('portfolio', e.target.value)}
                placeholder="https://yourportfolio.com"
                type="url"
                className="bg-secondary/50 border-border/50"
              />
            </div>

            {/* Save Button */}
            <div className="flex gap-3 pt-4">
              <Button
                onClick={handleSave}
                disabled={isSaving}
                className="bg-primary text-primary-foreground hover:bg-primary/90 flex-1"
              >
                {isSaving ? (
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                ) : null}
                Save Changes
              </Button>
              <Button
                variant="outline"
                onClick={() => loadProfile()}
                disabled={isSaving}
                className="flex-1"
              >
                Cancel
              </Button>
            </div>
          </CardContent>
        </Card>
      </main>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={showDeleteConfirm} onOpenChange={setShowDeleteConfirm}>
        <AlertDialogContent>
          <AlertDialogTitle>Delete Profile Photo?</AlertDialogTitle>
          <AlertDialogDescription>
            Are you sure you want to delete your profile photo? This action cannot be undone.
          </AlertDialogDescription>
          <div className="flex gap-3 justify-end">
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDeletePhoto} className="bg-destructive">
              Delete
            </AlertDialogAction>
          </div>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default Profile;
