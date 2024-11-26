function verificarImagensNaPagina() {
    const imagens = document.querySelectorAll('img');
    const resultados = {
        semAlt: []
    };

    imagens.forEach((img) => {
        if (!img.hasAttribute('alt') || img.getAttribute('alt').trim() === '') {
            resultados.semAlt.push({ src: img.src });
        }
    });

    return resultados;
}

async function obterDetalhesDaImagem(imagemSrc) {
    const apiKey = 'AIzaSyB0MooxgUm4gVyfvNpU8AtP49kem0mkhuk'; 
    const url = `https://vision.googleapis.com/v1/images:annotate?key=${apiKey}`;

    const corpoRequisicao = {
        requests: [
            {
                image: {
                    source: {
                        imageUri: imagemSrc
                    }
                },
                features: [
                    {
                        type: "LABEL_DETECTION",
                        maxResults: 5
                    },
                    {
                        type: "TEXT_DETECTION" 
                    }
                ]
            }
        ]
    };

    try {
        const resposta = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(corpoRequisicao)
        });

        const dados = await resposta.json();

        if (!resposta.ok || !dados.responses[0]) {
            throw new Error('Erro ao obter dados da API: ' + JSON.stringify(dados));
        }

        const labels = dados.responses[0].labelAnnotations || [];
        const texto = dados.responses[0].textAnnotations || [];

        return { labels, texto };
    } catch (erro) {
        console.error('Erro:', erro);
        return { labels: [], texto: [] };
    }
}

async function exibirResultados(resultados) {
    const containerSemAlt = document.getElementById('imagensSemAlt');

    containerSemAlt.innerHTML = '';

    for (const img of resultados.semAlt) {
        const elementoImg = document.createElement('img');
        elementoImg.src = img.src;
        const textoSemAlt = document.createElement('p');
        textoSemAlt.textContent = 'ALT ausente';

        containerSemAlt.appendChild(elementoImg);
        containerSemAlt.appendChild(textoSemAlt);

        const { labels, texto } = await obterDetalhesDaImagem(img.src);

        const labelsTraduzidas = await Promise.all(labels.map(async label => {
            return await traduzirTexto(label.description, 'en', 'pt');
        }));

        const textoLabels = document.createElement('p');
        textoLabels.textContent = `Labels: ${labelsTraduzidas.join(', ')}`;
        containerSemAlt.appendChild(textoLabels);

        if (texto.length > 0) {
            const textoExtraido = document.createElement('p');
            textoExtraido.textContent = `Texto Extraído: ${texto[0].description}`;
            containerSemAlt.appendChild(textoExtraido);
        } else {
            const textoNaoEncontrado = document.createElement('p');
            textoNaoEncontrado.textContent = 'Nenhum texto encontrado.';
            containerSemAlt.appendChild(textoNaoEncontrado);
        }
    }

    if (containerSemAlt.children.length === 0) {
        containerSemAlt.textContent = 'Nenhuma imagem sem ALT encontrada.';
    }
}

async function verificarImagens() {
    const [aba] = await chrome.tabs.query({ active: true, currentWindow: true });

    chrome.scripting.executeScript(
        {
            target: { tabId: aba.id },
            function: verificarImagensNaPagina,
        },
        (resultados) => {
            if (resultados && resultados[0] && resultados[0].result) {
                exibirResultados(resultados[0].result);
            }
        }
    );
}

document.addEventListener('DOMContentLoaded', () => {
    document.getElementById('botaoVerificarImagens').addEventListener('click', verificarImagens);
});

async function traduzirTexto(texto) {
    const apiKey = 'AIzaSyB0MooxgUm4gVyfvNpU8AtP49kem0mkhuk'; 
    const url = `https://translation.googleapis.com/language/translate/v2?key=${apiKey}`;

    const corpoRequisicao = {
        q: texto,
        source: "en",
        target: "pt",
        format: 'text'
    };

    try {
        const resposta = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(corpoRequisicao)
        });

        const dados = await resposta.json();

        if (!resposta.ok || !dados.data || !dados.data.translations) {
            throw new Error('Erro ao traduzir texto: ' + JSON.stringify(dados));
        }

        return dados.data.translations[0].translatedText;
    } catch (erro) {
        console.error('Erro na tradução:', erro);
        return texto;
    }
}