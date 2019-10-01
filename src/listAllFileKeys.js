const aws = require('aws-sdk');

const s3 = new aws.S3({ apiVersion: '2006-03-01' });

const listFileKeys = async function ({ continuationToken = null, bucketName, prefix }) {
    const params = {
        Bucket: bucketName,
        Prefix: prefix,
        ContinuationToken: continuationToken
    };

    const { Contents: files, NextContinuationToken } = await s3.listObjectsV2(params).promise();
    return {
        fileKeys: files.map(({ Key }) => Key),
        nextToken: NextContinuationToken
    };
}

module.exports = async function({ bucketName, prefix }) {
    let continuationToken = '';
    let allFileKeys = [];

    const { fileKeys: firstFileKeys, nextToken: firstToken } = await listFileKeys({ bucketName, prefix});
    continuationToken = firstToken;
    allFileKeys = firstFileKeys;

    while (continuationToken) {
        const { fileKeys, nextToken } = listFileKeys({ continuationToken, bucketName, prefix})
        allFileKeys = allFileKeys.concat(fileKeys);
        continuationToken = nextToken;
    }

    return await allFileKeys;
}