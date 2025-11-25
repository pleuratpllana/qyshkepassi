import { useEffect, useState } from "react";
import { useCards } from "../context/CardContext";
import { useGlobal } from "../context/GlobalContext";
import { showToast } from "../utils/toast";
import QrCard from "../components/QrCard";
import DeleteCardModal from "../components/Shared/DeleteCardModal";
import { ArrowLeft, Bookmark } from "lucide-react";
import { useNavigate } from "react-router-dom";
import Button from "../components/UI/Button";
import { motion, AnimatePresence } from "framer-motion";
import { useFadeScale } from "../hooks/useFadeScale"; 

const MAX_CARDS = 10;
const LOAD_STEP = 3;

const SavedCardsPage = () => {
  const fadeScale = useFadeScale(); 
  const { cards, loading, deleteCard } = useCards();
  const { setFormVisible, saveQR } = useGlobal();
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedCardId, setSelectedCardId] = useState(null);
  const [visibleCount, setVisibleCount] = useState(LOAD_STEP);
  const [searchQuery, setSearchQuery] = useState("");
  const navigate = useNavigate();

  const handleDeleteClick = (id) => {
    setSelectedCardId(id);
    setModalOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (!selectedCardId) return;
    try {
      await deleteCard(selectedCardId);
      showToast({ message: "Card deleted successfully", success: true });
    } catch {
      showToast({ message: "Failed to delete card", success: false });
    } finally {
      setModalOpen(false);
      setSelectedCardId(null);
    }
  };

  const handleEditClick = (card) => {
    saveQR(
      card.qr_url,
      card.title,
      card.password || "",
      card.encryption || "nopass",
      card.ssid || card.title
    );
    setFormVisible(true);
  };

  const handleLoadMore = () => {
    setVisibleCount((prev) =>
      Math.min(prev + LOAD_STEP, filteredCards.length)
    );
  };

  const canAddMore = cards.length < MAX_CARDS;
  const savedCards = cards.filter((card) => card.qr_url && card.title);
  const filteredCards = savedCards.filter((card) => {
    if (!searchQuery.trim()) return true;
    const query = searchQuery.toLowerCase();
    return (
      card.title.toLowerCase().includes(query) ||
      (card.ssid && card.ssid.toLowerCase().includes(query))
    );
  });

  useEffect(() => {
    setVisibleCount(LOAD_STEP);
  }, [searchQuery]);

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key="saved-cards-page"
        variants={fadeScale}
        initial="hidden"
        animate="visible"
        exit="exit"
        className="w-full flex flex-col items-center p-0"
      >
        <div className="w-full flex items-start mb-6">
          <Button
            variant="ghost"
            className="flex items-center gap-2 p-0 text-sm"
            onClick={() => navigate("/main")}
          >
            <ArrowLeft size={16} />
            <span className="font-medium">Back</span>
          </Button>
        </div>

        {loading && !cards.length && <div>Loading cards...</div>}
        {!loading && !savedCards.length && (
          <div className="text-[var(--color-text)]">No saved cards yet.</div>
        )}

        {savedCards.length > 0 && (
          <div className="w-full flex flex-col gap-4">
            <div className="flex flex-col gap-2">
              <label
                htmlFor="saved-card-search"
                className="text-sm font-medium text-[var(--color-accenttext)]"
              >
                Search your cards
              </label>
              <div className="relative">
                <input
                  id="saved-card-search"
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Filter by title or SSID"
                  className="w-full rounded-lg bg-[var(--color-lightbg)] border border-[var(--color-border)] px-4 py-2 text-[var(--color-text)] placeholder-[var(--color-accenttext)] focus:outline-none focus:ring-2 focus:ring-[var(--color-midbg)] transition"
                />
                <span className="absolute inset-y-0 right-4 flex items-center text-[var(--color-accenttext)] text-xs">
                  {filteredCards.length}/{savedCards.length}
                </span>
              </div>
            </div>
            {filteredCards.length === 0 && (
              <div className="text-sm text-[var(--color-accenttext)]">
                No cards match your search.
              </div>
            )}
            {filteredCards.slice(0, visibleCount).map((card) => (
              <QrCard
                key={card.id}
                card={card}
                isUser={true}
                onEdit={handleEditClick}
                onDelete={handleDeleteClick}
              />
            ))}
            {visibleCount < filteredCards.length && (
              <Button
                className="w-full mt-2 flex items-center justify-center gap-2"
                onClick={handleLoadMore}
              >
                <Bookmark size={16} />
                Load More
              </Button>
            )}
          </div>
        )}

        {!canAddMore && (
          <p className="text-red-600 mt-4 text-center">
            You have reached the maximum of {MAX_CARDS} saved cards.
          </p>
        )}

        <DeleteCardModal
          isOpen={modalOpen}
          onClose={() => setModalOpen(false)}
          onDelete={handleConfirmDelete}
        />
      </motion.div>
    </AnimatePresence>
  );
};

export default SavedCardsPage;
