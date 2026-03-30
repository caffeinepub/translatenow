import { useMutation, useQuery } from "@tanstack/react-query";
import { useActor } from "./useActor";

interface ExtendedActor {
  getVisitCount(): Promise<bigint>;
  trackVisit(): Promise<void>;
  getRecentTranslations(): Promise<
    Array<{
      text: string;
      fromLang: string;
      toLang: string;
      translatedText: string;
      timestamp: bigint;
    }>
  >;
}

export function useGetSupportedLanguages() {
  return useQuery({
    queryKey: ["supportedLanguages"],
    queryFn: async () => [
      { code: "en", name: "English" },
      { code: "es", name: "Spanish" },
      { code: "fr", name: "French" },
      { code: "de", name: "German" },
      { code: "it", name: "Italian" },
      { code: "pt", name: "Portuguese" },
      { code: "ru", name: "Russian" },
      { code: "zh", name: "Chinese" },
      { code: "ja", name: "Japanese" },
      { code: "ko", name: "Korean" },
      { code: "ar", name: "Arabic" },
      { code: "hi", name: "Hindi" },
      { code: "nl", name: "Dutch" },
      { code: "tr", name: "Turkish" },
      { code: "pl", name: "Polish" },
      { code: "sv", name: "Swedish" },
    ],
    staleTime: Number.POSITIVE_INFINITY,
  });
}

export function useGetRecentTranslations() {
  const { actor, isFetching } = useActor();
  return useQuery({
    queryKey: ["recentTranslations"],
    queryFn: async () => {
      if (!actor) return [];
      return (actor as unknown as ExtendedActor).getRecentTranslations();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useGetVisitCount() {
  const { actor, isFetching } = useActor();
  return useQuery<bigint>({
    queryKey: ["visitCount"],
    queryFn: async () => {
      if (!actor) return BigInt(0);
      return (actor as unknown as ExtendedActor).getVisitCount();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useTrackVisit() {
  const { actor } = useActor();
  return useMutation({
    mutationFn: async () => {
      if (!actor) throw new Error("Actor not available");
      return (actor as unknown as ExtendedActor).trackVisit();
    },
  });
}

export function useTranslate() {
  return useMutation({
    mutationFn: async ({
      text,
      fromLang,
      toLang,
    }: {
      text: string;
      fromLang: string;
      toLang: string;
    }) => {
      const encoded = encodeURIComponent(text);
      const url = `https://translate.googleapis.com/translate_a/single?client=gtx&sl=${fromLang}&tl=${toLang}&dt=t&q=${encoded}`;
      const res = await fetch(url);
      if (!res.ok) throw new Error("Translation request failed");
      const data = await res.json();
      const translated = (data?.[0] as [string][])
        ?.map((chunk) => chunk?.[0])
        .filter(Boolean)
        .join("");
      if (!translated) throw new Error("No translation returned");
      return translated as string;
    },
  });
}
