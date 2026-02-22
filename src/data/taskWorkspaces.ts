import { TaskWorkspaceData } from "@/types";

export const taskWorkspaces: TaskWorkspaceData[] = [
  // ===== WED-1: Build Landing Page: Structure & Layout =====
  {
    taskId: "wed-1",
    brief: {
      whyItMatters:
        "Your landing page is the first thing potential guests see — it's your digital storefront. Studies show that visitors decide whether to stay or leave a website within 3 seconds. A well-structured page builds trust instantly and makes guests want to book.",
      whatYouLearn:
        "You'll learn to organize information visually, think about user experience (how people navigate a page), and use a website builder to create something real that works on any device.",
      realWorldConnection:
        "Every business today needs a web presence. Airbnb hosts with their own landing pages get 30% more direct bookings. The layout skills you practice here are the same ones used by web designers at companies like Booking.com and Airbnb.",
    },
    steps: [
      {
        id: "wed-1-s1",
        title: "Plan your page sections on paper",
        instruction:
          "Before touching the computer, grab a piece of paper and sketch the structure of your landing page. Draw 5 boxes stacked vertically, each representing a section: (1) Hero — big photo + headline, (2) Features — what makes your place special, (3) Gallery — photos of the space, (4) Location — map and neighborhood info, (5) Call to Action — the booking button. Write 2-3 words in each box describing what goes there.",
        duration: "~8 min",
        tips: [
          "Don't worry about making it pretty — this is a wireframe, just boxes and labels",
          "Put the most important info at the top. Guests scroll less than you think!",
          "Look at your concept canvas from Tuesday for your USP — that goes in the hero",
        ],
        example: {
          label: "Simple wireframe sketch",
          content:
            "[HERO: Big terrace photo + 'Casa Limon — Your Sunny Escape']\n[FEATURES: 3 columns — Rooftop Terrace | Central Location | Local Food Guide]\n[GALLERY: 4 photo grid]\n[LOCATION: Map + 'Walking distance to beach and old town']\n[CTA: Big yellow button — 'Book Your Stay']",
        },
      },
      {
        id: "wed-1-s2",
        title: "Set up the hero section",
        instruction:
          "Open your website builder (Canva Sites, Google Sites, or Notion). Create a new page. Start with the hero section — this is the big banner at the top. Add a placeholder image (you'll add your real photos later). Write your headline (your Airbnb name) and a one-line description. Make sure the text is readable over the image.",
        duration: "~12 min",
        tips: [
          "Use a high-contrast text color — white text on a dark overlay works great",
          "Your headline should be your brand name from Tuesday's brand board",
          "Keep the description to ONE line. Example: 'A sun-drenched apartment with rooftop terrace in central Malaga'",
        ],
        resources: [
          { label: "Canva Sites", type: "tool" },
          { label: "Google Sites", type: "tool" },
          { label: "Your brand board from Tuesday", type: "reference" },
        ],
      },
      {
        id: "wed-1-s3",
        title: "Build the features and gallery sections",
        instruction:
          "Below the hero, add a features section with 3 columns. Each column should have an icon or emoji, a short title, and one sentence. Think: what are the 3 best things about your Airbnb? Then add a gallery section — create a grid with 4 placeholder image slots. Use simple colored rectangles for now if you don't have photos yet.",
        duration: "~15 min",
        tips: [
          "Use your market research from Monday — what did top-rated listings highlight?",
          "3 features is the sweet spot. More than 4 feels cluttered",
          "The gallery images should show different things: living room, bedroom, view, neighborhood",
        ],
        example: {
          label: "Good features section",
          content:
            "Feature 1: ☀️ Rooftop Terrace — 'Watch the sunset over Malaga from your private terrace'\nFeature 2: 📍 Central Location — '5 min walk to the beach, 10 min to old town'\nFeature 3: 🍽️ Local Food Guide — 'Our handpicked restaurant guide with 15 hidden gems'",
        },
      },
      {
        id: "wed-1-s4",
        title: "Add location section and booking CTA",
        instruction:
          "Add a location section with a short description of your neighborhood and what's nearby. Include distances to key landmarks (beach, train station, restaurants). Finally, add a big, eye-catching 'Book Now' button at the bottom. Use your brand's primary color for the button. Make sure the button stands out — it's the most important element on the page!",
        duration: "~10 min",
        tips: [
          "Use specific distances: '350m to Malagueta Beach' is better than 'close to the beach'",
          "The CTA button should use your brand color and be the biggest button on the page",
          "Add a small line below the button like 'Check availability — no commitment'",
        ],
      },
      {
        id: "wed-1-s5",
        title: "Review and publish your landing page",
        instruction:
          "Open your landing page on your phone or resize the browser window to check it looks good on mobile. Check: Is the text readable? Do the sections flow logically? Is the Book Now button easy to find? Fix any issues you spot, then publish/share the link. This is your first evidence deliverable!",
        duration: "~10 min",
        tips: [
          "Ask a classmate to look at it for 5 seconds, then close it. Ask them: 'What do you remember?' — that tells you what stands out",
          "Check that nothing overflows or looks broken on a narrow screen",
        ],
        resources: [
          { label: "Mobile preview mode", type: "tool" },
        ],
      },
    ],
    successCriteria: [
      { id: "w1-sc1", label: "Page has all 5 sections: hero, features, gallery, location, CTA" },
      { id: "w1-sc2", label: "Hero headline matches your brand name from Tuesday" },
      { id: "w1-sc3", label: "Features section has exactly 3 clear selling points" },
      { id: "w1-sc4", label: "Book Now button is visible and uses your brand color" },
      { id: "w1-sc5", label: "Page looks acceptable on mobile (no broken layout)" },
    ],
    evidenceSubmission: {
      description: "Share the live link to your published landing page. Make sure it's publicly accessible.",
      format: "Published URL (Canva Sites, Google Sites, or Notion)",
    },
  },

  // ===== WED-2: Landing Page: Write Copy & Add Images =====
  {
    taskId: "wed-2",
    brief: {
      whyItMatters:
        "A beautiful layout with bad copy doesn't convert visitors into guests. The words you choose create emotion, build trust, and convince people to click 'Book'. Professional copywriters earn €50-100/hour — you're learning a high-value skill.",
      whatYouLearn:
        "You'll practice persuasive writing, learn how to match tone to audience, and understand how images and text work together to tell a story.",
      realWorldConnection:
        "Airbnb listings with professional-quality photos and compelling descriptions earn up to 40% more per night. Marketing teams at companies spend weeks perfecting the copy on a single landing page.",
    },
    steps: [
      {
        id: "wed-2-s1",
        title: "Write the hero headline and subheadline",
        instruction:
          "Go to your landing page from the previous task. Rewrite the hero section with a compelling headline (max 8 words) and a subheadline (max 20 words). The headline should capture attention. The subheadline should explain what makes your place unique. Use your brand personality — are you fun and casual, or elegant and sophisticated?",
        duration: "~10 min",
        tips: [
          "Good headline formula: [Adjective] + [What it is] + [Where]. Example: 'Sun-Drenched Escape in Central Malaga'",
          "Avoid generic phrases like 'Welcome to our apartment'. Be specific!",
          "Read it out loud — if it sounds boring, rewrite it",
        ],
        example: {
          label: "Headlines that work vs. don't",
          content:
            "GOOD: 'Your Rooftop Paradise in the Heart of Malaga' — specific, visual, emotional\nGOOD: 'Wake Up to Mediterranean Sunsets' — sensory, aspirational\nBAD: 'Nice Apartment for Rent' — generic, boring, no personality\nBAD: 'Welcome to Our Humble Abode' — cliché, tells nothing about the place",
        },
      },
      {
        id: "wed-2-s2",
        title: "Write copy for each section",
        instruction:
          "Go through each section of your page and write the actual copy. For Features: rewrite each feature description (1-2 sentences, focus on the benefit to the guest, not just the feature). For Location: write a short paragraph (3-4 sentences) about the neighborhood that makes it sound exciting. For CTA: write a short urgency line above the button.",
        duration: "~15 min",
        tips: [
          "Write about benefits, not features. Not 'Has AC' but 'Stay cool on the hottest summer days'",
          "Use sensory words: sun-drenched, breezy, cozy, vibrant, fragrant",
          "For the CTA area, add social proof: 'Loved by 50+ guests' or a star rating",
        ],
        resources: [
          { label: "Power words for hospitality", type: "reference" },
          { label: "Your listing description from Tuesday", type: "reference" },
        ],
      },
      {
        id: "wed-2-s3",
        title: "Source and add images",
        instruction:
          "Find 4-6 images for your landing page. Since you can't photograph a real apartment, use free stock photos that match your concept. Search for: living room with natural light, terrace with city view, cozy bedroom, local food/restaurant, Malaga landmarks. Add them to your page in the appropriate sections. Resize and crop so they look consistent.",
        duration: "~12 min",
        tips: [
          "Use Unsplash or Pexels — both are free and high quality",
          "All photos should have a similar warmth/tone to look cohesive",
          "The hero image is the most important — choose your best one there",
        ],
        resources: [
          { label: "Unsplash", type: "tool" },
          { label: "Pexels", type: "tool" },
        ],
      },
      {
        id: "wed-2-s4",
        title: "Final review: tone and consistency check",
        instruction:
          "Read your entire page from top to bottom as if you're a tourist seeing it for the first time. Check: Does the tone match your brand board? Is the writing style consistent (don't mix formal and casual)? Are there any spelling mistakes? Does every image have a purpose? Make final adjustments and publish the updated version.",
        duration: "~8 min",
        tips: [
          "Read it on your phone — that's how most travelers will see it",
          "Check that the brand colors from Tuesday are consistent throughout",
          "If any section feels 'meh', that's the one to improve",
        ],
      },
    ],
    successCriteria: [
      { id: "w2-sc1", label: "Hero headline is 8 words or fewer and captures attention" },
      { id: "w2-sc2", label: "Feature descriptions focus on guest benefits, not just features" },
      { id: "w2-sc3", label: "All images are high quality and visually consistent" },
      { id: "w2-sc4", label: "Tone matches your brand identity from Tuesday" },
      { id: "w2-sc5", label: "No spelling or grammar errors" },
    ],
    evidenceSubmission: {
      description: "Submit your updated landing page with complete copy and images. Same URL as before, but now fully polished.",
      format: "Published URL (same as previous task)",
    },
  },

  // ===== WED-3: Guest Communication System =====
  {
    taskId: "wed-3",
    brief: {
      whyItMatters:
        "Every great Airbnb host communicates clearly with guests. Poor communication is the #1 reason for bad reviews. Professional hosts use templates so they never forget important details and every guest gets the same high-quality experience.",
      whatYouLearn:
        "You'll practice professional writing, learn to structure information clearly, and design a workflow system — skills used in every business, not just hospitality.",
      realWorldConnection:
        "Real Airbnb Superhosts send 4-6 automated messages per booking. Companies like Booking.com and Airbnb have entire teams dedicated to communication design. You're doing what they do!",
    },
    steps: [
      {
        id: "wed-3-s1",
        title: "Map the communication timeline",
        instruction:
          "Before writing any messages, sketch out WHEN each message gets sent. Draw a simple timeline from the moment a guest books to after they leave. Mark 4 key moments: (1) Booking confirmed, (2) Day before arrival, (3) Check-in day, (4) After checkout. This becomes your workflow diagram.",
        duration: "~10 min",
        tips: [
          "Think about it from the guest's perspective — what would YOU want to know at each moment?",
          "Don't forget: guests are often in a different time zone when they book",
          "Use arrows between each moment to show the flow",
        ],
        example: {
          label: "Example timeline",
          content:
            "BOOKING → [Confirmation email — sent immediately]\n  ↓\n2 DAYS BEFORE → [Pre-arrival info — address, transport, key]\n  ↓\nCHECK-IN DAY → [Welcome message — sent at noon]\n  ↓\nDAY AFTER CHECKOUT → [Thank you + review request]",
        },
        resources: [
          { label: "Canva timeline template", type: "template" },
        ],
      },
      {
        id: "wed-3-s2",
        title: "Write the booking confirmation template",
        instruction:
          "Write a warm, professional message that a guest receives right after booking. Include: a thank you, confirmation of dates, your name, and one sentence about what makes your place special. Keep it under 100 words — guests don't read long emails.",
        duration: "~12 min",
        tips: [
          "Start with the guest's name — use [Guest Name] as a placeholder",
          "Common mistake: writing too formally. You're a host, not a bank. Be friendly!",
          "Include your check-in time even in this first message",
        ],
        example: {
          label: "Good vs. Bad confirmation",
          content:
            "GOOD: 'Hi [Guest Name]! Thank you for choosing Casa Limon — you're going to love the rooftop terrace at sunset! Your stay is confirmed for [dates]. Check-in is at 3 PM. I'll send you arrival details closer to the date. — Lucas'\n\nBAD: 'Dear Sir/Madam, Your reservation has been confirmed. Reference #4829. Regards, Management.'",
        },
      },
      {
        id: "wed-3-s3",
        title: "Write the pre-arrival instructions",
        instruction:
          "This is the most important message — it prevents 90% of guest questions. Write a clear message sent 2 days before arrival. Include: exact address with a landmark reference, how to get there from the airport or train station, key collection method, Wi-Fi name and password, and one local restaurant recommendation for their first night.",
        duration: "~15 min",
        tips: [
          "Use bullet points or numbered steps — walls of text get ignored",
          "Pro tip: Real hosts include a Google Maps link pinned to the exact door",
          "Include a photo of the building entrance if possible",
          "Add your phone number for emergencies",
        ],
        resources: [
          { label: "Google Maps", type: "tool" },
          { label: "Your floor plan from Tuesday", type: "reference" },
        ],
      },
      {
        id: "wed-3-s4",
        title: "Write the welcome and review request messages",
        instruction:
          "Two short messages to write: (1) A check-in day welcome sent at noon — just 2-3 sentences wishing them a great stay and reminding them you're available if they need anything. (2) A review request sent the day after checkout — thank them for staying, ask for an honest review, and mention you'd love to host them again.",
        duration: "~12 min",
        tips: [
          "The review request is tricky — don't beg! Just be genuine",
          "Never say 'Please give us 5 stars'. Instead: 'Your honest feedback helps us improve'",
          "Keep both messages under 50 words each",
        ],
        example: {
          label: "Review request that works",
          content:
            "'Hi [Guest Name], I hope you enjoyed your time in Malaga! If you have a minute, I'd really appreciate your honest review — it helps other travelers and helps me become a better host. Either way, you're welcome back anytime! — Lucas'",
        },
      },
      {
        id: "wed-3-s5",
        title: "Assemble your workflow diagram + all 4 templates",
        instruction:
          "Put it all together: take your timeline from Step 1 and connect each moment to its corresponding template. Create a clean document that shows the complete communication system. A future host should be able to use your workflow without any extra explanation. Add a title page: 'Guest Communication System — [Your Airbnb Name]'.",
        duration: "~10 min",
        tips: [
          "This is your evidence deliverable — make it look professional",
          "Use headings and clear separation between each template",
          "Number each message so it's clear which order they go in",
        ],
        resources: [
          { label: "Google Docs", type: "tool" },
          { label: "Notion", type: "tool" },
          { label: "Canva", type: "tool" },
        ],
      },
    ],
    successCriteria: [
      { id: "w3-sc1", label: "All 4 message templates are complete and under 100 words each" },
      { id: "w3-sc2", label: "Each template uses [Guest Name] and [dates] as placeholders" },
      { id: "w3-sc3", label: "The workflow diagram clearly shows WHEN each message gets sent" },
      { id: "w3-sc4", label: "The tone is warm and professional (not too formal, not too casual)" },
      { id: "w3-sc5", label: "Pre-arrival message includes: address, transport, key, Wi-Fi, and a local tip" },
    ],
    evidenceSubmission: {
      description: "Submit your completed workflow diagram with all 4 message templates in one organized document.",
      format: "Google Doc, Notion page, or Canva design",
    },
  },

  // ===== WED-4: Profitability Calculation =====
  {
    taskId: "wed-4",
    brief: {
      whyItMatters:
        "A beautiful Airbnb that loses money isn't a business — it's an expensive hobby. Understanding profitability is the difference between a successful entrepreneur and someone who goes bankrupt. This is real math with real consequences.",
      whatYouLearn:
        "You'll learn how to calculate costs, set prices based on data, model different scenarios, and understand the concept of break-even — the exact point where you stop losing money and start making it.",
      realWorldConnection:
        "Every investor asks the same question: 'When will you break even?' Airbnb hosts who don't do this math often undercharge by 20-30%. The spreadsheet you create is the same tool real businesses use to make pricing decisions.",
    },
    steps: [
      {
        id: "wed-4-s1",
        title: "List ALL your monthly costs",
        instruction:
          "Open a new spreadsheet. Create two sections: FIXED COSTS (things you pay every month no matter what — rent/mortgage, internet, insurance, cleaning subscription) and VARIABLE COSTS (costs per guest — laundry, toiletries, electricity usage, platform fees). List every single cost with its monthly amount. Use your budget from Tuesday as a starting point.",
        duration: "~12 min",
        tips: [
          "Don't forget Airbnb's service fee — they take 3% of every booking!",
          "Cleaning costs are usually per-booking, not monthly. A typical clean costs €30-50",
          "Include a 'misc' line of €50/month for unexpected things that break or run out",
        ],
        example: {
          label: "Cost structure example",
          content:
            "FIXED: Rent €800 | Internet €30 | Insurance €45 | Platform subscription €20 = €895/mo\nVARIABLE (per booking): Cleaning €40 | Laundry €15 | Toiletries €8 | Airbnb fee 3%\nTotal fixed: €895/mo | Variable per booking: ~€63 + 3% fee",
        },
        resources: [
          { label: "Google Sheets", type: "tool" },
          { label: "Your Tuesday budget spreadsheet", type: "reference" },
        ],
      },
      {
        id: "wed-4-s2",
        title: "Set your nightly price using market data",
        instruction:
          "Go back to your Monday research (the competitor pricing analysis). Look at the average price for similar listings in your neighborhood. Set your nightly price considering: your costs, your competitors' prices, and your USP. If your place has a unique feature (rooftop terrace!), you can charge 10-15% above average.",
        duration: "~10 min",
        tips: [
          "Don't just pick the average — think about what justifies YOUR price",
          "Pro tip: Many hosts use dynamic pricing — higher in summer, lower in winter. For this exercise, use your average yearly rate",
          "Round to a 'friendly' number: €79 feels cheaper than €80 even though it's almost the same",
        ],
        resources: [
          { label: "Your Monday market research", type: "reference" },
        ],
      },
      {
        id: "wed-4-s3",
        title: "Calculate break-even occupancy",
        instruction:
          "Now for the key question: how many nights per month do you need to book to cover your costs? Use this formula: Break-even nights = Monthly Fixed Costs ÷ (Nightly Price - Variable Cost per Night). If your fixed costs are €895, your price is €85, and your variable cost per night is €25, then: 895 ÷ (85-25) = 14.9 nights = 15 nights minimum. That's 50% occupancy. Write out YOUR calculation clearly.",
        duration: "~10 min",
        tips: [
          "Show your work! Write the formula, then plug in your numbers step by step",
          "If break-even is above 70%, your costs are too high or price too low — reconsider",
          "Remember: a month has ~30 days, so 15 nights = 50% occupancy",
        ],
        example: {
          label: "Break-even calculation",
          content:
            "Fixed costs: €895/month\nNightly price: €85\nVariable cost per night: €25 (cleaning amortized + laundry + toiletries + Airbnb 3%)\nContribution per night: €85 - €25 = €60\nBreak-even: €895 ÷ €60 = 14.9 nights → 15 nights/month → 50% occupancy",
        },
      },
      {
        id: "wed-4-s4",
        title: "Model 3 scenarios: 50%, 70%, 90% occupancy",
        instruction:
          "Create a table with 3 columns, one for each scenario. For each, calculate: nights booked per month, gross revenue (nights × price), total costs (fixed + variable × nights), net profit (revenue - costs), and annual projection (monthly profit × 12). Highlight which scenario is realistic based on your Monday research data.",
        duration: "~15 min",
        tips: [
          "50% is conservative (winter months), 70% is realistic (yearly average for Malaga), 90% is optimistic (summer peak)",
          "Color-code your table: red for the scenario where you barely break even, green for the profitable one",
          "Add a row showing the profit per hour of work you invest — this shows if it's worth your time!",
        ],
        example: {
          label: "Scenario table structure",
          content:
            "           | 50% (15 nights) | 70% (21 nights) | 90% (27 nights)\nRevenue    | €1,275          | €1,785           | €2,295\nCosts      | €1,270          | €1,420           | €1,570\nProfit     | €5              | €365             | €725\nAnnual     | €60             | €4,380           | €8,700",
        },
      },
      {
        id: "wed-4-s5",
        title: "Write your conclusion paragraph",
        instruction:
          "Below your calculations, write a short paragraph (4-5 sentences) answering: Is this Airbnb business profitable? What's the minimum occupancy you need? What's the biggest risk? What would you change to improve profitability? This shows you understand the numbers, not just calculated them.",
        duration: "~8 min",
        tips: [
          "Use specific numbers from YOUR calculations, not generic statements",
          "Mention what surprised you — investors love hearing honest reflections",
          "If the numbers don't look great, say so! Identifying problems IS the skill",
        ],
      },
    ],
    successCriteria: [
      { id: "w4-sc1", label: "All fixed and variable costs are listed with amounts" },
      { id: "w4-sc2", label: "Break-even calculation is shown step-by-step with correct formula" },
      { id: "w4-sc3", label: "Three scenarios (50%, 70%, 90%) are fully calculated" },
      { id: "w4-sc4", label: "Nightly price is justified using Monday's market research data" },
      { id: "w4-sc5", label: "Conclusion paragraph uses specific numbers from your calculations" },
    ],
    evidenceSubmission: {
      description: "Submit your profitability spreadsheet with cost breakdown, break-even calculation, 3 scenarios, and conclusion paragraph.",
      format: "Google Sheets or Excel file",
    },
  },

  // ===== WED-5: Tax Simulation =====
  {
    taskId: "wed-5",
    brief: {
      whyItMatters:
        "Earning money is great, but forgetting about taxes can turn your profit into a debt. In Spain, tourist rental income is taxed, and there's a specific tourist tax in Malaga. Understanding taxes isn't optional — it's the law, and not knowing doesn't protect you.",
      whatYouLearn:
        "You'll learn how VAT (IVA) works, what income tax (IRPF) means, how local tourist taxes function, and most importantly: the difference between gross income (what guests pay) and net income (what you actually keep).",
      realWorldConnection:
        "Every freelancer and business owner in Spain must understand these taxes. The Tax Agency (Agencia Tributaria) processes over 20 million tax returns per year. Learning this now saves you from very expensive mistakes later.",
    },
    steps: [
      {
        id: "wed-5-s1",
        title: "Calculate IVA on your revenue",
        instruction:
          "Take your monthly revenue from the 70% occupancy scenario (the realistic one). In Spain, tourist rentals that include services (cleaning, linen changes) are subject to 10% IVA (reduced rate for hospitality). Calculate: Revenue × 0.10 = IVA amount. Then calculate what the guest actually pays: your price + IVA. Write this out clearly showing price WITHOUT tax and WITH tax.",
        duration: "~10 min",
        tips: [
          "Important: If you ONLY rent the apartment with no services, it may be IVA-exempt. For this exercise, assume you offer services (which most Airbnbs do)",
          "The 10% rate is the reduced hospitality rate, not the standard 21%",
          "Show both: the IVA you collect AND what you must send to the government",
        ],
        example: {
          label: "IVA calculation",
          content:
            "Monthly revenue at 70%: €1,785\nIVA (10%): €1,785 × 0.10 = €178.50\nGuest actually pays: €1,785 + €178.50 = €1,963.50\nYou keep the €1,785 but must pay €178.50 to the Tax Agency quarterly",
        },
      },
      {
        id: "wed-5-s2",
        title: "Calculate IRPF withholding",
        instruction:
          "IRPF is income tax — the government takes a percentage of your profit (not revenue, profit!). For simplicity, use a 19% rate (the first bracket for small income). Take your monthly PROFIT from the 70% scenario and calculate: Profit × 0.19 = IRPF. This is what you'd set aside for your annual tax return.",
        duration: "~10 min",
        tips: [
          "IRPF is on PROFIT, not on total revenue. Subtract your costs first!",
          "19% is the lowest bracket (up to €12,450/year). Higher income = higher rate",
          "Smart tip: Real entrepreneurs set aside their tax money in a separate bank account every month so they're never caught off guard",
        ],
      },
      {
        id: "wed-5-s3",
        title: "Calculate Malaga's tourist tax",
        instruction:
          "Since 2024, Andalucia charges a tourist tax (Tasa Turistica). The rate depends on your property's category: €1-2 per guest per night for standard accommodations. For your calculation: assume an average of 2 guests per booking and use €1.50 per guest per night. Calculate the monthly tourist tax for your 70% scenario (21 nights × 2 guests × €1.50).",
        duration: "~10 min",
        tips: [
          "This tax is paid by the GUEST, but you collect it and send it to the government",
          "It's a small amount per night but adds up over a year!",
          "Add it clearly to your breakdown — it's separate from IVA and IRPF",
        ],
        example: {
          label: "Tourist tax calculation",
          content:
            "21 nights × 2 guests × €1.50 = €63/month\n€63 × 12 = €756/year in tourist tax collected and remitted",
        },
      },
      {
        id: "wed-5-s4",
        title: "Create your net income summary",
        instruction:
          "Now bring it all together. Create a clear summary table showing: (1) Gross revenue, (2) minus Operating costs, (3) = Operating profit, (4) minus IVA, (5) minus IRPF, (6) minus Tourist tax, (7) = NET INCOME (what you actually keep). Do this for all 3 scenarios (50%, 70%, 90%).",
        duration: "~15 min",
        tips: [
          "This is the 'reality check' moment — the net number is always surprisingly lower than the gross",
          "Highlight the NET income in bold — that's the number that actually matters",
          "If net income is negative in the 50% scenario, that's a warning sign worth noting",
        ],
      },
      {
        id: "wed-5-s5",
        title: "Compare gross vs net with a visual",
        instruction:
          "Create a simple visual (bar chart or waterfall diagram) showing how your gross revenue of the 70% scenario 'shrinks' as each tax and cost is subtracted. Label each bar: Gross Revenue → minus Costs → minus IVA → minus IRPF → minus Tourist Tax → NET. This visual tells the whole story at a glance.",
        duration: "~10 min",
        tips: [
          "A waterfall chart works best here — each bar shows the deduction",
          "Use colors: green for revenue, red for deductions, blue for net income",
          "Add percentages: 'You keep X% of what guests pay' — this is your effective margin",
        ],
        resources: [
          { label: "Google Sheets chart tools", type: "tool" },
          { label: "Canva chart templates", type: "template" },
        ],
      },
    ],
    successCriteria: [
      { id: "w5-sc1", label: "IVA calculation uses the correct 10% hospitality rate" },
      { id: "w5-sc2", label: "IRPF is calculated on profit, not revenue" },
      { id: "w5-sc3", label: "Tourist tax calculation includes number of guests" },
      { id: "w5-sc4", label: "Net income summary covers all 3 occupancy scenarios" },
      { id: "w5-sc5", label: "Visual clearly shows how gross revenue becomes net income" },
    ],
    evidenceSubmission: {
      description: "Submit your tax calculation worksheet with IVA, IRPF, tourist tax, net income summary for 3 scenarios, and the gross-to-net visual.",
      format: "Google Sheets with embedded chart, or separate spreadsheet + Canva visual",
    },
  },

  // ===== WED-6: Legal Compliance Checklist Review =====
  {
    taskId: "wed-6",
    brief: {
      whyItMatters:
        "Operating an illegal tourist rental in Spain can result in fines from €2,000 to €150,000. Ignorance of the law is not an excuse. This checklist ensures your Airbnb project would be fully legal if it were real — and shows investors you've done your homework.",
      whatYouLearn:
        "You'll learn how to use legal research (from Monday) practically, understand compliance as a business requirement, and develop the habit of systematic verification — a skill valued in every professional field.",
      realWorldConnection:
        "Every business must comply with regulations. Real estate companies have compliance departments with full-time staff. You're doing in 30 minutes what those teams spend weeks on — verifying that a property meets all legal requirements.",
    },
    steps: [
      {
        id: "wed-6-s1",
        title: "Review Monday's legal requirements document",
        instruction:
          "Go back to your Monday evidence (the legal requirements checklist you created). Read through each requirement carefully. Make sure you understand what each one means. If anything is unclear, ask a classmate or look it up. You need to fully understand the rules before you can verify compliance.",
        duration: "~5 min",
        tips: [
          "Focus on the 4 main areas: registration, safety, guest registry, and energy certificate",
          "If you didn't finish Monday's research, use a classmate's checklist as reference",
        ],
        resources: [
          { label: "Your Monday legal checklist", type: "reference" },
          { label: "Junta de Andalucia VFT guide", type: "reference" },
        ],
      },
      {
        id: "wed-6-s2",
        title: "Check each requirement against your project",
        instruction:
          "Create a table with 3 columns: Requirement | Status (Compliant/Not Yet/N/A) | Notes. Go through every legal requirement and honestly assess: does your Airbnb project meet this requirement? For each item, mark it as Compliant (yes, your project addresses this), Not Yet (you know about it but haven't addressed it), or N/A (doesn't apply to your property type).",
        duration: "~10 min",
        tips: [
          "Be honest! Marking everything as 'Compliant' without thinking is the wrong approach",
          "For a school project, many things will be 'Not Yet' — that's okay, the point is you KNOW what's needed",
          "Add a note explaining WHY for each Not Yet — what would you need to do to become compliant?",
        ],
        example: {
          label: "Compliance table format",
          content:
            "VFT Registration      | Not Yet | Would need to apply to Junta de Andalucia (€0, 1 month wait)\nFire Extinguisher     | Not Yet | Need to purchase and install (€25)\nGuest Registry (Policia) | Not Yet | Need to register with local police station\nEnergy Certificate    | Not Yet | Professional assessment required (€150)\nFirst Aid Kit         | Compliant | Included in startup budget from Tuesday",
        },
      },
      {
        id: "wed-6-s3",
        title: "Identify gaps and create an action plan",
        instruction:
          "Look at all your 'Not Yet' items. For each one, write a brief action plan: What would you need to do? How much would it cost? How long would it take? Prioritize them: which ones MUST be done before you can legally operate, and which are nice-to-have? Create a simple priority list.",
        duration: "~10 min",
        tips: [
          "Some requirements are BLOCKING — you literally cannot operate without them (like VFT registration)",
          "Others are important but can be done quickly (buying a fire extinguisher)",
          "Add the costs to your profitability calculation from the previous task — do they change your break-even?",
        ],
      },
      {
        id: "wed-6-s4",
        title: "Sign off on your compliance review",
        instruction:
          "Write a short summary (3-4 sentences) at the bottom of your document stating: the total number of requirements you checked, how many are compliant, how many need action, the estimated total cost to become fully compliant, and a statement that you understand the legal obligations. Sign it with your name and today's date. This is your professional compliance sign-off.",
        duration: "~5 min",
        tips: [
          "This is a real professional practice — auditors always sign off on compliance reviews",
          "Be specific with numbers: '8 of 12 requirements met, 4 need action, estimated cost: €325'",
        ],
      },
    ],
    successCriteria: [
      { id: "w6-sc1", label: "All requirements from Monday's research are included in the checklist" },
      { id: "w6-sc2", label: "Each requirement has a clear status: Compliant, Not Yet, or N/A" },
      { id: "w6-sc3", label: "Every 'Not Yet' item has an action plan with cost and timeline" },
      { id: "w6-sc4", label: "Signed compliance summary includes specific numbers" },
    ],
    evidenceSubmission: {
      description: "Submit your completed and signed compliance checklist with status table, action plan for gaps, and summary sign-off.",
      format: "Google Doc or printed and signed PDF",
    },
  },
];
