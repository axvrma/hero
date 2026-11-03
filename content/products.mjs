/** @type {import('./types.js').Product[]} */
export const products = [
  {
    id: "atlas",
    name: "Atlas",
    category: "Visual workflow engineering",
    tagline: "Complex logic. A clearer picture.",
    description:
      "Design workflows visually, simulate events, and understand every execution. A browser-local studio that makes the logic visible.",
    live: "https://atlas.axvrma.com",
    source: "https://github.com/axvrma/atlas",
    stack: ["React", "TypeScript", "XYFlow", "IndexedDB"],
    features: [
      "Visual graph editor with eight node types",
      "Deterministic execution and step-by-step debugging",
      "Versioned local persistence and JSON import/export",
      "Shared accessible UI with an independent Storybook",
    ],
    architecture: [
      "Typed contracts",
      "React-free execution engine",
      "Graph editor & debugger",
      "IndexedDB workspace",
    ],
    sections: [
      {
        title: "The problem",
        body: "Workflow diagrams explain intent, but they rarely show what actually happens to a payload. Atlas connects the diagram to a deterministic execution so the same graph can be designed, run, and inspected.",
      },
      {
        title: "The solution",
        body: "A visual workspace pairs a graph editor with sample inputs, explicit branch routing, structured execution logs, and a playback debugger. Five seeded workflows provide concrete starting points.",
      },
      {
        title: "Product experience",
        body: "Create or duplicate a workflow, connect nodes, configure conditions and transformations, and validate the graph. Run a scenario, step through input and output at each node, then compare outcomes in execution history.",
      },
      {
        title: "Engineering decisions",
        body: "The engine depends on typed contracts rather than React. Historical executions embed graph snapshots, while graph-edit undo remains separate from run history. Shared UI components are consumed by both the app and Storybook.",
      },
      {
        title: "Challenges & trade-offs",
        body: "Keeping execution understandable means explicit boundaries: graphs are single-path DAGs, cycles are rejected, and delays use virtual time. HTTP, notifications, AI classification, and Copilot are simulations rather than live integrations.",
      },
      {
        title: "Performance evidence",
        body: "The repository includes a reproducible engine benchmark at 10, 50, 100, and 250 nodes, with warm-up, median and p95 samples. Those CPU measurements do not establish canvas frame rates or field Web Vitals.",
      },
    ],
    limitations:
      "Browser-local state; no multi-user collaboration or cross-device sync. External requests and AI are explicitly simulated.",
    evidence: ["https://github.com/axvrma/atlas/blob/main/README.md"],
    legacy: ["atlas"],
  },
  {
    id: "vibes",
    name: "Vibes",
    category: "Private media ecosystem",
    tagline: "Your feed. Your rules.",
    description:
      "A personal short-video experience. A Flutter player, Angular dashboard, and self-hosted API put your media back in your hands.",
    live: "https://vibes.axvrma.com",
    source: "https://github.com/axvrma/vibes",
    stack: ["Flutter", "Angular", "Node.js", "SQLite"],
    features: [
      "Vertical video browsing in Flutter",
      "Private media API and JWT authentication",
      "Angular dashboard for uploads and content",
      "Docker Compose deployment with persistent media storage",
    ],
    architecture: [
      "Flutter player",
      "Angular dashboard",
      "Express media API",
      "SQLite & media volume",
    ],
    sections: [
      {
        title: "The problem",
        body: "A personal video collection should be browsable without handing its organization to a social platform. The engineering problem spans playback, media administration, authentication, and deployment.",
      },
      {
        title: "The solution",
        body: "Separate the mobile viewing experience from the dashboard and media service. The Flutter player offers vertical browsing, while an Angular administration interface manages content served by an Express API.",
      },
      {
        title: "Product experience",
        body: "The system supports a private collection, vertical playback and liked-video metadata. The public website demonstrates sample playback and labels conceptual notes and dashboard interactions separately from shipped app functionality.",
      },
      {
        title: "Engineering decisions",
        body: "SQLite and a persistent media volume keep self-hosting approachable. Docker Compose assembles the backend and dashboard without coupling them to the independent marketing website.",
      },
      {
        title: "Challenges & trade-offs",
        body: "The mobile app, API and dashboard have distinct runtime and deployment needs. A sample in the public site is not evidence that a visitor is connected to a private media server.",
      },
    ],
    limitations:
      "The live link opens the public product website. A personal server and app setup are separate; public demo media is illustrative.",
    evidence: ["https://github.com/axvrma/vibes/blob/master/README.md"],
    legacy: ["vibes"],
  },
  {
    id: "envision",
    name: "Envision",
    category: "Spatial computing",
    tagline: "An idea. A command. Another dimension.",
    description:
      "Explore a procedural 3D object library through voice and text, then take supported experiences into camera AR.",
    live: "https://envision.axvrma.com",
    source: "https://github.com/axvrma/vox-ar",
    stack: ["React", "Three.js", "WebXR", "TypeScript"],
    features: [
      "Ten procedural objects with supported text commands",
      "Camera-free 3D studio and object inspector",
      "Voice commands where browser speech is supported",
      "Separate WebXR / 8th Wall AR runtime",
    ],
    architecture: [
      "Command parser",
      "Shared procedural models",
      "Three.js browser studio",
      "Isolated camera AR runtime",
    ],
    sections: [
      {
        title: "The problem",
        body: "Spatial experiences often begin with permissions and device constraints. Envision offers an immediate browser studio before asking a visitor to move into a camera session.",
      },
      {
        title: "The solution",
        body: "A shared library maps supported object and color commands to procedural geometry. The camera-free studio and original VoxAR runtime use the same model vocabulary through separate entry points.",
      },
      {
        title: "Product experience",
        body: "Try a supported command such as “gold rocket,” orbit the result, and edit selected objects in the studio. On compatible devices, launch AR deliberately and place supported objects after surface detection.",
      },
      {
        title: "Engineering decisions",
        body: "The original AR runtime remains isolated from the React marketing and studio build. Optional speech has a text fallback. Models dispose on removal, rendering pauses offscreen, and render resolution and scene counts are bounded.",
      },
      {
        title: "Challenges & trade-offs",
        body: "Commands select predefined procedural models; arbitrary prompts do not generate geometry. Camera AR depends on browser support, HTTPS, device capabilities and the external engine. Studio state stays in the current tab.",
      },
    ],
    limitations:
      "Voice and camera AR depend on browser/device support. This portfolio does not claim physical-device AR verification. Previously named VoxAR.",
    evidence: ["https://github.com/axvrma/envision/blob/main/README.md"],
    legacy: ["vox-ar", "envision"],
  },
  {
    id: "servio",
    name: "Servio",
    category: "Local developer infrastructure",
    tagline: "Less terminal juggling. More building.",
    description:
      "A desktop command center for local server processes. Start, monitor, and restart your development services from one considered workspace.",
    live: "https://servio.axvrma.com",
    source: "https://github.com/axvrma/servio",
    stack: ["Electron", "React", "Node.js", "MUI"],
    features: [
      "Start, stop and restart multiple processes",
      "Automatic restart with a configurable delay",
      "Desktop notifications and tray controls",
      "Dedicated process output workspace",
    ],
    architecture: [
      "React renderer",
      "Restricted preload bridge",
      "Electron main process",
      "Child process lifecycle",
    ],
    sections: [
      {
        title: "The problem",
        body: "A development workspace can depend on several long-running commands. Managing those commands across terminal windows makes process state and restart behavior harder to follow.",
      },
      {
        title: "The solution",
        body: "Servio gives local processes a desktop workspace with explicit lifecycle actions, output inspection, search, filters and tray access.",
      },
      {
        title: "Product experience",
        body: "Configure a process, start it from the workspace, and inspect its output in a dedicated view. Set restart delays, receive state notifications, and use tray controls when the main window is out of the way.",
      },
      {
        title: "Engineering decisions",
        body: "React handles the renderer while Electron owns process execution. A restart first waits for the command to stop, then waits for the configured delay. Explicit stop actions cancel pending restarts.",
      },
      {
        title: "Challenges & trade-offs",
        body: "A process manager needs predictable cancellation and cleanup, not just a start button. Servio is a local desktop application; it is not a hosted cloud deployment control plane.",
      },
    ],
    limitations:
      "The website is separate from the desktop runtime. The supplied public domain had a TLS hostname mismatch during this audit; desktop source remains available.",
    evidence: ["https://github.com/axvrma/servio/blob/main/README.md"],
    legacy: ["servio"],
  },
  {
    id: "prism",
    name: "Prism",
    category: "Developer tooling",
    tagline: "See the branches. Understand the change.",
    description:
      "Visual branch planning and Azure DevOps pull requests, inside VS Code. See integration evidence before preparing the next change.",
    live: "https://prism.axvrma.com",
    source: "https://github.com/axvrma/azure-devops-pr-helper",
    stack: ["TypeScript", "VS Code API", "React", "Azure DevOps"],
    features: [
      "Branch Flow graph with explicit integration evidence",
      "Editable Azure DevOps pull request creation",
      "Local graph files, undo and keyboard controls",
      "Optional AI summaries; credentials in SecretStorage",
    ],
    architecture: [
      "VS Code webview",
      "Validated message bridge",
      "Extension host",
      "Azure API & optional local Git",
    ],
    sections: [
      {
        title: "The problem",
        body: "Branch relationships, integration evidence and pull request creation often live in separate tools. Switching context makes it harder to distinguish an intended propagation plan from verified Git state.",
      },
      {
        title: "The solution",
        body: "Prism brings a branch planning canvas and PR Creator into VS Code. Graph relationships carry explicit evidence states; an editable PR action is a separate, deliberate operation.",
      },
      {
        title: "Product experience",
        body: "Add remote branches to a graph, connect source and target, and inspect analysis. Save a local .branchflow.json plan, revalidate it later, or open a prefilled PR Creator. AI assistance is optional.",
      },
      {
        title: "Engineering decisions",
        body: "Filesystem, authenticated HTTP and Git operations remain in the extension host. Webviews receive presence flags rather than credentials. Graph imports and messages use runtime schemas and limits; PATs and provider keys use VS Code SecretStorage.",
      },
      {
        title: "Challenges & trade-offs",
        body: "A clean merge does not establish a clean rebase. Missing objects or unsuitable clones produce an inconclusive state instead of a success claim. Branch Flow does not merge, push, or rebase remote branches.",
      },
    ],
    limitations:
      "Azure account permissions govern live operations. Optional AI sends selected context to the configured provider. The historical source URL is retained from Azure DevOps PR Helper.",
    evidence: ["https://github.com/axvrma/prism/blob/main/README.md"],
    legacy: ["azure-devops-pr-helper", "prism"],
  },
];
export const flagshipIds = products.map((product) => product.id);
