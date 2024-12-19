import React, { useState } from "react";
import { useTasks } from "../hooks/useTasks";

const ViewTasks = () => {
  const { tasks, isLoading, updateTask, deleteTask, toggleTaskCompletion, refreshTasks} = useTasks();
  const [editingTask, setEditingTask] = useState<string | null>(null);
  const [newTitle, setNewTitle] = useState<string>("");
  const [searchArg, setSearchArg] = useState<string>("");

  if (isLoading) {
    return <div className="text-white">Chargement...</div>;
  }

  const filteredTasks = tasks.filter((task) => task.name.includes(searchArg));

  return (
    <div className="space-y-8 w-full bg-gray-800 rounded-lg shadow-lg p-4 max-h-[30vh] overflow-hidden">
      <div className="flex flex-row justify-between items-center">
        <div className="flex flex-row justify-between items-center">
          <h2 className="text-xl font-semibold text-white ">Liste des tâches</h2>
          <button className="cursor-pointer hover:scale-105 transition-all duration-300" onClick={() => refreshTasks}>
            <span className="text-2xl">🔄</span>
          </button>
        </div>
    <input type="text" placeholder="Rechercher une tâche" className="bg-gray-700 text-white p-2 rounded-lg w-1/2" value={searchArg} onChange={(e) => setSearchArg(e.target.value)} />
      </div>
      <div className="h-52 mb-4 overflow-hidden">
            <div className="h-full overflow-y-auto pr-2 space-y-3 snap-y snap-mandatory">
            {filteredTasks.map((task) => (
              <div key={task.url}>
                {editingTask === task.url ? (
                  <div className="flex flex-row justify-between items-center p-4 bg-gray-800 rounded-lg shadow-lg space-x-2 snap-start">
                    <input
                      type="text"
                      className="bg-white text-black p-2 rounded-lg"
                      value={newTitle}
                      onChange={(e) => setNewTitle(e.target.value)}
                      placeholder="Nouveau titre"
                    />
                    <button 
                      className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded"
                      onClick={() => {
                        updateTask({ taskUrl: task.url, newTitle });
                        setEditingTask(null);
                        setNewTitle("");
                      }}
                    >
                      Enregistrer
                    </button>
                    <button 
                      className="bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded"
                      onClick={() => setEditingTask(null)}
                    >
                      Annuler
                    </button>
                  </div>
                ) : (
                  <div className={`flex flex-col p-4 ${task.isDone ? 'bg-gray-700' : 'bg-gray-600'} rounded-lg shadow-lg gap-2 snap-start`}>
                    <div className="flex justify-between items-center">
                      <span className="text-white font-bold">
                        {task.name}
                      </span>
                      <span className={`${task.isDone ? 'text-green-500' : 'text-yellow-500'} font-semibold animate-pulse`}>
                        {task.isDone ? '✓ Terminée' : '⌛ En cours'}
                      </span>
                    </div>
                    <span className="flex flex-row justify-between items-center">
                      <span className="text-white font-bold">Description : {task.description}</span>
                      <span className="text-white font-bold">Date : {task.date}</span>
                    </span>
                    <div className="flex flex-row items-center space-x-2">
                      <button 
                        className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded cursor-pointer"
                        onClick={() => setEditingTask(task.url)}
                      >
                        Éditer
                      </button>
                      <button 
                        className={`${task.isDone ? 'bg-green-600' : 'bg-gray-500'} hover:opacity-80 text-white font-bold py-2 px-4 rounded cursor-pointer`}
                        onClick={() => toggleTaskCompletion({ taskUrl: task.url, isDone: !task.isDone })}
                      >
                        {task.isDone ? 'Terminée' : 'À faire'}
                      </button>
                      <button 
                        className="bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded cursor-pointer"
                        onClick={() => deleteTask(task.url)}
                      >
                        Supprimer
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ))}
            </div>

      </div>
    </div>
  );
};

export default ViewTasks;
