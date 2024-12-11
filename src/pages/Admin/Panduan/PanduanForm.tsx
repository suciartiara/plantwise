import React, { useState, useEffect } from "react";
import { doc, getDoc, updateDoc, addDoc, collection } from "firebase/firestore";
import { db } from "../../../../firebase";
import { IonContent, IonButton, IonInput, IonTextarea } from "@ionic/react";
import { useParams, useHistory } from "react-router-dom";
import AdminLayout from "../../../layouts/AdminLayout";

type Section = {
  heading: string;
  content: string | string[];
};

type PanduanFormProps = {
  isEditMode?: boolean;
};

const PanduanForm: React.FC<PanduanFormProps> = ({ isEditMode = false }) => {
  const [tutorial, setTutorial] = useState<any>(null);
  const [title, setTitle] = useState("");
  const [image, setImage] = useState("");
  const [category, setCategory] = useState("");
  const [sections, setSections] = useState<Section[]>([
    { heading: "", content: "" },
  ]);
  const { id } = useParams<{ id: string }>();
  const history = useHistory();

  // Fetch tutorial data for edit mode
  useEffect(() => {
    if (isEditMode) {
      const fetchTutorial = async () => {
        const docRef = doc(db, "tutorials", id);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          const data = docSnap.data();
          setTutorial(data);
          setTitle(data.title);
          setImage(data.image);
          setCategory(data.category);
          setSections(data.sections);
        }
      };
      fetchTutorial();
    }
  }, [id, isEditMode]);

  // Handle form submission (create or update)
  const handleSubmit = async () => {
    // Validation
    if (!title || !image || !category || sections.length === 0) {
      alert("Semua field harus diisi!");
      return;
    }

    try {
      if (isEditMode) {
        // Update existing tutorial
        const tutorialRef = doc(db, "tutorials", id);
        await updateDoc(tutorialRef, {
          title,
          image,
          category,
          sections,
        });
        alert("Tutorial berhasil diperbarui!");
      } else {
        // Create new tutorial
        const tutorialsRef = collection(db, "tutorials");
        await addDoc(tutorialsRef, {
          title,
          image,
          category,
          sections,
        });
        alert("Tutorial berhasil dibuat!");
      }

      history.push("/admin/panduan");
    } catch (error) {
      console.error("Error submitting document: ", error);
      alert("Terjadi kesalahan saat menyimpan tutorial.");
    }
  };

  // Handle changes to section fields
  const handleSectionChange = (
    index: number,
    field: string,
    value: string | string[]
  ) => {
    const updatedSections = sections.map((section, i) =>
      i === index ? { ...section, [field]: value } : section
    );
    setSections(updatedSections);
  };

  // Add new section to the tutorial
  const handleAddSection = () => {
    setSections([...sections, { heading: "", content: "" }]);
  };

  // Remove a section from the tutorial
  const handleRemoveSection = (index: number) => {
    setSections(sections.filter((_, i) => i !== index));
  };

  // Determine page title and button text based on mode
  const pageTitle = isEditMode ? "Edit Tutorial" : "Tambah Tutorial";
  const submitButtonText = isEditMode ? "Perbarui Tutorial" : "Buat Tutorial";

  // Only show content when in edit mode and tutorial is loaded, or in create mode
  const isReady = !isEditMode || (isEditMode && tutorial);

  return isReady ? (
    <AdminLayout>
      <IonContent className="bg-gray-100 p-6">
        <form className="bg-white shadow-lg rounded-md p-6 space-y-6 max-w-lg mx-auto">
          <h2 className="text-2xl font-bold text-center mb-4">{pageTitle}</h2>

          <div>
            <IonInput
              value={title}
              onIonChange={(e) => setTitle(e.detail.value!)}
              placeholder="Judul Tutorial"
              className="w-full p-3 border-2 border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          <div>
            <IonInput
              value={image}
              onIonChange={(e) => setImage(e.detail.value!)}
              placeholder="URL Gambar"
              className="w-full p-3 border-2 border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          <div>
            <IonInput
              value={category}
              onIonChange={(e) => setCategory(e.detail.value!)}
              placeholder="Kategori"
              className="w-full p-3 border-2 border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          {sections.map((section, index) => (
            <div key={index} className="mb-4">
              <IonInput
                value={section.heading}
                onIonChange={(e) =>
                  handleSectionChange(index, "heading", e.detail.value!)
                }
                placeholder={`Heading ${index + 1}`}
                className="w-full p-3 border-2 border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 mb-2"
                required
              />
              <IonTextarea
                value={
                  Array.isArray(section.content)
                    ? section.content.join("\n")
                    : section.content
                }
                onIonChange={(e) =>
                  handleSectionChange(
                    index,
                    "content",
                    e.detail.value!.split("\n")
                  )
                }
                placeholder={`Konten ${index + 1}`}
                className="w-full p-3 border-2 border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                rows={3}
                required
              />
              {sections.length > 1 && (
                <IonButton
                  color="danger"
                  onClick={() => handleRemoveSection(index)}
                  className="mt-2"
                >
                  Hapus Bagian
                </IonButton>
              )}
            </div>
          ))}

          <IonButton
            onClick={handleAddSection}
            expand="block"
            className="w-full bg-blue-500 text-white mt-2"
          >
            Tambah Bagian
          </IonButton>

          <div className="flex justify-between gap-4 mt-4">
            <IonButton
              color="light"
              expand="block"
              className="w-full"
              onClick={() => history.push("/admin/panduan")}
            >
              Batal
            </IonButton>
            <IonButton expand="block" className="w-full" onClick={handleSubmit}>
              {submitButtonText}
            </IonButton>
          </div>
        </form>
      </IonContent>
    </AdminLayout>
  ) : (
    <div>Loading...</div>
  );
};

export default PanduanForm;
