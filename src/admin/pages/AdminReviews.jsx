import { Star } from 'lucide-react';
import { EmptyState, PageHeader } from '../components/AdminUI';

export default function AdminReviews() {
  return (
    <div className="space-y-6">
      <PageHeader title="Reviews & Ratings" sub="Customer reviews from the platform" icon={Star} />
      <EmptyState
        icon="⭐"
        message="No reviews yet"
        sub="Reviews will appear here once customers start reviewing products."
      />
    </div>
  );
}
