import { sum, getRoot } from '../../src/controllers/root.controller.js';
import { jest } from '@jest/globals';

describe('getRoot Controller', () => {
    test('deve retornar a lista de posts paginada corretamente', () => {
        // Mocks do Banco de Dados
        const mockGet = jest.fn().mockReturnValue({ count: 10 }); // 10 posts no total
        const mockAll = jest.fn().mockReturnValue([{ id: 1, title: 'Post 1' }]); // Retorna lista de posts
        
        const mockPrepare = jest.fn().mockReturnValue({
            get: mockGet,
            all: mockAll
        });

        const mockDb = { prepare: mockPrepare };

        // Mock da Requisição (Request)
        const request = {
            // Sem página especificada (deve assumir página 1) como previsto
            query: {}, 
            server: { db: mockDb }
        };

        // Mock da Resposta (Reply)
        const reply = {
            // Para podermos visualizar
            view: jest.fn()
        };

        // Executa a função
        getRoot(request, reply);

        // Verificações
        // Verifica se contagem de posts
        expect(mockPrepare).toHaveBeenCalledWith("SELECT COUNT(*) as count FROM posts");
        
        // 2. Verifica se buscou os posts com limite e offset corretos (Pagina 1: Limit 5, Offset 0)
        expect(mockPrepare).toHaveBeenCalledWith("SELECT * FROM posts ORDER BY created_at ASC LIMIT ? OFFSET ?");
        expect(mockAll).toHaveBeenCalledWith(5, 0);

        // 3. Verifica se renderizou a view correta com os dados calculados
        expect(reply.view).toHaveBeenCalledWith("index", expect.objectContaining({
            title: "Blog Posts",
            posts: [{ id: 1, title: 'Post 1' }],
            totalPages: 2, // 10 posts / 5 por página = 2 páginas
            currentPage: 1,
            searchQuery: null
        }));
    });
});

describe('sum function', () => {
    test('should return the correct sum', () => {
        expect(sum(1, 2)).toBe(3);
    });

    test('should handle negative numbers', () => {
        expect(sum(-1, -1)).toBe(-2);
    });

    test('should return zero when no arguments are provided', () => {
        expect(sum()).toBe(0);
    });
});