import { useState } from 'react';
import logoDark from "../home/heart.png";
import { cn } from "~/lib/utils";

export function meta() {
  return [
    { title: "RoboLike Installation Guide - Get Started in Minutes" },
    { 
      name: "description", 
      content: "Learn how to install and set up RoboLike on your device. Easy step-by-step guide for Windows, MacOS, and Linux." 
    },
  ];
}

export default function InstallGuide() {
  const [selectedPlatform, setSelectedPlatform] = useState<string>('macos');

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      {/* Logo Section */}
      <div className="py-6 px-6 flex">
        <a href="/" className="flex items-center gap-2">
          <div className="w-[40px]">
            <img
              src={logoDark}
              alt="RoboLike Heart Logo"
              className="w-full"
            />
          </div>
          <h1 className="text-2xl font-bold" style={{
            fontFamily: 'Inter, sans-serif',
            WebkitFontSmoothing: 'antialiased',
            MozOsxFontSmoothing: 'grayscale',
            textRendering: 'optimizeLegibility'
          }}>
            Robo<i style={{
              letterSpacing: '0.04em'
            }}>Like</i>
          </h1>
        </a>
      </div>

      {/* Hero Section */}
      <div className="max-w-4xl mx-auto px-6 py-12 text-center flex-1">
        <h1 className="text-4xl md:text-5xl font-bold mb-6 text-gray-900">Get Started with RoboLike in Minutes</h1>
        <p className="text-xl text-gray-600 mb-12 max-w-2xl mx-auto">
          Follow our simple installation guide to set up RoboLike on your device and start automating your social media engagement.
        </p>

        {/* Platform Selector */}
        <div className="flex justify-center mb-12 border-b border-gray-200">
          <button 
            onClick={() => setSelectedPlatform('macos')}
            className={cn(
              "px-5 py-3 font-medium text-lg",
              selectedPlatform === 'macos' 
                ? "border-b-2 border-[#6A1E55] text-[#6A1E55]" 
                : "text-gray-500 hover:text-gray-700"
            )}
          >
            MacOS
          </button>
          <button 
            onClick={() => setSelectedPlatform('windows')}
            className={cn(
              "px-5 py-3 font-medium text-lg",
              selectedPlatform === 'windows' 
                ? "border-b-2 border-[#6A1E55] text-[#6A1E55]" 
                : "text-gray-500 hover:text-gray-700"
            )}
          >
            Windows
          </button>
          <button 
            onClick={() => setSelectedPlatform('linux')}
            className={cn(
              "px-5 py-3 font-medium text-lg",
              selectedPlatform === 'linux' 
                ? "border-b-2 border-[#6A1E55] text-[#6A1E55]" 
                : "text-gray-500 hover:text-gray-700"
            )}
          >
            Linux
          </button>
        </div>

        {/* Installation Steps */}
        <div className="bg-white rounded-xl shadow-md p-8 mb-12">
          {selectedPlatform === 'macos' && (
            <div className="text-left">
              <h2 className="text-2xl font-bold mb-6 text-gray-800">Installing RoboLike on MacOS</h2>
              
              <div className="space-y-6">
                <div className="flex">
                  <div className="flex-shrink-0 mr-4">
                    <div className="w-8 h-8 rounded-full bg-[#6A1E55] text-white flex items-center justify-center font-bold">1</div>
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold mb-2">Download the installer</h3>
                    <p className="text-gray-600">Click the download button below to get the latest version of RoboLike for MacOS (.dmg file).</p>
                  </div>
                </div>

                <div className="flex">
                  <div className="flex-shrink-0 mr-4">
                    <div className="w-8 h-8 rounded-full bg-[#6A1E55] text-white flex items-center justify-center font-bold">2</div>
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold mb-2">Open the DMG file</h3>
                    <p className="text-gray-600">Locate the downloaded file and double-click to open it. This will mount the disk image.</p>
                  </div>
                </div>

                <div className="flex">
                  <div className="flex-shrink-0 mr-4">
                    <div className="w-8 h-8 rounded-full bg-[#6A1E55] text-white flex items-center justify-center font-bold">3</div>
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold mb-2">Drag to Applications</h3>
                    <p className="text-gray-600">Drag the RoboLike icon to the Applications folder shortcut in the window.</p>
                  </div>
                </div>

                <div className="flex">
                  <div className="flex-shrink-0 mr-4">
                    <div className="w-8 h-8 rounded-full bg-[#6A1E55] text-white flex items-center justify-center font-bold">4</div>
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold mb-2">Launch RoboLike</h3>
                    <p className="text-gray-600">Open your Applications folder and double-click RoboLike to start the app.</p>
                  </div>
                </div>

                <div className="flex">
                  <div className="flex-shrink-0 mr-4">
                    <div className="w-8 h-8 rounded-full bg-[#6A1E55] text-white flex items-center justify-center font-bold">5</div>
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold mb-2">Allow permissions</h3>
                    <p className="text-gray-600">If prompted by macOS security, go to System Preferences → Security & Privacy → General and click "Open Anyway" to allow RoboLike to run.</p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {selectedPlatform === 'windows' && (
            <div className="text-left">
              <h2 className="text-2xl font-bold mb-6 text-gray-800">Installing RoboLike on Windows</h2>
              
              <div className="space-y-6">
                <div className="flex">
                  <div className="flex-shrink-0 mr-4">
                    <div className="w-8 h-8 rounded-full bg-[#6A1E55] text-white flex items-center justify-center font-bold">1</div>
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold mb-2">Download the installer</h3>
                    <p className="text-gray-600">Click the download button below to get the latest version of RoboLike for Windows (.exe file).</p>
                  </div>
                </div>

                <div className="flex">
                  <div className="flex-shrink-0 mr-4">
                    <div className="w-8 h-8 rounded-full bg-[#6A1E55] text-white flex items-center justify-center font-bold">2</div>
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold mb-2">Run the installer</h3>
                    <p className="text-gray-600">Locate the downloaded .exe file and double-click to run it.</p>
                  </div>
                </div>

                <div className="flex">
                  <div className="flex-shrink-0 mr-4">
                    <div className="w-8 h-8 rounded-full bg-[#6A1E55] text-white flex items-center justify-center font-bold">3</div>
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold mb-2">Accept security prompts</h3>
                    <p className="text-gray-600">If Windows Defender SmartScreen appears, click "More info" and then "Run anyway" to proceed.</p>
                  </div>
                </div>

                <div className="flex">
                  <div className="flex-shrink-0 mr-4">
                    <div className="w-8 h-8 rounded-full bg-[#6A1E55] text-white flex items-center justify-center font-bold">4</div>
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold mb-2">Follow installation wizard</h3>
                    <p className="text-gray-600">Follow the prompts in the installation wizard, choosing your preferred installation location.</p>
                  </div>
                </div>

                <div className="flex">
                  <div className="flex-shrink-0 mr-4">
                    <div className="w-8 h-8 rounded-full bg-[#6A1E55] text-white flex items-center justify-center font-bold">5</div>
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold mb-2">Launch RoboLike</h3>
                    <p className="text-gray-600">Once installation is complete, launch RoboLike from your desktop shortcut or Start menu.</p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {selectedPlatform === 'linux' && (
            <div className="text-left">
              <h2 className="text-2xl font-bold mb-6 text-gray-800">Installing RoboLike on Linux</h2>
              
              <div className="space-y-6">
                <div className="flex">
                  <div className="flex-shrink-0 mr-4">
                    <div className="w-8 h-8 rounded-full bg-[#6A1E55] text-white flex items-center justify-center font-bold">1</div>
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold mb-2">Download the AppImage</h3>
                    <p className="text-gray-600">Click the download button below to get the latest version of RoboLike for Linux (.AppImage file).</p>
                  </div>
                </div>

                <div className="flex">
                  <div className="flex-shrink-0 mr-4">
                    <div className="w-8 h-8 rounded-full bg-[#6A1E55] text-white flex items-center justify-center font-bold">2</div>
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold mb-2">Make it executable</h3>
                    <p className="text-gray-600">Open a terminal, navigate to the download location, and run: <code className="bg-gray-100 px-2 py-1 rounded">chmod +x RoboLike.AppImage</code></p>
                  </div>
                </div>

                <div className="flex">
                  <div className="flex-shrink-0 mr-4">
                    <div className="w-8 h-8 rounded-full bg-[#6A1E55] text-white flex items-center justify-center font-bold">3</div>
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold mb-2">Run the AppImage</h3>
                    <p className="text-gray-600">Double-click the AppImage file or run it from the terminal: <code className="bg-gray-100 px-2 py-1 rounded">./RoboLike.AppImage</code></p>
                  </div>
                </div>

                <div className="flex">
                  <div className="flex-shrink-0 mr-4">
                    <div className="w-8 h-8 rounded-full bg-[#6A1E55] text-white flex items-center justify-center font-bold">4</div>
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold mb-2">Optional: Create desktop shortcut</h3>
                    <p className="text-gray-600">To create a desktop shortcut, you can integrate the AppImage with your desktop environment using tools like AppImageLauncher.</p>
                  </div>
                </div>

                <div className="flex">
                  <div className="flex-shrink-0 mr-4">
                    <div className="w-8 h-8 rounded-full bg-[#6A1E55] text-white flex items-center justify-center font-bold">5</div>
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold mb-2">Install dependencies (if needed)</h3>
                    <p className="text-gray-600">If you encounter any errors, you may need to install dependencies. Check our documentation for specific requirements.</p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Download CTA Button */}
        <a 
          href="/downloads" 
          className="inline-block px-8 py-4 bg-[#6A1E55] text-white rounded-full text-xl font-bold hover:bg-opacity-90 transition-colors shadow-lg"
        >
          CLICK TO DOWNLOAD
        </a>

        <p className="mt-6 text-gray-500 text-sm">
          By downloading, you agree to our <a href="/terms-and-conditions" className="text-[#6A1E55] hover:underline">Terms and Conditions</a>
        </p>
      </div>

      {/* Footer */}
      <div className="py-6 border-t border-gray-200 text-center text-gray-500 text-sm">
        <p>© {new Date().getFullYear()} RoboLike. All rights reserved.</p>
      </div>
    </div>
  );
}