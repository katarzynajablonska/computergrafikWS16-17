#version 150
#extension GL_ARB_explicit_attrib_location : require
// vertex attributes  uploaded with gl*3f
layout(location = 0) in vec3 in_Position;
// glColor* writes to third attribute 
layout(location = 3) in vec3 in_Color;

//Matrix Uniforms uploaded with glUniform*
// the variables within the block are still part of the global scope and do not need to
// be qualified with the block name
uniform block_matrix
{
    mat4 ModelViewMatrix;
    mat4 ProjectionMatrix;
};

out vec3 pass_Color;

void main() {
	gl_Position = ProjectionMatrix * ModelViewMatrix * vec4(in_Position, 1.0);
	pass_Color = in_Color;
}