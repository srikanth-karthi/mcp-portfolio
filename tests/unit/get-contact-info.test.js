import { describe, it, expect, beforeEach } from 'vitest';
import { mockPortfolioData } from '../fixtures/portfolio-data.js';

// Create a mock server class for testing
class MockPortfolioServer {
  constructor(data) {
    this.portfolioData = data;
  }

  async getContactInfo() {
    const contactItems = this.portfolioData.filter(item => item.category === 'Contact');

    return {
      content: [
        {
          type: 'text',
          text: JSON.stringify({
            contact: contactItems
          }, null, 2)
        }
      ]
    };
  }
}

describe('Get Contact Info Functionality', () => {
  let server;

  beforeEach(() => {
    server = new MockPortfolioServer(mockPortfolioData);
  });

  describe('Basic functionality', () => {
    it('should return all contact items', async () => {
      const result = await server.getContactInfo();
      const parsedResult = JSON.parse(result.content[0].text);

      expect(parsedResult.contact).toBeDefined();
      expect(Array.isArray(parsedResult.contact)).toBe(true);
    });

    it('should only return items with Contact category', async () => {
      const result = await server.getContactInfo();
      const parsedResult = JSON.parse(result.content[0].text);

      parsedResult.contact.forEach(item => {
        expect(item.category).toBe('Contact');
      });
    });

    it('should return expected number of contact items', async () => {
      const result = await server.getContactInfo();
      const parsedResult = JSON.parse(result.content[0].text);

      const expectedContactCount = mockPortfolioData.filter(
        item => item.category === 'Contact'
      ).length;

      expect(parsedResult.contact.length).toBe(expectedContactCount);
    });

    it('should include all contact item properties', async () => {
      const result = await server.getContactInfo();
      const parsedResult = JSON.parse(result.content[0].text);

      if (parsedResult.contact.length > 0) {
        parsedResult.contact.forEach(item => {
          expect(item).toHaveProperty('id');
          expect(item).toHaveProperty('category');
          expect(item).toHaveProperty('title');
          expect(item).toHaveProperty('description');
          expect(item).toHaveProperty('keywords');
        });
      }
    });
  });

  describe('Response format', () => {
    it('should return correct response structure', async () => {
      const result = await server.getContactInfo();

      expect(result).toHaveProperty('content');
      expect(Array.isArray(result.content)).toBe(true);
      expect(result.content[0]).toHaveProperty('type', 'text');
      expect(result.content[0]).toHaveProperty('text');
    });

    it('should return valid JSON in text field', async () => {
      const result = await server.getContactInfo();

      expect(() => {
        JSON.parse(result.content[0].text);
      }).not.toThrow();
    });

    it('should wrap contact items in contact property', async () => {
      const result = await server.getContactInfo();
      const parsedResult = JSON.parse(result.content[0].text);

      expect(parsedResult).toHaveProperty('contact');
      expect(Object.keys(parsedResult)).toContain('contact');
    });
  });

  describe('Category filtering accuracy', () => {
    it('should not include non-Contact items', async () => {
      const result = await server.getContactInfo();
      const parsedResult = JSON.parse(result.content[0].text);

      const nonContactCategories = ['Tech Stack', 'Experience', 'Education', 'Profile Summary'];

      parsedResult.contact.forEach(item => {
        expect(nonContactCategories).not.toContain(item.category);
      });
    });

    it('should be case-sensitive for category matching', async () => {
      const mixedCaseData = [
        ...mockPortfolioData,
        { id: 999, category: 'contact', title: 'lowercase', description: '', keywords: [] },
        { id: 1000, category: 'CONTACT', title: 'uppercase', description: '', keywords: [] }
      ];

      const mixedServer = new MockPortfolioServer(mixedCaseData);
      const result = await mixedServer.getContactInfo();
      const parsedResult = JSON.parse(result.content[0].text);

      // Should only match exact case 'Contact'
      parsedResult.contact.forEach(item => {
        expect(item.category).toBe('Contact');
      });
    });
  });

  describe('Edge cases', () => {
    it('should return empty array when no contact items exist', async () => {
      const noContactData = mockPortfolioData.filter(item => item.category !== 'Contact');
      const noContactServer = new MockPortfolioServer(noContactData);

      const result = await noContactServer.getContactInfo();
      const parsedResult = JSON.parse(result.content[0].text);

      expect(parsedResult.contact).toEqual([]);
    });

    it('should handle empty portfolio data', async () => {
      const emptyServer = new MockPortfolioServer([]);
      const result = await emptyServer.getContactInfo();
      const parsedResult = JSON.parse(result.content[0].text);

      expect(parsedResult.contact).toEqual([]);
    });

    it('should handle portfolio with only Contact items', async () => {
      const onlyContactData = mockPortfolioData.filter(item => item.category === 'Contact');
      const contactOnlyServer = new MockPortfolioServer(onlyContactData);

      const result = await contactOnlyServer.getContactInfo();
      const parsedResult = JSON.parse(result.content[0].text);

      expect(parsedResult.contact.length).toBe(onlyContactData.length);
    });
  });

  describe('Data integrity', () => {
    it('should not modify original portfolio data', async () => {
      const originalLength = server.portfolioData.length;
      const originalData = JSON.parse(JSON.stringify(server.portfolioData));

      await server.getContactInfo();

      expect(server.portfolioData.length).toBe(originalLength);
      expect(server.portfolioData).toEqual(originalData);
    });

    it('should return same data on multiple calls', async () => {
      const result1 = await server.getContactInfo();
      const result2 = await server.getContactInfo();

      const parsed1 = JSON.parse(result1.content[0].text);
      const parsed2 = JSON.parse(result2.content[0].text);

      expect(parsed1.contact).toEqual(parsed2.contact);
    });

    it('should maintain item order from original data', async () => {
      const result = await server.getContactInfo();
      const parsedResult = JSON.parse(result.content[0].text);

      const originalContactItems = mockPortfolioData.filter(
        item => item.category === 'Contact'
      );

      expect(parsedResult.contact).toEqual(originalContactItems);
    });
  });

  describe('Contact item types', () => {
    it('should include email contact if present', async () => {
      const result = await server.getContactInfo();
      const parsedResult = JSON.parse(result.content[0].text);

      const hasEmail = parsedResult.contact.some(
        item => item.title.toLowerCase().includes('email')
      );

      const dataHasEmail = mockPortfolioData.some(
        item => item.category === 'Contact' && item.title.toLowerCase().includes('email')
      );

      expect(hasEmail).toBe(dataHasEmail);
    });

    it('should include social media contacts if present', async () => {
      const result = await server.getContactInfo();
      const parsedResult = JSON.parse(result.content[0].text);

      const hasSocial = parsedResult.contact.some(
        item => item.keywords.some(keyword => keyword.toLowerCase().includes('social'))
      );

      const dataHasSocial = mockPortfolioData.some(
        item => item.category === 'Contact' &&
        item.keywords.some(keyword => keyword.toLowerCase().includes('social'))
      );

      expect(hasSocial).toBe(dataHasSocial);
    });
  });

  describe('Async behavior', () => {
    it('should be an async function', async () => {
      const result = server.getContactInfo();
      expect(result).toBeInstanceOf(Promise);
      await result;
    });

    it('should resolve successfully', async () => {
      await expect(server.getContactInfo()).resolves.toBeDefined();
    });
  });
});
