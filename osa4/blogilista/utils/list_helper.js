const totalLikes = (blogs) => {
  return blogs.reduce((sum, blog) => sum + blog.likes, 0)
}

const favoriteBlog = (blogs) => {
  if (blogs.length === 0) {
    return null
  }

  let favoriteBlog = blogs[0]

  blogs.forEach(element => {
    if(element.likes > favoriteBlog.likes){
      favoriteBlog = element
    }
  })
  return favoriteBlog
}


const favoriteAuthor = (blogs) => {
  if (blogs.length === 0) {
    return null
  }
  const authors = {}
  blogs.forEach(blog => {
    if(authors[blog.author]){
      authors[blog.author] += 1
    }
    else{
      authors[blog.author] = 1
    }
  })
  let mostBlogs = null
  let blogCount = 0

  for(const author in authors){
    if (authors[author] > blogCount) {
      blogCount = authors[author]
      mostBlogs = author
    }

  }

  return {
    author: mostBlogs,
    blogs: blogCount
  }
}

const mostLikes = (blogs) => {
  if (blogs.length === 0) {
    return null
  }
  const authors= {}

  blogs.forEach(blog => {
    if(authors[blog.author]){
      authors[blog.author] += blog.likes
    }else{
      authors[blog.author] = blog.likes
    }
  })

  let favorite = null
  let likes = 0

  for(const author in authors){
    if(authors[author] > likes){
      favorite = author
      likes = authors[author]
    }
  }
  return {
    author: favorite,
    likes: authors[favorite]
  }
}

module.exports = {
  totalLikes,
  favoriteBlog,
  favoriteAuthor,
  mostLikes
}