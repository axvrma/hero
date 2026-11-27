/**
 * Homepage editorial content. Existing records supply the profile, career, education,
 * independent projects, evidence, and publication status.
 */
export const introduction = {
  availability: "Open to meaningful opportunities",
  headline: ["Welcome to my little", "corner of the internet."],
  summary: "I’m Abhishek, a software engineer who enjoys turning complex problems into simple, meaningful digital experiences.",
  about: [
    "I’ve always been curious about how things work. That curiosity took me from designing digital experiences to building products and engineering enterprise systems.",
    "Today I’m a Senior Software Engineer at DP World, working on software for logistics operations. Outside work, I build independent products, experiment with self-hosted infrastructure, and explore practical AI.",
    "My postgraduate certification in AI and Machine Learning at IIT Guwahati helped me bring that curiosity to a new set of engineering problems.",
  ],
};

export const featured = [
  {
    id: "intelligent-invoice-processing", organization: "DP World", category: "Enterprise engineering",
    title: "Turning complex logistics operations into simpler workflows",
    summary: "I led frontend work on guided shipment workflows and helped the team automate key steps in invoice processing.",
    points: ["Automated invoice handoffs", "Built guided shipment workflows", "Connected micro-frontends"],
    art: "invoice", related: ["dynamic-shipment-workflows", "micro-frontend-communication"],
  },
  {
    id: "bridging-design-and-engineering", organization: "Nurtr", category: "Startup engineering",
    title: "Helping a startup grow through product engineering",
    summary: "I helped Nurtr reach a global audience through its PWA, reusable Angular components and performance work.",
    art: "nurtr",
  },
  {
    id: "boxbay-ai", organization: "BoxBay AI", category: "Independent prototype",
    title: "Making container storage smarter with artificial intelligence",
    summary: "A prototype that explores how predictive placement could reduce container reshuffles in a simulated yard.",
    contribution: "I prototyped placement and restacking decisions based on anticipated retrieval order and seasonal demand.",
    outcome: "The simulation compares retrieval efficiency under different placement rules. The demonstration was framed around Jebel Ali port. Results describe a model yard and hypothetical moves.",
    art: "boxbay",
  },
  {
    id: "hackathons", organization: "Hackathons", category: "Rapid prototyping",
    title: "Building meaningful products under pressure",
    summary: "First place at Microsoft GitTogether and Major League Hacking, and a Paytm finalist with a prototype built in eight hours.",
    points: ["Microsoft GitTogether · First place", "Paytm · Top 8 of about 450", "Major League Hacking · First place"],
    art: "hackathons",
  },
];

export const capabilities = [
  { id: "product", title: "Product Engineering", description: "Taking ideas from initial concepts to functional, usable products." },
  { id: "architecture", title: "System Architecture", description: "Designing maintainable systems that balance complexity, reliability and performance." },
  { id: "frontend", title: "Frontend Engineering", description: "Building scalable and intuitive digital experiences using Angular, React and TypeScript." },
  { id: "ai", title: "Artificial Intelligence", description: "Exploring practical AI/ML applications for engineering and business problems." },
];

export const skills = [
  "Angular", "React", "TypeScript", "Node.js", "Python", "AI/ML", "Micro Frontends",
  "Docker", "Design Systems", "Web Performance", "System Design", "Developer Experience",
];

export const articles = [
  {
    id: "enterprise-simplicity", status: "draft", title: "What building enterprise software taught me about simplicity",
    summary: "A note on making operational work easier by modeling the handoffs people already make.",
    paragraphs: [
      "On a shipment filing workflow, the useful starting point was to see how work moved from one person to the next. Some of that logic was buried in email. Mapping responsibilities and handoffs gave us something concrete to build around.",
      "We used roles and shipment configuration to determine the next task. That gave users a more direct path through the workflow. It also gave the engineering team a new responsibility: make each supported variation understandable and testable.",
      "I now look for the point where a user has had to remember something the software could reasonably know. That is often the most practical place to simplify a system.",
    ],
  },
  {
    id: "better-architecture-questions", status: "draft", title: "Why good architecture starts with asking better questions",
    summary: "On the questions that make boundaries between systems easier to maintain.",
    paragraphs: [
      "When a workflow spans several micro-frontends, a technical discussion can quickly turn into a choice about how to transport events. A more useful first conversation is about what each module needs to know and when that information stops being relevant.",
      "Those answers describe the agreement between the teams. They also make it easier to spot a dependency that exists only because a boundary was drawn in an awkward place.",
      "Before choosing a mechanism, I try to write the agreement with an example from the user’s actual workflow. If the example is hard to explain, there is probably a design decision we still owe ourselves.",
    ],
  },
  {
    id: "ai-real-world-logistics", status: "draft", title: "What happens when AI meets real-world logistics",
    summary: "What a personal container-stacking simulation taught me about evaluating placement decisions.",
    paragraphs: [
      "A stack can look efficient when a container arrives and become expensive when someone needs to retrieve it. That makes placement an interesting prediction problem: a local decision today changes the options available tomorrow.",
      "In a personal simulation, I explored whether expected pickup order and seasonal patterns could guide those decisions. Running the same demand through different placement policies helped me see which assumptions mattered.",
      "A simulation gives me a way to ask a better question about a real yard. Field constraints, forecast errors and equipment availability would all matter before anyone could assess operational value.",
    ],
  },
];

export const faq = [
  { question: "Are you open to full-time opportunities?", answer: "I’m open to discussing meaningful engineering, technical leadership and product-building opportunities." },
  { question: "What kind of problems do you enjoy solving?", answer: "Complex problems involving scalable interfaces, architecture, automation and practical applications of AI." },
  { question: "Do you collaborate on independent projects?", answer: "Yes. I enjoy experimenting with interesting ideas and building useful products with curious people." },
  { question: "How can I get in touch?", answer: "Connect with me through LinkedIn or email. I’m always happy to discuss interesting engineering challenges." },
];

export const recognition = [
  { title: "Kudos Award", issuer: "DP World · 2023", achievement: 0, image: "dp-world-kudos-2023" },
  { title: "Kudos Award", issuer: "DP World · 2026", achievement: 1 },
  { title: "Star Performer", issuer: "Airtel Africa · 2021", achievement: 2 },
  { title: "First place", issuer: "Microsoft GitTogether", hackathon: "excuse-generator-3000" },
  { title: "Finalist", issuer: "Paytm Hackathon", hackathon: "paytm-hackathon", image: "paytm-hackathon-photo" },
  { title: "Developer recognition", issuer: "Google Assistant · 2018", achievement: 4, image: "google-assistant-2018" },
  { title: "Rank 544", issuer: "TCS CodeVita · Season 5", body: "Placed 544th in the fifth season of the CodeVita programming competition. Rank supplied by Abhishek." },
  { title: "First place", issuer: "Major League Hacking · 2020", achievement: 3 },
];

export const testimonials = [
  { title: "Sample teammate", issuer: "Illustrative testimonial", body: "Abhishek helped us turn a messy workflow into something the whole team could discuss. A small prototype gave engineering and operations a chance to agree on the handoffs before we built them." },
  { title: "Sample collaborator", issuer: "Illustrative testimonial", body: "We could follow the decisions as the project evolved. The demo and the written context made it easy for everyone to contribute." },
];
