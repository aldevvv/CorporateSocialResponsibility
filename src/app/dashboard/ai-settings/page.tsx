// app/dashboard/ai-settings/page.tsx
'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { Settings, Plus, Key, MessageSquare, Loader2, Edit, Trash2 } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import ApiKeyForm from './components/ApiKeyForm';
import PromptForm from './components/PromptForm';

export default function AISettingsPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [apiKeys, setApiKeys] = useState([]);
  const [prompts, setPrompts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showApiKeyForm, setShowApiKeyForm] = useState(false);
  const [editingApiKey, setEditingApiKey] = useState(null);
  const [showPromptForm, setShowPromptForm] = useState(false);
  const [editingPrompt, setEditingPrompt] = useState(null);

  useEffect(() => {
    if (status === 'loading') return;

    if (!session) {
      router.push('/login');
      return;
    }

    if (session.user.role !== 'ADMIN') {
      router.push('/dashboard');
      return;
    }

    fetchData();
  }, [session, status, router]);

  const fetchData = async () => {
    try {
      setLoading(true);
      
      // Fetch API Keys
      const apiKeysResponse = await fetch('/api/ai-settings/api-keys');
      if (apiKeysResponse.ok) {
        const apiKeysData = await apiKeysResponse.json();
        setApiKeys(apiKeysData);
      }

      // Fetch Prompts
      const promptsResponse = await fetch('/api/ai-settings/prompts');
      if (promptsResponse.ok) {
        const promptsData = await promptsResponse.json();
        setPrompts(promptsData);
      }
      
    } catch (error) {
      console.error('Error fetching AI settings:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleFormSuccess = () => {
    fetchData(); // Refresh the data
    setEditingApiKey(null);
    setEditingPrompt(null);
  };

  const handleFormClose = () => {
    setShowApiKeyForm(false);
    setEditingApiKey(null);
  };

  const handlePromptFormClose = () => {
    setShowPromptForm(false);
    setEditingPrompt(null);
  };

  const handleDeleteApiKey = async (apiKeyId: string) => {
    if (!confirm('Yakin ingin menghapus API key ini?')) {
      return;
    }

    try {
      const response = await fetch(`/api/ai-settings/api-keys?id=${apiKeyId}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        fetchData(); // Refresh the data
      } else {
        const error = await response.json();
        alert(`Error: ${error.error}`);
      }
    } catch (error) {
      console.error('Error deleting API key:', error);
      alert('Terjadi kesalahan saat menghapus API key');
    }
  };

  const handleDeletePrompt = async (promptId: string) => {
    if (!confirm('Yakin ingin menghapus prompt ini?')) {
      return;
    }

    try {
      const response = await fetch(`/api/ai-settings/prompts?id=${promptId}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        fetchData(); // Refresh the data
      } else {
        const error = await response.json();
        alert(`Error: ${error.error}`);
      }
    } catch (error) {
      console.error('Error deleting prompt:', error);
      alert('Terjadi kesalahan saat menghapus prompt');
    }
  };

  if (status === 'loading' || loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-[#1E40AF]" />
      </div>
    );
  }

  if (!session || session.user.role !== 'ADMIN') {
    return null;
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Settings className="h-8 w-8 text-[#1E40AF]" />
          <div>
            <h1 className="text-3xl font-bold text-gray-900">AI Settings</h1>
            <p className="text-gray-600">Kelola API Key dan Prompt untuk AI Insights</p>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <Tabs defaultValue="api-keys" className="space-y-6">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="api-keys" className="flex items-center gap-2">
            <Key className="h-4 w-4" />
            API Keys
          </TabsTrigger>
          <TabsTrigger value="prompts" className="flex items-center gap-2">
            <MessageSquare className="h-4 w-4" />
            AI Prompts
          </TabsTrigger>
        </TabsList>

        {/* API Keys Tab */}
        <TabsContent value="api-keys" className="space-y-6">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-semibold">API Keys</h2>
            <Button
              className="bg-[#1E40AF] hover:bg-[#1E3A8A]"
              onClick={() => setShowApiKeyForm(true)}
            >
              <Plus className="h-4 w-4 mr-2" />
              Tambah API Key
            </Button>
          </div>

          {apiKeys.length === 0 ? (
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-12">
                <Key className="h-12 w-12 text-gray-400 mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">Belum ada API Key</h3>
                <p className="text-gray-500 text-center mb-4">
                  Tambahkan API Key untuk menggunakan layanan AI dalam sistem
                </p>
                <Button
                  className="bg-[#1E40AF] hover:bg-[#1E3A8A]"
                  onClick={() => setShowApiKeyForm(true)}
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Tambah API Key Pertama
                </Button>
              </CardContent>
            </Card>
          ) : (
            <div className="grid gap-4">
              {apiKeys.map((apiKey: any) => (
                <Card key={apiKey.id}>
                  <CardHeader>
                    <CardTitle className="flex items-center justify-between">
                      <span>{apiKey.name}</span>
                      <div className="flex items-center gap-2">
                        <span className={`px-2 py-1 rounded-full text-xs ${
                          apiKey.isActive
                            ? 'bg-green-100 text-green-800'
                            : 'bg-red-100 text-red-800'
                        }`}>
                          {apiKey.isActive ? 'Aktif' : 'Nonaktif'}
                        </span>
                        <div className="flex gap-1">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => {
                              setEditingApiKey(apiKey);
                              setShowApiKeyForm(true);
                            }}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleDeleteApiKey(apiKey.id)}
                          >
                            <Trash2 className="h-4 w-4 text-red-500" />
                          </Button>
                        </div>
                      </div>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      <p><strong>Provider:</strong> {apiKey.provider}</p>
                      <p><strong>API Key:</strong> {apiKey.apiKeyPreview}</p>
                      {apiKey.availableModels && apiKey.availableModels.length > 0 && (
                        <p><strong>Models:</strong> {apiKey.availableModels.length} tersedia</p>
                      )}
                      <p><strong>Dibuat:</strong> {new Date(apiKey.createdAt).toLocaleDateString('id-ID')}</p>
                      {apiKey.createdBy && (
                        <p><strong>Dibuat oleh:</strong> {apiKey.createdBy.name || apiKey.createdBy.email}</p>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>

        {/* Prompts Tab */}
        <TabsContent value="prompts" className="space-y-6">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-semibold">AI Prompts</h2>
            <Button
              className="bg-[#1E40AF] hover:bg-[#1E3A8A]"
              onClick={() => setShowPromptForm(true)}
            >
              <Plus className="h-4 w-4 mr-2" />
              Tambah Prompt
            </Button>
          </div>

          {prompts.length === 0 ? (
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-12">
                <MessageSquare className="h-12 w-12 text-gray-400 mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">Belum ada Prompt</h3>
                <p className="text-gray-500 text-center mb-4">
                  Buat prompt AI untuk berbagai keperluan analisis dan insight
                </p>
                <Button
                  className="bg-[#1E40AF] hover:bg-[#1E3A8A]"
                  onClick={() => setShowPromptForm(true)}
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Tambah Prompt Pertama
                </Button>
              </CardContent>
            </Card>
          ) : (
            <div className="grid gap-4">
              {prompts.map((prompt: any) => (
                <Card key={prompt.id}>
                  <CardHeader>
                    <CardTitle className="flex items-center justify-between">
                      <div>
                        <span>{prompt.name}</span>
                        <div className="flex items-center gap-2 mt-1">
                          <span className={`px-2 py-1 rounded-full text-xs ${
                            prompt.isActive
                              ? 'bg-green-100 text-green-800'
                              : 'bg-red-100 text-red-800'
                          }`}>
                            {prompt.isActive ? 'Aktif' : 'Nonaktif'}
                          </span>
                          <span className="px-2 py-1 rounded-full text-xs bg-blue-100 text-blue-800">
                            {prompt.category.replace('_', ' ')}
                          </span>
                        </div>
                      </div>
                      <div className="flex gap-1">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => {
                            setEditingPrompt(prompt);
                            setShowPromptForm(true);
                          }}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDeletePrompt(prompt.id)}
                        >
                          <Trash2 className="h-4 w-4 text-red-500" />
                        </Button>
                      </div>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      {prompt.description && (
                        <p><strong>Deskripsi:</strong> {prompt.description}</p>
                      )}
                      <p><strong>API Key:</strong> {prompt.apiKey?.name || 'Unknown'}</p>
                      <p><strong>Model:</strong> {prompt.model}</p>
                      <p><strong>Temperature:</strong> {prompt.temperature}</p>
                      <p><strong>Max Tokens:</strong> {prompt.maxTokens}</p>
                      <p><strong>Dibuat:</strong> {new Date(prompt.createdAt).toLocaleDateString('id-ID')}</p>
                      {prompt.createdBy && (
                        <p><strong>Dibuat oleh:</strong> {prompt.createdBy.name || prompt.createdBy.email}</p>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>

      {/* API Key Form Modal */}
      <ApiKeyForm
        isOpen={showApiKeyForm}
        onClose={handleFormClose}
        onSuccess={handleFormSuccess}
        editData={editingApiKey}
      />

      {/* Prompt Form Modal */}
      <PromptForm
        isOpen={showPromptForm}
        onClose={handlePromptFormClose}
        onSuccess={handleFormSuccess}
        editData={editingPrompt}
      />
    </div>
  );
}