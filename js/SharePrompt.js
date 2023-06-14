const template = Handlebars.compile(
  /** @type {HTMLElement} */ (document.getElementById("share-prompt-template"))
    .innerHTML,
);

function render() {
  const url = window.location.href;
  const urlEncoded = encodeURIComponent(url);
  /** @type {HTMLElement} */ (
    document.getElementById("share-prompt")
  ).innerHTML = template({ url, urlEncoded });
}

export function initUI() {
  render();
}
