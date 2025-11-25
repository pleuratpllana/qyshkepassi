import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "../api/supabaseClient";

const MAX_CARDS = 10;

export const useCards = (userId) => {
  const queryClient = useQueryClient();

  const { data: cards = [], isLoading, error } = useQuery(
    ["wifi_cards", userId],
    async () => {
      const { data, error, count } = await supabase
        .from("wifi_cards")
        .select("*", { count: "exact" })
        .eq("user_id", userId)
        .order("created_at", { ascending: false })
        .limit(MAX_CARDS);

      if (error) throw error;
      return data;
    },
    {
      enabled: !!userId,
      staleTime: 1000 * 60 * 5,
    }
  );

  const deleteCard = useMutation(
    async (cardId) => {
      const { error } = await supabase.from("wifi_cards").delete().eq("id", cardId);
      if (error) throw error;
    },
    {
      onSuccess: () => queryClient.invalidateQueries(["wifi_cards", userId]),
    }
  );

  const deleteAllCards = useMutation(
    async () => {
      const { error } = await supabase.from("wifi_cards").delete().eq("user_id", userId);
      if (error) throw error;
    },
    {
      onSuccess: () => queryClient.invalidateQueries(["wifi_cards", userId]),
    }
  );

  const updateCard = useMutation(
    async ({ id, updates }) => {
      const { data, error } = await supabase.from("wifi_cards").update(updates).eq("id", id);
      if (error) throw error;
      return data[0];
    },
    {
      onSuccess: () => queryClient.invalidateQueries(["wifi_cards", userId]),
    }
  );

  return { cards, isLoading, error, deleteCard, deleteAllCards, updateCard };
};
