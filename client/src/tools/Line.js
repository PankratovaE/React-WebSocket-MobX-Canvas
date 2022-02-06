import Tool from './Tool.js';

export default class Line extends Tool {
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
  
        this.startX = e.pageX - e.target.offsetLeft; //начальная координата по x
        this.startY = e.pageY - e.target.offsetTop; // по y

        this.ctx.beginPath(); //функция контекста, говорит о том, что мы начали рисовать
        this.ctx.moveTo(e.pageX - e.target.offsetLeft, e.pageY - e.target.offsetTop)
       
        this.saved = this.canvas.toDataURL() //сохраняем изображение в переменную
    }

    mouseMoveHandler(e) {
        if(this.mouseDown) {
            let currentX = e.pageX - e.target.offsetLeft; //текущая координата x
            let currentY = e.pageY - e.target.offsetTop;

            //this.draw(currentX, currentY);
            this.socket.send(JSON.stringify({
                method: 'draw',
                id: this.id,
                figure: {
                    type: 'line',
                    x: e.pageX - e.target.offsetLeft,
                    y: e.pageY - e.target.offsetTop,
                    strokeColor: this.ctx.strokeStyle,
                    strokeWidth: this.ctx.strokeWidth
                }
            }))
        }
    }
    
    static draw(ctx, x, y, color, strokeColor, strokeWidth) {

        ctx.strokeStyle = strokeColor
        ctx.strokeWidth = strokeWidth
        ctx.lineTo(x, y)
        ctx.stroke();

        // const img = new Image() //создаем новое изображение
        // img.src = this.saved //передаем туда сохраненное
        // img.onload = () => { //как только загрузится делаем:
        //     this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height) //очищаем канвас
        //     this.ctx.drawImage(img, 0, 0, this.canvas.width, this.canvas.height) //отрисовываем img, 0, 0 - начальные координаты
        //     //this.canvas.width, this.canvas.height - размер канваса
        //     this.ctx.beginPath() //рисуем
        //     this.ctx.moveTo(this.startX, this.startY)
        //     this.ctx.lineTo(x, y)
        //     this.ctx.stroke(); //обводка
        // }
    }

}