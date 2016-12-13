#version 150

precision mediump float;

uniform  sampler2D ColorTex;

uniform int greyscale = 0;
uniform int mirror_horiz = 0;
uniform int mirror_vert = 0;
uniform int gaus_blur = 0;

uniform float offset_a[5] = float[](0.0, 1.0, 2.0, 3.0, 4.0);
uniform float offset_b[5] = float[](4.0, 3.0, 2.0, 1.0, 0.0);
uniform float weight_a[4] = float[](0.1945945946, 0.1216216216, 0.0540540541, 0.0162162162);
uniform float weight_b[4] = float[](0.0162162162, 0.0540540541, 0.1216216216, 0.1945945946);

in vec2 pass_TexCoord;
out vec4 out_Color;

vec4 greysc(vec4 inColor)
{
    return vec4(vec3(dot(vec3(0.2126f, 0.7152f, 0.0722f), inColor.rgb)), inColor.a);
}

vec2 mirror_h(vec2 coordinates)
{
    return vec2(1.0f-coordinates.x, coordinates.y);
}

vec2 mirror_v(vec2 coordinates)
{
    return vec2(coordinates.x, 1.0f-coordinates.y);
}

vec4 gaussian_blur(vec4 inColor, vec2 coord)
{
    inColor = texture(ColorTex, vec2(coord.x, coord.y)) * 0.2270270270;
    for (int i=0; i<4; i++)
    {
        inColor += texture(ColorTex, (vec2(coord.x-(offset_a[i]/600), coord.y-(offset_a[i]/600))))* weight_a[i];
        inColor += texture(ColorTex, (vec2(coord.x+(offset_b[i]/600), coord.y+(offset_b[i]/600))))* weight_b[i];
    }
    return inColor;
}

void main()
{
    vec2 textureCoord = pass_TexCoord;
    
    if (mirror_horiz == 1)
    {
        textureCoord = mirror_h(textureCoord);
    }
    if (mirror_vert == 1)
    {
        textureCoord = mirror_v(textureCoord);
    }
    
    vec4 TexColor = texture(ColorTex, textureCoord);
    out_Color = TexColor;
    
    if (gaus_blur == 1)
    {
        out_Color = gaussian_blur(out_Color, textureCoord);
    }
    
    if (greyscale == 1)
    {
        out_Color = greysc(out_Color);
    }
}






