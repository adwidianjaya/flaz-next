"use client";

import { useState, useEffect, useRef } from "react";
import { updateConfigs } from "./action";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import {
  Save,
  Loader2,
  Sparkles,
  Database,
  Image as ImageIcon,
  Globe,
  Cpu,
} from "lucide-react";

const sections = [
  { id: "seo", title: "Global SEO & Identity", icon: Globe },
  { id: "ai", title: "AI Behavior Defaults", icon: Cpu },
  { id: "llm", title: "LLM API Keys", icon: Sparkles },
  { id: "unsplash", title: "Unsplash API", icon: ImageIcon },
  { id: "s3", title: "AWS S3 Storage", icon: Database },
];

function Section({ id, title, icon: Icon, children }) {
  return (
    <div
      id={id}
      className="scroll-mt-20 space-y-5 rounded-xl border border-stone-200 bg-white p-6 shadow-sm"
    >
      <div className="flex items-center gap-3 border-b border-stone-100 pb-4">
        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-stone-100">
          <Icon className="h-5 w-5 text-stone-600" />
        </div>
        <h3 className="text-lg font-semibold text-stone-900">{title}</h3>
      </div>
      <div className="grid gap-5 sm:grid-cols-2">{children}</div>
    </div>
  );
}

function ConfigInput({
  id,
  label,
  placeholder,
  type = "password",
  isFullWidth = false,
  value,
  onChange,
}) {
  return (
    <div className={isFullWidth ? "sm:col-span-2 space-y-2" : "space-y-2"}>
      <Label
        htmlFor={id}
        className="text-xs font-medium text-stone-500 uppercase tracking-wider"
      >
        {label}
      </Label>
      <Input
        id={id}
        type={type}
        placeholder={placeholder}
        value={value || ""}
        onChange={(e) => onChange(id, e.target.value)}
        className="h-11 bg-stone-50 border-stone-200 focus-visible:ring-stone-500 focus:bg-white"
      />
    </div>
  );
}

function ConfigTextarea({ id, label, placeholder, value, onChange }) {
  return (
    <div className="sm:col-span-2 space-y-2">
      <Label
        htmlFor={id}
        className="text-xs font-medium text-stone-500 uppercase tracking-wider"
      >
        {label}
      </Label>
      <Textarea
        id={id}
        placeholder={placeholder}
        value={value || ""}
        onChange={(e) => onChange(id, e.target.value)}
        className="min-h-28 bg-stone-50 border-stone-200 focus-visible:ring-stone-500 focus:bg-white"
      />
    </div>
  );
}

export default function ConfigForm({ initialConfigs }) {
  const [configs, setConfigs] = useState(initialConfigs);
  const [loading, setLoading] = useState(false);
  const [activeSection, setActiveSection] = useState("seo");
  const sectionRefs = useRef({});

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveSection(entry.target.id);
          }
        });
      },
      {
        rootMargin: "-100px 0px -70% 0px",
        threshold: 0,
      },
    );

    Object.values(sectionRefs.current).forEach((ref) => {
      if (ref) observer.observe(ref);
    });

    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    Object.entries(sectionRefs.current).forEach(([id, ref]) => {
      if (ref) {
        sectionRefs.current[id] = ref;
      }
    });
  }, []);

  const scrollToSection = (id) => {
    const el = document.getElementById(id);
    if (el) {
      const top = el.offsetTop - 80;
      window.scrollTo({ top, behavior: "smooth" });
    }
  };

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

  return (
    <form onSubmit={handleSubmit}>
      <div className="flex items-center justify-between sticky top-[58px] z-10 bg-stone-50/95 backdrop-blur-sm border-b border-stone-200 -mx-8 px-8 py-4">
        <div>
          <h2 className="text-2xl font-bold text-stone-900">
            System Configuration
          </h2>
          <p className="text-sm text-stone-500 mt-1">
            Manage AI behaviors, SEO, and storage settings.
          </p>
        </div>
        <Button
          type="submit"
          disabled={loading}
          className="bg-stone-900 hover:bg-stone-800 h-11 px-8 gap-2 shadow-lg shadow-stone-300/50"
        >
          {loading ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <Save className="h-4 w-4" />
          )}
          Save Changes
        </Button>
      </div>

      <div className="flex gap-8 py-8">
        <aside className="hidden lg:block w-56 shrink-0">
          <nav className="sticky top-[178px] space-y-1">
            {sections.map((section) => {
              const Icon = section.icon;
              const isActive = activeSection === section.id;
              return (
                <button
                  key={section.id}
                  type="button"
                  onClick={() => scrollToSection(section.id)}
                  className={cn(
                    "flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all",
                    isActive
                      ? "bg-stone-900 text-white shadow-md"
                      : "text-stone-600 hover:bg-stone-100 hover:text-stone-900",
                  )}
                >
                  <Icon className="h-4 w-4" />
                  {section.title}
                </button>
              );
            })}
          </nav>
        </aside>

        <div className="flex-1 space-y-8 max-w-3xl">
          <Section id="seo" title="Global SEO & Identity" icon={Globe}>
            <ConfigInput
              id="SITE_NAME"
              label="Site Name"
              placeholder="Flaz Next"
              type="text"
              value={configs.SITE_NAME}
              onChange={handleChange}
            />
            <ConfigInput
              id="SITE_DESCRIPTION"
              label="Default Description"
              placeholder="AI-powered visual page builder"
              type="text"
              value={configs.SITE_DESCRIPTION}
              onChange={handleChange}
            />
            <ConfigInput
              id="FAVICON_URL"
              label="Favicon URL"
              placeholder="/favicon.ico"
              type="text"
              isFullWidth
              value={configs.FAVICON_URL}
              onChange={handleChange}
            />
          </Section>

          <Section id="ai" title="AI Behavior Defaults" icon={Cpu}>
            <ConfigInput
              id="DEFAULT_LLM_PROVIDER"
              label="Default Provider"
              placeholder="openai, anthropic, google, xai"
              type="text"
              value={configs.DEFAULT_LLM_PROVIDER}
              onChange={handleChange}
            />
            <ConfigInput
              id="DEFAULT_MODEL_NAME"
              label="Model Name"
              placeholder="gpt-4o, claude-3-5-sonnet"
              type="text"
              value={configs.DEFAULT_MODEL_NAME}
              onChange={handleChange}
            />
            <ConfigInput
              id="AI_TEMPERATURE"
              label="Temperature (0-1)"
              placeholder="0.7"
              type="text"
              value={configs.AI_TEMPERATURE}
              onChange={handleChange}
            />
            <div />
            <ConfigTextarea
              id="SYSTEM_PROMPT_PREFIX"
              label="Global System Prompt Prefix"
              placeholder="Inject custom global instructions for all generations..."
              value={configs.SYSTEM_PROMPT_PREFIX}
              onChange={handleChange}
            />
          </Section>

          <Section id="llm" title="LLM API Keys" icon={Sparkles}>
            <ConfigInput
              id="GEMINI_API_KEY"
              label="Gemini API Key"
              placeholder="AIZA..."
              value={configs.GEMINI_API_KEY}
              onChange={handleChange}
            />
            <ConfigInput
              id="XAI_API_KEY"
              label="XAI API Key"
              placeholder="xai-..."
              value={configs.XAI_API_KEY}
              onChange={handleChange}
            />
            <ConfigInput
              id="ANTHROPIC_API_KEY"
              label="Anthropic API Key"
              placeholder="sk-ant-..."
              value={configs.ANTHROPIC_API_KEY}
              onChange={handleChange}
            />
            <ConfigInput
              id="OPENAI_API_KEY"
              label="OpenAI API Key"
              placeholder="sk-..."
              value={configs.OPENAI_API_KEY}
              onChange={handleChange}
            />
            <ConfigInput
              id="GROQ_API_KEY"
              label="Groq API Key"
              placeholder="gsk_..."
              value={configs.GROQ_API_KEY}
              onChange={handleChange}
            />
            <ConfigInput
              id="OPENROUTER_API_KEY"
              label="OpenRouter API Key"
              placeholder="sk-or-..."
              value={configs.OPENROUTER_API_KEY}
              onChange={handleChange}
            />
          </Section>

          <Section id="unsplash" title="Unsplash API" icon={ImageIcon}>
            <ConfigInput
              id="UNSPLASH_ACCESS_KEY"
              label="Access Key"
              placeholder="Unsplash Access Key"
              value={configs.UNSPLASH_ACCESS_KEY}
              onChange={handleChange}
            />
            <ConfigInput
              id="UNSPLASH_SECRET_KEY"
              label="Secret Key"
              placeholder="Unsplash Secret Key"
              value={configs.UNSPLASH_SECRET_KEY}
              onChange={handleChange}
            />
          </Section>

          <Section id="s3" title="AWS S3 Storage (Compatible)" icon={Database}>
            <ConfigInput
              id="S3_ACCESS_KEY"
              label="Access Key ID"
              placeholder="AKIA..."
              type="text"
              value={configs.S3_ACCESS_KEY}
              onChange={handleChange}
            />
            <ConfigInput
              id="S3_SECRET_KEY"
              label="Secret Access Key"
              placeholder="Secret Key"
              value={configs.S3_SECRET_KEY}
              onChange={handleChange}
            />
            <ConfigInput
              id="S3_REGION"
              label="Region"
              placeholder="us-east-1"
              type="text"
              value={configs.S3_REGION}
              onChange={handleChange}
            />
            <ConfigInput
              id="S3_BUCKET"
              label="Bucket Name"
              placeholder="my-bucket"
              type="text"
              value={configs.S3_BUCKET}
              onChange={handleChange}
            />
            <ConfigInput
              id="S3_ENDPOINT"
              label="Endpoint (for Cloudflare/DigitalOcean)"
              placeholder="https://..."
              type="text"
              value={configs.S3_ENDPOINT}
              onChange={handleChange}
            />
          </Section>
        </div>
      </div>
    </form>
  );
}
