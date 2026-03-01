import { streamText } from "ai";
import { createXai } from "@ai-sdk/xai";
import { createOpenAI } from "@ai-sdk/openai";
import { createAnthropic } from "@ai-sdk/anthropic";
import { createGoogleGenerativeAI } from "@ai-sdk/google";
import { createOpenRouter } from "@openrouter/ai-sdk-provider";
import color from "picocolors";
import { encode as toonEncode } from "@toon-format/toon";
import * as components from "./catalog/components/specs";
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
          // model: google("gemini-flash-latest"),
          // providerOptions: {
          //   google: {
          //     thinkingConfig: {
          //       thinkingBudget: 0,
          //     },
          //   },
          // },

          model: anthropic("claude-sonnet-4-6"),
          providerOptions: {
            anthropic: {
              // thinking: {
              //   type: "enabled",
              //   budget_tokens: 16000,
              // },
              output_config: { effort: "medium" },
            },
          },

          // model: openai("gpt-5.1-codex-mini"),
          // model: xai("grok-4-1-fast-non-reasoning"),
          messages: [
            { role: "system", content: systemPromptLines },
            { role: "user", content: prompt },
          ].filter((message) => !!message.content),
          onFinish: ({
            text,
            finishReason,
            usage,
            response,
            steps,
            totalUsage,
          }) => {
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

  return systemPromptLines.join("\n");
};

export { handlePromptRoute };
