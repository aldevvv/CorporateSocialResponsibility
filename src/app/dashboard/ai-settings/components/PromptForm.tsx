// app/dashboard/ai-settings/components/PromptForm.tsx
'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Loader2, X, MessageSquare } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';

interface PromptFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  editData?: {
    id: string;
    name: string;
    description?: string;
    systemPrompt: string;
    userPrompt: string;
    apiKeyId: string;
    model: string;
    temperature: number;
    maxTokens: number;
    category: string;
  };
}

const PROMPT_CATEGORIES = [
  { value: 'GENERAL', label: 'General', description: 'Prompt umum untuk berbagai keperluan' },
  { value: 'PROPOSAL_ANALYSIS', label: 'Analisis Proposal', description: 'Analisis dan evaluasi proposal CSR' },
  { value: 'REPORT_GENERATION', label: 'Pembuatan Laporan', description: 'Generate laporan dan dokumentasi' },
  { value: 'DATA_INSIGHTS', label: 'Data Insights', description: 'Analisis data dan insight bisnis' },
  { value: 'DOCUMENT_SUMMARY', label: 'Ringkasan Dokumen', description: 'Meringkas dokumen dan teks panjang' },
];

export default function PromptForm({ isOpen, onClose, onSuccess, editData }: PromptFormProps) {
  const [formData, setFormData] = useState({
    name: editData?.name || '',
    description: editData?.description || '',
    systemPrompt: editData?.systemPrompt || '',
    userPrompt: editData?.userPrompt || '',
    apiKeyId: editData?.apiKeyId || '',
    model: editData?.model || '',
    temperature: editData?.temperature || 0.7,
    maxTokens: editData?.maxTokens || 1000,
    category: editData?.category || 'GENERAL',
  });
  const [loading, setLoading] = useState(false);
  const [apiKeys, setApiKeys] = useState<Array<{
    id: string;
    name: string;
    provider: string;
    isActive: boolean;
    availableModels: string[];
  }>>([]);
  const [availableModels, setAvailableModels] = useState<string[]>([]);

  useEffect(() => {
    if (isOpen) {
      fetchApiKeys();
    }
  }, [isOpen]);

  useEffect(() => {
    if (formData.apiKeyId) {
      const selectedApiKey = apiKeys.find(key => key.id === formData.apiKeyId);
      if (selectedApiKey) {
        setAvailableModels(selectedApiKey.availableModels || []);
        // Reset model if it's not available in the new API key
        if (formData.model && !selectedApiKey.availableModels?.includes(formData.model)) {
          setFormData(prev => ({ ...prev, model: '' }));
        }
      }
    }
  }, [formData.apiKeyId, formData.model, apiKeys]);

  const fetchApiKeys = async () => {
    try {
      const response = await fetch('/api/ai-settings/api-keys');
      if (response.ok) {
        const data = await response.json();
        setApiKeys(data.filter((key: { isActive: boolean }) => key.isActive));
      }
    } catch (error) {
      console.error('Error fetching API keys:', error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const isEditing = !!editData;
      const response = await fetch('/api/ai-settings/prompts', {
        method: isEditing ? 'PUT' : 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(isEditing ? { ...formData, id: editData.id } : formData),
      });

      if (response.ok) {
        onSuccess();
        onClose();
        // Reset form
        setFormData({
          name: '',
          description: '',
          systemPrompt: '',
          userPrompt: '',
          apiKeyId: '',
          model: '',
          temperature: 0.7,
          maxTokens: 1000,
          category: 'GENERAL',
        });
      } else {
        const error = await response.json();
        alert(`Error: ${error.error}`);
      }
    } catch (error) {
      console.error('Error saving prompt:', error);
      alert('Terjadi kesalahan saat menyimpan prompt');
    } finally {
      setLoading(false);
    }
  };

  const selectedCategory = PROMPT_CATEGORIES.find(c => c.value === formData.category);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b">
          <h2 className="text-xl font-semibold">
            {editData ? 'Edit AI Prompt' : 'Tambah AI Prompt Baru'}
          </h2>
          <Button variant="ghost" size="sm" onClick={onClose}>
            <X className="h-4 w-4" />
          </Button>
        </div>

        {/* Content */}
        <div className="p-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Basic Information */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="name">Nama Prompt</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="Contoh: Analisis Proposal CSR"
                  required
                />
              </div>

              <div>
                <Label htmlFor="category">Kategori</Label>
                <Select
                  value={formData.category}
                  onValueChange={(value) => setFormData({ ...formData, category: value })}
                  required
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Pilih Kategori" />
                  </SelectTrigger>
                  <SelectContent>
                    {PROMPT_CATEGORIES.map((category) => (
                      <SelectItem key={category.value} value={category.value}>
                        <div>
                          <div className="font-medium">{category.label}</div>
                          <div className="text-sm text-gray-500">{category.description}</div>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div>
              <Label htmlFor="description">Deskripsi</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Jelaskan fungsi dan tujuan prompt ini..."
                rows={2}
              />
            </div>

            {/* AI Configuration */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="apiKey">API Key</Label>
                <Select
                  value={formData.apiKeyId}
                  onValueChange={(value) => setFormData({ ...formData, apiKeyId: value })}
                  required
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Pilih API Key" />
                  </SelectTrigger>
                  <SelectContent>
                    {apiKeys.map((apiKey) => (
                      <SelectItem key={apiKey.id} value={apiKey.id}>
                        <div>
                          <div className="font-medium">{apiKey.name}</div>
                          <div className="text-sm text-gray-500">{apiKey.provider}</div>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="model">Model</Label>
                <Select
                  value={formData.model}
                  onValueChange={(value) => setFormData({ ...formData, model: value })}
                  required
                  disabled={!formData.apiKeyId}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Pilih Model" />
                  </SelectTrigger>
                  <SelectContent>
                    {availableModels.map((model) => (
                      <SelectItem key={model} value={model}>
                        {model}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Parameters */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="temperature">Temperature</Label>
                <Input
                  id="temperature"
                  type="number"
                  min="0"
                  max="2"
                  step="0.1"
                  value={formData.temperature}
                  onChange={(e) => setFormData({ ...formData, temperature: parseFloat(e.target.value) })}
                />
                <p className="text-xs text-gray-500 mt-1">0 = deterministik, 2 = sangat kreatif</p>
              </div>

              <div>
                <Label htmlFor="maxTokens">Max Tokens</Label>
                <Input
                  id="maxTokens"
                  type="number"
                  min="1"
                  max="4000"
                  value={formData.maxTokens}
                  onChange={(e) => setFormData({ ...formData, maxTokens: parseInt(e.target.value) })}
                />
                <p className="text-xs text-gray-500 mt-1">Maksimal panjang respons</p>
              </div>
            </div>

            {/* Prompts */}
            <div className="space-y-4">
              <div>
                <Label htmlFor="systemPrompt">System Prompt</Label>
                <Textarea
                  id="systemPrompt"
                  value={formData.systemPrompt}
                  onChange={(e) => setFormData({ ...formData, systemPrompt: e.target.value })}
                  placeholder="Anda adalah asisten AI yang membantu menganalisis proposal CSR..."
                  rows={4}
                  required
                />
                <p className="text-xs text-gray-500 mt-1">Instruksi dasar untuk AI tentang peran dan konteks</p>
              </div>

              <div>
                <Label htmlFor="userPrompt">User Prompt Template</Label>
                <Textarea
                  id="userPrompt"
                  value={formData.userPrompt}
                  onChange={(e) => setFormData({ ...formData, userPrompt: e.target.value })}
                  placeholder="Analisis proposal berikut: {proposal_content}"
                  rows={4}
                  required
                />
                <p className="text-xs text-gray-500 mt-1">Template prompt yang akan dikirim ke AI. Gunakan {'{variable}'} untuk placeholder</p>
              </div>
            </div>

            {/* Category Info */}
            {selectedCategory && (
              <Card className="bg-blue-50 border-blue-200">
                <CardContent className="pt-4">
                  <div className="flex items-start gap-3">
                    <MessageSquare className="w-5 h-5 text-blue-500 mt-0.5" />
                    <div>
                      <h4 className="font-medium text-blue-900">{selectedCategory.label}</h4>
                      <p className="text-sm text-blue-700">{selectedCategory.description}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Form Actions */}
            <div className="flex justify-end gap-3 pt-4 border-t">
              <Button type="button" variant="outline" onClick={onClose}>
                Batal
              </Button>
              <Button 
                type="submit" 
                disabled={loading}
                className="bg-[#1E40AF] hover:bg-[#1E3A8A]"
              >
                {loading ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin mr-2" />
                    Menyimpan...
                  </>
                ) : (
                  editData ? 'Update' : 'Simpan'
                )}
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}