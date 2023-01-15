export function resize(width: number, height: number) {
  const windowWidth = window.innerWidth - 100
  const windowHeight = window.innerHeight - 100

  const imageRatio = width / height
  const windowRatio = windowWidth / windowHeight

  if (imageRatio > windowRatio) {
    width = windowWidth
    height = width / imageRatio
  } else {
    height = windowHeight
    width = height * imageRatio
  }

  width = Math.round(width)
  height = Math.round(height)

  return {
    width,
    height,
  }
}
