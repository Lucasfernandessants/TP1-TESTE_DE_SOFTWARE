import { getPost } from '../../src/controllers/getPost.controller.js';

describe('getPost Controller', () => {
  it('should return the post view when post is found', () => {
    // Mock post data
    const mockPost = {
      id: 1,
      title: 'Test Post Title',
      slug: 'test-post-title',
      content: 'This is the test post content',
    };

    let getCalledWith = null;
    let viewCalled = false;
    let viewCalledWith = null;

    // Mock request object
    const request = {
      params: {
        slug: 'test-post-title',
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
    getPost(request, reply);

    // Assertions
    expect(getCalledWith).toBe('test-post-title');
    expect(viewCalled).toBe(true);
    expect(viewCalledWith.template).toBe('post');
    expect(viewCalledWith.data.title).toBe('Test Post Title');
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
    getPost(request, reply);

    // Assertions
    expect(statusCalledWith).toBe(404);
    expect(sendCalledWith).toEqual({ error: 'Post not found' });
  });

  it('should handle post with null fields', () => {
    // Mock post with null fields
    const mockPost = {
      id: 1,
      title: null,
      slug: 'test-post',
      content: null,
      created_at: null,
    };

    let viewCalled = false;
    let viewCalledWith = null;

    // Mock request object
    const request = {
      params: {
        slug: 'test-post',
      },
      server: {
        db: {
          prepare: () => {
            return {
              get: () => mockPost,
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
    getPost(request, reply);

    // Assertions
    expect(viewCalled).toBe(true);
    expect(viewCalledWith.data.title).toBe(null);
    expect(viewCalledWith.data.post.content).toBe(null);
  });

  it('should handle post with undefined fields', () => {
    // Mock post with undefined fields
    const mockPost = {
      id: 1,
      slug: 'test-post',
    };

    let viewCalled = false;
    let viewCalledWith = null;

    // Mock request object
    const request = {
      params: {
        slug: 'test-post',
      },
      server: {
        db: {
          prepare: () => {
            return {
              get: () => mockPost,
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
    getPost(request, reply);

    // Assertions
    expect(viewCalled).toBe(true);
    expect(viewCalledWith.data.post.title).toBeUndefined();
    expect(viewCalledWith.data.post.content).toBeUndefined();
  });

  it('should handle post with created_at timestamp', () => {
    // Mock post with timestamp
    const mockPost = {
      id: 1,
      title: 'Post with Date',
      slug: 'post-with-date',
      content: 'Content',
      created_at: '2025-11-21 10:30:00',
    };

    let viewCalled = false;
    let viewCalledWith = null;

    // Mock request object
    const request = {
      params: {
        slug: 'post-with-date',
      },
      server: {
        db: {
          prepare: () => {
            return {
              get: () => mockPost,
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
    getPost(request, reply);

    // Assertions
    expect(viewCalled).toBe(true);
    expect(viewCalledWith.data.post.created_at).toBe('2025-11-21 10:30:00');
  });

  it('should handle post with HTML content', () => {
    // Mock post with HTML
    const mockPost = {
      id: 1,
      title: 'Post with HTML',
      slug: 'post-with-html',
      content: '<script>alert("xss")</script><p>Normal content</p>',
    };

    let viewCalled = false;
    let viewCalledWith = null;

    // Mock request object
    const request = {
      params: {
        slug: 'post-with-html',
      },
      server: {
        db: {
          prepare: () => {
            return {
              get: () => mockPost,
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
    getPost(request, reply);

    // Assertions
    expect(viewCalled).toBe(true);
    expect(viewCalledWith.data.post.content).toBe('<script>alert("xss")</script><p>Normal content</p>');
  });

  it('should handle post with special characters in title', () => {
    // Mock post with special characters
    const mockPost = {
      id: 1,
      title: 'Title with émojis 🚀 and çédille',
      slug: 'title-with-emojis-and-cedille',
      content: 'Content',
    };

    let viewCalled = false;
    let viewCalledWith = null;

    // Mock request object
    const request = {
      params: {
        slug: 'title-with-emojis-and-cedille',
      },
      server: {
        db: {
          prepare: () => {
            return {
              get: () => mockPost,
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
    getPost(request, reply);

    // Assertions
    expect(viewCalled).toBe(true);
    expect(viewCalledWith.data.post.title).toBe('Title with émojis 🚀 and çédille');
  });

  it('should handle post with very long content', () => {
    const longContent = 'a'.repeat(10000);

    // Mock post with long content
    const mockPost = {
      id: 1,
      title: 'Post with Long Content',
      slug: 'post-with-long-content',
      content: longContent,
    };

    let viewCalled = false;
    let viewCalledWith = null;

    // Mock request object
    const request = {
      params: {
        slug: 'post-with-long-content',
      },
      server: {
        db: {
          prepare: () => {
            return {
              get: () => mockPost,
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
    getPost(request, reply);

    // Assertions
    expect(viewCalled).toBe(true);
    expect(viewCalledWith.data.post.content.length).toBe(10000);
  });

  it('should handle slug with special characters', () => {
    // Mock post
    const mockPost = {
      id: 1,
      title: 'Test Post',
      slug: 'test-post-with-123',
      content: 'Content',
    };

    let getCalledWith = null;

    // Mock request object
    const request = {
      params: {
        slug: 'test-post-with-123',
      },
      server: {
        db: {
          prepare: () => {
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
      view: () => {},
    };

    // Call the function
    getPost(request, reply);

    // Assertions
    expect(getCalledWith).toBe('test-post-with-123');
  });

  it('should return 404 when slug is empty', () => {
    let statusCalledWith = null;
    let sendCalledWith = null;

    // Mock request object
    const request = {
      params: {
        slug: '',
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
    getPost(request, reply);

    // Assertions
    expect(statusCalledWith).toBe(404);
    expect(sendCalledWith).toEqual({ error: 'Post not found' });
  });
});
