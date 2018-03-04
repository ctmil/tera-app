import { Component, OnInit, ViewChild, ElementRef, Renderer2 } from '@angular/core';
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

  //////////////////////////////////////
  /*ESCENAS*/
  public sce01:boolean = false;
  public sce02:boolean = false;
  public sce03:boolean = false;
  public sce04:boolean = false;
  public sce05:boolean = false;
  public sce06:boolean = false;
  public nEscena:number = 1;

  ////////////////////////*DEBUG*/
  @ViewChild("ip") ip: ElementRef;
  @ViewChild("port") port: ElementRef;
  public toggle:boolean = false;
  ///////////////////////////
  public index:number = 1;
  public loop;
  public gUrl:string = "192.168.0.125:80";
  public ipCurrent:string = "192.168.0.125";
  public portCurrent:string = "80";
  ///////////////////////////LISTENER//
  public audioLoopListener: () => void;
  public videoLoopListener: () => void;
  //////////////////////////*TIMERS*/
  public timer01:any;
  public timer02:any;
  public timer03:any;
  public timer04:any;
  public timer05:any;
  public timer06:any;
  public allTimers:any = [1, 600000, 600000*2, 600000*3, 600000*4, 600000*5];

  constructor(private sanitizer: DomSanitizer, private renderer: Renderer2, public device: DeviceService, public socket: SocketService){
    /*-IMAGEN DEFAULT-*/
    this.imgUrl = this.sanitizer.bypassSecurityTrustUrl('assets/none.png');  //Default Image
  }

  public ngOnInit(): void{
    //Iniciar Dispositivo//
    let _this = this;
    onLoad();
    //SocketIO//
    _this.socket.getMessage().subscribe(msg => {
      _this.socketMsg = msg;  //Recibir datos de SocketIO - Corre en Background
    });

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
              let minDist = 1;
              if(cordova.platformId === 'android'){
                minDist = 1.1;
              }else{
                minDist = 3;
              }
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
                //CAMBIAR ESCENAS
                /*if(_this.beaconScene[index] <= minDist && _this.beaconScene[index] !== -1){  //Truco para no detectar Beacon en -1
                  if(index === 0 && _this.sce01 !== true){  //Escena 1
                    _this.escena1();
                  }else if(index === 1 && _this.sce02 !== true && _this.nEscena == 1){  //Escena 2
                    _this.escena2();
                  }else if(index === 2 && _this.sce03 !== true && _this.nEscena == 2){ //Escena 3
                    _this.escena3();
                  }else if(index === 3 && _this.sce04 !== true && _this.nEscena == 3){ //Escena 4
                    _this.escena4();
                  }else if(index === 4 && _this.sce05 !== true && _this.nEscena == 4){ //Escena 5
                    _this.escena5();
                  }else if(index === 5 && _this.sce06 !== true && _this.nEscena == 5){ //Escena 6
                    _this.escena6();
                  }
                }*/
                //FIN CAMBIAR ESCENAS
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
    /*setInterval(function(){
      WifiWizard.getCurrentSSID(
      function success(a) {
        _this.wifi = a;
      },
      function fail(a){
        alert("No está conectado a una Red");
        console.log(a);
      });
    }, 2000);
    //END WifiWizard*/
    //////////////////////////////////////////////////////////////
    this.escena0(); // Iniciar Escenas con la Escena Preparacion
    //this.delayScenes(); //Delay Escenas
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
    this.socket.sendMessage(""+this.grupo+","+this.nEscena+","+this.beaconState+","+
    this.beaconScene[0]+","+this.beaconScene[1]+","+this.beaconScene[2]+","+
    this.beaconScene[3]+","+this.beaconScene[4]+","+this.beaconScene[5]);
    this.pSocketMsg = this.socketMsg; //Guardar dato anterior de SocketIO
  }

  /*Funciones Tera*/
  public fadeConfig(){
    let _this = this;
    this.arrows.nativeElement.style.animation = "none";
    this.ipBut.nativeElement.style.animation = "none";

    setTimeout(function(){
      _this.arrows.nativeElement.style.animation = "";
      _this.ipBut.nativeElement.style.animation = "";
    }, 10);
  }

  public delayScenes(){
    let this_ = this;
    this.timer01 = setTimeout(function(){
      if(this_.sce01 !== true){this_.escena1();}
    }, this.allTimers[0]);
    this.timer02 = setTimeout(function(){
      clearTimeout(this_.timer01);
      if(this_.sce02 !== true){this_.escena2();}
    }, this.allTimers[1]);
    this.timer03 = setTimeout(function(){
      clearTimeout(this_.timer02);
      if(this_.sce03 !== true){this_.escena3();}
    }, this.allTimers[2]);
    this.timer04 = setTimeout(function(){
      clearTimeout(this_.timer03);
      if(this_.sce04 !== true){this_.escena4();}
    }, this.allTimers[3]);
    this.timer05 = setTimeout(function(){
      clearTimeout(this_.timer04);
      if(this_.sce05 !== true){this_.escena5();}
    }, this.allTimers[4]);
    this.timer06 = setTimeout(function(){
      clearTimeout(this_.timer05);
      if(this_.sce06 !== true){this_.escena6();}
    }, this.allTimers[5]);
  }

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
        this.video.nativeElement.currentTime = 0;
        this.video.nativeElement.pause();
        this.video.nativeElement.autoplay = false;
        this.videoLoopListener();
    });
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
    clearTimeout(this.audioLoop);
    this.showStream = true;
    this.showVideo = false;
    this.showImg = true;
    this.loopAudio(0, '/none.mp3');
    this.makeVideo("/e1video1.mp4");
    //Texto
    this.textoContenido = "Escena 1";
  }
  public escena2(): void{
    this.nEscena = 2;
    this.index = 1;
    this.showVideo = true;
    this.showImg = true;
    clearTimeout(this.audioLoop);
    this.makeVideo("/none.mp4");
    //Cam
    this.createStream();
    //Audio
    this.loopAudio(0, '/e2audio2.mp3');
    //Texto
    this.textoContenido = "Escena 2";
  }
  public escena3(): void{
    //Escena
    let this_ = this;
    this.nEscena = 3;
    this.index = 1;
    this.showVideo = true;
    this.showImg = true;
    clearTimeout(this.audioLoop);
    this.makeVideo("/none.mp4");
    //Cam
    this.createStream();
    //Audio
    this.loopAudio(0, '/e3audio1.mp3');
    //Texto
    this.textoContenido = "Escena 3";
  }
  public escena4(): void{
    //Escena
    let this_ = this;
    this.nEscena = 4;
    this.index = 1;
    this.showVideo = true;
    this.showImg = true;
    clearTimeout(this.audioLoop);
    this.makeVideo("/none.mp4");
    //Cam
    this.createStream();
    //Audio
    /*this.loopAudio(6, '/e4audio1.mp3');
    this.audioLoop = setTimeout(function(){this_.loopAudio(6, '/e4audio2.mp3');}, 60000);
    this.audioLoop = setTimeout(function(){this_.loopAudio(6, '/e4audio3.mp3');}, 120000);
    this.audioLoop = setTimeout(function(){this_.loopAudio(6, '/e4audio4.mp3');}, 180000);
    this.audioLoop = setTimeout(function(){this_.loopAudio(10, '/e4audio5.mp3');}, 240000);*/
    //Texto
    this.textoContenido = "Escena 4";
  }
  public escena5(): void{
    //Escena
    let this_ = this;
    this.nEscena = 5;
    this.index = 1;
    this.showVideo = false;
    this.showImg = true;
    clearTimeout(this.audioLoop);
    //Cam
    this.createStream();
    this.showVideo = false;
    this.loopAudio(0, '/none.mp3');
    this.makeVideo("/e5video1.mp4");
    //Texto
    this.textoContenido = "Escena 5";
  }
  public escena6(): void{
    //Escena
    let this_ = this;
    this.nEscena = 6;
    this.index = 1;
    this.showVideo = true;
    this.showImg = true;
    clearTimeout(this.audioLoop);
    this.makeVideo("/none.mp4");
    //Cam
    this.createStream();
    //Audio
    this.loopAudio(99, '/e6audio'+(Math.floor(Math.random()*3)+1)+'.mp3');
    //Texto
    this.textoContenido = "Escena 6";
  }
  public escena7(): void{
    //Escena
    let this_ = this;
    this.nEscena = 7;
    this.index = 1;
    this.showVideo = true;
    this.showStream = true;
    this.showImg = false;
    clearTimeout(this.audioLoop);
    this.makeVideo("/none.mp4");
    //Imagen
    this.imgUrl = this.sanitizer.bypassSecurityTrustUrl('http://'+this.gUrl+'/e7img1.jpg');
    //Audio
    this.loopAudio(99, '/e7audio'+(Math.floor(Math.random()*5)+1)+'.mp3');
    this.audioLoop = setTimeout(function(){this_.loopAudio(0, '/none.mp3');}, 60000*3);
    //Texto
    this.textoContenido = "Escena 7";
  }
}
