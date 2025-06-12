import { useEffect } from "react";
import { useLocation } from "wouter";
import { useAdminAuth } from "@/hooks/useAdminAuth";
import { Button } from "@/components/ui/button";
import { LogOut } from "lucide-react";
import AdminTable from "@/components/admin-table";
import SEOHead from "@/components/seo-head";
import { getStoreConfig, generateSEOContent } from "@/lib/seo-config";

export default function Admin() {
  const { admin, isLoading, isAuthenticated, logout } = useAdminAuth();
  const [, navigate] = useLocation();
  
  const regionKey = new URLSearchParams(window.location.search).get('region') || 'sao-luis';
  const storeConfig = getStoreConfig(regionKey);
  const seoContent = generateSEOContent(storeConfig);

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      navigate("/admin/login");
    }
  }, [isLoading, isAuthenticated, navigate]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-lg">Carregando...</div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <SEOHead
        title={seoContent.admin.title}
        description={seoContent.admin.description}
        keywords={seoContent.admin.keywords}
        region={storeConfig.region}
        city={storeConfig.city}
        businessName={storeConfig.businessName}
      />
      <header className="bg-white dark:bg-gray-800 shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <h1 className="text-xl font-semibold text-gray-900 dark:text-white">
              Painel Administrativo - {storeConfig.businessName}
            </h1>
            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-600 dark:text-gray-400">
                Bem-vindo, {admin?.username}
              </span>
              <Button
                variant="outline"
                size="sm"
                onClick={logout}
                className="flex items-center space-x-2"
              >
                <LogOut className="h-4 w-4" />
                <span>Sair</span>
              </Button>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
        <AdminTable />
      </main>
    </div>
  );
}