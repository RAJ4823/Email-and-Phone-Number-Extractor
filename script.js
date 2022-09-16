const downloadTextBtn = document.getElementById('download-txt-button');
const downloadCsvBtn = document.getElementById('download-csv-button');
const viewLocation = document.getElementById('view-location');
const viewButton = document.getElementById('view-button');
const dataCount = document.getElementById('counter');
const buttons = document.querySelectorAll('button');
const select = document.getElementById('select');
const email = document.getElementById('email');
const phone = document.getElementById('phone');
const ls = localStorage;

function updatePopup(data) {
    dataCount.innerHTML = data.length;
    buttons.forEach(btn => btn.style.display = 'none');

    if (data.length > 0) {
        resetStyles();
        downloadTextBtn.addEventListener('click', () => {
            let href = `data:text/plain;charset=utf-8,${encodeURIComponent(data.join("\n"))}`;
            downloadFile(href);
        });
        downloadCsvBtn.addEventListener('click', () => {
            let href = `data:text/csv;charset=utf-8,${encodeURIComponent(data.join("\r\n"))}`;
            downloadFile(href);
        });
        viewButton.addEventListener('click', () => viewData(data));
    }
}

function resetStyles() {
    buttons.forEach(btn => {
        btn.style.display = 'flex';
        btn.disabled = false;
    });
    viewLocation.innerText = '';
}

function downloadFile(hrefValue) {
    const element = document.createElement('a');
    element.setAttribute('href', hrefValue);
    element.setAttribute('download', 'data');
    element.style.display = 'none';
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
}

function viewData(data) {
    if (viewLocation.innerText == '')
        viewLocation.innerText = data.join('\n');
    else
        viewLocation.innerText = '';
    viewButton.classList.toggle('clicked');
}

function selectMode() {
    if (ls.getItem('mode') == null) ls.setItem('mode', 'emails');

    if (ls.getItem('mode') == 'emails') {
        email.classList.add('selected');
        phone.classList.remove('selected');
    }
    else {
        email.classList.remove('selected');
        phone.classList.add('selected');
    }

    //Set localstorage with new selected mode and reload page
    select.addEventListener('click', (e) => {
        let id = e.target.id;
        let prev = ls.getItem('mode');
        if (id == 'email' || id == 'phone') ls.setItem('mode', id + 's');

        let curr = ls.getItem('mode');
        if (prev != curr) location.reload();
    })
}

export { updatePopup, selectMode };