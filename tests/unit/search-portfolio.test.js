import { describe, it, expect, vi, beforeEach } from 'vitest';
import { mockPortfolioData } from '../fixtures/portfolio-data.js';

// Create a mock server class for testing
class MockPortfolioServer {
  constructor(data) {
    this.portfolioData = data;
  }

  async searchPortfolio(args) {
    const { query, category, limit = 10 } = args;
    const searchTerm = query.toLowerCase();

    let results = this.portfolioData.filter(item => {
      if (category && item.category.toLowerCase() !== category.toLowerCase()) {
        return false;
      }

      const searchableText = [
        item.title,
        item.description,
        ...item.keywords
      ].join(' ').toLowerCase();

      return searchableText.includes(searchTerm);
    });

    results = results.slice(0, limit);

    return {
      content: [
        {
          type: 'text',
          text: JSON.stringify({
            query: query,
            category: category || 'all',
            resultsCount: results.length,
            results: results
          }, null, 2)
        }
      ]
    };
  }
}

describe('Search Portfolio Functionality', () => {
  let server;

  beforeEach(() => {
    server = new MockPortfolioServer(mockPortfolioData);
  });

  describe('Basic search functionality', () => {
    it('should return results matching the search query', async () => {
      const result = await server.searchPortfolio({ query: 'cloud' });
      const parsedResult = JSON.parse(result.content[0].text);

      expect(parsedResult.resultsCount).toBeGreaterThan(0);
      expect(parsedResult.results).toBeDefined();
      expect(parsedResult.query).toBe('cloud');
    });

    it('should search in title, description, and keywords', async () => {
      const result = await server.searchPortfolio({ query: 'devops' });
      const parsedResult = JSON.parse(result.content[0].text);

      expect(parsedResult.resultsCount).toBeGreaterThan(0);
      parsedResult.results.forEach(item => {
        const searchableText = [
          item.title,
          item.description,
          ...item.keywords
        ].join(' ').toLowerCase();
        expect(searchableText).toContain('devops');
      });
    });

    it('should return empty results for non-existent terms', async () => {
      const result = await server.searchPortfolio({ query: 'nonexistentterm123' });
      const parsedResult = JSON.parse(result.content[0].text);

      expect(parsedResult.resultsCount).toBe(0);
      expect(parsedResult.results).toEqual([]);
    });

    it('should be case-insensitive', async () => {
      const result1 = await server.searchPortfolio({ query: 'CLOUD' });
      const result2 = await server.searchPortfolio({ query: 'cloud' });
      const result3 = await server.searchPortfolio({ query: 'Cloud' });

      const parsed1 = JSON.parse(result1.content[0].text);
      const parsed2 = JSON.parse(result2.content[0].text);
      const parsed3 = JSON.parse(result3.content[0].text);

      expect(parsed1.resultsCount).toBe(parsed2.resultsCount);
      expect(parsed2.resultsCount).toBe(parsed3.resultsCount);
    });
  });

  describe('Category filtering', () => {
    it('should filter results by category', async () => {
      const result = await server.searchPortfolio({
        query: 'test',
        category: 'Contact'
      });
      const parsedResult = JSON.parse(result.content[0].text);

      parsedResult.results.forEach(item => {
        expect(item.category).toBe('Contact');
      });
    });

    it('should be case-insensitive for category filtering', async () => {
      const result1 = await server.searchPortfolio({
        query: '',
        category: 'CONTACT'
      });
      const result2 = await server.searchPortfolio({
        query: '',
        category: 'contact'
      });

      const parsed1 = JSON.parse(result1.content[0].text);
      const parsed2 = JSON.parse(result2.content[0].text);

      expect(parsed1.resultsCount).toBe(parsed2.resultsCount);
    });

    it('should return empty results for non-existent category', async () => {
      const result = await server.searchPortfolio({
        query: 'test',
        category: 'NonExistentCategory'
      });
      const parsedResult = JSON.parse(result.content[0].text);

      expect(parsedResult.resultsCount).toBe(0);
    });

    it('should combine query and category filters correctly', async () => {
      const result = await server.searchPortfolio({
        query: 'aws',
        category: 'Tech Stack'
      });
      const parsedResult = JSON.parse(result.content[0].text);

      parsedResult.results.forEach(item => {
        expect(item.category).toBe('Tech Stack');
        const searchableText = [
          item.title,
          item.description,
          ...item.keywords
        ].join(' ').toLowerCase();
        expect(searchableText).toContain('aws');
      });
    });
  });

  describe('Result limiting', () => {
    it('should respect default limit of 10', async () => {
      const result = await server.searchPortfolio({ query: 'test' });
      const parsedResult = JSON.parse(result.content[0].text);

      expect(parsedResult.results.length).toBeLessThanOrEqual(10);
    });

    it('should respect custom limit parameter', async () => {
      const result = await server.searchPortfolio({ query: 'test', limit: 3 });
      const parsedResult = JSON.parse(result.content[0].text);

      expect(parsedResult.results.length).toBeLessThanOrEqual(3);
    });

    it('should handle limit of 0', async () => {
      const result = await server.searchPortfolio({ query: 'test', limit: 0 });
      const parsedResult = JSON.parse(result.content[0].text);

      expect(parsedResult.results).toEqual([]);
    });

    it('should handle limit larger than results', async () => {
      const result = await server.searchPortfolio({ query: 'cloud', limit: 1000 });
      const parsedResult = JSON.parse(result.content[0].text);

      expect(parsedResult.results.length).toBeLessThanOrEqual(1000);
    });
  });

  describe('Response format', () => {
    it('should return correct response structure', async () => {
      const result = await server.searchPortfolio({ query: 'test' });

      expect(result).toHaveProperty('content');
      expect(Array.isArray(result.content)).toBe(true);
      expect(result.content[0]).toHaveProperty('type', 'text');
      expect(result.content[0]).toHaveProperty('text');
    });

    it('should include query in response', async () => {
      const query = 'cloud';
      const result = await server.searchPortfolio({ query });
      const parsedResult = JSON.parse(result.content[0].text);

      expect(parsedResult.query).toBe(query);
    });

    it('should include category in response (or "all" if not specified)', async () => {
      const result1 = await server.searchPortfolio({ query: 'test' });
      const result2 = await server.searchPortfolio({ query: 'test', category: 'Contact' });

      const parsed1 = JSON.parse(result1.content[0].text);
      const parsed2 = JSON.parse(result2.content[0].text);

      expect(parsed1.category).toBe('all');
      expect(parsed2.category).toBe('Contact');
    });

    it('should include resultsCount in response', async () => {
      const result = await server.searchPortfolio({ query: 'test' });
      const parsedResult = JSON.parse(result.content[0].text);

      expect(parsedResult).toHaveProperty('resultsCount');
      expect(typeof parsedResult.resultsCount).toBe('number');
      expect(parsedResult.resultsCount).toBe(parsedResult.results.length);
    });
  });

  describe('Edge cases', () => {
    it('should handle empty query string', async () => {
      const result = await server.searchPortfolio({ query: '' });
      const parsedResult = JSON.parse(result.content[0].text);

      expect(parsedResult.results.length).toBeGreaterThan(0);
    });

    it('should handle special characters in query', async () => {
      const result = await server.searchPortfolio({ query: '@#$%' });
      const parsedResult = JSON.parse(result.content[0].text);

      expect(parsedResult.resultsCount).toBeGreaterThanOrEqual(0);
    });

    it('should handle whitespace in query', async () => {
      const result = await server.searchPortfolio({ query: '   cloud   ' });
      const parsedResult = JSON.parse(result.content[0].text);

      expect(parsedResult.query).toBe('   cloud   ');
    });

    it('should handle empty portfolio data', async () => {
      const emptyServer = new MockPortfolioServer([]);
      const result = await emptyServer.searchPortfolio({ query: 'test' });
      const parsedResult = JSON.parse(result.content[0].text);

      expect(parsedResult.resultsCount).toBe(0);
      expect(parsedResult.results).toEqual([]);
    });
  });
});
