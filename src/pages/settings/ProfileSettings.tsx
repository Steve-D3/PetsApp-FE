import { useState, useEffect } from "react";
import { useAuth } from "@/features/auth/hooks/useAuth";
import { Button } from "@/components/atoms/Button";
import { Input } from "@/components/atoms/Input";
import { Switch } from "@/components/atoms/Switch";
import { Select } from "@/components/atoms/Select";
import { Card } from "@/components/atoms/Card";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/atoms/Tabs";

type Theme = "light" | "dark" | "system";
type DateFormat = "MM/DD/YYYY" | "DD/MM/YYYY" | "YYYY-MM-DD";

type ProfileData = {
  name: string;
  email: string;
  password: string;
  newPassword: string;
  confirmPassword: string;
};

export const ProfileSettings = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState("account");
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [profileImage, setProfileImage] = useState<string | null>(
    user?.profile_photo_url || null
  );
  const [isUploading, setIsUploading] = useState(false);

  // Initialize form with user data
  const [profileData, setProfileData] = useState<ProfileData>({
    name: user?.name || "",
    email: user?.email || "",
    password: "",
    newPassword: "",
    confirmPassword: "",
  });

  // Update form when user data changes
  useEffect(() => {
    if (user) {
      setProfileData((prev) => ({
        ...prev,
        name: user.name || "",
        email: user.email || "",
      }));
      setProfileImage(user.profile_photo_url || null);
    }
  }, [user]);

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    try {
      // In a real app, you would upload the image to your storage service
      // and get back a URL, then update the user's profile with the new URL
      const imageUrl = URL.createObjectURL(file);
      setProfileImage(imageUrl);
      // Here you would typically call an API to update the user's profile image
      console.log("Uploading image...", file);
    } catch (error) {
      console.error("Error uploading image:", error);
    } finally {
      setIsUploading(false);
    }
  };
  const [appPreferences, setAppPreferences] = useState({
    theme: "system" as Theme,
    dateFormat: "MM/DD/YYYY" as DateFormat,
    notifications: true,
    emailUpdates: true,
  });

  const handleProfileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setProfileData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setProfileData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleAppPreferenceChange = <K extends keyof typeof appPreferences>(
    name: K,
    value: (typeof appPreferences)[K]
  ) => {
    setAppPreferences((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    setIsSaving(true);
    setSaveSuccess(false);

    try {
      // In a real app, you would call your API to update the user profile
      // For now, we'll simulate a successful update
      console.log("Updating profile with:", profileData);

      // Simulate API call delay
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // In a real app, you would update the user data in your auth context
      // and refresh the user data from the server
      setSaveSuccess(true);

      // Hide success message after 3 seconds
      setTimeout(() => setSaveSuccess(false), 3000);
    } catch (error) {
      console.error("Failed to update profile:", error);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <div className="flex flex-col items-center mb-8">
        <div className="relative group">
          <div className="relative w-32 h-32 rounded-full overflow-hidden border-4 border-gray-200">
            {profileImage ? (
              <img
                src={profileImage}
                alt="Profile"
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full bg-gray-200 flex items-center justify-center text-gray-400">
                <span className="text-4xl">
                  {user?.name?.[0]?.toUpperCase() || "U"}
                </span>
              </div>
            )}
            <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
              <label className="cursor-pointer p-2 bg-white bg-opacity-80 rounded-full">
                <input
                  type="file"
                  className="hidden"
                  accept="image/*"
                  onChange={handleImageUpload}
                  disabled={isUploading}
                />
                {isUploading ? (
                  <div className="w-6 h-6 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
                ) : (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-6 w-6 text-gray-700"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z"
                    />
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M15 13a3 3 0 11-6 0 3 3 0 016 0z"
                    />
                  </svg>
                )}
              </label>
            </div>
          </div>
          <div className="absolute -bottom-2 -right-2 bg-blue-500 text-white rounded-full p-1">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M4 5a2 2 0 00-2 2v8a2 2 0 002 2h12a2 2 0 002-2V7a2 2 0 00-2-2h-1.586a1 1 0 01-.707-.293l-1.121-1.121A2 2 0 0011.172 3H8.828a2 2 0 00-1.414.586L6.293 4.707A1 1 0 015.586 5H4zm6 9a3 3 0 100-6 3 3 0 000 6z"
                clipRule="evenodd"
              />
            </svg>
          </div>
        </div>
        <h1 className="text-3xl font-bold mt-4">Profile Settings</h1>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-3 mb-8">
          <TabsTrigger value="account">Account</TabsTrigger>
          <TabsTrigger value="preferences">Preferences</TabsTrigger>
          <TabsTrigger value="legal">Legal</TabsTrigger>
        </TabsList>

        <TabsContent value="account">
          <Card className="p-6">
            <h2 className="text-xl font-semibold mb-6">Account Information</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-4">
                <Input
                  label="Name"
                  name="name"
                  value={profileData.name}
                  onChange={handleProfileChange}
                />
                <Input
                  label="Email"
                  name="email"
                  type="email"
                  value={profileData.email}
                  onChange={handleProfileChange}
                />
                <div className="space-y-4 pt-4 border-t border-gray-200">
                  <h3 className="font-medium">Change Password</h3>
                  <Input
                    label="Current Password"
                    name="password"
                    type="password"
                    value={profileData.password}
                    onChange={handlePasswordChange}
                    placeholder="Enter current password"
                  />
                  <Input
                    label="New Password"
                    name="newPassword"
                    type="password"
                    value={profileData.newPassword}
                    onChange={handlePasswordChange}
                    placeholder="Enter new password"
                  />
                  <Input
                    label="Confirm New Password"
                    name="confirmPassword"
                    type="password"
                    value={profileData.confirmPassword}
                    onChange={handlePasswordChange}
                    placeholder="Confirm new password"
                  />
                </div>
              </div>
              <div className="flex justify-between items-center mt-6">
                {saveSuccess && (
                  <div className="text-green-600 text-sm">
                    Profile updated successfully!
                  </div>
                )}
                <div className="ml-auto">
                  <Button
                    type="submit"
                    disabled={isSaving}
                    className="min-w-[120px]"
                  >
                    {isSaving ? (
                      <>
                        <svg
                          className="animate-spin -ml-1 mr-2 h-4 w-4 text-white inline-block"
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                        >
                          <circle
                            className="opacity-25"
                            cx="12"
                            cy="12"
                            r="10"
                            stroke="currentColor"
                            strokeWidth="4"
                          ></circle>
                          <path
                            className="opacity-75"
                            fill="currentColor"
                            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                          ></path>
                        </svg>
                        Saving...
                      </>
                    ) : (
                      "Save Changes"
                    )}
                  </Button>
                </div>
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
                  <p className="text-sm text-gray-500">
                    Choose your preferred theme
                  </p>
                </div>
                <Select
                  value={appPreferences.theme}
                  onChange={(e) =>
                    handleAppPreferenceChange("theme", e.target.value as Theme)
                  }
                >
                  <option value="light">Light</option>
                  <option value="dark">Dark</option>
                  <option value="system">System</option>
                </Select>
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-medium">Date Format</h3>
                  <p className="text-sm text-gray-500">
                    How dates should be displayed
                  </p>
                </div>
                <Select
                  value={appPreferences.dateFormat}
                  onChange={(e) =>
                    handleAppPreferenceChange(
                      "dateFormat",
                      e.target.value as DateFormat
                    )
                  }
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
                  onCheckedChange={(checked) =>
                    handleAppPreferenceChange("emailUpdates", checked)
                  }
                />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-medium">Push Notifications</h3>
                  <p className="text-sm text-gray-500">
                    Receive app notifications
                  </p>
                </div>
                <Switch
                  checked={appPreferences.notifications}
                  onCheckedChange={(checked) =>
                    handleAppPreferenceChange("notifications", checked)
                  }
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
                  By using our service, you agree to our Terms of Service.
                  Please read them carefully.
                </p>
                <Button
                  variant="ghost"
                  className="p-0 h-auto text-blue-600 hover:bg-transparent hover:text-blue-800"
                >
                  View Terms of Service
                </Button>
              </div>

              <div className="border-b pb-4">
                <h3 className="font-medium mb-2">Privacy Policy</h3>
                <p className="text-sm text-gray-600 mb-4">
                  Learn how we collect, use, and protect your data.
                </p>
                <Button
                  variant="ghost"
                  className="p-0 h-auto text-blue-600 hover:bg-transparent hover:text-blue-800"
                >
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
                  <Button
                    variant="outline"
                    className="text-red-600 border-red-600 hover:bg-red-50"
                  >
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
