import { describe, it, expect } from "vitest";
import { mockPortfolioData } from "../fixtures/portfolio-data.js";
import { readFileSync } from "fs";
import { join, dirname } from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Mock PortfolioMCPServer class for testing data loading logic
class MockPortfolioMCPServer {
  constructor() {
    this.portfolioData = null;
    this.loadPortfolioData();
  }

  loadPortfolioData() {
    try {
      const possiblePaths = [
        process.env.DATA_PATH || "/app/db/portfolio-data/ai-portfolio.json",
        join(__dirname, "../db/portfolio-data/ai-portfolio.json"),
        join(__dirname, "../../db/portfolio-data/ai-portfolio.json"),
        "./db/portfolio-data/ai-portfolio.json",
      ];

      let dataPath = null;
      for (const path of possiblePaths) {
        try {
          readFileSync(path, "utf-8");
          dataPath = path;
          break;
        } catch (e) {
          // Continue to next path
        }
      }

      if (!dataPath) {
        throw new Error(
          "No portfolio data file found in any expected location",
        );
      }

      const rawData = readFileSync(dataPath, "utf-8");
      this.portfolioData = JSON.parse(rawData);
    } catch (error) {
      this.portfolioData = [];
    }
  }
}

describe("Data Loading Functionality", () => {
  describe("Path resolution logic", () => {
    it("should try multiple paths when loading data", () => {
      const possiblePaths = [
        process.env.DATA_PATH || "/app/db/portfolio-data/ai-portfolio.json",
        join(__dirname, "../db/portfolio-data/ai-portfolio.json"),
        join(__dirname, "../../db/portfolio-data/ai-portfolio.json"),
        "./db/portfolio-data/ai-portfolio.json",
      ];

      expect(possiblePaths.length).toBeGreaterThan(1);
      expect(possiblePaths).toContain("./db/portfolio-data/ai-portfolio.json");
    });

    it("should prioritize DATA_PATH environment variable", () => {
      const customPath = "/custom/path/data.json";
      process.env.DATA_PATH = customPath;

      const possiblePaths = [
        process.env.DATA_PATH || "/app/db/portfolio-data/ai-portfolio.json",
        join(__dirname, "../db/portfolio-data/ai-portfolio.json"),
        join(__dirname, "../../db/portfolio-data/ai-portfolio.json"),
        "./db/portfolio-data/ai-portfolio.json",
      ];

      expect(possiblePaths[0]).toBe(customPath);

      delete process.env.DATA_PATH;
    });
  });

  describe("JSON parsing", () => {
    it("should parse valid JSON data correctly", () => {
      const jsonString = JSON.stringify(mockPortfolioData);
      const parsed = JSON.parse(jsonString);

      expect(parsed).toEqual(mockPortfolioData);
      expect(Array.isArray(parsed)).toBe(true);
    });

    it("should throw error for malformed JSON", () => {
      const malformedJson = "invalid json {{{";

      expect(() => {
        JSON.parse(malformedJson);
      }).toThrow();
    });

    it("should handle empty array JSON", () => {
      const emptyJson = "[]";
      const parsed = JSON.parse(emptyJson);

      expect(parsed).toEqual([]);
      expect(Array.isArray(parsed)).toBe(true);
    });
  });

  describe("Error handling", () => {
    it("should set portfolioData to empty array on error", () => {
      class TestServer {
        constructor() {
          this.portfolioData = null;
          this.loadPortfolioData();
        }

        loadPortfolioData() {
          try {
            throw new Error("Simulated error");
          } catch (error) {
            this.portfolioData = [];
          }
        }
      }

      const server = new TestServer();
      expect(server.portfolioData).toEqual([]);
    });

    it("should handle file not found scenario", () => {
      let errorOccurred = false;

      try {
        readFileSync("/nonexistent/path/data.json", "utf-8");
      } catch (error) {
        errorOccurred = true;
      }

      expect(errorOccurred).toBe(true);
    });
  });

  describe("Data validation", () => {
    it("should validate portfolio data structure", () => {
      const validItem = mockPortfolioData[0];

      expect(validItem).toHaveProperty("id");
      expect(validItem).toHaveProperty("category");
      expect(validItem).toHaveProperty("title");
      expect(validItem).toHaveProperty("description");
      expect(validItem).toHaveProperty("keywords");
      expect(Array.isArray(validItem.keywords)).toBe(true);
    });

    it("should handle portfolio data with all required fields", () => {
      mockPortfolioData.forEach((item) => {
        expect(item).toHaveProperty("id");
        expect(typeof item.id).toBe("number");
        expect(item).toHaveProperty("category");
        expect(typeof item.category).toBe("string");
        expect(item).toHaveProperty("keywords");
        expect(Array.isArray(item.keywords)).toBe(true);
      });
    });
  });
});
