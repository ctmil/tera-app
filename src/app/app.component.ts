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
  //////////////////////////*IMAGEN*/
  @ViewChild("imagen") imagen: ElementRef;
  public imgUrl: SafeUrl;
  public showImg:boolean = false;
  /////////////////////////*TEXTO*/
  public textoContenido:string = '';
  public showText:boolean = false;
  /////////////////////////*BEACON*/
  public beacons:any = [];
	public uuid:string = '20cae8a0-a9cf-11e3-a5e2-0800200c9a66';
  public identifier:string = 'TeraBeacon';
  ////////////////////////*WIFI*/
  public wifi:any;
  ///////////////////////*SOCKET-IO*/
  public socketMsg:any;
  public pSocketMsg:any;
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
  public gUrl:string = "192.168.0.102:80";
  public ipCurrent:string = "192.168.0.102";
  public portCurrent:string = "80";
  ///////////////////////////LISTENER//
  public audioLoopListener: () => void;

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
        _this.loadIP();  //DEBUG
        window.powermanagement.acquire(); //WeakLock para que la pantalla no se bloquee
        setTimeout(function(){
          _this.device.startWatchAcc(_this.stream); //Cargar Acelerometro de Device

          let beaconRegion = new cordova.plugins.locationManager.BeaconRegion(_this.identifier, _this.uuid);
    	    let delegate = new cordova.plugins.locationManager.Delegate();

          delegate.didDetermineStateForRegion = function (pluginResult) {
            console.log("State:", pluginResult);
          };

          delegate.didStartMonitoringForRegion = function (pluginResult) {
            console.log("Monitoring:", pluginResult);
          };

    	    delegate.didRangeBeaconsInRegion = function (pluginResult) {
    	        _this.beacons = pluginResult.beacons;
              if(_this.beacons.length > 0){
                for (let i = 0; i < _this.beacons.length; i++) {
                  console.log(_this.beacons[i].accuracy, _this.beacons[i].major, _this.beacons[i].minor);
                }
              }
    	    };

    	    cordova.plugins.locationManager.setDelegate(delegate);

          cordova.plugins.locationManager.requestWhenInUseAuthorization();

    	    cordova.plugins.locationManager.startRangingBeaconsInRegion(beaconRegion)
    	        .fail(function(e) {console.log(e);})
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

    if(this.sce01){
      this.escena1();
    }else if(this.sce02){
      this.escena2();
    }else if(this.sce03){
      this.escena3();
    }else if(this.sce04){
      this.escena4();
    }else if(this.sce05){
      this.escena5();
    }else if(this.sce06){
      this.escena6();
    }else{
      this.escena1();
    }
  }

  public ngDoCheck(): void{
    if(this.socketMsg !== this.pSocketMsg){
      //Actualizar solo cuando el valor de socketMsg sea nuevo
      console.log(this.socketMsg);
    }
    this.pSocketMsg = this.socketMsg;
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

  public createStream(): void{
    let _this = this;
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
    this.audioUrl = this.sanitizer.bypassSecurityTrustUrl(s);
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
    }else if(this.index > 2){
      this.index = 2;
    }

    this.createStream();
  }

  //////////////////////////////////////////////////////////////
  //************************ESCENAS***************************//
  //////////////////////////////////////////////////////////////

  public escena1(): void{
    //Escena
    this.nEscena = 1;
    //Cam1
    this.createStream();
    //Audio
    this.loopAudio(3, 'assets/audio/tv_test_01.mp3');
    //Imagen

    //Texto
    this.textoContenido = "Escena 1";
  }
  public escena2(): void{
    //Escena
    this.nEscena = 2;
    //Cam1
    this.createStream();
    //Audio
    this.loopAudio(3, 'assets/audio/tv_test_02.mp3');
    //Imagen

    //Texto
    this.textoContenido = "Escena 2";
  }
  public escena3(): void{
    //Escena
    this.nEscena = 3;
    //Cam1
    this.createStream();
    //Audio
    this.loopAudio(3, 'assets/audio/tv_test_03.mp3');
    //Imagen

    //Texto
    this.textoContenido = "Escena 3";
  }
  public escena4(): void{
    //Escena
    this.nEscena = 4;
    //Cam1
    this.createStream();
    //Audio
    this.loopAudio(1, 'assets/audio/tv_test_04.mp3');
    //Imagen

    //Texto
    this.textoContenido = "Escena 4";
  }
  public escena5(): void{
    //Escena
    this.nEscena = 5;
    //Cam1
    this.createStream();
    //Audio
    this.loopAudio(0, 'assets/audio/vamos-a-experimentar-un-minuto-de-introspeccion.mp3');
    //Imagen

    //Texto
    this.textoContenido = "Escena 5";
  }
  public escena6(): void{
    //Escena
    this.nEscena = 6;
    //Cam1
    this.createStream();
    //Audio
    this.loopAudio(1, 'assets/audio/nos-podemos-arreglar-con-lo-que-hay-ahi.mp3');
    //Imagen

    //Texto
    this.textoContenido = "Escena 6";
  }
}
