document.addEventListener("DOMContentLoaded", () => {
  const tableBody = document.getElementById("table-body");
  const searchInput = document.getElementById("search-input");

  let passengers = []; // полный список пассажиров
  let filteredPassengers = []; // отфильтрованный список по поиску
  let displayedCount = 0; // количество уже отображённых строк
  const batchSize = 20; // число строк, подгружаемых за один раз

  // Загружаем данные из файла passengers.json, который находится на сервере
  fetch("passengers.json")
    .then((response) => {
      if (!response.ok) {
        throw new Error("Ошибка загрузки данных");
      }
      return response.json();
    })
    .then((data) => {
      passengers = data;
      filteredPassengers = passengers;
      loadMoreRows();
    })
    .catch((err) => console.error("Ошибка при загрузке данных:", err));

  // Функция создания строки таблицы для пассажира
  function createRow(passenger) {
    const tr = document.createElement("tr");

    // Создаем ячейки для имени, пола, возраста и информации о выживании
    const nameTd = document.createElement("td");
    nameTd.textContent = passenger.name || "";

    const sexTd = document.createElement("td");
    sexTd.textContent = passenger.sex || "";

    const ageTd = document.createElement("td");
    ageTd.textContent = passenger.age ? passenger.age.toString() : "";

    const survivedTd = document.createElement("td");
    // Предполагается, что поле survived является булевым значением (true/false)
    survivedTd.textContent = passenger.survived ? "Выжил" : "Погиб";

    tr.appendChild(nameTd);
    tr.appendChild(sexTd);
    tr.appendChild(ageTd);
    tr.appendChild(survivedTd);

    return tr;
  }

  // Функция подгрузки очередной партии строк (lazy load)
  function loadMoreRows() {
    if (displayedCount >= filteredPassengers.length) return;
    const nextBatch = filteredPassengers.slice(
      displayedCount,
      displayedCount + batchSize
    );
    nextBatch.forEach((passenger) => {
      const row = createRow(passenger);
      tableBody.appendChild(row);
    });
    displayedCount += nextBatch.length;
  }

  // Реализуем lazy load при прокрутке страницы
  window.addEventListener("scroll", () => {
    if (
      window.innerHeight + window.scrollY >=
      document.body.offsetHeight - 100
    ) {
      loadMoreRows();
    }
  });

  // Обработка поиска по всем столбцам
  searchInput.addEventListener("input", () => {
    const query = searchInput.value.toLowerCase();

    filteredPassengers = passengers.filter((passenger) => {
      const name = (passenger.name || "").toLowerCase();
      const sex = (passenger.sex || "").toLowerCase();
      const age = passenger.age ? passenger.age.toString() : "";
      const survived = passenger.survived ? "выжил" : "погиб";

      return (
        name.includes(query) ||
        sex.includes(query) ||
        age.includes(query) ||
        survived.includes(query)
      );
    });

    // Очищаем таблицу и сбрасываем счётчик отображенных строк
    tableBody.innerHTML = "";
    displayedCount = 0;
    loadMoreRows();
  });
});
