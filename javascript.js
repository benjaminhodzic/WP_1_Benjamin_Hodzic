// Kontakt forma funkcionalnost
document.addEventListener('DOMContentLoaded', function() {
    const contactForm = document.getElementById('contactForm');
    
    if (contactForm) {
        contactForm.addEventListener('submit', submitForm);
        
        // Dodaj test dugme za development (može se ukloniti u produkciji)
        addTestButton();
    }
});

function submitForm(event) {
    event.preventDefault();
    
    // Preuzmi podatke iz forme
    const name = document.getElementById('name').value;
    const email = document.getElementById('email').value;
    const subject = document.getElementById('subject').value;
    const message = document.getElementById('message').value;
    
    // Validacija
    if (!name || !email || !subject || !message) {
        alert('Molimo popunite sva obavezna polja!');
        return false;
    }
    
    if (!validateEmail(email)) {
        alert('Molimo unesite validnu email adresu!');
        return false;
    }
    
    // Kreiraj mailto link
    const mailtoLink = createMailtoLink(name, email, subject, message);
    
    // Otvori email klijent
    window.location.href = mailtoLink;
    
    // Resetuj formu nakon slanja
    setTimeout(() => {
        document.getElementById('contactForm').reset();
        alert('Hvala Vam na poruci! Email klijent je otvoren. Molimo pritisnite "Send" da pošaljete poruku.');
    }, 1000);
    
    return false;
}

function createMailtoLink(name, email, subject, message) {
    const toEmail = 'info@ipi-akademija.ba';
    const emailSubject = `Kontakt forma: ${subject}`;
    const emailBody = `
Poštovani,

Ovo je poruka sa kontakt forme Vaše web stranice:

Ime i prezime: ${name}
Email: ${email}
Predmet: ${subject}

Poruka:
${message}

---------------------------------
Ova poruka je poslana putem kontakt forme na web stranici.
`;
    
    return `mailto:${toEmail}?subject=${encodeURIComponent(emailSubject)}&body=${encodeURIComponent(emailBody)}`;
}

function validateEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
}

// Funkcija za testiranje - automatsko popunjavanje forme
function fillTestData() {
    document.getElementById('name').value = 'Test Korisnik';
    document.getElementById('email').value = 'test@example.com';
    document.getElementById('subject').value = 'Informacije o kursevima';
    document.getElementById('message').value = 'Ovo je test poruka sa kontakt forme. Molimo ignorišite ovu poruku.';
    alert('Test podaci su popunjeni! Sada možete testirati slanje forme.');
}

// Dodaj test dugme za development
function addTestButton() {
    const formActions = document.querySelector('.form-actions');
    if (formActions) {
        const testButton = document.createElement('button');
        testButton.type = 'button';
        testButton.className = 'btn';
        testButton.style.backgroundColor = '#3498db';
        testButton.textContent = 'Test Podaci';
        testButton.onclick = fillTestData;
        formActions.appendChild(testButton);
        
        // Dodaj samo u development okruženju
        console.log('Test dugme je dodano za kontakt formu');
    }
}

// Globalna funkcija za testiranje iz konzole
window.fillTestData = fillTestData;
console.log('Kontakt forma JavaScript je učitan. Za testiranje pokrenite: fillTestData()');