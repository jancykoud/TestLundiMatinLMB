// Charger la liste des clients et les afficher dans le tableau
const loadClients = async () => {
    try {
        const response = await fetch('/api/clients');
        if (!response.ok) {
            console.error('Erreur lors du chargement des clients');
            return;
        }

        const clients = await response.json();
        displayClients(clients);
    } catch (error) {
        console.error('Erreur :', error);
    }
};

// Fonction pour afficher les clients dans le tableau
const displayClients = (clients) => {
    const tableBody = document.getElementById('client-table-body');
    tableBody.innerHTML = '';

    clients.forEach(client => {
        const initials = client.name
            .split(' ')
            .map(word => word[0])
            .join('');

        const row = document.createElement('tr');
        row.innerHTML = `
            <td>
                <div class="initials-circle">${initials}</div>
                ${client.name}
            </td>
            <td>${client.address || ''}</td>
            <td>${client.city || ''}</td>
            <td>${client.phone || ''}</td>
            <td>
                <button onclick="viewClient(${client.id})">
                    <i class="fa fa-search"></i>
                </button>
            </td>
        `;
        tableBody.appendChild(row);
    });
};

// Fonction pour filtrer les clients selon la recherche
const searchClients = async () => {
    const searchInput = document.getElementById('search').value.toLowerCase();
    try {
        const response = await fetch('/api/clients');
        if (!response.ok) {
            console.error('Erreur lors du chargement des clients');
            return;
        }

        const clients = await response.json();
        const filteredClients = clients.filter(client => 
            client.name.toLowerCase().includes(searchInput) || 
            (client.address && client.address.toLowerCase().includes(searchInput)) ||
            (client.city && client.city.toLowerCase().includes(searchInput))
        );
        displayClients(filteredClients);
    } catch (error) {
        console.error('Erreur :', error);
    }
};

// Charger les détails d’un client
const loadClientDetails = async () => {
    const clientId = localStorage.getItem('clientId');
    if (!clientId) {
        console.error('Aucun ID de client trouvé');
        return;
    }

    try {
        const response = await fetch(`/api/clients/${clientId}`);
        if (!response.ok) {
            console.error('Erreur lors du chargement des détails du client');
            return;
        }

        const client = await response.json();
        document.getElementById('contact-name').textContent = client.name || 'Nom non disponible';
        document.getElementById('contact-fullname').textContent = client.name || '';
        document.getElementById('contact-phone').textContent = client.phone || 'Non disponible';
        document.getElementById('contact-email').textContent = client.email || 'Non disponible';
        document.getElementById('contact-address').textContent =
            `${client.address || ''}, ${client.postalCode || ''} ${client.city || ''}`;
    } catch (error) {
        console.error('Erreur :', error);
    }
};

// Fonction pour voir un client
const viewClient = (id) => {
    localStorage.setItem('clientId', id);
    window.location.href = 'details.html';
};

// Fonction pour éditer un client
const editClient = () => {
    const clientId = localStorage.getItem('clientId');
    if (!clientId) {
        console.error('Aucun ID de client trouvé');
        return;
    }
    window.location.href = `edit.html?id=${clientId}`;
};

// Sauvegarder un client
const saveClient = async () => {
    const urlParams = new URLSearchParams(window.location.search);
    const clientId = urlParams.get('id');
    if (!clientId) {
        console.error('Aucun ID de client trouvé');
        return;
    }

    const updatedClient = {
        name: document.getElementById('name').value,
        phone: document.getElementById('phone').value,
        email: document.getElementById('email').value,
        address: document.getElementById('address').value,
        city: document.getElementById('city').value,
        postalCode: document.getElementById('postalCode').value
    };

    try {
        const response = await fetch(`/api/clients/${clientId}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(updatedClient),
        });

        if (!response.ok) {
            console.error('Erreur lors de la sauvegarde');
            return;
        }

        window.location.href = 'details.html';
    } catch (error) {
        console.error('Erreur :', error);
    }
};

// Charger la bonne page
if (window.location.pathname.includes('details.html')) {
    loadClientDetails();
} else if (window.location.pathname.includes('edit.html')) {
    const loadEditDetails = async () => {
        const clientId = new URLSearchParams(window.location.search).get('id');
        if (!clientId) {
            console.error('Aucun ID de client trouvé');
            return;
        }

        try {
            const response = await fetch(`/api/clients/${clientId}`);
            if (!response.ok) {
                console.error('Erreur lors du chargement des détails du client');
                return;
            }

            const client = await response.json();
            document.getElementById('name').value = client.name || '';
            document.getElementById('phone').value = client.phone || '';
            document.getElementById('email').value = client.email || '';
            document.getElementById('address').value = client.address || '';
            document.getElementById('city').value = client.city || '';
            document.getElementById('postalCode').value = client.postalCode || '';
        } catch (error) {
            console.error('Erreur :', error);
        }
    };

    loadEditDetails();
} else {
    loadClients();
}
