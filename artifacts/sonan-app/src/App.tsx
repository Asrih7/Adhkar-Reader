import { useEffect } from "react";
import { Switch, Route, Router as WouterRouter } from "wouter";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { initDailyNotifications, isNotificationEnabled } from "@/lib/notificationService";
import { MenuProvider } from "@/contexts/MenuContext";
import ErrorBoundary from "@/components/ErrorBoundary";
import Navigation from "@/components/Navigation";
import TranslationLoadingOverlay from "@/components/TranslationLoadingOverlay";
import NotFound from "@/pages/not-found";
import Home from "@/pages/Home";
import AdhkarList from "@/pages/AdhkarList";
import AdhkarDetail from "@/pages/AdhkarDetail";
import SonanList from "@/pages/SonanList";
import SonanDetail from "@/pages/SonanDetail";
import Advices from "@/pages/Advices";
import AdvicesDetail from "@/pages/AdvicesDetail";
import ForgettableSonan from "@/pages/ForgettableSonan";
import ForgettableSonanDetail from "@/pages/ForgettableSonanDetail";
import SonanWithWife from "@/pages/SonanWithWife";
import SonanWithWifeDetail from "@/pages/SonanWithWifeDetail";
import Tasbeeh from "@/pages/Tasbeeh";
import PrayerTimes from "@/pages/PrayerTimes";
import Qibla from "@/pages/Qibla";
import Favorites from "@/pages/Favorites";
import Notifications from "@/pages/Notifications";
import Settings from "@/pages/Settings";
import Share from "@/pages/Share";
import Quran from "@/pages/Quran";
import QuranAudio from "@/pages/QuranAudio";

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
      <Route path="/advices/:id" component={AdvicesDetail} />
      <Route path="/forgettable" component={ForgettableSonan} />
      <Route path="/forgettable/:id" component={ForgettableSonanDetail} />
      <Route path="/wife" component={SonanWithWife} />
      <Route path="/wife/:id" component={SonanWithWifeDetail} />
      <Route path="/tasbeeh" component={Tasbeeh} />
      <Route path="/prayer-times" component={PrayerTimes} />
      <Route path="/qibla" component={Qibla} />
      <Route path="/favorites" component={Favorites} />
      <Route path="/notifications" component={Notifications} />
      <Route path="/settings" component={Settings} />
      <Route path="/quran" component={Quran} />
      <Route path="/quran-audio" component={QuranAudio} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  useEffect(() => {
    if (isNotificationEnabled()) {
      void initDailyNotifications();
    }
  }, []);

  return (
    <ErrorBoundary>
      <QueryClientProvider client={queryClient}>
        <MenuProvider>
          <TooltipProvider>
            <WouterRouter base={import.meta.env.BASE_URL.replace(/\/$/, "")}>
              {/* Navigation handles mobile (hamburger + bottom nav) and desktop (fixed sidebar) */}
              <Navigation />

              {/* Page content — offset for desktop sidebar */}
              <div className="md:ml-64">
                <Router />
              </div>
            </WouterRouter>
            <Toaster />
            <TranslationLoadingOverlay />
          </TooltipProvider>
        </MenuProvider>
      </QueryClientProvider>
    </ErrorBoundary>
  );
}

export default App;
