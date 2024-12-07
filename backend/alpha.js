import { MongoClient } from 'mongodb';

async function removeEmptyPseudocodeField() {
  const uri = "mongodb+srv://aashutosh148:ALPHAA@cluster0.mwizs.mongodb.net/algoBox?retryWrites=true&w=majority&appName=Cluster0";
  const client = new MongoClient(uri);

  try {
    await client.connect();
    console.log("Connected to MongoDB!");

    const database = client.db("algoBox");
    const collection = database.collection("yourCollectionName"); // Replace with your collection name

    const result = await collection.updateMany(
      { "code.pseudocode" : "``"},  // Match documents where pseudocode is an empty string
      { $unset: { "pseudocode": "``" } }  // Remove the field
    );

    console.log(`${result.modifiedCount} documents were updated.`);
  } catch (err) {
    console.error("An error occurred:", err);
  } finally {
    await client.close();
    console.log("MongoDB connection closed.");
  }
}

removeEmptyPseudocodeField();
