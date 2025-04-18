import { ristoranti } from './ristoranti.js'

var map = L.map('map').setView([40.8517, 12.2681], 5.5);
let newPage = document.getElementById('newPage');
let elencoButton = document.getElementById('button_elenco');

L.tileLayer('https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
}).addTo(map);

// Icona personalizzata
var redIcon = L.icon({
    iconUrl: 'data:image/svg+xml;charset=UTF-8,' + encodeURIComponent(`
        <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M12 21C15.5 17.4 19 14.1764 19 10.2C19 6.22355 15.866 3 12 3C8.13401 3 5 6.22355 5 10.2C5 14.1764 8.5 17.4 12 21Z" stroke="#aa182c" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"></path>
            <path d="M12 12C13.1046 12 14 11.1046 14 10C14 8.89543 13.1046 8 12 8C10.8954 8 10 8.89543 10 10C10 11.1046 10.8954 12 12 12Z" stroke="#aa182c" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"></path>
        </svg>
    `),
    iconSize: [40, 60],
    iconAnchor: [20, 50],
    popupAnchor: [0, -50]
});

window.openMenu = function() {
    if (window.innerWidth < 800) {
    toggleMenu();
    }
}

// Funzione di ricerca
let search_bar = document.getElementById('searchByName');

search_bar.addEventListener('keyup', function(e) {
    
    let search_bar = document.getElementById('searchByName');

    search_bar.addEventListener('keyup', function () {
        let query = search_bar.value.toLowerCase();

        // Filtra i ristoranti in base al nome
        let risultati = ristoranti.filter(r =>
            r.nome.toLowerCase().includes(query)
        );

        mostraRistoranti(risultati);
    });
})

function mostraRistoranti(lista) {
    let markers = [];
    let containerElenco = document.querySelector('#elencoCard');
    containerElenco.innerHTML = ''; // svuota prima

    // Rimuove tutti i marker precedenti
    map.eachLayer(function (layer) {
        if (layer instanceof L.Marker && layer.options.icon === redIcon) {
            map.removeLayer(layer);
        }
    });

    for (let risto of lista) {
        let coords = { lat: risto.lat, lon: risto.lon };

        let marker = L.marker([coords.lat, coords.lon], { icon: redIcon })
            .bindPopup(`<b>${risto.nome}</b><br><p>Prezzo: ${'$'.repeat(risto.prezzo)}</p><br><a class = "card_to_view" href = "#${risto.nome.replace(/ /g, '')}" onclick = "openMenu()">Scopri di più</a>`)
            .addTo(map);
        markers.push(marker);

        let html = `
            <div class="card" id = "${risto.nome.replace(/ /g, '')}" style="width: 18rem;" data-ristorante="${risto.nome}" data-lat="${coords.lat}" data-lon="${coords.lon}">
                <img src="${risto.foto}" class="card-img-top" alt="${risto.nome}">
                <div class="card-body">
                    <h5 class="card-title"><span class = "title_risto">${risto.nome}</span></h5>
                    <p class="card-text">${risto.descrizione}</p>
                    <p class = "card-text"> <span class = "title_risto">Indirizzo:</span> ${risto.indirizzo} </p>
                    <p class="card-text"><span class = "title_risto">Prezzo:</span> ${'$'.repeat(risto.prezzo)}</p>
                </div>
            </div>
        `;
        containerElenco.innerHTML += html;
    }

    document.querySelectorAll('.card').forEach(card => {
        card.addEventListener('click', function () {
            const lat = parseFloat(this.getAttribute('data-lat'));
            const lon = parseFloat(this.getAttribute('data-lon'));
            map.setView([lat, lon], 14);
            if (window.innerWidth < 800) toggleMenu();
        });
    });
}

// Funzione per caricare i ristoranti con coordinate
async function loadRestaurants() {
    let markers = [];
    let containerElenco = document.querySelector('#elencoCard');

    for (let risto of ristoranti) {
        // Utilizza direttamente le coordinate lat e lon del ristorante
        let coords = { lat: risto.lat, lon: risto.lon };

        // Aggiungi marker alla mappa
        let marker = L.marker([coords.lat, coords.lon], { icon: redIcon })
            .bindPopup(`<b>${risto.nome}</b><br><p>Prezzo: ${'$'.repeat(risto.prezzo)}</p><br><a class = "card_to_view" href = "#${risto.nome.replace(/ /g, '')}" onclick = "openMenu()">Scopri di più</a>`)
            .addTo(map);
        markers.push(marker);

        // Crea la card
        let html = `
            <div class="card" id = "${risto.nome.replace(/ /g, '')}" style="width: 18rem;" data-ristorante="${risto.nome}" data-lat="${coords.lat}" data-lon="${coords.lon}">
                <img src="${risto.foto}" class="card-img-top" alt="${risto.nome}">
                <div class="card-body">
                    <h5 class="card-title"><span class = "title_risto">${risto.nome}</span></h5>
                    <p class="card-text">${risto.descrizione}</p>
                    <p class = "card-text"> <span class = "title_risto">Indirizzo:</span> ${risto.indirizzo} </p>
                    <p class="card-text"><span class = "title_risto">Prezzo:</span> ${'$'.repeat(risto.prezzo)}</p>
                </div>
            </div>
        `;
        containerElenco.innerHTML += html;
    }

    // Aggiungi eventi alle card
    document.querySelectorAll('.card').forEach(card => {
        card.addEventListener('click', function() {
            const lat = parseFloat(this.getAttribute('data-lat'));
            const lon = parseFloat(this.getAttribute('data-lon'));
            map.setView([lat, lon], 14);
            if (window.innerWidth < 800) toggleMenu();
        });
    });
}

// Funzione per il toggle del menu laterale
let x = -1;
function toggleMenu() {
    x *= -1;
    newPage.style.height = x === -1 ? "60px" : "80vh";
    if (x == -1) {
        newPage.scrollTo({ top: 0, left: 0, behavior: 'smooth' });
        elencoButton.innerHTML = "Elenco";
    } else {
        elencoButton.innerHTML = "Torna alla mappa";
    }
}

// Inizializza i ristoranti
loadRestaurants();

// Evento per il pulsante dell'elenco (solo su mobile)
if (window.innerWidth < 800) {
    elencoButton.addEventListener('click', toggleMenu);
}
