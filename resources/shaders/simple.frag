#version 150

precision mediump float;

in vec3 pass_Normal;
out vec4 out_Color;
//the actual color of the planet that should be passed through shader
in vec3 pass_Color;

in vec3 normalInterp;
in vec3 vertPos;
in vec3 LightPos;

vec3 ambient;
vec3 diffuse;
const vec3 specularC= vec3(1.0, 1.0, 1.0);
const float shininess = 16.0;
const float screenGamma = 2.2;

void main()
{
    ambient = pass_Color;
    diffuse = pass_Color;
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
}
