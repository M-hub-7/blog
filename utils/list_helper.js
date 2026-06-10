const dummy = (blog) => {
  if (Array.isArray(blog)) {
    return 1
  }
}

const totalLikes = (blog) => {
  return blog.reduce((sum, blogs) => {
    return sum + blogs.likes
  }, 0)
}

const favoriteBlog = (blog) => {
  let favori = blog[0]
  blog.forEach((blogs) => {
    if (blogs.likes > favori.likes) {
      favori = blogs
    }
  })
  return favori
}
module.exports = {
  dummy,
  totalLikes,
  favoriteBlog,
}
