#shader vertex
#version 300 es
in vec4 position;
void main()
{
    gl_Position = position;
}

#shader fragment
#version 300 es
precision mediump float;

const float PI = 3.1415926535897932384626433832795;
const float GRID_WIDTH = 1.;

const float WIDTH = 2.;

uniform float X_SHIFT;
uniform float Y_SHIFT;
uniform float SCALAR;

float f(float x){
    return /*FUNCTION_REPLACEMENT*/;
}

out vec4 myOutputColor;
void main()
{
    float x = gl_FragCoord.x*SCALAR + X_SHIFT;
    float y = gl_FragCoord.y*SCALAR + Y_SHIFT;
    
    float y_distance = abs(f(x) - y);

    float m = dFdx(f(x))/dFdx(x);
    float y_thickness = SCALAR * WIDTH * sqrt(m*m+1.0);

    float grid_distance = min(mod(gl_FragCoord.x + X_SHIFT/SCALAR,1./SCALAR), mod(gl_FragCoord.y + Y_SHIFT/SCALAR,1./SCALAR));

    myOutputColor = vec4(1, 0, .4, 1);
    myOutputColor *= max(0., step(y_distance, y_thickness) * pow((y_thickness-y_distance)/y_thickness, 0.5));
    myOutputColor += vec4(1, 1, 1, 1) * .5 *step(grid_distance, GRID_WIDTH);
}