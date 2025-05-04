// Когда весь DOM загружен и готов к работе
window.addEventListener("DOMContentLoaded", () => {
  "use strict"; // Включаем строгий режим — помогает избежать ошибок

  // Получаем поле ввода новой задачи
  const addTaskInputElement = document.querySelector(".todo__field--add");

  // Получаем кнопку "Добавить задачу"
  const addTaskButtonElement = document.querySelector(".todo__add-task-btn");

  // Контейнер, в который будут добавляться задачи
  const todoListContainer = document.querySelector(".todo__body");

  // Основной массив всех задач
  let todos = [];

  // Функция генерации уникального ID для каждой задачи
  const generateId = () => {
    return (
      Math.random().toString(16).slice(2) + new Date().getTime().toString(36)
    );
  };

  // Сохраняем все задачи в localStorage
  const saveToLocalStorage = () => {
    localStorage.setItem("todos", JSON.stringify(todos));
  };

  // Загружаем задачи из localStorage при старте
  const loadFromLocalStorage = () => {
    const saved = localStorage.getItem("todos");
    if (saved) {
      todos = JSON.parse(saved); // Преобразуем строку обратно в массив
      todos.forEach(renderTask); // Отображаем каждую задачу
    }
  };

  // Функция отображения одной задачи на экране
  const renderTask = (task) => {
    // Создаём обёртку для задачи
    const taskElement = document.createElement("div");
    taskElement.classList.add("todo__item");
    taskElement.setAttribute("data-id", task.id); // Сохраняем ID в DOM

    // HTML-шаблон для задачи
    taskElement.innerHTML = `
      <label class="todo__label">
        <input type="checkbox" class="todo__checkbox" ${
          task.completed ? "checked" : ""
        } />
        <h3 class="todo__task-title">${task.title}</h3>
      </label>
      <button type="button" aria-label="Edit" class="todo__edit"></button>
      <button type="button" aria-label="Remove" class="todo__remove"></button>
    `;

    // Находим элементы внутри задачи
    const checkbox = taskElement.querySelector(".todo__checkbox");
    const editBtn = taskElement.querySelector(".todo__edit");
    const removeBtn = taskElement.querySelector(".todo__remove");
    const label = taskElement.querySelector(".todo__label");
    let titleEl = taskElement.querySelector(".todo__task-title");

    // Событие: изменение чекбокса (выполнена/не выполнена)
    checkbox.addEventListener("change", () => {
      task.completed = checkbox.checked; // Обновляем состояние задачи

      if (task.completed) {
        // Если задача выполнена — удаляем её через 0.4 сек
        setTimeout(() => {
          todos = todos.filter((t) => t.id !== task.id); // Удаляем из массива
          taskElement.remove(); // Удаляем из DOM
          saveToLocalStorage(); // Сохраняем изменения
        }, 400);
      }
    });

    // Событие: удаление задачи по кнопке
    removeBtn.addEventListener("click", () => {
      todos = todos.filter((t) => t.id !== task.id); // Удаляем из массива
      taskElement.remove(); // Удаляем из DOM
      saveToLocalStorage(); // Обновляем localStorage
    });

    // Событие: редактирование задачи
    editBtn.addEventListener("click", () => {
      // Создаём поле ввода для редактирования
      const input = document.createElement("input");
      input.type = "text";
      input.className = "todo__task-title--edit";
      input.value = task.title; // Ставим текущее значение
      label.replaceChild(input, titleEl); // Меняем заголовок на input
      input.focus(); // Автоматически ставим фокус

      // Меняем кнопку edit на done
      editBtn.classList.remove("todo__edit");
      editBtn.classList.add("todo__done");

      // Функция сохранения нового значения
      const saveEdit = () => {
        const newValue = input.value.trim(); // Убираем лишние пробелы
        if (newValue) {
          task.title = newValue; // Обновляем в объекте

          // Заменяем input обратно на h3
          const newTitle = document.createElement("h3");
          newTitle.className = "todo__task-title";
          newTitle.textContent = task.title;
          label.replaceChild(newTitle, input);
          titleEl = newTitle;

          // Возвращаем кнопку обратно в edit
          editBtn.classList.remove("todo__done");
          editBtn.classList.add("todo__edit");

          saveToLocalStorage(); // Сохраняем
        }
      };

      // Клик по кнопке done сохраняет редактирование
      editBtn.addEventListener("click", saveEdit, { once: true });

      // Нажатие Enter сохраняет редактирование
      input.addEventListener("keydown", (event) => {
        if (event.key === "Enter") {
          saveEdit();
        }
      });
    });

    // Добавляем задачу в список на странице
    todoListContainer.prepend(taskElement);
  };

  // Функция добавления новой задачи
  const addTask = () => {
    const value = addTaskInputElement.value.trim(); // Получаем текст из поля

    if (!value) {
      return; // Ничего не делаем, если поле пустое
    }

    // Создаём новую задачу
    const task = {
      id: generateId(),
      title: value,
      completed: false,
    };

    todos.push(task); // Добавляем в массив
    addTaskInputElement.value = ""; // Очищаем поле ввода
    renderTask(task); // Отображаем на странице
    saveToLocalStorage(); // Сохраняем в localStorage
  };

  // Обработчик: добавление задачи по кнопке
  addTaskButtonElement.addEventListener("click", addTask);

  // Обработчик: добавление задачи по нажатию Enter
  addTaskInputElement.addEventListener("keydown", (event) => {
    if (event.key === "Enter") {
      addTask();
    }
  });

  // Загружаем сохранённые задачи при загрузке страницы
  loadFromLocalStorage();
});
