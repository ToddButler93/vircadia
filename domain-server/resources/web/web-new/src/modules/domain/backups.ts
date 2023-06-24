// Created 24/01/2023 by Ujean

import { buildUrl, doAPIGet, doAPIPost, doAPIDelete, findErrorMsg } from "src/modules/utilities/apiHelpers";
import { Backup, Backups } from "./interfaces/backups";

const apiBackupRequestUrl = "api/backups";

export const BackupsList = {
    async getAutomaticBackupsList (): Promise<Backup[]> {
        const response: Backup[] = [];
        try {
            const backupsResponse = await doAPIGet(apiBackupRequestUrl) as Backups;

            // checks if it is an automatic backup. If so, appends it to the response array
            backupsResponse.backups.forEach(currentBackup => {
                if (currentBackup.isManualBackup === false) {
                    response.push(currentBackup);
                }
            });
            return response;
        } catch (error) {
            const errorMessage = findErrorMsg(error);
            console.log(errorMessage);
        }
        return response;
    },
    async getManualBackupsList (): Promise<Backup[]> {
        const response: Backup[] = [];
        try {
            const backupsResponse = await doAPIGet(apiBackupRequestUrl) as Backups;

            // checks if it is an automatic backup. If so, appends it to the response array
            backupsResponse.backups.forEach(currentBackup => {
                if (currentBackup.isManualBackup === true) {
                    response.push(currentBackup);
                }
            });
            return response;
        } catch (error) {
            const errorMessage = findErrorMsg(error);
            console.log(errorMessage);
        }
        return response;
    },
    generateNewArchive (newArchiveName: string) {
        return doAPIPost(apiBackupRequestUrl, `name=${newArchiveName}`)
            .then(() => {
                console.log("Successfully created new archive.");
                return true;
            })
            .catch((response: string) => {
                console.log(`Failed to create new archive: ${response}`);
                return false;
            });
    },
    downloadBackup (backupID: string) {
        const accessUrl = buildUrl(apiBackupRequestUrl + "/download/");
        window.open(accessUrl + backupID, "_blank");
    },
    deleteBackup (backupID: string) {
        return doAPIDelete(apiBackupRequestUrl + `/${backupID}`)
            .then(() => {
                console.log("Successfully deleted archive.");
                return true;
            })
            .catch((response: string) => {
                console.log(`Failed to delete archive: ${response}`);
                return false;
            });
    }
};
