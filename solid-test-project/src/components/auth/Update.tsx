import React, { useEffect, useState } from "react";
import {
  getSolidDataset,
  getThing,
  setThing,
  saveSolidDatasetAt,
  addStringNoLocale,
  createThing,
} from "@inrupt/solid-client";
import { VCARD, FOAF } from "@inrupt/vocab-common-rdf";
import { useSession } from "@inrupt/solid-ui-react";

const UpdateProfile = () => {
  const { session } = useSession();
  const [status, setStatus] = useState("Mise à jour en attente...");

  useEffect(() => {
    const updateProfile = async () => {
      try {
        setStatus("Mise à jour du profil...");

        // URL du document RDF de ton profil
        const podUrl = "https://storage.inrupt.com/51de7351-dcee-4f89-b72b-f0b171192125/profile";
        const profileUrl = `${podUrl}#me`;

        console.log("Tentative de mise à jour du profil :", podUrl);

        // Récupérer le dataset
        let dataset = await getSolidDataset(podUrl, { fetch: session.fetch });
        let profile = getThing(dataset, profileUrl);

        // Si le profil n'existe pas, le créer
        if (!profile) {
          console.log("Création d'un nouveau profil...");
          profile = createThing({ name: "me" });
        }

        // Ajouter les propriétés vcard:fn et foaf:name
        profile = addStringNoLocale(profile, VCARD.fn, "Ben Le Magnifique");
        profile = addStringNoLocale(profile, FOAF.name, "Ben Le Magnifique");

        // Sauvegarder les modifications
        dataset = setThing(dataset, profile);
        await saveSolidDatasetAt(podUrl, dataset, { fetch: session.fetch });

        setStatus("Profil mis à jour avec succès !");
        console.log("Profil mis à jour avec succès !");
      } catch (error) {
        setStatus("Erreur lors de la mise à jour du profil.");
        console.error("Erreur lors de la mise à jour :", error);
      }
    };

    if (session.info.isLoggedIn) {
      updateProfile();
    } else {
      setStatus("Utilisateur non connecté.");
    }
  }, [session]);

  return <div>{status}</div>;
};

export default UpdateProfile;
