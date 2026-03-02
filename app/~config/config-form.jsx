"use client";

import { useState } from "react";
import { updateConfigs } from "./action";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { 
  Save, 
  Loader2, 
  Sparkles, 
  Database, 
  Image as ImageIcon, 
  Globe, 
  Cpu,
  Type
} from "lucide-react";

export default function ConfigForm({ initialConfigs }) {
  const [configs, setConfigs] = useState(initialConfigs);
  const [loading, setLoading] = useState(false);

  const handleChange = (key, value) => {
    setConfigs((prev) => ({ ...prev, [key]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    const result = await updateConfigs(configs);
    if (result.success) {
      toast.success("Configuration updated successfully!");
    } else {
      toast.error("Failed to update configuration: " + result.error);
    }
    setLoading(false);
  };

  const Section = ({ title, icon: Icon, children }) => (
    <div className="space-y-4 rounded-xl border border-stone-200 bg-white p-6 shadow-sm">
      <div className="flex items-center gap-2 border-b border-stone-100 pb-3">
        <Icon className="h-5 w-5 text-stone-600" />
        <h3 className="font-semibold text-stone-800">{title}</h3>
      </div>
      <div className="grid gap-4 sm:grid-cols-2">{children}</div>
    </div>
  );

  const ConfigInput = ({ id, label, placeholder, type = "password", isFullWidth = false }) => (
    <div className={isFullWidth ? "sm:col-span-2 space-y-2" : "space-y-2"}>
      <Label htmlFor={id} className="text-xs font-medium text-stone-500 uppercase tracking-wider">
        {label}
      </Label>
      <Input
        id={id}
        type={type}
        placeholder={placeholder}
        value={configs[id] || ""}
        onChange={(e) => handleChange(id, e.target.value)}
        className="h-10 focus-visible:ring-stone-500"
      />
    </div>
  );

  const ConfigTextarea = ({ id, label, placeholder }) => (
    <div className="sm:col-span-2 space-y-2">
      <Label htmlFor={id} className="text-xs font-medium text-stone-500 uppercase tracking-wider">
        {label}
      </Label>
      <Textarea
        id={id}
        placeholder={placeholder}
        value={configs[id] || ""}
        onChange={(e) => handleChange(id, e.target.value)}
        className="min-h-24 focus-visible:ring-stone-500"
      />
    </div>
  );

  return (
    <form onSubmit={handleSubmit} className="space-y-8 pb-12">
      <div className="flex items-center justify-between sticky top-[65px] z-10 bg-stone-50/80 backdrop-blur py-4 -mx-6 px-6">
        <div>
          <h2 className="text-xl font-bold text-stone-900">System Configuration</h2>
          <p className="text-sm text-stone-500">Manage AI behaviors, SEO, and storage settings.</p>
        </div>
        <Button 
          type="submit" 
          disabled={loading}
          className="bg-stone-900 hover:bg-stone-800 h-10 px-8 gap-2 shadow-lg shadow-stone-200"
        >
          {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
          Save Changes
        </Button>
      </div>

      <Section title="Global SEO & Identity" icon={Globe}>
        <ConfigInput id="SITE_NAME" label="Site Name" placeholder="Flaz Next" type="text" />
        <ConfigInput id="SITE_DESCRIPTION" label="Default Description" placeholder="AI-powered visual page builder" type="text" />
        <ConfigInput id="FAVICON_URL" label="Favicon URL" placeholder="/favicon.ico" type="text" isFullWidth />
      </Section>

      <Section title="AI Behavior Defaults" icon={Cpu}>
        <ConfigInput id="DEFAULT_LLM_PROVIDER" label="Default Provider" placeholder="openai, anthropic, google, xai" type="text" />
        <ConfigInput id="DEFAULT_MODEL_NAME" label="Model Name" placeholder="gpt-4o, claude-3-5-sonnet" type="text" />
        <ConfigInput id="AI_TEMPERATURE" label="Temperature (0-1)" placeholder="0.7" type="text" />
        <div />
        <ConfigTextarea 
          id="SYSTEM_PROMPT_PREFIX" 
          label="Global System Prompt Prefix" 
          placeholder="Inject custom global instructions for all generations..." 
        />
      </Section>

      <Section title="LLM API Keys" icon={Sparkles}>
        <ConfigInput id="GEMINI_API_KEY" label="Gemini API Key" placeholder="AIZA..." />
        <ConfigInput id="XAI_API_KEY" label="XAI API Key" placeholder="xai-..." />
        <ConfigInput id="ANTHROPIC_API_KEY" label="Anthropic API Key" placeholder="sk-ant-..." />
        <ConfigInput id="OPENAI_API_KEY" label="OpenAI API Key" placeholder="sk-..." />
        <ConfigInput id="GROQ_API_KEY" label="Groq API Key" placeholder="gsk_..." />
        <ConfigInput id="OPENROUTER_API_KEY" label="OpenRouter API Key" placeholder="sk-or-..." />
      </Section>

      <Section title="Unsplash API" icon={ImageIcon}>
        <ConfigInput id="UNSPLASH_ACCESS_KEY" label="Access Key" placeholder="Unsplash Access Key" />
        <ConfigInput id="UNSPLASH_SECRET_KEY" label="Secret Key" placeholder="Unsplash Secret Key" />
      </Section>

      <Section title="AWS S3 Storage (Compatible)" icon={Database}>
        <ConfigInput id="S3_ACCESS_KEY" label="Access Key ID" placeholder="AKIA..." type="text" />
        <ConfigInput id="S3_SECRET_KEY" label="Secret Access Key" placeholder="Secret Key" />
        <ConfigInput id="S3_REGION" label="Region" placeholder="us-east-1" type="text" />
        <ConfigInput id="S3_BUCKET" label="Bucket Name" placeholder="my-bucket" type="text" />
        <ConfigInput id="S3_ENDPOINT" label="Endpoint (for Cloudflare/DigitalOcean)" placeholder="https://..." type="text" />
      </Section>
    </form>
  );
}
