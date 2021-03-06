#version 150
#define MAX_NUM_TOTAL_LIGHTS 10
#extension GL_ARB_shader_storage_buffer_object : require

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

struct Light
{
	vec3 ambient;
	vec3 diffuse;
}light_data;

layout (std140) buffer lights
{
	Light light[MAX_NUM_TOTAL_LIGHTS];
	int numLights;
};

const vec3 specularC= vec3(1.0, 1.0, 1.0);
const float shininess = 16.0;
const float screenGamma = 2.2;

void main()
{
    vec4 TexColor = texture(ColorTex, pass_TexCoord);
    light_data.ambient = TexColor.rgb;
    light_data.diffuse = TexColor.rgb;
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
    vec3 colorLinear = light_data.ambient + lambertian * light_data.diffuse + specular * specularC;
    vec3 colorGammaCorrected = pow(colorLinear, vec3(1.0/screenGamma));
    
    out_Color = vec4(colorGammaCorrected, 1.0);
}
