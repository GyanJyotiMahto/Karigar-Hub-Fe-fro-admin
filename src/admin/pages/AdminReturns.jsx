import { RotateCcw } from 'lucide-react';
import { EmptyState, PageHeader } from '../components/AdminUI';

export default function AdminReturns() {
  return (
    <div className="space-y-6">
      <PageHeader title="Return Requests" sub="Customer return and refund requests" icon={RotateCcw} />
      <EmptyState
        icon="🔄"
        message="No return requests yet"
        sub="Return requests will appear here once customers submit them."
      />
    </div>
  );
}
