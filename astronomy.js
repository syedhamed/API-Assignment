const apiKey = 'ny2CdxPBRT5qXxuQIWh3veTqMwbhWPCFAbgku0Tz';  
const apiUrl = 'https://api.nasa.gov/planetary/apod';// url for APOD
const apiUrl1 = 'https://api.nasa.gov/mars-photos/api/v1/rovers/curiosity/photos'; //url for mars
const apiUrl2  = 'https://images-api.nasa.gov'; // url for Nasa



const resultsContainer = document.getElementById('resultsContainer');
const apodContainer = document.getElementById('apodContainer');
const photosContainer = document.getElementById('photos-container');
const isVisible = document.querySelector('.search-container');

apodContainer.style.display = "none";
photosContainer.style.display = "none";
resultsContainer.style.display = "none";
isVisible.style.display = "none";

// code for APOD

async function makeRequest(url) {
    const response = await fetch(url);
    return response.json();
}

function getAstronomyPicture() {
    const date = new Date();
    const dateString = `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`;

    const parameters = {
        api_key: apiKey,
        date: dateString,
    };

    const url = `${apiUrl}?${new URLSearchParams(parameters).toString()}`;

    console.log('API Request URL:', url);

    makeRequest(url)
        .then(data => {
            displayAstronomyPicture(data);
        })
        .catch(error => {
            console.error('Error fetching astronomy picture:', error);
            document.getElementById('error').innerHTML = 'Error fetching astronomy picture. Please try again.';
        });
}

function displayAstronomyPicture(data) {
    apodContainer.innerHTML = '';
 
    if (apodContainer.style.display === "none") {
        apodContainer.style.display = "block";
        photosContainer.style.display = "none";
        resultsContainer.style.display = "none";
        isVisible.style.display = "none";
    
    }
    

    if (data.code && data.msg) {
        document.getElementById('error').innerHTML = `${data.code}: ${data.msg}`;
        return;
    }

    const h1 = document.createElement('h1')
    h1.textContent = "Astronomy Picture of the Day";

    const title = document.createElement('h2');
    title.textContent = data.title;

    const date = document.createElement('p');
    date.textContent = data.date;

    const explanation = document.createElement('p');
    explanation.textContent = data.explanation;

    const image = document.createElement('img');
    image.src = data.url;
    image.alt = data.title;

    apodContainer.appendChild(h1);
    apodContainer.appendChild(title);
    apodContainer.appendChild(date);
    apodContainer.appendChild(image);
    apodContainer.appendChild(explanation);
}

// code for Mars images

async function makeRequest1(url) {
    const response = await fetch(url);

    if (!response.ok) {
        throw new Error(`Failed to fetch data. Status: ${response.status}`);
    }

    return response.json();
}

function displayError(message) {
    document.getElementById('error').textContent = message;
}

function displayPhotos(photos) {

    if (photosContainer.style.display === "none") {
        photosContainer.style.display = "block";
        apodContainer.style.display = "none";
        resultsContainer.style.display = "none";
        isVisible.style.display = "none";
    
    }


    photos.forEach(photo => {
        const photoElement = document.createElement('div');
        photoElement.classList.add('photo');

        const imgElement = document.createElement('img');
        imgElement.src = photo.img_src;
        imgElement.alt = `Mars Rover Photo - Sol: ${photo.sol}`;

        photoElement.appendChild(imgElement);
        photosContainer.appendChild(photoElement);
    });
}

async function loadPhotos() {
    try {
        const sol = 10; // Set the desired sol (Martian day)
        const url = `${apiUrl1}?sol=${sol}&api_key=${apiKey}`;
        const data = await makeRequest1(url);

        if (data.photos && data.photos.length > 0) {
            displayError('');
            displayPhotos(data.photos);
        } else {
            displayError('No photos found for the specified sol.');
        }
    } catch (error) {
        displayError(`Error: ${error.message}`);
    }
}
//code for  Nasa Search bar 

async function makeRequest2(url) {
    const response = await fetch(url);

    if (!response.ok) {
        throw new Error(`Failed to fetch data. Status: ${response.status}`);
    }

    return response.json();
}


document.querySelector('.nasa-searchbtn').addEventListener('click', function (e) {
    if (isVisible.style.display === "none" ) {

        photosContainer.style.display = "none";
        apodContainer.style.display = "none";
        isVisible.style.display = "block";
        resultsContainer.style.display = "block";
        console.log(e);

    } 
    if ( apodContainer.style.display ==="block" || photosContainer.style.display === "block"){
        isVisible.style.display = "none";
        resultsContainer.style.display = "none";
        photosContainer.style.display = "block";
        apodContainer.style.display = "block";
    console.log(e);
    }
    
});


function displayResults(data) {
    
     const resultsContainer = document.getElementById('resultsContainer');
     resultsContainer.innerHTML = '';
 
     
    data.collection.items.forEach(item => {
        const resultItem = document.createElement('div');
        resultItem.classList.add('result-item');

        const title = document.createElement('h3');
        title.textContent = item.data[0].title;

        const thumbnail = document.createElement('img');
        thumbnail.src = item.links[0].href;
        thumbnail.alt = item.data[0].title;

        const detailsButton = document.createElement('button');
        detailsButton.textContent = 'View Details';
        detailsButton.addEventListener('click', () => viewDetails(item));

        resultItem.appendChild(title);
        resultItem.appendChild(thumbnail);
        resultItem.appendChild(detailsButton);

        resultsContainer.appendChild(resultItem);
    });
}

function viewDetails(item) {
    const nasaId = item.data[0].nasa_id;
    const detailsUrl = `${apiUrl2}/metadata/${nasaId}`;
    
    makeRequest2(detailsUrl)
        .then(details => {
            alert(`Details:\n${JSON.stringify(details, null, 2)}`);
        })
        .catch(error => {
            console.error('Error fetching details:', error);
            alert('Error fetching details. Please try again.');
        });
}


function searchImages() {
    const searchInput = document.getElementById('searchInput');
    const query = searchInput.value.trim();

    if (query) {
        const searchUrl = `${apiUrl2}/search?q=${encodeURIComponent(query)}`;
        
        makeRequest2(searchUrl)
            .then(data => {
                displayResults(data);
              
            })
            .catch(error => {
                console.error('Error fetching search results:', error);
                alert('Error fetching search results. Please try again.');
            });
    } else {
        alert('Please enter a search query.');
    }
}
