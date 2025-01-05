import React from "react";
import {
  CombinedDataProvider,
  LoginButton,
  LogoutButton,
  useSession,
  Text,
} from "@inrupt/solid-ui-react";

const authOptions = {
  clientName: "Solid To-Do App",
};

const AuthButton = () => {
  const { session } = useSession();

  console.log("Session Info:", session.info);

  const datasetUrl = "http://localhost:3000/ben-tasks/profile/card";
  const thingUrl = `${datasetUrl}#me`;

  return (
    <div className="flex flex-col items-center justify-center gap-4">
      {session.info.isLoggedIn ? (
        <div className="flex flex-col items-center justify-center gap-4">
          <CombinedDataProvider datasetUrl={datasetUrl} thingUrl={thingUrl}>
            <span>You are logged in as: </span>
            <span
              className="text-white font-bold text-xl"
            >
            <Text
              properties={[
                "http://www.w3.org/2006/vcard/ns#fn",
                "http://xmlns.com/foaf/0.1/name",
              ]}
            />
            </span>
          </CombinedDataProvider>
          <span className="bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded cursor-pointer">
          <LogoutButton />
          </span>
        </div>
      ) : (
        <span className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded cursor-pointer">
        <LoginButton
          oidcIssuer="http://localhost:3000"
          redirectUrl={window.location.href}
          authOptions={authOptions}
        />
        </span>
      )}
    </div>
  );
};

export default AuthButton;
