// @ts-check
export const narrative = {
  headline: "The technology has changed. The curiosity hasn’t.",
  intro: "I started with design, found my purpose in engineering, and never stopped questioning how things work. Today, I build enterprise systems, developer tools and digital products that make complexity feel simple.",
  identity: "Designer at heart. Engineer by choice. Builder by instinct.",
  educationLabel: "Postgraduate education in AI & ML, IIT Guwahati",
  nextTitle: "Build things that matter. Become someone worth looking up to.",
  nextBody: "I want to keep building tools that make people more effective, solve problems that are worth solving, and grow into a leader who inspires others to do the same.",
};

/** @type {import('./types.js').CareerChapter[]} */
export const career = [
  { id: "first-computer", period: "Around age 10", headline: "What does this button do?", theme: "Curiosity", summary: "I explored Windows, Paint, Notepad and Office on our first home computer. I spent enough time trying every button in Word and Excel to surprise my father with features he hadn’t seen." },
  { id: "first-program", period: "Around age 15–18", headline: "The moment software stopped being magic.", theme: "Analytical thinking", summary: "I learned C and C++ and wrote a calculator that recognized operators across multiple inputs. Adding BODMAS was the moment I realized I could understand and recreate the logic behind familiar software. I went on to explore Java and .NET." },
  { id: "design", period: "July 2013 – June 2017", place: "LNCT, Bhopal", headline: "Every design has something to say.", theme: "Design thinking", summary: "In my final year of a B.Tech in Information Technology, I spent hours on Dribbble and Behance. I started paying attention to how an image or a line of text could change what someone felt." },
  { id: "urstylecoach", job: "urstylecoach", headline: "I wanted to make designs come alive.", theme: "Craftsmanship", summary: "I designed flyers, standees and social posts during my internship. I was offered a job at the end and chose to explore the intersection of design and code." },
  { id: "nurtr", job: "nurtr", headline: "Where design met engineering.", theme: "Cross-functional collaboration", summary: "The Android app I built on my own got me into Nurtr’s technology team. I helped designers and engineers work through implementation constraints, then brought the same care to component architecture, the PWA migration, CRM and web performance." },
  { id: "iris", job: "iris", headline: "Expanding my engineering perspective.", theme: "Adaptability", summary: "I worked across Angular, React and Ionic to deliver client solutions for web and mobile." },
  { id: "airtel", job: "airtel", headline: "One application. Many possibilities.", theme: "Abstraction and ownership", summary: "I built the internal enterprise portal and contributed to a form system that let regional support teams use different forms from a shared, JSON-configured interface." },
  { id: "dp-world", job: "dp-world", headline: "Solving complexity at enterprise scale.", theme: "Engineering ownership", summary: "My work grew from implementing workflow interfaces to taking technical ownership across micro-frontends, invoice processing, design systems and developer tools. It also gave me a chance to mentor and learn from other engineers." },
  { id: "iit", period: "2025–2026 · Alongside DP World", place: "IIT Guwahati", headline: "Back to being a student.", theme: "Continued learning", summary: "I pursued postgraduate education in Artificial Intelligence and Machine Learning while working in enterprise engineering." },
];

export const principles = [
  { id: "root", title: "Find the Root", quote: "Don’t fix the symptom. Understand why the problem exists.", caseId: "intelligent-invoice-processing" },
  { id: "simplicity", title: "Design for Simplicity", quote: "Absorb the complexity so the user doesn’t have to.", caseId: "configuration-driven-ui" },
  { id: "execution", title: "Deconstruct, Prioritize, Execute", quote: "Break complex problems into manageable pieces, determine what matters most, and deliver deliberately.", caseId: "dynamic-shipment-workflows" },
];

export const storyChapters = [
  { careerIds: ["first-computer"], title: "Discovering computers", demo: "desktop" },
  { careerIds: ["first-program"], title: "Understanding software", demo: "calculator" },
  { careerIds: ["design"], title: "Discovering design" },
  { careerIds: ["urstylecoach", "nurtr"], title: "Bringing design to life through code", demo: "life" },
  { careerIds: ["iris", "airtel", "dp-world"], title: "Growing into enterprise engineering" },
  { careerIds: ["iit"], title: "Continuing to explore" },
];

export const influences = [
  { name: "Steve Jobs", aspect: "Design thinking", body: "His attention to simplicity taught me to ask what I could take away while keeping what mattered." },
  { name: "My father", aspect: "Analytical thinking", body: "Watching how he worked shaped my approach to logic, careful analysis and professional excellence." },
  { name: "Tony Stark", aspect: "The builder’s instinct", body: "The fictional inventor made ambitious engineering experiments look like a way to learn. That curiosity still makes me want to take things apart and build them again." },
];

export const growth = [
  "Early in my career, I believed that solving the technical problem was the hardest part. Leading and collaborating with engineers taught me that alignment, communication and shared ownership are equally important.",
  "Under pressure, I used to focus on getting the implementation out and communicate across teams too late. Working with people whose styles differed from mine taught me to share context sooner, listen for objections, and make room for other people to own decisions. Managers came to approach me directly when teams needed to work through a problem.",
  "My instinct is to build. My growth as an engineer has been about pausing before I start, asking which parts of the problem warrant the work, and balancing craftsmanship with what people need now.",
];

export const workshop = [
  { id: "lego", title: "LEGO", body: "I like taking a handful of repeatable parts and seeing how many different things they can become. The satisfaction is in figuring out what each piece makes possible." },
  { id: "hardware", title: "Raspberry Pi and hardware", body: "A small computer gives me a reason to explore what happens between a program and the physical world." },
  { id: "android", title: "Android custom ROMs", body: "Flashing ROMs gives me a way to question the defaults in the software I carry every day." },
  { id: "homelab", title: "The homelab", body: "I started self-hosting because I wanted more control over my tools and data. Running a service myself is also one of the clearest ways to understand everything it depends on." },
];

export const labExperiments = [
  { id: "boxbay-ai", title: "BoxBay AI", headline: "What if every container move could be smarter?", body: "BoxBay’s approach to container storage made me wonder how optimization might change stacking and retrieval. I explore that question as an independent simulation, using hypothetical moves in a model yard." },
];

/** @type {Record<string, import('./types.js').ProductMotivation>} */
export const motivations = {
  atlas: { headline: "What happens behind the canvas?", story: "Watching n8n turn a drag-and-drop graph into a running workflow made me want to understand the execution model. I built Atlas to find out how a visual program becomes a sequence of steps.", signal: "A graph execution engine independent of the React canvas." },
  prism: { headline: "Stay in the flow.", story: "I kept leaving VS Code to open pull requests or check whether a branch was ready. Prism brings those Azure DevOps workflows into the editor so I can keep the code and its context in view.", signal: "Branch plans and verified Git state are explicitly distinguished.", comparison: { before: "Leave the editor, open Azure DevOps, and reconstruct the branch context.", after: "Review the branch and pull request workflow with the code still in view." } },
  vibes: { headline: "My feed. My rules.", story: "I wanted more say in what I watched and how I found it. Vibes is an open-source, self-hosted media experience that puts those choices in my hands.", signal: "A self-hosted application with a documented media pipeline." },
  envision: { headline: "Who said AR needs a headset?", story: "I was curious about spatial computing and didn’t have a headset. I explored what the browser could do on its own. Watching children around me place virtual objects and take photos with them made the experiment feel real.", signal: "A browser studio with optional camera and AR capabilities." },
  servio: { headline: "Build software. Not babysit terminals.", story: "While I was developing large micro-frontend applications, recompilation could interrupt local processes. I built Servio to manage those processes from one place so I could spend more time in the code.", signal: "A local desktop interface for orchestrating development processes." },
  auditbench: { headline: "Performance should be a habit, not a task.", story: "Checking page performance by hand was repetitive. I wanted a recurring update that made performance easy to follow, an idea that started as Lighthouse Agent and grew into Auditbench.", signal: "Repeatable Lighthouse audits with on-device performance history." },
  luminescent: { headline: "Beautiful by default. Accessible by design.", story: "Luminescent is a typed React component library with themeable tokens, accessible interactions and a documentation playground.", signal: "Shared component contracts, namespaced tokens and behavior tests." },
};
