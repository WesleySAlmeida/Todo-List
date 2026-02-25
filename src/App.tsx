import { useEffect, useState } from 'react'
import './App.css'
import { useTheme } from './ThemeContext'

interface TodoItem {
  id: string
  text: string
  completed: boolean
}

function App() {
  const { theme, toggleTheme } = useTheme()

  const STORAGE_KEY = 'todos'

  const [todos, setTodos] = useState<TodoItem[]>([])
  const [newTodo, setNewTodo] = useState<string>('')
  const [message, setMessage] = useState<string>('')
  const [isLoaded, setIsLoaded] = useState<boolean>(false)

  const addTodo = (): void => {
    if (!newTodo.trim()) return

    const newTodoItem: TodoItem = {
      id: crypto.randomUUID(),
      text: newTodo,
      completed: false
    }

    setTodos([...todos, newTodoItem])
    setNewTodo('')
    setMessage('Tarefa adicionada com sucesso ✅')

    setTimeout(() => setMessage(''), 2000)
  }

  const removeTodo = (id: string): void => {
    setTodos(todos.filter(todo => todo.id !== id))
  }

  const toggleComplete = (id: string): void => {
    setTodos(
      todos.map(todo =>
        todo.id === id
          ? { ...todo, completed: !todo.completed }
          : todo
      )
    )
  }

  const getCompletedTodos = (): TodoItem[] =>
    todos.filter(todo => todo.completed)

  useEffect(() => {
    if (isLoaded) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(todos))
    }
  }, [todos, isLoaded])

  useEffect(() => {
    const storedTodos = localStorage.getItem(STORAGE_KEY)
    if (storedTodos) {
      setTodos(JSON.parse(storedTodos))
    }
    setIsLoaded(true)
  }, [])

  return (
    <div className={`App ${theme}`}>
      <div className={`container ${theme}`}>
        <h1>
          Lista de Tarefas – {getCompletedTodos().length} / {todos.length}
        </h1>

        <div className="input-container">
          <input
            type="text"
            value={newTodo}
            onChange={e => setNewTodo(e.target.value)}
          />
          <button onClick={addTodo}>
            Adicionar Tarefa
          </button>
        </div>

        {message && <p className="feedback">{message}</p>}

        <ol>
          {todos.map(todo => (
            <li key={todo.id}>
              <input
                type="checkbox"
                checked={todo.completed}
                onChange={() => toggleComplete(todo.id)}
              />

              <span
                style={{
                  textDecoration: todo.completed ? 'line-through' : 'none'
                }}
              >
                {todo.text}
              </span>

              <button onClick={() => removeTodo(todo.id)}>
                Remover
              </button>
            </li>
          ))}
        </ol>

        <button onClick={toggleTheme}>
          Alterar para o Tema {theme === 'light' ? 'dark' : 'light'}
        </button>
      </div>
    </div>
  )
}

export default App