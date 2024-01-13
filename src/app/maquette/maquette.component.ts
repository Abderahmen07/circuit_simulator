import { AfterViewInit, Component, ElementRef, ViewChild } from '@angular/core';
import { ShareService } from '../share.service';
import { cond } from '../cond';
import { res } from '../res';
import { dio } from '../dio';
import { gen } from '../gen';
import { inductor } from '../inductor';
import { elementAt } from 'rxjs';


interface Point {
  x: number;
  y: number;
}

interface Line {
  start: Point | null;
  end: Point | null;
  lineWidth?: number;
  lineCap?: string;
  strokeStyle?: string;
}




@Component({
  selector: 'app-maquette',
  templateUrl: './maquette.component.html',
  styleUrls: ['./maquette.component.css']
})
export class MaquetteComponent implements  AfterViewInit {

  //foctionnalite 1
  @ViewChild('myCanvas') canvasRef!: ElementRef<HTMLCanvasElement>;

 
  private canvas!: HTMLCanvasElement;
  private ctx!: CanvasRenderingContext2D;
  
  
  
  
  private drawLine(ctx:CanvasRenderingContext2D , line:Line) {
    const  {
      start,
      end,
      lineWidth = 2,
      lineCap = 'round', 
      strokeStyle = 'black',
    }  =line
    
    if(!start || !end) {
      throw new Error('Start or end of line not defined.')
    }
  
    ctx.beginPath()
    ctx.moveTo(start.x, start.y)
    ctx.lineTo(end.x, end.y)
    ctx.lineWidth = lineWidth
    ctx.lineCap = lineCap as CanvasLineCap
    ctx.strokeStyle = strokeStyle
    ctx.stroke()
    
     // Draw circle at start point
     ctx.beginPath();
      ctx.arc(start.x, start.y, lineWidth * 2, 0, Math.PI * 2);
      ctx.fillStyle = strokeStyle;
      ctx.fill();
      ctx.stroke();
  
      // Draw circle at end point
      ctx.beginPath();
      ctx.arc(end.x, end.y, lineWidth * 2, 0, Math.PI * 2);
      ctx.fillStyle = strokeStyle;
      ctx.fill();
      ctx.stroke();

    
  }
  
  private getDistance(point1:Point | null, point2:Point | null) {
    const xDiff = point2!.x - point1!.x;
    const yDiff = point2!.y - point1!.y;
    return Math.sqrt(xDiff * xDiff + yDiff * yDiff);
  }








  private getDistance1(point1:{x:number,y:number}, point2:Point | null) {
    const xDiff = point2!.x - point1!.x;
    const yDiff = point2!.y - point1!.y;
    return Math.sqrt(xDiff * xDiff + yDiff * yDiff);
  }
  








  private getClosestLine(lines:Line[], point:Point|null) {
    let closestLine = null;
    let minDistance = 10000000000000000000000000000;
    let i;
    if(lines.length>=2){
    for(i=0;i<=lines.length-2;i++) {
      let line=lines[i];
      const distanceToStart = this.getDistance(line.start, point);
      const distanceToEnd = this.getDistance(line.end, point);
      const distanceToLine = Math.min(distanceToStart, distanceToEnd);
      if (distanceToLine < minDistance) {
        closestLine = line;
        minDistance = distanceToLine;
        
      }
    }}
    return closestLine;
  }







  
  private mouse = {
    isPressed: false,
    down: null as Point | null ,
    current: null as Point | null ,
    up: null as Point | null ,
    setDown: (event:MouseEvent, element:HTMLElement) =>{
      this.mouse.isPressed = true;
      this.mouse.down = this.getPosition(event, element)
    },
    setUp: (event:MouseEvent, element:HTMLElement)=> {
      this.mouse.isPressed = false;
      this.mouse.up = this.getPosition(event, element)
    
    },
    setCurrent: (event:MouseEvent, element:HTMLElement)=> {
      this.mouse.current = this.getPosition(event, element)
    },
    
  }




  private getPosition(event:MouseEvent, element:HTMLElement) {
    let position = {
      x: event.clientX -element.getBoundingClientRect().left ,
      y: event.clientY -element.getBoundingClientRect().top
    }
    return position
  }




  
  private clearCanvas(ctx:CanvasRenderingContext2D) {
    ctx.clearRect(0, 0, this.canvas.width, this.canvas.height)
  }









    
   private lines:Line[] = []
  
  private draw() {
    this.clearCanvas(this.ctx)
    this.lines.forEach((line) => {
      this.drawLine(this.ctx, line)
    })
  }





  
  private handleMouseDown=(e:MouseEvent):void=> {
    this.mouse.setDown(e, this.canvas)
    
    const line = {
      start: this.mouse.down,
      end: this.mouse.down,
    }
    const  allPoints = this.points.concat(this.points1, this.points2, this.points3);
    if(this.lines.length>=1 || allPoints.length!=0 ){
      
    for(let i=0;i<=this.lines.length-1;i++){
      const point1={x:this.lines[i].start!.x,y:this.lines[i].start!.y}
      const point2={x:this.lines[i].end!.x,y:this.lines[i].end!.y}
      allPoints.push(point1);
      allPoints.push(point2);
    }
    allPoints.forEach((element)=>{
      if(this.getDistance1(element,this.mouse.down)<=8){
        line.start!.x=element.x;
        line.start!.y=element.y;
        line.end!.x=element.x;
        line.end!.y=element.y;
       }
      
    })
      }
    
    this.lines.push(line)
  }






  private closest_point(l:Point){
    const k={x:40000,y:40000};
    const  allPoints = this.points.concat(this.points1, this.points2, this.points3);
   allPoints.forEach((element) => {
          if(this.getDistance1(element,l)<=this.getDistance1(k,l)){
            k.x=element.x;
            k.y=element.y;
          }
        })
  return k;

  }
  
  private handleMouseUp=(e:MouseEvent):void=> {
    this.allpoints();
    this.mouse.setUp(e, this.canvas)
  
  const closestLine = this.getClosestLine(this.lines, this.mouse.up)
  const closestpoint=this.closest_point(this.mouse.up!);
  if(closestLine) {

    if (this.getDistance(this.mouse.up,closestLine.end)<this.getDistance(this.mouse.up,closestLine.start) )
   {if(this.getDistance(this.mouse.up,closestLine.end)<this.getDistance1(closestpoint,this.mouse.up)&& this.getDistance(this.mouse.up,closestLine.end)<30 ){ 
   this.lines[this.lines.length-1].end= closestLine.end;
   }
   else if(this.getDistance1(closestpoint,this.mouse.up)<30){
    this.lines[this.lines.length-1].end!.x= closestpoint.x;
    this.lines[this.lines.length-1].end!.y= closestpoint.y;
   }
  }
  
  else if(this.getDistance(this.mouse.up,closestLine.start)<30 && this.getDistance(this.mouse.up,closestLine.start)<this.getDistance1(closestpoint,this.mouse.up)){
    this.lines[this.lines.length-1].end=closestLine.start;
   
  }
  else if(this.getDistance1(closestpoint,this.mouse.up)<30){
    this.lines[this.lines.length-1].end!.x= closestpoint.x;
    this.lines[this.lines.length-1].end!.y= closestpoint.y;
   }

}
  this.draw()
  this.draw5()
  }

  private handleMouseMove =(e:MouseEvent):void=> {
  if(this.mouse.isPressed ) {
  this.mouse.setCurrent(e, this.canvas)
  const currentLine = this.lines[this.lines.length - 1]
  currentLine.end = this.mouse.current
  
  this.draw()
  this.draw5()
  }
  }

  public removeEventListeners() {
    this.canvas.removeEventListener("mousedown", this.handleMouseDown);
    this.canvas.removeEventListener("mousemove", this.handleMouseMove);
    this.canvas.removeEventListener("mouseup", this.handleMouseUp);
  }

  public addEventListeners() {
    this.canvas.addEventListener("mousedown", this.handleMouseDown);
    this.canvas.addEventListener("mousemove", this.handleMouseMove);
    this.canvas.addEventListener("mouseup", this.handleMouseUp);

  }


  ngAfterViewInit() {
    this.canvas = this.canvasRef.nativeElement;
    this.ctx = this.canvas.getContext('2d')!;
    const dropZone = document.getElementById("dropZone");
    const rect = dropZone!.getBoundingClientRect();
    this.canvas.width =rect.width;
    this.canvas.height = rect.height;
  }

  
  c!: ShareService;  
  tab=[10,11,12,13,5];
  constructor(b: ShareService,) {
    this.c=b;
    
  }
   liste: (dio | res | cond | gen )[] = [];
   private points: { x: number, y: number }[] = []   
   private points1: { x: number, y: number }[] = []  
   private points2: { x: number, y: number }[] = [] 
   private points3: { x: number, y: number }[] = [] 


 draw5(){
  this.liste.forEach((element)=>{
    element.draw()
  }
  )
 }



 allpoints():void{
  let  allPoints1 = this.points.concat(this.points1, this.points2, this.points3);
  this.lines.forEach(element=>{
    allPoints1.push({x:element.start!.x,y:element.start!.y})
    allPoints1.push({x:element.start!.x,y:element.start!.y})
  })
  console.log(allPoints1)
let c=0;
allPoints1.forEach(element=>{
  console.log(this.countOccurrences(element,allPoints1))
  if(this.countOccurrences(element,allPoints1)==2){
c++
  }
  

}

)
if(c==allPoints1.length/2){
  console.log(true)
}
else{
  console.log(false)

}




 }
  countOccurrences(value:any, list:any) {
  let count = 0;
  for (let i = 0; i < list.length; i++) {
    if (list[i].x === value.x && list[i].y === value.y) {
      count++;
    }
  }
  return count;
}


  public onBouttonCliqueDuParent(): void {
  const hh=document.querySelector("canvas")
  const v=this.c.po()!;


 if(v=="0"){
  
  this.addEventListeners();

  
    
 }
 else{
 this.removeEventListeners();



 if(v=="2"){
  const b=new dio(this.liste,this.lines,this.points);
  b.draw();
  this.liste.push(b);
   }



 else if(v=="4"){
  const n=new gen(this.liste,this.lines,this.points1);
  n.draw();
  this.liste.push(n);

 }



 else if(v=="6"){
  const m=new res(this.liste,this.lines,this.points2);
  m.draw();
  this.liste.push(m);
 }


 else if(v=="8")  {
  const d=new cond(this.liste,this.lines,this.points3);
  d.draw();
  this.liste.push(d);
 }



 else{
  this.removeEventListeners();
  
 }
 this.allpoints();
  
}

 }

  
}

  
  
  
  
  
  
  
  
  
  
  
  
  

