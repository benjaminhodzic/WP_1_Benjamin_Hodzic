// Inicijalizacija kada se stranica učita
document.addEventListener('DOMContentLoaded', function() {
    console.log("Stranica je učítana - inicijalizacija Kanban Boarda");
    
    // Inicijaliziraj prazne kolone
    initColumns();
    
    // Postavi event listenere
    setupEventListeners();
});

function initColumns() {
    const columns = document.querySelectorAll('.tasks-container');
    columns.forEach(column => {
        if (column.children.length === 0) {
            column.innerHTML = '<div class="empty-state">Nema zadataka</div>';
        }
    });
    azurirajBrojace();
}

function setupEventListeners() {
    // Dugmad
    document.getElementById("dodajZadatakBtn").addEventListener("click", pokaziTaskModal);
    document.getElementById("ocistiPlocuBtn").addEventListener("click", pokaziClearModal);
    document.getElementById("posaljiMailom").addEventListener("click", pokaziMailModal);
    document.getElementById("snimiPlocuBtn").addEventListener("click", snimiSliku);
    document.getElementById("snimiPDFBtn").addEventListener("click", snimiKanbanPDF);

    // Task modal
    document.getElementById("modalDodaj").addEventListener("click", dodajZadatak);
    document.getElementById("modalPonisti").addEventListener("click", sakrijTaskModal);

    // Clear modal
    document.getElementById("clearDa").addEventListener("click", ocistiPlocu);
    document.getElementById("clearNe").addEventListener("click", sakrijClearModal);

    // Mail modal
    document.getElementById("mailPosalji").addEventListener("click", posaljiEmailHandler);
    document.getElementById("mailPonisti").addEventListener("click", sakrijMailModal);

    // Drag and drop
    setupDragAndDrop();
}

// MODAL FUNKCIJE
function pokaziTaskModal() {
    console.log("Prikaz task modala");
    document.getElementById("taskModal").style.display = "block";
    document.getElementById("taskInput").value = "";
    document.getElementById("taskInput").focus();
}

function sakrijTaskModal() {
    document.getElementById("taskModal").style.display = "none";
}

function pokaziClearModal() {
    document.getElementById("clearModal").style.display = "block";
}

function sakrijClearModal() {
    document.getElementById("clearModal").style.display = "none";
}

function pokaziMailModal() {
    document.getElementById("mailModal").style.display = "block";
    document.getElementById("emailInput").value = "";
    document.getElementById("emailInput").focus();
}

function sakrijMailModal() {
    document.getElementById("mailModal").style.display = "none";
}

// ZADACI
function dodajZadatak() {
    const tekst = document.getElementById("taskInput").value.trim();
    if (tekst === "") {
        alert("Molimo unesite tekst zadatka!");
        return;
    }

    const zadatak = kreirajZadatak(tekst);
    const todoContainer = document.querySelector('[data-status="todo"] .tasks-container');
    
    // Ukloni empty state ako postoji
    const emptyState = todoContainer.querySelector('.empty-state');
    if (emptyState) {
        emptyState.remove();
    }
    
    todoContainer.appendChild(zadatak);
    azurirajBrojace();
    sakrijTaskModal();
}

function kreirajZadatak(tekst) {
    const zadatak = document.createElement("div");
    zadatak.classList.add("task-item");
    zadatak.textContent = tekst;
    zadatak.draggable = true;

    zadatak.addEventListener("dragstart", function(e) {
        setTimeout(() => {
            this.style.display = "none";
        }, 0);
    });

    zadatak.addEventListener("dragend", function() {
        this.style.display = "block";
        azurirajBrojace();
    });

    return zadatak;
}

function ocistiPlocu() {
    document.querySelectorAll(".tasks-container").forEach(container => {
        container.innerHTML = '<div class="empty-state">Nema zadataka</div>';
    });
    azurirajBrojace();
    sakrijClearModal();
}

// DRAG AND DROP
function setupDragAndDrop() {
    document.querySelectorAll(".tasks-container").forEach(container => {
        container.addEventListener("dragover", function(e) {
            e.preventDefault();
        });

        container.addEventListener("drop", function(e) {
            e.preventDefault();
            const dragging = document.querySelector(".task-item[style*='display: none']");
            if (dragging && !this.contains(dragging)) {
                // Ukloni empty state ako postoji
                const emptyState = this.querySelector('.empty-state');
                if (emptyState) {
                    emptyState.remove();
                }
                this.appendChild(dragging);
                azurirajBrojace();
            }
        });
    });
}

// BROJAČI
function azurirajBrojace() {
    document.querySelectorAll('.column-card').forEach(column => {
        const container = column.querySelector('.tasks-container');
        const taskItems = container.querySelectorAll('.task-item');
        const count = taskItems.length;
        column.querySelector('.task-count').textContent = count;
    });
}

// SNIMANJE
function snimiSliku() {
    if (!window.html2canvas) {
        const script = document.createElement("script");
        script.src = "https://cdnjs.cloudflare.com/ajax/libs/html2canvas/1.4.1/html2canvas.min.js";
        script.onload = function() {
            captureAndSaveImage();
        };
        document.body.appendChild(script);
    } else {
        captureAndSaveImage();
    }
}

function captureAndSaveImage() {
    html2canvas(document.querySelector('.board-area')).then(canvas => {
        const link = document.createElement("a");
        link.download = "kanban_board.png";
        link.href = canvas.toDataURL();
        link.click();
    });
}

function snimiKanbanPDF() {
    if (window.jspdf && window.jspdf.jsPDF && window.html2canvas) {
        createPDF();
    } else {
        alert("Učitavanje biblioteka...");
        const script1 = document.createElement("script");
        script1.src = "https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js";
        const script2 = document.createElement("script");
        script2.src = "https://cdnjs.cloudflare.com/ajax/libs/html2canvas/1.4.1/html2canvas.min.js";
        script2.onload = createPDF;
        document.body.appendChild(script1);
        document.body.appendChild(script2);
    }
}

function createPDF() {
    html2canvas(document.querySelector('.board-area')).then(canvas => {
        const { jsPDF } = window.jspdf;
        const pdf = new jsPDF();
        const imgData = canvas.toDataURL('image/png');
        
        const pdfWidth = pdf.internal.pageSize.getWidth();
        const pdfHeight = pdf.internal.pageSize.getHeight();
        
        const ratio = canvas.height / canvas.width;
        const imgWidth = pdfWidth;
        const imgHeight = pdfWidth * ratio;
        
        pdf.addImage(imgData, 'PNG', 0, 0, imgWidth, imgHeight);
        pdf.save("kanban_board.pdf");
        alert("PDF je uspješno snimljen!");
    });
}

// EMAIL
function posaljiEmailHandler() {
    const email = document.getElementById("emailInput").value.trim();
    
    if (!email) {
        alert("Molimo unesite email adresu!");
        return;
    }
    
    if (!validateEmail(email)) {
        alert("Molimo unesite validnu email adresu!");
        return;
    }
    
    const subject = "Moj Kanban Board";
    const body = "Pozdrav!\\n\\nU prilogu Vam šaljem moj Kanban Board.\\n\\nLijep pozdrav!";
    
    const mailtoLink = `mailto:${email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    window.location.href = mailtoLink;
    
    sakrijMailModal();
    alert("Email klijent je otvoren!");
}

function validateEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
}

// ZATVARANJE MODALA
window.addEventListener("click", function(e) {
    if (e.target === document.getElementById("taskModal")) sakrijTaskModal();
    if (e.target === document.getElementById("clearModal")) sakrijClearModal();
    if (e.target === document.getElementById("mailModal")) sakrijMailModal();
});