import { Component, inject, OnInit } from '@angular/core';
import { IonApp, IonRouterOutlet } from '@ionic/angular/standalone';
import { Capacitor } from '@capacitor/core';
import { App } from '@capacitor/app';
import { AppUpdateService } from './services/app-update.service';
import { AppUpdateBannerComponent } from './components/app-update-banner.component';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  imports: [IonApp, IonRouterOutlet, AppUpdateBannerComponent],
})
export class AppComponent implements OnInit {
  private updateService = inject(AppUpdateService);

  ngOnInit() {
    this.updateService.checkForUpdate();

    if (Capacitor.isNativePlatform()) {
      App.addListener('appStateChange', ({ isActive }) => {
        if (isActive) {
          this.updateService.checkForUpdate();
        }
      });
    }
  }
}
