const listAllFileKeys = require("./listAllFileKeys");

const listObjectsToKeepAndDelete = async ({ dates, pathPrefix, bucketName }) => {
    return Promise.all(
        dates.map(async function (date) {
            const datePrefix = date.format("YMMDD");
            return await listAllFileKeys({
                prefix: pathPrefix + datePrefix,
                bucketName
            });
        })
    ).then((fileKeysForDays) => {
        return fileKeysForDays
            .filter(fileKeys => fileKeys.length > 0)
            .map(([firstKey, ...otherKeys]) => ({ filesToKeep: [firstKey], filesToDelete: otherKeys }))
            .reduce(
                (
                    { filesToDelete: filesToDelete1, filesToKeep: filesToKeep1 },
                    { filesToDelete: filesToDelete2, filesToKeep: filesToKeep2 }
                ) => ({
                    filesToDelete: [...filesToDelete1, ...filesToDelete2],
                    filesToKeep: [...filesToKeep1, ...filesToKeep2]
                }),
                { filesToKeep: [], filesToDelete: []}
            );
    });
};

module.exports = listObjectsToKeepAndDelete;