const { test, after, beforeEach } = require('node:test')
const supertest = require('supertest')
const mongoose = require('mongoose')
const app = require('../app')
const Blog = require('../models/blog')
//const Note = require('../models/blog')
const initialBlog = [
  {
    title: 'mon blog de test',
    author: 'camine queen',
    url: 'caminequeen@gmail.com',
    likes: 20,
  },
  {
    title: 'mon blog de test',
    author: 'camine queen',
    url: 'caminequeen@gmail.com',
    likes: 20,
  },
]
beforeEach(async () => {
  await Blog.deleteMany({})
  await Blog.insertMany(initialBlog)
})
const api = supertest(app)
test('note are retourned as json', async () => {
  await api
    .get('/api/blogs')
    .expect(200)
    .expect('Content-Type', /application\/json/)
})

after(async () => {
  await mongoose.connection.close()
})
