
import { Progress } from '@/components/ui/progress';

interface ScoreDisplayProps {
  matchScore: number;
}

export const ScoreDisplay = ({ matchScore }: ScoreDisplayProps) => {
  // Ensure score is a valid number
  const validScore = Math.max(0, Math.min(100, matchScore || 0));
  
  const scoreColor = validScore >= 80 
    ? 'bg-green-500' 
    : validScore >= 60 
      ? 'bg-yellow-500' 
      : 'bg-red-500';

  console.log('ScoreDisplay: Rendering AI-calculated score:', validScore);
  
  return (
    <div className="space-y-2">
      <div className="flex justify-between items-center">
        <span className="text-sm font-medium">AI Match Analysis</span>
        <span className="text-sm font-medium">{validScore}%</span>
      </div>
      <Progress value={validScore} className={scoreColor} />
    </div>
  );
};
