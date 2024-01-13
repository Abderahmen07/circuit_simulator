import { Injectable } from '@angular/core';
import { dio } from './dio';

@Injectable({
  providedIn: 'root'
})
export class ShareService {

  constructor() { }
 public data: String []=[];
 setData(nouvelleValeur: String) {
  this.data.push(nouvelleValeur);
}
po(){
 return this.data.pop();
}

/*diodes: dio[] = [];
setData1(nouvelleValeur: dio) {
  this.diodes.push(nouvelleValeur);
}
po1(){
 return this.diodes.pop();
}*/
}
