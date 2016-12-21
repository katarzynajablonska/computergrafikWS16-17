#include "application.hpp"
#include "utils.hpp"

#include <glbinding/gl/gl.h>
// use gl definitions from glbinding 
using namespace gl;

#include <glm/gtc/matrix_transform.hpp>
#include <glm/gtc/matrix_inverse.hpp>

#include <iostream>

/*Application::Application(std::string const& resource_path)
 :m_resource_path{resource_path}
 ,block_matrix_data.m_view_transform{glm::translate(glm::fmat4{}, glm::fvec3{0.0f, 0.0f, 4.0f})}
 ,block_matrix_data.m_view_projection{1.0}
 ,m_shaders{}
{}*/

// the constructor needed to be changed because there was some weird problem with
// block_matrix_data.m_view_transform and block_matrix_data.m_view_projection in the member init list
Application::Application(std::string const& resource_path)
{
    m_resource_path = resource_path;
    block_matrix_data.m_view_transform = glm::translate(glm::fmat4{}, glm::fvec3{0.0f, 0.0f, 4.0f});
    block_matrix_data.m_view_projection = glm::fmat4{1.0};
    m_shaders = {};
}

Application::~Application() {
  // free all shader program objects
  for (auto const& pair : m_shaders) {
    glDeleteProgram(pair.second.handle);
  }
}

void Application::setProjection(glm::fmat4 const& projection_mat) {
  block_matrix_data.m_view_projection = projection_mat;
  updateProjection();
}

// update shader uniform locations
void Application::updateUniformLocations() {
  for (auto& pair : m_shaders) {
    for (auto& uniform : pair.second.u_locs) {
      // store uniform location in map
      uniform.second = utils::glGetUniformLocation(pair.second.handle, uniform.first.c_str());
    }
  }
}

std::map<std::string, shader_program>& Application::getShaderPrograms() {
  return m_shaders;
}