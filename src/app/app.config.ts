import { ApplicationConfig } from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { initializeApp, provideFirebaseApp } from '@angular/fire/app';
import { getFirestore, provideFirestore } from '@angular/fire/firestore';
import { getDatabase, provideDatabase } from '@angular/fire/database';

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes),
    provideAnimationsAsync(),
    provideFirebaseApp(() =>
      initializeApp({
        projectId: 'ring-of-fire-f1b23',
        appId: '1:1057763318579:web:b54351ecde5e2507583c46',
        storageBucket: 'ring-of-fire-f1b23.appspot.com',
        apiKey: 'AIzaSyBbAovEVep9LfnbrbETbkDnqVilOGo2AoY',
        authDomain: 'ring-of-fire-f1b23.firebaseapp.com',
        messagingSenderId: '1057763318579',
      })
    ),
    provideFirestore(() => getFirestore()),
    provideDatabase(() => getDatabase()),
  ],
};
