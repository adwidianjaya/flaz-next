import { stepCountIs, streamText, tool } from "ai";
import { z } from "zod";
import { createXai } from "@ai-sdk/xai";
import { createOpenAI } from "@ai-sdk/openai";
import { createAnthropic } from "@ai-sdk/anthropic";
import { createGoogleGenerativeAI } from "@ai-sdk/google";
import { createOpenRouter } from "@openrouter/ai-sdk-provider";
import color from "picocolors";
import { encode as toonEncode } from "@toon-format/toon";
import * as components from "./catalog/components/defs";
// console.log({ components });

const xai = createXai({
  apiKey: process.env.XAI_API_KEY,
});
const openai = createOpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});
const anthropic = createAnthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});
const google = createGoogleGenerativeAI({
  apiKey: process.env.GEMINI_API_KEY,
});
const openrouter = createOpenRouter({
  apiKey: process.env.OPENROUTER_API_KEY,
});

const searchImage = tool({
  description:
    "Search for high-quality stock images on Unsplash based on a query.",
  inputSchema: z.object({
    query: z
      .string()
      .describe('The search term for the image (e.g., "mountain landscape")'),
    // perPage: z
    //   .number()
    //   .optional()
    //   .default(3)
    //   .describe("Number of images to return"),
    orientation: z
      .enum(["landscape", "portrait", "squarish"])
      .optional()
      .describe("Preferred image orientation"),
  }),
  execute: async ({ query, perPage = 3, orientation }) => {
    const accessKey = process.env.UNSPLASH_ACCESS_KEY;
    // console.log("...execute searchImage", accessKey);

    if (!accessKey) {
      throw new Error("Missing UNSPLASH_ACCESS_KEY in environment variables.");
    }

    const searchParams = new URLSearchParams({
      query,
      per_page: String(perPage),
    });
    if (orientation) {
      searchParams.set("orientation", orientation);
    }

    const response = await fetch(
      `https://api.unsplash.com/search/photos?${searchParams.toString()}`,
      {
        headers: {
          Authorization: `Client-ID ${accessKey}`,
        },
      },
    );

    // console.log({ response });
    if (!response.ok) {
      return { error: "Failed to fetch images from Unsplash" };
    }

    const data = await response.json();

    // Map the response to a cleaner format for the LLM
    const imageResults = data.results.map((img) => ({
      // id: img.id,
      url: img.urls.regular,
      alt: img.alt_description,
      // photographer: img.user.name,
      // link: img.links.html,
    }));

    // console.log("...execute searchImage", imageResults, { query });
    return imageResults;
  },
});

const handlePromptRoute = async (request) => {
  const { prompt, context } = await request.json();
  console.log("...handleRequest", prompt);
  // console.log("...context", color.green(JSON.stringify(context, null, 2)));

  const systemPromptLines = buildSystemPrompt({
    catalog: { components },
    currentElements: context?.elements,
    currentStates: context?.states,
  });
  console.log("...system", color.cyan(systemPromptLines), "\n");
  console.log("...prompt", color.green(prompt));
  // return new Response(prompt);

  const stream = new ReadableStream({
    async start(controller) {
      try {
        const encoder = new TextEncoder();

        const result = streamText({
          // model: google("gemini-3-flash-preview"),
          model: google("gemini-flash-latest"),
          providerOptions: {
            google: {
              thinkingConfig: {
                thinkingBudget: 0,
              },
            },
          },

          // model: anthropic("claude-sonnet-4-6"),
          // providerOptions: {
          //   anthropic: {
          //     // thinking: {
          //     //   type: "enabled",
          //     //   budget_tokens: 16000,
          //     // },
          //     output_config: { effort: "medium" },
          //   },
          // },

          // model: openai("gpt-5.1-codex-mini"),
          // model: xai("grok-4-1-fast-non-reasoning"),
          messages: [
            { role: "system", content: systemPromptLines },
            { role: "user", content: prompt },
          ].filter((message) => !!message.content),
          //
          tools: {
            searchImage,
            searchImageTool: searchImage,
          },
          toolChoice: "auto",
          stopWhen: stepCountIs(5),
          // onStepFinish({
          //   stepNumber,
          //   text,
          //   toolCalls,
          //   toolResults,
          //   finishReason,
          //   usage,
          // }) {
          //   console.log(
          //     "...onStepFinish!",
          //     JSON.stringify(
          //       {
          //         text,
          //         toolCalls,
          //         // toolResults
          //         stepNumber,
          //       },
          //       null,
          //       2,
          //     ),
          //   );
          // },
          onFinish: ({
            text,
            finishReason,
            usage,
            response,
            steps,
            totalUsage,
          }) => {
            // console.log(JSON.stringify(steps, null, 2));
            // console.log({ steps: steps.map((step) => step.finishReason) });
            // console.log({ finishReason });

            controller.enqueue(
              encoder.encode(
                "\n" +
                  JSON.stringify({
                    op: "info",
                    inputTokens: totalUsage.inputTokens,
                    outputTokens: totalUsage.outputTokens,
                    reasoningTokens:
                      usage.outputTokenDetails.reasoningTokens || 0,
                    totalTokens: totalUsage.totalTokens,
                  }),
              ),
            );

            console.log("");
            console.log("");
            console.log("...inputTokens", color.red(totalUsage.inputTokens));
            console.log("...outputTokens", color.red(totalUsage.outputTokens));
            console.log(
              "...reasoningTokens",
              color.red(usage.outputTokenDetails.reasoningTokens || 0),
            );
            console.log("...totalTokens", color.red(totalUsage.totalTokens));
            // console.log({ usage });

            controller.close();
          },
          onError: (error) => {
            console.error("...error", error);
            controller.enqueue(
              encoder.encode(
                "\n" +
                  JSON.stringify({
                    op: "error",
                    message: error.message,
                  }),
              ),
            );

            controller.close();
          },
        });

        console.warn("\n...output...");
        for await (const textPart of result.textStream) {
          process.stdout.write(textPart);
          controller.enqueue(encoder.encode(textPart));
        }
      } catch (err) {
        console.warn("...error", color.red(err));
      }
    },
  });

  return new Response(stream, {
    headers: {
      "Content-Type": "text/event-stream",
      "Cache-Control": "no-cache",
      Connection: "keep-alive",
    },
  });
};

const buildSystemPrompt = ({
  catalog = {
    components: {},
  },
  currentElements = {},
  currentStates = {},
}) => {
  let systemPromptLines = [];

  systemPromptLines.push(`You are a developer assistant.`);

  systemPromptLines.push(`You can only use the following components:`);
  systemPromptLines.push(toonEncode(catalog.components));
  systemPromptLines.push(
    `\nPrioritize native component props for customizing. Manually adding class names must be avoided until necessary.`,
  );

  systemPromptLines.push(`\nHere is current elements and states:`);
  systemPromptLines.push(
    toonEncode({
      elements: currentElements,
      states: currentStates,
    }),
  );

  systemPromptLines.push(`Provide response in plain text JSONL format.`);
  systemPromptLines.push(
    `Do not use Markdown. Do not use any special formatting characters.`,
  );

  systemPromptLines.push(`\nThere are three types of operations:`);
  systemPromptLines.push(`{"op":"add","path":"...","value": ...}`);
  systemPromptLines.push(`{"op":"replace","path":"...","value": ...}`);
  systemPromptLines.push(`{"op":"remove","path":"..."}`);

  systemPromptLines.push(
    `\nHere are examples for $states path (for state operation):`,
  );
  systemPromptLines.push(
    JSON.stringify({ op: "add", path: "$states.form.email", value: "" }),
  );

  systemPromptLines.push(
    `\nHere are examples for $elements path (for visual operation and state binding):`,
  );
  systemPromptLines.push(
    JSON.stringify({ op: "add", path: "$root", value: "login-container" }),
  );
  systemPromptLines.push(
    JSON.stringify({
      op: "add",
      path: "$elements.login-container",
      value: {
        type: "Card",
        props: {
          title: "Sign In",
          description: "Enter your credentials to access your account",
          maxWidth: "sm",
          centered: true,
        },
        children: ["email-input", "greeting-text"],
      },
    }),
  );
  systemPromptLines.push(
    JSON.stringify({
      op: "add",
      path: "$elements.email-input",
      value: {
        type: "TextInput",
        props: {
          label: "Email Address",
          name: "email",
          type: "email",
          placeholder: "you@example.com",
          value: "{$states.form.email}",
        },
        // children: [],
      },
    }),
  );
  systemPromptLines.push(
    JSON.stringify({
      op: "add",
      path: "$elements.greeting-text",
      value: {
        type: "Text",
        props: {
          text: "{$states.form.email ? 'Hello, ' + $states.form.email + '!' : ''}",
          level: "p",
          className: "text-orange-500 font-bold",
        },
        // children: [],
      },
    }),
  );

  systemPromptLines.push(
    `\nState binding have two forms: {$states.[...].[...]} or {...js expression...} on elements props to define state binding.`,
  );
  systemPromptLines.push(
    `Binding policy: direct binding must be exactly "{$states...}". Expression binding "{...}" is read-only against $states and must not include side effects, declarations, or function definitions.`,
  );

  systemPromptLines.push(
    `Build nested path start from top level paths: $root, $states, and $elements.`,
  );
  systemPromptLines.push(
    `Avoid pathing with slashes, and always use dot notation for nested paths.`,
  );
  // systemPromptLines.push(
  //   `Path grammar examples: $root, $states.form.email, $elements.login-card, $elements.login-card.props.title, $elements.login-card.children.`,
  // );

  systemPromptLines.push(
    `Element policy: element IDs must be unique, children must reference existing element IDs, and children cycles are not allowed.`,
  );
  systemPromptLines.push(
    `Operation ordering policy: create required $states paths before bindings, create child elements before parent children references, and remove parent references before removing a child element.`,
  );
  systemPromptLines.push(
    `Minimality policy: do not emit no-op changes; prefer replace over remove+add at the same path when possible.`,
  );
  systemPromptLines.push(
    `Children array update policy: When changing array path, always use replace. Example: {"op":"replace","path":"$elements.<id>.children","value":["child-a","child-b"]}.`,
  );
  systemPromptLines.push(
    `\nFirst-response rule: if $root is empty or missing, line 1 MUST be {"op":"add","path":"$root","value":"<element-id>"}. If $root already exists, do not re-add it.`,
  );

  systemPromptLines.push(`\nYou have access to searchImage (Unsplash search).`);
  systemPromptLines.push(
    `Use searchImage when you need to find high-quality images from the internet based on user requests (e.g., "show me a picture of a cat", "add a mountain background", "find a profile photo").`,
  );
  systemPromptLines.push(
    `If the user specifies orientation, pass orientation to searchImage. Allowed values: landscape, portrait, squarish.`,
  );
  systemPromptLines.push(
    `Once you receive the tool results, pick the most relevant image and use its 'url' in the 'src' prop of components like 'Image' or 'Avatar', then return JSONL op result.`,
  );

  return systemPromptLines.join("\n");
};

export { handlePromptRoute };
