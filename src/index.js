#!/usr/bin/env node
// temuoracle-mcp · MCP stdio server wrapping temuoracle-sdk · MIT · AI-Native Solutions
import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import { CallToolRequestSchema, ListToolsRequestSchema } from '@modelcontextprotocol/sdk/types.js';

const server = new Server({ name: 'temuoracle-mcp', version: '1.0.0' }, { capabilities: { tools: {} } });

const TOOLS = [
  {
    name: 'temuoracle_route_t0',
    description: 'routeT0 · from temuoracle-sdk',
    inputSchema: { type: 'object', properties: {} },
    handler: async (args) => {
      const { routeT0 } = await import('@ai-native-solutions/temuoracle-sdk');
      return typeof routeT0 === 'function' ? await routeT0(args) : { error: 'routeT0 not callable' };
    }
  },
  {
    name: 'temuoracle_open_d_b',
    description: 'openDB · from temuoracle-sdk',
    inputSchema: { type: 'object', properties: {} },
    handler: async (args) => {
      const { openDB } = await import('@ai-native-solutions/temuoracle-sdk');
      return typeof openDB === 'function' ? await openDB(args) : { error: 'openDB not callable' };
    }
  },
  {
    name: 'temuoracle_db_get',
    description: 'dbGet · from temuoracle-sdk',
    inputSchema: { type: 'object', properties: {} },
    handler: async (args) => {
      const { dbGet } = await import('@ai-native-solutions/temuoracle-sdk');
      return typeof dbGet === 'function' ? await dbGet(args) : { error: 'dbGet not callable' };
    }
  },
  {
    name: 'temuoracle_db_set',
    description: 'dbSet · from temuoracle-sdk',
    inputSchema: { type: 'object', properties: {} },
    handler: async (args) => {
      const { dbSet } = await import('@ai-native-solutions/temuoracle-sdk');
      return typeof dbSet === 'function' ? await dbSet(args) : { error: 'dbSet not callable' };
    }
  },
  {
    name: 'temuoracle_load_settings',
    description: 'loadSettings · from temuoracle-sdk',
    inputSchema: { type: 'object', properties: {} },
    handler: async (args) => {
      const { loadSettings } = await import('@ai-native-solutions/temuoracle-sdk');
      return typeof loadSettings === 'function' ? await loadSettings(args) : { error: 'loadSettings not callable' };
    }
  },
  {
    name: 'temuoracle_save_settings',
    description: 'saveSettings · from temuoracle-sdk',
    inputSchema: { type: 'object', properties: {} },
    handler: async (args) => {
      const { saveSettings } = await import('@ai-native-solutions/temuoracle-sdk');
      return typeof saveSettings === 'function' ? await saveSettings(args) : { error: 'saveSettings not callable' };
    }
  }
];

server.setRequestHandler(ListToolsRequestSchema, async () => ({
  tools: TOOLS.map(({ handler, ...rest }) => rest)
}));

server.setRequestHandler(CallToolRequestSchema, async (req) => {
  const t = TOOLS.find(x => x.name === req.params.name);
  if (!t) throw new Error('unknown tool: ' + req.params.name);
  const result = await t.handler(req.params.arguments || {});
  return { content: [{ type: 'text', text: JSON.stringify(result) }] };
});

await server.connect(new StdioServerTransport());
console.error('temuoracle-mcp v1.0.0 · stdio ready');
