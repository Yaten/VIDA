import weaviate from 'weaviate-ts-client';
import { readFileSync, readdirSync, writeFileSync } from 'fs';
import path from 'path';

const client = weaviate.client({
  scheme: 'http',
  host: 'localhost:8080',
});

const schemaRes = await client.schema.getter().do();

const schemaConfig = {
  'class': 'VIDA',
  'vectorizer': 'img2vec-neural',
  'vectorIndexType': 'hnsw',
  'moduleconfig': {
    'img2vec-neural': {
      'imageFields': [
        'image'
      ],
    }
  },
  'properties': [
    {
      'name': 'image',
      'dataType': ['blob'],
    },
    {
      'name': 'text',
      'dataType': ['string'],
    }
  ]
};

let hasVIDAClass = false;
for (let i = 0; i < schemaRes.classes.length; i++) {
  if (schemaRes.classes[i].class === 'VIDA') {
    hasVIDAClass = true;
    break;
  }
}

if (!hasVIDAClass) {
  await client.schema
    .classCreator()
    .withClass(schemaConfig)
    .do();
}

const imagesDir = './images';
const imageFiles = readdirSync(imagesDir);

function mimeTypeForExtension(extension) {
  switch (extension.toLowerCase()) {
    case 'jpg':
    case 'jpeg':
      return 'image/jpeg';
    case 'png':
      return 'image/png';
    case 'gif':
      return 'image/gif';
    default:
      return null;
  }
}

function stripMimeTypePrefix(base64String) {
  const prefixMatch = base64String.match(/^data:.*?;base64,/);

  if (prefixMatch) {
    return base64String.slice(prefixMatch[0].length);
  }

  return base64String;
}

async function imageExists(b64WithoutPrefix) {
	const existingImage = await client.graphql.get()
	  .withClassName('VIDA')
	  .withFields(['image'])
	  .withNearImage({image: b64WithoutPrefix})
	  .withLimit(1)
	  .do();

	return existingImage.data.Get.VIDA.length > 0;
  }

  for (let i = 0; i < imageFiles.length; i++) {
	const imageFilePath = `${imagesDir}/${imageFiles[i]}`;
	const image = readFileSync(imageFilePath);
	const fileExtension = path.extname(imageFilePath).slice(1);
	const mimeType = mimeTypeForExtension(fileExtension);

	if (mimeType) {
	  const b64 = `data:${mimeType};base64,${Buffer.from(image).toString('base64')}`;
	  const b64WithoutPrefix = stripMimeTypePrefix(b64);

	  const exists = await imageExists(b64WithoutPrefix);

	  if (!exists) {
		await client.data.creator()
		  .withClassName('VIDA')
		  .withProperties({
			image: b64WithoutPrefix,
			text: imageFiles[i]
		  })
		  .do();
	  } else {
		console.log(`Image ${imageFiles[i]} already exists in the database.`);
	  }
	} else {
	  console.warn(`Unsupported file extension for file: ${imageFiles[i]}`);
	}
  }

  const testImagePath = './test.jpg';
  const testImage = readFileSync(testImagePath);
  const testFileExtension = path.extname(testImagePath).slice(1);
  const testMimeType = mimeTypeForExtension(testFileExtension);
  const testB64 = `data:${testMimeType};base64,${Buffer.from(testImage).toString('base64')}`;
  const testB64WithoutPrefix = stripMimeTypePrefix(testB64);

  const resImage = await client.graphql.get()
	.withClassName('VIDA')
	.withFields(['image'])
	.withNearImage({image: testB64WithoutPrefix})
	.withLimit(1)
	.do();

  const results = resImage.data.Get.VIDA;
  const uniqueResults = new Set(results);
  let i = 0;
  for (const result of uniqueResults) {
	writeFileSync(`./result_${i}.jpg`, result.image, 'base64');
	i++;
  }
