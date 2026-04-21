"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { AlertCircle, Loader2, ArrowLeft, ArrowRight, Check } from "lucide-react";
import QuestionManager from "@/components/quiz/question-manager";
import { QuestionItem } from "@/components/quiz/question-card";

export default function QuizWizard() {
  const router = useRouter();
  const createQuiz = useMutation(api.quizzes.create);

  const [step, setStep] = useState(0);

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [timeLimit, setTimeLimit] = useState(20);
  const [questions, setQuestions] = useState<QuestionItem[]>([]);

  const [isSaving, setIsSaving] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);

  const handleSave = async () => {
    if (questions.length === 0) { setSaveError("Add at least one question before saving."); return; }
    for (let i = 0; i < questions.length; i++) {
      const q = questions[i];
      if (!q.text.trim()) { setSaveError(`Question ${i + 1} has no text.`); return; }
      if (q.options.some((o) => !o.trim())) { setSaveError(`Question ${i + 1} has empty options.`); return; }
    }
    setIsSaving(true);
    setSaveError(null);
    try {
      await createQuiz({
        title: title.trim(),
        description: description.trim() || undefined,
        timeLimit,
        questions: questions.map((q) => ({
          text: q.text,
          options: q.options,
          correctIndex: q.correctIndex,
          explanation: q.explanation,
        })),
      });
      router.push("/dashboard");
    } catch (err) {
      setSaveError("Something went wrong — please try again.");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto px-6 pt-12 pb-24">

      {/* ── STEP 1: Quiz Details ─────────────────────────────── */}
      {step === 0 && (
        <section>
          <h1 className="text-2xl font-bold tracking-tight mb-1">Quiz details</h1>
          <p className="text-sm text-muted-foreground mb-6">Give it a name and a pace.</p>

          <div className="space-y-5">
            <div>
              <label htmlFor="title" className="text-sm font-medium mb-1.5 block">
                Title <span className="text-muted-foreground">*</span>
              </label>
              <Input
                id="title"
                placeholder="e.g. World Geography"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                maxLength={120}
              />
            </div>

            <div>
              <label htmlFor="description" className="text-sm font-medium mb-1.5 block">
                Description <span className="text-muted-foreground font-normal">(optional)</span>
              </label>
              <Textarea
                id="description"
                placeholder="What's this quiz about?"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="resize-none"
              />
            </div>

            <div>
              <label className="text-sm font-medium mb-3 flex items-center justify-between">
                <span>Time per question</span>
                <span className="font-mono text-sm tabular-nums">{timeLimit}s</span>
              </label>
              <input
                type="range"
                min={5}
                max={60}
                step={5}
                value={timeLimit}
                onChange={(e) => setTimeLimit(Number(e.target.value))}
                className="w-full accent-primary"
              />
              <div className="flex justify-between text-[11px] font-mono mt-2 text-muted-foreground">
                <span>5s</span>
                <span>60s</span>
              </div>
            </div>
          </div>

          <div className="flex items-center justify-between mt-10">
            <Button variant="ghost" className="cursor-pointer" onClick={() => router.push("/dashboard")}>
              <ArrowLeft className="w-4 h-4" /> Back
            </Button>
            <Button className="cursor-pointer" onClick={() => setStep(1)} disabled={!title.trim()}>
              Next <ArrowRight className="w-4 h-4" />
            </Button>
          </div>
        </section>
      )}

      {/* ── STEP 2: Questions ────────────────────────────────── */}
      {step === 1 && (
        <section>
          <div className="flex items-end justify-between mb-6">
            <div>
              <h1 className="text-2xl font-bold tracking-tight">Questions</h1>
              <p className="text-sm text-muted-foreground mt-1">Generate with AI, or add your own.</p>
            </div>
            <span className="inline-flex items-center h-6 px-2.5 rounded-full text-xs font-mono font-medium border border-border bg-card text-muted-foreground">
              {questions.length} {questions.length === 1 ? "question" : "questions"}
            </span>
          </div>

          <QuestionManager
            questions={questions}
            onChange={setQuestions}
            timeLimit={timeLimit}
            initialTopic={description || title}
          />

          {saveError && (
            <div className="flex items-start gap-2 text-destructive text-sm bg-destructive/10 border border-destructive/20 rounded-lg p-3 mt-4">
              <AlertCircle className="w-4 h-4 mt-0.5 flex-shrink-0" />
              <span>{saveError}</span>
            </div>
          )}

          <div className="flex items-center justify-between mt-10">
            <Button variant="ghost" className="cursor-pointer" onClick={() => setStep(0)} disabled={isSaving}>
              <ArrowLeft className="w-4 h-4" /> Back
            </Button>
            <Button
              className="cursor-pointer"
              onClick={handleSave}
              disabled={isSaving || questions.length === 0}
            >
              {isSaving
                ? <><Loader2 className="w-4 h-4 animate-spin" />Saving…</>
                : <><Check className="w-4 h-4" />Save Quiz</>}
            </Button>
          </div>
        </section>
      )}
    </div>
  );
}
