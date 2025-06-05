import { useState } from 'react';
import { useAuth } from '@/features/auth/hooks/useAuth';
import { Button } from '@/components/atoms/Button';
import { Input } from '@/components/atoms/Input';
import { Switch } from '@/components/atoms/Switch';
import { Select } from '@/components/atoms/Select';
import { Card } from '@/components/atoms/Card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/atoms/Tabs';

type Theme = 'light' | 'dark' | 'system';
type DateFormat = 'MM/DD/YYYY' | 'DD/MM/YYYY' | 'YYYY-MM-DD';

export const ProfileSettings = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('account');
  const [profileData, setProfileData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    phone: user?.phone || '',
  });
  const [appPreferences, setAppPreferences] = useState({
    theme: 'system' as Theme,
    dateFormat: 'MM/DD/YYYY' as DateFormat,
    notifications: true,
    emailUpdates: true,
  });

  const handleProfileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setProfileData(prev => ({ ...prev, [name]: value }));
  };

  const handleAppPreferenceChange = <K extends keyof typeof appPreferences>(
    name: K,
    value: typeof appPreferences[K]
  ) => {
    setAppPreferences(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle form submission
    console.log('Profile updated:', { profileData, appPreferences });
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <h1 className="text-3xl font-bold mb-8">Profile Settings</h1>
      
      <Tabs 
        value={activeTab} 
        onValueChange={setActiveTab}
        className="w-full"
      >
        <TabsList className="grid w-full grid-cols-3 mb-8">
          <TabsTrigger value="account">Account</TabsTrigger>
          <TabsTrigger value="preferences">Preferences</TabsTrigger>
          <TabsTrigger value="legal">Legal</TabsTrigger>
        </TabsList>

        <TabsContent value="account">
          <Card className="p-6">
            <h2 className="text-xl font-semibold mb-6">Account Information</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input
                  label="Full Name"
                  name="name"
                  value={profileData.name}
                  onChange={handleProfileChange}
                  required
                />
                <Input
                  label="Email"
                  type="email"
                  name="email"
                  value={profileData.email}
                  onChange={handleProfileChange}
                  required
                />
                <Input
                  label="Phone Number"
                  type="tel"
                  name="phone"
                  value={profileData.phone}
                  onChange={handleProfileChange}
                />
              </div>
              <div className="flex justify-end mt-6">
                <Button type="submit">Save Changes</Button>
              </div>
            </form>
          </Card>
        </TabsContent>

        <TabsContent value="preferences">
          <Card className="p-6">
            <h2 className="text-xl font-semibold mb-6">App Preferences</h2>
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-medium">Theme</h3>
                  <p className="text-sm text-gray-500">Choose your preferred theme</p>
                </div>
                <Select
                  value={appPreferences.theme}
                  onChange={(e) => handleAppPreferenceChange('theme', e.target.value as Theme)}
                >
                  <option value="light">Light</option>
                  <option value="dark">Dark</option>
                  <option value="system">System</option>
                </Select>
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-medium">Date Format</h3>
                  <p className="text-sm text-gray-500">How dates should be displayed</p>
                </div>
                <Select
                  value={appPreferences.dateFormat}
                  onChange={(e) => handleAppPreferenceChange('dateFormat', e.target.value as DateFormat)}
                >
                  <option value="MM/DD/YYYY">MM/DD/YYYY</option>
                  <option value="DD/MM/YYYY">DD/MM/YYYY</option>
                  <option value="YYYY-MM-DD">YYYY-MM-DD</option>
                </Select>
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-medium">Email Notifications</h3>
                  <p className="text-sm text-gray-500">Receive email updates</p>
                </div>
                <Switch
                  checked={appPreferences.emailUpdates}
                  onCheckedChange={(checked) => handleAppPreferenceChange('emailUpdates', checked)}
                />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-medium">Push Notifications</h3>
                  <p className="text-sm text-gray-500">Receive app notifications</p>
                </div>
                <Switch
                  checked={appPreferences.notifications}
                  onCheckedChange={(checked) => handleAppPreferenceChange('notifications', checked)}
                />
              </div>
            </div>
          </Card>
        </TabsContent>

        <TabsContent value="legal">
          <Card className="p-6">
            <h2 className="text-xl font-semibold mb-6">Legal</h2>
            <div className="space-y-6">
              <div className="border-b pb-4">
                <h3 className="font-medium mb-2">Terms of Service</h3>
                <p className="text-sm text-gray-600 mb-4">
                  By using our service, you agree to our Terms of Service. Please read them carefully.
                </p>
                <Button variant="ghost" className="p-0 h-auto text-blue-600 hover:bg-transparent hover:text-blue-800">
                  View Terms of Service
                </Button>
              </div>

              <div className="border-b pb-4">
                <h3 className="font-medium mb-2">Privacy Policy</h3>
                <p className="text-sm text-gray-600 mb-4">
                  Learn how we collect, use, and protect your data.
                </p>
                <Button variant="ghost" className="p-0 h-auto text-blue-600 hover:bg-transparent hover:text-blue-800">
                  View Privacy Policy
                </Button>
              </div>

              <div>
                <h3 className="font-medium mb-2">Data & Privacy</h3>
                <p className="text-sm text-gray-600 mb-4">
                  Manage your data and privacy settings.
                </p>
                <div className="space-x-4">
                  <Button variant="outline">Export My Data</Button>
                  <Button variant="outline" className="text-red-600 border-red-600 hover:bg-red-50">
                    Delete Account
                  </Button>
                </div>
              </div>
            </div>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};
