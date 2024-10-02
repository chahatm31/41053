import React, { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
  CardFooter,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { PieChart, Pie, Cell, Tooltip } from "recharts";

const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042"];

const TransactionForm = ({ onAddTransaction }) => {
  const [amount, setAmount] = useState("");
  const [type, setType] = useState("income");
  const [category, setCategory] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!amount || !category) return;
    onAddTransaction({
      amount: parseFloat(amount),
      type,
      category,
      date: new Date().toISOString().split("T")[0],
    });
    setAmount("");
    setCategory("");
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Add Transaction</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <Label htmlFor="amount">Amount</Label>
            <Input
              id="amount"
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="Enter amount"
            />
          </div>
          <div className="mb-4">
            <Label htmlFor="type">Type</Label>
            <select
              id="type"
              className="p-2 border rounded w-full"
              value={type}
              onChange={(e) => setType(e.target.value)}
            >
              <option value="income">Income</option>
              <option value="expense">Expense</option>
            </select>
          </div>
          <div className="mb-4">
            <Label htmlFor="category">Category</Label>
            <Input
              id="category"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              placeholder="Category"
            />
          </div>
          <Button type="submit">Add</Button>
        </form>
      </CardContent>
    </Card>
  );
};

const SavingsGoal = ({ goal = 0, currentSavings = 0 }) => {
  const progress = (currentSavings / goal) * 100 || 0;

  return (
    <Card>
      <CardHeader>
        <CardTitle>Savings Goal</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="mb-4">
          <p>Goal: ${goal}</p>
          <p>Current: ${currentSavings}</p>
          <progress
            className="progress w-full"
            value={progress}
            max="100"
          ></progress>
        </div>
      </CardContent>
    </Card>
  );
};

const BudgetPlanner = ({ budget, expenses }) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Budget Planner</CardTitle>
      </CardHeader>
      <CardContent>
        {Object.keys(budget).map((category) => (
          <div key={category} className="mb-2">
            <Label>{category}</Label>
            <p>
              Spent: ${expenses[category] || 0} / Budget: ${budget[category]}
            </p>
          </div>
        ))}
      </CardContent>
    </Card>
  );
};

const PieChartComponent = ({ data }) => (
  <PieChart width={300} height={300}>
    <Pie
      data={data}
      cx="50%"
      cy="50%"
      labelLine={false}
      label
      outerRadius={80}
      fill="#8884d8"
      dataKey="value"
    >
      {data.map((entry, index) => (
        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
      ))}
    </Pie>
    <Tooltip />
  </PieChart>
);

function App() {
  const [transactions, setTransactions] = useState([]);
  const [savingsGoal, setSavingsGoal] = useState(1000);
  const [budget, setBudget] = useState({
    food: 300,
    transport: 200,
    entertainment: 100,
  });

  const addTransaction = (transaction) => {
    setTransactions([...transactions, transaction]);
  };

  const totalIncome = transactions
    .filter((t) => t.type === "income")
    .reduce((sum, t) => sum + t.amount, 0);
  const totalExpense = transactions
    .filter((t) => t.type === "expense")
    .reduce((sum, t) => sum + t.amount, 0);
  const currentSavings = totalIncome - totalExpense;

  const expensesByCategory = transactions
    .filter((t) => t.type === "expense")
    .reduce((acc, t) => {
      acc[t.category] = (acc[t.category] || 0) + t.amount;
      return acc;
    }, {});

  const pieChartData = Object.entries(expensesByCategory).map(
    ([name, value]) => ({ name, value })
  );

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Personal Finance Dashboard</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <TransactionForm onAddTransaction={addTransaction} />
        <SavingsGoal goal={savingsGoal} currentSavings={currentSavings} />
        <Card>
          <CardHeader>
            <CardTitle>Overview</CardTitle>
          </CardHeader>
          <CardContent>
            <p>Income: ${totalIncome}</p>
            <p>Expenses: ${totalExpense}</p>
            <p>Savings: ${currentSavings}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Expenses by Category</CardTitle>
          </CardHeader>
          <CardContent>
            {pieChartData.length > 0 ? (
              <PieChartComponent data={pieChartData} />
            ) : (
              <p>No expenses yet.</p>
            )}
          </CardContent>
        </Card>
        <BudgetPlanner budget={budget} expenses={expensesByCategory} />
      </div>
    </div>
  );
}

export default App;
