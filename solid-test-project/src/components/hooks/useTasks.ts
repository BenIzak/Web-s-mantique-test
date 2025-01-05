import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import {
  getSolidDataset,
  getThingAll,
  getStringNoLocale,
  setThing,
  saveSolidDatasetAt,
  addStringNoLocale,
  removeThing,
  createSolidDataset,
  createThing,
} from "@inrupt/solid-client"
import { useSession } from "@inrupt/solid-ui-react"
import { RDF } from "@inrupt/vocab-common-rdf"

const TASKS_URL = "http://localhost:3000/ben-tasks/todo/todolist";

const handleError = (error, customMessage) => {
  console.error(customMessage, error);
  throw new Error(customMessage);
};


export const useTasks = () => {
  const { session } = useSession()
  const queryClient = useQueryClient()

  const { data: tasks = [], isLoading, error: fetchError } = useQuery({
    queryKey: ['tasks'],
    queryFn: async () => {
      try {
        const dataset = await getSolidDataset(TASKS_URL, { fetch: session.fetch })
        const things = getThingAll(dataset)
        return things.map((thing) => {
          const isDone = getStringNoLocale(thing, "http://schema.org/complete") === "true";
          console.log("Task status:", {
            name: getStringNoLocale(thing, "http://schema.org/name"),
            isDone: isDone
          });
          return {
            name: getStringNoLocale(thing, "http://schema.org/name") || "Sans titre",
            description: getStringNoLocale(thing, "http://schema.org/description") || "Sans description",
            date: getStringNoLocale(thing, "http://schema.org/date") || "Sans date",
            isDone: isDone,
            url: thing.url,
          };
        })
      } catch (error) {
        handleError(error, "Erreur lors du chargement des tâches.");
        throw new Error("Impossible de charger les tâches. Veuillez réessayer plus tard.");
      }
    },
    enabled: session.info.isLoggedIn,
  })

  const addTaskMutation = useMutation({
    mutationFn: async (variables: {title: string, description: string, date: string}) => {
      try {
        let dataset
        try {
          dataset = await getSolidDataset(TASKS_URL, { fetch: session.fetch })
        } catch (error) {
          if (error.statusCode === 404) {
            dataset = createSolidDataset()
          } else {
            throw error
          }
        }

        const newTask = createThing({ name: `task-${Date.now()}` })
        const taskWithTitle = addStringNoLocale(newTask, RDF.type, "ToDo")
        const taskWithContent = addStringNoLocale(taskWithTitle, "http://schema.org/name", variables.title)
        const taskWithDescription = addStringNoLocale(taskWithContent, "http://schema.org/description", variables.description)
        const taskWithDate = addStringNoLocale(taskWithDescription, "http://schema.org/date", variables.date)
        const taskWithComplete = addStringNoLocale(taskWithDate, "http://schema.org/complete", "false")

        dataset = setThing(dataset, taskWithComplete)
        await saveSolidDatasetAt(TASKS_URL, dataset, { fetch: session.fetch })
      } catch (error) {
        handleError(error, "Erreur lors de l'ajout de la tâche.");
        throw new Error("Impossible d'ajouter la tâche. Veuillez vérifier votre connexion et réessayer.");
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tasks'] })
    },
    onError: (error: Error) => {
      handleError(error, "Erreur lors de l'ajout de la tâche.");
      throw error;
    }
  })

  const updateTaskMutation = useMutation({
    mutationFn: async ({ taskUrl, newTitle }: { taskUrl: string; newTitle: string }) => {
      const dataset = await getSolidDataset(TASKS_URL, { fetch: session.fetch })
      const thing = getThingAll(dataset).find((t) => t.url === taskUrl)
      if (thing) {
        const updatedTask = addStringNoLocale(thing, "http://schema.org/name", newTitle)
        const updatedDataset = setThing(dataset, updatedTask)
        await saveSolidDatasetAt(TASKS_URL, updatedDataset, { fetch: session.fetch })
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tasks'] })
    },
  })

  const deleteTaskMutation = useMutation({
    mutationFn: async (taskUrl: string) => {
      let dataset = await getSolidDataset(TASKS_URL, { fetch: session.fetch })
      dataset = removeThing(dataset, taskUrl)
      await saveSolidDatasetAt(TASKS_URL, dataset, { fetch: session.fetch })
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tasks'] })
    },
  })

  const toggleTaskCompletionMutation = useMutation({
    mutationFn: async ({ taskUrl, isDone }: { taskUrl: string; isDone: boolean }) => {
      try {
        console.log("Tentative de mise à jour du statut:", { taskUrl, isDone });
        const dataset = await getSolidDataset(TASKS_URL, { fetch: session.fetch });
        const thing = getThingAll(dataset).find((t) => t.url === taskUrl);
        
        if (thing) {
          // Récupérer l'état actuel
          console.log("État actuel de la tâche:", {
            name: getStringNoLocale(thing, "http://schema.org/name"),
            isDone: getStringNoLocale(thing, "http://schema.org/complete")
          });

          // Mettre à jour uniquement le statut
          const updatedTask = addStringNoLocale(thing, "http://schema.org/complete", isDone.toString());
          
          // Vérifier l'état après mise à jour
          console.log("État après mise à jour:", {
            name: getStringNoLocale(updatedTask, "http://schema.org/name"),
            isDone: getStringNoLocale(updatedTask, "http://schema.org/complete")
          });

          const updatedDataset = setThing(dataset, updatedTask);
          await saveSolidDatasetAt(TASKS_URL, updatedDataset, { fetch: session.fetch });
          console.log("Mise à jour effectuée avec succès");
        }
      } catch (error) {
        console.error("Erreur lors de la modification du statut:", error);
        throw new Error("Impossible de modifier le statut de la tâche. Veuillez réessayer.");
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tasks'] });
    },
    onError: (error: Error) => {
      handleError(error, "Erreur lors de la modification du statut.");
      throw error;
    }
  });

  return {
    tasks,
    isLoading,
    fetchError,
    refreshTasks: queryClient.invalidateQueries({ queryKey: ['tasks'] }),
    addTask: addTaskMutation.mutateAsync,
    updateTask: updateTaskMutation.mutateAsync,
    deleteTask: deleteTaskMutation.mutateAsync,
    toggleTaskCompletion: toggleTaskCompletionMutation.mutateAsync,
  }
}
