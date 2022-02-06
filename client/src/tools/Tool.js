export default class Tool {
    constructor(canvas, socket, id) {
        this.canvas = canvas
        this.socket = socket
        this.id = id
        this.ctx = canvas.getContext('2d'); //контекст - здесь объект, который позволяет рисовать на канвасе
        this.destroyEvents();
    }

    set fillColor(color) {
        this.ctx.fillStyle = color
    }

    set strokeColor(color) {
        this.ctx.strokeStyle = color
    }

    set lineWidth(width) {
        this.ctx.lineWidth = width
    }
    
    listen() {
        this.canvas.onmousemove = this.mouseMoveHandler.bind(this); //bind здесь нужен, чтобы внутри функций обращаться
        this.canvas.onmousedown = this.mouseDownHandler.bind(this); // к this
        this.canvas.onmouseup = this.mouseUpHandler.bind(this);
    }

    destroyEvents() {
        this.canvas.onmousemove = null;
        this.canvas.onmousedown = null;
        this.canvas.onmouseup = null;
    }
}
