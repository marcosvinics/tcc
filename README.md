# Documentação

As extensões no navegador chrome podem ser adquiridas e instaladas oficialmente a partir da chrome Web store (loja oficial do navegador) ou através da opção carregar expandida (Load unpacked) através da chrome://extensions/ permitindo com que sejam carregadas diretamente em seu código fonte, depuradas e testadas antes de serem publicadas oficialmente.  

Toda extensão precisa obrigatóriamente do arquivo manifest.json em seu diretório raiz, é esse arquivo que lista as informações importantes da extensão, como por exemplo, estrutura, permissões e comportamento da mesma.

**Manifesto mínimo**

O exemplo a seguir mostra a estrura mínima exigida para criação de uma extensão: 

o documento completo pode ser conferido [aqui](https://developer.chrome.com/docs/extensions/reference/manifest?hl=pt-br#minimal-manifest).

```json
{
  "manifest_version": 3,
  "name": "Minimal Manifest",
  "version": "1.0.0",
  "description": "A basic example extension with only required keys",
  "icons": {
    "48": "images/icon-48.png",
    "128": "images/icon-128.png"
  },
}
```

**Chaves exigidas pela plataforma Extensions**

`"manifest_version"`

Um número inteiro que especifica a versão do formato do arquivo de manifesto que seu usos da extensão. O único valor aceito é `3`. versão atual do manifest aceito pelo google chrome.

`"name"` e `"version"`

Definem o nome da extensão e a versão atual, respectivamente. Essas informações são exibidas na Chrome Web Store e na interface de gerenciamento de extensões do Chrome.

**Chaves exigidas pela Chrome Web Store**

`"description"` 

Uma breve descrição da extensão, que aparece na Web Store.

**`"icons"`**

Define os ícones usados para representar a extensão em diferentes tamanhos.

**Opcionais**

`"permissions"` 

Lista as permissões necessárias para que a extensão funcione corretamente, como acesso à rede, leitura de abas, ou manipulação de cookies.

A extensão portanto foi configurada da seguinte maneira:

```json
{
    "name": "Acessibilidade",
    "description": "Extensão acessibilidade básica para web",
    "version": "2.0",
    "manifest_version": 3,
    "permissions":["activeTab", "scripting", "tabs"],
    "action": {
      "default_popup": "index.html"
    },
    "host_permissions": [
    "*://*/*"
    ]
}
```

**`activeTab`**:

- Permite que a extensão acesse a aba ativa (a aba em foco no momento) sem solicitar permissões adicionais para cada domínio específico.

**`scripting`**:

- Dá à extensão a capacidade de injetar scripts JavaScript ou folhas de estilo CSS em páginas da web.
- Utilizado junto com a API `chrome.scripting` no Manifest V3 para adicionar, remover ou executar scripts programaticamente em páginas específicas.
- Essa permissão é essencial para manipular dinamicamente o conteúdo de páginas.

**`tabs`**:

- Permite acessar informações sobre as abas abertas no navegador, como o título, URL e status (carregando ou completo).
- Necessário para manipular abas programaticamente (por exemplo, abrir, fechar ou navegar para uma URL específica).
- Permite monitorar eventos como a abertura ou o fechamento de uma aba, o que pode ser útil para criar funcionalidades personalizadas de gerenciamento de abas.

`"host_permissions"`  

define os sites ou domínios para os quais a extensão tem permissão de acesso. Especificamente, permite que a extensão interaja com páginas da web correspondentes aos padrões de URL fornecidos. Isso significa que a extensão está pedindo permissão para acessar **todos os sites**, em qualquer esquema (`http` ou `https`) e em qualquer domínio. 

`*://*/*`: O primeiro asterisco (`*`) corresponde a qualquer esquema (`http`, `https`), o segundo (`*`) corresponde a qualquer domínio (por exemplo, `google.com`, `exemplo.org`), e o último (`*`) corresponde a qualquer caminho.

**Html, CSS e funções** 

O código index.html que será a página inicial da extensão, foi escrito com semântica correta, igualmente o CSS, sem animações, fontes extravagantes para não prejudicar a percepção dos elementos. É composto a maior parte por botões interativos, cada uma com uma função diferente. O SVG serve como imagens dentro do botão, e tags Aria_label para rotular os elementos de botão no HTML.

no caso do primeiro botão o texto “Texto maior” pode ser muito vago, a aria-label portanto descreve como  `aria-label="Aumentar tamanho da fonte”`

saiba mais em: [https://developer.mozilla.org/pt-BR/docs/Web/Accessibility/ARIA/Attributes/aria-label](https://developer.mozilla.org/pt-BR/docs/Web/Accessibility/ARIA/Attributes/aria-label)

As funções de exibição que alteraram a exibição dos elementos da página, são agrupadas por exemplo: a opção aumentar e diminuir fonte, possuem três opções de tamanho, assim como os espaçamento entre linhas e as letras, remover imagem, remove todos img que possuir naquela página, pausar animação, pausa por completo os elementos interativos com animação, Alto contraste e rotação de cores são filtros CSS que alteram a forma como a página web é visualizada. O primeiro aumenta o contraste e o segundo rotaciona a paleta de cores em três tipos, o que pode ser benéfico para pessoas com daltonismo, ajudando-as a distinguir melhor as imagens com cores parecidas com a alteração de contraste.

A opção de alterar fonte possui as seguintes opções:

- Com Serifa: As serifas (as pequenas extensões ou traços nas extremidades das letras) ajudam a guiar o olho do leitor ao longo da linha de texto. Isso pode facilitar a transição de uma letra para outra e reduzir a fadiga visual, Isso pode ser especialmente útil em textos onde a clareza é essencial.
- Dislexico: Fonte OpenDyslexic é uma fonte open source que foi projetada especificamente para ajudar pessoas com dislexia a ler de forma mais fácil e confortável. As letras da OpenDyslexic possuem um peso maior na parte inferior, o que ajuda a estabilizar a linha de texto. Isso pode reduzir a sensação de que as letras estão "flutuando" ou mudando de posição, um sintoma comum entre pessoas com dislexia, As letras são projetadas com formas únicas e distintas, minimizando a confusão entre letras semelhantes (como 'b' e 'd' ou 'p' e 'q'). Isso facilita a identificação correta das letras. [https://opendyslexic.org/](https://opendyslexic.org/)

Assim como foi descrito, a tag ALT em HTML descreve sobre o que se trata aquela imagem, é bastante importante para leitores de tela, utilizados por cegos e deficientes visuais, portanto a opção “imagens sem ALT” faz uma analise de todas as imagens da página web, e retorna todas aquelas que não possuem a tag ALT no html, ou seja, que não possuem contexto sobre o que se trata aquela imagem. 

https://cloud.google.com/translate/docs?hl=pt-br

```jsx
function verificarImagensNaPagina() {
    const imagens = document.querySelectorAll('img');
    const resultados = {
        semAlt: []
    };

    imagens.forEach((imagem) => {
        if (!imagem.hasAttribute('alt') || imagem.getAttribute('alt').trim() === '') {
            resultados.semAlt.push({ src: imagem.src });
        }
    });

    return resultados;
}
```

Depois disso, as imagens retornadas passam por uma API de Inteligência artificial, chamada de Cloud vision, que analisa as imagens em questão e retorna labels, que servirá para tentar dar um contexto sobre a imagem.

[Cloud vision](https://cloud.google.com/vision/docs/request?hl=pt-br)

A API Cloud Vision, é desenvolvida pela Google, é uma API Rest que opera em HTTP POST, e que utiliza JSON para solicitações e respostas. 

A API Cloud Vision consiste em um único endpoint (`https://vision.googleapis.com/v1/images`) compatível com um método de solicitação HTTP (`annotate`):

```
POST https://vision.googleapis.com/v1/images:annotate
```

As solicitações são feitas da seguinte forma:

```json

{
  "requests": [
    {
      "image": {
        "source": {
          "imageUri": "https://........png"
        }
      },

      "features": [
        {
          "type": "LABEL_DETECTION",
          "maxResults": 10
        }
      ]
    }
  ]
}
```

Cada solicitação:

- precisa conter uma lista de `requests`.

Na lista de `requests`:

- `image` especifica o arquivo de imagem. Ele pode ser enviado como uma string codificada em base64, um local de arquivo do Cloud Storage ou um URL acessível publicamente. no caso as imagens retornam a url em questão, através de `source` e `imageUri` [https://cloud.google.com/vision/docs/request?hl=pt-br#providing_the_image](https://cloud.google.com/vision/docs/request?hl=pt-br#providing_the_image)
- `features` lista os tipos de anotação para execução na imagem. É possível especificar um ou vários tipos, além de `maxResults` a ser retornado para cada um.

Devolvendo os seguintes resultados, por exemplo:

```json
{
    "responses": [
        {
            "labelAnnotations": [
                {
                    "mid": "/m/025kyy",
                    "description": "Forehead",
                    "score": 0.9846564,
                    "topicality": 0.9846564
                },
                {
                    "mid": "/m/03q69",
                    "description": "Hair",
                    "score": 0.9832764,
                    "topicality": 0.9832764
                },
                {
                    "mid": "/m/0dzct",
                    "description": "Face",
                    "score": 0.9827796,
                    "topicality": 0.9827796
                },
                {
                    "mid": "/m/06z04",
                    "description": "Skin",
                    "score": 0.9751103,
                    "topicality": 0.9751103
                },
                {
                    "mid": "/m/01dvt1",
                    "description": "Joint",
                    "score": 0.9747934,
                    "topicality": 0.9747934
                },
                {
                    "mid": "/m/06pj2k",
                    "description": "Lip",
                    "score": 0.9700639,
                    "topicality": 0.9700639
                },
                {
                    "mid": "/m/0f9swq",
                    "description": "Chin",
                    "score": 0.9658856,
                    "topicality": 0.9658856
                },
                {
                    "mid": "/m/0ds4x",
                    "description": "Hairstyle",
                    "score": 0.9509009,
                    "topicality": 0.9509009
                },
                {
                    "mid": "/m/027n3_",
                    "description": "Eyebrow",
                    "score": 0.9460191,
                    "topicality": 0.9460191
                },
                {
                    "mid": "/m/0dzf4",
                    "description": "Arm",
                    "score": 0.9438123,
                    "topicality": 0.9438123
                }
            ]
        }
    ]
}
```

`responses` É um array que contém as respostas da API para cada imagem enviada para análise.

**`labelAnnotations`**: É um array de anotações de rótulo. Cada anotação representa um rótulo (ou "label") que a API identificou na imagem, descrevendo o conteúdo visual de forma textual.

**`mid`**: Este campo representa um identificador único para o rótulo, fornecido pelo Google Knowledge Graph. Ele é usado para identificar o conceito associado ao rótulo em uma base de conhecimento.

**`description`**: É a descrição textual do rótulo detectado. Neste exemplo, "Forehead" indica que a API detectou que a imagem contém algo relacionado à testa.

**`score`**: É a confiança do modelo na detecção do rótulo, representada como um valor entre 0 e 1. Neste exemplo, 0.9846564 significa que a API está 98,47% confiante de que o rótulo "Forehead" está presente na imagem.

**`topicality`**: Este campo também é um valor entre 0 e 1, que indica a relevância do rótulo em relação à imagem como um todo. Ele mede o quão "topical" ou relevante o rótulo é para o conteúdo geral da imagem. Neste caso, o valor é igual ao do `score`, indicando alta relevância.

Juntamente com outra funcionalidade do cloud vision, chamado de OCR (Reconhecimento óptico de caracteres), `TEXT_DETECTION` detecta e extrai texto de qualquer imagem. Por exemplo, uma foto pode ter uma placa de rua ou de trânsito. O JSON inclui toda a string extraída daquela imagem em formato de texto.

Portanto na parte do arquivo `api.js` ficaria da seguinte forma:

```jsx
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
```

A resposta obtida da API, ou seja as labels são em inglês, portanto antes de enviar como resultado final, o texto será passado por outra API do google para tradução. Exemplo retornando as labels traduzidas:

https://cloud.google.com/translate/?hl=pt-br&authuser=2#pricing

```json
    // Solicitação - Request
     requests = {
        q: cat, blue, car,
        source: "en",
        target: "pt",
        format: 'text'
    };
    
    //Resultados 
    {
  "data": {
    "translations": [
      {
        "translatedText": "gato, azul, carro"
      },
  }
}
```
