import { writeFile } from 'node:fs/promises';
import { openApiDocument } from './openapi.ts';

async function generateOpenApiSpec(): Promise<void> {
  await writeFile('./src/docs/swagger-output.json', `${JSON.stringify(openApiDocument, null, 2)}\n`);
  console.log('OpenAPI spec generated at src/docs/swagger-output.json');
}

generateOpenApiSpec().catch((error: unknown) => {
  console.error('OpenAPI generation failed:', error);
  process.exitCode = 1;
});
