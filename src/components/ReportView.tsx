
import { ReportViewProps } from './report/types';
import ReportView from './report/ReportView';

// Re-export the component from the new location
export default function ReportViewWrapper(props: ReportViewProps) {
  return <ReportView {...props} />;
}
