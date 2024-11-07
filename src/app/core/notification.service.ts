import { Injectable } from '@angular/core';
import { ToastrService } from 'ngx-toastr';

const DEFAULT_MS = 3000;
const CONFIG = {
  positionClass: 'toast-bottom-center',
};

@Injectable({
  providedIn: 'root',
})
export class NotificationService {
  constructor(private _toastr: ToastrService) {}

  public show(message: string, title?: string, timeOut: number = DEFAULT_MS) {
    this._toastr.show(message, title, {
      ...CONFIG,
      timeOut,
    });
  }

  public success(
    message: string,
    title?: string,
    timeOut: number = DEFAULT_MS
  ) {
    this._toastr.success(message, title, {
      ...CONFIG,
      timeOut,
    });
  }

  public warning(
    message: string,
    title?: string,
    timeOut: number = DEFAULT_MS
  ) {
    this._toastr.warning(message, title, {
      ...CONFIG,
      timeOut,
    });
  }

  public error(message: string, title?: string, timeOut: number = DEFAULT_MS) {
    this._toastr.error(message, title, {
      ...CONFIG,
      timeOut,
    });
  }

  public info(message: string, title?: string, timeOut: number = DEFAULT_MS) {
    this._toastr.info(message, title, {
      ...CONFIG,
      timeOut,
    });
  }
}
