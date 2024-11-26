const estadosAumentar = ["Texto maior", "Texto grande", "Texto máximo"];
const estadosDiminuir = ["Texto menor", "Texto pequeno", "Texto mínimo"];
let estadoAtualAumentar = 0; 
let estadoAtualDiminuir = 0; 

const botaoAumentar = document.getElementById("aumentarFonte");
const botaoDiminuir = document.getElementById("diminuirFonte");
const textoAumentar = document.getElementById("text1");
const textoDiminuir = document.getElementById("text2");

botaoAumentar.addEventListener("click", () => {
    estadoAtualAumentar = (estadoAtualAumentar + 1) % estadosAumentar.length;
    textoAumentar.textContent = estadosAumentar[estadoAtualAumentar];
    estadoAtualDiminuir = 0;
    textoDiminuir.textContent = estadosDiminuir[estadoAtualDiminuir];
});

botaoDiminuir.addEventListener("click", () => {
    estadoAtualDiminuir = (estadoAtualDiminuir + 1) % estadosDiminuir.length;
    textoDiminuir.textContent = estadosDiminuir[estadoAtualDiminuir];
    estadoAtualAumentar = 0;
    textoAumentar.textContent = estadosAumentar[estadoAtualAumentar];
});