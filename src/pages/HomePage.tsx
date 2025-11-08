import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { FileText, Sparkles, Zap, Target } from 'lucide-react';

export default function HomePage() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-violet-50 via-indigo-50 to-purple-50">
      {/* Header */}
      <header className="container mx-auto px-4 py-6">
        <nav className="flex justify-between items-center">
          <div className="flex items-center gap-2">
            <FileText className="h-8 w-8 text-violet-600" />
            <h1 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-violet-600 to-indigo-600">
              ImpactCV
            </h1>
          </div>
          <div className="flex gap-3">
            <Button 
              variant="ghost" 
              onClick={() => navigate('/login')}
              className="hover:bg-violet-100"
            >
              Login
            </Button>
            <Button 
              onClick={() => navigate('/signup')}
              className="bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-700 hover:to-indigo-700"
            >
              Sign Up
            </Button>
          </div>
        </nav>
      </header>

      {/* Hero Section */}
      <main className="container mx-auto px-4 py-20">
        <div className="max-w-4xl mx-auto text-center">
          {/* Main Heading */}
          <div className="mb-6">
            <h2 className="text-5xl md:text-6xl font-bold text-gray-900 mb-4">
              Build impactful resumes with{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-violet-600 to-indigo-600">
                AI-powered customization
              </span>
            </h2>
          </div>

          {/* Tagline */}
          <p className="text-xl text-gray-600 mb-12 max-w-2xl mx-auto">
            Create professional, ATS-friendly resumes in minutes. Stand out from the crowd with intelligent design and content optimization.
          </p>

          {/* CTA Button */}
          <div className="mb-16">
            <Button 
              size="lg"
              onClick={() => navigate('/login')}
              className="bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-700 hover:to-indigo-700 text-lg px-8 py-6 h-auto shadow-lg hover:shadow-xl transition-all"
            >
              Get Started
              <Sparkles className="ml-2 h-5 w-5" />
            </Button>
          </div>

          {/* Feature Cards */}
          <div className="grid md:grid-cols-3 gap-6 mt-20">
            <div className="bg-white/60 backdrop-blur-sm rounded-xl p-6 shadow-md hover:shadow-lg transition-all border border-violet-100">
              <div className="w-12 h-12 bg-violet-100 rounded-lg flex items-center justify-center mb-4 mx-auto">
                <Zap className="h-6 w-6 text-violet-600" />
              </div>
              <h3 className="text-lg font-semibold mb-2 text-gray-900">Lightning Fast</h3>
              <p className="text-gray-600 text-sm">
                Create professional resumes in minutes with our intuitive drag-and-drop editor
              </p>
            </div>

            <div className="bg-white/60 backdrop-blur-sm rounded-xl p-6 shadow-md hover:shadow-lg transition-all border border-indigo-100">
              <div className="w-12 h-12 bg-indigo-100 rounded-lg flex items-center justify-center mb-4 mx-auto">
                <Sparkles className="h-6 w-6 text-indigo-600" />
              </div>
              <h3 className="text-lg font-semibold mb-2 text-gray-900">AI-Powered</h3>
              <p className="text-gray-600 text-sm">
                Smart suggestions and content optimization to make your resume stand out
              </p>
            </div>

            <div className="bg-white/60 backdrop-blur-sm rounded-xl p-6 shadow-md hover:shadow-lg transition-all border border-purple-100">
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mb-4 mx-auto">
                <Target className="h-6 w-6 text-purple-600" />
              </div>
              <h3 className="text-lg font-semibold mb-2 text-gray-900">ATS-Friendly</h3>
              <p className="text-gray-600 text-sm">
                Optimized formats that pass through Applicant Tracking Systems with ease
              </p>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="container mx-auto px-4 py-8 mt-20">
        <div className="text-center text-gray-500 text-sm">
          <p>&copy; 2024 ImpactCV. Build your future, one resume at a time.</p>
        </div>
      </footer>
    </div>
  );
}
