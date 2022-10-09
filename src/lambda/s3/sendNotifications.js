import { S3Handler, S3Event } from 'aws-lambda';
import 'source-map-support/register';

export const handler = (event) => {
    for (const record of event.Records) {
        const key = record.s3.object.key;
        console.log(`Processing S3 item with key: ${key}`);
    }
}