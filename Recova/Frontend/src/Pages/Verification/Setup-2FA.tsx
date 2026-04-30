import { useState, useEffect } from 'react';
import { supabase } from '../../services/supabase';
import QRCode from 'qrcode';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const lock2 = new URL('../../assets/lock2.png', import.meta.url).href;

type TotpSetupResult =
  | { status: 'verified'; factorId: string }
  | { status: 'needsVerification'; factorId: string }
  | { status: 'enrolled'; factorId: string; secret: string; qrCode: string };

let totpSetupPromise: Promise<TotpSetupResult> | null = null;

async function initializeTotpSetup(): Promise<TotpSetupResult> {
  if (totpSetupPromise) {
    return totpSetupPromise;
  }

  const setupPromise: Promise<TotpSetupResult> = (async (): Promise<TotpSetupResult> => {
    // 0. Check if user is logged in
    const { data: { session }, error: sessionError } = await supabase.auth.getSession();

    if (sessionError || !session) {
      throw new Error('You must be logged in to enable 2FA. Please log in first.');
    }

    // Check if force-reset flag is set (from reset button)
    const urlParams = new URLSearchParams(window.location.search);
    const forceReset = urlParams.get('reset') === 'true';

    // 1. Check if user already has 2FA enabled
    const { data: existingFactors } = await supabase.auth.mfa.listFactors();

    // Check for verified factors first
    if (existingFactors?.totp?.length) {
      const verifiedFactor = existingFactors.totp.find((factor) => factor.status === 'verified');

      if (verifiedFactor) {
        // User has a verified factor - check their session level
        const { data: aal } = await supabase.auth.mfa.getAuthenticatorAssuranceLevel();

        if (aal?.currentLevel === 'aal2') {
          return { status: 'verified', factorId: verifiedFactor.id };
        }

        return { status: 'needsVerification', factorId: verifiedFactor.id };
      }

      // Only try to clean up unverified factors
      for (const factor of existingFactors.totp) {
        if (factor.status !== 'verified') {
          try {
            await supabase.auth.mfa.unenroll({ factorId: factor.id });
          } catch (error) {
            console.warn('Could not unenroll factor:', factor.id, error);
          }
        }
      }

      // Wait for unenroll to complete
      await new Promise((resolve) => setTimeout(resolve, 500));
    }

    // Clear the reset parameter from URL
    if (forceReset) {
      window.history.replaceState({}, '', '/setup-2fa');
    }

    // 2. Enroll a new TOTP factor with a unique name
    const timestamp = Date.now();
    const { data, error } = await supabase.auth.mfa.enroll({
      factorType: 'totp',
      friendlyName: `Recova App ${timestamp}`,
    });

    if (error) {
      throw new Error(`Failed to enroll: ${error.message}. Make sure MFA is enabled in your Supabase dashboard.`);
    }

    if (!data) {
      throw new Error('Failed to enroll 2FA. Please try again.');
    }

    const totpSecret = data.totp.secret;

    // 4. Generate QR code - build our own simple URI to reduce size
    const { data: { user } } = await supabase.auth.getUser();
    const userEmail = user?.email || 'user@recova.com';
    const simpleUri = `otpauth://totp/Recova:${encodeURIComponent(userEmail)}?secret=${totpSecret}&issuer=Recova`;

    let qrCodeDataUrl = '';
    try {
      qrCodeDataUrl = await QRCode.toDataURL(simpleUri, {
        errorCorrectionLevel: 'M',
        width: 300,
        margin: 1,
        color: {
          dark: '#000000',
          light: '#FFFFFF'
        }
      });
    } catch (qrError) {
      console.error('QR Code generation error:', qrError);
      if (typeof data.totp.qr_code === 'string' && data.totp.qr_code.startsWith('data:')) {
        qrCodeDataUrl = data.totp.qr_code;
      }
    }

    return {
      status: 'enrolled',
      factorId: data.id,
      secret: totpSecret,
      qrCode: qrCodeDataUrl,
    };
  })().finally(() => {
    totpSetupPromise = null;
  });

  totpSetupPromise = setupPromise;
  return setupPromise;
}




export default function Setup2FA() {
  const API_URL = 'http://localhost:3000/api/user';

  const [qrCode, setQrCode] = useState("");
  const [secret, setSecret] = useState("");
  const [factorId, setFactorId] = useState("");
  const [verificationCode, setVerificationCode] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [isEnrolled, setIsEnrolled] = useState(false);
  const [verificationType, setVerificationType] = useState("authenticator");
  const [needsVerification, setNeedsVerification] = useState(false); // New: for showing verification form
  const [resetting, setResetting] = useState(false);
  const[loading, setLoading] = useState(false);
  const [showInfoModal, setShowInfoModal] = useState(false);
  const [countdown, setCountdown] = useState(0); // Countdown timer for rate limiting

  const navigate = useNavigate();


  useEffect(() => {
    let isActive = true;

    async function enrollMFA() {
      try {
        const result = await initializeTotpSetup();

        if (!isActive) {
          return;
        }

        if (result.status === 'verified') {
          navigate('/profile', { replace: true });
          return;
        }

        if (result.status === 'needsVerification') {
          console.log('User has verified factor but not AAL2, showing verification form');
          setFactorId(result.factorId);
          setNeedsVerification(true);
          return;
        }

        setFactorId(result.factorId);
        setSecret(result.secret);

        if (result.qrCode) {
          setQrCode(result.qrCode);
          console.log('QR code generated successfully');
        } else {
          setError('QR code generation failed. Please use manual entry below.');
        }
      } catch (err: any) {
        if (!isActive) {
          return;
        }

        console.error('MFA Setup Error:', err);
        setError(err.message || 'Failed to setup 2FA. Please make sure you\'re logged in.');
      }
    }

    enrollMFA();

    return () => {
      isActive = false;
    };
  }, []);

  // Countdown timer effect
  useEffect(() => {
    if (countdown > 0) {
      const timer = setInterval(() => {
        setCountdown((prev) => {
          if (prev <= 1) {
            setError(""); // Clear error when countdown ends
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
      return () => clearInterval(timer);
    }
  }, [countdown]);

  const onVerifySetup = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess("");

    // Check if already aal2 before verifying
    const { data: aal } = await supabase.auth.mfa.getAuthenticatorAssuranceLevel();
    if (aal?.currentLevel === 'aal2') {
      // Already verified, just go to profile
      window.location.href = "/profile";
      setLoading(false);
      return;
    }

    if (!verificationCode || verificationCode.length !== 6) {
      setError("Please enter a valid 6-digit code");
      setLoading(false);
      return;
    }

    try {
      const { data: { session } } = await supabase.auth.getSession();
      const identifier = { 
        email: session?.user?.email, 
        userId: session?.user?.id 
      };

      // 1. Check if user is rate-limited (only checks, doesn't increment)
      let checkRes;
      try {
        checkRes = await axios.post(`${API_URL}/2fa/check-attempt`, identifier);
      } catch (axiosError: any) {
        // Handle 429 status (Too Many Requests)
        if (axiosError.response?.status === 429) {
          const retryAfter = axiosError.response.data?.retryAfter || 60;
          setCountdown(retryAfter);
          setError(`Too many incorrect attempts. Wait ${retryAfter} seconds before trying again.`);
          setVerificationCode("");
          setLoading(false);
          return;
        }
        throw axiosError;
      }

      if (!checkRes.data.allowed) {
        const retryAfter = checkRes.data.retryAfter || 60;
        setCountdown(retryAfter);
        setError(checkRes.data.message);
        setVerificationCode("");
        setLoading(false);
        return;
      }

      // console.log("Creating challenge for factor:", factorId);
      // console.log("Code to verify:", verificationCode);
      
      // 2. Create a challenge for verification
      const { data: challenge, error: challengeError } = await supabase.auth.mfa.challenge({
        factorId
      });

      if (challengeError) {
        // console.error("Challenge error:", challengeError);
        setError(challengeError.message);
        setLoading(false);
        return;
      }

      // console.log("Challenge created:", challenge.id);

      // 3. Verify the code to complete enrollment
      const { data: verifyData, error: verifyError } = await supabase.auth.mfa.verify({
        factorId,
        challengeId: challenge.id,
        code: verificationCode.trim()
      });

      if (verifyError) {
        // Record the failed attempt
        await axios.post(`${API_URL}/2fa/record-failure`, identifier);
        const remaining = Math.max(0, 5 - checkRes.data.attemptsRemaining - 1);
        setError(`Invalid code.`);
        setVerificationCode("");
        console.error("Verification failed:", verifyError);
      } else {
        // Success - clear attempts and redirect
        await axios.post(`${API_URL}/2fa/clear-attempts`, identifier);
        // console.log("Verification successful:", verifyData);
        setSuccess("Verified! Redirecting to profile...");
        setIsEnrolled(true);
        
        // Redirect immediately
        setTimeout(() => {
          window.location.href = "/profile";
        }, 1000);
      }
    } catch (err: any) {
      console.error("Unexpected error:", err);
      setError(err.response?.data?.message || err.message || "Verification failed");
    } finally {
      setLoading(false);
    }
  };

  // Regenerate QR/secret by unenrolling existing unverified TOTP and enrolling a fresh one
  const regenerateTotp = async () => {
    setError("");
    setSuccess("");
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        setError("You must be logged in to regenerate 2FA.");
        return;
      }

      const { data: existingFactors } = await supabase.auth.mfa.listFactors();
      if (existingFactors?.totp?.length) {
        for (const f of existingFactors.totp) {
          try {
            await supabase.auth.mfa.unenroll({ factorId: f.id });
          } catch {}
        }
        // small delay to allow backend to settle
        await new Promise(r => setTimeout(r, 500));
      }

      const timestamp = Date.now();
      const { data, error } = await supabase.auth.mfa.enroll({
        factorType: 'totp',
        friendlyName: `Recova App ${timestamp}`,
      });
      if (error) {
        setError(error.message);
        return;
      }
      if (data) {
        setFactorId(data.id);
        const totpSecret = data.totp.secret;
        setSecret(totpSecret);

        try {
          const { data: { user } } = await supabase.auth.getUser();
          const userEmail = user?.email || 'user@recova.com';
          const simpleUri = `otpauth://totp/Recova:${encodeURIComponent(userEmail)}?secret=${totpSecret}&issuer=Recova`;
          const qrCodeDataUrl = await QRCode.toDataURL(simpleUri, {
            errorCorrectionLevel: 'M',
            width: 300,
            margin: 1,
            color: { dark: '#000000', light: '#FFFFFF' }
          });
          setQrCode(qrCodeDataUrl);
        } catch (qrErr: any) {
          setQrCode("");
          setError("QR generation failed. You can still use the manual code below.");
        }
      }
    } catch (err: any) {
      setError(err.message || "Failed to regenerate 2FA setup.");
    }
  };

  // Allow users stuck in code-only mode to reset factors and see a fresh QR
  const resetTotp = async () => {
    setResetting(true);
    setError("");
    setSuccess("");
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        setError("You must be logged in to reset 2FA.");
        setResetting(false);
        return;
      }

      const { data: existingFactors } = await supabase.auth.mfa.listFactors();
      if (existingFactors?.totp?.length) {
        for (const f of existingFactors.totp) {
          try {
            await supabase.auth.mfa.unenroll({ factorId: f.id });
          } catch (e: any) {
            console.warn("Unenroll failed", e);
          }
        }
      }

      // Redirect with reset flag to force fresh enrollment
      setTimeout(() => {
        window.location.href = '/setup-2fa?reset=true';
      }, 500);
    } catch (err: any) {
      setError(err.message || "Failed to reset 2FA factors.");
      setResetting(false);
    }
  };

  if (isEnrolled) {
    // Auto-redirect after showing success message
    setTimeout(() => {
      window.location.href = "/profile";
    }, 2000);
    
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50 dark:bg-secondary">
        <div className="max-w-md w-full bg-white dark:bg-gray-800 rounded-lg shadow-lg p-8">
          <div className="text-center">
            <svg
              className="mx-auto h-12 w-12 text-green-500"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            <h2 className="mt-4 text-2xl font-bold text-gray-900 dark:text-white">
              2FA Enabled!
            </h2>
            <p className="mt-2 text-gray-600 dark:text-gray-400">
              Your account is now protected with two-factor authentication.
            </p>
            <p className="mt-4 text-sm text-gray-500 dark:text-gray-500">
              Redirecting to profile...
            </p>

           
          </div>
              <div className="mt-6 text-center">
          {/* <a 
            href="/pricing" 
            className="text-sm text-gray-600 dark:text-gray-400 hover:text-primary"
          >
            Go to Pricing
          </a> */}
        </div>
        </div>
      </div>
    );
  }

  // If user needs to verify (2FA already set up, just needs to enter code)
  if (needsVerification) {
    return (
      <div className="flex items-center gap-10 w-full justify-center min-h-screen  dark:bg-secondary px-4">
          <div className='max-w-[50%] '>
          <img src={lock2} className='opacity-35' alt="Lock Icon" />
        </div>
        <div className="max-w-[50%] bg-white dark:bg-gray-800 rounded-xl shadow-lg p-16">
          <h2 className="text-3xl  font-poppinsBold text-center text-primary dark:text-white mb-10">
            Verify Your Identity
          </h2>
          <div className="flex items-center justify-center gap-2 mb-6">
            <p className="text-center font-poppinsMedium text-sm text-gray-600 dark:text-gray-400">
              Enter the 6-digit code from your authenticator app
            </p>
           
          </div>

          <div className="flex justify-center mb-4">
             <button
              type="button"
              onClick={() => setShowInfoModal(true)}
              className="flex-shrink-0 w-60 h-8 rounded-full bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 flex items-center justify-center hover:bg-blue-200 dark:hover:bg-blue-900/50 transition-colors mb-5 cursor-pointer"
              title="Why might my code be invalid?"
            >
              <span className="text-xs font-poppinsSemiBold">Why do i see invalid code error?</span>
            </button>

          </div>
          <form onSubmit={onVerifySetup} className="space-y-4">
            <div>
              <input
                type="text"
                value={verificationCode}
                onChange={(e) => setVerificationCode(e.target.value.replace(/\D/g, '').slice(0, 6))}
                placeholder="000000"
                maxLength={6}
                disabled={countdown > 0}
                className="mb-5 w-full px-4 py-3 text-center text-2xl font-mono border border-gray-300 rounded-3xl focus:ring-2 focus:ring-primary focus:border-transparent dark:bg-gray-700 dark:border-gray-600 dark:text-white disabled:opacity-50 disabled:cursor-not-allowed"
                required
                autoFocus
              />
            </div>
           

            {error && (
              <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-400 px-4 py-3 rounded text-sm">
                {countdown > 0 ? (
                  <div className="flex items-center justify-between">
                    <span>Too many incorrect attempts.</span>
                    <span className="font-bold text-lg">{countdown}s</span>
                  </div>
                ) : (
                  error
                )}
              </div>
            )}

            {success && (
              <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 text-green-700 dark:text-green-400 px-4 py-3 rounded text-sm">
                {success}
              </div>
            )}

            <button
              type="submit"
              disabled={verificationCode.length !== 6 || countdown > 0 || loading}
              className="w-full bg-primary hover:bg-indigo-700 text-white font-semibold py-3 px-4 rounded-xl transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <div className="flex items-center justify-center">
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                </div>
              ) : countdown > 0 ? `Wait ${countdown}s` : 'Verify Code'}
            
            </button>
          </form>

       
        </div>

      

        {/* Info Modal */}
        {showInfoModal && (
          <div className="fixed inset-0  flex items-center justify-center p-4 z-50">
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-md w-full">
              <div className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-poppinsSemiBold text-gray-900 dark:text-white">Why might my code be invalid?</h3>
                  <button
                    onClick={() => setShowInfoModal(false)}
                    className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                  >
                    ✕
                  </button>
                </div>
                <div className="space-y-3 text-xs text-gray-700 dark:text-gray-300">
                  <div className="flex gap-3">
                    
                    <div>
                      <p className="font-poppinsSemiBold text-gray-900 dark:text-white">Code expires every 30 seconds</p>
                      <p className="font-poppinsMedium">Use a fresh 6-digit code from your authenticator app each time</p>
                    </div>
                  </div>
                  <div className="flex gap-3">
                   
                    <div>
                      <p className="font-poppinsSemiBold text-gray-900 dark:text-white">Time sync issues</p>
                      <p className="font-poppinsMedium">Your phone and laptop's clock must be synchronized. Check your device settings</p>
                    </div>
                  </div>
                  <div className="flex gap-3">
                   
                    <div>
                      <p className="font-poppinsSemiBold text-gray-900 dark:text-white">Spaces or typos</p>
                      <p className="font-poppinsMedium">Enter only 6 digits with no spaces or special characters</p>
                    </div>
                  </div>
                  <div className="flex gap-3">
                   
                    <div>
                      <p className="font-poppinsSemiBold text-gray-900 dark:text-white">App not synced</p>
                      <p className="font-poppinsMedium">Ensure Google Authenticator displays the correct code for your email</p>
                    </div>
                  </div>
                  <div className="flex gap-3">
                   
                    {/* <div>
                      <p className="font-poppinsSemiBold text-gray-900 dark:text-white">Incorrect QR scan</p>
                      <p className="font-poppinsMedium">Try refreshing the QR code again</p>
                    </div> */}
                  </div>

                    <div className="flex gap-3">
                   
                    <div>
                      <p className="font-poppinsBold pt-7 text-gray-900  dark:text-white">If still invalid </p>
                      <p className="font-poppinsMedium">Repeat the code entering process for 2 to 3 times</p>
                    </div>
                  </div>
                </div>
                <button
                  onClick={() => setShowInfoModal(false)}
                  className="w-full mt-6 bg-primary hover:bg-indigo-700 text-white font-semibold py-2 px-4 rounded-lg transition-colors"
                >
                  Done
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }

  return (

    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 dark:bg-secondary px-4 space-y-6">
      <div className="w-full  bg-primary  dark:bg-gray-800 rounded-xl shadow-lg border border-gray-100 dark:border-gray-700 p-8">
        <div className="text-center mb-6">
          {/* <p className="text-sm uppercase tracking-[0.2em] text-indigo-600 dark:text-indigo-400 font-semibold">Security</p> */}
          <h1 className="text-3xl font-poppinsMedium text-slate-300 dark:text-white mt-2">Enable Two-Factor Authentication</h1>
          
        </div>

        <div className="flex justify-center items-center gap-3 mb-6">
        
                    <span className="text-l font-poppinsMedium text-slate-300">Get your code via</span>
            <span className="text-l border-2 p-3 rounded-md border-blue-300 font-poppinsMedium text-white dark:text-gray-400">Google Authenticator</span>
          

          {/* <button
            onClick={() => setVerificationType("sms")}
            className={`flex flex-col items-start p-4 rounded-lg border transition focus:outline-none focus:ring-2 focus:ring-indigo-500
              ${verificationType === "sms"
                ? "border-indigo-500 bg-indigo-50 text-indigo-900 dark:bg-indigo-900/40 dark:border-indigo-400"
                : "border-gray-200 hover:border-indigo-300 hover:bg-indigo-50/50 dark:border-gray-700 dark:hover:border-indigo-500 dark:hover:bg-indigo-900/30"}`}
          >
            <span className="text-sm font-semibold">Get your code via</span>
            <span className="text-xl text-gray-600 dark:text-gray-400">SMS</span>
          </button> */}
        </div>

        {!verificationType && (
          <div className="mb-6 text-center text-xs font-poppinsMedium text-gray-600 dark:text-gray-400">
            Select a method above to continue setup.
          </div>
        )}
      </div>

        {verificationType==="authenticator" &&   <div className="max-w-2xl w-full bg-white dark:bg-gray-800 rounded-lg shadow-lg p-8">
        {/* <h2 className="text-3xl font-poppinsBold text-center text-gray-900 dark:text-white mb-6">
          Enable Two-Factor Authentication
        </h2> */}
        
        {/* Show error first if user not logged in */}
        {error && !qrCode && (
          <div className="mb-6">
            <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-400 px-4 py-3 rounded">
              <p className="font-poppinsSemiBold">Error</p>
              <p className="text-sm font-poppinsMedium mt-1">{error}</p>
            </div>
            {error.includes("logged in") && (
              <div className="mt-4 text-center">
                <a
                  href="/login"
                  className="inline-block bg-primary hover:bg-indigo-700 text-white font-semibold py-2 px-6 rounded-lg transition-colors"
                >
                  Go to Login
                </a>
              </div>
            )}
          </div>
        )}
        
        <div className="space-y-6">
          {/* Step 1 */}
          <div className="border-b pb-4">
            <h3 className="text-lg font-poppinsSemiBold text-gray-900 dark:text-white mb-2">
              Step 1: Install Google Authenticator
            </h3>
            <p className="text-gray-600 dark:text-gray-400 text-xs font-poppinsMedium">
              Download Google Authenticator from the App Store or Google Play Store
            </p>
          </div>

          {/* Step 2 */}
          <div className="border-b pb-4">
            <h3 className="text-lg font-poppinsSemiBold text-gray-900 dark:text-white mb-4">
              Step 2: Scan QR Code
            </h3>
            
            {qrCode ? (
              <div className="flex flex-col items-center space-y-4">
                <img 
                  src={qrCode} 
                  alt="QR Code" 
                  className="w-64 h-64 border-2 border-gray-300 rounded-lg"
                />
                <button
                  type="button"
                  onClick={regenerateTotp}
                  className="mt-2 inline-flex text-gray-600 items-center px-4 py-2 text-sm font-medium rounded-md border border-gray-300 hover:border-indigo-400 hover:bg-indigo-50 dark:border-gray-600 dark:hover:border-indigo-400 dark:hover:bg-indigo-900/20"
                >
                  Regenerate QR
                </button>
                {/* <div className="bg-gray-100 dark:bg-gray-700 p-4 rounded-lg w-full">
                  <p className="text-xs text-gray-600 dark:text-gray-300 mb-2">
                    Can't scan? Enter this code manually in your authenticator app:
                  </p>
                  <code className="block text-center text-sm font-mono bg-white dark:bg-gray-800 p-2 rounded border break-all">
                    {secret}
                  </code>
                </div> */}
              </div>
            ) : secret ? (
              <div className="bg-yellow-50 dark:bg-yellow-900/20 border-2 border-yellow-400 p-6 rounded-lg w-full">
              <p className="text-gray-600 dark:text-gray-400 text-xs font-poppinsMedium mb-3">
                  ⚠️ QR code unavailable. Please enter this code manually in Google Authenticator:
                </p>
                <div className="bg-white dark:bg-gray-800 p-4 rounded-lg border-2 border-primary">
                  <code className="block text-center text-xl font-bold font-mono text-primary break-all select-all">
                    {secret || "Loading..."}
                  </code>
                </div>
                <div className="mt-4 text-center">
                  <p className="text-xs font-poppinsMedium text-gray-600 dark:text-gray-400 mb-1">
                    <strong>Account:</strong> Recova App
                  </p>
                  <p className="text-xs font-poppinsMedium text-gray-500 dark:text-gray-500">
                    (Copy the code above and paste it into Google Authenticator)
                  </p>
                </div>
              </div>
            ) : (
              <div className="flex justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
              </div>
            )}
          </div>

          {/* Step 3 */}
          <div>
          <div className="flex justify-between mb-4 space-x-8">
              <h3 className="text-lg font-poppinsSemiBold text-gray-900 dark:text-white mb-4">
              Step 3: Verify Setup
            </h3>
              <button
                    type="button"
                    onClick={() => setShowInfoModal(true)}
                    className="flex-shrink-0  w-56 h-10 rounded-full bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 flex items-center justify-center hover:bg-blue-200 dark:hover:bg-blue-900/50 transition-colors cursor-pointer"
                    title="Why might my code be invalid?"
                  >
                    <span className="text-xs font-poppinsSemiBold">Why my code is always invalid?</span>
                  </button>
          </div>
            <form onSubmit={onVerifySetup} className="space-y-4">
              <div>
                <label className="block text-xs font-poppinsMedium text-gray-700 dark:text-gray-300 mb-2">
                  Enter the 6-digit code from your authenticator app:
                </label>
                <input
                  type="text"
                  value={verificationCode}
                  onChange={(e) => setVerificationCode(e.target.value.replace(/\D/g, '').slice(0, 6))}
                  placeholder="000000"
                  maxLength={6}
                  className="w-full px-4 py-3 text-center text-2xl font-mono border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                  required
                />
              </div>

              {error && (
                <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-400 px-4 py-3 rounded">
                  <span className="font-poppinsMedium text-xs">{error}</span>
                  <p className="text-xs font-poppinsMedium mt-1 text-red-600 dark:text-red-300">Tip: Ensure your phone and computer time are correct. Try the next 6‑digit code if it's about to refresh.</p>
                </div>
              )}

              {success && (
                <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 text-green-700 dark:text-green-400 px-4 py-3 rounded">
                  {success}
                </div>
              )}

              <button
                type="submit"
                disabled={!secret || verificationCode.length !== 6}
                className="w-full bg-primary hover:bg-indigo-700 text-white font-semibold py-3 px-4 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <div className="flex items-center justify-center">
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                  </div>
                ) : (
                  "Verify and Enable 2FA"
                )}
              </button>
            </form>
          </div>
        </div>

        {/* Info Modal */}
        {showInfoModal && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-md w-full">
              <div className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-poppinsSemiBold text-gray-900 dark:text-white">Why do I see invalid code everytime I enter it?</h3>
                  <button
                    onClick={() => setShowInfoModal(false)}
                    className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                  >
                    ✕
                  </button>
                </div>
                <div className="space-y-3 text-sm text-gray-700 dark:text-gray-300">
                  <div className="flex gap-3">
                    
                    <div>
                      <p className="font-poppinsSemiBold  text-gray-900 dark:text-white">Code expires every 30 seconds</p>
                      <p className="font-poppinsMedium">Use a fresh 6-digit code from your authenticator app each time</p>
                    </div>
                  </div>
                  <div className="flex gap-3">
                   
                    <div>
                      <p className="font-poppinsSemiBold text-gray-900 dark:text-white">Time sync issues</p>
                      <p className="font-poppinsMedium">Your phone and laptop's clock might not be synchronized. Check your device settings</p>
                    </div>
                  </div>

                  <div className="flex gap-3">
                   
                    <div>
                      <p className="font-poppinsSemiBold text-gray-900 dark:text-white">Spaces or typos</p>
                      <p className="font-poppinsMedium">Enter only 6 digits with no spaces or special characters</p>
                    </div>
                  </div>
                  <div className="flex gap-3">
                  
                    <div>
                      <p className="font-poppinsSemiBold text-gray-900 dark:text-white">App not synced</p>
                      <p className="font-poppinsMedium">Ensure Google Authenticator displays the correct code for Recova</p>
                    </div>
                  </div>
                  <div className="flex gap-3">
                    
                    <div>
                      <p className="font-poppinsSemiBold text-gray-900 dark:text-white">Incorrect QR scan</p>
                      <p className="font-poppinsMedium">Try refreshing the QR code again</p>
                    </div>
                  </div>
                </div>
                <button
                  onClick={() => setShowInfoModal(false)}
                  className="w-full mt-6 bg-primary hover:bg-indigo-700 text-white font-semibold py-2 px-4 rounded-lg transition-colors"
                >
                  Got it
                </button>
              </div>
            </div>
          </div>
        )}

        {/* <div className="mt-6 text-center">
          <a 
            href="/pricing" 
            className="text-sm text-gray-600 dark:text-gray-400 hover:text-primary"
          >
            Skip for now
          </a>
        </div> */}
      </div> }



      {/* {verificationType==="sms" &&
      } */}
    
    </div>
  );
}
