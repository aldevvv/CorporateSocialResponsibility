// app/dashboard/programs/[id]/components/ManajemenDokumen.tsx
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { DokumenProgram } from '@prisma/client';
import { Button } from '@/components/ui/button';

interface ManajemenDokumenProps {
  programId: string;
  userId: string;
  dokumen: DokumenProgram[];
}

export function ManajemenDokumen({ programId, userId, dokumen }: ManajemenDokumenProps) {
  const router = useRouter();
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);

  const handleUpload = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!selectedFile) {
      alert("Pilih file terlebih dahulu.");
      return;
    }
    setIsUploading(true);

    const formData = new FormData();
    formData.append('file', selectedFile);
    formData.append('programId', programId);
    formData.append('userId', userId);

    try {
      const response = await fetch('/api/documents', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) throw new Error("Gagal upload file");

      alert("Upload berhasil!");
      router.refresh();

    } catch (error) {
      console.error(error);
      alert(`ERROR! ${(error as Error).message}`);
    } finally {
      setIsUploading(false);
      (e.target as HTMLFormElement).reset();
    }
  };

  return (
    <div className="p-6 bg-white rounded-lg shadow">
      <h2 className="text-xl font-semibold mb-4">Manajemen Dokumen Penting</h2>

      <form onSubmit={handleUpload} className="mb-6 p-4 border rounded-md">
        <label className="font-medium">Unggah Dokumen Baru</label>
        <div className="flex items-center gap-4 mt-2">
          <input
            type="file"
            onChange={(e) => e.target.files && setSelectedFile(e.target.files[0])}
            className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-gray-50 file:text-gray-700 hover:file:bg-gray-100"
          />
          <Button type="submit" disabled={!selectedFile || isUploading}>
            {isUploading ? 'Mengunggah...' : 'Upload'}
          </Button>
        </div>
      </form>

      <div>
        <h3 className="font-medium">Dokumen Tersimpan</h3>
        <ul className="mt-2 space-y-2">
          {dokumen.map(doc => (
            <li key={doc.id} className="flex justify-between items-center p-2 border rounded-md">
              <a
                href={doc.urlDokumen || `/api/documents/${doc.id}`}
                download={doc.namaDokumen}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 hover:underline"
              >
                {doc.namaDokumen}
              </a>
              <span className="text-sm text-gray-500">{doc.tipeDokumen}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}