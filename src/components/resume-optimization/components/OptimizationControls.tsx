
import { Button } from "@/components/ui/button";
import { ArrowLeft, Check } from "lucide-react";

interface OptimizationControlsProps {
  onClose: () => void;
  onFinalize: () => void;
  isMobile?: boolean;
}

export const OptimizationControls: React.FC<OptimizationControlsProps> = ({
  onClose,
  onFinalize,
  isMobile = false,
}) => {
  return (
    <div className={`flex ${isMobile ? 'flex-col' : 'flex-row'} gap-4 p-4 border-t`}>
      <Button onClick={onClose} variant="outline">
        <ArrowLeft className="w-4 h-4 mr-2" />
        Back
      </Button>
      <Button onClick={onFinalize}>
        <Check className="w-4 h-4 mr-2" />
        Finalize Resume
      </Button>
    </div>
  );
};
