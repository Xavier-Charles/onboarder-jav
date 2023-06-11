import { createClient } from "@supabase/supabase-js";
import { Configuration, OpenAIApi } from "openai";
import { flow } from "./documents.js";
import "dotenv/config";

const { PROJECT_URL, PUBLIC_API_KEY, OPEN_AI_API_KEY } = process.env;

// Initialize our Supabase client
const supabaseClient = createClient(PROJECT_URL, PUBLIC_API_KEY);

// generateEmbeddings
async function generateEmbeddings() {
  // Initialize OpenAI API
  const configuration = new Configuration({
    apiKey: OPEN_AI_API_KEY,
  });
  const openai = new OpenAIApi(configuration);
  // Create some custom data (Cooper Codes)
  const documents = flow;

  for (const document of documents) {
    const input = document.replace(/\n/g, "");

    // Turn each string (custom data) into an embedding
    const embeddingResponse = await openai.createEmbedding({
      model: "text-embedding-ada-002", // Model that creates our embeddings
      input,
    });

    const [{ embedding }] = embeddingResponse.data.data;

    // Store the embedding and the text in our supabase DB
    await supabaseClient.from("documents").insert({
      content: document,
      embedding,
    });
    console.log(document);
    await new Promise((resolve) => setTimeout(resolve, 1000));
  }
}

export async function askQuestion(question) {
  const { data, error } = await supabaseClient.functions.invoke(
    "ask-custom-data",
    {
      body: JSON.stringify({ query: question }),
    }
  );
  console.log(data);
  console.log(error);
  return data;
}

// askQuestion("What are resources in Flow");

// generateEmbeddings();

// /ask-custom-data -> getting relevant documents, asking chatgpt, returning the response
// Supabase command line interface
