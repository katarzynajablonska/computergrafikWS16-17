#version 150

precision mediump float;

uniform  sampler2D ColorTex;
in vec3 pass_Normal;
out vec4 out_Color;
//the actual color of the planet that should be passed through shader
in vec3 pass_Color;

in vec3 normalInterp;
in vec3 vertPos;
in vec3 LightPos;
in vec2 pass_TexCoord;

vec3 ambient;
vec3 diffuse;
const vec3 specularC= vec3(1.0, 1.0, 1.0);
const float shininess = 16.0;
const float screenGamma = 2.2;

uniform int greyscale = 0;
uniform int mirror_horiz = 0;
uniform int mirror_vert = 0;
uniform int gaus_blur = 0;
uniform float offset_a[5] = float[](0.0, 1.0, 2.0, 3.0, 4.0);
uniform float offset_b[5] = float[](4.0, 3.0, 2.0, 1.0, 0.0);
uniform float weight_a[4] = float[](0.1945945946, 0.1216216216, 0.0540540541, 0.0162162162);
uniform float weight_b[4] = float[](0.0162162162, 0.0540540541, 0.1216216216, 0.1945945946);

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
    ambient = TexColor.rgb;
    diffuse = TexColor.rgb;
    vec3 normal = normalize(normalInterp);
    vec3 lightDir = normalize(LightPos - vertPos);
    
    float lambertian = max(dot(lightDir,normal), 0.0);
    float specular = 0.0;
    
    if(lambertian > 0.0)
    {
        vec3 viewDir = normalize(-vertPos);
        
        // this is blinn phong
        vec3 halfDir = normalize(lightDir + viewDir);
        float specAngle = max(dot(halfDir, normal), 0.0);
        specular = pow(specAngle, shininess);
    }
    vec3 colorLinear = ambient + lambertian * diffuse + specular * specularC;
    vec3 colorGammaCorrected = pow(colorLinear, vec3(1.0/screenGamma));
    
    out_Color = vec4(colorGammaCorrected, 1.0);
    
    if (gaus_blur == 1)
    {
        out_Color = gaussian_blur(out_Color, textureCoord);
    }
    
    if (greyscale == 1)
    {
        out_Color = greysc(out_Color);
    }
}
