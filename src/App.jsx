import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import { Slider } from "@/components/ui/slider";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts";

const initialTransactions = [
  {
    id: 1,
    description: "Salary",
    amount: 5000,
    type: "income",
    category: "Salary",
  },
  {
    id: 2,
    description: "Rent",
    amount: -1000,
    type: "expense",
    category: "Housing",
  },
  {
    id: 3,
    description: "Groceries",
    amount: -200,
    type: "expense",
    category: "Food",
  },
  {
    id: 4,
    description: "Utilities",
    amount: -150,
    type: "expense",
    category: "Utilities",
  },
];

const initialCategories = [
  "Housing",
  "Food",
  "Utilities",
  "Transportation",
  "Entertainment",
  "Salary",
];
const initialSavingsGoal = 10000;
const initialBudget = {
  Housing: 1000,
  Food: 500,
  Utilities: 200,
  Transportation: 300,
  Entertainment: 200,
};

const COLORS = [
  "#0088FE",
  "#00C49F",
  "#FFBB28",
  "#FF8042",
  "#8884D8",
  "#82ca9d",
];

const TransactionForm = ({ addTransaction, categories }) => {
  const [description, setDescription] = useState("");
  const [amount, setAmount] = useState("");
  const [type, setType] = useState("expense");
  const [category, setCategory] = useState(categories[0]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (description && amount) {
      addTransaction({
        id: Date.now(),
        description,
        amount: type === "expense" ? -Number(amount) : Number(amount),
        type,
        category,
      });
      setDescription("");
      setAmount("");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <Input
        type="text"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        placeholder="Description"
        className="w-full"
      />
      <Input
        type="number"
        value={amount}
        onChange={(e) => setAmount(e.target.value)}
        placeholder="Amount"
        className="w-full"
      />
      <div className="flex space-x-2">
        <Button
          type="button"
          onClick={() => setType("expense")}
          variant={type === "expense" ? "default" : "outline"}
          className="w-1/2"
        >
          Expense
        </Button>
        <Button
          type="button"
          onClick={() => setType("income")}
          variant={type === "income" ? "default" : "outline"}
          className="w-1/2"
        >
          Income
        </Button>
      </div>
      <select
        value={category}
        onChange={(e) => setCategory(e.target.value)}
        className="w-full p-2 border rounded"
      >
        {categories.map((cat) => (
          <option key={cat} value={cat}>
            {cat}
          </option>
        ))}
      </select>
      <Button type="submit" className="w-full">
        Add Transaction
      </Button>
    </form>
  );
};

const TransactionList = ({ transactions }) => (
  <div className="space-y-2 max-h-60 overflow-y-auto">
    {transactions.map((transaction) => (
      <div
        key={transaction.id}
        className={`p-2 rounded ${
          transaction.type === "income" ? "bg-green-100" : "bg-red-100"
        }`}
      >
        <span>{transaction.description}</span>
        <span className="float-right">
          ${Math.abs(transaction.amount).toFixed(2)}
        </span>
        <div className="text-sm text-gray-500">{transaction.category}</div>
      </div>
    ))}
  </div>
);

const SpendingChart = ({ transactions }) => {
  const expensesByCategory = transactions
    .filter((t) => t.type === "expense")
    .reduce((acc, t) => {
      if (!acc[t.category]) acc[t.category] = 0;
      acc[t.category] += Math.abs(t.amount);
      return acc;
    }, {});

  const data = Object.entries(expensesByCategory).map(([name, value]) => ({
    name,
    value,
  }));

  return (
    <ResponsiveContainer width="100%" height={300}>
      <PieChart>
        <Pie
          data={data}
          dataKey="value"
          nameKey="name"
          cx="50%"
          cy="50%"
          outerRadius={80}
          fill="#8884d8"
          label
        >
          {data.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
          ))}
        </Pie>
        <Tooltip />
      </PieChart>
    </ResponsiveContainer>
  );
};

const SavingsGoalTracker = ({ currentSavings, goal }) => {
  const progress = Math.min((currentSavings / goal) * 100, 100);

  return (
    <div className="space-y-2">
      <div className="flex justify-between">
        <span>Savings Goal: ${goal.toFixed(2)}</span>
        <span>Current: ${currentSavings.toFixed(2)}</span>
      </div>
      <Progress value={progress} className="w-full" />
    </div>
  );
};

const BudgetPlanner = ({ budget, setBudget, expenses }) => {
  const [tempBudget, setTempBudget] = useState(budget);

  const handleSliderChange = (category, value) => {
    setTempBudget({ ...tempBudget, [category]: value[0] });
  };

  const handleSave = () => {
    setBudget(tempBudget);
  };

  return (
    <div className="space-y-4">
      {Object.entries(tempBudget).map(([category, amount]) => (
        <div key={category} className="space-y-2">
          <div className="flex justify-between">
            <span>{category}</span>
            <span>${amount}</span>
          </div>
          <Slider
            defaultValue={[amount]}
            max={5000}
            step={10}
            onValueChange={(value) => handleSliderChange(category, value)}
          />
          <Progress
            value={((expenses[category] || 0) / amount) * 100}
            className="h-2"
          />
        </div>
      ))}
      <Button onClick={handleSave} className="w-full">
        Save Budget
      </Button>
    </div>
  );
};

const CategoryEditor = ({ categories, setCategories }) => {
  const [newCategory, setNewCategory] = useState("");

  const handleAddCategory = () => {
    if (newCategory && !categories.includes(newCategory)) {
      setCategories([...categories, newCategory]);
      setNewCategory("");
    }
  };

  const handleRemoveCategory = (category) => {
    setCategories(categories.filter((c) => c !== category));
  };

  return (
    <div className="space-y-4">
      <div className="flex space-x-2">
        <Input
          type="text"
          value={newCategory}
          onChange={(e) => setNewCategory(e.target.value)}
          placeholder="New category"
          className="flex-grow"
        />
        <Button onClick={handleAddCategory}>Add</Button>
      </div>
      <div className="space-y-2">
        {categories.map((category) => (
          <div key={category} className="flex justify-between items-center">
            <span>{category}</span>
            <Button
              onClick={() => handleRemoveCategory(category)}
              variant="destructive"
              size="sm"
            >
              Remove
            </Button>
          </div>
        ))}
      </div>
    </div>
  );
};

const FinancialGoalSetter = ({ setGoal }) => {
  const [newGoal, setNewGoal] = useState("");

  const handleSetGoal = () => {
    if (newGoal && !isNaN(newGoal)) {
      setGoal(Number(newGoal));
      setNewGoal("");
    }
  };

  return (
    <div className="space-y-4">
      <Input
        type="number"
        value={newGoal}
        onChange={(e) => setNewGoal(e.target.value)}
        placeholder="Enter new savings goal"
        className="w-full"
      />
      <Button onClick={handleSetGoal} className="w-full">
        Set New Goal
      </Button>
    </div>
  );
};

export default function App() {
  const [transactions, setTransactions] = useState(initialTransactions);
  const [categories, setCategories] = useState(initialCategories);
  const [savingsGoal, setSavingsGoal] = useState(initialSavingsGoal);
  const [budget, setBudget] = useState(initialBudget);

  const addTransaction = (transaction) => {
    setTransactions((prevTransactions) => [...prevTransactions, transaction]);
  };

  const totalIncome = transactions
    .filter((t) => t.type === "income")
    .reduce((sum, t) => sum + t.amount, 0);

  const totalExpenses = transactions
    .filter((t) => t.type === "expense")
    .reduce((sum, t) => sum + Math.abs(t.amount), 0);

  const currentSavings = totalIncome - totalExpenses;

  const expensesByCategory = transactions
    .filter((t) => t.type === "expense")
    .reduce((acc, t) => {
      if (!acc[t.category]) acc[t.category] = 0;
      acc[t.category] += Math.abs(t.amount);
      return acc;
    }, {});

  return (
    <div className="container mx-auto p-4 sm:p-6 space-y-6">
      <h1 className="text-3xl font-bold mb-6">Personal Finance Dashboard</h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Add Transaction</CardTitle>
          </CardHeader>
          <CardContent>
            <TransactionForm
              addTransaction={addTransaction}
              categories={categories}
            />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Recent Transactions</CardTitle>
          </CardHeader>
          <CardContent>
            <TransactionList transactions={transactions.slice(-5).reverse()} />
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Financial Summary</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <p>Total Income: ${totalIncome.toFixed(2)}</p>
              <p>Total Expenses: ${totalExpenses.toFixed(2)}</p>
              <p>Current Savings: ${currentSavings.toFixed(2)}</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Savings Goal Tracker</CardTitle>
          </CardHeader>
          <CardContent>
            <SavingsGoalTracker
              currentSavings={currentSavings}
              goal={savingsGoal}
            />
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Spending by Category</CardTitle>
        </CardHeader>
        <CardContent>
          <SpendingChart transactions={transactions} />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Budget Overview</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {Object.entries(budget).map(([category, amount]) => (
              <div key={category} className="space-y-2">
                <div className="flex justify-between">
                  <span>{category}</span>
                  <span>
                    ${amount} (${expensesByCategory[category] || 0} spent)
                  </span>
                </div>
                <Progress
                  value={((expensesByCategory[category] || 0) / amount) * 100}
                  className="h-2"
                />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        <Dialog>
          <DialogTrigger asChild>
            <Button className="w-full">Budget Planner</Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Budget Planner</DialogTitle>
            </DialogHeader>
            <BudgetPlanner
              budget={budget}
              setBudget={setBudget}
              expenses={expensesByCategory}
            />
          </DialogContent>
        </Dialog>

        <Dialog>
          <DialogTrigger asChild>
            <Button className="w-full">Edit Categories</Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Edit Expense Categories</DialogTitle>
            </DialogHeader>
            <CategoryEditor
              categories={categories}
              setCategories={setCategories}
            />
          </DialogContent>
        </Dialog>

        <Dialog>
          <DialogTrigger asChild>
            <Button className="w-full">Set Financial Goal</Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Set Financial Goal</DialogTitle>
            </DialogHeader>
            <FinancialGoalSetter setGoal={setSavingsGoal} />
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}