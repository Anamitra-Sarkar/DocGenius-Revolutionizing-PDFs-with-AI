"use client"

import { useState } from "react"
import {
  Key,
  Eye,
  EyeOff,
  Copy,
  Check,
  Moon,
  Sun,
  Monitor,
  Bell,
  Shield,
  CreditCard,
  HelpCircle,
  ExternalLink,
  Save,
  Loader2,
} from "lucide-react"
import { useTheme } from "next-themes"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Progress } from "@/components/ui/progress"

export default function SettingsPage() {
  return (
    <div className="space-y-6 max-w-4xl">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold">Settings</h1>
        <p className="text-muted-foreground text-sm">Manage your account settings and preferences</p>
      </div>

      <Tabs defaultValue="api" className="space-y-6">
        <TabsList className="bg-muted/50 p-1">
          <TabsTrigger value="api">API Keys</TabsTrigger>
          <TabsTrigger value="usage">Usage</TabsTrigger>
          <TabsTrigger value="preferences">Preferences</TabsTrigger>
          <TabsTrigger value="account">Account</TabsTrigger>
        </TabsList>

        {/* API Keys Tab */}
        <TabsContent value="api" className="space-y-4">
          <ApiKeysSection />
        </TabsContent>

        {/* Usage Tab */}
        <TabsContent value="usage" className="space-y-4">
          <UsageSection />
        </TabsContent>

        {/* Preferences Tab */}
        <TabsContent value="preferences" className="space-y-4">
          <PreferencesSection />
        </TabsContent>

        {/* Account Tab */}
        <TabsContent value="account" className="space-y-4">
          <AccountSection />
        </TabsContent>
      </Tabs>
    </div>
  )
}

function ApiKeysSection() {
  const [showOpenAI, setShowOpenAI] = useState(false)
  const [showGemini, setShowGemini] = useState(false)
  const [copied, setCopied] = useState<string | null>(null)
  const [isSaving, setIsSaving] = useState(false)

  const handleCopy = (key: string, value: string) => {
    navigator.clipboard.writeText(value)
    setCopied(key)
    setTimeout(() => setCopied(null), 2000)
  }

  const handleSave = async () => {
    setIsSaving(true)
    await new Promise((resolve) => setTimeout(resolve, 1000))
    setIsSaving(false)
  }

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Key className="w-5 h-5" />
            API Configuration
          </CardTitle>
          <CardDescription>
            Configure your API keys for OpenAI embeddings and Google Gemini. Keys are encrypted and stored securely.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* OpenAI Key */}
          <div className="space-y-2">
            <Label htmlFor="openai">OpenAI API Key</Label>
            <div className="flex gap-2">
              <div className="relative flex-1">
                <Input
                  id="openai"
                  type={showOpenAI ? "text" : "password"}
                  defaultValue="sk-proj-xxxxxxxxxxxxxxxxxxxx"
                  className="pr-20 font-mono text-sm"
                />
                <div className="absolute right-2 top-1/2 -translate-y-1/2 flex gap-1">
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="h-7 w-7"
                    onClick={() => setShowOpenAI(!showOpenAI)}
                  >
                    {showOpenAI ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </Button>
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="h-7 w-7"
                    onClick={() => handleCopy("openai", "sk-proj-xxxxxxxxxxxxxxxxxxxx")}
                  >
                    {copied === "openai" ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                  </Button>
                </div>
              </div>
            </div>
            <p className="text-xs text-muted-foreground">Used for generating embeddings for semantic search</p>
          </div>

          {/* Gemini Key */}
          <div className="space-y-2">
            <Label htmlFor="gemini">Google Gemini API Key</Label>
            <div className="flex gap-2">
              <div className="relative flex-1">
                <Input
                  id="gemini"
                  type={showGemini ? "text" : "password"}
                  defaultValue="AIzaSyxxxxxxxxxxxxxxxxxx"
                  className="pr-20 font-mono text-sm"
                />
                <div className="absolute right-2 top-1/2 -translate-y-1/2 flex gap-1">
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="h-7 w-7"
                    onClick={() => setShowGemini(!showGemini)}
                  >
                    {showGemini ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </Button>
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="h-7 w-7"
                    onClick={() => handleCopy("gemini", "AIzaSyxxxxxxxxxxxxxxxxxx")}
                  >
                    {copied === "gemini" ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                  </Button>
                </div>
              </div>
            </div>
            <p className="text-xs text-muted-foreground">Used for text generation and document Q&A</p>
          </div>

          <Button onClick={handleSave} disabled={isSaving}>
            {isSaving ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Saving...
              </>
            ) : (
              <>
                <Save className="w-4 h-4 mr-2" />
                Save Changes
              </>
            )}
          </Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Need help getting API keys?</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <a
            href="https://platform.openai.com/api-keys"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-between p-3 rounded-lg bg-muted/50 hover:bg-muted transition-colors"
          >
            <span className="text-sm font-medium">Get OpenAI API Key</span>
            <ExternalLink className="w-4 h-4 text-muted-foreground" />
          </a>
          <a
            href="https://makersuite.google.com/app/apikey"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-between p-3 rounded-lg bg-muted/50 hover:bg-muted transition-colors"
          >
            <span className="text-sm font-medium">Get Google Gemini API Key</span>
            <ExternalLink className="w-4 h-4 text-muted-foreground" />
          </a>
        </CardContent>
      </Card>
    </>
  )
}

function UsageSection() {
  const usageData = {
    documents: { used: 12, limit: 50 },
    queries: { used: 847, limit: 2000 },
    generations: { used: 156, limit: 500 },
    storage: { used: 45.6, limit: 100 }, // MB
  }

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CreditCard className="w-5 h-5" />
            Current Plan: Free
          </CardTitle>
          <CardDescription>Your usage resets on February 1, 2024</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <UsageItem
            label="Documents Uploaded"
            used={usageData.documents.used}
            limit={usageData.documents.limit}
            unit=""
          />
          <UsageItem label="Chat Queries" used={usageData.queries.used} limit={usageData.queries.limit} unit="" />
          <UsageItem
            label="Text Generations"
            used={usageData.generations.used}
            limit={usageData.generations.limit}
            unit=""
          />
          <UsageItem label="Storage Used" used={usageData.storage.used} limit={usageData.storage.limit} unit="MB" />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Upgrade to Pro</CardTitle>
          <CardDescription>Get unlimited documents, queries, and priority support</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-2xl font-bold">
                $19<span className="text-sm font-normal text-muted-foreground">/month</span>
              </p>
              <p className="text-sm text-muted-foreground">Billed monthly</p>
            </div>
            <Button className="glow-sm">Upgrade Now</Button>
          </div>
        </CardContent>
      </Card>
    </>
  )
}

function UsageItem({ label, used, limit, unit }: { label: string; used: number; limit: number; unit: string }) {
  const percentage = (used / limit) * 100
  const isNearLimit = percentage > 80

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between text-sm">
        <span>{label}</span>
        <span className={isNearLimit ? "text-orange-500" : "text-muted-foreground"}>
          {used}
          {unit} / {limit}
          {unit}
        </span>
      </div>
      <Progress value={percentage} className={isNearLimit ? "[&>div]:bg-orange-500" : ""} />
    </div>
  )
}

function PreferencesSection() {
  const { theme, setTheme } = useTheme()
  const [notifications, setNotifications] = useState({
    email: true,
    processing: true,
    updates: false,
  })

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Monitor className="w-5 h-5" />
            Appearance
          </CardTitle>
          <CardDescription>Customize how DocGenius looks on your device</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex gap-3">
            {[
              { value: "light", icon: Sun, label: "Light" },
              { value: "dark", icon: Moon, label: "Dark" },
              { value: "system", icon: Monitor, label: "System" },
            ].map((option) => (
              <button
                key={option.value}
                onClick={() => setTheme(option.value)}
                className={`flex-1 flex flex-col items-center gap-2 p-4 rounded-xl border-2 transition-all ${
                  theme === option.value
                    ? "border-primary bg-primary/5"
                    : "border-border hover:border-primary/30 bg-muted/50"
                }`}
              >
                <option.icon className="w-5 h-5" />
                <span className="text-sm font-medium">{option.label}</span>
              </button>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Bell className="w-5 h-5" />
            Notifications
          </CardTitle>
          <CardDescription>Choose what you want to be notified about</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium">Email notifications</p>
              <p className="text-xs text-muted-foreground">Receive emails about your document activity</p>
            </div>
            <Switch
              checked={notifications.email}
              onCheckedChange={(v) => setNotifications({ ...notifications, email: v })}
            />
          </div>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium">Processing alerts</p>
              <p className="text-xs text-muted-foreground">Get notified when documents finish processing</p>
            </div>
            <Switch
              checked={notifications.processing}
              onCheckedChange={(v) => setNotifications({ ...notifications, processing: v })}
            />
          </div>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium">Product updates</p>
              <p className="text-xs text-muted-foreground">Learn about new features and improvements</p>
            </div>
            <Switch
              checked={notifications.updates}
              onCheckedChange={(v) => setNotifications({ ...notifications, updates: v })}
            />
          </div>
        </CardContent>
      </Card>
    </>
  )
}

function AccountSection() {
  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="w-5 h-5" />
            Security
          </CardTitle>
          <CardDescription>Manage your account security settings</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
            <div>
              <p className="text-sm font-medium">Two-factor authentication</p>
              <p className="text-xs text-muted-foreground">Add an extra layer of security to your account</p>
            </div>
            <Button variant="outline" size="sm">
              Enable
            </Button>
          </div>
          <div className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
            <div>
              <p className="text-sm font-medium">Change password</p>
              <p className="text-xs text-muted-foreground">Update your password regularly for better security</p>
            </div>
            <Button variant="outline" size="sm">
              Update
            </Button>
          </div>
          <div className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
            <div>
              <p className="text-sm font-medium">Active sessions</p>
              <p className="text-xs text-muted-foreground">Manage your active login sessions</p>
            </div>
            <Button variant="outline" size="sm">
              View
            </Button>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <HelpCircle className="w-5 h-5" />
            Support
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <a
            href="#"
            className="flex items-center justify-between p-3 rounded-lg bg-muted/50 hover:bg-muted transition-colors"
          >
            <span className="text-sm font-medium">Documentation</span>
            <ExternalLink className="w-4 h-4 text-muted-foreground" />
          </a>
          <a
            href="#"
            className="flex items-center justify-between p-3 rounded-lg bg-muted/50 hover:bg-muted transition-colors"
          >
            <span className="text-sm font-medium">Contact Support</span>
            <ExternalLink className="w-4 h-4 text-muted-foreground" />
          </a>
          <a
            href="#"
            className="flex items-center justify-between p-3 rounded-lg bg-muted/50 hover:bg-muted transition-colors"
          >
            <span className="text-sm font-medium">Feature Requests</span>
            <ExternalLink className="w-4 h-4 text-muted-foreground" />
          </a>
        </CardContent>
      </Card>

      <Card className="border-destructive/50">
        <CardHeader>
          <CardTitle className="text-destructive">Danger Zone</CardTitle>
          <CardDescription>Irreversible and destructive actions</CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex items-center justify-between p-3 rounded-lg bg-destructive/5">
            <div>
              <p className="text-sm font-medium">Delete all documents</p>
              <p className="text-xs text-muted-foreground">Permanently remove all uploaded documents</p>
            </div>
            <Button variant="destructive" size="sm">
              Delete All
            </Button>
          </div>
          <div className="flex items-center justify-between p-3 rounded-lg bg-destructive/5">
            <div>
              <p className="text-sm font-medium">Delete account</p>
              <p className="text-xs text-muted-foreground">Permanently delete your account and all data</p>
            </div>
            <Button variant="destructive" size="sm">
              Delete Account
            </Button>
          </div>
        </CardContent>
      </Card>
    </>
  )
}
