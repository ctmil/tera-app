import { Component, OnInit, ViewChild, ElementRef, Renderer2 } from '@angular/core';
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
  public showStream:boolean = false;
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

  //////////////////////////////////////
  /*ESCENAS*/
  public sce01:boolean = false;
  public sce02:boolean = false;
  public sce03:boolean = false;
  public sce04:boolean = false;
  public sce05:boolean = false;
  public sce06:boolean = false;

  ////////////////////////*DEBUG*/
  @ViewChild("ip") ip: ElementRef;
  @ViewChild("port") port: ElementRef;
  public toggle:boolean = false;
  ///////////////////////////
  public index:number = 0;
  public loop;
  ///////////////////////////LISTENER//
  public audioLoopListener: () => void;

  constructor(private sanitizer: DomSanitizer, private renderer: Renderer2){
    /*-STREAM DEFAULT-*/
    //this.url = this.sanitizer.bypassSecurityTrustStyle('url("http://192.168.1.135:8080/?action=stream") no-repeat center center fixed');
    //this.c = this.sanitizer.bypassSecurityTrustStyle('cover');
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
        window.powermanagement.acquire(); //WeakLock para que la pantalla no se bloquee
        setTimeout(function(){ startWatch(); }, 1000); //Espera un segundo antes de ver el Acc
    }

    //START WiFiWizard
    setInterval(function(){
      WifiWizard2.getCurrentSSID(success, fail); //Obtiene conexion WiFi actual
    }, 2000);

    function success(a) {
      console.log(a);
    }

    function fail(a){
      alert("No está conectado a una Red");
      console.log(a);
    }
    //END WifiWizard

    //Accelerometer//
    function startWatch() {
        let options = { frequency: 100 }; //Frecuencia del Acelerómetro, a Mayor numero más lento pero más eficiente - BUSCAR EQUILIBRIO
        navigator.accelerometer.watchAcceleration(onAccelSuccess, onAccError, options); //Watch de la Aceleración
    }

    function onAccelSuccess(acceleration) { //Acelerómetro
      //Calculo rápido para Rotación
      let roll = Math.atan2(acceleration.y, acceleration.z) * 180/Math.PI;

      //Compensación de Posicion
      _this.stream.nativeElement.style.top = -120+(acceleration.x*12)+"%";
      //document.getElementById('stream').style.top = -120+(acceleration.x*12)+"%";

      if(acceleration.x > 7 && acceleration.z > 0){
        _this.stream.nativeElement.style.left = String( (-1*roll/4) - 10 )+"%";
        //document.getElementById('stream').style.left = String( (-1*roll/4) - 10 )+"%";
      }else{
        _this.stream.nativeElement.style.left = "-10%";
        //document.getElementById('stream').style.left = "-10%";
      }
    }

    function onAccError(e) {
        alert('Error:'+e);
    }

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

  public loopAudio(n:number, s:string): void{
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

  public changeIP(): void{  //DEBUG
    console.log(this.ip.nativeElement.value + ":" +this.port.nativeElement.value);
    let url = "http://"+this.ip.nativeElement.value+":"+this.port.nativeElement.value+"/?action=stream";
    this.url = this.sanitizer.bypassSecurityTrustStyle('url('+url+') no-repeat center center fixed');
    this.c = this.sanitizer.bypassSecurityTrustStyle('cover');
    this.toggle = false;
  }
  //////////////////////////////////////////////////////////////////////////////

  public plusImg(): void{
    /*this.index++;

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
    }*/

  }

  public lessImg(): void{
    /*this.index--;

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
    }*/

  }

  public filter(n:number, s:string): void{
    /*let _this = this;
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
    }*/
  }

  //////////////////////////////////////////////////////////////
  //************************ESCENAS***************************//
  //////////////////////////////////////////////////////////////

  public escena1(): void{
    //Audio
    this.loopAudio(1, 'assets/audio/tv_test_01.mp3');
    //Imagen

    //Texto

  }
  public escena2(): void{
    //Audio

    //Imagen

    //Texto

  }
  public escena3(): void{
    //Audio

    //Imagen

    //Texto

  }
  public escena4(): void{
    //Audio

    //Imagen

    //Texto

  }
  public escena5(): void{
    //Audio

    //Imagen

    //Texto

  }
  public escena6(): void{
    //Audio

    //Imagen

    //Texto

  }
}
