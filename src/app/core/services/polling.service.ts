import { Injectable } from '@angular/core';
import { Observable, timer } from 'rxjs';
import { switchMap } from 'rxjs/operators';

@Injectable({ providedIn: 'root' })
export class PollingService {
  create<T>(
    intervalMs: number,
    fetcher: () => Observable<T>,
  ): Observable<T> {
    return timer(0, intervalMs).pipe(switchMap(() => fetcher()));
  }
}