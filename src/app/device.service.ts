import { Injectable } from '@angular/core';
declare var navigator:any;

@Injectable()
export class DeviceService {

  constructor() { }

  /*-- START Accelerometer --*/
  public startWatchAcc(s:any, v:any, i:any): void {
    let options = { frequency: 100 }; //Frecuencia del Acelerómetro, a Mayor numero más lento pero más eficiente - BUSCAR EQUILIBRIO
    navigator.accelerometer.watchAcceleration(function(acc){
      //Calculo rápido para Rotación
      let roll = Math.atan2(acc.y, acc.z) * 180/Math.PI;

      //Compensación de Posicion
      s.nativeElement.style.top = -120+(Math.abs(acc.x)*12)+"%";
      //v.nativeElement.style.top = -120+(Math.abs(acc.x)*12)+"%";
      if(acc.z < 0){
        i.nativeElement.style.top = -150+(Math.abs(acc.z)*15)+"%";
      }else{
        i.nativeElement.style.top = "-150%";
      }

      if(acc.x > 7 && acc.z > 0){
        s.nativeElement.style.left = String( (-1*roll/4) - 10 )+"%";
        //v.nativeElement.style.left = String( (-1*roll/4) - 10 )+"%";
        i.nativeElement.style.left = String( (-1*roll/4) - 10 )+"%";
      }else{
        s.nativeElement.style.left = "-10%";
        //v.nativeElement.style.left = "-10%";
        i.nativeElement.style.left = "-50%";
      }
    }, function(e){
      alert('Error:'+e);
    },
    options); //Watch de la Aceleración
  }
  /*-- END Accelerometer --*/
}
