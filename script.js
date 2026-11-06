// HTMLから操作する部品を取得する
const form = document.getElementById("todo-form");
const input = document.getElementById("task-input");
const list = document.getElementById("task-list");
const count = document.getElementById("task-count");
const emptyMessage = document.getElementById("empty-message");

// タスクを配列で管理する（ページ再読み込み時には初期化される）
let tasks = [];
let nextId = 1;

// 現在のタスク一覧を画面に表示する関数
function renderTasks() {
  // 古い一覧を消してから作り直す
  list.replaceChildren();

  tasks.forEach(function (task) {
    // タスク1件分の行を作成する
    const item = document.createElement("li");
    item.className = "task-item";
    if (task.completed) item.classList.add("completed");

    // チェックボックスで完了・未完了を切り替える
    const checkbox = document.createElement("input");
    checkbox.type = "checkbox";
    checkbox.className = "task-checkbox";
    checkbox.checked = task.completed;
    checkbox.setAttribute("aria-label", task.text + "を完了にする");
    checkbox.addEventListener("change", function () {
      task.completed = checkbox.checked;
      renderTasks();
    });

    // 入力された文字を安全に表示する
    const text = document.createElement("span");
    text.className = "task-text";
    text.textContent = task.text;

    // 削除ボタンを押したら該当タスクだけを取り除く
    const deleteButton = document.createElement("button");
    deleteButton.type = "button";
    deleteButton.className = "delete-button";
    deleteButton.textContent = "削除";
    deleteButton.setAttribute("aria-label", task.text + "を削除");
    deleteButton.addEventListener("click", function () {
      tasks = tasks.filter(function (current) {
        return current.id !== task.id;
      });
      renderTasks();
    });

    // 画面の行に部品を追加する
    item.append(checkbox, text, deleteButton);
    list.appendChild(item);
  });

  // タスク数と空のときのメッセージを更新する
  count.textContent = "タスクは" + tasks.length + "件です";
  emptyMessage.hidden = tasks.length > 0;
}

// 「追加」が押されたら新しいタスクを登録する
form.addEventListener("submit", function (event) {
  event.preventDefault(); // ページの再読み込みを防ぐ
  const text = input.value.trim(); // 前後の空白を除去する
  if (text === "") return; // 空のタスクは追加しない

  tasks.push({ id: nextId++, text: text, completed: false });
  input.value = ""; // 入力欄を空に戻す
  renderTasks(); // 最新の一覧を表示する
  input.focus();
});

// ページを開いたときに最初の画面を表示する
renderTasks();
