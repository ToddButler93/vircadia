// edited 24/11/2022 by Ujean

import { doAPIGet, doAPIPost, findErrorMsg } from "src/modules/utilities/apiHelpers";
import { SettingsResponse, SettingsValues, Description, MetaverseSaveSettings, WebrtcSaveSettings, WordpressSaveSettings, DomainsResponse, Domains, SSLClientAcmeSaveSettings, MonitoringSaveSettings, SecuritySaveSettings, AudioThreadingSaveSettings, AudioEnvSaveSettings, AudioBufferSaveSettings, AvatarsSaveSettings, AvatarMixerSaveSettings, EntityServerSaveSettings, EntityScriptServerSaveSettings, MessagesMixerSaveSettings, AssetServerSaveSettings, DescriptionSaveSettings, BroadcastingSaveSettings, AutomaticContentArchivesSaveSettings } from "./interfaces/settings";
import Log from "../../modules/utilities/log";
import { Notify } from "quasar";

const timers: number[] = [];

// accepted save setting types
type settingsTypes = MetaverseSaveSettings | WebrtcSaveSettings | WordpressSaveSettings | SSLClientAcmeSaveSettings | MonitoringSaveSettings | SecuritySaveSettings | AudioThreadingSaveSettings | AudioEnvSaveSettings | AudioBufferSaveSettings | AvatarsSaveSettings | AvatarMixerSaveSettings | EntityServerSaveSettings | AssetServerSaveSettings | EntityScriptServerSaveSettings | MessagesMixerSaveSettings | DescriptionSaveSettings | BroadcastingSaveSettings | AutomaticContentArchivesSaveSettings;

const apiSettingsRequestUrl = "settings.json";
const apiDomainRequestUrl = "api/domains";

export const Settings = {
    // FUNCTION getValues returns values from localhost:40100/settings.json
    async getValues (): Promise<SettingsValues> {
        let response: SettingsValues = {};
        try {
            const settingsResponse = await doAPIGet(apiSettingsRequestUrl) as SettingsResponse;

            response = settingsResponse.values;
            return response;
        } catch (error) {
            const errorMessage = findErrorMsg(error);
            console.log(errorMessage);
            // Log.error(Log.types.API, `Exception while attempting to get settings: ${errr}`);
        }
        return response;
    },
    // FUNCTION getValues returns descriptions from localhost:40100/settings.json
    // CURRENTLY NEVER INVOKED
    async getDescriptions (): Promise<Description[]> {
        let response: Description[] = [];
        try {
            const settingsResponse = await doAPIGet(apiSettingsRequestUrl) as SettingsResponse;

            response = settingsResponse.descriptions;
            return response;
        } catch (error) {
            const errorMessage = findErrorMsg(error);
            console.log(errorMessage);
            // Log.error(Log.types.API, `Exception while attempting to get settings: ${errr}`);
        }
        return response;
    },
    // FUNCTION commitSettings commits settings values to localhost:40100/settings.json
    commitSettings (settingsToCommit: settingsTypes, settingString = "") {
        void doAPIPost(apiSettingsRequestUrl, JSON.stringify(settingsToCommit))
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
    },
    async createNewDomainID (newLabel: string): Promise<string> {
        try {
            const domainLabel = `label=${newLabel}`;
            const response = await doAPIPost(apiDomainRequestUrl, domainLabel);
            if (response.data.status === "failure") {
                return "";
            }
            const newDomainID = response.data.domain.domainId;
            return newDomainID;
        } catch (error) {
            console.log(error);
            return "";
        }
    },
    async getDomains () {
        let domains = [] as Domains[];
        try {
            const domainsResponse = await doAPIGet(apiDomainRequestUrl) as DomainsResponse;
            domains = domainsResponse.data.domains;
            return domains;
        } catch (error) {
            console.log(error);
        }
        return domains;
    }
};
