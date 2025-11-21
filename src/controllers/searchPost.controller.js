const POSTS_PER_PAGE = 5;

export function searchPost(request, reply) {
  const { q } = request.query;
  const page = parseInt(request.query.page) || 1;
  const offset = (page - 1) * POSTS_PER_PAGE;
  const { db } = request.server;

  let posts = [];
  let pageTitle = "";
  let count = 0;

  if (q && q.trim() !== "") {
    const searchTerm = `%${q}%`;

    const countResult = db.prepare(
      "SELECT COUNT(*) as count FROM posts WHERE title LIKE ?"
    ).get(searchTerm);
    count = countResult.count;

    posts = db.prepare(
      "SELECT * FROM posts WHERE title LIKE ? ORDER BY created_at ASC LIMIT ? OFFSET ?"
    ).all(searchTerm, POSTS_PER_PAGE, offset);

    pageTitle = `Resultados para: "${q}"`;

  } else {
    const countResult = db.prepare("SELECT COUNT(*) as count FROM posts").get();
    count = countResult.count;

    posts = db.prepare(
      "SELECT * FROM posts ORDER BY created_at ASC LIMIT ? OFFSET ?"
    ).all(POSTS_PER_PAGE, offset);

    pageTitle = "Todos os Posts";
  }

  const totalPages = Math.ceil(count / POSTS_PER_PAGE);

  return reply.view("index", {
    title: pageTitle,
    posts: posts,
    totalPages,
    currentPage: page,
    searchQuery: q
  });
}