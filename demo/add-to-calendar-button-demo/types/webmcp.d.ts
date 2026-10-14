/**
 * Type augmentation for the WebMCP Declarative API HTML attributes.
 * @see https://developer.chrome.com/docs/ai/webmcp/declarative-api
 *
 * These attributes turn standard HTML forms into WebMCP tools that AI agents
 * can discover and invoke. They are not yet part of the standard HTML typings,
 * so we declare them here to keep Astro/TSX type-checking happy.
 */
declare namespace astroHTML.JSX {
  interface FormHTMLAttributes {
    /** Names the tool exposed to AI agents, based on the form's purpose. */
    toolname?: string;
    /** Describes what action the tool takes and its purpose. */
    tooldescription?: string;
    /** When present, the agent submitting the tool also triggers form submission. */
    toolautosubmit?: boolean;
  }

  interface InputHTMLAttributes {
    /** Maps this field to a property description within the tool's JSON Schema. */
    toolparamdescription?: string;
  }

  interface TextareaHTMLAttributes {
    /** Maps this field to a property description within the tool's JSON Schema. */
    toolparamdescription?: string;
  }

  interface SelectHTMLAttributes {
    /** Maps this field to a property description within the tool's JSON Schema. */
    toolparamdescription?: string;
  }
}
/**
 * Type augmentation for the WebMCP Imperative API.
 * @see https://developer.chrome.com/docs/ai/webmcp/imperative-api
 *
 * `document.modelContext` lets the page register JavaScript-backed tools that
 * AI agents can discover and execute. It is an experimental, origin-trial API
 * not yet present in the standard DOM typings.
 */
interface WebMCPToolDefinition {
  name: string;
  description: string;
  inputSchema: Record<string, unknown>;
  execute: (args: Record<string, unknown>) => unknown | Promise<unknown>;
  annotations?: {
    readOnlyHint?: boolean;
    untrustedContentHint?: boolean;
    [key: string]: unknown;
  };
}

interface WebMCPModelContext extends EventTarget {
  registerTool(tool: WebMCPToolDefinition, options?: { signal?: AbortSignal; exposedTo?: string[] }): Promise<void>;
  getTools(options?: { fromOrigins?: string[] }): Promise<unknown[]>;
  executeTool(tool: unknown, args: string, options?: { signal?: AbortSignal }): Promise<unknown>;
}

interface Document {
  readonly modelContext?: WebMCPModelContext;
}

interface Navigator {
  /** Deprecated location of modelContext in Chrome < 150; use document.modelContext. Can be dropped in future versions. */
  readonly modelContext?: WebMCPModelContext;
}

interface Window {
  /** Guard flag set once WebMCP tools have been registered for this page session. */
  __webmcpRegistered?: boolean;
}
