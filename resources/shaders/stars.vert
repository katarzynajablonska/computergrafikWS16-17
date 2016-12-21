#version 150
#extension GL_ARB_explicit_attrib_location : require
// vertex attributes of VAO
layout(location = 0) in vec3 in_Position;
layout(location = 1) in vec3 in_Normal;

//Matrix Uniforms as specified with glUniformMatrix4fv
// the variables within the block are still part of the global scope and do not need to
// be qualified with the block name
uniform block_matrix
{
    mat4 ViewMatrix;
    mat4 ProjectionMatrix;
};

//out vec3 pass_Normal;

void main(void)
{
	gl_Position = (ProjectionMatrix  * ViewMatrix) * vec4(in_Position, 1.0);
	//pass_Normal = (NormalMatrix * vec4(in_Normal, 0.0)).xyz;
}