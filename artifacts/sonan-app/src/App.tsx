import { Switch, Route, Router as WouterRouter } from "wouter";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/not-found";
import Home from "@/pages/Home";
import AdhkarList from "@/pages/AdhkarList";
import AdhkarDetail from "@/pages/AdhkarDetail";
import SonanList from "@/pages/SonanList";
import SonanDetail from "@/pages/SonanDetail";
import Advices from "@/pages/Advices";
import ForgettableSonan from "@/pages/ForgettableSonan";
import SonanWithWife from "@/pages/SonanWithWife";

const queryClient = new QueryClient();

function Router() {
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/adhkar" component={AdhkarList} />
      <Route path="/adhkar/:id" component={AdhkarDetail} />
      <Route path="/sonan" component={SonanList} />
      <Route path="/sonan/:id" component={SonanDetail} />
      <Route path="/advices" component={Advices} />
      <Route path="/forgettable" component={ForgettableSonan} />
      <Route path="/wife" component={SonanWithWife} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <WouterRouter base={import.meta.env.BASE_URL.replace(/\/$/, "")}>
          <Router />
        </WouterRouter>
        <Toaster />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
