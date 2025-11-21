const POSTS_PER_PAGE = 5;

export function getRoot(request, reply) {
  const page = parseInt(request.query.page) || 1;
  const { db } = request.server;

  const offset = (page - 1) * POSTS_PER_PAGE;

  const countResult = db.prepare("SELECT COUNT(*) as count FROM posts").get();
  const totalPosts = countResult.count;
  const totalPages = Math.ceil(totalPosts / POSTS_PER_PAGE);

  const posts = db.prepare(
    "SELECT * FROM posts ORDER BY created_at ASC LIMIT ? OFFSET ?"
  ).all(POSTS_PER_PAGE, offset);

  return reply.view("index", {
    title: "Blog Posts",
    posts: posts,
    totalPages: totalPages,
    currentPage: page,
    searchQuery: null
  });
}

export function sum(a = 0, b = 0) {
    return a + b;
}
