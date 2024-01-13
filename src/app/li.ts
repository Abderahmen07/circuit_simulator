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

export class li  {
  private canvas1!: HTMLCanvasElement;
  private ctx1!: CanvasRenderingContext2D;
  
  
  
  
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
  
  
     ctx.beginPath();
      ctx.arc(start.x, start.y, lineWidth * 2, 0, Math.PI * 2);
      ctx.fillStyle = strokeStyle;
      ctx.fill();
      ctx.stroke();
  
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
      x: event.clientX -264 ,
      y: event.clientY -68
    }
    return position
  }
  
  private clearCanvas(ctx:CanvasRenderingContext2D) {
    ctx.clearRect(0, 0, this.canvas1.width, this.canvas1.height)
  }
    
   private lines:Line[] = []
  
  private draw() {
    this.clearCanvas(this.ctx1)
    this.lines.forEach((line) => {
      this.drawLine(this.ctx1, line)
    })
  }
  
  private handleMouseDown=(e:MouseEvent):void=> {
    this.mouse.setDown(e, this.canvas1)
    
    const line = {
      start: this.mouse.down,
      end: this.mouse.down,
    }
    if(this.lines.length>=1){
    for(let i=0;i<=this.lines.length-1;i++){
      if(this.getDistance(this.lines[i].start,this.mouse.down)<=8){
        line.start=this.lines[i].start;
        line.end=this.lines[i].start;
       }
      else if(this.getDistance(this.lines[i].end,this.mouse.down)<=8) {
       line.start= this.lines[i].end;
       line.end=this.lines[i].end;
      }}
    }
    this.lines.push(line)
    console.log ("s")
  }
  
  private handleMouseUp=(e:MouseEvent):void=> {
    this.mouse.setUp(e, this.canvas1)
  
  const closestLine = this.getClosestLine(this.lines, this.mouse.up)
  
  if(closestLine) {
    if (this.getDistance(this.mouse.up,closestLine.end)<this.getDistance(this.mouse.up,closestLine.start) && this.getDistance(this.mouse.up,closestLine.end)<30 )
   { 
   this.lines[this.lines.length-1].end= closestLine.end;
   console.log("abdou123")
   }
  
  else if(this.getDistance(this.mouse.up,closestLine.start)<30){
    this.lines[this.lines.length-1].end=closestLine.start;
   console.log("abdou")
  }}
  this.draw()
  
  }
  
  private handleMouseMove =(e:MouseEvent):void=> {
  if(this.mouse.isPressed ) {
  this.mouse.setCurrent(e, this.canvas1)
  const currentLine = this.lines[this.lines.length - 1]
  currentLine.end = this.mouse.current
  
  this.draw()
  }
  }

  public removeEventListeners() {
    this.canvas1.removeEventListener("mousedown", this.handleMouseDown);
    this.canvas1.removeEventListener("mousemove", this.handleMouseMove);
    this.canvas1.removeEventListener("mouseup", this.handleMouseUp);
  }

  public addEventListeners() {
    this.canvas1.addEventListener("mousedown", this.handleMouseDown);
    this.canvas1.addEventListener("mousemove", this.handleMouseMove);
    this.canvas1.addEventListener("mouseup", this.handleMouseUp);
  }
  
}