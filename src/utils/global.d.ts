declare module "*.glsl" {
    const content: string;
    export default content;
}

declare var gl: WebGL2RenderingContext;
declare var canvas: HTMLCanvasElement;
declare var input: HTMLInputElement;