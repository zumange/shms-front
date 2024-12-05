import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';

export interface SnackbarData {
  message: string;
  duration: number;
}

@Injectable({
  providedIn: 'root',
})
export class SnackbarService {
  private readonly _snackbar = new Subject<SnackbarData | undefined>();

  readonly snackbar$: Observable<SnackbarData | undefined> =
    this._snackbar.asObservable();

  show(data: SnackbarData): void {
    this._snackbar.next(data);
    if (data.duration) setTimeout(() => this.hide(), data.duration);
  }

  hide() {
    this._snackbar.next(undefined);
  }
}
