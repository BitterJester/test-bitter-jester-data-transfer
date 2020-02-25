require('dotenv').config();
const AWS = require('aws-sdk'); 
const fs = require('fs');
const jotform = require('jotform');

const JOTFORM_API_KEY: string = process.env.JOTFORM_API_KEY;
const AWS_ACCESS_ID: string = process.env.AWS_ACCESS_ID;
const AWS_SECRET_KEY: string = process.env.AWS_SECRET_KEY;

const BITTER_JESTER_TEST_FORM_ID: number = 200548344601145;
const s3Bucket: string = 'bitter-jester-test';


class S3Client {
  protected client;

  constructor(
    accessKeyId: string,
    secretAccessKey: string
  ) {
    this.client = new AWS.S3({
      accessKeyId,
      secretAccessKey
    })
  }

  public async put(request) {
    return new Promise((resolve, reject) => {
      this.client.putObject(request, (error, data) => {
        if (error) {
          return reject(error)
        }

        return resolve(data)
      })
    })
  }

  public createPutPublicJsonRequest(
    location: string,
    filename: string,
    contents: string
  ) {
    const request = {
      Bucket: location,
      Key: filename,
      Body: contents,
      ContentType: 'application/json; charset=utf-8',
      ACL: 'public-read',
      CacheControl: 'max-age=60'
    }

    return request;
  }
}

const s3Client = new S3Client(AWS_ACCESS_ID, AWS_SECRET_KEY);

jotform.options({
    debug: true,
    apiKey: JOTFORM_API_KEY,
    timeout: 10000
});

jotform.getFormSubmissions(BITTER_JESTER_TEST_FORM_ID)
    .then(function (response: any) {
        const s3PutRequest = s3Client.createPutPublicJsonRequest(
            s3Bucket, 
            'bitter-jester-test.json', 
            JSON.stringify(response)
        );
        s3Client.put(s3PutRequest);
    })
    .fail(function (error: any) {
        console.log(`Error: ${error}`);
    });