import { getEditPost, editPost } from '../../src/controllers/editPost.controller.js';

describe('editPost Controller', () => {
  describe('getEditPost', () => {
    it('should return the edit view when post is found', () => {
      // Mock post data
      const mockPost = {
        id: 1,
        title: 'Test Post',
        slug: 'test-post',
        content: 'Test content',
      };

      let getCalledWith = null;
      let viewCalled = false;
      let viewCalledWith = null;

      // Mock request object
      const request = {
        params: {
          slug: 'test-post',
        },
        server: {
          db: {
            prepare: (query) => {
              return {
                get: (slug) => {
                  getCalledWith = slug;
                  return mockPost;
                },
              };
            },
          },
        },
      };

      // Mock reply object
      const reply = {
        view: (template, data) => {
          viewCalled = true;
          viewCalledWith = { template, data };
        },
      };

      // Call the function
      getEditPost(request, reply);

      // Assertions
      expect(getCalledWith).toBe('test-post');
      expect(viewCalled).toBe(true);
      expect(viewCalledWith.template).toBe('edit');
      expect(viewCalledWith.data.title).toBe('Edit Post');
      expect(viewCalledWith.data.post).toEqual(mockPost);
    });

    it('should return 404 when post is not found', () => {
      let statusCalledWith = null;
      let sendCalledWith = null;

      // Mock request object
      const request = {
        params: {
          slug: 'non-existent-post',
        },
        server: {
          db: {
            prepare: () => {
              return {
                get: () => null,
              };
            },
          },
        },
      };

      // Mock reply object
      const reply = {
        status: (code) => {
          statusCalledWith = code;
          return {
            send: (data) => {
              sendCalledWith = data;
            },
          };
        },
      };

      // Call the function
      getEditPost(request, reply);

      // Assertions
      expect(statusCalledWith).toBe(404);
      expect(sendCalledWith).toEqual({ error: 'Post not found' });
    });
  });

  describe('editPost', () => {
    it('should update a post and redirect to the new slug', () => {
      let prepareCalledWith = null;
      let runCalledWith = null;
      let redirectCalledWith = null;

      // Mock statement
      const mockStatement = {
        run: (...args) => {
          runCalledWith = args;
        },
      };

      // Mock request object
      const request = {
        params: {
          slug: 'old-slug',
        },
        body: {
          title: 'Updated Title',
          content: 'Updated content',
        },
        server: {
          db: {
            prepare: (query) => {
              prepareCalledWith = query;
              return mockStatement;
            },
          },
        },
      };

      // Mock reply object
      const reply = {
        redirect: (path) => {
          redirectCalledWith = path;
        },
      };

      // Call the function
      editPost(request, reply);

      // Assertions
      expect(prepareCalledWith).toBe('UPDATE posts SET title = ?, slug = ?, content = ? WHERE slug = ?');
      expect(runCalledWith[0]).toBe('Updated Title');
      expect(runCalledWith[1]).toBe('updated-title'); // slugified
      expect(runCalledWith[2]).toBe('Updated content');
      expect(runCalledWith[3]).toBe('old-slug');
      expect(redirectCalledWith).toBe('/post/updated-title');
    });

    it('should keep the same slug when title does not change', () => {
      let runCalledWith = null;
      let redirectCalledWith = null;

      // Mock statement
      const mockStatement = {
        run: (...args) => {
          runCalledWith = args;
        },
      };

      // Mock request object
      const request = {
        params: {
          slug: 'my-post',
        },
        body: {
          title: 'My Post',
          content: 'New content for existing post',
        },
        server: {
          db: {
            prepare: () => mockStatement,
          },
        },
      };

      // Mock reply object
      const reply = {
        redirect: (path) => {
          redirectCalledWith = path;
        },
      };

      // Call the function
      editPost(request, reply);

      // Assertions
      expect(runCalledWith[0]).toBe('My Post');
      expect(runCalledWith[1]).toBe('my-post'); // slug stays the same
      expect(runCalledWith[2]).toBe('New content for existing post');
      expect(runCalledWith[3]).toBe('my-post');
      expect(redirectCalledWith).toBe('/post/my-post');
    });

    it('should update only content when title stays the same', () => {
      let runCalledWith = null;

      // Mock statement
      const mockStatement = {
        run: (...args) => {
          runCalledWith = args;
        },
      };

      // Mock request object
      const request = {
        params: {
          slug: 'existing-post',
        },
        body: {
          title: 'Existing Post',
          content: 'Only the content has changed',
        },
        server: {
          db: {
            prepare: () => mockStatement,
          },
        },
      };

      // Mock reply object
      const reply = {
        redirect: () => {},
      };

      // Call the function
      editPost(request, reply);

      // Assertions
      expect(runCalledWith[2]).toBe('Only the content has changed');
      expect(runCalledWith[0]).toBe('Existing Post');
    });

    it('should update only title when content stays the same', () => {
      let runCalledWith = null;

      // Mock statement
      const mockStatement = {
        run: (...args) => {
          runCalledWith = args;
        },
      };

      // Mock request object
      const request = {
        params: {
          slug: 'old-title',
        },
        body: {
          title: 'New Title',
          content: 'Same content',
        },
        server: {
          db: {
            prepare: () => mockStatement,
          },
        },
      };

      // Mock reply object
      const reply = {
        redirect: () => {},
      };

      // Call the function
      editPost(request, reply);

      // Assertions
      expect(runCalledWith[0]).toBe('New Title');
      expect(runCalledWith[1]).toBe('new-title');
      expect(runCalledWith[2]).toBe('Same content');
    });


    it('should handle title with unicode and emojis', () => {
      let runCalledWith = null;
      let redirectCalledWith = null;

      // Mock statement
      const mockStatement = {
        run: (...args) => {
          runCalledWith = args;
        },
      };

      // Mock request object
      const request = {
        params: {
          slug: 'old-slug',
        },
        body: {
          title: 'Título com acentos 🚀 e émojis',
          content: 'Content',
        },
        server: {
          db: {
            prepare: () => mockStatement,
          },
        },
      };

      // Mock reply object
      const reply = {
        redirect: (path) => {
          redirectCalledWith = path;
        },
      };

      // Call the function
      editPost(request, reply);

      // Assertions
      expect(runCalledWith[1]).toMatch(/^[a-z0-9-]+$/); // slug should only have lowercase, numbers, and hyphens
      expect(redirectCalledWith).toMatch(/^\/post\/[a-z0-9-]+$/);
    });

    it('should handle content with HTML tags', () => {
      let runCalledWith = null;

      // Mock statement
      const mockStatement = {
        run: (...args) => {
          runCalledWith = args;
        },
      };

      // Mock request object
      const request = {
        params: {
          slug: 'post-slug',
        },
        body: {
          title: 'Post Title',
          content: '<script>alert("xss")</script><p>Content</p>',
        },
        server: {
          db: {
            prepare: () => mockStatement,
          },
        },
      };

      // Mock reply object
      const reply = {
        redirect: () => {},
      };

      // Call the function
      editPost(request, reply);

      // Assertions
      expect(runCalledWith[2]).toBe('<script>alert("xss")</script><p>Content</p>');
    });

    it('should handle empty title edge case', () => {
      let runCalledWith = null;
      let redirectCalledWith = null;

      // Mock statement
      const mockStatement = {
        run: (...args) => {
          runCalledWith = args;
        },
      };

      // Mock request object
      const request = {
        params: {
          slug: 'old-slug',
        },
        body: {
          title: '',
          content: 'Content',
        },
        server: {
          db: {
            prepare: () => mockStatement,
          },
        },
      };

      // Mock reply object
      const reply = {
        redirect: (path) => {
          redirectCalledWith = path;
        },
      };

      // Call the function
      editPost(request, reply);

      // Assertions
      expect(runCalledWith[0]).toBe('');
      expect(runCalledWith[1]).toBe(''); // empty slug from empty title
      expect(redirectCalledWith).toBe('/post/');
    });

    it('should handle empty content edge case', () => {
      let runCalledWith = null;

      // Mock statement
      const mockStatement = {
        run: (...args) => {
          runCalledWith = args;
        },
      };

      // Mock request object
      const request = {
        params: {
          slug: 'post-slug',
        },
        body: {
          title: 'Valid Title',
          content: '',
        },
        server: {
          db: {
            prepare: () => mockStatement,
          },
        },
      };

      // Mock reply object
      const reply = {
        redirect: () => {},
      };

      // Call the function
      editPost(request, reply);

      // Assertions
      expect(runCalledWith[2]).toBe('');
    });

    it('should handle title with extra spaces', () => {
      let runCalledWith = null;
      let redirectCalledWith = null;

      // Mock statement
      const mockStatement = {
        run: (...args) => {
          runCalledWith = args;
        },
      };

      // Mock request object
      const request = {
        params: {
          slug: 'old-slug',
        },
        body: {
          title: '  Title  With  Spaces  ',
          content: 'Content',
        },
        server: {
          db: {
            prepare: () => mockStatement,
          },
        },
      };

      // Mock reply object
      const reply = {
        redirect: (path) => {
          redirectCalledWith = path;
        },
      };

      // Call the function
      editPost(request, reply);

      // Assertions
      expect(runCalledWith[1]).toBe('title-with-spaces'); // extra spaces removed by slugify
      expect(redirectCalledWith).toBe('/post/title-with-spaces');
    });

    it('should handle very long content', () => {
      let runCalledWith = null;

      const longContent = 'a'.repeat(10000);

      // Mock statement
      const mockStatement = {
        run: (...args) => {
          runCalledWith = args;
        },
      };

      // Mock request object
      const request = {
        params: {
          slug: 'post-slug',
        },
        body: {
          title: 'Post Title',
          content: longContent,
        },
        server: {
          db: {
            prepare: () => mockStatement,
          },
        },
      };

      // Mock reply object
      const reply = {
        redirect: () => {},
      };

      // Call the function
      editPost(request, reply);

      // Assertions
      expect(runCalledWith[2]).toBe(longContent);
      expect(runCalledWith[2].length).toBe(10000);
    });
  });
});
