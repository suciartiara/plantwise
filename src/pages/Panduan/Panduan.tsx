import React, { useState, useEffect } from "react";
import { collection, onSnapshot } from "firebase/firestore";
import { db } from "../../../firebase";
import Navbar from "../../components/Navbar/Navbar";
import { IonContent, IonSearchbar, IonTitle, IonToolbar } from "@ionic/react";
import { MainLayout } from "../../layouts/MainLayout";

type Section = {
  heading: string;
  content: string | string[];
};

type Tutorial = {
  id: string;
  title: string;
  image: string;
  category: string;
  sections: Section[];
};

const Panduan: React.FC = () => {
  const [tutorials, setTutorials] = useState<Tutorial[]>([]);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [selectedTutorial, setSelectedTutorial] = useState<Tutorial | null>(
    null
  );

  useEffect(() => {
    const unsubscribe = onSnapshot(collection(db, "tutorials"), (snapshot) => {
      const data: Tutorial[] = [];
      snapshot.forEach((doc) => {
        data.push({ id: doc.id, ...doc.data() } as Tutorial);
      });
      setTutorials(data);
    });

    return unsubscribe;
  }, []);

  // Group tutorials by category
  const groupedTutorials = tutorials.reduce((acc, tutorial) => {
    if (!acc[tutorial.category]) {
      acc[tutorial.category] = [];
    }
    acc[tutorial.category].push(tutorial);
    return acc;
  }, {} as Record<string, Tutorial[]>);

  // Filter tutorials based on search query
  const filteredTutorials = Object.keys(groupedTutorials).reduce(
    (acc, category) => {
      const filteredByCategory = groupedTutorials[category].filter((tutorial) =>
        tutorial.title.toLowerCase().includes(searchQuery.toLowerCase())
      );
      if (filteredByCategory.length > 0) {
        acc[category] = filteredByCategory;
      }
      return acc;
    },
    {} as Record<string, Tutorial[]>
  );

  return (
    <MainLayout>
      <IonContent>
        <IonToolbar color="primary" className="text-white pl-8">
          <IonTitle className="font-bold">Panduan Tanam</IonTitle>
        </IonToolbar>

        <div className="bg-gray-100 p-4">
          <IonSearchbar
            value={searchQuery}
            debounce={500}
            onIonInput={(e) => setSearchQuery(e.detail.value!)}
            placeholder="Cari Tanaman..."
            className="rounded-lg shadow-sm pb-8 pr-8 pl-8"
          />

          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            {selectedTutorial ? (
              <div className="bg-white shadow-lg rounded-lg p-6">
                <h2 className="text-2xl font-bold mb-4">
                  {selectedTutorial.title}
                </h2>
                <img
                  src={selectedTutorial.image}
                  alt={selectedTutorial.title}
                  className="mb-4 rounded-lg"
                />
                {selectedTutorial.sections.map((section, sectionIndex) => (
                  <div key={sectionIndex} className="mb-6">
                    <h3 className="text-lg font-medium mb-2 text-[#2f4b26]">
                      {section.heading}
                    </h3>
                    {Array.isArray(section.content) ? (
                      <ul className="list-disc pl-6 text-gray-600 space-y-2">
                        {section.content.map((line, lineIndex) => (
                          <li key={lineIndex}>{line}</li>
                        ))}
                      </ul>
                    ) : (
                      <p className="text-gray-600">{section.content}</p>
                    )}
                  </div>
                ))}
                <button
                  onClick={() => setSelectedTutorial(null)}
                  className="mt-6 px-4 py-2 bg-[#2f4b26] text-white rounded-md"
                >
                  Kembali ke Daftar
                </button>
              </div>
            ) : (
              // If no tutorial is selected, show the list of tutorials grouped by category
              Object.keys(filteredTutorials).map((category) => (
                <div key={category} className="mb-12">
                  <h2 className="text-xl font-semibold text-[#2f4b26] mb-4">
                    {"Panduan Tanam " + category}
                  </h2>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {filteredTutorials[category].map((tutorial) => (
                      <div key={tutorial.id} className="mb-6">
                        <div
                          className="bg-white shadow-md rounded-md p-4 cursor-pointer"
                          onClick={() => setSelectedTutorial(tutorial)}
                        >
                          <img
                            src={tutorial.image}
                            alt={tutorial.title}
                            className="w-full h-56 object-cover mb-4 rounded-md"
                          />
                          <h3 className="font-normal text-lg text-[#2f4b26]">
                            {tutorial.title}
                          </h3>
                          <p className="text-sm text-gray-600">Lihat Panduan</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </IonContent>
    </MainLayout>
  );
};

export default Panduan;
