(function () {
  "use strict";

  const targetIds = new Set([
    "342",
    "343",
    "344",
    "416",
    "990",
    "991",
    "992",
    "1359",
    "1360",
    "1361",
    "1383",
    "1384",
    "1385",
    "1388",
    "1389",
    "1390",
    "1391",
    "1392",
    "1401",
    "1402",
    "1403",
    "1404",
    "1405",
    "1406",
  ]);

  const idRegex = /things\/(\d+)\.png/g;
  const baseUrl =
    "https://raw.githubusercontent.com/Ibirtem/CatWar/main/images/northern_clan/replacement/";

  function getReplacementString(match, id) {
    return targetIds.has(id) ? `${baseUrl}${id}.png` : match;
  }

  function processImg(img) {
    const src = img.getAttribute("src");
    if (!src) return;

    const newSrc = src.replace(idRegex, getReplacementString);
    if (newSrc !== src) {
      img.src = newSrc;
    }
  }

  function processCage(div) {
    const style = div.getAttribute("style");
    if (!style) return;

    const newStyle = style.replace(idRegex, getReplacementString);
    if (newStyle !== style) {
      div.setAttribute("style", newStyle);
    }
  }

  function processNode(node) {
    if (node.nodeType !== Node.ELEMENT_NODE) return;

    if (node.tagName === "IMG") {
      processImg(node);
    } else if (node.classList.contains("cage_items")) {
      processCage(node);
    }

    const images = node.querySelectorAll('img[src*="things/"]');
    const cages = node.querySelectorAll('.cage_items[style*="things/"]');

    const imgLen = images.length;
    for (let i = 0; i < imgLen; i++) {
      processImg(images[i]);
    }

    const cageLen = cages.length;
    for (let i = 0; i < cageLen; i++) {
      processCage(cages[i]);
    }
  }

  function handleMutations(mutations) {
    const mutLen = mutations.length;
    for (let i = 0; i < mutLen; i++) {
      const mutation = mutations[i];

      if (mutation.type === "childList") {
        const added = mutation.addedNodes;
        const addedLen = added.length;
        for (let j = 0; j < addedLen; j++) {
          processNode(added[j]);
        }
      } else if (mutation.type === "attributes") {
        processNode(mutation.target);
      }
    }
  }

  processNode(document.body);

  const observer = new MutationObserver(handleMutations);
  observer.observe(document.body, {
    childList: true,
    subtree: true,
    attributes: true,
    attributeFilter: ["style", "src"],
  });
})();
