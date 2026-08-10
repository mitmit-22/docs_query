export async function embedChunks(chunks, inputType = "document") {
  const response = await fetch("https://api.voyageai.com/v1/embeddings", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${process.env.VOYAGE_API_KEY}`,
    },
    body: JSON.stringify({
      input: chunks,
      model: "voyage-2",
      input_type: inputType,
    }),
  });

  if (!response.ok) {
    const errText = await response.text();
    throw new Error(`Voyage embedding failed: ${errText}`);
  }

  const data = await response.json();
  return data.data.map((item) => item.embedding);
}