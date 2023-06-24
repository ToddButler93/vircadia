
import { doAPIGet, doAPIPost, findErrorMsg } from "src/modules/utilities/apiHelpers";
import { MetaverseInfo } from "./interfaces/metaverseInfo";

import Log from "src/modules/utilities/log";

export const Metaverse = {
    username: "",
    password: "",
    showPassword: false,
    // TODO: Needs to be stored somewhere central.
    DEFAULT_METAVERSE_URL: "https://metaverse.vircadia.com/live",
    AUTOCOMPLETE: false,

    async retrieveMetaverseUrl (): Promise<string> {
        let response: string = this.DEFAULT_METAVERSE_URL;
        try {
            const metaverseResponse = await doAPIGet("/api/metaverse_info") as MetaverseInfo;

            response = metaverseResponse.metaverse_url;
            return response;
        } catch (error) {
            const errorMessage = findErrorMsg(error);
            console.log(errorMessage);
            Log.error(Log.types.METAVERSE, `Failed to retrieve Metaverse URL, using default URL ${this.DEFAULT_METAVERSE_URL} instead. Error: ${error}`);
        }
        return response;
    },

    async attemptLogin (pMetaverse : string, pUsername : string, pPassword : string) {
        Log.info(Log.types.METAVERSE, `Attempting to login as ${pUsername}.`);

        return new Promise((resolve) => {
            doAPIPost(`${pMetaverse}/oauth/token`, {
                grant_type: "password",
                scope: "owner", // as opposed to 'domain', we're asking for a user token
                username: pUsername,
                password: pPassword
            })
                .then((response) => {
                    Log.info(Log.types.METAVERSE, `Successfully got key and details for ${pUsername}.`);
                    resolve({ "success": true, "response": response.data });
                }, (error) => {
                    Log.error(Log.types.METAVERSE, `Failed to get key and details for ${pUsername}.`);
                    if (error.response && error.response.data) {
                        resolve({ "success": false, "response": error.response.data });
                    } else if (error) {
                        resolve({ "success": false, "response": error });
                    } else {
                        resolve({ "success": false, "response": "Unknown reason." });
                    }
                });
        });
    }
};
