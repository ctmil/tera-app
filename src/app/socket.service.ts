import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { Socket } from 'ng-socket-io';
import 'rxjs/add/operator/map';

@Injectable()
export class SocketService {

  constructor(private socket: Socket){}

  getMessage() {
      return this.socket
          .fromEvent<any>("msg")
          .map(data => data.msg);
  }

  sendMessage(msg: string) {
      this.socket
          .emit("msg", msg);
  }
}
