const ploca = document.getElementById("ploca");
const ctx = ploca.getContext("2d");

const boja = document.getElementById("boja");
const velicina = document.getElementById("velicina");
const prikazVelicine = document.getElementById("prikazVelicine");
const dugmeCrtaj = document.getElementById("dugmeCrtaj");
const dugmeBrisi = document.getElementById("dugmeBrisi");
const dugmeOcisti = document.getElementById("dugmeOcisti");
const dugmeSpremi = document.getElementById("dugmeSpremi");

let crtanje = false;
let trenutnaBoja = boja.value;
let trenutnaVelicina = parseInt(velicina.value);
let brisanje = false;

function postaviVelicinu() {
    const kutija = document.querySelector('.kutija-za-plocu');
    ploca.width = kutija.clientWidth;
    ploca.height = kutija.clientHeight;
    ctx.fillStyle = "white";
    ctx.fillRect(0, 0, ploca.width, ploca.height);
}

postaviVelicinu();
window.addEventListener('resize', postaviVelicinu);

prikazVelicine.textContent = `${trenutnaVelicina}px`;

function pocniCrtati(e) {
    crtanje = true;
    ctx.beginPath();
    const poz = uzmiPoziciju(e);
    ctx.moveTo(poz.x, poz.y);
    e.preventDefault();
}

function zavrsiCrtanje() {
    crtanje = false;
    ctx.beginPath();
}

function crtaj(e) {
    if (!crtanje) return;
    e.preventDefault();
    
    ctx.lineWidth = trenutnaVelicina;
    ctx.lineCap = 'round';
    ctx.strokeStyle = brisanje ? "#FFFFFF" : trenutnaBoja;
    
    const poz = uzmiPoziciju(e);
    ctx.lineTo(poz.x, poz.y);
    ctx.stroke();
}

function uzmiPoziciju(e) {
    const rect = ploca.getBoundingClientRect();
    let x, y;
    
    if (e.type.includes('mouse')) {
        x = e.clientX - rect.left;
        y = e.clientY - rect.top;
    } else {
        x = e.touches[0].clientX - rect.left;
        y = e.touches[0].clientY - rect.top;
    }
    
    return { x: x, y: y };
}

ploca.addEventListener("mousedown", pocniCrtati);
ploca.addEventListener("mouseup", zavrsiCrtanje);
ploca.addEventListener("mouseout", zavrsiCrtanje);
ploca.addEventListener("mousemove", crtaj);

ploca.addEventListener("touchstart", pocniCrtati);
ploca.addEventListener("touchend", zavrsiCrtanje);
ploca.addEventListener("touchcancel", zavrsiCrtanje);
ploca.addEventListener("touchmove", crtaj);

boja.addEventListener("input", () => {
    trenutnaBoja = boja.value;
    brisanje = false;
    azurirajDugmad();
});

velicina.addEventListener("input", () => {
    trenutnaVelicina = parseInt(velicina.value);
    prikazVelicine.textContent = `${trenutnaVelicina}px`;
});

dugmeCrtaj.addEventListener("click", () => {
    brisanje = false;
    azurirajDugmad();
});

dugmeBrisi.addEventListener("click", () => {
    brisanje = !brisanje;
    azurirajDugmad();
});

dugmeOcisti.addEventListener("click", () => {
    if (confirm("Stvarno želiš obrisati cijelu ploču?")) {
        ctx.fillStyle = "white";
        ctx.fillRect(0, 0, ploca.width, ploca.height);
    }
});

dugmeSpremi.addEventListener("click", () => {
    const slika = ploca.toDataURL("image/png");
    const link = document.createElement("a");
    link.href = slika;
    link.download = "moja_slika.png";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
});

function azurirajDugmad() {
    if (brisanje) {
        dugmeBrisi.classList.add('dugme-aktivno');
        dugmeCrtaj.classList.remove('dugme-aktivno');
        dugmeBrisi.textContent = "Nastavi crtati";
    } else {
        dugmeBrisi.classList.remove('dugme-aktivno');
        dugmeCrtaj.classList.add('dugme-aktivno');
        dugmeBrisi.textContent = "Briši";
    }
}

azurirajDugmad();

ctx.fillStyle = "white";
ctx.fillRect(0, 0, ploca.width, ploca.height);