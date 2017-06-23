import { Component, OnInit } from '@angular/core';
import { DomSanitizer, SafeResourceUrl, SafeUrl } from '@angular/platform-browser';
import * as Hammer from 'hammerjs';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'TeraApp';
  public url: SafeUrl;
  public wW: any;
  public wH: any;

  constructor(private sanitizer: DomSanitizer){
    this.wW = (10*window.innerWidth)/100;
    this.wH = (10*window.innerHeight)/100;
    this.url = this.sanitizer.bypassSecurityTrustResourceUrl("http://192.168.1.181:8090/stream");
  }

  ngOnInit(){

    ///////////////////////////////////////////////
    let stage;
    let manager;
    let Pan;
    let Rotate;
    let Pinch;
    let Tap;
    let DoubleTap;

    let s = 'stream';
    stage = document.getElementById(s);

    manager = new Hammer.Manager(stage);

    Pan = new Hammer.Pan();
    Rotate = new Hammer.Rotate();
    Pinch = new Hammer.Pinch();
    Tap = new Hammer.Tap({
      taps: 1
    });
    DoubleTap = new Hammer.Tap({
      event: 'doubletap',
      taps: 2
    });

    Rotate.recognizeWith([Pan]);
    Pinch.recognizeWith([Rotate, Pan]);
    DoubleTap.recognizeWith([Tap]);
    Tap.requireFailure([DoubleTap]);

    manager.add(Pan);
    manager.add(Rotate);
    manager.add(Pinch);
    manager.add(DoubleTap);
    manager.add(Tap);

    //E-MOVE//
    this.eventMove(manager, stage);
    //E-SCALE//
    this.eventScale(manager, stage);

    ////////////////////////////////
  }

  eventMove(manager:any, stage:any){
    let this_ = this;
    let deltaX = 0;
    let deltaY = 0;
    manager.on('panmove', function(e) {
      let dX = deltaX + (e.deltaX);
      let dY = deltaY + (e.deltaY);
      let r = stage.style.transform.match(/rotateZ\((.*deg)\)/g);
      let s = stage.style.transform.match(/scale\((.*)\)/g);
      if(dX > this_.wW){
        dX = this_.wW;
      }
      if(dX < -this_.wW){
        dX = -this_.wW;
      }
      if(dY > this_.wH){
        dY = this_.wH;
      }
      if(dY < -this_.wH){
        dY = -this_.wH;
      }
      stage.style.transform = 'translate('+dX+'px, '+dY+'px) '+r+' '+s+'';
      document.getElementById('debug_px').innerHTML = "X: "+dX.toString();
      document.getElementById('debug_py').innerHTML = "Y: "+dY.toString();
    });
    manager.on('panend', function(e) {
        deltaX = deltaX + e.deltaX;
        deltaY = deltaY + e.deltaY;
    });
  }

  eventScale(manager:any, stage:any){
    let this_ = this;
    let liveScale = 1;
    let currentScale = 1;
    manager.on('pinchmove', function(e) {
      let scale = e.scale * currentScale;
      let t = stage.style.transform.match(/translate\((.*px,.*px)\)/g);
      let r = stage.style.transform.match(/rotateZ\((.*deg)\)/g);
      if(scale <= 1){
        scale = 1;
      }
      if(scale >= 3){
        scale = 3;
      }
      stage.style.transform = ''+t+' '+r+' scale('+scale+')';
      document.getElementById('debug_scale').innerHTML = "S: "+scale.toString();
      this_.wW = ((scale*10)*window.innerWidth)/100;
      this_.wH = ((scale*10)*window.innerHeight)/100;
    });
    manager.on('pinchend', function(e) {
      currentScale = e.scale * currentScale;
      liveScale = currentScale;
    });
  }
}
