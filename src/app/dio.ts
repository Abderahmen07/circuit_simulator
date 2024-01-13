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


export class dio  {
   posX = 0;
   posY = 0;
   isDragging = false;
  private canvas: HTMLCanvasElement;
  private ctx: CanvasRenderingContext2D;
  private img: HTMLImageElement;
  private diodes: dio[] = [];
  private li: Line[] = [];
  private point: { x: number, y: number }[] = []

  constructor(di:any,lin:any,po:any) {;
    this.canvas = document.querySelector('canvas')!;
    this.ctx = this.canvas.getContext('2d')!;
    
    this.posX = Math.floor(Math.random() * (this.canvas.width - 65));
    this.posY = Math.floor(Math.random() * (this.canvas.height - 65));
    this.diodes=di;
    this.li=lin;
    this.point=po;
    this.img = new Image();
    this.img.onload = () => {
      this.draw();
    };
    this.img.src = 'assets/diode.jpg';
    this.canvas.addEventListener('mousedown', this.handleMouseDown.bind(this));
    this.canvas.addEventListener('mousemove', this.handleMouseMove.bind(this));
    this.canvas.addEventListener('mouseup', this.handleMouseUp.bind(this));
    
  }
  
   draw(): void {

    this.ctx.drawImage(this.img, this.posX, this.posY, 65, 65);
    this.ctx.beginPath();
    this.ctx.arc(this.posX + 12, this.posY + 32, 4, 0, Math.PI * 2);
    this.ctx.fillStyle = 'black';
    this.ctx.fill();

    this.ctx.beginPath();
    this.ctx.arc(this.posX + 60, this.posY + 32, 4, 0, Math.PI * 2);
    this.ctx.fillStyle = 'black';
    this.ctx.fill();
  }
  
  private handleMouseDown(event: MouseEvent): void {
    const rect = this.canvas.getBoundingClientRect();
    const mouseX = event.clientX - rect.left;
    const mouseY = event.clientY - rect.top;
    if (
      mouseX >= this.posX+14 &&
      mouseX <= this.posX + 57 &&
      mouseY >= this.posY &&
      mouseY <= this.posY + 65
    ) {
      this.isDragging = true;
      
    }
    

  }

  private handleMouseMove(event: MouseEvent): void {
    if (this.isDragging) {
      const rect = this.canvas.getBoundingClientRect();
      const mouseX = event.clientX - rect.left;
      const mouseY = event.clientY - rect.top;
      this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
      this.posX = mouseX - 33;
      this.posY = mouseY - 32.5;
      this.diodes.forEach((element) => {
        if(element.isDragging==false){
          element.draw();
        }
      });
      this.draw();
      this.draw7();   
    }
    
  }

  private handleMouseUp(): void {
    this.isDragging = false;
    console.log(this.diodes);
    const point1={x:this.posX + 12, y:this.posY + 32}
    const point2={x:this.posX + 60, y:this.posY + 32}
    this.point.splice(0,this.point.length)
    this.point.push(point1)
    this.point.push(point2)
    console.log(this.point)
   
  }
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
  private clearCanvas(ctx:CanvasRenderingContext2D) {
    ctx.clearRect(0, 0, this.canvas.width, this.canvas.height)
  }
    
     
  private draw7() {
    
    this.li.forEach((line) => {
      this.drawLine(this.ctx, line)
    })
  }
}
