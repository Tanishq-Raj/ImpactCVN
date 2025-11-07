import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Plus, Search, FileText, Edit2 } from 'lucide-react';
import { defaultCVData } from '@/lib/defaultData';
import { CVData } from '@/lib/types';
import { v4 as uuidv4 } from 'uuid';

interface Resume {
  id: string;
  name: string;
  lastModified: Date;
  data: CVData;
}

export default function DashboardPage() {
  const navigate = useNavigate();
  const [resumes, setResumes] = useState<Resume[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editingName, setEditingName] = useState('');

  useEffect(() => {
    // In a real app, this would fetch from an API
    // For now, we'll use localStorage
    const savedResumes = localStorage.getItem('resumes');
    if (savedResumes) {
      setResumes(JSON.parse(savedResumes));
    }
  }, []);

  const createNewResume = () => {
    const newResume: Resume = {
      id: uuidv4(),
      name: 'Untitled Resume',
      lastModified: new Date(),
      data: { ...defaultCVData }
    };
    
    const updatedResumes = [...resumes, newResume];
    setResumes(updatedResumes);
    localStorage.setItem('resumes', JSON.stringify(updatedResumes));
    
    // Navigate to editor with the new resume ID
    navigate(`/editor/${newResume.id}`);
  };

  const handleRename = (id: string, currentName: string) => {
    setEditingId(id);
    setEditingName(currentName);
  };

  const saveRename = (id: string) => {
    const updatedResumes = resumes.map(resume => 
      resume.id === id ? { ...resume, name: editingName } : resume
    );
    setResumes(updatedResumes);
    localStorage.setItem('resumes', JSON.stringify(updatedResumes));
    setEditingId(null);
  };

  const cancelRename = () => {
    setEditingId(null);
  };

  const filteredResumes = resumes.filter(resume => 
    resume.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-violet-50 to-indigo-100 animate-fade-in">
      <div className="container mx-auto py-8 px-4">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold mb-2">Impact CV</h1>
            <p className="text-gray-600">My Resume : Create, manage, and customize your professional resumes</p>
          </div>

          <div className="flex justify-between items-center mb-6">
            <div className="relative w-full max-w-sm">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                type="text"
                placeholder="Search resumes..."
                className="pl-10"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <div className="flex gap-2">
              <select className="bg-white border rounded-md px-4 py-2 text-sm">
                <option value="all">All Templates</option>
                <option value="professional">Professional</option>
                <option value="creative">Creative</option>
                <option value="simple">Simple</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Create New Resume Card */}
            <Card className="border border-dashed hover:border-primary/50 transition-all hover:shadow-md bg-white/40 backdrop-blur-sm">
              <CardContent className="pt-6 flex flex-col items-center justify-center h-64">
                <div className="w-16 h-16 rounded-full bg-blue-100 flex items-center justify-center mb-4">
                  <Plus className="h-8 w-8 text-blue-500" />
                </div>
                <h3 className="font-medium text-lg mb-1">Create New Resume</h3>
                <p className="text-sm text-gray-500 text-center">Start with a new template</p>
              </CardContent>
              <CardFooter className="justify-center pb-6">
                <Button onClick={createNewResume} variant="outline" className="w-full">
                  Create Resume
                </Button>
              </CardFooter>
            </Card>

            {/* Existing Resumes */}
            {filteredResumes.length > 0 ? (
              filteredResumes.map(resume => (
                <Card key={resume.id} className="overflow-hidden hover:shadow-md transition-all bg-white/40 backdrop-blur-sm">
                  <CardContent className="pt-6 pb-0">
                    <div className="flex items-center mb-4">
                      <FileText className="h-5 w-5 text-blue-500 mr-2" />
                      {editingId === resume.id ? (
                        <div className="flex items-center w-full">
                          <Input 
                            value={editingName} 
                            onChange={(e) => setEditingName(e.target.value)}
                            className="h-8 mr-2"
                            autoFocus
                          />
                          <Button size="sm" variant="ghost" onClick={() => saveRename(resume.id)}>Save</Button>
                          <Button size="sm" variant="ghost" onClick={cancelRename}>Cancel</Button>
                        </div>
                      ) : (
                        <div className="flex items-center justify-between w-full">
                          <h3 className="font-medium text-lg">{resume.name}</h3>
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            onClick={() => handleRename(resume.id, resume.name)}
                            className="ml-2 p-1 h-auto"
                          >
                            <Edit2 className="h-4 w-4" />
                          </Button>
                        </div>
                      )}
                    </div>
                    <p className="text-sm text-gray-500">
                      Last modified: {new Date(resume.lastModified).toLocaleDateString()}
                    </p>
                  </CardContent>
                  <CardFooter className="flex justify-between pt-4">
                    <Button 
                      variant="ghost" 
                      size="sm"
                      onClick={() => navigate(`/editor/${resume.id}`)}
                    >
                      Edit
                    </Button>
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => navigate(`/preview/${resume.id}`)}
                    >
                      Preview
                    </Button>
                  </CardFooter>
                </Card>
              ))
            ) : (
              <div className="col-span-full flex flex-col items-center justify-center p-12 bg-white/30 backdrop-blur-sm rounded-lg border">
                <div className="mb-4">
                  <FileText className="h-12 w-12 text-gray-300" />
                </div>
                <h3 className="text-xl font-medium text-gray-700 mb-2">No resumes yet</h3>
                <p className="text-gray-500 text-center mb-4">Create your first resume to get started</p>
                <Button onClick={createNewResume}>Create Resume</Button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}