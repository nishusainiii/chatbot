function normalize(text) {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function tokenize(text) {
  if (!text) return [];
  return normalize(text).split(" ");
}

const BUSINESS_DEFS = [
  {
    name: "Gross margin",
    patterns: [["gross", "margin"], ["gross", "profit", "margin"]],
    answer: `Gross margin shows how much of your sales value you keep after paying the direct cost of producing the product or service.

Formula:
  Gross margin (%) = (Revenue − Cost of Goods Sold) / Revenue × 100

Example:
  Revenue = ₹1,00,000
  Cost of Goods Sold (COGS) = ₹60,000
  Gross margin = (1,00,000 − 60,000) / 1,00,000 = 40%

Why it matters:
  • Higher gross margin means you have more money left to pay salaries, rent, marketing and still make profit.
  • Low gross margin usually means the pricing is weak or costs are too high.`
  },
  {
    name: "Net profit margin",
    patterns: [["net", "margin"], ["net", "profit"]],
    answer: `Net profit margin shows how much of every rupee of revenue becomes final profit after all expenses.

Formula:
  Net profit margin (%) = Net profit / Revenue × 100

Net profit includes:
  • Cost of goods sold
  • Operating expenses (salaries, rent, marketing)
  • Interest
  • Taxes

Example:
  Revenue = ₹1,00,000
  Net profit = ₹8,000
  Net profit margin = 8%

Why it matters:
  • It reflects the overall health and efficiency of the business.
  • Two companies can have similar revenue but very different net margins, which changes how attractive they are.`
  },
  {
    name: "Operating margin",
    patterns: [["operating", "margin"], ["ebit", "margin"]],
    answer: `Operating margin measures how profitable the core business operations are, before interest and taxes.

Formula:
  Operating margin (%) = Operating profit (EBIT) / Revenue × 100

Operating profit (EBIT) = Revenue − COGS − Operating expenses

Usage:
  • Good for comparing companies in the same industry.
  • Focuses on operational efficiency without being distorted by financing structure or tax rates.`
  },
  {
    name: "Revenue",
    patterns: [["revenue"], ["sales", "revenue"], ["topline"]],
    answer: `Revenue is the total amount of money a business earns from selling its products or services before any costs are deducted.

Example:
  If you sell 500 units at ₹200 each, revenue = 500 × 200 = ₹1,00,000.

Key points:
  • Often called the “top line”.
  • High revenue alone is not enough; profit and cash flow must also be healthy.`
  },
  {
    name: "Profit",
    patterns: [["profit"], ["bottomline"]],
    answer: `Profit is the money left after all expenses are subtracted from revenue.

Basic idea:
  Profit = Revenue − (COGS + Operating expenses + Interest + Taxes)

Types:
  • Gross profit (after direct costs)
  • Operating profit (after operating expenses)
  • Net profit (after all expenses)

Why it matters:
  • Profit is the reward for taking risk.
  • Investors and founders care more about long-term sustainable profit than short-term sales spikes.`
  },
  {
    name: "EBITDA",
    patterns: [["ebitda"]],
    answer: `EBITDA stands for Earnings Before Interest, Taxes, Depreciation and Amortisation.

EBITDA = Net profit
         + Interest
         + Taxes
         + Depreciation
         + Amortisation

Purpose:
  • Shows operating performance without the impact of capital structure (debt vs equity) and non-cash charges.
  • Often used for comparing companies and for valuation multiples (EV/EBITDA).`
  },
  {
    name: "Cash flow",
    patterns: [["cash", "flow"]],
    answer: `Cash flow is the net movement of actual cash into and out of the business over a period.

Types:
  • Operating cash flow – from regular business activities.
  • Investing cash flow – buying or selling assets.
  • Financing cash flow – loans, equity, dividends.

Key idea:
  • A business can show profit on paper but still die if cash flow is weak.
  • Positive and stable operating cash flow is a strong sign of a healthy business.`
  },
  {
    name: "Burn rate",
    patterns: [["burn", "rate"]],
    answer: `Burn rate is how much cash a company is losing per month when it is not yet profitable.

Example:
  Monthly cash in = ₹3,00,000
  Monthly cash out = ₹5,00,000
  Net burn = ₹2,00,000 per month

Why it matters:
  • Tells how fast the company is consuming its cash reserves.
  • Directly linked to “runway”, which is how many months of life the startup has before it must raise money or become profitable.`
  },
  {
    name: "Runway",
    patterns: [["runway"]],
    answer: `Runway is the amount of time a company can continue operating before it runs out of cash, assuming current burn rate.

Formula:
  Runway (months) = Cash in bank / Monthly net burn

Example:
  Cash in bank = ₹24,00,000
  Net burn = ₹2,00,000 per month
  Runway = 12 months

Why it matters:
  • Founders and investors use runway to plan funding rounds and cost control.
  • Very short runway means urgent action is required (cut costs, grow revenue or raise capital).`
  },
  {
    name: "Customer Acquisition Cost (CAC)",
    patterns: [["customer", "acquisition", "cost"], ["cac"]],
    answer: `Customer Acquisition Cost (CAC) is the average sales and marketing cost required to acquire one new paying customer.

Formula:
  CAC = Total sales and marketing cost in a period
        ÷ Number of new customers acquired in that period

Example:
  You spend ₹2,00,000 on marketing and sales in a month and acquire 100 new customers.
  CAC = 2,00,000 / 100 = ₹2,000 per customer.

Why it matters:
  • Helps you understand if your growth engine is efficient.
  • CAC must make sense relative to customer Lifetime Value (LTV).`
  },
  {
    name: "Customer Lifetime Value (LTV)",
    patterns: [["lifetime", "value"], ["ltv"], ["clv"]],
    answer: `Customer Lifetime Value (LTV) is the total profit you expect to earn from a customer over the entire relationship.

Simple approach:
  LTV ≈ Average order value
        × Purchase frequency per year
        × Average customer lifespan (years)
        × Gross margin %

Example:
  Average order = ₹1,000
  Orders per year = 4
  Lifespan = 3 years
  Gross margin = 40%
  LTV ≈ 1,000 × 4 × 3 × 0.4 = ₹4,800

Why it matters:
  • Tells how much you can reasonably spend on acquiring a customer.
  • When LTV is much higher than CAC, the model is usually strong.`
  },
  {
    name: "LTV / CAC ratio",
    patterns: [["ltv", "cac"], ["ltv", "to", "cac"]],
    answer: `The LTV/CAC ratio compares the value of a customer over time to the cost of acquiring that customer.

Formula:
  LTV/CAC ratio = Customer Lifetime Value ÷ Customer Acquisition Cost

Example:
  LTV = ₹6,000
  CAC = ₹2,000
  LTV/CAC = 3:1

Typical rule of thumb:
  • Around 3:1 is considered healthy for many businesses.
  • A ratio < 1 means you lose money on each customer.
  • A very high ratio might indicate under-investment in growth.`
  },
  {
    name: "Churn rate",
    patterns: [["churn", "rate"], ["customer", "churn"]],
    answer: `Churn rate is the percentage of customers you lose over a given period.

Formula:
  Churn (%) = Customers lost during period
              ÷ Customers at start of period × 100

Example:
  Start of month: 1,000 customers
  End of month: 950 customers (so 50 lost)
  Churn = 50 / 1,000 × 100 = 5%

Why it matters:
  • High churn kills subscription and SaaS businesses.
  • Reducing churn often has more impact on profit than spending more on acquisition.`
  },
  {
    name: "Retention rate",
    patterns: [["retention", "rate"]],
    answer: `Retention rate is the percentage of customers you keep over a period.

Basic relationship:
  Retention rate = 1 − Churn rate

Example:
  If monthly churn is 5%, retention rate is 95%.

Why it matters:
  • High retention means people find real value in your product.
  • Companies with strong retention usually have higher LTV and more stable growth.`
  },
  {
    name: "Conversion rate",
    patterns: [["conversion", "rate"]],
    answer: `Conversion rate measures how many people complete a desired action, such as signing up or making a purchase.

Formula:
  Conversion rate (%) = Number of conversions
                        ÷ Total visitors or leads × 100

Example:
  2,000 visitors, 100 purchases
  Conversion rate = 100 / 2,000 × 100 = 5%

Why it matters:
  • Improving conversion rate increases revenue without needing more traffic.
  • It is a key metric in marketing and funnel optimisation.`
  },
  {
    name: "ARPU",
    patterns: [["arpu"], ["average", "revenue", "per", "user"]],
    answer: `ARPU (Average Revenue Per User) shows how much revenue you generate per active user over a period.

Formula:
  ARPU = Total revenue in the period
         ÷ Number of active users in the period

Usage:
  • Common in telecom, SaaS and consumer apps.
  • Tracking ARPU over time helps you see if your monetisation is improving.`
  },
  {
    name: "MRR",
    patterns: [["mrr"], ["monthly", "recurring", "revenue"]],
    answer: `Monthly Recurring Revenue (MRR) is the predictable subscription revenue a business earns each month.

Example:
  100 customers paying ₹1,000 per month.
  MRR = 100 × 1,000 = ₹1,00,000.

Why it matters:
  • Clean indicator of the size and stability of a subscription business.
  • Founders and investors track MRR growth closely.`
  },
  {
    name: "ARR",
    patterns: [["arr"], ["annual", "recurring", "revenue"]],
    answer: `Annual Recurring Revenue (ARR) is the yearly value of recurring subscription contracts.

Simple relationship:
  ARR ≈ MRR × 12

Usage:
  • High-level metric for the scale of a SaaS or subscription business.
  • Often used for valuations and long-term planning.`
  },
  {
    name: "Break-even point",
    patterns: [["break", "even"], ["breakeven"]],
    answer: `The break-even point is the level of sales where total revenue equals total costs, so profit is zero.

Units formula:
  Break-even units = Fixed costs
                     ÷ (Selling price per unit − Variable cost per unit)

Example:
  Fixed costs = ₹50,000 per month
  Selling price per unit = ₹500
  Variable cost per unit = ₹300
  Contribution per unit = 200
  Break-even units = 50,000 / 200 = 250 units

Why it matters:
  • Shows the minimum scale required for the business to stop losing money.`
  },
  {
    name: "Fixed vs variable cost",
    patterns: [["fixed", "cost"], ["variable", "cost"]],
    answer: `Fixed costs:
  • Do not change with sales volume in the short term.
  • Examples: office rent, salaries of core staff, insurance.

Variable costs:
  • Move up and down with sales volume.
  • Examples: raw materials, packaging, payment gateway fees, shipping.

Why it matters:
  • The mix of fixed and variable costs affects risk and operating leverage.
  • High fixed costs can give strong profit once volume is high, but are risky at low volume.`
  },
  {
    name: "Contribution margin",
    patterns: [["contribution", "margin"]],
    answer: `Contribution margin shows how much each unit sold contributes towards covering fixed costs and profit.

Per-unit formula:
  Contribution margin per unit = Selling price per unit − Variable cost per unit

Percentage:
  Contribution margin (%) = (Contribution per unit ÷ Selling price per unit) × 100

Usage:
  • Helps in pricing decisions and break-even analysis.
  • Higher contribution margin means each sale adds more to covering fixed overheads.`
  },
  {
    name: "Unit economics",
    patterns: [["unit", "economics"]],
    answer: `Unit economics analyse revenue and cost for a single “unit” – usually one customer, one order or one subscription.

Typical components:
  • Revenue per unit
  • Variable cost per unit
  • Contribution margin per unit
  • CAC and LTV

Key idea:
  • If you lose money per unit and cannot fix it, scaling the business only scales the losses.
  • Strong unit economics are a foundation for sustainable growth.`
  },
  {
    name: "ROI",
    patterns: [["roi"], ["return", "on", "investment"]],
    answer: `Return on Investment (ROI) measures how much profit you make relative to the money invested in a project or campaign.

Formula:
  ROI (%) = (Gain from investment − Cost of investment)
            ÷ Cost of investment × 100

Example:
  You invest ₹1,00,000 in a campaign and earn ₹1,30,000 in profit from it.
  ROI = (1,30,000 − 1,00,000) / 1,00,000 × 100 = 30%

Usage:
  • Compare different projects or marketing channels.
  • Higher ROI is generally better, but risk and time also matter.`
  },
  {
    name: "ROAS",
    patterns: [["roas"], ["return", "on", "ad", "spend"]],
    answer: `Return on Ad Spend (ROAS) tells you how much revenue you earn for each unit of advertising spend.

Formula:
  ROAS = Revenue from ads ÷ Cost of ads

Example:
  Ad spend = ₹50,000
  Revenue generated from that campaign = ₹2,00,000
  ROAS = 2,00,000 / 50,000 = 4 (or 4:1)

Difference from ROI:
  • ROAS focuses only on revenue vs ad cost.
  • ROI includes profit and all costs, not just advertising.`
  },
  {
    name: "TAM / SAM / SOM",
    patterns: [["tam"], ["sam"], ["som"], ["total", "addressable", "market"]],
    answer: `TAM, SAM and SOM are three levels of market size:

• TAM (Total Addressable Market):
  The maximum demand if you captured 100% of all potential customers.

• SAM (Serviceable Available Market):
  The portion of TAM that fits your business model, geography and constraints.

• SOM (Serviceable Obtainable Market):
  The realistic share of SAM you can capture in the near to medium term.

Investors look at these numbers to judge whether the opportunity is niche or very large.`
  },
  {
    name: "B2B",
    patterns: [["b2b"], ["business", "to", "business"]],
    answer: `B2B (business to business) means you sell products or services to other companies instead of individual consumers.

Characteristics:
  • Fewer customers but higher contract value.
  • Longer sales cycles with multiple decision-makers.
  • Buying decisions are more rational and ROI-driven.

Examples:
  • Software sold to companies.
  • Industrial equipment.
  • HR, accounting or marketing services for businesses.`
  },
  {
    name: "B2C",
    patterns: [["b2c"], ["business", "to", "consumer"]],
    answer: `B2C (business to consumer) means you sell directly to individual consumers.

Characteristics:
  • Many customers with relatively smaller ticket size.
  • Shorter, faster sales cycle.
  • Decisions influenced by brand, emotion and convenience.

Examples:
  • E-commerce brands selling clothing or electronics.
  • Food delivery apps.
  • Direct subscription apps for individuals.`
  },
  {
    name: "D2C",
    patterns: [["d2c"], ["direct", "to", "consumer"]],
    answer: `D2C (direct to consumer) is a model where a brand sells directly to end customers without traditional intermediaries like distributors or physical retailers.

Key points:
  • Brand controls the full customer experience (website, packaging, communication).
  • Better data on customer behaviour and margins, but the brand must handle its own marketing and logistics.`
  },
  {
    name: "Product–market fit",
    patterns: [["product", "market", "fit"]],
    answer: `Product–market fit is the stage where your product solves a real, important problem for a clearly defined segment of customers, and they are willing to pay and keep using it.

Signals:
  • Strong retention (people keep coming back).
  • Organic word-of-mouth.
  • Customers would be genuinely disappointed if the product disappeared.

Without product–market fit, aggressive marketing usually wastes money.`
  },
  {
    name: "MVP",
    patterns: [["mvp"], ["minimum", "viable", "product"]],
    answer: `A Minimum Viable Product (MVP) is the simplest version of a product that delivers core value to early users and allows you to learn quickly.

Key points:
  • Contains only essential features.
  • Built to test assumptions, not to be perfect.
  • Feedback from MVP users guides which features to build next.`
  },
  {
    name: "Pivot",
    patterns: [["pivot"]],
    answer: `A pivot is a deliberate, significant change in product, target customer or business model based on learning from the market.

Examples:
  • Same product, new customer segment.
  • New pricing or revenue model.
  • Narrowing or expanding the use-case.

Good pivots are based on data and feedback, not random guesses.`
  },
  {
    name: "R&D",
    patterns: [["r", "d"], ["research", "development"]],
    answer: `Research and Development (R&D) is systematic work to create new products, technologies or significant improvements to existing ones.

Characteristics:
  • Costs are high and results are uncertain.
  • Often treated as a long-term investment rather than short-term profit generator.
  • Strong R&D can create defensible competitive advantages (patents, unique technology).`
  },
  {
    name: "Valuation",
    patterns: [["valuation"], ["company", "valuation"]],
    answer: `Valuation is an estimate of how much a company is worth.

Approaches:
  • Multiples (for example: EV/EBITDA, P/E, revenue multiple).
  • Discounted cash flow (DCF) based on future cash flows.
  • Comparables with similar companies.

For startups:
  • Often driven by growth potential, market size, founder quality and negotiation between founders and investors.`
  },
  {
    name: "Target price (stock)",
    patterns: [["target", "price"], ["stock", "target"]],
    answer: `A stock target price is an analyst’s estimate of the future trading price for a share, usually over the next 6–12 months.

How it is set:
  • Based on valuation models (like DCF or multiples).
  • Includes assumptions about growth, margins, interest rates and risk.

Important:
  • It is only a forecast, not a guarantee.
  • If assumptions change, the target price can move quickly.`
  }
];

const SMALL_TALK = [
  {
    patterns: [["hi"], ["hello"], ["hey"], ["good", "morning"], ["good", "evening"]],
    answer:
      "Hello. I am a business-terms chatbot. Ask me about concepts like gross margin, CAC, churn, ROI, burn rate, B2B, B2C, unit economics and many more."
  },
  {
    patterns: [["thank"], ["thanks"], ["thankyou"], ["thank", "you"]],
    answer:
      "You are welcome. You can ask about another business term whenever you like."
  },
  {
    patterns: [["bye"], ["goodbye"], ["see", "you"]],
    answer:
      "Goodbye. I hope these explanations helped you understand business concepts more clearly."
  }
];

function wordsSet(text) {
  const tokens = tokenize(text);
  const set = new Set(tokens);
  return set;
}

function patternMatches(set, pattern) {
  for (let i = 0; i < pattern.length; i++) {
    if (!set.has(pattern[i])) return false;
  }
  return true;
}

function findInList(set, list) {
  for (let i = 0; i < list.length; i++) {
    const def = list[i];
    for (let j = 0; j < def.patterns.length; j++) {
      if (patternMatches(set, def.patterns[j])) {
        return def.answer;
      }
    }
  }
  return null;
}

function generateBotReply(userMessage) {
  const set = wordsSet(userMessage);

  const termAnswer = findInList(set, BUSINESS_DEFS);
  if (termAnswer) return termAnswer;

  const smallTalkAnswer = findInList(set, SMALL_TALK);
  if (smallTalkAnswer) return smallTalkAnswer;

  return (
    "I am focused on business and startup topics. Try asking directly for a term such as gross margin, net profit margin, CAC, LTV, churn rate, burn rate, ROI, B2B, B2C, unit economics, break-even, TAM / SAM / SOM, valuation or target price."
  );
}

// DOM wiring
var chatWindow = document.getElementById("chat-window");
var chatForm = document.getElementById("chat-form");
var userInput = document.getElementById("user-input");

function addMessage(text, sender) {
  var row = document.createElement("div");
  row.className = "message-row " + sender;

  var bubble = document.createElement("div");
  bubble.className = "message-bubble";
  bubble.textContent = text;

  row.appendChild(bubble);
  chatWindow.appendChild(row);
  chatWindow.scrollTop = chatWindow.scrollHeight;
}

function addBotTyping() {
  var row = document.createElement("div");
  row.className = "message-row bot";
  row.id = "typing-row";

  var bubble = document.createElement("div");
  bubble.className = "message-bubble";

  var span = document.createElement("span");
  span.className = "typing-indicator";
  span.textContent = "typing...";

  bubble.appendChild(span);
  row.appendChild(bubble);
  chatWindow.appendChild(row);
  chatWindow.scrollTop = chatWindow.scrollHeight;
}

function removeBotTyping() {
  var row = document.getElementById("typing-row");
  if (row && row.parentNode) {
    row.parentNode.removeChild(row);
  }
}

// initial bot message
addMessage(
  "Hello, I am a business-terms chatbot. Type any term such as gross margin, net profit margin, CAC, LTV, churn rate, burn rate, ROI, B2B, B2C, unit economics, break-even, TAM / SAM / SOM, valuation or target price to get a detailed explanation.",
  "bot"
);

// form handler
chatForm.addEventListener("submit", function (e) {
  e.preventDefault();
  var text = userInput.value.trim();
  if (!text) return;

  addMessage(text, "user");
  userInput.value = "";

  addBotTyping();

  setTimeout(function () {
    removeBotTyping();
    var reply = generateBotReply(text);
    addMessage(reply, "bot");
  }, 350);
});
