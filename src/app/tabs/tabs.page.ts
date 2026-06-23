import { Component, EnvironmentInjector, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonTabs, IonTabBar, IonTabButton, IonIcon, IonLabel } from '@ionic/angular/standalone';
import { Capacitor } from '@capacitor/core';
import { addIcons } from 'ionicons';
import { triangle, ellipse, square, business, people, cube, statsChart } from 'ionicons/icons';

import { LanguageService } from '../services/language.service';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-tabs',
  templateUrl: 'tabs.page.html',
  styleUrls: ['tabs.page.scss'],
  imports: [CommonModule, IonTabs, IonTabBar, IonTabButton, IonIcon, IonLabel],
})
export class TabsPage {
  public environmentInjector = inject(EnvironmentInjector);
  public langService = inject(LanguageService);
  public authService = inject(AuthService);

  constructor() {
    addIcons({ triangle, ellipse, square, business, people, cube, statsChart });
  }

  /** Short labels on phone / native app so tabs don't show "..." */
  tabLabel(fullKey: string, shortKey: string): string {
    const useShort = Capacitor.isNativePlatform() || window.innerWidth < 480;
    return this.langService.t(useShort ? shortKey : fullKey);
  }
}
