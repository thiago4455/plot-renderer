class Shader{
    sources: ShaderSource[];
    compileStatus: boolean;
    #program: WebGLProgram;
    #shader: WebGLShader;

    constructor(shaderSource: string){
        this.sources = shaderSource.split(/(?=\#shader)/g).map(parseSource);
    }

    attach(program: WebGLProgram, silent:boolean = false){
        this.#program = program;
        this.compileStatus = true;
        this.sources.forEach(shaderSource => {
            this.#shader = gl.createShader(GL_SHADER_TYPES[shaderSource.type]);
            gl.shaderSource(this.#shader, shaderSource.source.replace(/\\n/g,''));
            gl.compileShader(this.#shader);
            var success = gl.getShaderParameter(this.#shader, gl.COMPILE_STATUS);
            if (success) {
                gl.attachShader(program, this.#shader);
                return true;
            }
            if(!silent){
                console.warn(`${shaderSource.type} shader failed.`);
                console.log(shaderSource.source.replace(/\\n/g,''))
                console.log(gl.getShaderInfoLog(this.#shader));
            }
            this.compileStatus = false;
            return false;
        });
    }

    updateSource(shaderSource: string){
        this.sources = shaderSource.split(/(?=\#shader)/g).map(parseSource);
        this.sources.forEach(shaderSource => {
            this.#shader = gl.createShader(GL_SHADER_TYPES[shaderSource.type]);
            gl.shaderSource(this.#shader, shaderSource.source.replace(/\\n/g,''));
            gl.compileShader(this.#shader);
            var success = gl.getShaderParameter(this.#shader, gl.COMPILE_STATUS);
            if (!success) {
                console.warn(`${shaderSource.type} shader failed.`);
                console.log(shaderSource.source.replace(/\\n/g,''))
                console.log(gl.getShaderInfoLog(this.#shader));
                return;
            }
        });
    }

    deatach(){
        gl.detachShader(this.#program, this.#shader);
        gl.deleteShader(this.#shader);
    }

}

enum ShaderType{
    NONE = -1,
    VERTEX = 0,
    FRAGMENT = 1
}

interface ShaderSource{
    type: ShaderType,
    source: string
}

const GL_SHADER_TYPES = [gl.VERTEX_SHADER, gl.FRAGMENT_SHADER]

const S_TYPE_MAP: {[key:string]: ShaderType} = {
    'vertex': ShaderType.VERTEX,
    'fragment': ShaderType.FRAGMENT,
}

function parseSource(s: string){
    let lines = s.split('\n');
    let type = S_TYPE_MAP[lines.splice(0,1)[0].replace('#shader ','')];
    return {type: type, source: lines.join('\n')};
}

export default Shader;