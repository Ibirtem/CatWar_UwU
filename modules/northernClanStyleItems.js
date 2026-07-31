(function () {
  "use strict";

  const targetIds = new Set([
    "13",  // кошачья мята
    "15",  // подорожник
    "17",  // крапива
    "19",  // щавель
    "21",  // целебная водоросль
    "23",  // бурачник
    "25",  // тысячелистник
    "26",  // мать-и-мачеха
    "61", // лопух (голубика)
    "106", // клевер
    "109", // мятлик
    "110", // мёд
    "111", // незабудка
    "112", // одуванчик
    "115", // пижма
    "116", // рябина
    "119",  // шиповник

    "342", // бабочка на камне
    "343", // бабочка на камне
    "344", // бабочка на камне
    "416", // стая бабочек
    "590", // светлячок в домике
    "990", // бабочка
    "991", // бабочка
    "992", // бабочка
    "993", // светлячок
    "1388", // мох
    "1392", // мёд
    "1406", // мох
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
