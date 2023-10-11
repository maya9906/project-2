// ページが読み込まれたときの初期処理
// Initial actions when the page is loaded
window.addEventListener('load', () => {
    // ローカルストレージからTODOリストを取得するか、空の配列を作成
    // Get the TODO list from local storage or create an empty array
    let todos = JSON.parse(localStorage.getItem('todos')) || [];
    const nameInput = document.querySelector('#name');
    const newTodoForm = document.querySelector('#new-todo-form');

    // ローカルストレージからユーザー名を取得するか、空の文字列を使用
    // Get the username from local storage or use an empty string
    const username = localStorage.getItem('username') || '';

    // ユーザー名入力フィールドにユーザー名を設定
    // Set the username in the name input field
    nameInput.value = username;

    // ユーザー名入力フィールドが変更されたときに、ユーザー名をローカルストレージに保存
    // Save the username to local storage when the name input field is changed
    nameInput.addEventListener('change', e => {
        localStorage.setItem('username', e.target.value);
    });

    // TODO追加フォームが送信されたときの処理
    // Handling the submission of the TODO form
    newTodoForm.addEventListener('submit', e => {
        e.preventDefault();

        // フォームからTODOの内容とカテゴリを取得
        // Get the content and category of the TODO from the form
        const todo = {
            content: e.target.elements.content.value,
            category: e.target.elements.category.value,
            done: false,
            createdAt: new Date().getTime()
        };

        // TODOをTODOリストに追加
        // Add the TODO to the TODO list
        todos.push(todo);

        // TODOリストをローカルストレージに保存
        // Save the TODO list to local storage
        localStorage.setItem('todos', JSON.stringify(todos));

        // フォームをリセット
        // Reset the form
        e.target.reset();

        // TODOリストを表示
        // Display the TODO list
        DisplayTodos();
    });

    // 初回ページ読み込み時にTODOリストを表示
    // Display the TODO list on the initial page load
    DisplayTodos();

    // TODOリストを表示する関数
    // Function to display the TODO list
    function DisplayTodos() {
        const todoList = document.querySelector('#todo-list');

        // TODOリストをクリア
        // Clear the TODO list
        todoList.innerHTML = '';

        // 各TODOアイテムを生成して表示
        // Generate and display each TODO item
        todos.forEach(todo => {
            const todoItem = document.createElement('div');
            todoItem.classList.add('todo-item');

            const label = document.createElement('label');
            const input = document.createElement('input');
            const span = document.createElement('span');
            const content = document.createElement('div');
            const actions = document.createElement('div');
            const edit = document.createElement('button');
            const deleteButton = document.createElement('button');

            input.type = 'checkbox';
            input.checked = todo.done;
            span.classList.add('bubble');

            if (todo.category == 'personal') {
                span.classList.add('personal');
            } else {
                span.classList.add('business');
            }

            content.classList.add('todo-content');
            actions.classList.add('actions');
            edit.classList.add('edit');
            deleteButton.classList.add('delete');

            content.innerHTML = `<input type='text' value='${todo.content}' readonly>`;
            edit.innerHTML = `Edit`;
            deleteButton.innerHTML = `Delete`;

            label.appendChild(input);
            label.appendChild(span);
            actions.appendChild(edit);
            actions.appendChild(deleteButton);
            todoItem.appendChild(label);
            todoItem.appendChild(content);
            todoItem.appendChild(actions);

            // TODOリストにアイテムを追加
            // Add items to the TODO list
            todoList.appendChild(todoItem);

            if (todo.done) {
                todoItem.classList.add('done');
            }

            input.addEventListener('click', e => {
                todo.done = e.target.checked;
                localStorage.setItem('todos', JSON.stringify(todos));

                if (todo.done) {
                    todoItem.classList.add('done');
                } else {
                    todoItem.classList.remove('done');
                }

                // TODOリストを再表示
                // Re-display the TODO list
                DisplayTodos();
            });

            // Editボタンがクリックされたときの処理
            // Handling the click event of the Edit button
            edit.addEventListener('click', e => {
                // 編集可能な入力フィールドにフォーカスを設定
                // Set focus on the editable input field
                const input = content.querySelector('input');
                input.removeAttribute('readonly');
                input.focus();

                // 入力フィールドがフォーカスを失ったときの処理
                // Handling when the input field loses focus
                input.addEventListener('blur', e => {
                    // 入力フィールドを読み取り専用に設定
                    // Set the input field to readonly
                    input.setAttribute('readonly', true);

                    // TODOの内容を更新
                    // Update the content of the TODO
                    todo.content = e.target.value;

                    // 更新したTODOリストをローカルストレージに保存
                    // Save the updated TODO list to local storage
                    localStorage.setItem('todos', JSON.stringify(todos));

                    // TODOリストを再表示
                    // Re-display the TODO list
                    DisplayTodos();
                });
            });

            // Deleteボタンがクリックされたときの処理
            // Handling the click event of the Delete button
            deleteButton.addEventListener('click', e => {
                // TODOリストからこのTODOをフィルタリング
                // Filter this TODO from the TODO list
                todos = todos.filter(t => t !== todo);

                // 更新したTODOリストをローカルストレージに保存
                // Save the updated TODO list to local storage
                localStorage.setItem('todos', JSON.stringify(todos));

                // TODOリストを再表示
                // Re-display the TODO list
                DisplayTodos();
            });

        });
    }
});
