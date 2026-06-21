const chartIcon = document.getElementById("chart-icon")
const possibleColors = ["default", "blue", "purple", "yellow"]
const pizzaChart = document.getElementById("pizza-chart")
let categoriasExistentes = new Set()
async function renderCharts() {
  const response = await fetch("/books")
  data = await response.json()
  data.forEach(obj => {
    obj.categoria.forEach(option => {
      categoriasExistentes.add(option)
    })
  })
  const quantidadeDeFilmesPorCategoria = new Array(categoriasExistentes.size).fill(0)
  categoriasExistentes = Array.from(categoriasExistentes)
  for (let i = 0; i < quantidadeDeFilmesPorCategoria.length; i++) {
    data.forEach(obj => {
      if ((obj.categoria).includes(categoriasExistentes[i])) {
        quantidadeDeFilmesPorCategoria[i]++
      }
    })
  }
  new Chart(pizzaChart, {
    type: "pie",
    data: {
      labels: categoriasExistentes,
      datasets: [{
        label: "Gênero de filmes",
        data: quantidadeDeFilmesPorCategoria,
        borderwidth: 1
      }]
    },
  });
}
renderCharts()

chartIcon.addEventListener("click", () => {
  const currentTheme = document.documentElement.getAttribute("data-theme");
  document.documentElement.style.transition = "all 0.8s ease-in-out";
  let nextTheme =
    possibleColors[possibleColors.indexOf(currentTheme) + 1] || "default";
  document.documentElement.setAttribute("data-theme", nextTheme);
});
