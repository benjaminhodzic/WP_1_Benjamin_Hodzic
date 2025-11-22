const ploca = document.getElementById("ploca");
const dodajBiljeskuBtn = document.getElementById("dodajBiljesku");
const dodajCitatBtn = document.getElementById("dodajCitat");
const dodajSlikuBtn = document.getElementById("dodajSliku");
const spremiPlocuBtn = document.getElementById("spremiPlocu");
const ucitajPlocuBtn = document.getElementById("ucitajPlocu");
const ocistiPlocuBtn = document.getElementById("ocistiPlocu");
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

// Event listeneri
dodajBiljeskuBtn.addEventListener('click', napraviBiljesku);
dodajCitatBtn.addEventListener('click', napraviCitat);
dodajSlikuBtn.addEventListener('click', napraviSliku);
spremiPlocuBtn.addEventListener('click', spremi);
ucitajPlocuBtn.addEventListener('click', ucitaj);
ocistiPlocuBtn.addEventListener('click', ocisti);

document.addEventListener('DOMContentLoaded', function() {
    
});