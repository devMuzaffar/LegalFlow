/*
   App Config
*/

import { ApplicationConfig, provideBrowserGlobalErrorListeners } from '@angular/core';
import { provideRouter } from '@angular/router';
import { definePreset } from '@primeuix/themes';
import Aura from '@primeuix/themes/aura';
import { providePrimeNG } from 'primeng/config';
import { routes } from './app.routes';

/**
 * Aura with p-card's radius aligned to `content.borderRadius` (6px), so cards
 * match the `rounded-border` used by the dashboard widgets.
 */
const LegalFlowPreset = definePreset(Aura, {
  components: {
    card: {
      root: {
        borderRadius: '{border.radius.md}',
      },
    },
    tag: {
      root: {
        borderRadius: '{border.radius.md}',
      }
    }
  },
});

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideRouter(routes),
    providePrimeNG({
      ripple: true,
      theme: {
        preset: LegalFlowPreset,
        options: {
          darkModeSelector: 'none',
        },
      },
      license:
        'eyJpZCI6ImU0ZDQ3M2E1LWE1YTAtNGExNC1iNjZhLTgyZWI5OTMxMDM1YyIsInByb2R1Y3QiOiJwcmltZXVpIiwidGllciI6ImNvbW11bml0eSIsInR5cGUiOiJkZXYiLCJpYXQiOjE3OTQ0MjY1NzcsImV4cCI6MTgyNTk2MjU3N30.1q3pAdeE1lK0bRbGOKJwtuLcTcpRrwXexV0unwU55uJylW7IddiKkpSIevFJCjcg1DomXCt1sSCCyJpsj5fABw',
    }),
  ],
};
