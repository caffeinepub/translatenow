import { useMutation, useQuery } from "@tanstack/react-query";
import { useActor } from "./useActor";

interface ExtendedActor {
  getVisitCount(): Promise<bigint>;
  trackVisit(): Promise<void>;
}

export function useGetSupportedLanguages() {
  const { actor, isFetching } = useActor();
  return useQuery({
    queryKey: ["supportedLanguages"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getSupportedLanguages();
    },
    enabled: !!actor && !isFetching,
    staleTime: Number.POSITIVE_INFINITY,
  });
}

export function useGetRecentTranslations() {
  const { actor, isFetching } = useActor();
  return useQuery({
    queryKey: ["recentTranslations"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getRecentTranslations();
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
  const { actor } = useActor();
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
      if (!actor) throw new Error("Actor not available");
      return actor.translate(text, fromLang, toLang);
    },
  });
}
