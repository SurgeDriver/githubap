const input = document.querySelector('.search-input');
const suggestions = document.querySelector('.suggestions');
const repoList = document.querySelector('.repo-list');
console.log(input, suggestions, repoList)
let addedRepos = [];

function debounce(func, delay) {
    let timeout;
    return function(...args) {
        clearTimeout(timeout);
        timeout = setTimeout(() => func.apply(this, args), delay);
    };
}

async function fetchRepos(query) {
    if (!query) return;
    try {
        const response = await fetch(`https://api.github.com/search/repositories?q=${query}`);
        const data = await response.json();
        displaySuggestions(data.items);
    } catch (error) {
        console.error('Ошибка:', error);
    }
}

function displaySuggestions(repos) {
    suggestions.innerHTML = '';
    repos.slice(0, 5).forEach(repo => {
        const suggestion = document.createElement('div');
        suggestion.classList.add("suggestion")
        suggestion.textContent = repo.name;
        suggestion.onclick = () => addRepo(repo);
        suggestions.appendChild(suggestion);
    });
}

function addRepo(repo) {
    addedRepos.push(repo);
    updateRepoList();
    input.value = '';
    suggestions.innerHTML = '';
}

function updateRepoList() {
    repoList.innerHTML = '';
    addedRepos.forEach(repo => {
        const savedRepo = document.createElement('div');
        savedRepo.classList.add("saved-repo")

        const stats = document.createElement('div')
        stats.classList.add('repo-stats')
        savedRepo.appendChild(stats)

        const name = document.createElement('p');
        const owner = document.createElement('p');
        const stars = document.createElement('p');
        name.textContent = `Name: ${repo.name}`;
        owner.textContent = `Owner: ${repo.owner.login}`;
        stars.textContent = `Stars: ${repo.stargazers_count}`;
        stats.appendChild(name);
        stats.appendChild(owner);
        stats.appendChild(stars);

        const removeButton = document.createElement('button');
        removeButton.classList.add("remove-button")
        removeButton.onclick = () => removeRepo(repo);
        savedRepo.appendChild(removeButton);
        repoList.appendChild(savedRepo);
    });
}

function removeRepo(repo) {
    addedRepos = addedRepos.filter(r => r.id !== repo.id);
    updateRepoList();
}

input.addEventListener('input', debounce((e) => {
    fetchRepos(e.target.value);
}, 300));