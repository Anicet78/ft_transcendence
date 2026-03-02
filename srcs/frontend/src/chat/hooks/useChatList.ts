import { useQuery } from "@tanstack/react-query";
import api from "../../serverApi";

export function useChatList() {
  return useQuery({
    queryKey: ["chat-list"],
    queryFn: async () => {
      const res = await api.get("/chat/list");
      return res.data;
    }
  });
}
