import { ApplicationConfig, provideBrowserGlobalErrorListeners } from '@angular/core';
import { provideRouter } from '@angular/router';
import Aura from '@primeuix/themes/aura';
import { routes } from './app.routes';
import { providePrimeNG } from 'primeng/config';

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideRouter(routes),
    providePrimeNG({
      theme: {
        preset: Aura,
        options: {
          darkModeSelector: 'none',
        }
      },
      license: 'eyJpZCI6ImU0ZDQ3M2E1LWE1YTAtNGExNC1iNjZhLTgyZWI5OTMxMDM1YyIsInByb2R1Y3QiOiJwcmltZXVpIiwidGllciI6ImNvbW11bml0eSIsInR5cGUiOiJkZXYiLCJpYXQiOjE3OTQ0MjY1NzcsImV4cCI6MTgyNTk2MjU3N30.1q3pAdeE1lK0bRbGOKJwtuLcTcpRrwXexV0unwU55uJylW7IddiKkpSIevFJCjcg1DomXCt1sSCCyJpsj5fABw'
    })
  ]
};
