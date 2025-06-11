import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useLocation } from "wouter";
import { getQueryFn, apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";

export function useAdminAuth() {
  const [, navigate] = useLocation();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const {
    data: admin,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["/api/admin/me"],
    queryFn: getQueryFn({ on401: "returnNull" }),
    retry: false,
  });

  const logoutMutation = useMutation({
    mutationFn: async () => {
      return await apiRequest("/api/admin/logout", {
        method: "POST",
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/me"] });
      toast({
        title: "Logout realizado com sucesso",
        description: "Você foi desconectado do painel administrativo.",
      });
      navigate("/admin/login");
    },
    onError: (error: any) => {
      toast({
        title: "Erro no logout",
        description: error.message || "Erro interno do servidor",
        variant: "destructive",
      });
    },
  });

  const logout = () => {
    logoutMutation.mutate();
  };

  const isAuthenticated = !!admin && !error;

  return {
    admin: (admin as any)?.admin || null,
    isLoading,
    isAuthenticated,
    logout,
    isLoggingOut: logoutMutation.isPending,
  };
}