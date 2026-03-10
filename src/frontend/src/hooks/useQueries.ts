import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type {
  ClassCategory,
  Material,
  MaterialInput,
  MaterialType,
  Subject,
} from "../backend";
import { useActor } from "./useActor";

export function useListMaterials() {
  const { actor, isFetching } = useActor();
  return useQuery<Material[]>({
    queryKey: ["materials"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.listMaterials();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useSearchMaterials(term: string) {
  const { actor, isFetching } = useActor();
  return useQuery<Material[]>({
    queryKey: ["materials", "search", term],
    queryFn: async () => {
      if (!actor || !term.trim()) return [];
      return actor.searchByTitle(term);
    },
    enabled: !!actor && !isFetching && term.trim().length > 0,
  });
}

export function useFilterByClass(classCategory: ClassCategory | null) {
  const { actor, isFetching } = useActor();
  return useQuery<Material[]>({
    queryKey: ["materials", "class", classCategory],
    queryFn: async () => {
      if (!actor || !classCategory) return [];
      return actor.filterByClass(classCategory);
    },
    enabled: !!actor && !isFetching && !!classCategory,
  });
}

export function useFilterBySubject(subject: Subject | null) {
  const { actor, isFetching } = useActor();
  return useQuery<Material[]>({
    queryKey: ["materials", "subject", subject],
    queryFn: async () => {
      if (!actor || !subject) return [];
      return actor.filterBySubject(subject);
    },
    enabled: !!actor && !isFetching && !!subject,
  });
}

export function useFilterByType(materialType: MaterialType | null) {
  const { actor, isFetching } = useActor();
  return useQuery<Material[]>({
    queryKey: ["materials", "type", materialType],
    queryFn: async () => {
      if (!actor || !materialType) return [];
      return actor.filterByType(materialType);
    },
    enabled: !!actor && !isFetching && !!materialType,
  });
}

export function useMaterialCount() {
  const { actor, isFetching } = useActor();
  return useQuery<bigint>({
    queryKey: ["materialCount"],
    queryFn: async () => {
      if (!actor) return BigInt(0);
      return actor.getMaterialCount();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useIsCallerAdmin() {
  const { actor, isFetching } = useActor();
  return useQuery<boolean>({
    queryKey: ["isAdmin"],
    queryFn: async () => {
      if (!actor) return false;
      return actor.isCallerAdmin();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useIncrementDownload() {
  const { actor } = useActor();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      if (!actor) throw new Error("No actor");
      await actor.incrementDownloadCount(id);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["materials"] });
    },
  });
}

export function useCreateMaterial() {
  const { actor } = useActor();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (input: MaterialInput) => {
      if (!actor) throw new Error("No actor");
      return actor.createMaterial(input);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["materials"] });
      queryClient.invalidateQueries({ queryKey: ["materialCount"] });
    },
  });
}

export function useUpdateMaterial() {
  const { actor } = useActor();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, input }: { id: string; input: MaterialInput }) => {
      if (!actor) throw new Error("No actor");
      await actor.updateMaterial(id, input);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["materials"] });
    },
  });
}

export function useDeleteMaterial() {
  const { actor } = useActor();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      if (!actor) throw new Error("No actor");
      await actor.deleteMaterial(id);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["materials"] });
      queryClient.invalidateQueries({ queryKey: ["materialCount"] });
    },
  });
}
