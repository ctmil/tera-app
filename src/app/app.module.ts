import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { SocketIoModule, SocketIoConfig } from 'ng-socket-io';

const config: SocketIoConfig = { url: 'http://192.168.0.125:8988', options: {} };

import { AppComponent } from './app.component';
import { ToolsService } from './tools.service';
import { DeviceService } from './device.service';
import { SocketService } from './socket.service';

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpModule,
    SocketIoModule.forRoot(config)
  ],
  providers: [ToolsService, DeviceService, SocketService],
  bootstrap: [AppComponent]
})
export class AppModule { }
