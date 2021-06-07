const AWS = require('aws-sdk');


class S3Client {
    constructor() {
        console.log('constructing s3Client');
        const accessKeyId = process.env.AWS_ACCESS_ID;
        const secretAccessKey = process.env.AWS_SECRET_KEY;
        console.log('values');
        console.log(accessKeyId);
        console.log(secretAccessKey);
        this.client = new AWS.S3({
            accessKeyId,
            secretAccessKey
        })
    }

    async put(request) {
        return new Promise((resolve, reject) => {
            this.client.putObject(request, (error, data) => {
                if (error) {
                    return reject(error);
                }

                return resolve(data);
            })
        })
    }

    async getObject(bucket = "bitter-jester-test", key = "bitter-jester-test.json") {
        const params = {
            Bucket: bucket,
            Key: `competitions/${key}`
        };
        return new Promise((resolve, reject) => {
            this.client.getObject(params, function (err, data) {
                if (err) console.log(err, err.stack);
                else {
                    const jsonStringReturn = data.Body.toString();

                    return resolve(JSON.parse(jsonStringReturn));
                }
            });
        });
    }

    createPutPublicJsonRequest(
        location,
        filename,
        contents
    ) {
        return {
            Bucket: location,
            Key: `competitions/${filename}`,
            Body: contents,
            ContentType: 'application/json; charset=utf-8',
            ACL: 'public-read',
            CacheControl: 'max-age=60'
        };
    }

    async getObjectsInFolder(bucket, prefix) {
        const params = {
            Bucket: bucket,
            Prefix: prefix
        };

        return new Promise((resolve, reject) => {
            this.client.listObjectsV2(params, async (err, data) => {
                if (err) console.log(err, err.stack);
                else {
                    const s3Objects = [];
                    for (let i = 0; i <= data.Contents.length - 1; i++) {
                        const item = data.Contents[i];
                        if (item.Key.includes('.json')) {
                            const s3Object = await this.getObject(bucket, item.Key);
                            s3Objects.push(s3Object);
                        }

                    }
                    return resolve(s3Objects);
                }
            })
        })
    }
}

module.exports = {
    S3Client: S3Client
};