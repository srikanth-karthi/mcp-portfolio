import { describe, it, expect, beforeEach } from 'vitest';
import { mockPortfolioData } from '../fixtures/portfolio-data.js';
import { getTechStack } from '../../src/portfolio-tools.js';

describe('Get Tech Stack Functionality', () => {
  let portfolioData;

  beforeEach(() => {
    portfolioData = mockPortfolioData;
  });

  describe('Basic functionality without filter', () => {
    it('should return all tech stack items when no type filter is provided', async () => {
      const result = await getTechStack(portfolioData, {});
      const parsedResult = JSON.parse(result.content[0].text);

      expect(parsedResult.techStack).toBeDefined();
      expect(Array.isArray(parsedResult.techStack)).toBe(true);
    });

    it('should only return items with Tech Stack category', async () => {
      const result = await getTechStack(portfolioData, {});
      const parsedResult = JSON.parse(result.content[0].text);

      parsedResult.techStack.forEach(item => {
        expect(item.category).toBe('Tech Stack');
      });
    });

    it('should return expected number of tech stack items', async () => {
      const result = await getTechStack(portfolioData, {});
      const parsedResult = JSON.parse(result.content[0].text);

      const expectedTechCount = mockPortfolioData.filter(
        item => item.category === 'Tech Stack'
      ).length;

      expect(parsedResult.techStack.length).toBe(expectedTechCount);
    });

    it('should set filterType to "all" when no type is provided', async () => {
      const result = await getTechStack(portfolioData, {});
      const parsedResult = JSON.parse(result.content[0].text);

      expect(parsedResult.filterType).toBe('all');
    });

    it('should include all tech item properties', async () => {
      const result = await getTechStack(portfolioData, {});
      const parsedResult = JSON.parse(result.content[0].text);

      if (parsedResult.techStack.length > 0) {
        parsedResult.techStack.forEach(item => {
          expect(item).toHaveProperty('id');
          expect(item).toHaveProperty('category');
          expect(item).toHaveProperty('title');
          expect(item).toHaveProperty('description');
          expect(item).toHaveProperty('keywords');
        });
      }
    });
  });

  describe('Type filtering', () => {
    it('should filter by type when provided', async () => {
      const result = await getTechStack(portfolioData, { type: 'programming' });
      const parsedResult = JSON.parse(result.content[0].text);

      parsedResult.techStack.forEach(item => {
        expect(item.title.toLowerCase()).toContain('programming');
      });
    });

    it('should be case-insensitive for type filtering', async () => {
      const result1 = await getTechStack(portfolioData, { type: 'CLOUD' });
      const result2 = await getTechStack(portfolioData, { type: 'cloud' });
      const result3 = await getTechStack(portfolioData, { type: 'Cloud' });

      const parsed1 = JSON.parse(result1.content[0].text);
      const parsed2 = JSON.parse(result2.content[0].text);
      const parsed3 = JSON.parse(result3.content[0].text);

      expect(parsed1.techStack.length).toBe(parsed2.techStack.length);
      expect(parsed2.techStack.length).toBe(parsed3.techStack.length);
    });

    it('should include filterType in response when type is provided', async () => {
      const typeFilter = 'cloud';
      const result = await getTechStack(portfolioData, { type: typeFilter });
      const parsedResult = JSON.parse(result.content[0].text);

      expect(parsedResult.filterType).toBe(typeFilter);
    });

    it('should return empty array for non-matching type', async () => {
      const result = await getTechStack(portfolioData, { type: 'nonexistenttype123' });
      const parsedResult = JSON.parse(result.content[0].text);

      expect(parsedResult.techStack).toEqual([]);
    });

    it('should filter only within Tech Stack category', async () => {
      const result = await getTechStack(portfolioData, { type: 'programming' });
      const parsedResult = JSON.parse(result.content[0].text);

      parsedResult.techStack.forEach(item => {
        expect(item.category).toBe('Tech Stack');
      });
    });

    it('should handle partial matches in title', async () => {
      const result = await getTechStack(portfolioData, { type: 'lang' });
      const parsedResult = JSON.parse(result.content[0].text);

      parsedResult.techStack.forEach(item => {
        expect(item.title.toLowerCase()).toContain('lang');
      });
    });
  });

  describe('Response format', () => {
    it('should return correct response structure', async () => {
      const result = await getTechStack(portfolioData, {});

      expect(result).toHaveProperty('content');
      expect(Array.isArray(result.content)).toBe(true);
      expect(result.content[0]).toHaveProperty('type', 'text');
      expect(result.content[0]).toHaveProperty('text');
    });

    it('should return valid JSON in text field', async () => {
      const result = await getTechStack(portfolioData, {});

      expect(() => {
        JSON.parse(result.content[0].text);
      }).not.toThrow();
    });

    it('should include both techStack and filterType fields', async () => {
      const result = await getTechStack(portfolioData, {});
      const parsedResult = JSON.parse(result.content[0].text);

      expect(Object.keys(parsedResult)).toContain('techStack');
      expect(Object.keys(parsedResult)).toContain('filterType');
    });
  });

  describe('Edge cases', () => {
    it('should handle empty portfolio data', async () => {
      const emptyPortfolioData = [];
      const result = await getTechStack(emptyPortfolioData, {});
      const parsedResult = JSON.parse(result.content[0].text);

      expect(parsedResult.techStack).toEqual([]);
    });

    it('should handle portfolio with no tech stack items', async () => {
      const noTechData = mockPortfolioData.filter(item => item.category !== 'Tech Stack');

      const result = await getTechStack(noTechData, {});
      const parsedResult = JSON.parse(result.content[0].text);

      expect(parsedResult.techStack).toEqual([]);
    });

    it('should handle empty type string', async () => {
      const result = await getTechStack(portfolioData, { type: '' });
      const parsedResult = JSON.parse(result.content[0].text);

      // Empty string should match all items (all titles contain empty string)
      const allTechItems = mockPortfolioData.filter(item => item.category === 'Tech Stack');
      expect(parsedResult.techStack.length).toBe(allTechItems.length);
    });

    it('should handle special characters in type', async () => {
      const result = await getTechStack(portfolioData, { type: '@#$%' });
      const parsedResult = JSON.parse(result.content[0].text);

      expect(parsedResult.techStack).toEqual([]);
    });

    it('should handle whitespace in type', async () => {
      const result = await getTechStack(portfolioData, { type: '   programming   ' });
      const parsedResult = JSON.parse(result.content[0].text);

      // Should still filter (whitespace is part of the search)
      expect(Array.isArray(parsedResult.techStack)).toBe(true);
    });

    it('should handle undefined type (no args.type)', async () => {
      const result = await getTechStack(portfolioData, {});
      const parsedResult = JSON.parse(result.content[0].text);

      expect(parsedResult.filterType).toBe('all');
      expect(parsedResult.techStack.length).toBeGreaterThan(0);
    });
  });

  describe('Data integrity', () => {
    it('should not modify original portfolio data', async () => {
      const originalLength = portfolioData.length;
      const originalData = JSON.parse(JSON.stringify(portfolioData));

      await getTechStack(portfolioData, {});

      expect(portfolioData.length).toBe(originalLength);
      expect(portfolioData).toEqual(originalData);
    });

    it('should return same data on multiple calls with same filter', async () => {
      const result1 = await getTechStack(portfolioData, { type: 'cloud' });
      const result2 = await getTechStack(portfolioData, { type: 'cloud' });

      const parsed1 = JSON.parse(result1.content[0].text);
      const parsed2 = JSON.parse(result2.content[0].text);

      expect(parsed1.techStack).toEqual(parsed2.techStack);
    });

    it('should maintain item order from original data', async () => {
      const result = await getTechStack(portfolioData, {});
      const parsedResult = JSON.parse(result.content[0].text);

      const originalTechItems = mockPortfolioData.filter(
        item => item.category === 'Tech Stack'
      );

      expect(parsedResult.techStack).toEqual(originalTechItems);
    });
  });

  describe('Category filtering accuracy', () => {
    it('should not include non-Tech Stack items', async () => {
      const result = await getTechStack(portfolioData, {});
      const parsedResult = JSON.parse(result.content[0].text);

      const nonTechCategories = ['Contact', 'Experience', 'Education', 'Profile Summary'];

      parsedResult.techStack.forEach(item => {
        expect(nonTechCategories).not.toContain(item.category);
      });
    });

    it('should be case-sensitive for category matching', async () => {
      const mixedCaseData = [
        ...mockPortfolioData,
        { id: 999, category: 'tech stack', title: 'lowercase', description: '', keywords: [] },
        { id: 1000, category: 'TECH STACK', title: 'uppercase', description: '', keywords: [] }
      ];

      const result = await getTechStack(mixedCaseData, {});
      const parsedResult = JSON.parse(result.content[0].text);

      // Should only match exact case 'Tech Stack'
      parsedResult.techStack.forEach(item => {
        expect(item.category).toBe('Tech Stack');
      });
    });
  });

  describe('Async behavior', () => {
    it('should be an async function', async () => {
      const result = getTechStack(portfolioData, {});
      expect(result).toBeInstanceOf(Promise);
      await result;
    });

    it('should resolve successfully', async () => {
      await expect(getTechStack(portfolioData, {})).resolves.toBeDefined();
    });
  });

  describe('Different tech stack types', () => {
    it('should filter Programming Languages correctly', async () => {
      const result = await getTechStack(portfolioData, { type: 'programming' });
      const parsedResult = JSON.parse(result.content[0].text);

      parsedResult.techStack.forEach(item => {
        expect(item.title.toLowerCase()).toContain('programming');
      });
    });

    it('should filter Cloud Platforms correctly', async () => {
      const result = await getTechStack(portfolioData, { type: 'cloud' });
      const parsedResult = JSON.parse(result.content[0].text);

      parsedResult.techStack.forEach(item => {
        expect(item.title.toLowerCase()).toContain('cloud');
      });
    });
  });
});
