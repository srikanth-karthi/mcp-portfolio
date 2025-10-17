import { describe, it, expect, beforeEach } from 'vitest';
import { mockPortfolioData } from '../fixtures/portfolio-data.js';

// Mock McpError
class McpError extends Error {
  constructor(code, message) {
    super(message);
    this.code = code;
  }
}

const ErrorCode = {
  InvalidRequest: 'InvalidRequest'
};

// Create a mock server class for testing
class MockPortfolioServer {
  constructor(data) {
    this.portfolioData = data;
  }

  async getPortfolioItem(args) {
    const { id } = args;
    const item = this.portfolioData.find(item => item.id === id);

    if (!item) {
      throw new McpError(
        ErrorCode.InvalidRequest,
        `Portfolio item with ID ${id} not found`
      );
    }

    return {
      content: [
        {
          type: 'text',
          text: JSON.stringify(item, null, 2)
        }
      ]
    };
  }
}

describe('Get Portfolio Item Functionality', () => {
  let server;

  beforeEach(() => {
    server = new MockPortfolioServer(mockPortfolioData);
  });

  describe('Basic functionality', () => {
    it('should return item by valid ID', async () => {
      const result = await server.getPortfolioItem({ id: 1 });
      const parsedResult = JSON.parse(result.content[0].text);

      expect(parsedResult).toBeDefined();
      expect(parsedResult.id).toBe(1);
      expect(parsedResult).toHaveProperty('category');
      expect(parsedResult).toHaveProperty('title');
      expect(parsedResult).toHaveProperty('description');
      expect(parsedResult).toHaveProperty('keywords');
    });

    it('should return correct item details', async () => {
      const result = await server.getPortfolioItem({ id: 1 });
      const parsedResult = JSON.parse(result.content[0].text);

      const originalItem = mockPortfolioData.find(item => item.id === 1);
      expect(parsedResult).toEqual(originalItem);
    });

    it('should work with different valid IDs', async () => {
      for (const item of mockPortfolioData) {
        const result = await server.getPortfolioItem({ id: item.id });
        const parsedResult = JSON.parse(result.content[0].text);

        expect(parsedResult.id).toBe(item.id);
        expect(parsedResult.title).toBe(item.title);
      }
    });
  });

  describe('Error handling', () => {
    it('should throw McpError for non-existent ID', async () => {
      await expect(server.getPortfolioItem({ id: 999 })).rejects.toThrow(McpError);
    });

    it('should throw error with correct message for invalid ID', async () => {
      try {
        await server.getPortfolioItem({ id: 999 });
      } catch (error) {
        expect(error.message).toBe('Portfolio item with ID 999 not found');
        expect(error.code).toBe(ErrorCode.InvalidRequest);
      }
    });

    it('should throw error for negative ID', async () => {
      await expect(server.getPortfolioItem({ id: -1 })).rejects.toThrow();
    });

    it('should throw error for ID 0', async () => {
      await expect(server.getPortfolioItem({ id: 0 })).rejects.toThrow();
    });
  });

  describe('Response format', () => {
    it('should return correct response structure', async () => {
      const result = await server.getPortfolioItem({ id: 1 });

      expect(result).toHaveProperty('content');
      expect(Array.isArray(result.content)).toBe(true);
      expect(result.content[0]).toHaveProperty('type', 'text');
      expect(result.content[0]).toHaveProperty('text');
    });

    it('should return valid JSON in text field', async () => {
      const result = await server.getPortfolioItem({ id: 1 });

      expect(() => {
        JSON.parse(result.content[0].text);
      }).not.toThrow();
    });

    it('should include all item properties in response', async () => {
      const result = await server.getPortfolioItem({ id: 5 });
      const parsedResult = JSON.parse(result.content[0].text);

      expect(parsedResult).toHaveProperty('id');
      expect(parsedResult).toHaveProperty('category');
      expect(parsedResult).toHaveProperty('title');
      expect(parsedResult).toHaveProperty('description');
      expect(parsedResult).toHaveProperty('keywords');
    });
  });

  describe('Data integrity', () => {
    it('should not modify original data', async () => {
      const originalLength = server.portfolioData.length;
      const originalItem = { ...mockPortfolioData[0] };

      await server.getPortfolioItem({ id: 1 });

      expect(server.portfolioData.length).toBe(originalLength);
      expect(server.portfolioData[0]).toEqual(originalItem);
    });

    it('should return same data on multiple calls for same ID', async () => {
      const result1 = await server.getPortfolioItem({ id: 1 });
      const result2 = await server.getPortfolioItem({ id: 1 });

      const parsed1 = JSON.parse(result1.content[0].text);
      const parsed2 = JSON.parse(result2.content[0].text);

      expect(parsed1).toEqual(parsed2);
    });
  });

  describe('Edge cases', () => {
    it('should handle string ID that cannot be found', async () => {
      await expect(server.getPortfolioItem({ id: 'invalid' })).rejects.toThrow();
    });

    it('should handle null ID', async () => {
      await expect(server.getPortfolioItem({ id: null })).rejects.toThrow();
    });

    it('should handle undefined ID', async () => {
      await expect(server.getPortfolioItem({ id: undefined })).rejects.toThrow();
    });

    it('should handle empty args object', async () => {
      await expect(server.getPortfolioItem({})).rejects.toThrow();
    });

    it('should handle very large ID number', async () => {
      await expect(server.getPortfolioItem({ id: Number.MAX_SAFE_INTEGER })).rejects.toThrow();
    });
  });

  describe('Different item types', () => {
    it('should retrieve Contact items correctly', async () => {
      const contactItem = mockPortfolioData.find(item => item.category === 'Contact');
      if (contactItem) {
        const result = await server.getPortfolioItem({ id: contactItem.id });
        const parsedResult = JSON.parse(result.content[0].text);

        expect(parsedResult.category).toBe('Contact');
        expect(parsedResult.id).toBe(contactItem.id);
      }
    });

    it('should retrieve Tech Stack items correctly', async () => {
      const techItem = mockPortfolioData.find(item => item.category === 'Tech Stack');
      if (techItem) {
        const result = await server.getPortfolioItem({ id: techItem.id });
        const parsedResult = JSON.parse(result.content[0].text);

        expect(parsedResult.category).toBe('Tech Stack');
        expect(parsedResult.id).toBe(techItem.id);
      }
    });

    it('should retrieve Experience items correctly', async () => {
      const expItem = mockPortfolioData.find(item => item.category === 'Experience');
      if (expItem) {
        const result = await server.getPortfolioItem({ id: expItem.id });
        const parsedResult = JSON.parse(result.content[0].text);

        expect(parsedResult.category).toBe('Experience');
        expect(parsedResult.id).toBe(expItem.id);
      }
    });
  });

  describe('Empty data handling', () => {
    it('should throw error when portfolio is empty', async () => {
      const emptyServer = new MockPortfolioServer([]);
      await expect(emptyServer.getPortfolioItem({ id: 1 })).rejects.toThrow(McpError);
    });
  });
});
