import React, { useState, useMemo } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardFooter,
  CardDescription,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { PieChart, Pie, Cell, Tooltip } from "recharts";

const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#AF19FF"];

function FinancialDashboard() {
  const [transactions, setTransactions] = useState([]);
  const [newTransaction, setNewTransaction] = useState({
    amount: "",
    category: "",
    type: "expense",
  });
  const [goal, setGoal] = useState({ amount: 1000, current: 0 });

  const totalIncome = useMemo(
    () =>
      transactions
        .filter((t) => t.type === "income")
        .reduce((sum, t) => sum + parseFloat(t.amount), 0),
    [transactions]
  );

  const totalExpenses = useMemo(
    () =>
      transactions
        .filter((t) => t.type === "expense")
        .reduce((sum, t) => sum + parseFloat(t.amount), 0),
    [transactions]
  );

  const savings = totalIncome - totalExpenses;
  const goalProgress = Math.min((savings / goal.amount) * 100, 100);

  const categories = useMemo(
    () => [...new Set(transactions.map((t) => t.category))],
    [transactions]
  );

  const dataForPie = categories.map((category) => ({
    name: category,
    value: transactions
      .filter((t) => t.category === category && t.type === "expense")
      .reduce((sum, t) => sum + parseFloat(t.amount), 0),
  }));

  const addTransaction = () => {
    if (newTransaction.amount && newTransaction.category) {
      setTransactions([
        ...transactions,
        { ...newTransaction, amount: parseFloat(newTransaction.amount) },
      ]);
      setNewTransaction({ amount: "", category: "", type: "expense" });
    }
  };

  return (
    <div className="container mx-auto p-4 sm:p-6">
      <Card className="mb-4">
        <CardHeader>
          <CardTitle>Financial Overview</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-3 gap-4">
            <div>Income: ${totalIncome}</div>
            <div>Expenses: ${totalExpenses}</div>
            <div>Savings: ${savings}</div>
          </div>
        </CardContent>
      </Card>

      <Card className="mb-4">
        <CardHeader>
          <CardTitle>Add Transaction</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col space-y-2">
            <Input
              type="number"
              placeholder="Amount"
              value={newTransaction.amount}
              onChange={(e) =>
                setNewTransaction({ ...newTransaction, amount: e.target.value })
              }
            />
            <Input
              placeholder="Category"
              value={newTransaction.category}
              onChange={(e) =>
                setNewTransaction({
                  ...newTransaction,
                  category: e.target.value,
                })
              }
            />
            <select
              value={newTransaction.type}
              onChange={(e) =>
                setNewTransaction({ ...newTransaction, type: e.target.value })
              }
            >
              <option value="expense">Expense</option>
              <option value="income">Income</option>
            </select>
            <Button onClick={addTransaction}>Add</Button>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Savings Goal</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between">
            <span>Goal: ${goal.amount}</span>
            <progress
              className="progress w-56"
              value={goalProgress}
              max="100"
            ></progress>
            <span>{goalProgress.toFixed(2)}%</span>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Spending by Category</CardTitle>
        </CardHeader>
        <CardContent className="flex justify-center">
          <PieChart width={400} height={400}>
            <Pie
              data={dataForPie}
              dataKey="value"
              nameKey="name"
              cx="50%"
              cy="50%"
              outerRadius={100}
              fill="#8884d8"
              label
            >
              {dataForPie.map((entry, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={COLORS[index % COLORS.length]}
                />
              ))}
            </Pie>
            <Tooltip />
          </PieChart>
        </CardContent>
      </Card>
    </div>
  );
}

export default function App() {
  return <FinancialDashboard />;
}
