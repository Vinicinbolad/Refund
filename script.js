// Seleciona os elementos do formulário.
const form = document.querySelector("form");
const amount = document.getElementById("amount");
const expense = document.getElementById("expense");
const category = document.getElementById("category");

// Seleciona os elementos da lista de despesas.
const expenseList = document.querySelector("ul");
const expensesQuantity = document.querySelector("aside header p  span");
const expensesTotal = document.querySelector("aside header h2");

// "conecta" o evento de input.
amount.oninput = () => {
  //Obtem o valor atual do input (let value = amount.value) e remove as letras (.replace(/\D+/g, '')).
  let value = amount.value.replace(/\D+/g, "");

  // Transforma o valor em centavos.
  value = Number(value) / 100;

  // Atualiza o valor do input
  amount.value = value;
};

function formatCurrencyBRL(value) {
  // converte o valor para o padrao brasileiro
  value = value.toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL",
  });
  return value;
}

// Adiciona o evento de submit ao formulário para obter os valores.
form.onsubmit = (event) => {
  event.preventDefault();

  const rawValue = amount.value.replace(/\D+/g, "");
  const floatValue = Number(rawValue) / 100;

  const newExpense = {
    id: new Date().getTime(),
    expense: expense.value,
    category_id: category.value,
    category_name: category.options[category.selectedIndex].text,
    amount: floatValue, // Agora é número
    created_at: new Date(),
  };

  expenseAdd(newExpense);
};

// Função para adicionar uma nova despesa na lista.
function expenseAdd(newExpense) {
  try {
    //cria elemento adicionar o item (li) na lista (ul).
    const expenseItem = document.createElement("li");
    expenseItem.classList.add("expense");

    //Cria o ícone da categoria.
    const expenseIcon = document.createElement("img");
    expenseIcon.setAttribute("src", `img/${newExpense.category_id}.svg`);
    expenseIcon.setAttribute("alt", newExpense.category_name);

    //cri o info da despesa
    const expenseInfo = document.createElement("div");
    expenseInfo.classList.add("expense-info");

    //Cria o nome da despesa.
    const expenseName = document.createElement("strong");
    expenseName.textContent = newExpense.expense;

    // Cria a categoria da despesa.
    const expenseCategory = document.createElement("span");
    expenseCategory.textContent = newExpense.category_name;

    //Adcionar name e category em expenseInfo. Adciona nome e categoria na div das informações da despesa.
    expenseInfo.append(expenseName, expenseCategory);
    //Cria o valor da despesa.
    const expenseAmount = document.createElement("span");
    expenseAmount.classList.add("expense-amount");
    expenseAmount.innerHTML = `<small>R$</small>${formatCurrencyBRL(
      newExpense.amount
    ).replace("R$", "")}`;

    // Cria o ícone de remover.
    const removeIcon = document.createElement("img");
    removeIcon.classList.add("remove-icon");
    removeIcon.setAttribute("src", "img/remove.svg");
    removeIcon.setAttribute("alt", "Remover");

    //Adciona as informações no item.
    expenseItem.append(expenseIcon, expenseInfo, expenseAmount, removeIcon);

    // Adiciona o item na lista (dispesas).
    expenseList.append(expenseItem);

    //Atualiza os totais.
    updateTotals();

    //Limpa o formulário para adicionar u, novo item.
    formClear();
  } catch (error) {
    alert("Não foi possível atualizar a lista de despesas.");
    console.log(error);
  }
}

//Atualiza o valor total das despesas.
function updateTotals() {
  try {
    const items = expenseList.children;

    expensesQuantity.textContent = `${items.length} ${
      items.length > 1 ? "despesas" : "despesa"
    }`;

    let total = 0;

    for (let item = 0; item < items.length; item++) {
      const itemAmount = items[item].querySelector(".expense-amount");

      if (!itemAmount) continue;

      let valueText = itemAmount.textContent
        .replace(/[^\d,]/g, "")
        .replace(",", ".");
      let value = parseFloat(valueText);

      if (!isNaN(value)) {
        total += value;
      }
    }

    expensesTotal.innerHTML = "";

    const symbolBRL = document.createElement("small");
    symbolBRL.textContent = "R$";

    const formattedTotal = formatCurrencyBRL(total).replace("R$", "");

    expensesTotal.append(symbolBRL, formattedTotal);
  } catch (error) {
    console.log("Não foi possível atualizar o total das despesas.");
  }
}

// Captura um evento de clique do item da lista de despesas.
expenseList.addEventListener("click", function (event) {
  //verifica se o elemento clicado é o ícone de remover.
  if (event.target.classList.contains("remove-icon")) {
    //Obtém a (li) pai do elemento clicado.
    const item = event.target.closest(".expense");
    //Remove o item da lista.
    item.remove();
  }

  updateTotals();
});

function formClear() {
  // Limpa os campos(inputs)
  expense.value = "";
  category.value = "";
  amount.value = "";
  //Coloca foco no input de expense.
  expense.focus();
}
