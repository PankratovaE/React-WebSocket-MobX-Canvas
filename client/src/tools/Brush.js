import Tool from './Tool.js';

export default class Brush extends Tool {
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
        this.ctx.beginPath() //функция контекста, говорит о том, что мы начали рисовать
        this.ctx.moveTo(e.pageX - e.target.offsetLeft, e.pageY - e.target.offsetTop) //переместили курсор в начальную точку
        //откуда будет рисоваться линия, вычислили координаты этой точки
    }

    mouseMoveHandler(e) {
        if(this.mouseDown) {
            //this.draw(e.pageX - e.target.offsetLeft, e.pageY - e.target.offsetTop);
            this.socket.send(JSON.stringify({
                method: 'draw',
                id: this.id,
                figure: {
                    type: 'brush',
                    x: e.pageX - e.target.offsetLeft,
                    y: e.pageY - e.target.offsetTop,
                    strokeColor: this.ctx.strokeStyle,
                    strokeWidth: this.ctx.strokeWidth
                }
            }))
        }
    }
    
    static draw(ctx, x, y, strokeColor, strokeWidth) {
        ctx.strokeStyle = strokeColor
        ctx.strokeWidth = strokeWidth
        ctx.lineTo(x, y);
        ctx.stroke(); //вызываем, чтобы линию было видно, как бы обводим ее
        //console.log('draw brush');

    }

}