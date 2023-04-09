# VIDA: Vector Image Database Analyzer

## Description

VIDA is a tool that uses AI to compare vectorized image data stored in a database. The tool leverages [Weaviate's](https://github.com/weaviate/weaviate) vector database technology and the `img2vec-neural` vectorizer to convert images into vectors and perform fast and efficient image comparison queries. VIDA uses the Hierarchical Navigable Small World (hnsw) algorithm, an approximate nearest neighbor (ANN) algorithm that is optimized for high-dimensional vector spaces, to search for similar vectors in the database.

## Why I Created This Project

I created this project to learn more about [vector databases](https://www.pinecone.io/learn/vector-database/) and their applications in machine learning. Vector databases allow you to store data objects and vector embeddings from your favorite ML-models, and scale seamlessly into billions of data objects. By using VIDA, you can compare images and vectors stored in a Weaviate database with ease.

## Technical Concept

The technical concept behind using AI to compare images and vectors in a database involves the following steps:

1. Create a Weaviate schema for the database, specifying the classes, properties, and vectorizers used in the database.
2. Add data to the database by encoding images as base64 strings and adding them as properties to instances of the specified class. Weaviate's vectorizers convert these image properties into vectors that can be compared with other vectors in the database.
3. To perform image comparison, use Weaviate's GraphQL API to query the database for instances of the specified class that are similar to a given image. Encode the query image as a base64 string and use the `withNearImage` function to compare it to the image properties of instances in the database. Use the `withLimit` function to restrict the number of results returned by the query.
4. The results of the query are returned as an array of instances, each containing an image property. These images can be decoded from their base64 string representation and saved as files on disk.

By following these steps, VIDA allows you to compare vectorized image data in a database with ease.

### Requirements

* Node.js (v12 or higher)
* Docker
* Docker Compose

### Usage

1. Clone this repository:
	```shell
	git clone https://github.com/Yaten/VIDA.git
	```

2. Navigate to the directory of the cloned repository.

3. Make sure you have Docker and Docker Compose installed on your system.

4. Run the following command to start the VIDA server and the Weaviate database:
	```shell
	docker-compose up -d
	```

5. Install dependencies:

   ```shell
   $ npm install
   ```

To run VIDA, first replace the `test.jpg` image file in the root directory with the image file you want to search for. Then, add the images you want to compare to the `/images` folder.

To start the program, navigate to the root directory in your terminal and run the command `node index.js`. This will start the program and perform a search for similar images based on the query image you specified.

You can also modify the program to perform more complex queries or searches based on your needs.


### License

This project is licensed under the GNU Affero General Public License v3.0. See the [LICENSE](./LICENSE) file for details.

![AGPLv3](agplv3.png)
