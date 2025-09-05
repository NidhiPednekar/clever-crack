'use client';
import React, { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Download, Scan, X } from 'lucide-react';

// Simple QR code component that renders an SVG
const SimpleQRCode = ({ value, size = 180 }) => {
  const [mounted, setMounted] = useState(false);
  
  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return <div style={{ width: size, height: size }} className="bg-gray-100 animate-pulse rounded" />;
  }

  // Simple QR code implementation using canvas
  return (
    <div className="relative">
      <canvas
        id="qrcode"
        width={size}
        height={size}
        className="w-full h-auto"
        ref={async (node) => {
          if (node && value) {
            try {
              const QRCodeLib = (await import('qrcode')).default;
              await QRCodeLib.toCanvas(node, value, {
                width: size,
                margin: 2,
                errorCorrectionLevel: 'H'
              });
            } catch (err) {
              console.error('Error generating QR code:', err);
            }
          }
        }}
      />
    </div>
  );
};

const FeedbackSummary = ({ feedbackData, onDownloadPdf }) => {
  const [showScanner, setShowScanner] = useState(false);
  const videoRef = useRef(null);
  const [scannedData, setScannedData] = useState(null);
  const [cameraError, setCameraError] = useState('');
  let scanner = null;

  // Clean up scanner on unmount
  useEffect(() => {
    return () => {
      if (scanner) {
        scanner.clear();
      }
    };
  }, []);

  const startScanner = async () => {
    try {
      setShowScanner(true);
      setScannedData(null);
      setCameraError('');
      
      // Dynamically import the QR scanner only when needed
      const QrScanner = (await import('qr-scanner')).default;
      
      if (videoRef.current) {
        scanner = new QrScanner(
          videoRef.current,
          result => {
            setScannedData(result.data);
            scanner.stop();
            setShowScanner(false);
            
            // If the QR contains a data URL, handle it
            if (result.data.startsWith('data:application/json')) {
              try {
                const jsonStr = decodeURIComponent(result.data.split(',')[1]);
                const feedback = JSON.parse(jsonStr);
                // You can do something with the scanned feedback here
                console.log('Scanned feedback:', feedback);
              } catch (e) {
                console.error('Error parsing scanned data:', e);
              }
            }
          },
          {
            highlightScanRegion: true,
            highlightCodeOutline: true,
          }
        );
        
        await scanner.start();
      }
    } catch (err) {
      console.error('Error initializing QR scanner:', err);
      setCameraError('Could not access camera. Please check permissions.');
    }
  };

  // Calculate average rating
  const averageRating = feedbackData.averageRating || 
    (feedbackData.responses.reduce((sum, item) => sum + (item.rating || 0), 0) / feedbackData.responses.length) || 0;

  // Create a minimal data object for the QR code
  const qrData = {
    id: Date.now(),
    summary: `Interview Feedback - ${new Date().toLocaleDateString()}`,
    score: feedbackData.averageRating?.toFixed(1) || 'N/A',
    questions: feedbackData.responses.length,
    version: '1.0.0'
  };
  
  const qrDataString = JSON.stringify(qrData);
  const feedbackDataUrl = `data:application/json;charset=utf-8,${encodeURIComponent(qrDataString)}`;

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-8">
        
        {/* Header */}
        <div className="text-center">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Interview Feedback Summary</h1>
          <p className="text-lg text-gray-600">Detailed performance analysis and recommendations</p>
        </div>

        {/* Performance Overview Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
            <div className="flex items-center">
              <div className="p-3 rounded-lg bg-blue-50">
                <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Questions Answered</p>
                <p className="text-2xl font-bold text-gray-900">{feedbackData.responses.length}/{feedbackData.totalQuestions}</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
            <div className="flex items-center">
              <div className="p-3 rounded-lg bg-green-50">
                <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
                </svg>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Average Rating</p>
                <div className="flex items-center">
                  <span className="text-2xl font-bold text-gray-900 mr-2">
                    {averageRating.toFixed(1)}/5.0
                  </span>
                  <div className="flex">
                    {[...Array(5)].map((_, i) => (
                      <svg 
                        key={i}
                        className={`w-5 h-5 ${i < Math.round(averageRating) ? 'text-yellow-400' : 'text-gray-300'}`} 
                        fill="currentColor" 
                        viewBox="0 0 20 20"
                      >
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
            <div className="flex items-center">
              <div className="p-3 rounded-lg bg-purple-50">
                <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Overall Performance</p>
                <p className="text-xl font-bold text-gray-900">
                  {averageRating >= 4 ? 'Excellent' : averageRating >= 3 ? 'Good' : 'Needs Improvement'}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Question-wise Feedback */}
          <div className="lg:col-span-2 space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold text-gray-900">Detailed Feedback</h2>
              <span className="text-sm text-gray-500">{feedbackData.responses.length} questions reviewed</span>
            </div>
            
            <div className="space-y-6">
              {feedbackData.responses.map((response, index) => (
                <div key={index} className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
                  <div className="flex justify-between items-start mb-4">
                    <div className="flex-1">
                      <div className="flex items-center mb-2">
                        <span className="inline-flex items-center justify-center w-6 h-6 bg-blue-100 text-blue-800 text-sm font-medium rounded-full mr-3">
                          {index + 1}
                        </span>
                        <h3 className="text-lg font-semibold text-gray-900">Question {index + 1}</h3>
                      </div>
                      <p className="text-gray-700 leading-relaxed">{response.question}</p>
                    </div>
                    <div className="flex items-center bg-blue-50 px-3 py-1 rounded-full ml-4">
                      <svg className="w-4 h-4 text-yellow-400 mr-1" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                      <span className="text-sm font-medium text-blue-700">
                        {response.rating.toFixed(1)}/5.0
                      </span>
                    </div>
                  </div>
                  
                  <div className="space-y-4">
                    <div className="bg-gray-50 rounded-lg p-4">
                      <p className="text-sm font-medium text-gray-700 mb-2">Your Answer:</p>
                      <p className="text-gray-800 leading-relaxed">
                        {response.answer || 'No answer provided.'}
                      </p>
                    </div>
                    
                    <div className="bg-blue-50 rounded-lg p-4">
                      <p className="text-sm font-medium text-blue-800 mb-2">Feedback:</p>
                      <p className="text-blue-900 leading-relaxed whitespace-pre-wrap">
                        {response.feedback}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Sidebar with QR Code and Actions */}
          <div className="space-y-6">
            
            {/* QR Code Section */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 sticky top-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Save Your Feedback</h3>
              <p className="text-sm text-gray-600 mb-6">
                Scan this QR code to save a summary of your feedback to your phone
              </p>
              
              <div className="flex justify-center p-6 border-2 border-dashed border-gray-200 rounded-lg bg-gray-50 mb-6">
                <SimpleQRCode 
                  value={feedbackDataUrl}
                  size={180}
                />
              </div>
              
              <p className="text-xs text-gray-500 text-center mb-6">
                Scan with your phone's camera or QR code app
              </p>
              
              <Button 
                onClick={onDownloadPdf}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-lg font-medium transition-colors"
              >
                <Download className="w-4 h-4 mr-2" />
                Download Full Report (PDF)
              </Button>
            </div>

           
          </div>
        </div>

        {/* Overall Feedback Section */}
        {feedbackData.overallFeedback && (
          <div className="bg-gradient-to-r from-yellow-50 to-orange-50 border border-yellow-200 rounded-xl p-6">
            <div className="flex items-start">
              <div className="flex-shrink-0">
                <svg className="w-6 h-6 text-yellow-600 mt-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.998-.833-2.768 0L3.046 16.5c-.77.833.192 2.5 1.732 2.5z" />
                </svg>
              </div>
              <div className="ml-4">
                <h4 className="text-lg font-semibold text-yellow-800 mb-2">Overall Feedback</h4>
                <p className="text-yellow-700 leading-relaxed">{feedbackData.overallFeedback}</p>
              </div>
            </div>
          </div>
        )}

    

      </div>
    </div>
  );
};

export default FeedbackSummary;