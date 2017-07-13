import { Component, OnInit } from '@angular/core';
import { DomSanitizer, SafeResourceUrl, SafeUrl } from '@angular/platform-browser';
//import * as Hammer from 'hammerjs';
declare var WifiWizard:any;
declare var navigator:any;
declare var window:any;

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'TeraApp';
  public url: SafeUrl;
  public c: SafeUrl;
  public wW: any;
  public wH: any;
  public wifiNet:any;

  constructor(private sanitizer: DomSanitizer){
    this.wW = (10*window.innerWidth)/100;
    this.wH = (10*window.innerHeight)/100;
    this.url = this.sanitizer.bypassSecurityTrustStyle('url("http://192.168.1.182:8080/stream/video.mjpeg") no-repeat center center fixed');
    this.c = this.sanitizer.bypassSecurityTrustStyle('cover');
    ///////////////////////
  }

  ngOnInit(){
    //Iniciar Dispositivo//
    onLoad();

    function onLoad() {
        document.addEventListener("deviceready", onDeviceReady, false);
    }
    function onDeviceReady() {
        window.powermanagement.acquire(); //WeakLock para que la pantalla no se bloquee
        setInterval(function(){ startWatch(); }, 1000); //Espera un segundo antes de ver el Acc
    }

    //WiFiWizard//
    setInterval(function(){
      WifiWizard.getScanResults(listPrint, fail); //Obtiene una lista de las conexiones WiFi - EN DESARROLLO
    }, 2000);

    function listPrint(a) {
      this.wifiNet = a;
    }
    function fail(a){
      alert(a);
    }

    //Accelerometer//
    function startWatch() {
        var options = { frequency: 100 }; //Frecuencia del Acelerómetro, a Mayor numero más lento pero más eficiente - BUSCAR EQUILIBRIO
        navigator.accelerometer.watchAcceleration(onAccelSuccess, onAccError, options); //Watch de la Aceleración
    }

    function onAccelSuccess(acceleration) { //Acelerómetro
      //Calculo rápido para Rotación
      var roll = Math.atan2(acceleration.y, acceleration.z) * 180/Math.PI;

      //Para Debug - Comentar si no se usa
      document.getElementById('acc').innerHTML =
                          'Acceleration X: ' + acceleration.x + '<br />' +
                          'Acceleration Y: ' + acceleration.y + '<br />' +
                          'Acceleration Z: ' + acceleration.z + '<br />' +
                          'Roll: '+ roll;

      //Compensación de Posicion
      document.getElementById('stream').style.top = -120+(acceleration.x*12)+"%";

      if(acceleration.x > 7){
        document.getElementById('stream').style.left = String( (-1*roll/4) - 10 )+"%";
      }else{
        document.getElementById('stream').style.left = "-10%";
      }
    }

    function onAccError(e) {
        alert('Error:'+e);
    }

    ///////////////////////////////////////////////
    //Definiciones de HammerJS - SIN USO actual
    /*let stage;
    let manager;
    let Pan;
    let Rotate;
    let Pinch;
    let Tap;
    let DoubleTap;

    stage = document.getElementById('stream');

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
    //this.eventMove(manager, stage);
    //E-SCALE//
    //this.eventScale(manager, stage);*/

    ///////////////////////////////////////////////
  }

  /*eventMove(manager:any, stage:any){
    let this_ = this;
    let deltaX = 0;
    let deltaY = 0;
    manager.on('panmove', function(e) {
      let dX = deltaX + (e.deltaX);
      let dY = deltaY + (e.deltaY);
      let r = document.getElementById('obj').style.transform.match(/rotateZ\((.*deg)\)/g);
      let s = document.getElementById('obj').style.transform.match(/scale\((.*)\)/g);
      //Limitar extremos//
      if(dX > this_.wW){
        dX = this_.wW-0.1;
      }else if(dX < -this_.wW){
        dX = -this_.wW+0.1;
      }
      if(dY > this_.wH){
        dY = this_.wH-0.1;
      }else if(dY < -this_.wH){
        dY = -this_.wH+0.1;
      }
      ///////////////////
      document.getElementById('obj').style.transform = 'translate('+dX+'px, '+dY+'px) '+r+' '+s+'';
      //document.getElementById('debug_px').innerHTML = "X: "+dX.toString();
      //document.getElementById('debug_py').innerHTML = "Y: "+dY.toString();
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
      let t = document.getElementById('obj').style.transform.match(/translate\((.*px,.*px)\)/g);
      let r = document.getElementById('obj').style.transform.match(/rotateZ\((.*deg)\)/g);
      //Limitar Escala//
      if(scale <= 1){
        scale = 1;
      }
      if(scale >= 1.5){
        scale = 1.5;
      }
      /////////////////
      document.getElementById('obj').style.transform = ''+t+' '+r+' scale('+scale+')';
      //document.getElementById('debug_scale').innerHTML = "S: "+scale.toString();
      this_.wW = ((scale*10)*window.innerWidth)/100;
      this_.wH = ((scale*10)*window.innerHeight)/100;
    });
    manager.on('pinchend', function(e) {
      currentScale = e.scale * currentScale;
      liveScale = currentScale;
    });
  }*/
}
