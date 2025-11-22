const ploca = document.getElementById("ploca");
const ctx = ploca.getContext("2d");

const boja = document.getElementById("boja");
const velicina = document.getElementById("velicina");
const prikazVelicine = document.getElementById("prikazVelicine");
const dugmeCrtaj = document.getElementById("dugmeCrtaj");
const dugmeBrisi = document.getElementById("dugmeBrisi");
const dugmeOcisti = document.getElementById("dugmeOcisti");
const dugmeSpremi = document.getElementById("dugmeSpremi");
const dugmePDF = document.getElementById("dugmePDF");

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


dugmePDF.addEventListener("click", () => {
    if (window.jspdf && window.jspdf.jsPDF) {
        snimiKaoPDF();
    } else {

        const script = document.createElement("script");
        script.src = "https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js";
        script.onload = snimiKaoPDF;
        document.body.appendChild(script);
    }
});

function snimiKaoPDF() {
    const { jsPDF } = window.jspdf;
    const pdf = new jsPDF();
    

    const imgData = ploca.toDataURL("image/png");
    

    const canvasWidth = ploca.width;
    const canvasHeight = ploca.height;
    

    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = pdf.internal.pageSize.getHeight();
    

    const ratio = Math.min(pdfWidth / canvasWidth, pdfHeight / canvasHeight);
    const scaledWidth = canvasWidth * ratio;
    const scaledHeight = canvasHeight * ratio;
    

    const x = (pdfWidth - scaledWidth) / 2;
    const y = (pdfHeight - scaledHeight) / 2;
    

    pdf.addImage(imgData, 'PNG', x, y, scaledWidth, scaledHeight);
    

    pdf.save("moj_whiteboard.pdf");
}

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

const posaljiMailom = document.getElementById("posaljiMailom");
const mailModal = document.getElementById("mailModal");
const emailInput = document.getElementById("emailInput");
const mailPosalji = document.getElementById("mailPosalji");
const mailPonisti = document.getElementById("mailPonisti");


posaljiMailom.addEventListener('click', () => {
    mailModal.style.display = "block";
    emailInput.value = "";
    emailInput.focus();
});


mailPonisti.addEventListener('click', () => {
    mailModal.style.display = "none";
});


mailPosalji.addEventListener('click', () => {
    const email = emailInput.value.trim();
    
    if (!email) {
        alert("Molimo unesite email adresu!");
        return;
    }
    
    if (!validateEmail(email)) {
        alert("Molimo unesite validnu email adresu!");
        return;
    }
    
    // aaaaa
    const slikaData = ploca.toDataURL("image/png");
    

    if (window.jspdf && window.jspdf.jsPDF) {
        const { jsPDF } = window.jspdf;
        const pdf = new jsPDF();
        
        const canvasWidth = ploca.width;
        const canvasHeight = ploca.height;
        const pdfWidth = pdf.internal.pageSize.getWidth();
        const pdfHeight = pdf.internal.pageSize.getHeight();
        
        const ratio = Math.min(pdfWidth / canvasWidth, pdfHeight / canvasHeight);
        const scaledWidth = canvasWidth * ratio;
        const scaledHeight = canvasHeight * ratio;
        
        const x = (pdfWidth - scaledWidth) / 2;
        const y = (pdfHeight - scaledHeight) / 2;
        
        pdf.addImage(slikaData, 'PNG', x, y, scaledWidth, scaledHeight);
        
        // ovdje base64
        const pdfBase64 = pdf.output('datauristring');
        
  
        posaljiEmail(email, pdfBase64, slikaData);
    } else {

        posaljiEmail(email, null, slikaData);
    }
});


function validateEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
}


function posaljiEmail(email, pdfData, slikaData) {
    const subject = "Moj Whiteboard";
    const body = "Pozdrav!\n\nU prilogu Vam šaljem moj whiteboard crtež.\n\nLijep pozdrav!";
    

    let mailtoLink = `mailto:${email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    

    window.location.href = mailtoLink;
    
    mailModal.style.display = "none";
    alert("Email klijent je otvoren. Molimo pritisnite 'Send' da pošaljete email!");
}


window.addEventListener("click", (e) => {
    if (e.target === mailModal) {
        mailModal.style.display = "none";
    }
    if (e.target === modal) sakrijModal();
    if (e.target === clearModal) sakrijClearModal();
});