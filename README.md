# S3 backup cleaner script
Script for removing old backups from s3 (old in this case means > 1 month old).
Keeps first backup for each day. 

## Running
### Production
I'm running this on AWS Lambda once a month. Following env vars need to be specified:
* **S3_BUCKET_NAME** (e.g. *some-bucket*)
* **FILE_PATH_PREFIX**: prefix for which the files are listed (e.g. *backups/db_* if files are in *backups* dir and named *db_\<date\>*)
Also, the function must have access to the bucket setup along with proper permissions.

### Locally
1. Clone this repo.
2. Run `npm install`
3. Configure AWS credentials.
4. Set env vars.
5. Run the script using `node run.js`.