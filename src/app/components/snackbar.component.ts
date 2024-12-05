import { AsyncPipe } from '@angular/common';
import { Component, inject } from '@angular/core';
import { SnackbarService } from '../services/snackbar-service.service';

@Component({
  selector: 'app-snackbar',
  standalone: true,
  imports: [AsyncPipe],
  template: `
    @if(snackbarService.snackbar$ | async; as snackbarData) {
    <div class="fixed bottom-5 left-0 right-0 z-40">
      <div
        class="alert alert-success mx-auto flex w-auto max-w-md animate-slideInBottom justify-between px-2 py-4 shadow"
      >
        <div class="flex gap-2 pl-3">
          <span class="material-symbols-outlined flex items-center">
            done
          </span>
          <span>{{ snackbarData?.message }}</span>
        </div>
        <div>
          <button class="pr-2 underline" (click)="snackbarService.hide()">
            close
          </button>
        </div>
      </div>
    </div>
    }
  `,
})
export class SnackbarComponent {
  snackbarService = inject(SnackbarService);
}
