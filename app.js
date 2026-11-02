const money = new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 });
const byId = (id) => document.getElementById(id);

const filters = { type: byId("filter-type"), price: byId("filter-price"), bedrooms: byId("filter-bedrooms") };
const grid = byId("listing-grid");
const dialog = byId("property-dialog");
let lastOpener = null;

const bedroomLabel = (n) => `${n} ${n === 1 ? "bed" : "beds"}`;
const bathroomLabel = (n) => `${n} ${n === 1 ? "bath" : "baths"}`;

function element(tag, className, text) {
  const node = document.createElement(tag);
  if (className) node.className = className;
  if (text !== undefined) node.textContent = text;
  return node;
}

function factItems(home) {
  return [bedroomLabel(home.bedrooms), bathroomLabel(home.bathrooms), `${home.sizeSqm} m²`].map((fact) =>
    element("li", "", fact),
  );
}

function card(home) {
  const article = element("article", "listing");
  const image = element("img");
  image.src = home.image;
  image.alt = home.imageAlt;
  image.loading = "lazy";

  const body = element("div", "listing__body");
  const button = element("button", "listing__open", home.name);
  button.type = "button";
  button.addEventListener("click", () => openDialog(home, button));
  const title = element("h3");
  title.append(button);

  const facts = element("ul", "facts");
  facts.append(...factItems(home));

  body.append(
    element("p", "eyebrow", `${home.type} · ${home.area}`),
    title,
    element("p", "price", money.format(home.price)),
    facts,
  );
  article.append(image, body);
  // The whole card opens the details; the button inside it keeps this working from the keyboard.
  article.addEventListener("click", (event) => {
    if (event.target !== button) openDialog(home, button);
  });
  return article;
}

function render() {
  const type = filters.type.value;
  const maxPrice = Number(filters.price.value) || Infinity;
  const minBedrooms = Number(filters.bedrooms.value) || 0;
  const homes = LISTINGS.filter(
    (home) => (!type || home.type === type) && home.price <= maxPrice && home.bedrooms >= minBedrooms,
  );
  grid.replaceChildren(...homes.map(card));
  byId("empty").hidden = homes.length > 0;
  byId("result-count").textContent = `${homes.length} ${homes.length === 1 ? "home" : "homes"}`;
}

function openDialog(home, opener) {
  lastOpener = opener;
  dialog.dataset.home = home.id;
  byId("dialog-image").src = home.image;
  byId("dialog-image").alt = home.imageAlt;
  byId("dialog-meta").textContent = `${home.type} · ${home.area}`;
  byId("dialog-title").textContent = home.name;
  byId("dialog-price").textContent = money.format(home.price);
  byId("dialog-summary").textContent = home.summary;
  byId("dialog-facts").replaceChildren(...factItems(home));
  byId("dialog-features").replaceChildren(...home.features.map((feature) => element("li", "", feature)));
  dialog.showModal();
}

Object.values(filters).forEach((select) => select.addEventListener("change", render));
// "reset" fires before the form's values change, so render on the next tick.
byId("filters").addEventListener("reset", () => setTimeout(render));

byId("hero-search").addEventListener("submit", (event) => {
  event.preventDefault();
  filters.type.value = byId("hero-type").value;
  filters.price.value = byId("hero-price").value;
  filters.bedrooms.value = byId("hero-bedrooms").value;
  render();
  byId("homes").scrollIntoView();
});

byId("dialog-close").addEventListener("click", () => dialog.close());
// A click on the backdrop lands on the dialog element itself.
dialog.addEventListener("click", (event) => {
  if (event.target === dialog) dialog.close();
});
dialog.addEventListener("close", () => {
  if (lastOpener?.isConnected) lastOpener.focus();
});

byId("dialog-enquire").addEventListener("click", () => {
  const home = LISTINGS.find((item) => item.id === dialog.dataset.home);
  lastOpener = null;
  dialog.close();
  byId("contact-message").value = `I'd like to book a viewing of ${home.name} in ${home.area}.`;
  byId("contact").scrollIntoView();
  byId("contact-name").focus({ preventScroll: true });
});

byId("contact-form").addEventListener("submit", (event) => {
  event.preventDefault();
  const checks = [
    ["contact-name", (value) => (value.trim() ? "" : "Enter your name.")],
    ["contact-email", (value) => (/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim()) ? "" : "Enter a valid email address.")],
    ["contact-message", (value) => (value.trim() ? "" : "Tell us which home you'd like to see.")],
  ];
  let firstInvalid = null;
  for (const [id, check] of checks) {
    const input = byId(id);
    const problem = check(input.value);
    byId(`${id}-error`).textContent = problem;
    input.setAttribute("aria-invalid", String(Boolean(problem)));
    if (problem && !firstInvalid) firstInvalid = input;
  }
  byId("contact-note").textContent = firstInvalid
    ? ""
    : "Your details look good. This is a demo site, so your message wasn't sent to anyone.";
  firstInvalid?.focus();
});

render();
