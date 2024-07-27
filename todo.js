const inputTodo = document.getElementById('todo-input');
const todoForm = document.getElementById('todo-form');
const todoListUL = document.getElementById('todo-list');
const filters = document.querySelectorAll(".filter");

let todoList = JSON.parse(localStorage.getItem("todoList")) || [];

updateTodoList();

todoForm.addEventListener("submit", function(e){
     e.preventDefault();
     addTodo();
})

function addTodo(){
     const todo = inputTodo.value.trim();
     if(todo.length > 0){
          todoList.push({text: todo, status: "pending"});
          updateTodoList();
          saveTodoList();
          updateFilterAndRenderList();
          inputTodo.value = '';     
     }else{
          return
     }
}

function updateFilterAndRenderList() {
  const allFilterBtn = document.querySelector('[data-filter="all"]');
  const pendingFilterBtn = document.querySelector('[data-filter="pending"]');
  const completedFilterBtn = document.querySelector('[data-filter="completed"]');
  allFilterBtn.classList.add("active");
  pendingFilterBtn.classList.remove("active");
  completedFilterBtn.classList.remove("active");
  renderFilteredList("all");
}


function updateTodoList(){
     todoListUL.innerHTML = '';
     todoList.forEach((todo, todoIndex) => {
          todoItem = createTodoitem(todo, todoIndex);
          todoListUL.append(todoItem);
     })
}

function createTodoitem(todo, todoIndex){
     const todoLI = document.createElement("li");
     todoLI.className = "todo"
     todoLI.innerHTML = `
            <input type="checkbox" id="todo-${todoIndex}">
            <label for="todo-${todoIndex}" class="custom-checkbox">
              <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="none"><path d="M382-240 154-468l57-57 171 171 367-367 57 57-424 424Z"/></svg>
            </label>
            <label for="todo-${todoIndex}" class="todo-text">${todo.text}</label>
            <button id="delete-button">
              <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#e8eaed"><path d="M280-120q-33 0-56.5-23.5T200-200v-520h-40v-80h200v-40h240v40h200v80h-40v520q0 33-23.5 56.5T680-120H280Zm80-160h80v-360h-80v360Zm160 0h80v-360h-80v360Z"/></svg>
            </button>`;

            const deleteButton = todoLI.querySelector("#delete-button");
            deleteButton.addEventListener("click", () =>{
               deleteTodoItem(todoIndex);
            })

            const checkbox = todoLI.querySelector('input');
            checkbox.checked = todo.status === "completed";

            checkbox.addEventListener("change", () => {
               if (checkbox.checked) {
               todoList[todoIndex].status = "completed";
               checkbox.parentNode.classList.add("checked");
               } else {
               todoList[todoIndex].status = "pending";
               checkbox.parentNode.classList.remove("checked");
               }
               saveTodoList();
               updateTodoList();
            })
            
     return todoLI;
}

function deleteTodoItem(todoIndex){
     todoList = todoList.filter((_, i) => i !== todoIndex);
     filteredList = filteredList.filter((_, i) => i !== todoIndex);
     saveTodoList();
     updateTodoList();
}

function saveTodoList(){
     list = JSON.stringify(todoList);
     localStorage.setItem("todoList", list);
}

filters.forEach((filterBtn) => {
  filterBtn.addEventListener("click", () => {
    filters.forEach((filterBtn) => filterBtn.classList.remove("active"));
    filterBtn.classList.add("active");
    let status = filterBtn.dataset.filter;

    renderFilteredList(status);
  });
});



let filteredList = [...todoList];

function renderFilteredList(status){
  filterValue = status;
  if (status === "all") {
    filteredList = [...todoList];
  } else {
    filteredList = todoList.filter((todo) => todo.status === status);
  }
  todoListUL.innerHTML = "";
  filteredList.forEach((todo, filteredIndex) => {
     const todoLI = createTodoitem(todo, filteredIndex);
     todoListUL.appendChild(todoLI);

     const deleteButton = todoLI.querySelector("#delete-button");
     const checkbox = todoLI.querySelector("input[type='checkbox']");

    if (status === "pending" || status === "completed") {
      checkbox.style.display = "none";
      deleteButton.style.display = "none";
      checkbox.disabled = true;
    } else {
      deleteButton.style.display = "block";
    }

     deleteButton.addEventListener("click", () =>{
     deleteTodoItem(todo.id);
    })

    console.log(checkbox)
  });
}

