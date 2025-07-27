// app/panduan/page.tsx
import { Metadata } from 'next'
import PanduanMDX from '../../../content/panduan.mdx'

export const metadata: Metadata = {
  title: 'Panduan Platform CSR PLN',
  description: 'Panduan lengkap penggunaan platform monitoring CSR PLN Indonesia',
}

export default function PanduanPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="bg-white rounded-lg shadow-lg p-8">
            <div className="prose prose-lg max-w-none">
              <PanduanMDX />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}