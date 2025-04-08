
import { Button } from '@/components/ui/button';
import { Upload } from 'lucide-react';

interface AnalyzeButtonProps {
  onClick: () => void;
  disabled: boolean;
  isAnalyzing: boolean;
}

const AnalyzeButton = ({ onClick, disabled, isAnalyzing }: AnalyzeButtonProps) => {
  return (
    <div className="flex justify-center mt-8">
      <Button 
        onClick={onClick} 
        disabled={disabled}
        size="lg"
        className="w-full md:w-1/2"
      >
        {isAnalyzing ? (
          <>Analyzing... <Upload className="ml-2 h-4 w-4 animate-spin" /></>
        ) : (
          <>Analyze Match <Upload className="ml-2 h-4 w-4" /></>
        )}
      </Button>
    </div>
  );
};

export default AnalyzeButton;
