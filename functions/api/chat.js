export async function onRequestPost(context) {
  const ai = context.env.AI; 

  try {
    const { messages } = await context.request.json();

    const response = await ai.run("@cf/meta/llama-3-8b-instruct", {
      messages: messages,
    });

    return new Response(JSON.stringify(response), {
      headers: { "Content-Type": "application/json" },
    });

  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), { status: 500 });
  }
}
