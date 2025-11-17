
export function searchPost(request, reply) {
  const { q } = request.query;
  const { db } = request.server;

  let posts = [];
  let pageTitle = "Resultados da Pesquisa";

  if (q && q.trim() !== "") {

    const searchTerm = `%${q}%`;

    posts = db.prepare(
      "SELECT * FROM posts WHERE title LIKE ?"
    ).all(searchTerm);
    
    pageTitle = `Resultados para: "${q}"`;
    
  } else {
    posts = db.prepare("SELECT * FROM posts").all();
    pageTitle = "Todos os Posts";
  }

  return reply.view("index", {
    title: pageTitle,
    posts: posts,
    searchQuery: q 
  });
}