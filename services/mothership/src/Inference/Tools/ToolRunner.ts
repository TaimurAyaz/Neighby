import { ToolCall, ToolMessage } from "@langchain/core/messages";
import ToolType from "./ToolType";
import GoogleMapsPlacesAPITool from "./GoogleMapsPlacesAPITool";
import TorontoNeighbourhoodCrimeRateTool from "./TorontoNeighbourhoodCrimeRateTool";

/**
 * Namespace containing tools and functions for running them.
 */
namespace ToolsProvider {

    /** Array of available tools. */
    export const tools: ToolType<any>[] = [
        GoogleMapsPlacesAPITool,
        TorontoNeighbourhoodCrimeRateTool
    ]

    /**
     * Runs the specified tools asynchronously.
     * @param calls An array of ToolCall objects specifying the tools to run and their arguments.
     * @returns A Promise resolving to an array of ToolMessage objects containing the results of the tool executions.
     */
    export async function run(calls: ToolCall[]): Promise<ToolMessage[]> {
        var runs: ToolMessage[] = []
        console.log(`Running ${calls.length} tools`)
        for (let index = 0; index < calls.length; index++) {
            const toolCall = calls[index];
            console.log(`Running \"${toolCall.function.name}\" tool: ${toolCall.function.arguments}`)
            const tool = tools.find((tool) => {
                return tool.name === toolCall.function.name 
            })
            if (tool !== undefined) {
                let message = new ToolMessage({
                    tool_call_id: toolCall.id,
                    name: toolCall.function.name,
                    content: JSON.stringify(await tool.run(toolCall.function.arguments)),
                })
                runs.push(message)
            }
        }
        return runs
    }
}
export default ToolsProvider