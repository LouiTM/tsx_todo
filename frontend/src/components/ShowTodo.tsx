import { useState } from 'react'
import type { Todo } from '../App'; // App.tsxからTodoの型をインポート
 // App.tsxからTodoの型をインポート

// Propsの型を定義
interface ShowTodoProps {
  todos: Todo[];
  handleUpdate: (index: number) => void;
  handleDelete: (index: number) => void;
}

// フィルターの状態を型付け（リテラル型）
type FilterType = 'all' | 'waiting' | 'done';

export const ShowTodo = (props: ShowTodoProps) => {
  const { todos, handleUpdate, handleDelete } = props
  const [filter, setFilter] = useState<FilterType>('all')

  const filteredTodos = todos.filter((todo) => {
    if (filter === 'waiting') return todo.status === 'waiting'
    if (filter === 'done') return todo.status === 'done'
    return true
  })

  const filterGroup = (
    <div className="filter-group">
      <button
        type="button"
        className={`filter-btn ${filter === 'all' ? 'active' : ''}`}
        onClick={() => setFilter('all')}
      >
        すべて
      </button>
      <button
        type="button"
        className={`filter-btn ${filter === 'waiting' ? 'active' : ''}`}
        onClick={() => setFilter('waiting')}
      >
        未着手
      </button>
      <button
        type="button"
        className={`filter-btn ${filter === 'done' ? 'active' : ''}`}
        onClick={() => setFilter('done')}
      >
        完了
      </button>
    </div>
  )

  if (todos.length === 0) {
    return (
      <div>
        {filterGroup}
        <div className='todo-container'>
          <div className="empty-state">
            <span className="empty-icon">☕</span>
            <p>現在のタスクはありません。<br />のんびり過ごしましょう。</p>
          </div>
        </div>
      </div>
    )
  }

  const renderEmptyState = () => {
    if (filter === 'waiting') {
      return (
        <div className="empty-state">
          <span className="empty-icon">🎉</span>
          <p>すべてのタスクが完了しています！</p>
        </div>
      )
    }
    if (filter === 'done') {
      return (
        <div className="empty-state">
          <span className="empty-icon">🌱</span>
          <p>完了したタスクはまだありません。<br />マイペースに進めましょう。</p>
        </div>
      )
    }
    return null
  }

  return (
    <div>
      {filterGroup}
      <div className='todo-container'>
        {filteredTodos.length === 0 ? (
          renderEmptyState()
        ) : (
          <ul className="todo-list">
            {filteredTodos.map((todo) => {
              const originalIndex = todos.findIndex(t => t.title === todo.title)
              const isDone = todo.status === 'done'
              const isDeleting = todo.deleting

              return (
                <li className={`todo-item ${isDone ? 'done' : ''} ${isDeleting ? 'deleting' : ''}`} key={todo.title}>
                  <div className="todo-left">
                    <label className="checkbox-container">
                      <input
                        type="checkbox"
                        checked={isDone}
                        onChange={() => handleUpdate(originalIndex)}
                      />
                      <span className="checkmark"></span>
                    </label>
                    <span className="todo-text">{todo.title}</span>
                  </div>

                  <div className="todo-right">
                    <button
                      className="delete-btn"
                      onClick={() => handleDelete(originalIndex)}
                      aria-label="削除"
                    >
                      <svg viewBox="0 0 24 24">
                        <path d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM19 4h-3.5l-1-1h-5l-1 1H5v2h14V4z" />
                      </svg>
                    </button>
                  </div>
                </li>
              )
            })}
          </ul>
        )}
      </div>
    </div>
  )
}