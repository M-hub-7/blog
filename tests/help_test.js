const Blogs = require('../models/blog')
const initialBlog = [
  {
    title: 'ceci est un blog',
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
  {
    title: 'j ai creer ce blog pour tester ma base de donnee',
    author: 'camine queen',
    url: 'caminequeen@gmail.com',
    likes: 20,
  },
]
const nonExistingId = async () => {
  const blog = new Blogs({ author: 'caminequeen' })
  await blog.save()
  await blog.deleteOne()
  return blog._id.toString()
}

const blogInDb = async () => {
  const blog = await Blogs.find({})
  return blog.map((blogs) => blogs.toJSON())
}

module.exports = {
  initialBlog,
  nonExistingId,
  blogInDb,
}
