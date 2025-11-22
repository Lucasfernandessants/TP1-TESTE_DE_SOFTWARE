import { getNewPost, createPost } from '../../src/controllers/createPost.controller.js';

describe('createPost Controller', () => {
  describe('getNewPost', () => {
    it('should return the new post view', () => {
      let viewCalled = false;
      let viewCalledWith = null;

      // Mock request object
      const request = {};

      // Mock reply object
      const reply = {
        view: (template, data) => {
          viewCalled = true;
          viewCalledWith = { template, data };
        },
      };

      // Call the function
      getNewPost(request, reply);

      // Assertions
      expect(viewCalled).toBe(true);
      expect(viewCalledWith.template).toBe('new');
      expect(viewCalledWith.data.title).toBe('Create New Post');
    });
  });

  describe('createPost', () => {
    it('should create a post and redirect to home when input is valid', () => {
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
        body: {
          title: 'New Post Title',
          content: 'This is the content of the new post',
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
      createPost(request, reply);

      // Assertions
      expect(prepareCalledWith).toBe(
        'INSERT INTO posts (title, slug, content, created_at) VALUES (?, ?, ?, CURRENT_TIMESTAMP)'
      );
      expect(runCalledWith[0]).toBe('New Post Title');
      expect(runCalledWith[1]).toBe('new-post-title'); // slugified
      expect(runCalledWith[2]).toBe('This is the content of the new post');
      expect(redirectCalledWith).toBe('/');
    });

    it('should return 400 when title is empty', () => {
      let statusCalledWith = null;
      let sendCalledWith = null;

      // Mock request object
      const request = {
        body: {
          title: '',
          content: 'Some content',
        },
        server: {
          db: {
            prepare: () => ({}),
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
              return data;
            },
          };
        },
      };

      // Call the function
      createPost(request, reply);

      // Assertions
      expect(statusCalledWith).toBe(400);
      expect(sendCalledWith.error).toBe('Invalid input');
      expect(sendCalledWith.details).toBeDefined();
    });

    it('should return 400 when content is empty', () => {
      let statusCalledWith = null;
      let sendCalledWith = null;

      // Mock request object
      const request = {
        body: {
          title: 'Valid Title',
          content: '',
        },
        server: {
          db: {
            prepare: () => ({}),
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
              return data;
            },
          };
        },
      };

      // Call the function
      createPost(request, reply);

      // Assertions
      expect(statusCalledWith).toBe(400);
      expect(sendCalledWith.error).toBe('Invalid input');
      expect(sendCalledWith.details).toBeDefined();
    });

    it('should return 400 when title has no letters', () => {
      let statusCalledWith = null;
      let sendCalledWith = null;

      // Mock request object
      const request = {
        body: {
          title: '123',
          content: 'Some content',
        },
        server: {
          db: {
            prepare: () => ({}),
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
              return data;
            },
          };
        },
      };

      // Call the function
      createPost(request, reply);

      // Assertions
      expect(statusCalledWith).toBe(400);
      expect(sendCalledWith.error).toBe('Invalid input');
      expect(sendCalledWith.details).toBeDefined();
    });

    it('should return 400 when title exceeds 100 characters', () => {
      let statusCalledWith = null;
      let sendCalledWith = null;

      // Mock request object
      const request = {
        body: {
          title: 'a'.repeat(101), // 101 characters
          content: 'Some content',
        },
        server: {
          db: {
            prepare: () => ({}),
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
              return data;
            },
          };
        },
      };

      // Call the function
      createPost(request, reply);

      // Assertions
      expect(statusCalledWith).toBe(400);
      expect(sendCalledWith.error).toBe('Invalid input');
      expect(sendCalledWith.details).toBeDefined();
    });

    it('should create post when title has exactly 100 characters', () => {
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
        body: {
          title: 'a'.repeat(100), // exactly 100 characters
          content: 'Some content',
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
      createPost(request, reply);

      // Assertions
      expect(prepareCalledWith).toBe(
        'INSERT INTO posts (title, slug, content, created_at) VALUES (?, ?, ?, CURRENT_TIMESTAMP)'
      );
      expect(runCalledWith[0]).toBe('a'.repeat(100));
      expect(redirectCalledWith).toBe('/');
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
        body: {
          title: '  Title With Spaces  ',
          content: 'Some content',
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
      createPost(request, reply);

      // Assertions
      expect(runCalledWith[0]).toBe('  Title With Spaces  ');
      expect(runCalledWith[1]).toBe('title-with-spaces'); // slugified without extra spaces
      expect(redirectCalledWith).toBe('/');
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
        body: {
          title: 'Title with émojis 🚀 and çédille',
          content: 'Some content',
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
      createPost(request, reply);

      // Assertions
      expect(runCalledWith[0]).toBe('Title with émojis 🚀 and çédille');
      expect(runCalledWith[1]).toMatch(/^[a-z0-9-]+$/); // slugified should only have lowercase, numbers, and hyphens
      expect(redirectCalledWith).toBe('/');
    });


    it('should handle HTML content without breaking', () => {
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
        body: {
          title: 'Post with HTML',
          content: '<script>alert("xss")</script><p>Normal content</p>',
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
      createPost(request, reply);

      // Assertions
      expect(runCalledWith[2]).toBe('<script>alert("xss")</script><p>Normal content</p>');
      expect(redirectCalledWith).toBe('/');
    });

    it('should handle very long content', () => {
      let runCalledWith = null;
      let redirectCalledWith = null;

      // Mock statement
      const mockStatement = {
        run: (...args) => {
          runCalledWith = args;
        },
      };

      const longContent = 'a'.repeat(10000);

      // Mock request object
      const request = {
        body: {
          title: 'Post with long content',
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
        redirect: (path) => {
          redirectCalledWith = path;
        },
      };

      // Call the function
      createPost(request, reply);

      // Assertions
      expect(runCalledWith[2]).toBe(longContent);
      expect(redirectCalledWith).toBe('/');
    });

    it('should return 400 when title is missing', () => {
      let statusCalledWith = null;
      let sendCalledWith = null;

      // Mock request object
      const request = {
        body: {
          content: 'Some content',
        },
        server: {
          db: {
            prepare: () => ({}),
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
              return data;
            },
          };
        },
      };

      // Call the function
      createPost(request, reply);

      // Assertions
      expect(statusCalledWith).toBe(400);
      expect(sendCalledWith.error).toBe('Invalid input');
      expect(sendCalledWith.details).toBeDefined();
    });

    it('should return 400 when content is missing', () => {
      let statusCalledWith = null;
      let sendCalledWith = null;

      // Mock request object
      const request = {
        body: {
          title: 'Valid Title',
        },
        server: {
          db: {
            prepare: () => ({}),
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
              return data;
            },
          };
        },
      };

      // Call the function
      createPost(request, reply);

      // Assertions
      expect(statusCalledWith).toBe(400);
      expect(sendCalledWith.error).toBe('Invalid input');
      expect(sendCalledWith.details).toBeDefined();
    });
  });
});
