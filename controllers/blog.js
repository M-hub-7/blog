const blogRouter = require('express').Router()
const Blog = require('../models/blog')

blogRouter.get('/', (request, response) => {
  Blog.find({}).then((blogs) => {
    response.json(blogs)
  })
})
blogRouter.get('/:id', (request, response, next) => {
  const blog = Blog.findById(request.params.id)
    .then((result) => {
      if (result) {
        response.json(blog)
      } else {
        response.status(404).end()
      }
    })
    .catch((error) => next(error))
})

blogRouter.post('/', (request, response, next) => {
  const body = request.body
  const blog = new Blog({
    tittle: body.tittle,
    author: body.author,
    url: body.url,
    likes: body.likes,
  })

  blog
    .save()
    .then((blogsaved) => {
      response.json(blogsaved)
    })
    .catch((error) => next(error))
})

blogRouter.delete('/:id', (request, response, next) => {
  Blog.findOneAndDelete(request.params.id)
    .then(() => {
      response.status(204).end()
    })
    .catch((error) => next(error))
})

blogRouter.put('/:id', (request, response, next) => {
  const body = request.body
  Blog.findId(request.params.id)
    .then((blog) => {
      if (!blog) {
        return response.status(404).end()
      }

      ;((blog.tittle = body.tittle),
      (blog.author = body.author),
      (blog.url = body.url),
      (blog.likes = body.likes),
      blog.save().then((updatedBlog) => {
        return response.json(updatedBlog)
      }))
    })
    .catch((error) => next(error))
})
module.exports = blogRouter
