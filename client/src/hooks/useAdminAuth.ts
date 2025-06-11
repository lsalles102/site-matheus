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
      try {
        return await apiRequest("/api/admin/logout", {
          method: "POST",
        });
      } catch (error) {
        // Even if logout fails on server, clear local state
        console.warn("Logout error (continuing anyway):", error);
        return { success: true };
      }
    },
    onSuccess: () => {
      // Clear all admin-related cache
      queryClient.removeQueries({ queryKey: ["/api/admin/me"] });
      queryClient.removeQueries({ queryKey: ["/api/admin/appointments"] });
      
      toast({
        title: "Logout realizado com sucesso",
        description: "Você foi desconectado do painel administrativo.",
      });
      navigate("/admin/login");
    },
    onError: (error: any) => {
      // Still navigate to login even on error
      queryClient.removeQueries({ queryKey: ["/api/admin/me"] });
      navigate("/admin/login");
      
      toast({
        title: "Sessão encerrada",
        description: "Você foi desconectado do sistema.",
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