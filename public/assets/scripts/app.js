const cardSection = document.getElementById("card-section");
const searchInput = document.getElementById("search-input");
const modal = document.getElementById("book-modal");
const modalCloseBtn = document.getElementById("modal-close-btn");
const possibleColors = ["default", "blue", "purple", "yellow"];
const estatisticaBtn = document.getElementById("estatisticaBtn");
let allBooks = [];
let activeCategory = "all";
let searchQuery = "";

const cubeIcon = document.getElementById("cube-icon");

cubeIcon.addEventListener("click", () => {
  const currentTheme = document.documentElement.getAttribute("data-theme");
  document.documentElement.style.transition = "all 0.8s ease-in-out";
  let nextTheme =
    possibleColors[possibleColors.indexOf(currentTheme) + 1] || "default";
  document.documentElement.setAttribute("data-theme", nextTheme);
});

estatisticaBtn.addEventListener("click", () => {
  window.location.href = "/data.html";
});

function createCard(obj) {
  const card = document.createElement("div");
  card.classList.add("card");

  const cover = document.createElement("div");
  cover.classList.add("card-cover");

  const coverDecor = document.createElement("div");
  coverDecor.classList.add("cover-decor");
  cover.appendChild(coverDecor);

  const coverImage = document.createElement("img");
  coverImage.classList.add("cover-image");
  coverImage.src = obj.image;
  cover.appendChild(coverImage);

  const coverIcon = document.createElement("i");
  coverIcon.className = "fa-solid fa-book-open cover-book-icon";
  cover.appendChild(coverIcon);

  card.appendChild(cover);

  const content = document.createElement("div");
  content.classList.add("card-content");

  const infoArea = document.createElement("div");
  infoArea.classList.add("card-info");

  const coverTitle = document.createElement("div");
  coverTitle.classList.add("cover-title");
  coverTitle.textContent = obj.title;
  infoArea.appendChild(coverTitle);

  const author = document.createElement("span");
  author.classList.add("card-author");
  author.textContent = obj.author || "Autor Desconhecido";
  infoArea.appendChild(author);

  const name = document.createElement("h2");
  name.classList.add("card-title-main");
  name.textContent = obj.title;
  infoArea.appendChild(name);

  const description = document.createElement("p");
  description.classList.add("card-description");
  description.textContent = obj.descriptionCurta;

  const ulTags = document.createElement("ul");
  if (obj.categoria) {
    obj.categoria.forEach((categoria) => {
      const liTag = document.createElement("li");
      liTag.textContent = categoria;
      ulTags.appendChild(liTag);
    });
  }
  description.appendChild(ulTags);
  infoArea.appendChild(description);
  content.appendChild(infoArea);

  const meta = document.createElement("div");
  meta.classList.add("card-meta");

  const rating = document.createElement("span");
  rating.classList.add("meta-rating");
  rating.innerHTML = `<i class="fa-solid fa-star"></i> ${obj.nota ? obj.nota.toFixed(1) : "N/A"}`;
  meta.appendChild(rating);

  const stats = document.createElement("div");
  stats.classList.add("meta-stats");

  const yearSpan = document.createElement("span");
  yearSpan.innerHTML = `<i class="fa-regular fa-calendar"></i> ${obj.year || ""}`;
  stats.appendChild(yearSpan);

  const heartSpan = document.createElement("span");
  heartSpan.innerHTML = `<i class="fa-regular fa-heart"></i> ${obj.favoritados || 0}`;
  stats.appendChild(heartSpan);

  meta.appendChild(stats);
  content.appendChild(meta);
  cover.style.cursor = "pointer";
  cover.addEventListener("click", () => {
    openModal(obj, obj.image);
  });

  const button = document.createElement("button");
  button.classList.add("card-button");
  button.innerHTML = `<span>Ver Detalhes</span> <i class="fa-solid fa-arrow-right"></i>`;
  button.addEventListener("click", (e) => {
    e.stopPropagation();
    window.location.href = `details.html?id=${obj.id}`;
  });
  content.appendChild(button);

  card.appendChild(content);

  return card;
}

function renderCards(books) {
  if (!cardSection) return;
  cardSection.innerHTML = "";

  if (books.length === 0) {
    const noResults = document.createElement("div");
    noResults.classList.add("no-results");
    noResults.innerHTML = `
            <i class="fa-solid fa-magnifying-glass"></i>
            <h3>Nenhum livro encontrado</h3>
            <p>Tente buscar por outros termos ou verifique se digitou corretamente.</p>
        `;
    cardSection.appendChild(noResults);
    return;
  }

  books.forEach((book) => {
    const card = createCard(book);
    cardSection.appendChild(card);
  });
}

function getCategories(books) {
  const categoriesSet = new Set();
  books.forEach((book) => {
    if (book.categoria) {
      book.categoria.forEach((c) => categoriesSet.add(c));
    }
  });
  return Array.from(categoriesSet);
}

function renderCategoryFilters(categories) {
  const filterContainer = document.getElementById("category-filters");
  if (!filterContainer) return;

  filterContainer.innerHTML = "";

  const allTab = document.createElement("button");
  allTab.classList.add("filter-tab");
  if (activeCategory === "all") allTab.classList.add("active");
  allTab.textContent = "Todos";
  allTab.addEventListener("click", () => {
    activeCategory = "all";
    renderPage();
  });
  filterContainer.appendChild(allTab);

  categories.forEach((category) => {
    const tab = document.createElement("button");
    tab.classList.add("filter-tab");
    tab.classList.add("unselected");
    if (activeCategory === category) tab.classList.add("active");
    tab.textContent = category;
    tab.addEventListener("click", () => {
      tab.classList.remove("unselected");
      tab.classList.add("active");
      activeCategory = category;
      renderPage();
    });
    filterContainer.appendChild(tab);
  });
}

function renderPage() {
  const filtered = allBooks.filter((book) => {
    const matchesCategory =
      activeCategory === "all" ||
      (book.categoria && book.categoria.includes(activeCategory));

    const matchesSearch =
      searchQuery === "" ||
      book.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (book.author &&
        book.author.toLowerCase().includes(searchQuery.toLowerCase()));

    return matchesCategory && matchesSearch;
  });

  renderCards(filtered);

  const categories = getCategories(allBooks);
  renderCategoryFilters(categories);
}

function openModal(book, image) {
  const starIcon = document.getElementById("modal-rating-icon");
  starIcon.style.color = "gold";
  if (!modal) return;
  const modalCover = document.getElementById("modal-cover");
  if (modalCover) {
    modalCover.style.backgroundImage = `url(${image})`;
  }
  const modalTags = document.getElementById("modal-tags");
  if (modalTags) {
    modalTags.innerHTML = "";
    if (book.categoria) {
      book.categoria.forEach((cat) => {
        const badge = document.createElement("span");
        badge.classList.add("badge");
        badge.textContent = cat;
        modalTags.appendChild(badge);
      });
    }
  }

  document.getElementById("modal-title").textContent = book.title;
  document.getElementById("modal-author").textContent =
    book.author || "Autor Desconhecido";
  document.getElementById("modal-rating").textContent = book.nota
    ? book.nota.toFixed(1)
    : "N/A";
  document.getElementById("modal-year").textContent = book.year || "N/A";
  document.getElementById("modal-favorites").textContent =
    book.favoritados || 0;
  document.getElementById("modal-description").textContent =
    book.descriptionCheia || book.descriptionCurta || "Sem sinopse disponível.";

  modal.classList.remove("hidden");
  document.body.style.overflow = "hidden";
}

function closeModal() {
  if (!modal) return;
  modal.classList.add("hidden");
  document.body.style.overflow = "";
}

async function fetchItems() {
  try {
    const response = await fetch("/books");
    if (!response.ok) throw new Error("Falha ao buscar dados do servidor.");
    const data = await response.json();
    return data;
  } catch (error) {
    console.error(error);
    return [];
  }
}

async function init() {
  if (searchInput) {
    searchInput.addEventListener("input", (e) => {
      searchQuery = e.target.value;
      renderPage();
    });
  }

  if (modalCloseBtn) {
    modalCloseBtn.addEventListener("click", closeModal);
  }
  if (modal) {
    modal.addEventListener("click", (e) => {
      if (e.target === modal) closeModal();
    });
  }
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") closeModal();
  });

  allBooks = await fetchItems();
  renderPage();
}

init();
