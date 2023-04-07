export function isSupportWebgl(){
  const canvas = document.createElement('canvas')
  const gl = canvas.getContext('webgl')
  if (gl && gl instanceof WebGLRenderingContext) {
    return true
  } else {
    return false
  }
}
