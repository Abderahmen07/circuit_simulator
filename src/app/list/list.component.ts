import { Component, EventEmitter, Output } from '@angular/core';
import { ShareService } from '../share.service';
@Component({
  selector: 'app-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.css']
})
export class ListComponent {

t=["assets/icon_wire.jpg",'fil',
"assets/diode.jpg",'Diode',
"assets/generateur.jpg",'Generateur',
"assets/resistance.jpg",'Resistance',
"assets/condensateur.jpg",'Condensateur',
"assets/1.png",'Souris'];
tab=[0,2,4,6,8,10];
showTable = false;
toggleTable() {
  this.showTable = !this.showTable;
}
  c!: ShareService;  
  constructor(private b: ShareService) {
    this.c=b;
  }

  @Output() bouttonClique = new EventEmitter<void>();
  onClick(e: MouseEvent) {
    
    const image = e.target as HTMLImageElement;
    const att =image.getAttribute('id')
    this.c.setData(att!)
    console.log(this.c)
    this.bouttonClique.emit();
  }
}




