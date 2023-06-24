// created 24/01/2023 by Ujean

import { doAPIGet, doAPIPost, findErrorMsg } from "src/modules/utilities/apiHelpers";
import { ContentSettingsResponse, ContentSettingsValues, PathsSaveSetting, ScriptsSaveSetting } from "./interfaces/contentSettings";
import Log from "../../modules/utilities/log";
import { Notify } from "quasar";

const timers: number[] = [];
type settingsTypes = PathsSaveSetting | ScriptsSaveSetting;
const apiRequestUrl = "content-settings.json";

export const ContentSettings = {
    // FUNCTION getValues returns values from localhost:40100/content-settings.json
    async getValues (): Promise<ContentSettingsValues> {
        let response: ContentSettingsValues = {};

        try {
            const contentSettingsResponse = await doAPIGet(apiRequestUrl) as ContentSettingsResponse;

            response = contentSettingsResponse.values;

            return response;
        } catch (error) {
            const errorMessage = findErrorMsg(error);
            console.log(`Exception while attempting to get content-settings: ${errorMessage}`);
            // Log.error(Log.types.API, `Exception while attempting to get content-settings: ${errr}`);
        }
        return response;
    },
    commitSettings (settingsToCommit: settingsTypes, settingString = "") {
        void doAPIPost(apiRequestUrl, JSON.stringify(settingsToCommit))
            .then(() => {
                Log.info(Log.types.DOMAIN, `Successfully committed settings${settingString}.`);
            })
            .catch((response: string) => {
                Log.error(Log.types.DOMAIN, `Failed to commit settings to Domain: ${response}`);
                Notify.create({
                    type: "negative",
                    textColor: "white",
                    icon: "warning",
                    message: `Failed to commit settings to Domain${settingString}: ${response}`
                });
            });
    },
    automaticCommitSettings (settingsToCommit: settingsTypes): void {
        // automaticCommitSettings should be called whenever an input change is detected
        // only commits changes once no input changes are detected for 5 secs (5000 ms)
        // call commitSettings instead of automaticCommitSettings to instantly commit changes
        timers.forEach((timerID, index) => { clearTimeout(timerID); timers.splice(index, 1); });
        timers.push(window.setTimeout(this.commitSettings, 5000, settingsToCommit));
    }
};
