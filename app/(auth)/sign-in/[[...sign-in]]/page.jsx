"use client"
import { SignIn } from '@clerk/nextjs';

export default function SignInPage() {
  return (
    <div className="min-h-screen flex flex-col md:flex-row items-stretch justify-center bg-[#f7f6fa]">
      {/* Left Side: Image & Tagline */}
      <div className="md:w-1/2 w-full flex flex-col justify-center items-center bg-[#784890] p-8 md:p-12 relative">
        <img
          src="/signin.jpg"
          alt="Mock Interview Illustration"
          className="w-84 h-64 object-cover rounded-2xl shadow-xl mb-8 mt-8 md:mt-0 animate-fade-in"
        />
        <h2 className="text-white text-3xl font-extrabold mb-2 text-center drop-shadow-lg">AI-powered Mock Interviews</h2>
        <p className="text-lilac-100 text-lg text-center max-w-xs mb-4">Practice, improve, and ace your next interview with confidence.</p>
        {/* Optional: Add subtle animated sparkles or SVGs here for extra polish */}
      </div>
      {/* Right Side: Sign In Card */}
      <div className="md:w-1/2 w-full flex items-center justify-center p-4 md:p-12 bg-transparent">
        <div className="w-full max-w-md rounded-2xl border border-gray-200 bg-white shadow-2xl p-8 md:p-10">
          <div className="flex flex-col items-center mb-8">
            <span className="text-[#784890] text-2xl font-extrabold tracking-tight mb-1">Sign in to CleverCrack</span>
            <span className="text-gray-500 text-sm">Welcome back! Please sign in to your account.</span>
          </div>
          <SignIn
            appearance={{
              elements: {
                card: 'bg-transparent shadow-none',
                headerTitle: 'hidden',
                headerSubtitle: 'hidden',
                formFieldLabel: 'text-gray-700 text-sm',
                formFieldInput:
                  'bg-gray-100 text-gray-900 border border-gray-300 rounded-lg placeholder:text-gray-400 focus:ring-2 focus:ring-[#784890] transition-all duration-200 focus:scale-[1.03] shadow-sm',
                formButtonPrimary:
                  'bg-[#784890] text-white font-semibold hover:bg-[#6a397a] transition-colors rounded-lg shadow-md hover:scale-105 focus:ring-2 focus:ring-[#784890] focus:outline-none',
                socialButtonsBlockButton:
                  'bg-white text-gray-900 font-medium border border-gray-300 rounded-lg hover:bg-gray-100 transition-colors shadow-sm hover:scale-105',
                dividerText: 'text-gray-400 text-xs',
                footerActionText: 'text-gray-500 text-sm',
                footerActionLink: 'text-[#784890] font-medium hover:underline',
                identityPreviewText: 'text-gray-900',
              },
              variables: {
                colorPrimary: '#784890',
                colorText: '#222222',
                colorBackground: '#ffffff',
              },
            }}
          />
        </div>
      </div>
      {/* Animations */}
      <style jsx>{`
        @keyframes fade-in {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in {
          animation: fade-in 1.2s cubic-bezier(0.4,0,0.2,1) both;
        }
      `}</style>
    </div>
  );
}
