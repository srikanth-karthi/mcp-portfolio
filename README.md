# Portfolio MCP Server

A Model Context Protocol (MCP) server that provides access to Srikanth Karthikeyan's portfolio data through structured tools.

## Features

The server provides the following tools:

### 🔍 `search_portfolio`
Search through portfolio data by keywords, category, or content.

**Parameters:**
- `query` (required): Search query to find relevant information
- `category` (optional): Filter by specific category
- `limit` (optional): Maximum results to return (default: 10)

### 📂 `get_portfolio_categories`
Get all available categories in the portfolio data.

### 🎯 `get_portfolio_item`
Get a specific portfolio item by ID.

**Parameters:**
- `id` (required): The ID of the portfolio item

### 📞 `get_contact_info`
Get all contact information.

### 💻 `get_tech_stack`
Get detailed information about technical skills and tools.

**Parameters:**
- `type` (optional): Filter by specific tech type

## Installation

### From npm (Recommended)

No installation required! The package will be automatically downloaded when used with `npx`.

### From Source

1. Navigate to the server directory:
```bash
cd mcp-portfolio-server
```

2. Install dependencies:
```bash
npm install
```

## Usage

### Running the Server
```bash
npm start
```

### Development Mode
```bash
npm run dev
```

### Claude Desktop Integration

#### Using Docker
Add this configuration to your Claude Desktop settings:

```json
{
  "mcpServers": {
    "portfolio": {
      "command": "docker",
      "args": [
        "run", "-i", "--rm",
        "srikanthkarthi/srikanth-mcp-portfolio:latest"
      ]
    }
  }
}
```


#### Using npm Package (Recommended)
```json
{
  "mcpServers": {
    "portfolio": {
      "command": "npx",
      "args": ["srikanth-mcp-portfolio-server"]
    }
  }
}
```

#### Using uvx Package
```json
{
  "mcpServers": {
    "portfolio": {
      "command": "uvx",
      "args": ["srikanth-mcp-portfolio"]
    }
  }
}
```

#### Using Node.js (Development)
```json
{
  "mcpServers": {
    "portfolio": {
      "command": "node",
      "args": ["/path/to/mcp-portfolio-server/src/index.js"],
      "cwd": "/path/to/mcp-portfolio-server"
    }
  }
}
```

## Data Categories

The server provides access to the following portfolio categories:

- **Profile Summary**: Overview and introduction
- **Current Position**: Job title, company, duration
- **Current Work**: Responsibilities and projects
- **Experience**: Work history and achievements
- **Education**: Academic background
- **Tech Stack**: Programming languages, frameworks, tools
- **Certifications**: Professional certifications
- **Volunteerism**: Community service and activities
- **Contact**: Social media and professional links
- **Languages**: Language proficiency

## Example Queries

- Search for cloud experience: `search_portfolio("cloud", "Experience")`
- Get all tech stack info: `get_tech_stack()`
- Find contact information: `get_contact_info()`
- Search for certifications: `search_portfolio("aws certification")`

## License

MIT