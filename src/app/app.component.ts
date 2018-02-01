﻿import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { DomSanitizer, SafeResourceUrl, SafeUrl } from '@angular/platform-browser';
declare var WifiWizard2:any;
declare var navigator:any;
declare var window:any;

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  public title = 'TeraApp';
  public c: SafeUrl;
  public urlFil: SafeUrl;
  public cFil: SafeUrl;
  ///////////////////////////*STREAM*/
  @ViewChild("stream") stream: ElementRef;
  public url: SafeUrl;
  ///////////////////////////*AUDIO*/
  @ViewChild("audio") audio: ElementRef;
  public audioUrl: SafeUrl;
  //////////////////////////*IMAGEN*/
  @ViewChild("imagen") imagen: ElementRef;
  public imgUrl: SafeUrl;
  /////////////////////////*TEXTO*/
  public textoContenido:string = '';
  ///////////////////////////
  public filter1:boolean = true;
  public filter2:boolean;
  public filter3:boolean;
  public index:number = 0;
  public loop;
  ///////////////////////////

  constructor(private sanitizer: DomSanitizer){
    /*-STREAM DEFAULT-*/
    this.url = this.sanitizer.bypassSecurityTrustStyle('url("http://192.168.1.135:8080/?action=stream") no-repeat center center fixed');
    this.c = this.sanitizer.bypassSecurityTrustStyle('cover');
    /*-AUDIO DEFAULT-*/
    this.audioUrl = this.sanitizer.bypassSecurityTrustUrl('assets/audio/tv_test_01.mp3');
    /*-IMAGEN DEFAULT-*/
    this.imgUrl = this.sanitizer.bypassSecurityTrustUrl('');
  }

  public ngOnInit(): void{
    //Iniciar Dispositivo//
    onLoad();

    function onLoad() {
        document.addEventListener("deviceready", onDeviceReady, false);
    }
    function onDeviceReady() {
        window.powermanagement.acquire(); //WeakLock para que la pantalla no se bloquee
        setInterval(function(){ startWatch(); }, 1000); //Espera un segundo antes de ver el Acc
    }

    //START WiFiWizard
    /*setInterval(function(){
      WifiWizard2.getConnectedSSID(success, fail); //Obtiene una lista de las conexiones WiFi - EN DESARROLLO
    }, 2000);

    function success(a) {
      console.log(a);
    }
    function fail(a){
      alert(a);
    }*/
    //END WifiWizard

    //Accelerometer//
    function startWatch() {
        var options = { frequency: 100 }; //Frecuencia del Acelerómetro, a Mayor numero más lento pero más eficiente - BUSCAR EQUILIBRIO
        navigator.accelerometer.watchAcceleration(onAccelSuccess, onAccError, options); //Watch de la Aceleración
    }

    function onAccelSuccess(acceleration) { //Acelerómetro
      //Calculo rápido para Rotación
      let roll = Math.atan2(acceleration.y, acceleration.z) * 180/Math.PI;

      //Para Debug - Comentar si no se usa
      /*document.getElementById('acc').innerHTML =
                          'Acceleration X: ' + acceleration.x + '<br />' +
                          'Acceleration Y: ' + acceleration.y + '<br />' +
                          'Acceleration Z: ' + acceleration.z + '<br />' +
                          'Roll: '+ roll;*/

      //Compensación de Posicion
      this.stream.nativeElement.style.top = -120+(acceleration.x*12)+"%";
      //document.getElementById('stream').style.top = -120+(acceleration.x*12)+"%";

      if(acceleration.x > 7 && acceleration.z > 0){
        this.stream.nativeElement.style.left = String( (-1*roll/4) - 10 )+"%";
        //document.getElementById('stream').style.left = String( (-1*roll/4) - 10 )+"%";
      }else{
        this.stream.nativeElement.style.left = "-10%";
        //document.getElementById('stream').style.left = "-10%";
      }
    }

    function onAccError(e) {
        alert('Error:'+e);
    }
  }

  public plusImg(): void{
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

  public lessImg(): void{
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

  public filter(n:number, s:string): void{
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
