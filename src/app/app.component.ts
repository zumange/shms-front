import { Component } from '@angular/core';
import { DeviceManagementComponent } from './components/device-management.component';
import { SnackbarComponent } from './components/snackbar.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [DeviceManagementComponent, SnackbarComponent],
  template: `
    <div class="h-screen w-screen flex items-center justify-center">
      <app-device-management />
    </div>
    <app-snackbar />
  `,
  styles: [],
})
export class AppComponent {
  title = 'shms-front';
}
