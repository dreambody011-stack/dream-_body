import React from 'react';
import { getPackages } from '../services/storage';
import { CheckCircle2, ArrowRight } from 'lucide-react';
import { ViewState } from '../types';

interface PublicHomeProps {
  setView: (view: ViewState) => void;
}

const PublicHome: React.FC<PublicHomeProps> = ({ setView }) => {
  const packages = getPackages();

  return (
    <div>
      {/* Hero Section */}
      <section className="relative py-20 lg:py-32 overflow-hidden">
        {/* Background blobs */}
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl -z-10"></div>
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-blue-600/10 rounded-full blur-3xl -z-10"></div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight text-white mb-6">
            BUILD YOUR <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-500">DREAM BODY</span>
          </h1>
          <p className="mt-4 text-xl text-slate-400 max-w-2xl mx-auto">
            Elite coaching tailored to your biology. Personalized nutrition, workout plans, and AI-driven analysis to shatter your limits.
          </p>
          
          <div className="mt-10 flex justify-center gap-4">
            <button 
              onClick={() => setView('LOGIN')}
              className="bg-cyan-600 hover:bg-cyan-500 text-white px-8 py-4 rounded-full font-bold text-lg transition-all shadow-lg shadow-cyan-500/30 flex items-center"
            >
              Start Transformation <ArrowRight className="ml-2 h-5 w-5" />
            </button>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section className="py-20 bg-slate-900/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-white">Invest In Yourself</h2>
            <p className="mt-4 text-slate-400">Choose the plan that fits your ambition.</p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 justify-center">
            {packages.map((pkg) => (
              <div key={pkg.id} className="bg-slate-900 border border-slate-800 rounded-2xl p-8 hover:border-cyan-500/50 transition-colors shadow-xl">
                <h3 className="text-xl font-bold text-white mb-2">{pkg.name}</h3>
                <div className="text-4xl font-extrabold text-cyan-400 mb-6">{pkg.price}</div>
                <ul className="space-y-4 mb-8">
                  {pkg.features.map((feat, idx) => (
                    <li key={idx} className="flex items-start">
                      <CheckCircle2 className="h-6 w-6 text-cyan-500 mr-3 flex-shrink-0" />
                      <span className="text-slate-300">{feat}</span>
                    </li>
                  ))}
                </ul>
                <button 
                  onClick={() => setView('LOGIN')}
                  className="w-full block text-center border border-slate-600 hover:border-cyan-500 text-slate-300 hover:text-white py-3 rounded-xl transition-all font-semibold"
                >
                  Get Started
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default PublicHome;
