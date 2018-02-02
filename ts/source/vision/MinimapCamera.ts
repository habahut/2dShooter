

export class MinimapCamera {

    canvas: HTMLCanvasElement;
    scaleFactor: number;
    ctx: CanvasRenderingContext2D;

    constructor(canvas: HTMLCanvasElement, scaleFactor: number) {
        this.canvas = canvas;
        this.scaleFactor = scaleFactor;
        this.ctx = <CanvasRenderingContext2D> canvas.getContext("2d");
    }

    drawLine(x1: number, y1: number, x2: number, y2: number, color: string | undefined = undefined) : void {
        if (color == undefined) {
            color = "black";
        }

        this.ctx.strokeStyle = color;
        this.ctx.beginPath();
        this.ctx.moveTo(x1 / this.scaleFactor, y1 / this.scaleFactor);
        this.ctx.lineTo(x2 / this.scaleFactor, y2 / this.scaleFactor);
        this.ctx.stroke();
        this.ctx.closePath();
    }
}
