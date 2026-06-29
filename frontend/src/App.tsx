import './App.css'
import { useState, useEffect } from 'react'
import { ShowTodo } from './components/ShowTodo'
import { AddInput } from './components/AddInput'

export type TodoStatus = 'waiting' | 'done' | 'in process';

export interface Todo {
  id?: number; 
  title: string;
  status: TodoStatus;
  deleting?: boolean;
}

interface ToastInfo {
  message: string;
  type: 'success' | 'error';
}

function App() {

  const [todos, setTodos] = useState<Todo[]>([])
  const [title, setTitle] = useState<string>("")
  const [toast, setToast] = useState<ToastInfo | null>(null)

  const showToast = (message: string, type: 'success' | 'error' = 'error') => {
    setToast({ message, type })
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTitle(e.target.value);
  }

  const fetchTodos = () => {
    fetch('/todos')
      .then(response => response.json())
      .then(data => setTodos(data))
      .catch(err => showToast('データの取得に失敗しました'));
  }

  useEffect(() => {
    fetchTodos();
  }, []);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const trimmed = title.trim()

    if (!trimmed) return

    const existingIndex = todos.findIndex(todo => todo.title === trimmed && !todo.deleting)
    if (existingIndex !== -1) {
      if (todos[existingIndex].status === 'done') {
        setTodos([...todos.filter((_, i) => i !== existingIndex), { title: trimmed, status: 'waiting' }])
        showToast('完了済みのタスクを未完了として再登録しました。', 'success')
      } else {
        showToast('同じ名前の未完了タスクが既にリストに存在します。')
      }
      setTitle('')
      return
    }

    if (todos.length >= 5) {
      showToast('タスクは最大5件まで登録可能です。')
      setTitle('')
      return
    }

    const newTodo = { title: trimmed, status: 'waiting' };

    try {
      await fetch('/todos', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newTodo)
      });
      setTitle('');
      fetchTodos();
    } catch (err) {
      showToast('タスクの追加に失敗しました');
    }
  }

  const handleDelete = async (index: number) => {
    const targetTodo = todos[index];
    if (targetTodo.status === 'waiting') {
      showToast('未完了のタスクは削除できません。')
      return
    }

    try {
      if (targetTodo.id) {
        await fetch(`/todos/${targetTodo.id}`, { method: 'DELETE' });
      }
      
      setTodos(prev => prev.map(todo =>
        todo.title === targetTodo.title ? { ...todo, deleting: true } : todo
      ))
      setTimeout(() => {
        fetchTodos();
        showToast('タスクを削除しました。', 'success')
      }, 300)
    } catch (err) {
      showToast('タスクの削除に失敗しました');
    }
  }

  const handleUpdate = async (index: number) => {
    const targetTodo = todos[index];
    const updatedStatus = targetTodo.status === 'done' ? 'waiting' : 'done';
    
    try {
      if (targetTodo.id) {
        await fetch(`/todos/${targetTodo.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            title: targetTodo.title,
            status: updatedStatus
          })
        });
      }
      fetchTodos();
    } catch (err) {
      showToast('タスクの更新に失敗しました');
    }
  }


  useEffect(() => {
    if (toast) {
      const timer = setTimeout(() => setToast(null), 3000)
      return () => clearTimeout(timer)
    }
  }, [toast])

  return (
    <div className="app-container">
      {toast && (
        <div className="toast-container">
          <div className={`toast ${toast.type}`}>
            <span>{toast.message}</span>
            <button className="toast-close" onClick={() => setToast(null)}>
              &times;
            </button>
          </div>
        </div>
      )}
      <AddInput title={title} handleSubmit={handleSubmit} handleInputChange={handleInputChange} />
      <ShowTodo todos={todos} handleUpdate={handleUpdate} handleDelete={handleDelete} />
    </div>
  )
}

export default App