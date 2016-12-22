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

// these variables would be in the Light structure if we had different values, since
// they are const variables, I will declare them globally here, not within the struct
const vec3 specularC= vec3(1.0, 1.0, 1.0);
const float shininess = 16.0;
const float screenGamma = 2.2;

uniform struct Light
{
    vec3 ambient;
    vec3 diffuse;
}light;

void main()
{
    vec4 TexColor = texture(ColorTex, pass_TexCoord);
    light.ambient = TexColor.rgb;
    light.diffuse = TexColor.rgb;
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
    vec3 colorLinear = light.ambient + lambertian * light.diffuse + specular * specularC;
    vec3 colorGammaCorrected = pow(colorLinear, vec3(1.0/screenGamma));
    
    out_Color = vec4(colorGammaCorrected, 1.0);
}
