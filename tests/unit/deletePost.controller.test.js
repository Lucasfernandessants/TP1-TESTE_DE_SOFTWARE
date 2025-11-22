import { deletePost } from '../../src/controllers/deletePost.controller.js';

describe('deletePost Controller', () => {
  it('should delete a post and redirect', () => {
    // Create mock functions manually
    let prepareCalled = false;
    let prepareCalledWith = null;
    let runCalled = false;
    let runCalledWith = null;
    let redirectCalled = false;
    let redirectCalledWith = null;

    // Mock statement with run method
    const mockStatement = {
      run: (arg) => {
        runCalled = true;
        runCalledWith = arg;
      },
    };

    // Mock request object
    const request = {
      params: {
        slug: 'test-post-slug',
      },
      server: {
        db: {
          prepare: (query) => {
            prepareCalled = true;
            prepareCalledWith = query;
            return mockStatement;
          },
        },
      },
    };

    // Mock reply object
    const reply = {
      redirect: (path) => {
        redirectCalled = true;
        redirectCalledWith = path;
      },
    };

    // Call the function
    deletePost(request, reply);

    // Assertions
    expect(prepareCalled).toBe(true);
    expect(prepareCalledWith).toBe('DELETE FROM posts WHERE slug = ?');
    expect(runCalled).toBe(true);
    expect(runCalledWith).toBe('test-post-slug');
    expect(redirectCalled).toBe(true);
    expect(redirectCalledWith).toBe('/');
  });
});
