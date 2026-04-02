import { EmptyState, PageHeader } from '../components/AdminUI';

export default function AdminReviews() {
  return (
    <div>
      <PageHeader title="Reviews & Ratings" sub="Customer reviews from the platform" />
      <EmptyState icon="⭐" message="No reviews yet" sub="Reviews will appear here once customers start reviewing products." />
    </div>
  );
}
