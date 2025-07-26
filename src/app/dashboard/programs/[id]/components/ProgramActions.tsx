// app/dashboard/programs/[id]/components/ProgramActions.tsx
'use client';
import { Button } from '@/components/ui/button';
import { Program } from '@prisma/client';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

export function ProgramActions({ program }: { program: Program }) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const handleMarkAsComplete = async () => {
    setIsLoading(true);
    try {
      const response = await fetch(`/api/programs/${program.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: 'SELESAI' }),
      });

      if (response.ok) {
        router.refresh();
      } else {
        console.error('Failed to update program status');
      }
    } catch (error) {
      console.error('Error updating program:', error);
    } finally {
      setIsLoading(false);
    }
  };

  if (program.status === 'BERJALAN') {
    return (
      <Button 
        onClick={handleMarkAsComplete}
        disabled={isLoading}
        className="bg-green-600 hover:bg-green-700"
      >
        {isLoading ? 'Memproses...' : 'Tandai sebagai Selesai'}
      </Button>
    );
  }
  return null;
}