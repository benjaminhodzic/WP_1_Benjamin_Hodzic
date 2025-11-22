const ploca = document.getElementById("ploca");
const dodajBiljeskuBtn = document.getElementById("dodajBiljesku");
const dodajCitatBtn = document.getElementById("dodajCitat");
const dodajSlikuBtn = document.getElementById("dodajSliku");
const spremiPlocuBtn = document.getElementById("spremiPlocu");
const ucitajPlocuBtn = document.getElementById("ucitajPlocu");
const ocistiPlocuBtn = document.getElementById("ocistiPlocu");
<<<<<<< HEAD
const snimiPDFBtn = document.getElementById("snimiPDF");
=======
>>>>>>> 7621e81abda39dfc54b3cae8add1c7df72476f74
const fileInput = document.getElementById("fileInput");

let trenutniElement = null;
let offsetX = 0, offsetY = 0;

function napraviBiljesku() {
    const x = Math.random() * 500;
    const y = Math.random() * 400;
    
    const biljeska = document.createElement("div");
    biljeska.className = "biljeska";
    biljeska.style.left = x + "px";
    biljeska.style.top = y + "px";
    biljeska.contentEditable = true;
    biljeska.textContent = "Klikni i piši...";
    
    dodajXdugme(biljeska);
    ploca.appendChild(biljeska);
    
    biljeska.addEventListener('mousedown', startDrag);
}

function napraviCitat() {
    const x = Math.random() * 500;
    const y = Math.random() * 400;
    
    const citatDiv = document.createElement("div");
    citatDiv.className = "citat";
    citatDiv.style.left = x + "px";
    citatDiv.style.top = y + "px";
    citatDiv.contentEditable = true;
    citatDiv.textContent = "Upiši citat...";
    
    dodajXdugme(citatDiv);
    ploca.appendChild(citatDiv);
    
    citatDiv.addEventListener('mousedown', startDrag);
}

function napraviSliku() {
    fileInput.click();
}

fileInput.addEventListener('change', function(e) {
    const file = e.target.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = function(event) {
            const x = Math.random() * 500;
            const y = Math.random() * 400;
            
            const slikaDiv = document.createElement("div");
            slikaDiv.className = "slika";
            slikaDiv.style.left = x + "px";
            slikaDiv.style.top = y + "px";
            
            const img = document.createElement("img");
            img.src = event.target.result;
            slikaDiv.appendChild(img);
            
            dodajXdugme(slikaDiv);
            ploca.appendChild(slikaDiv);
            
            slikaDiv.addEventListener('mousedown', startDrag);
        };
        reader.readAsDataURL(file);
    }
});

function dodajXdugme(element) {
    const xBtn = document.createElement("button");
    xBtn.className = "x";
    xBtn.textContent = "×";
    xBtn.onclick = function(e) {
        e.stopPropagation();
        element.remove();
    };
    element.appendChild(xBtn);
}

function startDrag(e) {
    if (e.target.className === 'x') return;
    
    trenutniElement = this;
    const rect = trenutniElement.getBoundingClientRect();
    offsetX = e.clientX - rect.left;
    offsetY = e.clientY - rect.top;
    
    document.addEventListener('mousemove', drag);
    document.addEventListener('mouseup', stopDrag);
}

function drag(e) {
    if (!trenutniElement) return;
    
    const plocaRect = ploca.getBoundingClientRect();
    let x = e.clientX - plocaRect.left - offsetX;
    let y = e.clientY - plocaRect.top - offsetY;
    
    x = Math.max(0, Math.min(x, plocaRect.width - trenutniElement.offsetWidth));
    y = Math.max(0, Math.min(y, plocaRect.height - trenutniElement.offsetHeight));
    
    trenutniElement.style.left = x + "px";
    trenutniElement.style.top = y + "px";
}

function stopDrag() {
    trenutniElement = null;
    document.removeEventListener('mousemove', drag);
    document.removeEventListener('mouseup', stopDrag);
}

function spremi() {
    const elementi = [];
    document.querySelectorAll('.biljeska, .citat, .slika').forEach(el => {
        const tip = el.className;
        const left = el.style.left;
        const top = el.style.top;
        const content = el.textContent.replace('×', '');
        
        let podaci = {tip, left, top, content};
        
        if (tip === 'slika') {
            const img = el.querySelector('img');
            podaci.src = img.src;
        }
        
        elementi.push(podaci);
    });
    
    localStorage.setItem('visionboard', JSON.stringify(elementi));
    alert("Ploča spremljena!");
}

function ucitaj() {
    const sacuvano = localStorage.getItem('visionboard');
    if (sacuvano) {
        ploca.innerHTML = '';
        JSON.parse(sacuvano).forEach(item => {
            let element;
            
            if (item.tip === 'biljeska') {
                element = document.createElement("div");
                element.className = "biljeska";
                element.contentEditable = true;
                element.textContent = item.content;
            } else if (item.tip === 'citat') {
                element = document.createElement("div");
                element.className = "citat";
                element.contentEditable = true;
                element.textContent = item.content;
            } else if (item.tip === 'slika') {
                element = document.createElement("div");
                element.className = "slika";
                const img = document.createElement("img");
                img.src = item.src;
                element.appendChild(img);
            }
            
            element.style.left = item.left;
            element.style.top = item.top;
            dodajXdugme(element);
            ploca.appendChild(element);
            element.addEventListener('mousedown', startDrag);
        });
        alert("Ploča učitana!");
    } else {
        alert("Nema spremljene ploče!");
    }
}

function ocisti() {
    if (confirm("Obrisati cijelu ploču?")) {
        ploca.innerHTML = '';
        localStorage.removeItem('visionboard');
    }
}

<<<<<<< HEAD
// NOVA FUNKCIONALNOST: Snimi kao PDF
snimiPDFBtn.addEventListener('click', () => {
    if (window.jspdf && window.jspdf.jsPDF && window.html2canvas) {
        snimiVisionBoardPDF();
    } else {
        alert("Učitavanje PDF biblioteke...");
        // Učitaj potrebne biblioteke ako nisu već učitane
        const loadScript = (src) => {
            return new Promise((resolve, reject) => {
                const script = document.createElement('script');
                script.src = src;
                script.onload = resolve;
                script.onerror = reject;
                document.body.appendChild(script);
            });
        };

        Promise.all([
            loadScript('https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js'),
            loadScript('https://cdnjs.cloudflare.com/ajax/libs/html2canvas/1.4.1/html2canvas.min.js')
        ]).then(() => {
            snimiVisionBoardPDF();
        }).catch(() => {
            alert("Greška pri učitavanju PDF biblioteke!");
        });
    }
});

function snimiVisionBoardPDF() {
    // Koristi html2canvas da preuzme cijelu ploču kao sliku
    html2canvas(ploca, {
        scale: 2, // Veća rezolucija za bolji kvalitet
        useCORS: true,
        allowTaint: true,
        backgroundColor: null
    }).then(canvas => {
        const { jsPDF } = window.jspdf;
        const pdf = new jsPDF();
        
        const imgData = canvas.toDataURL('image/png');
        
        // Dimenzije canvas slike
        const imgWidth = canvas.width;
        const imgHeight = canvas.height;
        
        // Dimenzije PDF-a (A4 format)
        const pdfWidth = pdf.internal.pageSize.getWidth();
        const pdfHeight = pdf.internal.pageSize.getHeight();
        
        // Izračunaj proporcije za skaliranje
        const ratio = Math.min(pdfWidth / imgWidth, pdfHeight / imgHeight);
        const scaledWidth = imgWidth * ratio;
        const scaledHeight = imgHeight * ratio;
        
        // Centriraj sliku na PDF-u
        const x = (pdfWidth - scaledWidth) / 2;
        const y = (pdfHeight - scaledHeight) / 2;
        
        // Dodaj sliku u PDF
        pdf.addImage(imgData, 'PNG', x, y, scaledWidth, scaledHeight);
        
        // Dodaj datum u PDF
        const datum = new Date().toLocaleDateString('bs-BA');
        pdf.setFontSize(10);
        pdf.text(`Vision Board - ${datum}`, 10, 10);
        
        // Snimi PDF
        pdf.save("vision_board.pdf");
        
        alert("Vision Board je uspješno snimljen kao PDF!");
    }).catch(error => {
        console.error('Greška pri kreiranju PDF-a:', error);
        alert("Došlo je do greške pri snimanju PDF-a!");
    });
}

=======
>>>>>>> 7621e81abda39dfc54b3cae8add1c7df72476f74
// Event listeneri
dodajBiljeskuBtn.addEventListener('click', napraviBiljesku);
dodajCitatBtn.addEventListener('click', napraviCitat);
dodajSlikuBtn.addEventListener('click', napraviSliku);
spremiPlocuBtn.addEventListener('click', spremi);
ucitajPlocuBtn.addEventListener('click', ucitaj);
ocistiPlocuBtn.addEventListener('click', ocisti);

document.addEventListener('DOMContentLoaded', function() {
    
<<<<<<< HEAD
});

const posaljiMailom = document.getElementById("posaljiMailom");
const mailModal = document.getElementById("mailModal");
const emailInput = document.getElementById("emailInput");
const mailPosalji = document.getElementById("mailPosalji");
const mailPonisti = document.getElementById("mailPonisti");

// Funkcija za prikaz mail modala
posaljiMailom.addEventListener('click', () => {
    mailModal.style.display = "block";
    emailInput.value = "";
    emailInput.focus();
});

// Funkcija za poništavanje maila
mailPonisti.addEventListener('click', () => {
    mailModal.style.display = "none";
});

// Funkcija za slanje maila
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
    
    // Preuzmi Vision Board kao sliku
    html2canvas(ploca, {
        scale: 2,
        useCORS: true,
        allowTaint: true,
        backgroundColor: null
    }).then(canvas => {
        const slikaData = canvas.toDataURL('image/png');
        
        // Kreiraj PDF
        if (window.jspdf && window.jspdf.jsPDF) {
            const { jsPDF } = window.jspdf;
            const pdf = new jsPDF();
            
            const imgWidth = canvas.width;
            const imgHeight = canvas.height;
            const pdfWidth = pdf.internal.pageSize.getWidth();
            const pdfHeight = pdf.internal.pageSize.getHeight();
            
            const ratio = Math.min(pdfWidth / imgWidth, pdfHeight / imgHeight);
            const scaledWidth = imgWidth * ratio;
            const scaledHeight = imgHeight * ratio;
            
            const x = (pdfWidth - scaledWidth) / 2;
            const y = (pdfHeight - scaledHeight) / 2;
            
            pdf.addImage(slikaData, 'PNG', x, y, scaledWidth, scaledHeight);
            
            const datum = new Date().toLocaleDateString('bs-BA');
            pdf.setFontSize(10);
            pdf.text(`Vision Board - ${datum}`, 10, 10);
            
            // Konvertuj PDF u base64
            const pdfBase64 = pdf.output('datauristring');
            
            // Pošalji mail
            posaljiEmail(email, pdfBase64, slikaData, "Vision Board");
        } else {
            // Ako PDF nije dostupan, pošalji samo sliku
            posaljiEmail(email, null, slikaData, "Vision Board");
        }
    }).catch(error => {
        console.error('Greška pri preuzimanju slike:', error);
        alert("Došlo je do greške pri pripremi slike za slanje!");
    });
});

// Funkcija za validaciju emaila
function validateEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
}

// Funkcija za slanje emaila
function posaljiEmail(email, pdfData, slikaData, tip) {
    const subject = `Moj ${tip}`;
    const body = `Pozdrav!\n\nU prilogu Vam šaljem moj ${tip.toLowerCase()}.\n\nLijep pozdrav!`;
    
    // Kreiraj mailto link
    let mailtoLink = `mailto:${email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    
    // Otvori email klijent
    window.location.href = mailtoLink;
    
    mailModal.style.display = "none";
    alert("Email klijent je otvoren. Molimo pritisnite 'Send' da pošaljete email!");
}

// Zatvori modal kada se klikne izvan
window.addEventListener("click", (e) => {
    if (e.target === mailModal) {
        mailModal.style.display = "none";
    }
=======
>>>>>>> 7621e81abda39dfc54b3cae8add1c7df72476f74
});