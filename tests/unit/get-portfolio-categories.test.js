import { describe, it, expect, beforeEach } from 'vitest'
import { mockPortfolioData } from '../fixtures/portfolio-data.js'
import { getPortfolioCategories } from '../../src/portfolio-tools.js'

describe('Get Portfolio Categories Functionality', () => {
  let portfolioData

  beforeEach(() => {
    portfolioData = mockPortfolioData
  })

  describe('Basic functionality', () => {
    it('should return all unique categories', async () => {
      const result = await getPortfolioCategories(portfolioData)
      const parsedResult = JSON.parse(result.content[0].text)

      expect(parsedResult.categories).toBeDefined()
      expect(Array.isArray(parsedResult.categories)).toBe(true)
      expect(parsedResult.categories.length).toBeGreaterThan(0)
    })

    it('should not include duplicate categories', async () => {
      const result = await getPortfolioCategories(portfolioData)
      const parsedResult = JSON.parse(result.content[0].text)

      const uniqueCategories = [...new Set(parsedResult.categories)]
      expect(parsedResult.categories.length).toBe(uniqueCategories.length)
    })

    it('should include total items count', async () => {
      const result = await getPortfolioCategories(portfolioData)
      const parsedResult = JSON.parse(result.content[0].text)

      expect(parsedResult.totalItems).toBeDefined()
      expect(typeof parsedResult.totalItems).toBe('number')
      expect(parsedResult.totalItems).toBe(mockPortfolioData.length)
    })

    it('should match categories from portfolio data', async () => {
      const result = await getPortfolioCategories(portfolioData)
      const parsedResult = JSON.parse(result.content[0].text)

      const actualCategories = [
        ...new Set(mockPortfolioData.map((item) => item.category))
      ]
      expect(parsedResult.categories.sort()).toEqual(actualCategories.sort())
    })
  })

  describe('Response format', () => {
    it('should return correct response structure', async () => {
      const result = await getPortfolioCategories(portfolioData)

      expect(result).toHaveProperty('content')
      expect(Array.isArray(result.content)).toBe(true)
      expect(result.content[0]).toHaveProperty('type', 'text')
      expect(result.content[0]).toHaveProperty('text')
    })

    it('should return valid JSON', async () => {
      const result = await getPortfolioCategories(portfolioData)

      expect(() => JSON.parse(result.content[0].text)).not.toThrow()
    })

    it('should have categories and totalItems properties', async () => {
      const result = await getPortfolioCategories(portfolioData)
      const parsedResult = JSON.parse(result.content[0].text)

      expect(parsedResult).toHaveProperty('categories')
      expect(parsedResult).toHaveProperty('totalItems')
    })
  })

  describe('Edge cases', () => {
    it('should handle empty portfolio data', async () => {
      const result = await getPortfolioCategories([])
      const parsedResult = JSON.parse(result.content[0].text)

      expect(parsedResult.categories).toEqual([])
      expect(parsedResult.totalItems).toBe(0)
    })

    it('should handle single category', async () => {
      const singleCategoryData = [
        {
          id: 1,
          category: 'Test',
          title: 'Test 1',
          description: '',
          keywords: []
        },
        {
          id: 2,
          category: 'Test',
          title: 'Test 2',
          description: '',
          keywords: []
        }
      ]
      const result = await getPortfolioCategories(singleCategoryData)
      const parsedResult = JSON.parse(result.content[0].text)

      expect(parsedResult.categories).toEqual(['Test'])
      expect(parsedResult.totalItems).toBe(2)
    })

    it('should handle multiple items with same category', async () => {
      const result = await getPortfolioCategories(portfolioData)
      const parsedResult = JSON.parse(result.content[0].text)

      // Verify no duplicates even if multiple items have same category
      const hasDuplicates = parsedResult.categories.some(
        (cat, index) => parsedResult.categories.indexOf(cat) !== index
      )
      expect(hasDuplicates).toBe(false)
    })
  })
})
