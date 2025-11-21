export async function getRoot(request, reply) {
    const { db } = request.server;
    const posts = db.prepare("SELECT * FROM posts").all();
    return reply.view("index", { title: "homepage", posts });
}

export function sum(a = 0, b = 0) {
    return a + b;
}
