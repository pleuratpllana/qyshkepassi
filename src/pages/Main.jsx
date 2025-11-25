import  { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { useForm } from 'react-hook-form';
import { useGlobal } from '../context/GlobalContext.jsx';
import { useAuth } from '../context/AuthContext';
import { useCards } from '../context/CardContext';
import QRCode from 'qrcode';
import FormWrapper from '../components/FormWrapper';
import FormInput from '../components/FormInput';
import PasswordInput from '../components/PasswordInput';
import EncryptionSelector from '../components/EncryptionSelector';
import ShareQRCode from '../components/ShareQRCode';
import { showToast } from '../utils/toast';
import { QrCode, Type, Wifi, Shield, RotateCw } from 'lucide-react';
import { useFadeScale } from '../hooks/useFadeScale';

const MainPage = () => {
  const { t } = useTranslation();
  const fadeScale = useFadeScale();

  const {
    qrUrl,
    networkName,
    networkPassword,
    networkSecurity,
    formVisible,
    saveQR,
    resetQR,
    setFormVisible
  } = useGlobal();

  const { user, isConfirmed } = useAuth();
  const { saveCard } = useCards();

  const [encryption, setEncryption] = useState(null);
  const autoResetTimeoutRef = useRef(null);

  const {
    register,
    handleSubmit,
    watch,
    reset,
    formState: { errors, touchedFields }
  } = useForm({
    defaultValues: { custom_title: '', ssid: '', password: '' },
    mode: 'onTouched'
  });

  const watched = watch();
  const password = watched.password;
  const custom_title = watched.custom_title;
  const ssid = watched.ssid;

  const isPasswordRequired = encryption && encryption !== 'OPEN';
  const allRequiredFieldsFilled =
    custom_title.trim() &&
    ssid.trim() &&
    encryption !== null &&
    (!isPasswordRequired || password.trim());

  const getPasswordStrength = (pwd) => {
    if (!pwd) return { width: '0%', color: '', label: '' };
    if (pwd.length < 6) return { width: '25%', color: 'bg-red-400', label: t('Weak') };
    if (pwd.length < 10) return { width: '50%', color: 'bg-yellow-400', label: t('Medium') };
    if (pwd.length < 15) return { width: '75%', color: 'bg-green-400', label: t('Strong') };
    return { width: '100%', color: 'bg-green-700', label: t('VeryStrong') };
  };

  const generateRandomPassword = () => {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*';
    let result = '';
    for (let i = 0; i < 16; i++) result += chars.charAt(Math.floor(Math.random() * chars.length));
    reset({ ...watched, password: result });
  };

  const handleNetworkSubmit = async (data) => {
    if (!user || !isConfirmed) {
      showToast({ message: t('mustBeLoggedInOrConfirmed'), success: false });
      return;
    }

    const enc = encryption || 'nopass';
    const wifiString = `WIFI:T:${enc};S:${data.ssid};P:${data.password || ''};;`;

    try {
      const url = await QRCode.toDataURL(wifiString);

      const success = saveQR(url, data.custom_title, data.password || '', enc);

      if (success) {
        setFormVisible(false);
        showToast({ message: t('qrReadyMessage', { name: data.custom_title }), success: true });
      }
    } catch (err) {
      console.error('Failed to generate QR code:', err);
      showToast({ message: t('qrGenerationFailed'), success: false });
    }
  };

  const handleGenerateNew = () => {
    if (autoResetTimeoutRef.current) {
      clearTimeout(autoResetTimeoutRef.current);
    }
    setFormVisible(true);
    reset();
    resetQR();
    setEncryption(null);
  };

  const handleSaveCardButton = async () => {
    if (!user || !isConfirmed) {
      showToast({ message: t('mustBeLoggedInOrConfirmed'), success: false });
      return;
    }

    try {
      await saveCard({
        qrUrl,
        networkName,
        networkPassword,
        networkSecurity
      });

      showToast({ message: t('cardSaved'), success: true });
    } catch (error) {
      console.error(error);
      showToast({ message: t('savingFailed'), success: false });
    }
  };

  useEffect(() => {
    if (!formVisible && qrUrl) {
      // Clear any existing timeout
      if (autoResetTimeoutRef.current) {
        clearTimeout(autoResetTimeoutRef.current);
      }
      
      autoResetTimeoutRef.current = setTimeout(() => {
        resetQR();
        reset();
        setEncryption(null);
      }, 12500);
    }

    return () => {
      if (autoResetTimeoutRef.current) {
        clearTimeout(autoResetTimeoutRef.current);
      }
    };
  }, [formVisible, qrUrl, resetQR, reset]);

  return (
    <div className="mt-auto w-full flex flex-col items-center px-4">
      <AnimatePresence mode="wait">
        {formVisible && (
          <motion.div
            key="form"
            variants={fadeScale}
            initial="hidden"
            animate="visible"
            exit="exit"
            className="w-full"
          >
            <FormWrapper
              title={
                <div className="flex items-start gap-3">
                  <QrCode size={48} className="text-primary mt-1" />
                  <div className="flex flex-col">
                    <span className="text-2xl font-bold text-[var(--color-text)]">
                      {t('createWifiQrCode')}
                    </span>
                    <span className="text-sm font-light text-[var(--color-text)] mt-1">
                      {t('generateBeautifulQrCode')}
                    </span>
                  </div>
                </div>
              }
              onSubmit={handleSubmit(handleNetworkSubmit)}
              submitLabel={
                <>
                  <QrCode size={20} /> {t('generateQRButton')}
                </>
              }
              resetLabel={
                <>
                  <RotateCw size={16} /> {t('clear')}
                </>
              }
              onReset={handleGenerateNew}
              loading={!allRequiredFieldsFilled}
            >
              {({ submitted }) => (
                <>
                  <FormInput
                    label={t('displayTitle')}
                    placeholder={t('displayTitlePlaceholder')}
                    icon={Type}
                    register={register('custom_title', { required: t('displayTitleRequired') })}
                    error={submitted && errors.custom_title?.message}
                    value={custom_title}
                    isTouched={touchedFields.custom_title}
                  />

                  <FormInput
                    label={t('networkName')}
                    placeholder={t('networkNamePlaceholder')}
                    icon={Wifi}
                    register={register('ssid', { required: t('networkNameRequired') })}
                    error={submitted && errors.ssid?.message}
                    value={ssid}
                    isTouched={touchedFields.ssid}
                  />

                  <EncryptionSelector
                    encryption={encryption}
                    onChange={setEncryption}
                    labelIcon={Shield}
                  />

                  {isPasswordRequired && (
                    <PasswordInput
                      label={t('password')}
                      placeholder={t('passwordPlaceholder')}
                      register={register('password', { required: t('passwordRequired') })}
                      generateRandom={generateRandomPassword}
                      showStrength={!!password}
                      strength={getPasswordStrength(password)}
                      error={submitted && errors.password?.message}
                      value={password}
                      isTouched={touchedFields.password}
                    />
                  )}

                  {submitted && encryption === null && (
                    <div className="text-xs text-red-400">{t('encryptionRequired')}</div>
                  )}
                </>
              )}
            </FormWrapper>
          </motion.div>
        )}

        {!formVisible && qrUrl && (
          <motion.div
            key="qr"
            variants={fadeScale}
            initial="hidden"
            animate="visible"
            exit="exit"
            className="flex flex-col items-center text-center mt-10 text-[var(--color-text)]"
          >
            <h2 className="text-[var(--text-h2)] font-bold mb-4">
              {t('qrReadyMessage', { name: networkName })}
            </h2>

            <p className="text-[var(--text-base)] mb-2">{t('scanNowConnect')}</p>

            <ShareQRCode
              value={qrUrl}
              networkName={networkName}
              password={networkPassword}
              security={networkSecurity}
              onGenerateNew={handleGenerateNew}
              onSaveCard={handleSaveCardButton}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default MainPage;
