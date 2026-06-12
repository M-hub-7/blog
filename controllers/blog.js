const blogRouter = require('express').Router()
const Blog = require('../models/blog')

blogRouter.get('/', async (request, response) => {
  const blog = await Blog.find({})
  response.json(blog)
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

blogRouter.post('/', async (request, response) => {
  const body = request.body
  const blog = new Blog({
    title: body.title,
    author: body.author,
    url: body.url,
    likes: body.likes,
  })

  const result = await blog.save()
  response.status(201).json(result)
})

blogRouter.delete('/:id', async (request, response) => {
  await Blog.findByIdAndDelete(request.params.id)

  response.status(204).end()
})

blogRouter.put('/:id', (request, response, next) => {
  const body = request.body
  Blog.findId(request.params.id)
    .then((blog) => {
      if (!blog) {
        return response.status(404).end()
      }

      ;((blog.likes = body.likes),
        blog.save().then((updatedBlog) => {
          return response.json(updatedBlog)
        }))
    })
    .catch((error) => next(error))
})

module.exports = blogRouter
