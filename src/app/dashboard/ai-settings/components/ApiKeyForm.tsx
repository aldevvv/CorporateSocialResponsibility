// app/dashboard/ai-settings/components/ApiKeyForm.tsx
'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Loader2, Eye, EyeOff, TestTube, X } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface ApiKeyFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  editData?: {
    id: string;
    name: string;
    provider: string;
    baseUrl?: string;
  };
}

const AI_PROVIDERS = [
  { value: 'OPENAI', label: 'OpenAI', description: 'GPT models dari OpenAI' },
  { value: 'ANTHROPIC', label: 'Anthropic', description: 'Claude models dari Anthropic' },
  { value: 'GOOGLE', label: 'Google AI', description: 'Gemini models dari Google' },
  { value: 'COHERE', label: 'Cohere', description: 'Command models dari Cohere' },
  { value: 'CUSTOM', label: 'Custom', description: 'Custom AI endpoint' },
];

export default function ApiKeyForm({ isOpen, onClose, onSuccess, editData }: ApiKeyFormProps) {
  const [formData, setFormData] = useState({
    name: editData?.name || '',
    provider: editData?.provider || '',
    apiKey: '',
    baseUrl: editData?.baseUrl || '',
  });
  const [loading, setLoading] = useState(false);
  const [showApiKey, setShowApiKey] = useState(false);
  const [testingConnection, setTestingConnection] = useState(false);
  const [testResult, setTestResult] = useState<{ success: boolean; models: string[]; error?: string } | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const isEditing = !!editData;
      const response = await fetch('/api/ai-settings/api-keys', {
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
          provider: '',
          apiKey: '',
          baseUrl: '',
        });
        setTestResult(null);
      } else {
        const error = await response.json();
        alert(`Error: ${error.error}`);
      }
    } catch (error) {
      console.error('Error saving API key:', error);
      alert('Terjadi kesalahan saat menyimpan API key');
    } finally {
      setLoading(false);
    }
  };

  const testConnection = async () => {
    if (!formData.apiKey || !formData.provider) {
      alert('Harap isi API Key dan Provider terlebih dahulu');
      return;
    }

    setTestingConnection(true);
    setTestResult(null);

    try {
      // Simulate testing - in real implementation, this would call the actual API
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Mock successful response
      const mockModels = formData.provider === 'OPENAI' 
        ? ['gpt-4', 'gpt-4-turbo', 'gpt-3.5-turbo']
        : formData.provider === 'ANTHROPIC'
        ? ['claude-3-5-sonnet-20241022', 'claude-3-haiku-20240307']
        : ['model-1', 'model-2'];

      setTestResult({
        success: true,
        models: mockModels,
      });
    } catch (error) {
      setTestResult({
        success: false,
        models: [],
        error: 'Terjadi kesalahan saat menguji koneksi',
      });
    } finally {
      setTestingConnection(false);
    }
  };

  const selectedProvider = AI_PROVIDERS.find(p => p.value === formData.provider);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b">
          <h2 className="text-xl font-semibold">
            {editData ? 'Edit API Key' : 'Tambah API Key Baru'}
          </h2>
          <Button variant="ghost" size="sm" onClick={onClose}>
            <X className="h-4 w-4" />
          </Button>
        </div>

        {/* Content */}
        <div className="p-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Basic Information */}
            <div className="space-y-4">
              <div>
                <Label htmlFor="name">Nama API Key</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="Contoh: OpenAI GPT-4 Production"
                  required
                />
              </div>

              <div>
                <Label htmlFor="provider">AI Provider</Label>
                <Select
                  value={formData.provider}
                  onValueChange={(value) => setFormData({ ...formData, provider: value })}
                  required
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Pilih AI Provider" />
                  </SelectTrigger>
                  <SelectContent>
                    {AI_PROVIDERS.map((provider) => (
                      <SelectItem key={provider.value} value={provider.value}>
                        <div>
                          <div className="font-medium">{provider.label}</div>
                          <div className="text-sm text-gray-500">{provider.description}</div>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="apiKey">API Key</Label>
                <div className="relative">
                  <Input
                    id="apiKey"
                    type={showApiKey ? 'text' : 'password'}
                    value={formData.apiKey}
                    onChange={(e) => setFormData({ ...formData, apiKey: e.target.value })}
                    placeholder="Masukkan API Key"
                    required
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute right-2 top-1/2 -translate-y-1/2"
                    onClick={() => setShowApiKey(!showApiKey)}
                  >
                    {showApiKey ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </Button>
                </div>
              </div>

              {formData.provider === 'CUSTOM' && (
                <div>
                  <Label htmlFor="baseUrl">Base URL</Label>
                  <Input
                    id="baseUrl"
                    value={formData.baseUrl}
                    onChange={(e) => setFormData({ ...formData, baseUrl: e.target.value })}
                    placeholder="https://api.example.com/v1"
                  />
                </div>
              )}
            </div>

            {/* Test Connection */}
            {formData.apiKey && formData.provider && (
              <div className="space-y-4">
                <div className="flex items-center gap-2">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={testConnection}
                    disabled={testingConnection}
                  >
                    {testingConnection ? (
                      <Loader2 className="h-4 w-4 animate-spin mr-2" />
                    ) : (
                      <TestTube className="h-4 w-4 mr-2" />
                    )}
                    Test Koneksi
                  </Button>
                </div>

                {testResult && (
                  <Card>
                    <CardHeader>
                      <CardTitle className={`text-sm ${testResult.success ? 'text-green-600' : 'text-red-600'}`}>
                        {testResult.success ? '✅ Koneksi Berhasil' : '❌ Koneksi Gagal'}
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      {testResult.success ? (
                        <div>
                          <p className="text-sm text-gray-600 mb-2">
                            Model yang tersedia ({testResult.models.length}):
                          </p>
                          <div className="max-h-32 overflow-y-auto">
                            {testResult.models.map((model, index) => (
                              <div key={index} className="text-xs bg-gray-100 px-2 py-1 rounded mb-1">
                                {model}
                              </div>
                            ))}
                          </div>
                        </div>
                      ) : (
                        <p className="text-sm text-red-600">{testResult.error}</p>
                      )}
                    </CardContent>
                  </Card>
                )}
              </div>
            )}

            {/* Provider Info */}
            {selectedProvider && (
              <Card className="bg-blue-50 border-blue-200">
                <CardContent className="pt-4">
                  <div className="flex items-start gap-3">
                    <div className="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
                    <div>
                      <h4 className="font-medium text-blue-900">{selectedProvider.label}</h4>
                      <p className="text-sm text-blue-700">{selectedProvider.description}</p>
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