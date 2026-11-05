Brian Kennedy: Portfolio

Live site: https://briankennedy.vercel.app

This is the source for my personal portfolio. It is a deliberately small, dependency-free site built from one HTML file, one stylesheet and one script, and deployed on Vercel. It presents who I am as a backend engineer (Python and Go, PostgreSQL, Linux, Git), what I have built, and how to reach me.

This README does more than explain how to run the project. It also records why the site is built the way it is, what trade-offs that choice carries, and where the project is heading, because those decisions are the part of a portfolio that is easiest to forget and most useful to be able to explain.

Table of content
What this project is
Repository layout
Running it locally
Deployment
Design reasoning
Content model
Trade-offs and known limitations
Roadmap: a self-updating portfolio
A note on the small projects
Contact
What this project is

The site has four sections, reachable from the main navigation:

About: a short statement of what I do and the areas I work in (backend development, data architecture, API design, SaaS architecture), plus a skills list: Python, Go, PostgreSQL, Linux, Git.
Resume: experience and education. Current work is independent SaaS development, including FlowSignal and BomaShop. Education covers a software development certificate and database courses (SQL and PostgreSQL). Each credential links to its PDF in Assets/, and a full CV is available for download.
Portfolio: project cards grouped by language (currently Python and Go), each with a description, a feature list and a link to its repository.
Contact: direct links (email, GitHub, LinkedIn) and a contact form.

The site is the front end of my professional identity. It is meant to be read quickly by someone deciding whether to talk to me, and that goal drives most of the decisions below.

Repository layout
portfoliobrians/
├── index.html     # All page structure and content
├── style.css      # All styling
├── script.js      # Interactivity (navigation, expandable project details)
└── Assets/        # Profile photo, CV, and certificate PDFs

There is no package.json, no bundler and no build step. That is intentional, and the reasoning is in Design reasoning.

Running it locally

Because the site is static, you only need a way to serve the folder over HTTP. Opening index.html directly in a browser mostly works, but serving it properly avoids surprises with relative asset paths and matches how Vercel serves it.

bash
git clone https://github.com/scxbrian/portfoliobrians.git
cd portfoliobrians

# Pick any static server you already have:
python3 -m http.server 8000
# or
npx serve .

Then open http://localhost:8000.

Deployment

The site is deployed on Vercel, connected to the main branch of this repository. A push to main triggers a new deployment, and Vercel serves the files as-is from its CDN. Static hosting means there is no server to patch, no runtime to keep alive and effectively nothing that can go down in the middle of a recruiter's visit.

Design reasoning
Why plain HTML, CSS and JavaScript

The obvious modern choice for a portfolio is a framework such as React or Next.js. I chose not to use one, for these reasons:

The problem is small. A portfolio is mostly static content with a little interactivity. A component framework earns its keep when state is complex and the UI changes constantly, and neither is true here. Adding a build pipeline to render four sections of mostly static text would be complexity without a payoff.
Nothing to break. With no dependencies, there is nothing to deprecate, no vulnerability advisories to chase, and no toolchain upgrade that can leave the project unbuildable a year from now. The site that works today should work in five years with no maintenance.
Load speed is a feature. A static page with one stylesheet and one script is about as fast as the web gets. That matters to anyone opening the link on a mobile connection, which is a real consideration for a Kenyan audience and for recruiters opening the link from a phone.
Honest scope. I describe myself as a backend engineer. A portfolio that does not pretend to be a front-end showcase is consistent with that. The engineering effort belongs in the systems I am building (see FlowSignal), not in fighting a UI framework.

The cost of this choice is real, and I accept it knowingly. Everything lives in one HTML file, so content and markup are mixed together. Adding a project means editing HTML by hand, and there is no component reuse, so the same card structure is repeated for every project. That repetition is the main motivation for the roadmap below: the moment content becomes data instead of markup, the portfolio can update itself.

Why Vercel

Vercel gives free static hosting, automatic HTTPS, a global CDN, and deploys on every push. For a site with no server component, there is no reason to pay for or operate anything more. It also leaves the door open for serverless functions later, which matters for the roadmap.

Why group projects by language

Projects are organised under "Python Projects" and "Go Projects" rather than chronologically or by theme. A reviewer scanning the page learns immediately which languages I work in, and it mirrors how I describe myself in the About section. The trade-off is that it hides the order in which I built things. That is why dates and growth are handled separately (see A note on the small projects).

Content choices
Feature lists on every project card. A one-line description tells a visitor what a project is, while a feature list shows what I thought about, such as input validation, error handling and encoding support. Those details are the evidence that matters to a hiring manager reading a backend portfolio.
Certificates linked as PDFs. Credentials are verifiable by anyone who clicks, which is stronger than a claim in a bullet point.
Experience framed honestly. My current role is independent SaaS development, and the page says so plainly, including that the work is currently in the planning and architecture phase.
Content model

Each project card follows the same shape. Keeping it consistent now is deliberate, because it is exactly the schema the automated pipeline will need later.

Field	Description
Name	The project title
Language	Used to place the card in its language group
Summary	One or two sentences describing what the project is
Features	A short list of concrete capabilities
Repository	Link to the GitHub repository
Trade-offs and known limitations

Being direct about these is part of the point of this document.

Content is hand-edited. Every project is HTML I maintain by hand. This is the main thing the roadmap fixes.
Placeholder content exists. The Go projects section currently shows a placeholder card ("Go Project Name"). It is a visible gap while I finish and polish my Go work, and it will be replaced with real projects.
No automated tests or CI. For a static site this is a small risk, but link rot (dead repo links, moved PDFs) is possible and not currently checked.
Contact form depends on a third party or backend. A purely static site cannot receive form submissions by itself, so delivery depends on an external service or a backend I add. <!-- TODO: document which one is in use -->
Personal details are public. Contact details on a public portfolio are scraped by bots. Anything I put there is a deliberate trade for being reachable.
Accessibility and SEO have not been formally audited. The page has a title and meta description, but I have not run a Lighthouse or screen-reader pass.
Roadmap: a self-updating portfolio

Status: planned. None of this is built yet. This section describes where the project is going and why.

The goal is to stop maintaining the Portfolio section by hand. When I push a project to GitHub, the portfolio should notice, read the project's README, produce a summary, and publish it.

Planned flow
GitHub push event
      │
      ▼
Go webhook service ── verify HMAC signature, ignore irrelevant pushes
      │
      ▼
Redis queue ───────── acknowledge GitHub quickly, process in the background
      │
      ▼
Worker ────────────── fetch README via GitHub API, generate summary
      │
      ▼
PostgreSQL ────────── store summary, source hash, status (draft / published)
      │
      ▼
Read API (cached) ─── portfolio fetches project data at load time
Why it is designed this way
Webhooks over polling. GitHub pushes events to me, so there is no wasted traffic and updates are near-instant.
Respond fast, work later. GitHub expects a prompt reply to a webhook, so the handler verifies the request, enqueues a job and returns immediately. The slow work of fetching and summarising happens in a worker.
Idempotent jobs. GitHub can redeliver an event. Processing the same push twice must produce the same result, not duplicate rows.
Only act on meaningful changes. A push that does not touch the README should not regenerate a summary. Comparing a hash of the README with the stored one avoids wasted work and cost.
A draft gate before publishing. Automatic publishing of an unfinished README under my name is a reputational risk. Summaries start as drafts, and only repositories I have marked for the portfolio (for example with a topic tag) go live.
Auditable output. Each summary stores the README hash and the model that produced it, so everything can be regenerated if I improve the prompt.
What changes in this repository

The front end would stop containing project markup and instead render cards from the read API's JSON, using the content model above. The static, no-framework approach stays. A small fetch call and a template function replace the hand-written cards. A static fallback (a cached JSON snapshot) would keep the page working if the API is ever unreachable.

A note on the small projects

The Python section includes small command-line tools: a word counter, a number guessing game and a calculator. They are simple on purpose, and I am keeping them. A portfolio made only of polished flagship work hides the path that led there. These projects show where I started, and they sit next to larger systems as evidence of growth. I am reviewing and improving my projects one at a time, but the early ones stay as part of the record.

Contact
GitHub: scxbrian
LinkedIn: brian-kennedy
Portfolio: briankennedy.vercel.app
