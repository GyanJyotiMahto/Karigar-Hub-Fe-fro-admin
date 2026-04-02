import { EmptyState, PageHeader } from '../components/AdminUI';

export default function AdminReturns() {
  return (
    <div>
      <PageHeader title="Return Requests" sub="Customer return and refund requests" />
      <EmptyState icon="🔄" message="No return requests yet" sub="Return requests will appear here once customers submit them." />
    </div>
  );
}
