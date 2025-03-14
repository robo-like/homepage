import { useState, useEffect } from 'react';
import logoDark from "../home/heart.png";
import { cn } from "~/lib/utils";

export function meta() {
  return [
    { title: "RoboLike Installation Guide - Power Up Your Social Media" },
    { 
      name: "description", 
      content: "Download and install RoboLike to supercharge your social media presence. Easy setup for Windows, MacOS, and Linux." 
    },
  ];
}

export default function InstallGuide() {
  const [selectedPlatform, setSelectedPlatform] = useState<string>('macos');
  const [detectedOS, setDetectedOS] = useState<string | null>(null);

  // Detect user's operating system on mount
  useEffect(() => {
    const detectOS = () => {
      const platform = window.navigator.platform.toLowerCase();
      const userAgent = window.navigator.userAgent.toLowerCase();

      if (platform.includes('mac') || userAgent.includes('mac')) {
        return 'macos';
      } else if (platform.includes('win') || userAgent.includes('win')) {
        return 'windows';
      } else if (platform.includes('linux') || userAgent.includes('linux')) {
        return 'linux';
      }
      return null;
    };

    const os = detectOS();
    if (os) {
      setDetectedOS(os);
      setSelectedPlatform(os);
    }
  }, []);

  return (
    <div className="font-set-1 min-h-screen flex flex-col bg-[#0A0A0A] text-white">
      {/* Grid Lines Background */}
      <div className="fixed inset-0 grid-lines opacity-70 pointer-events-none"></div>

      {/* Logo Section */}
      <div className="py-6 px-6 flex z-10">
        <a href="/" className="flex items-center gap-3">
          <div className="w-[45px]">
            <img
              src={logoDark}
              alt="RoboLike Heart Logo"
              className="w-full animate-pulse"
            />
          </div>
          <h1 className="text-2xl" style={{
            fontFamily: 'var(--heading-font, "Press Start 2P", cursive)',
          }}>
            ROBO<span className="text-[#07b0ef]">LIKE</span>
          </h1>
        </a>
      </div>

      {/* Hero Section */}
      <div className="max-w-4xl mx-auto px-6 py-6 text-center flex-1 z-10">
        <h1 className="text-3xl md:text-4xl mb-6 gradient-text" style={{
          fontFamily: 'var(--heading-font, "Press Start 2P", cursive)',
          lineHeight: '1.4',
        }}>POWER UP YOUR SOCIAL MEDIA</h1>
        
        <div className="w-full h-1 my-4 bg-gradient-to-r from-[#ed1e79] via-[#07b0ef] to-[#f7ee2a]"></div>
        
        <p className="text-xl mb-12 max-w-2xl mx-auto" style={{
          fontFamily: 'var(--body-font, "Chakra Petch", sans-serif)',
        }}>
          Follow our arcade-simple installation guide to install RoboLike and start your journey to social media domination.
        </p>

        {/* Platform Selector */}
        <div className="relative mb-12">
          {detectedOS && (
            <div className="absolute top-0 left-0 right-0 -mt-8 text-center" style={{
              fontFamily: 'var(--subheading-font, "Orbitron", sans-serif)',
            }}>
              <span className="inline-block px-4 py-1 text-xs bg-[#07b0ef] text-black rounded-t-md">
                🎮 WE DETECTED YOUR OS: {detectedOS.toUpperCase()} 🎮
              </span>
            </div>
          )}
          
          <div className="flex justify-center border-b border-[#07b0ef]">
            <button 
              onClick={() => setSelectedPlatform('macos')}
              className={cn(
                "px-5 py-3 font-medium text-lg uppercase platform-tab",
                selectedPlatform === 'macos' ? "active" : ""
              )}
            >
              MacOS
            </button>
            <button 
              onClick={() => setSelectedPlatform('windows')}
              className={cn(
                "px-5 py-3 font-medium text-lg uppercase platform-tab",
                selectedPlatform === 'windows' ? "active" : ""
              )}
            >
              Windows
            </button>
            <button 
              onClick={() => setSelectedPlatform('linux')}
              className={cn(
                "px-5 py-3 font-medium text-lg uppercase platform-tab",
                selectedPlatform === 'linux' ? "active" : ""
              )}
            >
              Linux
            </button>
          </div>
        </div>

        {/* Installation Steps */}
        <div className="bg-[#1c1c1c] rounded-xl p-8 mb-12 border-2 border-[#07b0ef]">
          {selectedPlatform === 'macos' && (
            <div className="text-left">
              <h2 className="text-2xl mb-6 text-[#f7ee2a] text-center neon-glow" style={{
                fontFamily: 'var(--heading-font, "Press Start 2P", cursive)',
              }}>INSTALLING ON MACOS</h2>
              
              <div className="space-y-8">
                <div className="flex">
                  <div className="flex-shrink-0 mr-4">
                    <div className="instruction-circle bg-[#ed1e79]">1</div>
                  </div>
                  <div>
                    <h3 className="text-xl mb-2 text-[#ed1e79]" style={{
                      fontFamily: 'var(--subheading-font, "Orbitron", sans-serif)',
                    }}>DOWNLOAD THE INSTALLER</h3>
                    <p className="text-gray-300" style={{
                      fontFamily: 'var(--body-font, "Chakra Petch", sans-serif)',
                    }}>Click the download button at the bottom to get the latest version of RoboLike for MacOS (.dmg file).</p>
                  </div>
                </div>

                <div className="flex">
                  <div className="flex-shrink-0 mr-4">
                    <div className="instruction-circle bg-[#07b0ef]">2</div>
                  </div>
                  <div>
                    <h3 className="text-xl mb-2 text-[#07b0ef]" style={{
                      fontFamily: 'var(--subheading-font, "Orbitron", sans-serif)',
                    }}>OPEN THE DMG FILE</h3>
                    <p className="text-gray-300" style={{
                      fontFamily: 'var(--body-font, "Chakra Petch", sans-serif)',
                    }}>Locate the downloaded file and double-click to mount the disk image.</p>
                  </div>
                </div>

                <div className="flex">
                  <div className="flex-shrink-0 mr-4">
                    <div className="instruction-circle bg-[#f7ee2a] text-black">3</div>
                  </div>
                  <div>
                    <h3 className="text-xl mb-2 text-[#f7ee2a]" style={{
                      fontFamily: 'var(--subheading-font, "Orbitron", sans-serif)',
                    }}>DRAG TO APPLICATIONS</h3>
                    <p className="text-gray-300" style={{
                      fontFamily: 'var(--body-font, "Chakra Petch", sans-serif)',
                    }}>Drag the RoboLike icon to the Applications folder shortcut in the window.</p>
                  </div>
                </div>

                <div className="flex">
                  <div className="flex-shrink-0 mr-4">
                    <div className="instruction-circle bg-[#9633ac]">4</div>
                  </div>
                  <div>
                    <h3 className="text-xl mb-2 text-[#9633ac]" style={{
                      fontFamily: 'var(--subheading-font, "Orbitron", sans-serif)',
                    }}>LAUNCH ROBOLIKE</h3>
                    <p className="text-gray-300" style={{
                      fontFamily: 'var(--body-font, "Chakra Petch", sans-serif)',
                    }}>Open your Applications folder and double-click RoboLike to start the app.</p>
                  </div>
                </div>

                <div className="flex">
                  <div className="flex-shrink-0 mr-4">
                    <div className="instruction-circle bg-[#FA8E10]">5</div>
                  </div>
                  <div>
                    <h3 className="text-xl mb-2 text-[#FA8E10]" style={{
                      fontFamily: 'var(--subheading-font, "Orbitron", sans-serif)',
                    }}>ALLOW PERMISSIONS</h3>
                    <p className="text-gray-300" style={{
                      fontFamily: 'var(--body-font, "Chakra Petch", sans-serif)',
                    }}>If prompted by macOS security, go to System Preferences → Security & Privacy → General and click "Open Anyway".</p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {selectedPlatform === 'windows' && (
            <div className="text-left">
              <h2 className="text-2xl mb-6 text-[#f7ee2a] text-center neon-glow" style={{
                fontFamily: 'var(--heading-font, "Press Start 2P", cursive)',
              }}>INSTALLING ON WINDOWS</h2>
              
              <div className="space-y-8">
                <div className="flex">
                  <div className="flex-shrink-0 mr-4">
                    <div className="instruction-circle bg-[#ed1e79]">1</div>
                  </div>
                  <div>
                    <h3 className="text-xl mb-2 text-[#ed1e79]" style={{
                      fontFamily: 'var(--subheading-font, "Orbitron", sans-serif)',
                    }}>DOWNLOAD THE INSTALLER</h3>
                    <p className="text-gray-300" style={{
                      fontFamily: 'var(--body-font, "Chakra Petch", sans-serif)',
                    }}>Click the download button at the bottom to get the latest version of RoboLike for Windows (.exe file).</p>
                  </div>
                </div>

                <div className="flex">
                  <div className="flex-shrink-0 mr-4">
                    <div className="instruction-circle bg-[#07b0ef]">2</div>
                  </div>
                  <div>
                    <h3 className="text-xl mb-2 text-[#07b0ef]" style={{
                      fontFamily: 'var(--subheading-font, "Orbitron", sans-serif)',
                    }}>RUN THE INSTALLER</h3>
                    <p className="text-gray-300" style={{
                      fontFamily: 'var(--body-font, "Chakra Petch", sans-serif)',
                    }}>Locate the downloaded .exe file and double-click to run it.</p>
                  </div>
                </div>

                <div className="flex">
                  <div className="flex-shrink-0 mr-4">
                    <div className="instruction-circle bg-[#f7ee2a] text-black">3</div>
                  </div>
                  <div>
                    <h3 className="text-xl mb-2 text-[#f7ee2a]" style={{
                      fontFamily: 'var(--subheading-font, "Orbitron", sans-serif)',
                    }}>ACCEPT SECURITY PROMPTS</h3>
                    <p className="text-gray-300" style={{
                      fontFamily: 'var(--body-font, "Chakra Petch", sans-serif)',
                    }}>If Windows SmartScreen appears, click "More info" and then "Run anyway" to proceed.</p>
                  </div>
                </div>

                <div className="flex">
                  <div className="flex-shrink-0 mr-4">
                    <div className="instruction-circle bg-[#9633ac]">4</div>
                  </div>
                  <div>
                    <h3 className="text-xl mb-2 text-[#9633ac]" style={{
                      fontFamily: 'var(--subheading-font, "Orbitron", sans-serif)',
                    }}>FOLLOW INSTALLATION WIZARD</h3>
                    <p className="text-gray-300" style={{
                      fontFamily: 'var(--body-font, "Chakra Petch", sans-serif)',
                    }}>Follow the prompts in the installation wizard, choosing your preferred installation location.</p>
                  </div>
                </div>

                <div className="flex">
                  <div className="flex-shrink-0 mr-4">
                    <div className="instruction-circle bg-[#FA8E10]">5</div>
                  </div>
                  <div>
                    <h3 className="text-xl mb-2 text-[#FA8E10]" style={{
                      fontFamily: 'var(--subheading-font, "Orbitron", sans-serif)',
                    }}>LAUNCH ROBOLIKE</h3>
                    <p className="text-gray-300" style={{
                      fontFamily: 'var(--body-font, "Chakra Petch", sans-serif)',
                    }}>Once installation is complete, launch RoboLike from your desktop shortcut or Start menu.</p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {selectedPlatform === 'linux' && (
            <div className="text-left">
              <h2 className="text-2xl mb-6 text-[#f7ee2a] text-center neon-glow" style={{
                fontFamily: 'var(--heading-font, "Press Start 2P", cursive)',
              }}>INSTALLING ON LINUX</h2>
              
              <div className="space-y-8">
                <div className="flex">
                  <div className="flex-shrink-0 mr-4">
                    <div className="instruction-circle bg-[#ed1e79]">1</div>
                  </div>
                  <div>
                    <h3 className="text-xl mb-2 text-[#ed1e79]" style={{
                      fontFamily: 'var(--subheading-font, "Orbitron", sans-serif)',
                    }}>DOWNLOAD THE APPIMAGE</h3>
                    <p className="text-gray-300" style={{
                      fontFamily: 'var(--body-font, "Chakra Petch", sans-serif)',
                    }}>Click the download button at the bottom to get the latest version of RoboLike for Linux (.AppImage file).</p>
                  </div>
                </div>

                <div className="flex">
                  <div className="flex-shrink-0 mr-4">
                    <div className="instruction-circle bg-[#07b0ef]">2</div>
                  </div>
                  <div>
                    <h3 className="text-xl mb-2 text-[#07b0ef]" style={{
                      fontFamily: 'var(--subheading-font, "Orbitron", sans-serif)',
                    }}>MAKE IT EXECUTABLE</h3>
                    <p className="text-gray-300" style={{
                      fontFamily: 'var(--body-font, "Chakra Petch", sans-serif)',
                    }}>Open a terminal, navigate to the download location, and run: <code className="bg-[#0A0A0A] px-2 py-1 rounded border border-[#07b0ef]">chmod +x RoboLike.AppImage</code></p>
                  </div>
                </div>

                <div className="flex">
                  <div className="flex-shrink-0 mr-4">
                    <div className="instruction-circle bg-[#f7ee2a] text-black">3</div>
                  </div>
                  <div>
                    <h3 className="text-xl mb-2 text-[#f7ee2a]" style={{
                      fontFamily: 'var(--subheading-font, "Orbitron", sans-serif)',
                    }}>RUN THE APPIMAGE</h3>
                    <p className="text-gray-300" style={{
                      fontFamily: 'var(--body-font, "Chakra Petch", sans-serif)',
                    }}>Double-click the AppImage file or run it from the terminal: <code className="bg-[#0A0A0A] px-2 py-1 rounded border border-[#f7ee2a]">./RoboLike.AppImage</code></p>
                  </div>
                </div>

                <div className="flex">
                  <div className="flex-shrink-0 mr-4">
                    <div className="instruction-circle bg-[#9633ac]">4</div>
                  </div>
                  <div>
                    <h3 className="text-xl mb-2 text-[#9633ac]" style={{
                      fontFamily: 'var(--subheading-font, "Orbitron", sans-serif)',
                    }}>CREATE DESKTOP SHORTCUT</h3>
                    <p className="text-gray-300" style={{
                      fontFamily: 'var(--body-font, "Chakra Petch", sans-serif)',
                    }}>To create a desktop shortcut, you can integrate the AppImage with your desktop environment using tools like AppImageLauncher.</p>
                  </div>
                </div>

                <div className="flex">
                  <div className="flex-shrink-0 mr-4">
                    <div className="instruction-circle bg-[#FA8E10]">5</div>
                  </div>
                  <div>
                    <h3 className="text-xl mb-2 text-[#FA8E10]" style={{
                      fontFamily: 'var(--subheading-font, "Orbitron", sans-serif)',
                    }}>INSTALL DEPENDENCIES</h3>
                    <p className="text-gray-300" style={{
                      fontFamily: 'var(--body-font, "Chakra Petch", sans-serif)',
                    }}>If you encounter any errors, you may need to install dependencies. Check our documentation for specific requirements.</p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Download CTA Button with Animation */}
        <div className="relative mb-4">
          <div className="absolute inset-0 bg-[#FA8E10] blur-lg opacity-30 animate-pulse"></div>
          <a 
            href="/downloads" 
            className="relative inline-block py-4 px-8 retro-button primary"
          >
            CLICK TO DOWNLOAD
          </a>
        </div>

        <div className="mt-12 relative">
          <div className="w-full h-1 bg-gradient-to-r from-[#f7ee2a] via-[#ed1e79] to-[#07b0ef]"></div>
          <p className="mt-6 text-gray-400 text-sm" style={{
            fontFamily: 'var(--body-font, "Chakra Petch", sans-serif)',
          }}>
            By downloading, you agree to our <a href="/terms-and-conditions" className="text-[#07b0ef] hover:underline">Terms and Conditions</a>
          </p>
        </div>
      </div>

      {/* Footer */}
      <div className="py-6 border-t border-[#1c1c1c] text-center text-gray-500 text-sm z-10" style={{
        fontFamily: 'var(--body-font, "Chakra Petch", sans-serif)',
      }}>
        <p>© {new Date().getFullYear()} RoboLike. All rights reserved.</p>
      </div>
    </div>
  );
}