
import { useEffect, useState } from "react";
import "./App.css";

const initialTasks = [
  { id: 1, title: "Learn React basics", completed: false },
  { id: 2, title: "Build my first application", completed: true },
];

function App() {
  const [tasks, setTasks] = useState(() => {
    try {
      const saved = localStorage.getItem("todo-app-tasks");
      return saved ? JSON.parse(saved) : initialTasks;
    } catch {
      return initialTasks;
    }
  });

  const [input, setInput] = useState("");
  const [filter, setFilter] = useState("all");

  useEffect(() => {
    localStorage.setItem("todo-app-tasks", JSON.stringify(tasks));
  }, [tasks]);

  function addTask(event) {
    event.preventDefault();
    const title = input.trim();

    if (!title) return;

    setTasks((current) => [
      ...current,
      { id: Date.now(), title, completed: false },
    ]);
    setInput("");
  }

  function toggleTask(id) {
    setTasks((current) =>
      current.map((task) =>
        task.id === id
          ? { ...task, completed: !task.completed }
          : task
      )
    );
  }

  function deleteTask(id) {
    setTasks((current) => current.filter((task) => task.id !== id));
  }

  function clearCompleted() {
    setTasks((current) => current.filter((task) => !task.completed));
  }

  const visibleTasks = tasks.filter((task) => {
    if (filter === "active") return !task.completed;
    if (filter === "completed") return task.completed;
    return true;
  });

  const completedCount = tasks.filter((task) => task.completed).length;
  const remainingCount = tasks.length - completedCount;

  return (
    <main className="app">
      <header className="header">
        <div className="brand-icon">✓</div>
        <h1>My Tasks</h1>
        <p>Plan your day. Make progress.</p>
      </header>

      <section className="todo-card">
        <form className="add-form" onSubmit={addTask}>
          <input
            type="text"
            value={input}
            onChange={(event) => setInput(event.target.value)}
            placeholder="What do you need to do?"
            aria-label="New task"
            maxLength={200}
          />
          <button type="submit" className="add-button">
            + Add
          </button>
        </form>

        <div className="stats">
          <span>{remainingCount} remaining</span>
          <span>{completedCount} completed</span>
        </div>

        <nav className="filters" aria-label="Filter tasks">
          {["all", "active", "completed"].map((name) => (
            <button
              key={name}
              type="button"
              className={filter === name ? "filter active-filter" : "filter"}
              onClick={() => setFilter(name)}
            >
              {name[0].toUpperCase() + name.slice(1)}
            </button>
          ))}
        </nav>

        <ul className="task-list">
          {visibleTasks.map((task) => (
            <li
              key={task.id}
              className={task.completed ? "task done" : "task"}
            >
              <label className="task-label">
                <input
                  type="checkbox"
                  checked={task.completed}
                  onChange={() => toggleTask(task.id)}
                />
                <span>{task.title}</span>
              </label>
              <button
                className="delete-button"
                type="button"
                onClick={() => deleteTask(task.id)}
                aria-label={`Delete ${task.title}`}
                title="Delete task"
              >
                ×
              </button>
            </li>
          ))}
        </ul>

        {visibleTasks.length === 0 && (
          <div className="empty-state">
            <span>🎯</span>
            <p>
              {tasks.length === 0
                ? "No tasks yet. Add your first task!"
                : "No tasks in this category."}
            </p>
          </div>
        )}

        <footer className="card-footer">
          <span>{tasks.length} total tasks</span>
          <button type="button" onClick={clearCompleted}>
            Clear completed
          </button>
        </footer>
      </section>

      <p className="bottom-note">
        Small steps every day lead to big results.
      </p>
    </main>
  );
}

export default App;
