import DashboardHeader from "@/components/dashboard/DashboardHeader";
import QuizWizard from "@/components/quiz/QuizWizard";

export default function NewQuizPage() {
  return (
    <div className="min-h-screen bg-background">
      <DashboardHeader />
      <QuizWizard />
    </div>
  );
}
