const modal = document.getElementById("taskModal");
const taskInput = document.getElementById("taskInput");
const clearModal = document.getElementById("clearModal");

function pokaziModal() {
    modal.style.display = "block";
    taskInput.value = "";
    taskInput.focus();
}

function sakrijModal() {
    modal.style.display = "none";
}

function pokaziClearModal() {
    clearModal.style.display = "block";
}

function sakrijClearModal() {
    clearModal.style.display = "none";
}

document.getElementById("dodajZadatakBtn").addEventListener("click", pokaziModal);

document.getElementById("modalDodaj").addEventListener("click", () => {
    let tekst = taskInput.value.trim();
    if (tekst === "") return;

    const zadatak = kreirajZadatak(tekst);
    document.querySelector('[data-status="todo"] .tasks-container').appendChild(zadatak);
    
    azurirajBrojace();
    sakrijModal();
});

document.getElementById("modalPonisti").addEventListener("click", sakrijModal);

function kreirajZadatak(tekst) {
    const zadatak = document.createElement("div");
    zadatak.classList.add("task-item");
    zadatak.textContent = tekst;
    zadatak.draggable = true;

    zadatak.addEventListener("dragstart", (e) => {
        setTimeout(() => {
            zadatak.style.display = "none";
        }, 0);
        e.dataTransfer.setData("text/plain", tekst);
    });

    zadatak.addEventListener("dragend", () => {
        zadatak.style.display = "block";
        azurirajBrojace();
    });

    return zadatak;
}

document.querySelectorAll(".tasks-container").forEach(container => {
    container.addEventListener("dragover", (e) => {
        e.preventDefault();
    });

    container.addEventListener("drop", (e) => {
        e.preventDefault();
        
        const dragging = document.querySelector(".task-item[style*='display: none']");
        if (dragging && !container.contains(dragging)) {
            container.appendChild(dragging);
        }
    });
});

document.getElementById("ocistiPlocuBtn").addEventListener("click", pokaziClearModal);

document.getElementById("clearDa").addEventListener("click", () => {
    document.querySelectorAll(".tasks-container").forEach(container => {
        // dodaj neš kasnije
    });
    azurirajBrojace();
    sakrijClearModal();
});

document.getElementById("clearNe").addEventListener("click", sakrijClearModal);

document.getElementById("snimiPlocuBtn").addEventListener("click", () => {
    if (!window.html2canvas) {
        const script = document.createElement("script");
        script.src = "https://cdnjs.cloudflare.com/ajax/libs/html2canvas/1.4.1/html2canvas.min.js";
        script.onload = snimiSliku;
        document.body.appendChild(script);
    } else {
        snimiSliku();
    }
});

function snimiSliku() {
    html2canvas(document.querySelector('.board-area')).then(canvas => {
        const link = document.createElement("a");
        link.download = "kanban_board_" + new Date().toISOString().slice(0,10) + ".png";
        link.href = canvas.toDataURL();
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    });
}

function azurirajBrojace() {
    document.querySelectorAll('.column-card').forEach(column => {
        const count = column.querySelector('.tasks-container').children.length;
        const emptyStates = column.querySelectorAll('.empty-state');
        const actualCount = count - emptyStates.length;
        
        column.querySelector('.task-count').textContent = actualCount;
        
        if (actualCount === 0 && emptyStates.length === 0) {
            // dodaj kasnije
        } else if (actualCount > 0) {
            const emptyState = column.querySelector('.empty-state');
            if (emptyState) emptyState.remove();
        }
    });
}

window.addEventListener("click", (e) => {
    if (e.target === modal) sakrijModal();
    if (e.target === clearModal) sakrijClearModal();
});

document.addEventListener('DOMContentLoaded', () => {
    azurirajBrojace();
});