import { streamText } from "ai";
import { createXai } from "@ai-sdk/xai";
import color from "picocolors";
import { encode as toonEncode } from "@toon-format/toon";
import * as catalog from "./catalog";
import { set } from "lodash-es";

// console.log("...XAI_API_KEY", process.env.XAI_API_KEY);
const xai = createXai({
  apiKey: process.env.XAI_API_KEY,
});

const deployPromptRoute = async (request) => {
  const { prompt } = await request.json();
  console.log("...prompt", color.green(prompt));

  const systemPromptLines = [];
  systemPromptLines.push(`You are a developer assistant.`);

  systemPromptLines.push(`You can only use the following components:`);
  systemPromptLines.push(toonEncode(catalog.components));

  systemPromptLines.push(
    `Response with JSONL format only. Avoid any markdown formatting.`,
  );

  systemPromptLines.push(`\nThere are three types of operations:`);
  systemPromptLines.push(`{"op":"add","path":"...","value": ...}`);
  systemPromptLines.push(`{"op":"replace","path":"...","value": ...}`);
  systemPromptLines.push(`{"op":"remove","path":"...","value": ...}`);

  systemPromptLines.push(
    `\nHere are examples for /states path (for state definition):`,
  );
  systemPromptLines.push(
    JSON.stringify({ op: "add", path: "/states/form/email", value: "" }),
  );

  systemPromptLines.push(
    `\nHere are examples for /elements path (for visual definition and state binding):`,
  );
  systemPromptLines.push(
    JSON.stringify({ op: "add", path: "/root", value: "login-container" }),
  );
  systemPromptLines.push(
    JSON.stringify({
      op: "add",
      path: "/elements/login-container",
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
      path: "/elements/email-input",
      value: {
        type: "Input",
        props: {
          label: "Email Address",
          name: "email",
          type: "email",
          placeholder: "you@example.com",
          value: "$/states/form/email",
          checks: [
            { type: "required", message: "Email is required" },
            { type: "email", message: "Please enter a valid email" },
          ],
        },
        // children: [],
      },
    }),
  );
  systemPromptLines.push(
    JSON.stringify({
      op: "add",
      path: "/elements/greeting-text",
      value: {
        type: "Text",
        props: {
          text: "${/states/form/email ? 'Hello, ' + /states/form/email + '!' : ''}",
          level: "p",
          class: "text-orange-500 font-bold",
        },
        // children: [],
      },
    }),
  );

  systemPromptLines.push(`\nState binding have two forms:`);
  systemPromptLines.push(
    "$/states/... on elements props to define two way state binding for reactivity.",
  );
  systemPromptLines.push(
    "${/states/...} on elements props to define read-only state binding for rendering. This form is also support ternary operator.",
  );

  systemPromptLines.push(
    `\nAlways produce operation on /root path for first response.`,
  );

  console.log("...system", color.cyan(systemPromptLines.join("\n")), "\n");
  // return Response.json({ message: "Hello World" });

  const result = streamText({
    model: xai("grok-4-1-fast-non-reasoning"),
    messages: [
      { role: "system", content: systemPromptLines.join("\n") },
      { role: "user", content: prompt },
    ].filter((message) => !!message.content),
    onFinish: ({ text, finishReason, usage, response, steps, totalUsage }) => {
      console.log("");
      console.log("");
      console.log("...inputTokens", color.red(totalUsage.inputTokens));
      console.log("...outputTokens", color.red(totalUsage.outputTokens));
      console.log("...totalTokens", color.red(totalUsage.totalTokens));
    },
  });

  const stream = new ReadableStream({
    async start(controller) {
      const encoder = new TextEncoder();

      for await (const textPart of result.textStream) {
        process.stdout.write(textPart);
        controller.enqueue(encoder.encode(textPart));
      }

      controller.close();
    },
  });

  return new Response(stream, {
    headers: {
      "Content-Type": "text/event-stream",
      "Cache-Control": "no-cache",
      Connection: "keep-alive",
    },
  });

  // return Response.json({ message: "Hello World" });
};

const initDefinition = () => {
  return {
    root: "",
    states: {},
    elements: {},
  };
};

const updateDefinitionByOperationString = ({ operationString, definition }) => {
  let operation = null;
  try {
    operation = JSON.parse(operationString);
  } catch (err) {
    console.warn(
      "...error parsing operationString",
      err.message,
      // color.red(operationString),
    );
  }
  // console.log(
  //   "\n...updateDefinition",
  //   color.yellow(JSON.stringify(operation, null, 2)),
  // );
  if (!operation) return { ...definition };

  const newDefinition = {
    ...definition,
    //
    states: {
      ...(definition.states || {}),
    },
    elements: {
      ...(definition.elements || {}),
    },
  };

  if (operation.path.startsWith("/states")) {
    if (operation.op === "remove") {
      // do nothing
    } else {
      set(
        newDefinition.states,
        operation.path.split("/states/").join("").split("/").join("."),
        operation.value,
      );
    }
  } else if (operation.path.startsWith("/elements")) {
    if (operation.op === "remove") {
      delete newDefinition.elements[
        operation.path.split("/elements/").join("")
      ];
    } else if (operation.op === "replace") {
      newDefinition.elements[operation.path.split("/elements/").join("")] =
        operation.value;
    } else if (operation.op === "add") {
      const elementId = operation.path.split("/elements/").join("");
      newDefinition.elements[elementId] = operation.value;
    }
  } else if (operation.path.startsWith("/root")) {
    newDefinition.root = operation.value;
  }

  return newDefinition;
};

const convertChildToRenderStructure = ({ element, definitionReferences }) => {
  if (!element) return null;

  let renderStructure = JSON.parse(JSON.stringify(element));

  if (renderStructure.children?.length > 0) {
    renderStructure.children = renderStructure.children
      .map((childId) => {
        return convertChildToRenderStructure({
          element: definitionReferences.elements[childId],
          definitionReferences,
        });
      })
      .filter((child) => !!child);
  }

  return renderStructure;
};

const convertDefinitionToRenderStructure = ({ definitionReferences }) => {
  if (
    !definitionReferences.root ||
    !definitionReferences.elements[definitionReferences.root]
  ) {
    return {};
  }

  let render = {
    elements: [
      convertChildToRenderStructure({
        element: definitionReferences.elements[definitionReferences.root],
        definitionReferences,
      }),
    ],
    states: JSON.parse(JSON.stringify(definitionReferences.states)),
  };

  return render;
};

export {
  deployPromptRoute,
  initDefinition,
  updateDefinitionByOperationString,
  convertDefinitionToRenderStructure,
};
