import Tool from './Tool.js';

export default class Circle extends Tool {
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
            this.radius = Math.sqrt(Math.pow((this.startX - currentX), 2) + Math.pow((this.startY - currentY), 2))
            //this.draw(this.startX, this.startY, this.radius);

            this.socket.send(JSON.stringify({
                method: 'draw',
                id: this.id,
                figure: {
                    type: 'circle',
                    x: this.startX,
                    y: this.startY,
                    radius: this.radius,
                    color: this.ctx.fillStyle,
                    stroke: this.ctx.strokeStyle,
                    strokeWidth: this.ctx.lineWidth
                }
            }))
        }
    }
    
    // draw(x, y, r) {
    //     const img = new Image() //создаем новое изображение
    //     img.src = this.saved //передаем туда сохраненное
    //     img.onload = async function () { //как только загрузится делаем:
    //         this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height) //очищаем канвас
    //         this.ctx.drawImage(img, 0, 0, this.canvas.width, this.canvas.height) //отрисовываем img, 0, 0 - начальные координаты
    //         //this.canvas.width, this.canvas.height - размер канваса
    //         this.ctx.beginPath() //рисуем
    //         this.ctx.arc(x, y, r, 0, Math.PI * 2, false); //рисуем окружность
    //         this.ctx.fill(); //заполняем цветом
    //         this.ctx.stroke(); //обводка
    //     }.bind(this)
        
    // }

    static staticdraw(ctx, x, y, radius, color, strokeColor, strokeWidth) {
        ctx.fillStyle = color
        ctx.strokeStyle = strokeColor
        ctx.strokeWidth = strokeWidth
        ctx.beginPath() //рисуем
        ctx.arc(x, y, radius, 0, Math.PI * 2);
        ctx.fill(); //заполняем цветом
        ctx.stroke(); //обводка
  
    }

}