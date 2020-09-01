export class Question {
  static create(question) {
    return fetch("https://podcast-app-65.firebaseio.com/questions.json", {
      method: "POST",
      body: JSON.stringify(question),
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((response) => response.json())
      .then((response) => {
        question.id = response.name;
        return question;
      })
      .then(addToLocalStorage)
      .then(Question.renderList)
      .catch((err) => console.Error("Something went wrong......", err));
  }

  static renderList() {
    const questions = JSON.parse(localStorage.getItem("questions") || "[]");
    const html = questions.length
      ? questions.map(toCard).join("")
      : `<div class="mui--text-headline">No questions</div>`;
    const list = document.getElementById("list");

    list.innerHTML = html;
  }

  static myFetch(token) {
    if (!token) {
      return Promise.resolve(`<p class="error">You have no token</p>`);
    }
    return fetch(
      `https://podcast-app-65.firebaseio.com/questions.json?auth=${token}`
    )
      .then((response) => response.json())
      .then((response) => {
        if (response && response.error) {
          return `<p class="error">${response.error}</p>`;
        }

        return response
          ? Object.keys(response).map((key) => ({
              ...response[key],
              id: key,
            }))
          : [];
      })
      .catch((err) => console.Error("Something went wrong......", err));
  }

  static listToHTML(questions) {
    return questions.length
      ? `<ol>${questions.map((q) => `<li>${q.text}</li>`).join("")}</o>`
      : `<p>No quesions yet</p>`;
  }
}

function addToLocalStorage(question) {
  //and here we find question variable
  return (function () {
    const all = JSON.parse(localStorage.getItem("questions") || "[]"); // On this level we don't have variable question, so we go one level higher ^

    all.push(question);
    localStorage.setItem("questions", JSON.stringify(all));
  })();
}

function toCard(question) {
  return `
  <div class="mui--text-black-54">
    ${new Date(question.date).toLocaleDateString()}
    ${new Date(question.date).toLocaleTimeString()}
  </div>
  <div>
    ${question.text}
  </div>
  <br>
  `;
}
