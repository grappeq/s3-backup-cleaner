const aws = require('aws-sdk');

const s3 = new aws.S3({ apiVersion: '2006-03-01' });

const deleteFiles = ({ fileKeys, bucketName }) => {
    const params = {
        Bucket: bucketName,
        Delete: {
            Objects: fileKeys.map(fileKey => ({ Key: fileKey })),
            Quiet: false
        }
    };
    s3.deleteObjects(params).promise()
        .then(console.log)
        .catch(console.error);
};

module.exports = deleteFiles;