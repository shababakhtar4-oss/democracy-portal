import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

interface DetailPageLayoutProps {
  title: string;
  children: React.ReactNode;
}

const DetailPageLayout = ({ title, children }: DetailPageLayoutProps) => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background">
      <div className="border-b bg-civic-surface">
        <div className="container mx-auto px-6 py-4 flex items-center space-x-4">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate("/dashboard")}
            className="text-civic-primary hover:text-civic-primary-light hover:bg-civic-primary/10"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Dashboard
          </Button>
          <div className="h-6 w-px bg-border" />
          <h1 className="text-2xl font-bold text-civic-primary">{title}</h1>
        </div>
      </div>
      
      <main className="container mx-auto px-6 py-8">
        {children}
      </main>
    </div>
  );
};

export default DetailPageLayout;