import React, { useEffect } from "react";
import { SessionProvider, useSession } from "@inrupt/solid-ui-react";
import { handleIncomingRedirect } from "@inrupt/solid-client-authn-browser";
import AuthButton from "@/components/auth/AuthButton";
import AddTask from "@/components/tasks/AddTask";
import ViewTasks from "./components/tasks/ViewTasks";
const App = () => {
  const { session } = useSession();

  useEffect(() => {
    const initializeSession = async () => {
      await handleIncomingRedirect();
      console.log("Session après redirection :", session.info);
    };
    initializeSession();
  }, [session]);

  return (
    <SessionProvider>
      <div className="min-h-screen w-full bg-gray-900 py-8 px-4 flex flex-col items-center">
        <div className="w-full max-w-2xl mx-auto space-y-8">
          <h1 className="text-3xl font-bold text-center text-white mb-8">
            Solid To-Do App
          </h1>
          
          <div className="bg-gray-800 rounded-lg p-6 shadow-lg">
            <AuthButton />
          </div>

          <div className="space-y-8">
            <AddTask />
            <ViewTasks />
          </div>
        </div>
      </div>
    </SessionProvider>
  );
};

export default App;
