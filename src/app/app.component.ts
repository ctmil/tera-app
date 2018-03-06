﻿import { Component, OnInit, ViewChild, ElementRef, Renderer2 } from '@angular/core';
import { DomSanitizer, SafeResourceUrl, SafeUrl } from '@angular/platform-browser';
import { DeviceService } from './device.service';
import { SocketService } from './socket.service';
declare var WifiWizard:any;
declare var navigator:any;
declare var window:any;
declare var cordova:any;

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  providers : [SocketService]
})
export class AppComponent {
  public title = 'TeraApp';
  public c: SafeUrl;
  public urlFil: SafeUrl;
  public cFil: SafeUrl;

  ///////////////////////////*STREAM*/
  @ViewChild("stream") stream: ElementRef;
  public url: SafeUrl;
  public showStream:boolean = false;
  public intervalStream: any;
  ///////////////////////////*AUDIO*/
  @ViewChild("audio") audio: ElementRef;
  public audioUrl: SafeUrl;
  public audioLoop: any;
  //////////////////////////*IMAGEN*/
  @ViewChild("imagen") imagen: ElementRef;
  public imgUrl: SafeUrl;
  public showImg:boolean = false;
  //////////////////////////*VIDEO*/
  @ViewChild("video") video: ElementRef;
  public videoUrl: SafeUrl;
  public showVideo: boolean = false;
  /////////////////////////*TEXTO*/
  public textoContenido:string = '';
  public showText:boolean = false;
  /////////////////////////*BEACON*/
	public uuid:string = '20cae8a0-a9cf-11e3-a5e2-0800200c9a66';
  public identifier:string = 'TeraBeacon';
  public beaconScene:any = [100, 100, 100, 100, 100, 100];
  public beaconState:string = 'YB';
  ////////////////////////*WIFI*/
  public wifi:any;
  ///////////////////////*SOCKET-IO*/
  public socketMsg:any;
  public pSocketMsg:any;
  public grupo:string = "grupo0";
  //////////////////////*CONTROL*/
  @ViewChild("arrows") arrows:ElementRef;
  @ViewChild("ipBut") ipBut:ElementRef;
  public showArrow: boolean = true;

  //////////////////////////////////////
  /*ESCENAS*/
  public nEscena:number = 0;
  public idnum:string;

  ////////////////////////*DEBUG*/
  @ViewChild("ip") ip: ElementRef;
  @ViewChild("port") port: ElementRef;
  public toggle:boolean = false;
  ///////////////////////////
  public index:number = 1;
  public gUrl:string = "192.168.0.125:80";
  public ipCurrent:string = "192.168.0.125";
  public portCurrent:string = "80";
  ///////////////////////////LISTENER//
  public audioLoopListener: () => void;
  public videoLoopListener: () => void;

  constructor(private sanitizer: DomSanitizer, private renderer: Renderer2, public device: DeviceService, public socket: SocketService){
    /*-IMAGEN DEFAULT-*/
    this.imgUrl = this.sanitizer.bypassSecurityTrustUrl('assets/none.png');  //Default Image
  }

  public ngOnInit(): void{
    //Iniciar Dispositivo//
    let _this = this;
    onLoad();

    function onLoad() {
        document.addEventListener("deviceready", onDeviceReady, false);
    }

    function onDeviceReady() {
        //_this.loadIP();  //DEBUG
        window.powermanagement.acquire(); //WeakLock para que la pantalla no se bloquee
        setTimeout(function(){
          _this.device.startWatchAcc(_this.stream, _this.video, _this.imagen); //Cargar Acelerometro de Device

          let beaconRegion = new cordova.plugins.locationManager.BeaconRegion(_this.identifier, _this.uuid);
    	    let delegate = new cordova.plugins.locationManager.Delegate();

          delegate.didDetermineStateForRegion = function (pluginResult) {
            console.log("State:", pluginResult);
          };

          delegate.didStartMonitoringForRegion = function (pluginResult) {
            console.log("Monitoring:", pluginResult);
          };

    	    delegate.didRangeBeaconsInRegion = function (pluginResult) {
              let dist = 100;
              let index = 1;

    	        let beacons = pluginResult.beacons;
              if(beacons.length > 0){ //START BEACONS
                for (let i = 0; i < beacons.length; i++) {
                  let realDis = 100;
                  if(beacons[i].accuracy == -1){
                    realDis = 100;
                  }else{
                    realDis = beacons[i].accuracy;
                  }
                  if(beacons[i].major == 112 && beacons[i].minor == 18102){
                    _this.beaconScene[0] = realDis;
                  }else if(beacons[i].major == 158 && beacons[i].minor == 63123){
                    _this.beaconScene[1] = realDis;
                  }else if(beacons[i].major == 39 && beacons[i].minor == 20191){
                    _this.beaconScene[2] = realDis;
                  }else if(beacons[i].major == 39 && beacons[i].minor == 21900){
                    _this.beaconScene[3] = realDis;
                  }else if(beacons[i].major == 39 && beacons[i].minor == 20800){
                    _this.beaconScene[4] = realDis;
                  }else if(beacons[i].major == 112 && beacons[i].minor == 18157){
                    _this.beaconScene[5] = realDis;
                  }
                }
                for (let i = 0; i < _this.beaconScene.length; i++) {
                  if(_this.beaconScene[i] < dist){
                    dist = _this.beaconScene[i];
                    index = i;
                  }
                }
              }//FIN BEACONS
    	    };

    	    cordova.plugins.locationManager.setDelegate(delegate);

          cordova.plugins.locationManager.requestWhenInUseAuthorization();

    	    cordova.plugins.locationManager.startRangingBeaconsInRegion(beaconRegion)
    	        .fail(function(e) {alert(e);_this.beaconState='NB';})
    	        .done();
        }, 1000); //Espera un segundo antes de ver el Acc y iBeacons
    }

    //START WiFiWizard
    setInterval(function(){
      WifiWizard.getCurrentSSID(
      function success(a) {
        console.log(a);
        let wifi = a.replace(/["']/g, "");
        if(wifi == "TERAVISION"){
          console.log("Ok");
        }else if(wifi == "TERAVISION2"){
          console.log("Ok");
        }else if(wifi == "TERAVISION3"){
          console.log("Ok");
        }else if(wifi == "TERAVISION4"){
          console.log("Ok");
        }else{
          alert("Tiene que estar conectado a la Red TERAVISION");
        }
      },
      function fail(a){
        alert("No está conectado a una Red");
        console.log(a);
      });
    }, 5000);
    //END WifiWizard*/
    //////////////////////////////////////////////////////////////

    this.socket.getMessage("getid").subscribe(msg => {
      if(window.localStorage){
        if(window.localStorage.getItem("iden")){
          _this.socket.sendMessage("getid", window.localStorage.getItem("iden"));
        }else{
          _this.socket.sendMessage("getid", "singrupo");
        }
      }else{
        if(_this.getCookie('iden')){
          _this.socket.sendMessage("getid", _this.getCookie('iden'));
        }else{
          _this.setCookie('iden','singrupo',2);
        }
      }
    });
    this.socket.getMessage("setid").subscribe(msg => {
      if(window.localStorage){
        window.localStorage.setItem("iden", JSON.stringify(msg));
      }else{
        _this.setCookie('iden',JSON.stringify(msg),2);
      }
    });
    this.socket.getMessage("escena").subscribe(msg => {
      if(msg == "escena1"){
        _this.escena1();
      }else if(msg == "escena2"){
        _this.escena2();
      }else if(msg == "escena3"){
        _this.escena3();
      }else if(msg == "escena4"){
        _this.escena4();
      }else if(msg == "escena5"){
        _this.escena5();
      }else if(msg == "escena6"){
        _this.escena6();
      }else if(msg == "escena7"){
        _this.escena7();
      }
    });
    this.escena0(); // Iniciar Escenas con la Escena Preparacion
  }

  public ngDoCheck(): void{
    if(this.socketMsg !== this.pSocketMsg){
      //Actualizar solo cuando el valor de socketMsg sea nuevo
      //Cambio de Escenas
      if(this.socketMsg === "escena1"){this.escena1();}
      if(this.socketMsg === "escena2"){this.escena2();}
      if(this.socketMsg === "escena3"){this.escena3();}
      if(this.socketMsg === "escena4"){this.escena4();}
      if(this.socketMsg === "escena5"){this.escena5();}
      if(this.socketMsg === "escena6"){this.escena6();}
      if(this.socketMsg === "escena7"){this.escena7();}
      //Grupo
      if(this.socketMsg === "group1"){this.grupo="grupo1";}
      if(this.socketMsg === "group2"){this.grupo="grupo2";}
      if(this.socketMsg === "group3"){this.grupo="grupo3";}
      if(this.socketMsg === "group4"){this.grupo="grupo4";}
      if(this.socketMsg === "group5"){this.grupo="grupo5";}
      if(this.socketMsg === "group6"){this.grupo="grupo6";}
    }
    //Enviar mensaje de Status
    this.socket.sendMessage("status",""+this.grupo+","+this.nEscena+","+this.beaconState+","+
    this.beaconScene[0]+","+this.beaconScene[1]+","+this.beaconScene[2]+","+
    this.beaconScene[3]+","+this.beaconScene[4]+","+this.beaconScene[5]);
    this.pSocketMsg = this.socketMsg; //Guardar dato anterior de SocketIO
  }

  /* Funciones Cookie */
  public setCookie(name,value,days): void {
    var expires = "";
    if (days) {
        var date = new Date();
        date.setTime(date.getTime() + (days*24*60*60*1000));
        expires = "; expires=" + date.toUTCString();
    }
    document.cookie = name + "=" + (value || "")  + expires + "; path=/";
  }
  public getCookie(name): any {
      var nameEQ = name + "=";
      var ca = document.cookie.split(';');
      for(var i=0;i < ca.length;i++) {
          var c = ca[i];
          while (c.charAt(0)==' ') c = c.substring(1,c.length);
          if (c.indexOf(nameEQ) == 0) return c.substring(nameEQ.length,c.length);
      }
      return null;
  }

  /*Funciones Tera*/

  public createStream(): void{
    let _this = this;
    this.showStream = false;
    if(this.intervalStream){
      clearInterval(this.intervalStream);
    }

    _this.url = null;
    _this.c = null;
    _this.url = _this.sanitizer.bypassSecurityTrustStyle('url(http://'+_this.gUrl+'/e'+_this.nEscena+'cam'+_this.index+') no-repeat center center fixed');
    _this.c = _this.sanitizer.bypassSecurityTrustStyle('cover');

    this.intervalStream = setInterval(function() {
      _this.url = null;
      _this.c = null;
      _this.url = _this.sanitizer.bypassSecurityTrustStyle('url(http://'+_this.gUrl+'/e'+_this.nEscena+'cam'+_this.index+') no-repeat center center fixed');
      _this.c = _this.sanitizer.bypassSecurityTrustStyle('cover');
    }, 10000);
  }

  public loopAudio(n:number, s:string): void{
    if(this.audioLoopListener){
      this.audioLoopListener();
    }
    this.audioUrl = this.sanitizer.bypassSecurityTrustUrl('http://'+this.gUrl+s);
    this.audio.nativeElement.autoplay = true;
    this.audio.nativeElement.play();
    let loopLimit = n;
    let loopCounter = 0;
    this.audioLoopListener = this.renderer.listen(this.audio.nativeElement, "ended", () => {
      if (loopCounter < loopLimit){
          this.audio.nativeElement.currentTime = 0;
          this.audio.nativeElement.play();
          loopCounter++;
      }else{
        this.audio.nativeElement.autoplay = false;
        this.audioLoopListener();
      }
    });
  }

  public makeVideo(s:string){
    if(this.videoLoopListener){
      this.videoLoopListener();
    }
    this.videoUrl = this.sanitizer.bypassSecurityTrustUrl('http://'+this.gUrl+s);
    this.video.nativeElement.autoplay = true;
    this.video.nativeElement.play();

    this.videoLoopListener = this.renderer.listen(this.video.nativeElement, "ended", () => {
        this.showVideo = true;
        this.showStream = false;
        this.createStream();
        this.video.nativeElement.currentTime = 0;
        this.video.nativeElement.pause();
        this.video.nativeElement.autoplay = false;
        this.videoLoopListener();
    });
  }

  public getRandom(min, max): number {
    return Math.floor(Math.random() * (max - min)) + min;
  }

  //DEBUG//
  public changeIP(): void{
    this.ipCurrent = this.ip.nativeElement.value;
    this.portCurrent = this.port.nativeElement.value;
    this.gUrl = this.ipCurrent+":"+this.portCurrent;
    this.toggle = false;

    this.createStream();

    window.localStorage.setItem("ip", this.ipCurrent); //Save IP
    window.localStorage.setItem("port", this.portCurrent); //Save Port
  }
  public loadIP(): void{
    if(window.localStorage){
      this.gUrl = window.localStorage.getItem("ip")+window.localStorage.getItem("port"); //Get Last IP
    }else{
      this.gUrl = "192.168.0.102:80";
    }
    this.ipCurrent = window.localStorage.getItem("ip").replace(/:.*$/,"");
    this.portCurrent = window.localStorage.getItem("port");

    this.createStream();
  }//*/
  //////////////////////////////////////////////////////////////////////////////

  public switchStream(n:number): void{
    this.index+=n;

    if(this.index < 1){
      this.index = 1;
    }else if(this.index > 3){
      this.index = 3;
    }

    if(this.nEscena == 1){
      this.index = 1;
    }else if(this.nEscena == 2){
      this.index = 1;
    }else if(this.nEscena == 3){
      this.index = 1;
    }else if(this.nEscena == 4){

    }else if(this.nEscena == 5){
      this.index = 1;
    }else if(this.nEscena == 6){
      if(this.index == 3){
        this.index = 2;
      }
    }else if(this.nEscena == 7){
      this.index = 1;
    }

    this.createStream();
  }

  //////////////////////////////////////////////////////////////
  //************************ESCENAS***************************//
  //////////////////////////////////////////////////////////////

  public escena0(): void{
    this.nEscena = 0;
    this.showStream = true;
    this.showVideo = true;
    this.showImg = true;
    //Texto
    this.textoContenido = "TeraVision";
  }
  public escena1(): void{
    //Escena
    let this_ = this;
    this.nEscena = 1;
    this.index = 1;
    this.showArrow = true;
    clearTimeout(this.audioLoop);
    this.showStream = true;
    this.showVideo = false;
    this.showImg = true;
    this.loopAudio(0, '/none.mp3');
    this.makeVideo("/e1video1.mp4");
    //Texto
    this.textoContenido = "";
  }
  public escena2(): void{
    this.nEscena = 2;
    this.index = 1;
    this.showArrow = true;
    this.showVideo = true;
    this.showImg = true;
    clearTimeout(this.audioLoop);
    this.makeVideo("/none.mp4");
    //Cam
    this.createStream();
    //Audio
    this.loopAudio(0, '/e2audio1.mp3');
    //Texto
    this.textoContenido = "";
  }
  public escena3(): void{
    //Escena
    let this_ = this;
    this.nEscena = 3;
    this.index = 1;
    this.showArrow = true;
    this.showVideo = true;
    this.showImg = true;
    clearTimeout(this.audioLoop);
    this.makeVideo("/none.mp4");
    //Cam
    this.createStream();
    //Audio
    this.loopAudio(0, '/e3audio2.mp3');
    //Texto
    this.textoContenido = "";
  }
  public escena4(): void{
    //Escena
    let this_ = this;
    this.nEscena = 4;
    this.index = 1;
    this.showArrow = false;
    this.showVideo = true;
    this.showImg = true;
    clearTimeout(this.audioLoop);
    this.makeVideo("/none.mp4");
    //Cam
    this.createStream();
    //Audio
    this.loopAudio(9999, '/e4audio'+this.getRandom(1, 5)+'.mp3');
    this.audioLoop = setTimeout(function(){if(this_.nEscena == 4){this_.loopAudio(9999, '/e4audio'+this_.getRandom(5, 9)+'.mp3');}}, 60000);
    this.audioLoop = setTimeout(function(){
      if(this_.getRandom(1, 10) < 2){
        this_.loopAudio(9999, '/none.mp3');
      }
    }, 165000);
    this.audioLoop = setTimeout(function(){if(this_.nEscena == 4){this_.loopAudio(9999, '/e4audio13.mp3');}}, 240000);
    this.audioLoop = setTimeout(function(){if(this_.nEscena == 4){this_.loopAudio(9999, '/e4audio'+this_.getRandom(9, 13)+'.mp3');}}, 360000);
    //Texto
    this.textoContenido = "";
  }
  public escena5(): void{
    //Escena
    let this_ = this;
    this.nEscena = 5;
    this.index = 1;
    this.showArrow = true;
    this.showStream = true;
    this.showVideo = false;
    this.showImg = true;
    clearTimeout(this.audioLoop);
    //Cam
    //this.createStream();
    this.showVideo = false;
    this.loopAudio(0, '/none.mp3');
    this.makeVideo("/e5video1.mp4");
    //Texto
    this.textoContenido = "";
  }
  public escena6(): void{
    //Escena
    let this_ = this;
    this.nEscena = 6;
    this.index = 1;
    this.showArrow = false;
    this.showVideo = true;
    this.showImg = true;
    clearTimeout(this.audioLoop);
    this.makeVideo("/none.mp4");
    //Cam
    this.createStream();
    //Audio
    this.loopAudio(99, '/e6audio'+this.getRandom(1, 4)+'.mp3');
    //Texto
    this.textoContenido = "";
  }
  public escena7(): void{
    //Escena
    let this_ = this;
    this.nEscena = 7;
    this.index = 1;
    this.showArrow = true;
    this.showVideo = true;
    this.showStream = true;
    this.showImg = false;
    clearTimeout(this.audioLoop);
    this.makeVideo("/none.mp4");
    //Imagen
    this.imgUrl = this.sanitizer.bypassSecurityTrustUrl('http://'+this.gUrl+'/e7img1.jpg');
    //Audio
    this.loopAudio(99, '/e7audio'+this.getRandom(1, 6)+'.mp3');
    this.audioLoop = setTimeout(function(){this_.loopAudio(0, '/none.mp3');}, 180000);
    setTimeout(function(){this.imgUrl = this.sanitizer.bypassSecurityTrustUrl('/assets/none.png');}, 60000*8.5);
    //Texto
    this.textoContenido = "";
  }
}
