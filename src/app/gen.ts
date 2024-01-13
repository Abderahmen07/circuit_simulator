import { MongoClient } from 'mongodb';

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

export class gen {
   posX = 0;
   posY = 0;
   isDragging = false;
  private canvas: HTMLCanvasElement;
  private ctx: CanvasRenderingContext2D;
  private img: HTMLImageElement;
  private diodes: gen[] = [];
  private li: Line[] = [];
  private point: { x: number, y: number }[] = []

  constructor(di:any,lin:any,po:any) {
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
    this.img.src = 'assets/generateur.jpg';
    this.canvas.addEventListener('mousedown', this.handleMouseDown.bind(this));
    this.canvas.addEventListener('mousemove', this.handleMouseMove.bind(this));
    this.canvas.addEventListener('mouseup', this.handleMouseUp.bind(this));
    this.canvas.addEventListener('contextmenu', this.handle.bind(this))

  }


  /* async  connectToMongoDB() {
    const url = 'mongodb://localhost:27017/projet';
    const client = new MongoClient(url);
    await client.connect();
    const db = client.db('projet');
    const collection = db.collection('generateurs');
    return collection;
  }*/
  



   draw(): void {
    this.ctx.drawImage(this.img, this.posX, this.posY, 65, 65);
    this.ctx!.beginPath();
    this.ctx!.arc(this.posX + 33, this.posY + 4, 4, 0, Math.PI * 2);
    this.ctx!.fillStyle = 'black';
    this.ctx!.fill();

    this.ctx!.beginPath();
    this.ctx!.arc(this.posX + 33, this.posY + 60, 4, 0, Math.PI * 2);
    this.ctx!.fillStyle = 'black';
    this.ctx!.fill();
  }
   handle (event:MouseEvent){
    event.preventDefault(); 
    const rect = this.canvas.getBoundingClientRect();
    const mouseX = event.clientX - rect.left;
    const mouseY = event!.clientY- rect.top;
    if (
      mouseX >= this.posX &&
      mouseX <= this.posX + 65 &&
      mouseY >= this.posY+8 &&
      mouseY <= this.posY + 57
    ) {
      const impedance = prompt('Veuillez entrer la valeur de l\'impédance :');
   // const collection = await this.connectToMongoDB();
    //await collection.insertOne({ impedance });
    //console.log('Impédance enregistrée avec succès dans MongoDB');
    }
  }
  
  private handleMouseDown(event: MouseEvent): void {
    const rect = this.canvas.getBoundingClientRect();
    const mouseX = event.clientX - rect.left;
    const mouseY = event.clientY - rect.top;
    if (
      mouseX >= this.posX &&
      mouseX <= this.posX + 65 &&
      mouseY >= this.posY+8 &&
      mouseY <= this.posY + 57
    ) {
      this.isDragging = true;
      
    }
    

  }

  private handleMouseMove(event: MouseEvent): void {
    if (this.isDragging) {
      const rect = this.canvas.getBoundingClientRect();
      const mouseX = event.clientX - rect.left;
      const mouseY = event.clientY - rect.top;
      // Effacer l'élément à son emplacement actuel
      this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
      // Dessiner l'image à la nouvelle position
      this.posX = mouseX - 33;
      this.posY = mouseY - 32.5;
      this.diodes.forEach((element) => {
        if(element.isDragging==false){
          element.draw();
        }
        console.log(element.isDragging);
      });
      this.draw();
      this.draw7();
     
    }
    
  }

  private handleMouseUp(): void {
    this.isDragging = false;
    console.log(this.diodes);
    const point1={x:this.posX + 33, y:this.posY + 4}
    const point2={x:this.posX + 33, y:this.posY + 60}
    this.point.splice(0,this.point.length)
    this.point.push(point1)
    this.point.push(point2)
   
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
