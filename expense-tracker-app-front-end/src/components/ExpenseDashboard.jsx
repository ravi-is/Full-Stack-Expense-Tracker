import React, { useState, useEffect } from "react";
import "./ExpenseDashboard.css";

function ExpenseDashboard() {
  const [expenses, setExpenses] = useState([]);
  const [newExpense, setNewExpense] = useState({ category: "", amount: "", comments: "" });
  const [editingExpense, setEditingExpense] = useState(null);

  useEffect(() => {
    fetchExpenses();
  }, []);

  const fetchExpenses = async () => {
    const response = await fetch("http://localhost:8080/api/expenses");
    const data = await response.json();
    setExpenses(data);
  };

  const addExpense = async (e) => {
    e.preventDefault();
    const response = await fetch("http://localhost:8080/api/expenses", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(newExpense),
    });

    if (response.ok) {
      fetchExpenses();
      setNewExpense({ category: "", amount: "", comments: "" });
    }
  };

  const updateExpense = async (id) => {
    const response = await fetch(`http://localhost:8080/api/expenses/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(editingExpense),
    });

    if (response.ok) {
      fetchExpenses();
      setEditingExpense(null);
    }
  };

  const deleteExpense = async (id) => {
    const response = await fetch(`http://localhost:8080/api/expenses/${id}`, {
      method: "DELETE",
    });

    if (response.ok) {
      fetchExpenses();
    }
  };

  return (
    <div className="dashboard-container">
      <h2>Expense Dashboard</h2>

      {/* Add Expense Form */}
      <form onSubmit={addExpense}>
        <input
          type="text"
          placeholder="Category"
          value={newExpense.category}
          onChange={(e) => setNewExpense({ ...newExpense, category: e.target.value })}
          required
        />
        <input
          type="number"
          placeholder="Amount"
          value={newExpense.amount}
          onChange={(e) => setNewExpense({ ...newExpense, amount: e.target.value })}
          required
        />
        <input
          type="text"
          placeholder="Comments"
          value={newExpense.comments}
          onChange={(e) => setNewExpense({ ...newExpense, comments: e.target.value })}
        />
        <button type="submit">Add Expense</button>
      </form>

      {}
      <table>
        <thead>
          <tr>
            <th>Category</th>
            <th>Amount</th>
            <th>Comments</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {expenses.map((expense) => (
            <tr key={expense.id}>
              {editingExpense && editingExpense.id === expense.id ? (
                <>
                  <td>
                    <input
                      type="text"
                      value={editingExpense.category}
                      onChange={(e) =>
                        setEditingExpense({ ...editingExpense, category: e.target.value })
                      }
                    />
                  </td>
                  <td>
                    <input
                      type="number"
                      value={editingExpense.amount}
                      onChange={(e) =>
                        setEditingExpense({ ...editingExpense, amount: e.target.value })
                      }
                    />
                  </td>
                  <td>
                    <input
                      type="text"
                      value={editingExpense.comments}
                      onChange={(e) =>
                        setEditingExpense({ ...editingExpense, comments: e.target.value })
                      }
                    />
                  </td>
                  <td>
                    <button onClick={() => updateExpense(expense.id)}>Save</button>
                    <button onClick={() => setEditingExpense(null)}>Cancel</button>
                  </td>
                </>
              ) : (
                <>
                  <td>{expense.category}</td>
                  <td>{expense.amount}</td>
                  <td>{expense.comments}</td>
                  <td>
                    <button onClick={() => setEditingExpense(expense)}>Edit</button>
                    <button onClick={() => deleteExpense(expense.id)}>Delete</button>
                  </td>
                </>
              )}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default ExpenseDashboard;
