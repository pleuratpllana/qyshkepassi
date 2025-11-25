import  { useState } from 'react';
import { Mail, RefreshCw, AlertTriangle } from 'lucide-react';
import { useAuth } from '../context/AuthContext'; 
import Button from './UI/Button'; 

const EmailVerificationScreen = () => {
  const { user, resendConfirmationEmail } = useAuth();
  const [resending, setResending] = useState(false);
  const [resendStatus, setResendStatus] = useState(null); 

  const userEmail = user?.email || 'your email address';

  const handleResend = async () => {
    setResending(true);
    setResendStatus(null);
    try {
      await resendConfirmationEmail(userEmail);
      setResendStatus('success');
    } catch (error) {
      console.error('Error resending email:', error);
      setResendStatus('error');
    } finally {
      setResending(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center max-w-2xl  px-12 py-10 text-center bg-[var(--color-lightbg)]">
      <Mail size={48} className="text-[var(--color-text)] mb-4" />
      <h1 className="text-2xl font-bold mb-2 text-[var(--color-text)]">
        Account Confirmation Required
      </h1>
      <p className=" text-[var(--color-text)] mb-6">
        You are successfully signed in, but you need to confirm your email address to access your saved Wi-Fi cards.
        A confirmation link has been sent to **{userEmail}**.
      </p>

      {resendStatus === 'success' && (
        <p className="flex items-center gap-2 p-3 my-4 rounded-lg bg-green-500/10 text-green-500">
          <Mail size={16} /> New confirmation email sent successfully!
        </p>
      )}
      {resendStatus === 'error' && (
        <p className="flex items-center gap-2 p-3 my-4 rounded-lg bg-red-500/10 text-red-500">
          <AlertTriangle size={16} /> Error sending email. Please try again.
        </p>
      )}
      
      <Button 
        onClick={handleResend}
        disabled={resending}
        className="flex items-center gap-2 py-2 px-4 rounded-lg bg-[var(--color-button-bg)] text-[var(--color-text)]"
      >
        <RefreshCw size={18} className={resending ? 'animate-spin' : ''} />
        {resending ? 'Sending...' : 'Resend Confirmation Email'}
      </Button>
    </div>
  );
};

export default EmailVerificationScreen;