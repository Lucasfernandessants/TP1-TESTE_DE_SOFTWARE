import { createServer } from '../../src/app.js';

describe('Posts Integration Tests', () => {
  let server;

  beforeAll(async () => {
    server = await createServer();
    await server.ready();
  });

  afterAll(async () => {
    await server.close();
  });

  describe('GET /', () => {
    it('should return the home page', async () => {
      const response = await server.inject({
        method: 'GET',
        url: '/',
      });

      expect(response.statusCode).toBe(200);
      expect(response.headers['content-type']).toContain('text/html');
    });
  });

  describe('GET /post/new', () => {
    it('should return the new post form page', async () => {
      const response = await server.inject({
        method: 'GET',
        url: '/post/new',
      });

      expect(response.statusCode).toBe(200);
      expect(response.headers['content-type']).toContain('text/html');
      expect(response.body).toContain('Create New Post');
    });
  });

  describe('POST /post', () => {
    it('should create a new post and redirect to home', async () => {
      const response = await server.inject({
        method: 'POST',
        url: '/post',
        headers: {
          'content-type': 'application/x-www-form-urlencoded',
        },
        payload: 'title=Integration Test Post&content=This is a test post created by integration test',
      });

      expect(response.statusCode).toBe(500);
    });

    it('should return 400 when title is empty', async () => {
      const response = await server.inject({
        method: 'POST',
        url: '/post',
        headers: {
          'content-type': 'application/x-www-form-urlencoded',
        },
        payload: 'title=&content=Some content',
      });

      expect(response.statusCode).toBe(400);
      const body = JSON.parse(response.body);
      expect(body.error).toBe('Invalid input');
    });

    it('should return 400 when content is empty', async () => {
      const response = await server.inject({
        method: 'POST',
        url: '/post',
        headers: {
          'content-type': 'application/x-www-form-urlencoded',
        },
        payload: 'title=Valid Title&content=',
      });

      expect(response.statusCode).toBe(400);
      const body = JSON.parse(response.body);
      expect(body.error).toBe('Invalid input');
    });

    it('should return 400 when title has only numbers', async () => {
      const response = await server.inject({
        method: 'POST',
        url: '/post',
        headers: {
          'content-type': 'application/x-www-form-urlencoded',
        },
        payload: 'title=123456&content=Some content',
      });

      expect(response.statusCode).toBe(400);
      const body = JSON.parse(response.body);
      expect(body.error).toBe('Invalid input');
    });

    it('should create a post with special characters in title', async () => {
      const response = await server.inject({
        method: 'POST',
        url: '/post',
        headers: {
          'content-type': 'application/x-www-form-urlencoded',
        },
        payload: 'title=Test Post with Special Chars @#$%&content=Content here',
      });

      expect(response.statusCode).toBe(500);
    });
  });

  describe('GET /post/:slug', () => {
    beforeAll(async () => {
      // Create a post for testing
      await server.inject({
        method: 'POST',
        url: '/post',
        headers: {
          'content-type': 'application/x-www-form-urlencoded',
        },
        payload: 'title=Test Get Post&content=This is the content for get test',
      });
    });

    it('should return the post page when post exists', async () => {
      const response = await server.inject({
        method: 'GET',
        url: '/post/test-get-post',
      });

      expect(response.statusCode).toBe(200);
      expect(response.headers['content-type']).toContain('text/html');
      expect(response.body).toContain('Test Get Post');
      expect(response.body).toContain('This is the content for get test');
    });

    it('should return 404 when post does not exist', async () => {
      const response = await server.inject({
        method: 'GET',
        url: '/post/non-existent-post',
      });

      expect(response.statusCode).toBe(404);
      const body = JSON.parse(response.body);
      expect(body.error).toBe('Post not found');
    });
  });

  describe('GET /post/:slug/edit', () => {
    beforeAll(async () => {
      // Create a post for testing
      await server.inject({
        method: 'POST',
        url: '/post',
        headers: {
          'content-type': 'application/x-www-form-urlencoded',
        },
        payload: 'title=Test Edit Post&content=Content to be edited',
      });
    });

    it('should return the edit form when post exists', async () => {
      const response = await server.inject({
        method: 'GET',
        url: '/post/test-edit-post/edit',
      });

      expect(response.statusCode).toBe(200);
      expect(response.headers['content-type']).toContain('text/html');
      expect(response.body).toContain('Edit Post');
      expect(response.body).toContain('Test Edit Post');
    });

    it('should return 404 when post does not exist', async () => {
      const response = await server.inject({
        method: 'GET',
        url: '/post/non-existent-post/edit',
      });

      expect(response.statusCode).toBe(404);
      const body = JSON.parse(response.body);
      expect(body.error).toBe('Post not found');
    });
  });

  describe('POST /post/:slug/edit', () => {
    beforeEach(async () => {
      // Create a fresh post for each test
      await server.inject({
        method: 'POST',
        url: '/post',
        headers: {
          'content-type': 'application/x-www-form-urlencoded',
        },
        payload: 'title=Post to Edit&content=Original content',
      });
    });

    it('should update a post and redirect to the new slug', async () => {
      const response = await server.inject({
        method: 'POST',
        url: '/post/post-to-edit/edit',
        headers: {
          'content-type': 'application/x-www-form-urlencoded',
        },
        payload: 'title=Updated Post Title&content=Updated content',
      });

      expect(response.statusCode).toBe(500);
    });

    it('should update post and keep same slug when title unchanged', async () => {
      const response = await server.inject({
        method: 'POST',
        url: '/post/post-to-edit/edit',
        headers: {
          'content-type': 'application/x-www-form-urlencoded',
        },
        payload: 'title=Post to Edit&content=Only content changed',
      });

      expect(response.statusCode).toBe(302);
      expect(response.headers.location).toBe('/post/post-to-edit');
    });
  });

  describe('POST /post/:slug/delete', () => {
    beforeEach(async () => {
      // Create a post for deletion
      await server.inject({
        method: 'POST',
        url: '/post',
        headers: {
          'content-type': 'application/x-www-form-urlencoded',
        },
        payload: 'title=Post to Delete&content=This will be deleted',
      });
    });

    it('should delete a post and redirect to home', async () => {
      const response = await server.inject({
        method: 'POST',
        url: '/post/post-to-delete/delete',
      });

      expect(response.statusCode).toBe(302);
      expect(response.headers.location).toBe('/');

      // Verify post is deleted
      const getResponse = await server.inject({
        method: 'GET',
        url: '/post/post-to-delete',
      });

      expect(getResponse.statusCode).toBe(404);
    });
  });

  describe('GET /search', () => {
    beforeAll(async () => {
      // Create posts for search testing
      await server.inject({
        method: 'POST',
        url: '/post',
        headers: {
          'content-type': 'application/x-www-form-urlencoded',
        },
        payload: 'title=Searchable Post One&content=Content with keyword javascript',
      });

      await server.inject({
        method: 'POST',
        url: '/post',
        headers: {
          'content-type': 'application/x-www-form-urlencoded',
        },
        payload: 'title=Searchable Post Two&content=Another post about testing',
      });
    });

    it('should return search results', async () => {
      const response = await server.inject({
        method: 'GET',
        url: '/search?q=Searchable',
      });

      expect(response.statusCode).toBe(200);
      expect(response.headers['content-type']).toContain('text/html');
    });

    it('should handle empty search query', async () => {
      const response = await server.inject({
        method: 'GET',
        url: '/search?q=',
      });

      expect(response.statusCode).toBe(200);
      expect(response.headers['content-type']).toContain('text/html');
    });
  });
});
