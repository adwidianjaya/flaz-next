export default function Page() {
  const structureString = JSON.stringify(
    {
      elements: [
        {
          type: "Container",
          props: {
            direction: "column",
            gap: "4",
            align: "center",
            justify: "center",
            className: "p-8",
          },
          children: [
            {
              type: "Card",
              props: {
                title: "Enter Your Name",
                description: "Type your name to see a greeting",
                maxWidth: "md",
                centered: true,
              },
              children: [
                {
                  type: "ShortTextInput",
                  props: {
                    label: "Name",
                    description: "Enter your name",
                    placeholder: "Your name here",
                    value: "$/states/form/name",
                  },
                  events: {
                    oninput: "name-input",
                  },
                },
              ],
            },
            {
              type: "Text",
              props: {
                text: "${/states/form/name ? 'Hello, ' + /states/form/name + '!' : 'Enter your name above'}",
                level: "h2",
                className: "text-orange-500 font-bold text-2xl",
              },
              events: {},
            },
          ],
        },
      ],
      states: {
        form: {
          name: "",
        },
      },
    },
    null,
    2,
  );

  return (
    <div class="flex flex-col h-screen bg-black text-zinc-400 font-sans">
      <header class="flex items-center justify-between px-4 py-2 border-b border-zinc-800">
        <div class="flex items-center gap-2">
          <div class="w-4 h-4 bg-white clip-triangle"></div>
          <span class="text-white font-medium text-sm">/ json-render</span>
        </div>
        <div class="flex items-center gap-6 text-xs">
          <a href="#" class="text-white">
            Playground
          </a>
          <a href="#" class="hover:text-white">
            Docs
          </a>
          <div class="flex items-center gap-1 hover:text-white cursor-pointer">
            <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 .587l3.668 7.431 8.2 1.192-5.934 5.787 1.4 8.168L12 18.896l-7.334 3.869 1.4-8.168L.132 9.21l8.2-1.192z" />
            </svg>
            <span>10.5k</span>
          </div>
          <button class="p-1 hover:bg-zinc-800 rounded">
            <svg
              class="w-4 h-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364-6.364l-.707.707M6.343 17.657l-.707.707m12.728 0l-.707-.707M6.343 6.343l-.707-.707M12 8a4 4 0 100 8 4 4 0 000-8z"
              />
            </svg>
          </button>
        </div>
      </header>

      <main class="flex flex-1 overflow-hidden">
        <aside class="w-64 flex flex-col border-r border-zinc-800">
          <div class="p-2 border-b border-zinc-800 text-[10px] uppercase tracking-wider">
            versions
          </div>
          <div class="flex-1 flex flex-col items-center justify-center p-6 text-center overflow-scroll whitespace-pre font-mono">
            {structureString}
            {/* <p class="text-sm mb-6 px-4">
              Describe what you want to build, then iterate on it.
            </p>
            <div class="space-y-2 w-full">
              <button class="w-full py-1.5 px-3 text-xs border border-zinc-800 rounded hover:bg-zinc-900 transition-colors">
                Create a login form
              </button>
              <button class="w-full py-1.5 px-3 text-xs border border-zinc-800 rounded hover:bg-zinc-900 transition-colors">
                Build a pricing page
              </button>
              <button class="w-full py-1.5 px-3 text-xs border border-zinc-800 rounded hover:bg-zinc-900 transition-colors">
                Design a user profile card
              </button>
              <button class="w-full py-1.5 px-3 text-xs border border-zinc-800 rounded hover:bg-zinc-900 transition-colors">
                Make a contact form
              </button>
            </div> */}
          </div>
          <div class="p-3 border-t border-zinc-800">
            <div class="relative">
              <input
                type="text"
                placeholder="Describe changes..."
                class="w-full bg-transparent text-sm border-none focus:ring-0 placeholder-zinc-600 pr-8"
              />
              <button class="absolute right-0 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-white">
                <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                  <path
                    fill-rule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-8.707l-3-3a1 1 0 00-1.414 1.414L10.586 9H7a1 1 0 100 2h3.586l-1.293 1.293a1 1 0 101.414 1.414l3-3a1 1 0 000-1.414z"
                    clip-rule="evenodd"
                  />
                </svg>
              </button>
            </div>
          </div>
        </aside>

        <section class="flex-1 flex flex-col border-r border-zinc-800">
          <div class="flex items-center justify-between px-3 py-2 border-b border-zinc-800 text-xs">
            <div class="flex gap-4">
              <span class="text-white cursor-pointer">json</span>
              <span class="hover:text-white cursor-pointer">nested</span>
              <span class="hover:text-white cursor-pointer">stream</span>
              <span class="hover:text-white cursor-pointer">catalog</span>
            </div>
            <button class="hover:text-white">
              <svg
                class="w-4 h-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"
                />
              </svg>
            </button>
          </div>
          <div class="flex-1 p-4 font-mono text-sm text-zinc-600">
            // waiting...
          </div>
        </section>

        <section class="flex-1 flex flex-col relative">
          <div class="flex items-center gap-4 px-3 py-2 border-b border-zinc-800 text-xs">
            <span class="text-white cursor-pointer">preview</span>
            <span class="hover:text-white cursor-pointer">code</span>
          </div>
          <div class="flex-1 flex items-center justify-center font-mono text-sm text-zinc-600">
            // enter a prompt to generate UI
          </div>
          <button class="absolute bottom-4 right-4 bg-zinc-900 border border-zinc-700 text-white px-3 py-1.5 rounded-md text-xs flex items-center gap-2 hover:bg-zinc-800">
            <span>Ask AI</span>
            <span class="text-zinc-500 text-[10px]">⌘ K</span>
          </button>
        </section>
      </main>
    </div>
  );
}
