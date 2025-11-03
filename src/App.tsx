import { useEffect, useState } from "react";
import TodoItem from "./TodoItem";
type Priority = "Urgente" | "Moyenne" | "Basse";
type todo = {
  id: number;
  text: string;
  priority: Priority;
};
type filter = Priority | "Tous";
import "./index.css";
import { Construction } from "lucide-react";

function App() {
  const [input, setInput] = useState<string>("");
  const [priority, setPriority] = useState<Priority>("Moyenne");

  const savedtodos = localStorage.getItem("todos");
  const initialtodos = savedtodos ? JSON.parse(savedtodos) : [];
  const [todos, setTodos] = useState<todo[]>(initialtodos);
  const [filter, setFilter] = useState<filter>("Tous");

  useEffect(() => {
    localStorage.setItem("todos", JSON.stringify(todos));
  }, [todos]);
  function addtodo() {
    if (input.trim() == "") {
      return;
    }
    const Newtodo: todo = {
      id: Date.now(),
      text: input.trim(),
      priority: priority,
    };
    const newtodos = [Newtodo, ...todos];
    setTodos(newtodos);
    setInput("");
    setPriority("Moyenne");
    console.log(newtodos);
  }
  let filtredtodos: todo[] = [];
  if (filter === "Tous") {
    filtredtodos = todos;
  } else {
    filtredtodos = todos.filter((todo) => todo.priority === filter);
  }
  const urgentcount = todos.filter((t) => t.priority === "Urgente").length;
  const medieumcount = todos.filter((t) => t.priority === "Moyenne").length;
  const lowcount = todos.filter((t) => t.priority === "Basse").length;

  const totalcount = todos.length;

  function deletetodo(id: number) {
    const newtodos = todos.filter((todo) => todo.id !== id);
    setTodos(newtodos);
  }
  const [selectedtodos, setSelectedtodos] = useState<Set<number>>(new Set());

  function toggleSelectedTodo(id: number) {
    const newSelected = new Set(selectedtodos);
    if (newSelected.has(id)) {
      newSelected.delete(id);
    } else {
      newSelected.add(id);
    }
    setSelectedtodos(newSelected);
  }
  function finishedSelected() {
    const newtodos = todos.filter((todo) => {
      if (selectedtodos.has(todo.id)) {
        return false;
      } else {
        return true;
      }
    });
    setTodos(newtodos);
    setSelectedtodos(new Set());
  }
  return (
    <div className="flex justify-center">
      <div className="w-2/3 flex flex-col gap-4 my-4 bg-base-300 p-5 rounded-2xl">
        <div className="flex gap-4">
          <input
            type="text"
            className="input w-full"
            placeholder="Ajouter une tache"
            value={input}
            onChange={(e) => setInput(e.target.value)}
          />
          <select
            value={priority}
            onChange={(e) => setPriority(e.target.value as Priority)}
            className="select w-full"
          >
            {" "}
            <option value="Urgente"> Urgente</option>
            <option value="Moyenne">Moyenne</option>
            <option value="Basse">Basse</option>
          </select>
          <button onClick={addtodo} className="btn btn-primary">
            Ajouter
          </button>
        </div>
        <div className="space-y-2 flex-1 h-fit">
          <div className="flex items-center justify-between">
            <div className="flex flex-wrap gap-4 ">
              <button
                className={`btn btn-soft ${
                  filter === "Tous" ? "btn btn-primary" : ""
                }`}
                onClick={() => setFilter("Tous")}
              >
                Tous({totalcount})
              </button>
              <button
                className={`btn btn-soft ${
                  filter === "Urgente" ? "btn btn-primary" : ""
                }`}
                onClick={() => setFilter("Urgente")}
              >
                Urgente({urgentcount})
              </button>

              <button
                className={`btn btn-soft ${
                  filter === "Moyenne" ? "btn btn-primary" : ""
                }`}
                onClick={() => setFilter("Moyenne")}
              >
                Moyenne({medieumcount})
              </button>
              <button
                className={`btn btn-soft ${
                  filter === "Basse" ? "btn btn-primary" : ""
                }`}
                onClick={() => setFilter("Basse")}
              >
                Basse({lowcount})
              </button>
            </div>
            <button
              onClick={finishedSelected}
              className="btn btn-primary"
              disabled={selectedtodos.size === 0}
            >
              Finir la selection ({selectedtodos.size})
            </button>
          </div>
          {filtredtodos.length > 0 ? (
            <ul className="divide-y divide-primary/20">
              {filtredtodos.map((todo) => (
                <li key={todo.id}>
                  <TodoItem
                    todo={todo}
                    onDelete={() => deletetodo(todo.id)}
                    isSelected={selectedtodos.has(todo.id)}
                    onToggleSelect={toggleSelectedTodo}
                  />
                </li>
              ))}
            </ul>
          ) : (
            <div className="flex justify-center items-center flex-col p-5">
              <Construction
                strokeWidth={1}
                className="w-40 h-40 text-primary"
              />
              <p className="text-sm">Aucune tache pour ce filtre</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
export default App;
