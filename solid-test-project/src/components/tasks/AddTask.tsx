import React, { useState } from "react";
import { useTasks } from "../hooks/useTasks";
import { useNotification } from "@/components/hooks/useNotification";

const AddTask = () => {
  const { addTask } = useTasks();
  const { notification, showNotification } = useNotification();
  const [taskTitle, setTaskTitle] = useState("");
  const [taskDescription, setTaskDescription] = useState("");
  const [taskDate, setTaskDate] = useState("");

  const handleAddTask = async () => {
    if (!taskTitle.trim()) {
      showNotification("Le titre de la tâche est requis", "error");
      return;
    }
    if (!taskDate) {
      alert("La date est requise");
      return;
    }
    
    try {
      await addTask({title: taskTitle.trim(), description: taskDescription.trim(), date: taskDate});
      showNotification("Tâche ajoutée avec succès", "success");
      setTaskTitle("");
      setTaskDescription("");
      setTaskDate("");
    } catch (error) {
      showNotification(error.message, "error");
    }
  };

  return (
    <div className="w-full mx-auto p-6 bg-gray-800 rounded-lg shadow-lg">
      {notification && (
        <div className={`mb-4 p-4 rounded-lg ${
          notification.type === 'success' ? 'bg-green-500' : 'bg-red-500'
        } text-white`}>
          {notification.message}
        </div>
      )}
      <h2 className="text-xl font-semibold mb-4 text-white">Ajouter une tâche</h2>
      <div className="flex flex-col gap-2">
        <input
          type="text"
          placeholder="Titre de la tâche"
          value={taskTitle}
          onChange={(e) => setTaskTitle(e.target.value)}
          className="flex-1 px-4 py-2 rounded-lg bg-gray-700 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <input
          type="text"
          placeholder="Description de la tâche"
          value={taskDescription}
          onChange={(e) => setTaskDescription(e.target.value)}
          className="flex-1 px-4 py-2 rounded-lg bg-gray-700 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <input
          type="date"
          placeholder="Date de la tâche"
          value={taskDate}
          onChange={(e) => setTaskDate(e.target.value)}
          className="flex-1 px-4 py-2 rounded-lg bg-gray-700 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <button
          onClick={handleAddTask}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          Ajouter
        </button>
      </div>
    </div>
  );
};

export default AddTask;
