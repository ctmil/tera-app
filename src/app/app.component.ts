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
  public urlFil: SafeUrl;
  public cFil: SafeUrl;
  ///////////////////////////
  public filter1:boolean;
  public filter2:boolean;
  public filter3:boolean;
  public index:number;
  public loop;
  ///////////////////////////
  public wW: any;
  public wH: any;
  public wifiNet:any;

  constructor(private sanitizer: DomSanitizer){
    this.filter1 = true;
    this.index = 0;

    this.wW = (10*window.innerWidth)/100;
    this.wH = (10*window.innerHeight)/100;
    this.url = this.sanitizer.bypassSecurityTrustStyle('url("http://192.168.1.135:8080/?action=stream") no-repeat center center fixed');
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
    /*setInterval(function(){
      WifiWizard.getScanResults(listPrint, fail); //Obtiene una lista de las conexiones WiFi - EN DESARROLLO
    }, 2000);*/

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
      /*document.getElementById('acc').innerHTML =
                          'Acceleration X: ' + acceleration.x + '<br />' +
                          'Acceleration Y: ' + acceleration.y + '<br />' +
                          'Acceleration Z: ' + acceleration.z + '<br />' +
                          'Roll: '+ roll;*/

      //Compensación de Posicion
      document.getElementById('stream').style.top = -120+(acceleration.x*12)+"%";

      if(acceleration.x > 7 && acceleration.z > 0){
        document.getElementById('stream').style.left = String( (-1*roll/4) - 10 )+"%";
      }else{
        document.getElementById('stream').style.left = "-10%";
      }
    }

    function onAccError(e) {
        alert('Error:'+e);
    }
  }

  plusImg(){
    this.index++;

    if(this.index < 0){
      this.index = 0;
    }else if(this.index > 2){
      this.index = 2;
    }

    if(this.index === 0){
      this.url = this.sanitizer.bypassSecurityTrustStyle('url("http://192.168.1.135:8080/?action=stream") no-repeat center center fixed');
      this.c = this.sanitizer.bypassSecurityTrustStyle('cover');
      this.filter(0, './assets/texture.jpg');
    }else if(this.index === 1){
      this.url = this.sanitizer.bypassSecurityTrustStyle('url("http://192.168.1.135:8081/?action=stream") no-repeat center center fixed');
      this.c = this.sanitizer.bypassSecurityTrustStyle('cover');
      this.filter(1, 'http://192.168.1.160:8090/stream/snapshot.jpeg?delay_s=');
    }else if(this.index === 2){
      this.url = this.sanitizer.bypassSecurityTrustStyle('url("http://192.168.1.181:8080/?action=stream") no-repeat center center fixed');
      this.c = this.sanitizer.bypassSecurityTrustStyle('cover');
      this.filter(2, './assets/none.jpg');
    }

  }

  lessImg(){
    this.index--;

    if(this.index < 0){
      this.index = 0;
    }else if(this.index > 2){
      this.index = 2;
    }

    if(this.index === 0){
      this.url = this.sanitizer.bypassSecurityTrustStyle('url("http://192.168.1.135:8080/?action=stream") no-repeat center center fixed');
      this.c = this.sanitizer.bypassSecurityTrustStyle('cover');
      this.filter(0, './assets/texture.jpg');
    }else if(this.index === 1){
      this.url = this.sanitizer.bypassSecurityTrustStyle('url("http://192.168.1.135:8081/?action=stream") no-repeat center center fixed');
      this.c = this.sanitizer.bypassSecurityTrustStyle('cover');
      this.filter(1, 'http://192.168.1.160:8090/stream/snapshot.jpeg?delay_s=');
    }else if(this.index === 2){
      this.url = this.sanitizer.bypassSecurityTrustStyle('url("http://192.168.1.181:8080/?action=stream") no-repeat center center fixed');
      this.c = this.sanitizer.bypassSecurityTrustStyle('cover');
      this.filter(2, './assets/none.jpg');
    }

  }

  filter(n:number, s:string){
    let _this = this;
    let i = 0;

    if(n == 0){ //Filtro Screen
      clearInterval(this.loop);
      this.filter1 = true;
      this.filter2 = false;
      this.filter3 = false;
      this.urlFil = this.sanitizer.bypassSecurityTrustStyle('url('+s+') no-repeat center center fixed');
      this.cFil = this.sanitizer.bypassSecurityTrustStyle('cover');
    }else if(n == 1){ //Filtro Fantasma (Overlay)
      this.filter1 = false;
      this.filter2 = true;
      this.filter3 = false;
      this.urlFil = this.sanitizer.bypassSecurityTrustStyle('url('+s+i.toString()+') no-repeat center center fixed');
      this.cFil = this.sanitizer.bypassSecurityTrustStyle('cover');

      this.loop = setInterval(function(){
        i+= Math.floor(Math.random() * (1 - -1)) + -1;
        _this.urlFil = _this.sanitizer.bypassSecurityTrustStyle('url('+s+i.toString()+') no-repeat center center fixed');
        _this.cFil = _this.sanitizer.bypassSecurityTrustStyle('cover');
      }, 3000);
    }else if(n == 2){
      clearInterval(this.loop);
      this.filter1 = false;
      this.filter2 = false;
      this.filter3 = true;
      this.urlFil = this.sanitizer.bypassSecurityTrustStyle('url("./assets/none.png") no-repeat center center fixed');
      this.cFil = this.sanitizer.bypassSecurityTrustStyle('cover');
    }
  }
}
