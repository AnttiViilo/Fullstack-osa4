var _ = require("lodash");

const dummy = blogs => {
  return 1;
};

const totalLikes = blogs => {
  const reducer = (sum, item) => {
    return sum + item.likes;
  };

  return blogs.reduce(reducer, 0);
};

const favoriteBlog = blogs => {
  let maks = blogs[0].likes;
  let maxBlog = blogs[0];
  for (i = 0; i < blogs.length; i++) {
    if (blogs[i].likes > maks) {
      maks = blogs[i].likes;
      maxBlog = blogs[i];
    }
  }

  return maxBlog;
};

const mostBlogs = blogs => {
  const authors = blogs.map(blog => blog.author);
  authors.sort();
  let maks = 0;
  let aut = "";
  let j = 1;
  for (i = 0; i < authors.length - 1; i++) {
    if (authors[i] != authors[i + 1]) {
      if (j > maks) {
        maks = j;
        aut = authors[i];
      }
      j = 0;
    }
    j++;
    if (i === authors.length - 2 && authors[i] === authors[i + 1] && j > maks) {
      maks = j;
      aut = authors[i];
    }
  }
  return { author: aut, blogs: maks };
};

const mostLikes = blogs => {
  const fav = favoriteBlog(blogs).author;
  let like = 0;
  for (i = 0; i < blogs.length; i++) {
    if (blogs[i].author === fav) {
      like = like + blogs[i].likes;
    }
  }

  return { author: fav, likes: like };
};

module.exports = {
  totalLikes,
  dummy,
  favoriteBlog,
  mostBlogs,
  mostLikes
};
