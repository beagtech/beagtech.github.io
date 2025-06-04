document.addEventListener('DOMContentLoaded', function () {
  bindChoiceButtons();

  // Preload the images after the DOM is ready
  const preloadImage1 = new Image();
  preloadImage1.src = '../images/puffins.jpg';  

  initImageAccordionButtons('about_us');
});

function bindChoiceButtons() {
  document.addEventListener('click', function (event) {
    const button = event.target.closest('button');

    if (!button) return;

    const choosableContainer = findUpClass(button, 'choosable');
    if (!choosableContainer) return;

    const wasActive = button.classList.contains('active');
    choosableContainer.querySelectorAll('.buttons button').forEach(btn => btn.classList.remove('active'));
    if (wasActive) {
      // toggle to be no longer active
      button.classList.remove('active');
    }
    else {
      // make it active
      button.classList.add('active');
    }

    const contentKey = button.getAttribute('data-content');
    if (contentKey) {
      // clicked a top-level button
      toggleActive(document.querySelectorAll('.content-item'), `[data-content='${contentKey}']`);
      document.querySelector('.app-container')?.classList.toggle('content-active');
      initImageAccordionButtons(contentKey);
    } 

    if (button.classList.contains('accordion-button')) {
      const accordionContent = button.nextElementSibling;

      // Collapse any other accordion that was previously open
      const allAccordionButtons = document.querySelectorAll('.accordion-button');
      allAccordionButtons.forEach(btn => {
        if (btn !== button && !btn.classList.contains('collapsed')) {
          const accordion = btn.nextElementSibling;
          accordion.classList.remove('active');
          btn.classList.add('collapsed');
        }
      });

      toggleActive(button.closest('.content-item').querySelectorAll('.accordion-collapse'), null, accordionContent);

      if (accordionContent.classList.contains('active')) {
        button.classList.remove('collapsed');
      } else {
        button.classList.add('collapsed');
      }
    }
  });
}

function initImageAccordionButtons(contentKey) {
  const splitImageAccordion = document.querySelector(`.split-image-accordion[data-content='${contentKey}']`);
  if (!splitImageAccordion) return;

  const imageAccordionButtons = splitImageAccordion.querySelectorAll('.accordion-button');

  let naturalHeight = parseInt(splitImageAccordion.getAttribute('data-image-height'));
  if (isNaN(naturalHeight) || naturalHeight < 0) { return; }

  // additional shift
  let idealOffset = parseInt(splitImageAccordion.getAttribute('data-image-ideal-offset'));
  if (isNaN(idealOffset)) {
    idealOffset = 0;
  }

  const totalAccordionHeight = calculateAccordionHeight(splitImageAccordion);
  const totalOutOfFrame = naturalHeight - totalAccordionHeight;
  let outOfFrameAbove = totalOutOfFrame / 2;
  if (outOfFrameAbove < 0) {
    outOfFrameAbove = 0;
  }
  
  const numButtons = imageAccordionButtons.length;
  const perButtonHeight = totalAccordionHeight/numButtons;

  for (let i = 0; i < numButtons; i++) {
    let button = imageAccordionButtons[i];
    let imgElm = button.querySelector('.split-image');
    let offset = -outOfFrameAbove/2 - i*perButtonHeight + idealOffset;
    imgElm.style.backgroundPositionY = `${offset}px`;
  }
}

function calculateAccordionHeight(accordion) {
  return Array.from(accordion.querySelectorAll('.accordion-button'))
              .reduce((totalHeight, button) => totalHeight + button.offsetHeight, 0);
}

function toggleActive(elements, selector = null, specificElement = null) {
  elements.forEach(el => {
    if (selector ? el.matches(selector) : el === specificElement) {
      el.classList.toggle('active');
    } else {
      el.classList.remove('active');
    }
  });
}

function isElementNode(node) {
  return node && node.nodeType === 1;
}

function findUpClass(el, cls, selfCheck = true) {
  if (selfCheck && el && el.classList.contains(cls)) {
    return el;
  }
  while (el && el.parentNode) {
    el = el.parentNode;
    if (isElementNode(el) && el.classList.contains(cls)) {
      return el;
    }
  }
  return null;
}
