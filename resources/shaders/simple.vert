#version 150
#extension GL_ARB_explicit_attrib_location : require
// vertex attributes of VAO
layout(location = 0) in vec3 in_Position;
layout(location = 1) in vec3 in_Normal;
layout(location = 2) in vec2 in_TexCoord;

// the variables within the block are still part of the global scope and do not need to
// be qualified with the block name
layout (std140) uniform block_matrix
{
    mat4 ViewMatrix;
    mat4 ProjectionMatrix;
};

layout (std140) buffer light_data
{
    std::vector<vec3> lights;
}

//Matrix Uniforms as specified with glUniformMatrix4fv
uniform mat4 ModelMatrix;
uniform mat4 NormalMatrix;
uniform vec3 Color;
uniform vec3 Light;

out vec3 pass_Normal;
out vec3 pass_Color;
out vec3 normalInterp;
out vec3 vertPos;
out vec3 LightPos;
out vec2 pass_TexCoord;

void main(void)
{
	gl_Position = (ProjectionMatrix  * ViewMatrix * ModelMatrix) * vec4(in_Position, 1.0);
	pass_Normal = (NormalMatrix * vec4(in_Normal, 0.0)).xyz;
    pass_Color = Color;
    vec4 vertPos4 = ViewMatrix * ModelMatrix * vec4(in_Position, 1.0);
    vertPos = vec3(vertPos4) / vertPos4.w;
    normalInterp = vec3(NormalMatrix * vec4(in_Normal, 0.0));
    LightPos = Light;
    pass_TexCoord = in_TexCoord;
}
