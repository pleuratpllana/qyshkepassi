import  { createContext, useContext, useState, useEffect, useRef } from "react";
import { useAuth } from "./AuthContext";
import { supabase } from "../api/supabaseClient";

const CardContext = createContext();
export const useCards = () => useContext(CardContext);

export const MAX_CARDS = 10;

export const CardProvider = ({ children }) => {
  const { user } = useAuth();
  const [cards, setCards] = useState([]);
  const [loading, setLoading] = useState(false);
  const fetchedRef = useRef(false); 

  const fetchCards = async () => {
    if (!user) return;
    setLoading(true);
    const { data, error } = await supabase
      .from("wifi_cards")
      .select("*")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false });

    if (error) console.error("Fetch cards error:", error);
    else setCards(data || []);
    setLoading(false);
  };

  const saveCard = async (card) => {
    if (!user) return null;

    const { data, error } = await supabase
      .from("wifi_cards")
      .insert([{
        user_id: user.id,
        qr_url: card.qr_url,
        title: card.title,
        password: card.password || "",
        encryption: card.encryption || "",
        ssid: card.ssid || "",
      }])
      .select();

    if (error) console.error("Save card error:", error);
    else setCards((prev) => [data[0], ...prev]);

    return data ? data[0] : null;
  };

  const updateCard = async (cardId, updatedData) => {
    const { data, error } = await supabase
      .from("wifi_cards")
      .update(updatedData)
      .eq("id", cardId)
      .select();

    if (error) console.error("Update card error:", error);
    else setCards((prev) =>
      prev.map((c) => (c.id === cardId ? data[0] : c))
    );

    return data ? data[0] : null;
  };

  const deleteCard = async (cardId) => {
    const { error } = await supabase.from("wifi_cards").delete().eq("id", cardId);
    if (error) console.error("Delete card error:", error);
    else setCards((prev) => prev.filter((c) => c.id !== cardId));
  };

  // fetch cards once per user session
  useEffect(() => {
    if (!user) {
      setCards([]);
      fetchedRef.current = false;
      return;
    }
    if (!fetchedRef.current) {
      fetchCards();
      fetchedRef.current = true;
    }
  }, [user]);

  const latestCard = cards[0] || null;
  const cardCount = cards.length;

  return (
    <CardContext.Provider
      value={{
        cards,
        latestCard,
        cardCount,
        loading,
        fetchCards,
        saveCard,
        updateCard,
        deleteCard,
      }}
    >
      {children}
    </CardContext.Provider>
  );
};
