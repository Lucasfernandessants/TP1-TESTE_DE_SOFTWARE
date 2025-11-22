import { describe, test, expect, jest } from "@jest/globals";
import { searchPost } from "../../src/controllers/searchPost.controller.js";

describe("searchPost Controller", () => {
    test("deve buscar posts quando query for fornecida", () => {
        // Mocks
        // Simlua resultado de contagem de posts retornando 1
        // Mocks com Debug (Adicionei console.log para você ver no terminal)
        const mockGet = jest.fn().mockImplementation((arg) => {
            //console.log(`\n[DEBUG] 🔍 Banco .get() chamado com: "${arg}"`);
            return { count: 1 };
        });

        const mockAll = jest.fn().mockImplementation((arg, limit, offset) => {
            //console.log(`[DEBUG] 📦 Banco .all() chamado com: Termo="${arg}", Limit=${limit}, Offset=${offset}`);
            return [{ id: 1, title: "Test Post" }];
        });

        const mockPrepare = jest.fn().mockImplementation((sql) => {
            //console.log(`[DEBUG] 🛠️  Banco .prepare() chamado com SQL: "${sql}"`);
            return { get: mockGet, all: mockAll };
        });

        const mockDb = { prepare: mockPrepare };

        const request = {
            query: { q: "test" }, // Usuário busca por 'test' com 'T' minúsculo
            server: { db: mockDb }, // Banco de dados mockado
        };

        const reply = {
            view: jest.fn(),
        };

        // Execução da função de fato
        searchPost(request, reply);

        // Verificações
        // Esperamos que o comando SQL preparado contenha o filtro "WHERE title LIKE ?"
        expect(mockPrepare).toHaveBeenCalledWith(
            expect.stringContaining("WHERE title LIKE ?"),
        );

        // Garante que o termo de busca pode ser encontrado em qualquer parte do texto
        expect(mockGet).toHaveBeenCalledWith("%test%");

        // Verifica se o número de páginas está dentro do limite
        expect(mockAll).toHaveBeenCalledWith("%test%", 5, 0);

        // Garante que a resposta renderize a view 'index' com os dados corretos:
        expect(reply.view).toHaveBeenCalledWith(
            "index",
            expect.objectContaining({
                title: 'Resultados para: "test"',
                posts: [{ id: 1, title: "Test Post" }],
                totalPages: 1,
                currentPage: 1,
            }),
        );
    });

    test("deve retornar todos os posts quando a query estiver vazia", () => {
        // Mocks
        // Simula resultado de contagem de posts retornando 10
        const mockGet = jest.fn().mockReturnValue({ count: 10 });
        const mockAll = jest.fn().mockReturnValue([]);
        const mockPrepare = jest
            .fn()
            .mockReturnValue({ get: mockGet, all: mockAll });
        const mockDb = { prepare: mockPrepare };

        const request = {
            query: { q: "" }, // Busca vazia
            server: { db: mockDb },
        };

        const reply = {
            // Função usada para verificar se a view correta foi renderizada
            view: jest.fn(),
        };

        // Execução
        searchPost(request, reply);

        // Verificações
        // Se a busca é vazia, NÃO queremos filtrar por título.
        // Esperamos que o SQL seja genérico (SELECT * FROM posts...)
        // Por isso garantimos que não tenha WHERE para não tirar nenhum post
        expect(mockPrepare).toHaveBeenCalledWith(
            expect.not.stringContaining("WHERE title LIKE ?"),
        );

        // Esperamos que o título da página seja "Todos os Posts"
        expect(reply.view).toHaveBeenCalledWith(
            "index",
            expect.objectContaining({
                title: "Todos os Posts",
                posts: [],
                // 10 posts no total, 5 por página = 2 páginas
                totalPages: 2,
                currentPage: 1,
            }),
        );
    });
});
