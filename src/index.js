const moment = require('moment');
const chunk = require('lodash.chunk');

const listObjectsToKeepAndDelete = require("./listObjectsToKeepAndDelete");
const deleteFiles = require("./deleteFiles");

const DEFAULT_GRACE_PERIOD_IN_DAYS = 30;
const NUMBER_OF_DAYS_TO_CLEAN = 60;
const DELETE_CHUNK_SIZE = 1000;

const prepareDatesToBeCleaned = (startDate) => Array.from(
    { length: NUMBER_OF_DAYS_TO_CLEAN },
    (x, i) => startDate.clone().add(i, 'days')
);

exports.handler = async (event, context) => {
    const bucketName = process.env.S3_BUCKET_NAME;
    const pathPrefix = process.env.FILE_PATH_PREFIX;
    const gracePeriod = parseInt(process.env.GRACE_PERIOD_IN_DAYS) || DEFAULT_GRACE_PERIOD_IN_DAYS;

    console.log("Running script")
    console.log("=== Configuration ===");
    console.log(`Bucket: ${bucketName}`);
    console.log(`File path prefix: ${pathPrefix}`);
    console.log(`Clean older than: ${gracePeriod} days`);

    const firstDayToBeCleaned = moment()
        .subtract(gracePeriod + NUMBER_OF_DAYS_TO_CLEAN, "day");

    const datesToBeCleaned = prepareDatesToBeCleaned(firstDayToBeCleaned);
    const { filesToKeep, filesToDelete } = await listObjectsToKeepAndDelete({
        pathPrefix,
        bucketName,
        dates: datesToBeCleaned
    })

    console.log(`=== Files to keep (${filesToKeep.length}) ===`);
    filesToKeep.forEach(file => { console.log(file); });
    console.log(`=== Files that will be deleted (${filesToDelete.length}) ===`);
    filesToDelete.forEach(file => { console.log(file); });

    chunk(filesToDelete, DELETE_CHUNK_SIZE)
        .forEach((fileKeys) => {
            deleteFiles({ fileKeys, bucketName })
        });
    console.log("Cleaning complete!");
};
