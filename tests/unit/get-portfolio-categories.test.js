import { describe, it, expect, beforeEach } from 'vitest';
import { mockPortfolioData } from '../fixtures/portfolio-data.js';

// Create a mock server class for testing
class MockPortfolioServer {
  constructor(data) {
    this.portfolioData = data;
  }

  async getPortfolioCategories() {
    const categories = [...new Set(this.portfolioData.map(item => item.category))];

    return {
      content: [
        {
          type: 'text',
          text: JSON.stringify({
            categories: categories,
            totalItems: this.portfolioData.length
          }, null, 2)
        }
      ]
    };
  }
}

describe('Get Portfolio Categories Functionality', () => {
  let server;

  beforeEach(() => {
    server = new MockPortfolioServer(mockPortfolioData);
  });

  describe('Basic functionality', () => {
    it('should return all unique categories', async () => {
      const result = await server.getPortfolioCategories();
      const parsedResult = JSON.parse(result.content[0].text);

      expect(parsedResult.categories).toBeDefined();
      expect(Array.isArray(parsedResult.categories)).toBe(true);
      expect(parsedResult.categories.length).toBeGreaterThan(0);
    });

    it('should not include duplicate categories', async () => {
      const result = await server.getPortfolioCategories();
      const parsedResult = JSON.parse(result.content[0].text);

      const uniqueCategories = [...new Set(parsedResult.categories)];
      expect(parsedResult.categories.length).toBe(uniqueCategories.length);
    });

    it('should include total items count', async () => {
      const result = await server.getPortfolioCategories();
      const parsedResult = JSON.parse(result.content[0].text);

      expect(parsedResult.totalItems).toBeDefined();
      expect(typeof parsedResult.totalItems).toBe('number');
      expect(parsedResult.totalItems).toBe(mockPortfolioData.length);
    });

    it('should return expected categories from mock data', async () => {
      const result = await server.getPortfolioCategories();
      const parsedResult = JSON.parse(result.content[0].text);

      const expectedCategories = [
        'Profile Summary',
        'Current Position',
        'Contact',
        'Tech Stack',
        'Experience',
        'Education'
      ];

      expectedCategories.forEach(category => {
        expect(parsedResult.categories).toContain(category);
      });
    });
  });

  describe('Response format', () => {
    it('should return correct response structure', async () => {
      const result = await server.getPortfolioCategories();

      expect(result).toHaveProperty('content');
      expect(Array.isArray(result.content)).toBe(true);
      expect(result.content[0]).toHaveProperty('type', 'text');
      expect(result.content[0]).toHaveProperty('text');
    });

    it('should return valid JSON in text field', async () => {
      const result = await server.getPortfolioCategories();

      expect(() => {
        JSON.parse(result.content[0].text);
      }).not.toThrow();
    });

    it('should include both categories and totalItems fields', async () => {
      const result = await server.getPortfolioCategories();
      const parsedResult = JSON.parse(result.content[0].text);

      expect(Object.keys(parsedResult)).toContain('categories');
      expect(Object.keys(parsedResult)).toContain('totalItems');
    });
  });

  describe('Edge cases', () => {
    it('should handle empty portfolio data', async () => {
      const emptyServer = new MockPortfolioServer([]);
      const result = await emptyServer.getPortfolioCategories();
      const parsedResult = JSON.parse(result.content[0].text);

      expect(parsedResult.categories).toEqual([]);
      expect(parsedResult.totalItems).toBe(0);
    });

    it('should handle portfolio with single category', async () => {
      const singleCategoryData = [
        { id: 1, category: 'Test', title: 'Item 1', description: '', keywords: [] },
        { id: 2, category: 'Test', title: 'Item 2', description: '', keywords: [] }
      ];
      const singleCategoryServer = new MockPortfolioServer(singleCategoryData);
      const result = await singleCategoryServer.getPortfolioCategories();
      const parsedResult = JSON.parse(result.content[0].text);

      expect(parsedResult.categories).toEqual(['Test']);
      expect(parsedResult.totalItems).toBe(2);
    });

    it('should handle portfolio where every item has unique category', async () => {
      const uniqueCategoriesData = [
        { id: 1, category: 'Cat1', title: 'Item 1', description: '', keywords: [] },
        { id: 2, category: 'Cat2', title: 'Item 2', description: '', keywords: [] },
        { id: 3, category: 'Cat3', title: 'Item 3', description: '', keywords: [] }
      ];
      const uniqueServer = new MockPortfolioServer(uniqueCategoriesData);
      const result = await uniqueServer.getPortfolioCategories();
      const parsedResult = JSON.parse(result.content[0].text);

      expect(parsedResult.categories.length).toBe(3);
      expect(parsedResult.totalItems).toBe(3);
    });

    it('should preserve category case', async () => {
      const mixedCaseData = [
        { id: 1, category: 'Tech Stack', title: 'Item 1', description: '', keywords: [] },
        { id: 2, category: 'TECH STACK', title: 'Item 2', description: '', keywords: [] }
      ];
      const mixedCaseServer = new MockPortfolioServer(mixedCaseData);
      const result = await mixedCaseServer.getPortfolioCategories();
      const parsedResult = JSON.parse(result.content[0].text);

      // Should treat these as different categories (case-sensitive)
      expect(parsedResult.categories.length).toBe(2);
    });
  });

  describe('Data consistency', () => {
    it('should return consistent results on multiple calls', async () => {
      const result1 = await server.getPortfolioCategories();
      const result2 = await server.getPortfolioCategories();

      const parsed1 = JSON.parse(result1.content[0].text);
      const parsed2 = JSON.parse(result2.content[0].text);

      expect(parsed1.categories).toEqual(parsed2.categories);
      expect(parsed1.totalItems).toEqual(parsed2.totalItems);
    });

    it('should match the actual number of items in portfolio', async () => {
      const result = await server.getPortfolioCategories();
      const parsedResult = JSON.parse(result.content[0].text);

      expect(parsedResult.totalItems).toBe(server.portfolioData.length);
    });
  });
});
