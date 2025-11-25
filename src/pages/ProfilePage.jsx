// src/pages/ProfilePage.jsx
import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useCards } from "../context/CardContext";
import { ArrowLeft, Trash2, Bookmark } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { useFadeScale } from "../hooks/useFadeScale"; // <-- hook import
import { useTranslation } from "react-i18next";
import Button from "../components/UI/Button";
import DeleteAccountModal from "../components/Shared/DeleteAccountModal";
import DeleteCardModal from "../components/Shared/DeleteCardModal";
import { showToast } from "../utils/Toast";
import EditableField from "../components/UI/EditableField";
import QrCard from "../components/QrCard";
import { supabase } from "../api/supabaseClient";

const MAX_CARDS = 10;

const ProfilePage = () => {
  const { t } = useTranslation();
  const fadeScale = useFadeScale(); // <-- use the hook
  const { user, refreshUser } = useAuth();
  const { latestCard, cardCount, fetchCards } = useCards();
  const navigate = useNavigate();

  const [name, setName] = useState(user?.user_metadata?.name || "");
  const [password, setPassword] = useState("");
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showDeleteAllModal, setShowDeleteAllModal] = useState(false);
  const [deleting, setDeleting] = useState(false);

  if (!user) return <p>Loading profile...</p>;

  const updateName = async (newName) => {
    try {
      const { error } = await supabase.auth.updateUser({ data: { name: newName } });
      if (error) throw new Error(error.message);
      setName(newName);
      showToast({ message: t("nameUpdated"), success: true });
      refreshUser?.();
    } catch (err) {
      showToast({ message: err.message || t("failedToUpdateName"), success: false });
    }
  };

  const updatePassword = async (newPassword) => {
    if (!newPassword) return;
    try {
      const { error } = await supabase.auth.updateUser({ password: newPassword });
      if (error) throw new Error(error.message);
      setPassword("");
      showToast({ message: t("passwordUpdated"), success: true });
    } catch (err) {
      showToast({ message: err.message || t("failedToUpdatePassword"), success: false });
    }
  };

  // Delete all cards
  const handleDeleteAll = async () => {
    if (!user) return;
    try {
      const { error } = await supabase.from("wifi_cards").delete().eq("user_id", user.id);
      if (error) throw error;

      showToast({ message: t("allCardsDeleted"), success: true });
      fetchCards();
      setShowDeleteAllModal(false);
    } catch (err) {
      showToast({ message: err.message || t("failedToDeleteCards"), success: false });
    }
  };

  // Delete account using Edge Function
  const handleDeleteAccount = async () => {
    if (!user?.id) {
      showToast({ message: t("userNotFound"), success: false });
      return;
    }

    setDeleting(true);
    try {
      const { data: sessionData } = await supabase.auth.getSession();
      const accessToken = sessionData?.session?.access_token;
      if (!accessToken) throw new Error("Missing access token");

      const response = await fetch(
        "https://uuxhwrywofsrwdetfxsx.supabase.co/functions/v1/hyper-processor",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${accessToken}`,
          },
          body: JSON.stringify({ userId: user.id }),
        }
      );

      const data = await response.json();
      if (!response.ok) throw new Error(data?.message || t("failedToDeleteAccount"));

      showToast({ message: t("accountDeletedSuccessfully"), success: true });
      await supabase.auth.signOut();
      navigate("/");
    } catch (err) {
      showToast({ message: err.message || t("failedToDeleteAccount"), success: false });
    } finally {
      setDeleting(false);
      setShowDeleteModal(false);
    }
  };

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key="profile-page"
        variants={fadeScale} 
        initial="hidden"
        animate="visible"
        exit="exit"
        className="w-full flex flex-col gap-8"
      >
        <div className="w-full flex mb-2 mt-4">
          <Button
            variant="ghost"
            className="flex items-center gap-2 text-sm p-0 self-start"
            onClick={() => navigate("/")}
          >
            <ArrowLeft size={16} />
            <span className="font-medium">{t("back")}</span>
          </Button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-[var(--color-lightbg)] p-6 rounded-2xl flex flex-col gap-6">
            <h2 className="text-xl font-semibold text-[var(--color-text)] mb-4">{t("profileInfo")}</h2>
            <EditableField label={t("name")} value={name} onSave={updateName} placeholder={t("yourName")} />
            <EditableField label={t("password")} type="password" value={password} onSave={updatePassword} placeholder={t("passwordPlaceholder")} />

            <ProfileRow label={t("email")} value={user.email} />
            <ProfileRow label={t("accountCreated")} value={new Date(user.created_at).toLocaleString()} />
            <ProfileRow label={t("lastSignIn")} value={new Date(user.last_sign_in_at).toLocaleString()} />
            <ProfileRow label={t("savedCards")} value={`${cardCount} / ${MAX_CARDS}`} />
          </div>

          <div className="bg-[var(--color-lightbg)] p-6 rounded-2xl flex flex-col">
            <h2 className="text-xl font-semibold text-[var(--color-text)] mb-10 ">{t("mostRecentQRCode")}</h2>

            {latestCard ? (
              <QrCard card={latestCard} isUser={false} />
            ) : (
              <p className="opacity-70 text-sm mb-4">{t("noQRSavedYet")}</p>
            )}

            <div className="flex gap-2 w-full mt-10 md:mt-auto">
              <Button className="flex-1 py-3 rounded-lg flex items-center gap-2" onClick={() => navigate("/saved-cards")}>
                <Bookmark size={16} />
                {t("seeAllSavedCards")}
              </Button>
              <Button
                variant="ghost"
                className="ghost-btn text-sm py-3 rounded-lg flex items-center gap-2"
                onClick={() => setShowDeleteAllModal(true)}
              >
                <Trash2 size={16} />
                {t("deleteAllCards")}
              </Button>
            </div>
          </div>
        </div>

        <div className="bg-[var(--color-lightbg)] p-6 rounded-2xl border-l-4 border-red-600 flex flex-col gap-4">
          <h2 className="text-xl font-semibold text-[var(--color-text)]">{t("dangerZone")}</h2>
          <p className="text-sm opacity-70">{t("dangerZoneWarning")}</p>
          <Button
            className={`w-full font-medium py-3 rounded-lg text-white transition-all ${deleting ? "bg-gray-500" : "bg-red-600 hover:bg-red-700"}`}
            onClick={() => setShowDeleteModal(true)}
            disabled={deleting}
          >
            {t("deleteAccount")}
          </Button>
        </div>

        <DeleteAccountModal
          isOpen={showDeleteModal}
          onClose={() => setShowDeleteModal(false)}
          onDelete={handleDeleteAccount}
          loading={deleting}
        />

        <DeleteCardModal
          isOpen={showDeleteAllModal}
          onClose={() => setShowDeleteAllModal(false)}
          onDelete={handleDeleteAll}
          isAll={true}
        />
      </motion.div>
    </AnimatePresence>
  );
};

const ProfileRow = ({ label, value }) => (
  <div className="flex justify-between border-b border-[var(--color-border)] pb-3.5 space-y-2">
    <span className="text-sm font-medium text-[var(--color-text)]">{label}</span>
    <span className="text-sm opacity-80 text-[var(--color-text)]">{value}</span>
  </div>
);

export default ProfilePage;
