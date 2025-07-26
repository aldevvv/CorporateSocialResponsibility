// app/dashboard/proposals/new/page.tsx
import { ProposalForm } from "../components/ProposalForm"; // Komponen form baru

export default function NewProposalPage() {
  return (
    <div className="p-6 bg-white rounded-lg shadow">
      <h1 className="text-2xl font-bold mb-6">Buat Proposal Program Baru</h1>
      <ProposalForm />
    </div>
  );
}