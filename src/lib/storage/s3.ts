import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";

const s3Client = process.env.AWS_ACCESS_KEY_ID
  ? new S3Client({
      region: process.env.AWS_REGION || "us-east-1",
      credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
      },
    })
  : null;

export async function uploadPDF(file: Buffer, key: string): Promise<string> {
  if (!s3Client) {
    throw new Error("AWS S3 not configured. Set AWS credentials in .env");
  }

  const command = new PutObjectCommand({
    Bucket: process.env.AWS_BUCKET_NAME!,
    Key: key,
    Body: file,
    ContentType: "application/pdf",
  });

  await s3Client.send(command);

  return `https://${process.env.AWS_BUCKET_NAME}.s3.${process.env.AWS_REGION}.amazonaws.com/${key}`;
}

export function generateS3Key(paperId: string, filename: string): string {
  const timestamp = Date.now();
  return `papers/${paperId}/${timestamp}-${filename}`;
}
