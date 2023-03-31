// edited 23/11/2022 by Ujean

// import Log from "@Modules/debugging/log";
import { doAPIGet, doAPIDelete, findErrorMsg } from "src/modules/utilities/apiHelpers";
import { GetNodesResp, Node } from "./interfaces/nodes";

export const Nodes = {

    async getNodes (): Promise<Node[]> {
        try {
            const apiRequestUrl = "nodes.json";
            const nodesResponse = await doAPIGet(apiRequestUrl) as GetNodesResp;

            return nodesResponse.nodes;
        } catch (error) {
            const errorMessage = findErrorMsg(error);
            console.log(`Exception while attempting to get nodes: ${errorMessage}`);
            // Log.error(Log.types.API, `Exception while attempting to get nodes: ${errr}`);
        }

        const nodes: Node[] = [];
        return nodes;
    },

    async killNode (nodeUuid: string) {
        // fire off a delete for this node
        await doAPIDelete("nodes/" + nodeUuid);
    },

    async killAllNodes () {
        // fire off a delete for this node
        await doAPIDelete("nodes/");
    }

};
