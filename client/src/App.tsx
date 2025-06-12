import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { useAuth } from "@/hooks/useAuth";
import Landing from "@/pages/landing";
import Admin from "@/pages/admin";
import AdminLogin from "@/pages/admin-login";
import NotFound from "@/pages/not-found";
import { ErrorBoundary } from "react-error-boundary";

function ErrorFallback({error}: {error: Error}) {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-white mb-4">Algo deu errado</h2>
        <p className="text-gray-light mb-4">A página encontrou um problema técnico.</p>
        <button 
          onClick={() => window.location.reload()} 
          className="bg-cyan text-white px-4 py-2 rounded"
        >
          Recarregar Página
        </button>
        <details className="mt-4 text-left">
          <summary className="text-cyan cursor-pointer">Detalhes técnicos</summary>
          <pre className="text-xs text-gray-light mt-2 overflow-auto">{error.message}</pre>
        </details>
      </div>
    </div>
  );
}

function Router() {
  const { isAuthenticated, isLoading } = useAuth();

  return (
    <Switch>
      <Route path="/" component={Landing} />
      <Route path="/admin/login" component={AdminLogin} />
      <Route path="/admin" component={Admin} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <ErrorBoundary FallbackComponent={ErrorFallback}>
      <QueryClientProvider client={queryClient}>
        <TooltipProvider>
          <Toaster />
          <Router />
        </TooltipProvider>
      </QueryClientProvider>
    </ErrorBoundary>
  );
}

export default App;
