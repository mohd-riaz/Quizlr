import DashboardNav from "@/components/dashboard/DashboardNav";
import QuizWizard from "@/components/quiz/QuizWizard";

export default function NewQuizPage() {
  return (
    <div className="min-h-screen bg-background">
      <DashboardNav />
      <QuizWizard />
    </div>
  );
}
