import {Injectable} from '@angular/core';
import {BehaviorSubject, Observable} from 'rxjs';

const OPEN = true;
const CLOSE = false;

@Injectable({
  providedIn: 'root'
})
export class ModalService {
    private state = new BehaviorSubject(CLOSE);

  watch(): Observable<boolean> {
    return this.state.asObservable();
  }

  open() {
    this.state.next(OPEN);
  }

  close() {
    this.state.next(CLOSE);
  }
}
