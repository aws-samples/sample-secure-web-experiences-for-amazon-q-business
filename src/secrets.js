import { SecretsManagerClient, GetSecretValueCommand } from '@aws-sdk/client-secrets-manager';
import * as dotenv from 'dotenv';
import { existsSync } from 'fs';

// Load environment variables early for secrets access
if (!process.env.AWS_LAMBDA_FUNCTION_NAME && existsSync('config/.env')) {
  dotenv.config({ path: 'config/.env' });
}

const client = new SecretsManagerClient({
  region: process.env.AWS_REGION || process.env.REGION || 'us-east-1'
});

export async function getQBusinessConfig() {
  const secretName = process.env.QBUSINESS_CONFIG_ID || 'qbusiness-webexperience-config';
  
  try {
    const command = new GetSecretValueCommand({ SecretId: secretName });
    const response = await client.send(command);
    return JSON.parse(response.SecretString);
  } catch (error) {
    console.error('Error retrieving secrets:', error);
    throw error;
  }
}