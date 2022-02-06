import Tool from './Tool.js';

export default class Rect extends Tool {
    constructor(canvas, socket, id) {
        super(canvas, socket, id);
        this.listen(); //после создания canvas слушает все три события - нажитие на мышь, отпускание, движение
    };

    mouseUpHandler(e) {
        this.mouseDown = false;
        this.socket.send(JSON.stringify({
            method: 'draw',
            id: this.id,
            figure: {
                type: 'finish',
            }
        }))
    }

    mouseDownHandler(e) {
        this.mouseDown = true;
        this.ctx.beginPath(); //функция контекста, говорит о том, что мы начали рисовать

        //this в координатах, чтобы можно было пользоваться этими свойствами в других методах экземпляра
        this.startX = e.pageX - e.target.offsetLeft; //начальная координата по x
        this.startY = e.pageY - e.target.offsetTop; // по y

        this.saved = this.canvas.toDataURL() //сохраняем изображение в переменную
    }

    mouseMoveHandler(e) {
        if(this.mouseDown) {
            let currentX = e.pageX - e.target.offsetLeft; //текущая координата x
            let currentY = e.pageY - e.target.offsetTop;
            this.width = currentX - this.startX; //вычисляем ширину и длину прямоугольника
            this.height = currentY - this.startY;
            //this.draw(this.startX, this.startY, this.width, this.height);
            this.socket.send(JSON.stringify({
                method: 'draw',
                id: this.id,
                figure: {
                    type: 'rect',
                    x: this.startX,
                    y: this.startY,
                    width: this.width,
                    height: this.height,
                    color: this.ctx.fillStyle,
                    stroke: this.ctx.strokeStyle,
                    strokeWidth: this.ctx.lineWidth
                }
            }))
        }
    }

    static staticdraw(ctx, x, y, w, h, color, strokeColor, strokeWidth) {
        ctx.fillStyle = color
        ctx.strokeStyle = strokeColor
        ctx.strokeWidth = strokeWidth
        ctx.beginPath() //рисуем
        ctx.rect(x, y, w, h); //рисуем прямоугольник
        ctx.fill(); //заполняем цветом
        ctx.stroke(); //обводка
  
    }

}