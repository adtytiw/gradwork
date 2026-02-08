'use client';

import { useState, useEffect } from 'react';
import { useMutation } from '@tanstack/react-query';
import { apiClient } from '@/lib/api';
import { useAuth } from '@/hooks/useAuth';
import { LoadingButton } from '@/components/ui/loading-button';
import { FormInput } from '@/components/ui/form-input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { User, Building2, Mail, Shield, CheckCircle2, AlertCircle } from 'lucide-react';

export default function ProfilePage() {
  const { session, profile, refreshProfile } = useAuth();

  // Student fields
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');

  // Company fields
  const [companyName, setCompanyName] = useState('');
  const [description, setDescription] = useState('');

  const [success, setSuccess] = useState(false);

  useEffect(() => {
    if (profile?.studentProfile) {
      setFirstName(profile.studentProfile.firstName);
      setLastName(profile.studentProfile.lastName);
    }
    if (profile?.companyProfile) {
      setCompanyName(profile.companyProfile.companyName);
      setDescription(profile.companyProfile.description || '');
    }
  }, [profile]);

  const updateStudentMutation = useMutation({
    mutationFn: () =>
      apiClient('/users/profile/student', {
        method: 'PATCH',
        token: session?.access_token,
        body: { firstName, lastName },
      }),
    onSuccess: () => {
      setSuccess(true);
      refreshProfile();
      setTimeout(() => setSuccess(false), 3000);
    },
  });

  const updateCompanyMutation = useMutation({
    mutationFn: () =>
      apiClient('/users/profile/company', {
        method: 'PATCH',
        token: session?.access_token,
        body: { companyName, description: description || undefined },
      }),
    onSuccess: () => {
      setSuccess(true);
      refreshProfile();
      setTimeout(() => setSuccess(false), 3000);
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (profile?.role === 'STUDENT') {
      updateStudentMutation.mutate();
    } else {
      updateCompanyMutation.mutate();
    }
  };

  const isStudent = profile?.role === 'STUDENT';
  const isLoading = updateStudentMutation.isPending || updateCompanyMutation.isPending;

  // Get initials for avatar
  const getInitials = () => {
    if (isStudent && firstName && lastName) {
      return `${firstName[0]}${lastName[0]}`.toUpperCase();
    }
    if (!isStudent && companyName) {
      return companyName.slice(0, 2).toUpperCase();
    }
    return profile?.email?.[0]?.toUpperCase() || 'U';
  };

  // Get display name
  const getDisplayName = () => {
    if (isStudent && firstName && lastName) {
      return `${firstName} ${lastName}`;
    }
    if (!isStudent && companyName) {
      return companyName;
    }
    return profile?.email || 'User';
  };

  return (
    <div className="container max-w-4xl py-6 space-y-8">
      {/* Profile Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6">
        <Avatar className="h-24 w-24 border-4 border-background shadow-lg">
          <AvatarImage src="" alt={getDisplayName()} />
          <AvatarFallback className="text-2xl font-semibold bg-primary text-primary-foreground">
            {getInitials()}
          </AvatarFallback>
        </Avatar>
        <div className="space-y-2">
          <div className="flex items-center gap-3">
            <h1 className="text-3xl font-bold tracking-tight">{getDisplayName()}</h1>
            <Badge variant={isStudent ? 'default' : 'secondary'} className="gap-1">
              {isStudent ? <User className="h-3 w-3" /> : <Building2 className="h-3 w-3" />}
              {isStudent ? 'Student' : 'Company'}
            </Badge>
          </div>
          <p className="text-muted-foreground flex items-center gap-2">
            <Mail className="h-4 w-4" />
            {profile?.email}
          </p>
        </div>
      </div>

      <Separator />

      {/* Success Alert */}
      {success && (
        <div className="flex items-center gap-3 bg-green-50 dark:bg-green-950/50 border border-green-200 dark:border-green-800 text-green-700 dark:text-green-400 px-4 py-3 rounded-lg">
          <CheckCircle2 className="h-5 w-5" />
          <span className="font-medium">Profile updated successfully!</span>
        </div>
      )}

      {/* Tabs for different sections */}
      <Tabs defaultValue="profile" className="space-y-6">
        <TabsList className="grid w-full sm:w-auto sm:inline-grid grid-cols-2 gap-1">
          <TabsTrigger value="profile" className="gap-2">
            <User className="h-4 w-4" />
            Profile
          </TabsTrigger>
          <TabsTrigger value="account" className="gap-2">
            <Shield className="h-4 w-4" />
            Account
          </TabsTrigger>
        </TabsList>

        {/* Profile Tab */}
        <TabsContent value="profile" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                {isStudent ? <User className="h-5 w-5" /> : <Building2 className="h-5 w-5" />}
                {isStudent ? 'Personal Information' : 'Company Information'}
              </CardTitle>
              <CardDescription>
                {isStudent
                  ? 'Update your personal details that will be visible to employers.'
                  : 'Update your company details that will be visible to candidates.'}
              </CardDescription>
            </CardHeader>
            <form onSubmit={handleSubmit}>
              <CardContent className="space-y-6">
                {isStudent ? (
                  <div className="grid sm:grid-cols-2 gap-6">
                    <FormInput
                      id="firstName"
                      label="First Name"
                      value={firstName}
                      onChange={(e) => setFirstName(e.target.value)}
                      required
                      placeholder="Enter your first name"
                    />
                    <FormInput
                      id="lastName"
                      label="Last Name"
                      value={lastName}
                      onChange={(e) => setLastName(e.target.value)}
                      required
                      placeholder="Enter your last name"
                    />
                  </div>
                ) : (
                  <div className="space-y-6">
                    <FormInput
                      id="companyName"
                      label="Company Name"
                      value={companyName}
                      onChange={(e) => setCompanyName(e.target.value)}
                      required
                      placeholder="Enter your company name"
                    />
                    <div className="space-y-2">
                      <Label htmlFor="description">Company Description</Label>
                      <Textarea
                        id="description"
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        rows={5}
                        placeholder="Tell candidates about your company, culture, and what makes you unique..."
                        className="resize-none"
                      />
                      <p className="text-xs text-muted-foreground">
                        This description will be shown on your job postings.
                      </p>
                    </div>
                  </div>
                )}
              </CardContent>
              <CardFooter className="flex justify-between border-t pt-6">
                <Button
                  type="button"
                  variant="ghost"
                  onClick={() => {
                    if (profile?.studentProfile) {
                      setFirstName(profile.studentProfile.firstName);
                      setLastName(profile.studentProfile.lastName);
                    }
                    if (profile?.companyProfile) {
                      setCompanyName(profile.companyProfile.companyName);
                      setDescription(profile.companyProfile.description || '');
                    }
                  }}
                >
                  Reset
                </Button>
                <LoadingButton type="submit" loading={isLoading}>
                  Save Changes
                </LoadingButton>
              </CardFooter>
            </form>
          </Card>
        </TabsContent>

        {/* Account Tab */}
        <TabsContent value="account" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Mail className="h-5 w-5" />
                Email Address
              </CardTitle>
              <CardDescription>
                Your email address is used for signing in and notifications.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between p-4 bg-muted/50 rounded-lg">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                    <Mail className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <p className="font-medium">{profile?.email}</p>
                    <p className="text-sm text-muted-foreground">Primary email</p>
                  </div>
                </div>
                <Badge variant="outline" className="gap-1">
                  <CheckCircle2 className="h-3 w-3 text-green-500" />
                  Verified
                </Badge>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="h-5 w-5" />
                Account Type
              </CardTitle>
              <CardDescription>
                Your account type determines what features you have access to.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between p-4 bg-muted/50 rounded-lg">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                    {isStudent ? (
                      <User className="h-5 w-5 text-primary" />
                    ) : (
                      <Building2 className="h-5 w-5 text-primary" />
                    )}
                  </div>
                  <div>
                    <p className="font-medium">{isStudent ? 'Student Account' : 'Company Account'}</p>
                    <p className="text-sm text-muted-foreground">
                      {isStudent
                        ? 'Browse and apply for job opportunities'
                        : 'Post jobs and manage applications'}
                    </p>
                  </div>
                </div>
                <Badge variant={isStudent ? 'default' : 'secondary'}>
                  {profile?.role}
                </Badge>
              </div>
            </CardContent>
          </Card>

          <Card className="border-destructive/50">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-destructive">
                <AlertCircle className="h-5 w-5" />
                Danger Zone
              </CardTitle>
              <CardDescription>
                Irreversible actions for your account.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-4 bg-destructive/5 rounded-lg border border-destructive/20">
                <div>
                  <p className="font-medium">Delete Account</p>
                  <p className="text-sm text-muted-foreground">
                    Permanently delete your account and all associated data.
                  </p>
                </div>
                <Button variant="destructive" size="sm" disabled>
                  Delete Account
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
