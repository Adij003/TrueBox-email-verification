import 'src/global.css';

// ----------------------------------------------------------------------

import { Provider } from 'react-redux';

import { Router } from 'src/routes/sections';

import { ThemeProvider } from 'src/theme/theme-provider';

import { ProgressBar } from 'src/components/progress-bar';
import { MotionLazy } from 'src/components/animate/motion-lazy';
import { SettingsDrawer, defaultSettings, SettingsProvider } from 'src/components/settings';

import { AuthProvider } from 'src/auth/context/jwt';

// eslint-disable-next-line import/no-named-as-default
import store from './redux/store';
import { Snackbar } from './components/snackbar';





// ----------------------------------------------------------------------

export default function App() {

  return (
    <Provider store={store}>
      <AuthProvider>
        <SettingsProvider settings={defaultSettings}>
          <ThemeProvider>
            <Snackbar/>
            <MotionLazy>
              <ProgressBar />
              <SettingsDrawer />
              <Router />
            </MotionLazy>
          </ThemeProvider>
        </SettingsProvider>
      </AuthProvider>
    </Provider>
  );
}
