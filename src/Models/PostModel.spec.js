import { Post } from './PostModel';

describe('Post Model Tests', () => {
    it('Should create a post.', () => {
        const post = Post.create({title: 'Post Title', content: 'Post content', tags: ['post1', 'post2']});

        expect(post).toBeDefined();
        expect(post.content).toBe('Post content');
        expect(post.title).toBe('Post Title');
    });

    it('Can add and remove tags to a post.', () => {
        const post = Post.create({title: 'Post Title 1', content: 'Some post content here.'});

        expect(post.tags.length).toBe(0);

        post.addTag('Tag1');
        expect(post.hasTag('Tag1')).toBe(true);
        expect(post.tags.length).toBe(1);

        post.removeTag('Tag1');
        expect(post.hasTag('Tag1')).toBe(false);
        expect(post.tags.length).toBe(0);
    });
})
