const buttons = document.querySelectorAll('.toggle-button');

buttons.forEach((button, index) => {
    button.addEventListener('keydown', (event) => {
        if (event.key === 'ArrowRight' || event.key === 'ArrowDown') {
            event.preventDefault(); 
            const nextIndex = (index + 1) % buttons.length; 
            buttons[nextIndex].focus();
        } else if (event.key === 'ArrowLeft' || event.key === 'ArrowUp') {
            event.preventDefault(); 
            const prevIndex = (index - 1 + buttons.length) % buttons.length; 
            buttons[prevIndex].focus();
        }
    });
});

let fontState = 0;

document.getElementById('diminuirFonte').addEventListener('click', async (decrease) => {
  decrease.preventDefault();
  const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });

  chrome.scripting.executeScript({
    target: { tabId: tab.id },
    function: () => {
      let fontState = parseInt(localStorage.getItem('fontState'), 10) || 0;

      const textElements = document.querySelectorAll('p, i, span, a, h1, h2, h3, h4, h5, h6, li, td, th');

      const fontSizeFactors = [1, 1 / 1.2, 1 / 1.4];

      textElements.forEach(element => {
        if (!element.dataset.originalFontSize) {
          element.dataset.originalFontSize = window.getComputedStyle(element).fontSize;
        }

        let newFontSize;
        if (fontState === 0) {
          newFontSize = element.dataset.originalFontSize;
        } else {
          newFontSize = parseFloat(element.dataset.originalFontSize) * fontSizeFactors[fontState];
          newFontSize += "px";
        }

        element.style.fontSize = newFontSize;
      });

      fontState = (fontState + 1) % 3;

      localStorage.setItem('fontState', fontState);
    },
  });
});

document.getElementById('aumentarFonte').addEventListener('click', async (increase) => {
  increase.preventDefault();
  const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });

  chrome.scripting.executeScript({
    target: { tabId: tab.id },
    function: () => {
      let fontState = parseInt(localStorage.getItem('fontState'), 10) || 0;

      const textElements = document.querySelectorAll('p, i, span, a, h1, h2, h3, h4, h5, h6, li, td, th');

      const fontSizeFactors = [1, 1.2, 1.4];

      textElements.forEach(element => {
        if (!element.dataset.originalFontSize) {
          element.dataset.originalFontSize = window.getComputedStyle(element).fontSize;
        }

        let newFontSize;
        if (fontState === 0) {
          newFontSize = element.dataset.originalFontSize;
        } else {
          newFontSize = parseFloat(element.dataset.originalFontSize) * fontSizeFactors[fontState];
          newFontSize += "px";
        }

        element.style.fontSize = newFontSize;
      });

      fontState = (fontState + 1) % 3;

      localStorage.setItem('fontState', fontState);
    },
  });
});

function removerImagens() {
  const imagens = document.querySelectorAll('img');
  imagens.forEach(imagem => {
    imagem.style.display = 'none';
  });
}

document.getElementById('removerImagens').addEventListener('click', async (removeImages) => {
  removeImages.preventDefault(); 
  const [tab] = await chrome.tabs.query({ active: true, currentWindow: true }); 
  chrome.scripting.executeScript({
      target: { tabId: tab.id },
      function: removerImagens,
  });
});


function desativarAnimacoes() {
  const style = document.createElement('style');
  style.textContent = `
    * {
      animation: none !important;
      transition: none !important;
    }
  `;
  document.head.appendChild(style);
}

document.getElementById('desativar').addEventListener('click', async () => {
  const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
  chrome.scripting.executeScript({
    target: { tabId: tab.id },
    function: desativarAnimacoes,
  });
});

let estadoBotao = 0; 
const opcoesFonte = ['sans-serif', 'serif', "'Open-Dyslexic', sans-serif"];

function alterarFonte(estilo) {
  const css = `
    @import url('https://fonts.cdnfonts.com/css/open-dyslexic');
    * {
      font-family: ${estilo} !important;
    }
  `;
  const style = document.createElement('style');
  style.textContent = css;
  document.documentElement.appendChild(style);
}

document.getElementById('fonteBotao').addEventListener('click', async () => {
  estadoBotao = (estadoBotao + 1) % 3;
  document.getElementById('text5').textContent = ["Fonte Padrão", "Com Serifa", "Dislexico"][estadoBotao];
  chrome.tabs.query({ active: true, currentWindow: true }, function(tabs) {
    chrome.scripting.executeScript({
      target: { tabId: tabs[0].id },
      function: alterarFonte,
      args: [opcoesFonte[estadoBotao]]
    });
  });
});

function alternarMudoAbaAtual() {
  chrome.tabs.query({ currentWindow: true, active: true }, function (tabs) {
    if (tabs.length > 0) {
      var abaAtual = tabs[0];
      
      var mutedStatus = abaAtual.mutedInfo.muted;
      
      var novoStatusMudo = !mutedStatus;
      
      chrome.tabs.update(abaAtual.id, { muted: novoStatusMudo });
      
      var buttonText = document.getElementById('text7');
      buttonText.textContent = novoStatusMudo ? 'Com som' : 'Sem som';
      
      console.log("O status de mudo da aba atual foi alterado para:", novoStatusMudo);
    }
  });
}

document.addEventListener('DOMContentLoaded', function() {
  var silenciarButton = document.getElementById('silenciar');
  silenciarButton.addEventListener('click', alternarMudoAbaAtual);
});

document.getElementById('espacarLetras').addEventListener('click', async (space) => {
  space.preventDefault();
  const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });

  chrome.scripting.executeScript({
    target: { tabId: tab.id },
    function: () => {
      let letterSpacingState = parseInt(localStorage.getItem('letterSpacingState'), 10) || 0;

      const textElements = document.querySelectorAll('p, i, span, a, h1, h2, h3, h4, h5, h6, li, td, th');

      const letterSpacingValues = ['normal', '0.1em', '0.2em'];

      textElements.forEach(element => {
        if (!element.dataset.originalLetterSpacing) {
          element.dataset.originalLetterSpacing = window.getComputedStyle(element).letterSpacing;
        }

        let newLetterSpacing;
        if (letterSpacingState === 0) {
          newLetterSpacing = element.dataset.originalLetterSpacing;
        } else {
          newLetterSpacing = letterSpacingValues[letterSpacingState];
        }

        element.style.letterSpacing = newLetterSpacing;
      });

      letterSpacingState = (letterSpacingState + 1) % 3;

      localStorage.setItem('letterSpacingState', letterSpacingState);
    },
  });
});

document.getElementById('espacarLinhas').addEventListener('click', async (space) => {
  space.preventDefault();
  const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });

  chrome.scripting.executeScript({
    target: { tabId: tab.id },
    function: () => {
      let lineSpacingState = parseInt(localStorage.getItem('lineSpacingState'), 10) || 0;

      const textElements = document.querySelectorAll('p, i, span, a, h1, h2, h3, h4, h5, h6, li, td, th');

      const lineSpacingValues = ['normal', '1.5', '2'];

      textElements.forEach(element => {
        if (!element.dataset.originalLineHeight) {
          element.dataset.originalLineHeight = window.getComputedStyle(element).lineHeight;
        }

        let newLineHeight;
        if (lineSpacingState === 0) {
          newLineHeight = element.dataset.originalLineHeight;
        } else {
          newLineHeight = lineSpacingValues[lineSpacingState];
        }

        element.style.lineHeight = newLineHeight;
      });

      lineSpacingState = (lineSpacingState + 1) % 3;

      localStorage.setItem('lineSpacingState', lineSpacingState);
    },
  });
});

document.getElementById('checarImagemBotao').addEventListener('click', function() {
  window.location.href = 'nova_pagina.html'; 
});

document.addEventListener('DOMContentLoaded', () => {
  document.getElementById('botaoContraste').addEventListener('click', () => {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      chrome.scripting.executeScript({
        target: { tabId: tabs[0].id },
        function: alterarContraste
      });
    });
  });
});

function alterarContraste() {
  const body = document.body;
  const altoContraste = body.style.filter !== 'contrast(200%)';
  body.style.filter = altoContraste ? 'contrast(200%)' : 'contrast(100%)';
}

document.addEventListener('DOMContentLoaded', () => {
  document.getElementById('botaoRotacaoCores').addEventListener('click', () => {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      chrome.scripting.executeScript({
        target: { tabId: tabs[0].id },
        function: rotacionarCores
      });
    });
  });
});

function rotacionarCores() {
  const body = document.body;
  const rotacoes = [0, 60, 120, 240]; 
  let indiceAtual = parseInt(body.dataset.hueIndex || '0', 10);

  indiceAtual = (indiceAtual + 1) % rotacoes.length;

  body.style.filter = `hue-rotate(${rotacoes[indiceAtual]}deg)`;
  body.dataset.hueIndex = indiceAtual; 
}