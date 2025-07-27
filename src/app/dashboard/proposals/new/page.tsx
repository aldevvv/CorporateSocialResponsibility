// app/dashboard/proposals/new/page.tsx
import { ProposalForm } from "../components/ProposalForm";
import { FileText } from "lucide-react";
import Link from "next/link";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb';

export default function NewProposalPage() {
  return (
    <div className="space-y-6 p-6">
      {/* Breadcrumb Navigation */}
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink asChild>
              <Link href="/dashboard/overview">Overview</Link>
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbLink asChild>
              <Link href="/dashboard/proposals">Manajemen Proposal</Link>
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>Buat Proposal Baru</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      {/* Header Section */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
        <div>
          <h1 className="text-2xl lg:text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            Buat Proposal Baru
          </h1>
          <p className="text-gray-600 mt-1">Buat proposal program TJSL PLN UIP Makassar</p>
        </div>
        <div className="flex items-center space-x-2 text-sm text-gray-500">
          <FileText className="h-4 w-4" />
          <span>Form Proposal</span>
        </div>
      </div>

      {/* Form Container */}
      <div className="bg-white rounded-lg border shadow-sm">
        <ProposalForm />
      </div>
    </div>
  );
}