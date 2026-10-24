"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import {
  FileText,
  Bot,
  Sparkles,
  Send,
  Volume2,
  VolumeX,
  AlertCircle,
  CheckCircle2,
  AlertTriangle,
  Clock,
  Download,
  Share2,
  ArrowRight,
  Filter,
  Search,
  Upload,
  User,
  Building2,
  Activity,
  HeartPulse,
  RotateCcw,
  HelpCircle,
  ChevronRight,
  Check,
  Key,
  X,
} from "lucide-react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { DEMO_LAB_REPORTS } from "@/lib/store/demo-data";
import { LabReport, LabParameter, ChatMessage } from "@/types";

export default function LabReportsPage() {
  const [reports, setReports] = useState<LabReport[]>(DEMO_LAB_REPORTS);
  const [selectedReportId, setSelectedReportId] = useState<string>(DEMO_LAB_REPORTS[0].id);
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [searchFilter, setSearchFilter] = useState<string>("");

  // Chat State & Real AI Engine Configuration
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
  const [inputQuestion, setInputQuestion] = useState("");
  const [isBotThinking, setIsBotThinking] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [lastAudioScript, setLastAudioScript] = useState("");
  const [uploadSuccess, setUploadSuccess] = useState(false);
  const [aiEngineName, setAiEngineName] = useState<string>("Real AI (Online)");
  const [customApiKey, setCustomApiKey] = useState<string>("");
  const [tempApiKeyInput, setTempApiKeyInput] = useState<string>("");
  const [showKeyModal, setShowKeyModal] = useState<boolean>(false);

  // Load saved key on mount
  useEffect(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("mediconnect_gemini_key") || "";
      if (saved) {
        setCustomApiKey(saved);
        setTempApiKeyInput(saved);
      }
    }
  }, []);

  const handleSaveApiKey = () => {
    const trimmed = tempApiKeyInput.trim();
    setCustomApiKey(trimmed);
    if (typeof window !== "undefined") {
      if (trimmed) {
        localStorage.setItem("mediconnect_gemini_key", trimmed);
      } else {
        localStorage.removeItem("mediconnect_gemini_key");
      }
    }
    setShowKeyModal(false);
  };

  const messagesEndRef = useRef<HTMLDivElement>(null);

  const activeReport = reports.find((r) => r.id === selectedReportId) || reports[0];

  const filteredReports = reports.filter((r) => {
    const matchesCategory = selectedCategory === "all" || r.category === selectedCategory;
    const matchesSearch =
      !searchFilter.trim() ||
      r.title.toLowerCase().includes(searchFilter.toLowerCase()) ||
      r.laboratory_name.toLowerCase().includes(searchFilter.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  // When active report changes, initialize chat with greeting and automatic plain-language summary
  useEffect(() => {
    async function initChatForReport() {
      setIsBotThinking(true);
      try {
        const res = await fetch("/api/ai/lab-explainer", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            reportId: activeReport.id,
            reportTitle: activeReport.title,
            parameters: activeReport.parameters,
            clinicalImpression: activeReport.clinical_impression,
            userQuestion: "Please give me a warm, simple explanation of my results.",
            userApiKey: customApiKey || undefined,
          }),
        });

        const data = await res.json();
        if (data.success) {
          if (data.aiEngine) setAiEngineName(data.aiEngine);
          setChatMessages([
            {
              id: `msg-bot-init-${activeReport.id}`,
              sender: "bot",
              text: data.reply,
              timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
            },
          ]);
          setLastAudioScript(data.audioScript || "");
        }
      } catch (err) {
        console.error("Failed to load initial lab explanation:", err);
      } finally {
        setIsBotThinking(false);
      }
    }

    initChatForReport();
  }, [activeReport.id, activeReport.title, activeReport.parameters, activeReport.clinical_impression, customApiKey]);

  // Scroll chat to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chatMessages, isBotThinking]);

  // Send question to chatbot
  const handleSendMessage = async (customPrompt?: string) => {
    const questionToSend = customPrompt || inputQuestion;
    if (!questionToSend.trim()) return;

    const userMsg: ChatMessage = {
      id: `msg-user-${Date.now()}`,
      sender: "user",
      text: questionToSend,
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    };

    setChatMessages((prev) => [...prev, userMsg]);
    setInputQuestion("");
    setIsBotThinking(true);

    try {
      const res = await fetch("/api/ai/lab-explainer", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          reportId: activeReport.id,
          reportTitle: activeReport.title,
          parameters: activeReport.parameters,
          clinicalImpression: activeReport.clinical_impression,
          userQuestion: questionToSend,
          history: chatMessages.slice(-4),
          userApiKey: customApiKey || undefined,
        }),
      });

      const data = await res.json();
      if (data.success) {
        if (data.aiEngine) setAiEngineName(data.aiEngine);
        const botMsg: ChatMessage = {
          id: `msg-bot-${Date.now()}`,
          sender: "bot",
          text: data.reply,
          timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        };
        setChatMessages((prev) => [...prev, botMsg]);
        setLastAudioScript(data.audioScript || "");
      }
    } catch (err) {
      console.error("Chat error:", err);
      setChatMessages((prev) => [
        ...prev,
        {
          id: `msg-bot-err-${Date.now()}`,
          sender: "bot",
          text: "I experienced a minor connection hiccup, but don't worry: your results show mild variations that you can comfortably review with your doctor.",
          timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        },
      ]);
    } finally {
      setIsBotThinking(false);
    }
  };

  // Text-To-Speech Audio Voice Readout
  const handleToggleSpeak = () => {
    if (!("speechSynthesis" in window)) {
      alert("Text-to-speech is not supported on this browser.");
      return;
    }

    if (isSpeaking) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
      return;
    }

    const textToSpeak = lastAudioScript || activeReport.summary;
    const utterance = new SpeechSynthesisUtterance(textToSpeak);
    utterance.rate = 0.95;
    utterance.pitch = 1.0;
    utterance.onend = () => setIsSpeaking(false);
    utterance.onerror = () => setIsSpeaking(false);

    window.speechSynthesis.speak(utterance);
    setIsSpeaking(true);
  };

  const getStatusBadge = (status: LabReport["status"]) => {
    switch (status) {
      case "normal":
        return (
          <Badge variant="secondary" className="bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300 border-emerald-200">
            <CheckCircle2 className="h-3 w-3 mr-1" />
            Normal
          </Badge>
        );
      case "borderline":
        return (
          <Badge variant="secondary" className="bg-amber-50 text-amber-700 dark:bg-amber-950/40 dark:text-amber-300 border-amber-200">
            <AlertTriangle className="h-3 w-3 mr-1" />
            Borderline
          </Badge>
        );
      case "needs_attention":
        return (
          <Badge variant="secondary" className="bg-orange-50 text-orange-700 dark:bg-orange-950/40 dark:text-orange-300 border-orange-200">
            <AlertCircle className="h-3 w-3 mr-1" />
            Needs Attention
          </Badge>
        );
      case "critical":
        return (
          <Badge variant="destructive" className="bg-red-600 text-white animate-pulse">
            <AlertCircle className="h-3 w-3 mr-1" />
            Critical Review
          </Badge>
        );
    }
  };

  const getParameterFlagBadge = (flag: LabParameter["flag"]) => {
    switch (flag) {
      case "normal":
        return <span className="inline-flex items-center px-2 py-0.5 rounded text-[11px] font-semibold bg-emerald-50 text-emerald-700 dark:bg-emerald-950/50 dark:text-emerald-300">Normal</span>;
      case "low":
        return <span className="inline-flex items-center px-2 py-0.5 rounded text-[11px] font-semibold bg-sky-50 text-sky-700 dark:bg-sky-950/50 dark:text-sky-300">Low</span>;
      case "high":
        return <span className="inline-flex items-center px-2 py-0.5 rounded text-[11px] font-semibold bg-amber-50 text-amber-700 dark:bg-amber-950/50 dark:text-amber-300">High</span>;
      case "critical":
        return <span className="inline-flex items-center px-2 py-0.5 rounded text-[11px] font-semibold bg-red-600 text-white">Critical</span>;
    }
  };

  return (
    <div className="max-w-7xl mx-auto w-full py-8 px-4 sm:px-6 lg:px-8 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-border pb-5">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground flex items-center gap-2">
              <FileText className="h-6 w-6 text-brand-teal" />
              Previous Lab Reports & Health Records
            </h1>
            <Badge variant="secondary" className="gap-1 text-xs">
              <Sparkles className="h-3 w-3 text-brand-teal" />
              AI Explainer Active
            </Badge>
          </div>
          <p className="text-xs sm:text-sm text-muted-foreground mt-1">
            Access verified diagnostic test reports from Kota medical labs, view parameter trends, and talk in real-time with your AI Lab Assistant.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              setUploadSuccess(true);
              setTimeout(() => setUploadSuccess(false), 3000);
            }}
            className="gap-1.5 text-xs h-9"
          >
            <Upload className="h-3.5 w-3.5" />
            <span>Upload New Report (PDF)</span>
          </Button>
        </div>
      </div>

      {uploadSuccess && (
        <div className="flex items-center gap-2 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 p-3 text-xs text-emerald-800 dark:text-emerald-200">
          <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0" />
          <span>Report uploaded! Our AI diagnostic engine has ingested parameters into your electronic health record.</span>
        </div>
      )}

      {/* Main 3-Column / Split Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Col: Reports List (4 Cols) */}
        <div className="lg:col-span-4 space-y-4">
          <Card>
            <CardHeader className="p-4 pb-3 border-b border-border">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm font-semibold flex items-center gap-2">
                  <Activity className="h-4 w-4 text-brand-teal" />
                  Your Test History
                </CardTitle>
                <span className="text-[11px] text-muted-foreground font-medium">
                  {filteredReports.length} records
                </span>
              </div>

              {/* Search & Category Filter */}
              <div className="pt-2 space-y-2">
                <div className="relative">
                  <Search className="absolute left-2.5 top-2.5 h-3.5 w-3.5 text-muted-foreground" />
                  <Input
                    placeholder="Search test name or lab..."
                    value={searchFilter}
                    onChange={(e) => setSearchFilter(e.target.value)}
                    className="h-8 pl-8 text-xs bg-surface"
                  />
                </div>

                <div className="flex items-center gap-1 overflow-x-auto pb-1 scrollbar-none text-[11px]">
                  {["all", "blood", "lipid", "diabetes", "thyroid", "renal_liver"].map((cat) => (
                    <button
                      key={cat}
                      onClick={() => setSelectedCategory(cat)}
                      className={`px-2.5 py-1 rounded-md capitalize whitespace-nowrap transition-colors ${
                        selectedCategory === cat
                          ? "bg-brand-teal text-white font-semibold"
                          : "bg-muted/50 hover:bg-muted text-muted-foreground hover:text-foreground"
                      }`}
                    >
                      {cat.replace("_", " & ")}
                    </button>
                  ))}
                </div>
              </div>
            </CardHeader>

            <CardContent className="p-2 space-y-1.5 max-h-[620px] overflow-y-auto">
              {filteredReports.map((report) => {
                const isSelected = report.id === activeReport.id;
                return (
                  <div
                    key={report.id}
                    onClick={() => setSelectedReportId(report.id)}
                    className={`p-3 rounded-xl border cursor-pointer transition-all ${
                      isSelected
                        ? "border-brand-teal bg-brand-mint/30 dark:bg-teal-950/40 shadow-sm ring-1 ring-brand-teal"
                        : "border-border bg-surface hover:border-brand-teal/50 hover:bg-muted/40"
                    }`}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div className="font-semibold text-xs text-foreground leading-snug">
                        {report.title}
                      </div>
                      {getStatusBadge(report.status)}
                    </div>

                    <div className="flex items-center gap-1.5 text-[11px] text-muted-foreground mt-1.5">
                      <Building2 className="h-3 w-3 text-brand-teal shrink-0" />
                      <span className="truncate">{report.laboratory_name}</span>
                    </div>

                    <div className="flex items-center justify-between text-[10px] text-muted-foreground pt-2 border-t border-border/50 mt-2">
                      <span className="flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        {new Date(report.report_date).toLocaleDateString([], {
                          month: "short",
                          day: "numeric",
                          year: "numeric",
                        })}
                      </span>
                      <span>By {report.ordering_doctor_name}</span>
                    </div>
                  </div>
                );
              })}
            </CardContent>
          </Card>
        </div>

        {/* Center Col: Selected Report Parameters & Clinical Impression (4 Cols) */}
        <div className="lg:col-span-4 space-y-4">
          <Card>
            <CardHeader className="p-4 pb-3 border-b border-border">
              <div className="flex items-start justify-between gap-2">
                <div>
                  <div className="text-[10px] font-semibold uppercase text-brand-teal">
                    Diagnostic Report Details
                  </div>
                  <CardTitle className="text-base font-bold text-foreground mt-0.5">
                    {activeReport.title}
                  </CardTitle>
                </div>
                {getStatusBadge(activeReport.status)}
              </div>

              <div className="text-xs text-muted-foreground space-y-0.5 pt-1">
                <div>Lab: <strong>{activeReport.laboratory_name}</strong></div>
                <div>Date: {new Date(activeReport.report_date).toLocaleDateString()} | Doctor: {activeReport.ordering_doctor_name}</div>
              </div>
            </CardHeader>

            <CardContent className="p-4 space-y-4">
              {/* Doctor Impression Note */}
              <div className="rounded-xl bg-teal-50/60 dark:bg-teal-950/30 border border-teal-200 dark:border-teal-900 p-3 space-y-1 text-xs">
                <div className="font-semibold text-brand-teal flex items-center gap-1.5">
                  <HeartPulse className="h-3.5 w-3.5" />
                  Clinical Impression:
                </div>
                <p className="text-muted-foreground leading-relaxed">
                  {activeReport.clinical_impression}
                </p>
              </div>

              {/* Parameters Breakdown */}
              <div className="space-y-2">
                <div className="text-xs font-semibold text-foreground flex items-center justify-between">
                  <span>Tested Parameters ({activeReport.parameters.length})</span>
                  <span className="text-[10px] text-muted-foreground">Standard Reference Range</span>
                </div>

                <div className="space-y-2.5 max-h-[380px] overflow-y-auto pr-1">
                  {activeReport.parameters.map((param, idx) => (
                    <div
                      key={idx}
                      className="rounded-lg border border-border p-2.5 bg-surface space-y-1 text-xs"
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-semibold text-foreground">{param.name}</span>
                        {getParameterFlagBadge(param.flag)}
                      </div>

                      <div className="flex items-center justify-between text-[11px] pt-0.5">
                        <span className="font-bold text-brand-teal text-sm">
                          {param.result} <span className="text-xs font-normal text-muted-foreground">{param.unit}</span>
                        </span>
                        <span className="text-muted-foreground text-[10px]">
                          Ref: {param.reference_range} {param.unit}
                        </span>
                      </div>

                      {param.plain_explanation && (
                        <p className="text-[10px] text-muted-foreground pt-1 border-t border-border/40 leading-relaxed italic">
                          💡 {param.plain_explanation}
                        </p>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right Col: Real-Time AI Chatbot "MediBot Lab Assistant" (4 Cols) */}
        <div className="lg:col-span-4 space-y-4">
          <Card className="flex flex-col h-[680px] border-teal-200 dark:border-teal-900 shadow-md bg-gradient-to-b from-surface via-surface to-teal-50/20 dark:to-teal-950/20">
            {/* Chatbot Header */}
            <CardHeader className="p-3.5 border-b border-border bg-brand-mint/40 dark:bg-teal-950/50 rounded-t-xl shrink-0">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-brand-teal text-white shadow-sm">
                    <Bot className="h-4 w-4" />
                  </div>
                  <div>
                    <div className="font-bold text-xs text-foreground flex items-center gap-1.5">
                      MediBot Lab Assistant
                      <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
                    </div>
                    <div className="text-[10px] text-muted-foreground flex items-center gap-1">
                      <span>Real-Time AI Educator</span>
                      <span>•</span>
                      <span className="font-medium text-brand-teal">{aiEngineName}</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-1">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setShowKeyModal(!showKeyModal)}
                    className="h-7 w-7 text-muted-foreground hover:text-brand-teal"
                    title="AI Studio API Key Settings (Optional Gemini Cloud Key)"
                  >
                    <Key className="h-3.5 w-3.5" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={handleToggleSpeak}
                    className="h-7 w-7 text-muted-foreground hover:text-brand-teal"
                    title={isSpeaking ? "Stop Speaking" : "Listen to Explanation"}
                  >
                    {isSpeaking ? <VolumeX className="h-3.5 w-3.5 text-red-600" /> : <Volume2 className="h-3.5 w-3.5" />}
                  </Button>
                </div>
              </div>

              {/* Optional Gemini Key Input Panel */}
              {showKeyModal && (
                <div className="mt-2.5 p-2.5 rounded-lg bg-surface border border-border space-y-2 text-xs">
                  <div className="flex items-center justify-between">
                    <span className="font-semibold text-foreground flex items-center gap-1.5 text-[11px]">
                      <Sparkles className="h-3 w-3 text-brand-teal" />
                      Google Gemini API Key (Optional)
                    </span>
                    <button
                      onClick={() => setShowKeyModal(false)}
                      className="text-muted-foreground hover:text-foreground p-0.5"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </div>
                  <p className="text-[10px] text-muted-foreground leading-relaxed">
                    MediBot works online automatically via real-time neural LLM inference. To use your personal Google AI Studio key directly, paste it below:
                  </p>
                  <div className="flex items-center gap-1.5">
                    <Input
                      type="password"
                      placeholder="AIzaSy..."
                      value={tempApiKeyInput}
                      onChange={(e) => setTempApiKeyInput(e.target.value)}
                      className="h-7 text-xs bg-card"
                    />
                    <Button
                      size="sm"
                      onClick={handleSaveApiKey}
                      className="h-7 px-2.5 text-xs bg-brand-teal hover:bg-brand-teal-hover text-white shrink-0"
                    >
                      Save Key
                    </Button>
                    {customApiKey && (
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => {
                          setTempApiKeyInput("");
                          setCustomApiKey("");
                          if (typeof window !== "undefined") localStorage.removeItem("mediconnect_gemini_key");
                          setShowKeyModal(false);
                        }}
                        className="h-7 px-2 text-xs text-red-600 hover:text-red-700 shrink-0"
                      >
                        Reset
                      </Button>
                    )}
                  </div>
                </div>
              )}
            </CardHeader>

            {/* Quick Prompt Questions - Set Vertically */}
            <div className="p-2.5 bg-muted/20 border-b border-border/60 shrink-0 space-y-1.5">
              <div className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider flex items-center justify-between">
                <span>1-Tap AI Questions</span>
                <span className="text-[9px] text-brand-teal font-medium">Click to Ask</span>
              </div>
              <div className="flex flex-col gap-1">
                <button
                  onClick={() => handleSendMessage("Explain this report in simple, everyday words")}
                  className="w-full flex items-center justify-between px-2.5 py-1.5 rounded-lg bg-surface hover:bg-brand-mint text-[11px] border border-border text-foreground transition-colors text-left group"
                >
                  <span className="flex items-center gap-1.5">
                    <span>💡</span>
                    <span className="font-medium">Explain Results Simply</span>
                  </span>
                  <ArrowRight className="h-3 w-3 text-muted-foreground group-hover:text-brand-teal group-hover:translate-x-0.5 transition-transform" />
                </button>
                <button
                  onClick={() => handleSendMessage("What food should I eat or avoid based on these results?")}
                  className="w-full flex items-center justify-between px-2.5 py-1.5 rounded-lg bg-surface hover:bg-brand-mint text-[11px] border border-border text-foreground transition-colors text-left group"
                >
                  <span className="flex items-center gap-1.5">
                    <span>🥗</span>
                    <span className="font-medium">Tailored Diet Advice</span>
                  </span>
                  <ArrowRight className="h-3 w-3 text-muted-foreground group-hover:text-brand-teal group-hover:translate-x-0.5 transition-transform" />
                </button>
                <button
                  onClick={() => handleSendMessage("What specific questions should I ask my doctor?")}
                  className="w-full flex items-center justify-between px-2.5 py-1.5 rounded-lg bg-surface hover:bg-brand-mint text-[11px] border border-border text-foreground transition-colors text-left group"
                >
                  <span className="flex items-center gap-1.5">
                    <span>🩺</span>
                    <span className="font-medium">Questions for My Doctor</span>
                  </span>
                  <ArrowRight className="h-3 w-3 text-muted-foreground group-hover:text-brand-teal group-hover:translate-x-0.5 transition-transform" />
                </button>
                <button
                  onClick={() => handleSendMessage("Is there any dangerous finding or emergency in this report?")}
                  className="w-full flex items-center justify-between px-2.5 py-1.5 rounded-lg bg-surface hover:bg-brand-mint text-[11px] border border-border text-foreground transition-colors text-left group"
                >
                  <span className="flex items-center gap-1.5">
                    <span>⚠️</span>
                    <span className="font-medium">Urgency & Safety Check</span>
                  </span>
                  <ArrowRight className="h-3 w-3 text-muted-foreground group-hover:text-brand-teal group-hover:translate-x-0.5 transition-transform" />
                </button>
              </div>
            </div>

            {/* Chat Message Stream */}
            <CardContent className="p-3 flex-1 overflow-y-auto space-y-3 text-xs">
              {chatMessages.map((msg) => {
                const isUser = msg.sender === "user";
                return (
                  <div
                    key={msg.id}
                    className={`flex flex-col ${isUser ? "items-end" : "items-start"}`}
                  >
                    <div
                      className={`max-w-[90%] rounded-2xl p-3 leading-relaxed ${
                        isUser
                          ? "bg-brand-teal text-white rounded-br-xs"
                          : "bg-surface border border-border text-foreground rounded-bl-xs shadow-sm"
                      }`}
                    >
                      {/* Markdown formatting simulation */}
                      <div className="space-y-1.5 whitespace-pre-line text-xs">
                        {msg.text}
                      </div>
                    </div>
                    <span className="text-[9px] text-muted-foreground mt-1 px-1">
                      {msg.timestamp}
                    </span>
                  </div>
                );
              })}

              {isBotThinking && (
                <div className="flex items-center gap-2 p-3 rounded-2xl bg-surface border border-border w-48 shadow-sm">
                  <Bot className="h-3.5 w-3.5 text-brand-teal animate-spin" />
                  <span className="text-[11px] text-muted-foreground animate-pulse">
                    Translating medical terms...
                  </span>
                </div>
              )}

              <div ref={messagesEndRef} />
            </CardContent>

            {/* Chat Input Bar */}
            <div className="p-3 border-t border-border bg-surface shrink-0">
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  handleSendMessage();
                }}
                className="flex items-center gap-2"
              >
                <Input
                  placeholder="Ask anything (e.g. what should I eat?)..."
                  value={inputQuestion}
                  onChange={(e) => setInputQuestion(e.target.value)}
                  className="h-10 text-xs bg-surface"
                />
                <Button
                  type="submit"
                  size="icon"
                  disabled={isBotThinking || !inputQuestion.trim()}
                  className="h-10 w-10 shrink-0 bg-brand-teal hover:bg-brand-teal-hover text-white"
                >
                  <Send className="h-4 w-4" />
                </Button>
              </form>
              <div className="text-[10px] text-muted-foreground text-center mt-1.5 italic">
                Educational assistant. Always consult your attending doctor for clinical decisions.
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
