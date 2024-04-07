import { type OpenAIClient } from "@langchain/openai";

/**
 * Represents a tool type interface with specified properties and methods.
 * @template Output The type of output expected from the tool.
 */
export default interface ToolType<Output> {
    /** The name of the tool. */
    name: string;
    /** The model parameters required for the tool. This tells the LLM how to use this tool. */
    modelParameters: OpenAIClient.ChatCompletionTool;
    /**
     * Executes the tool with given arguments and returns the result asynchronously.
     * @param args The arguments for the tool.
     * @returns A Promise resolving to the output of the tool.
     */
    run(args: string): Promise<Output>;
}