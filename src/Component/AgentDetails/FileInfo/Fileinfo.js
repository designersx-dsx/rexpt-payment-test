import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import axios from "axios";
import HeaderBar from "../../HeaderBar/HeaderBar";
import styles from "./Fileinfo.module.css";
import { FiDownload, FiTrash2 } from "react-icons/fi";
import {
  deleteAgentFile,
  getAgentFiles,
  uploadAgentFiles,
} from "../../../Store/apiStore";
import PopUp from "../../Popup/Popup";

const MAX_FILES = 5;

const Fileinfo = () => {
  const location = useLocation();
  const { agent_id, knowledgeBaseId } = location.state || {};
  const [knowledgeBaseSources, setKnowledgeBaseSources] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [popup, setPopup] = useState({
    show: false,
    type: "",
    message: "",
    onConfirm: null,
  });

  const closePopup = () => {
    setPopup({ show: false, type: "", message: "", onConfirm: null });
  };

  const fetchKnowledgeBaseDetails = async () => {
    if (!knowledgeBaseId) return;
    try {
      const response = await axios.get(
        `https://api.retellai.com/get-knowledge-base/${knowledgeBaseId}`,
        {
          headers: {
            Authorization: `Bearer ${process.env.REACT_APP_API_RETELL_API}`,
          },
        }
      );
      setKnowledgeBaseSources(response.data.knowledge_base_sources || []);
    } catch (error) {
      console.error("Failed to fetch knowledge base details:", error);
      setPopup({
        show: true,
        type: "failed",
        message: "Failed to fetch knowledge base details.",
        onConfirm: null,
      });
    }
  };

  useEffect(() => {
    fetchKnowledgeBaseDetails();
  }, [knowledgeBaseId]);

  const handleFileChange = (e) => {
    const newFiles = Array.from(e.target.files);
    const combinedFiles = [...selectedFiles, ...newFiles];

    if (combinedFiles.length > MAX_FILES) {
      setPopup({
        show: true,
        type: "failed",
        message: `You can upload a maximum of ${MAX_FILES} files at a time.`,
        onConfirm: null,
      });
      return;
    }

    const uniqueFiles = combinedFiles.filter(
      (file, index, self) =>
        index === self.findIndex((f) => f.name === file.name)
    );

    setSelectedFiles(uniqueFiles);
  };

  const handleRemoveFile = (fileName) => {
    const filtered = selectedFiles.filter((file) => file.name !== fileName);
    setSelectedFiles(filtered);
  };

  const handleSubmit = async () => {
    if (!knowledgeBaseId || selectedFiles.length === 0) {
      setPopup({
        show: true,
        type: "failed",
        message: "Please select files",
        onConfirm: null,
      });
      return;
    }

    try {
      // Step 1: Upload files to the server
      const uploadResponse = await uploadAgentFiles(agent_id, selectedFiles);

      if (
        !uploadResponse ||
        !uploadResponse.files ||
        uploadResponse.files.length === 0
      ) {
        setPopup({
          show: true,
          type: "failed",
          message: "Failed to upload files to the server.",
          onConfirm: null,
        });
        return;
      }

      const newServerFileNames = uploadResponse.files.map(
        (file) => file.filename
      );
      localStorage.setItem(
        "newlyUploadedFiles",
        JSON.stringify(newServerFileNames)
      );

      // Step 2: Fetch server files
      const serverFilesResponse = await getAgentFiles(agent_id);
      const serverFiles = serverFilesResponse.files;

      if (!serverFiles || serverFiles.length === 0) {
        setPopup({
          show: true,
          type: "failed",
          message: "Failed to retrieve files from the server.",
          onConfirm: null,
        });
        localStorage.removeItem("newlyUploadedFiles");
        return;
      }

      const storedFileNames = JSON.parse(
        localStorage.getItem("newlyUploadedFiles") || "[]"
      );
      const filesForRetell = serverFiles.filter((serverFile) =>
        storedFileNames.includes(serverFile.name)
      );

      if (filesForRetell.length === 0) {
        setPopup({
          show: true,
          type: "failed",
          message: "No matching files found on the server to upload to Retell.",
          onConfirm: null,
        });
        localStorage.removeItem("newlyUploadedFiles");
        return;
      }

      // Step 3: Prepare formData for Retell
      const formData = new FormData();
      filesForRetell.forEach((file) => {
        const byteCharacters = atob(file.data);
        const byteNumbers = new Array(byteCharacters.length);
        for (let i = 0; i < byteCharacters.length; i++) {
          byteNumbers[i] = byteCharacters.charCodeAt(i);
        }
        const byteArray = new Uint8Array(byteNumbers);
        const blob = new Blob([byteArray], {
          type: "application/octet-stream",
        });
        const fileToUpload = new File([blob], file.name);

        formData.append("knowledge_base_files", fileToUpload);
        formData.append("filename", fileToUpload.name);
      });

      // Step 4: Upload to Retell
      const retellResponse = await axios.post(
        `https://api.retellai.com/add-knowledge-base-sources/${knowledgeBaseId}`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${process.env.REACT_APP_API_RETELL_API}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );

      if (retellResponse.status === 200) {
        // Close the modal and clear selected files as soon as the files are uploaded
        setShowModal(false); // Close the modal
        setSelectedFiles([]); // Clear selected files

        setPopup({
          show: true,
          type: "success",
          message: "Files uploaded successfully!",
          onConfirm: () => {
            fetchKnowledgeBaseDetails(); // Fetch updated details after successful upload
            closePopup();
          },
        });
      } else {
        console.error("Upload failed with status:", retellResponse.status);
        setPopup({
          show: true,
          type: "failed",
          message: "Upload failed.",
          onConfirm: null,
        });
      }
    } catch (error) {
      console.error("Error during upload:", error);
      setPopup({
        show: true,
        type: "failed",
        message: "Upload failed.",
        onConfirm: null,
      });
    } finally {
      localStorage.removeItem("newlyUploadedFiles");
    }
  };

  const performDelete = async (sourceId) => {
    const fileToDelete = knowledgeBaseSources.find(
      (source) => source.source_id === sourceId
    );
    if (!fileToDelete) {
      setPopup({
        show: true,
        type: "failed",
        message: "Could not find file to delete.",
        onConfirm: null,
      });
      return;
    }
    const filename = fileToDelete.filename;
    try {
      await axios.delete(
        `https://api.retellai.com/delete-knowledge-base-source/${knowledgeBaseId}/source/${sourceId}`,
        {
          headers: {
            Authorization: `Bearer ${process.env.REACT_APP_API_RETELL_API}`,
          },
        }
      );
      setKnowledgeBaseSources((prevSources) =>
        prevSources.filter((source) => source.source_id !== sourceId)
      );
      const localServerResponse = await deleteAgentFile(agent_id, filename);
      console.log("Local server delete response:", localServerResponse);
      setPopup({
        show: true,
        type: "success",
        message: "File deleted successfully!",
        onConfirm: () => {
          closePopup();
        },
      });
    } catch (error) {
      console.error("Delete failed:", error);
      setPopup({
        show: true,
        type: "failed",
        message: "Delete failed",
        onConfirm: null,
      });
    }
  };

  const handleDeleteSource = (sourceId) => {
    setPopup({
      show: true,
      type: "confirm",
      message: "Are you sure you want to delete this file?",
      onConfirm: () => performDelete(sourceId),
    });
  };

  return (
    <div className={styles.container}>
      <HeaderBar title="Additional File" />
      <button onClick={() => setShowModal(true)} className={styles.addButton}>
        Add Files
      </button>
      <div className={styles.fileListHeader}>
        {knowledgeBaseSources
          .filter((source) => source.file_size)
          .map((source) => (
            <li key={source.source_id} className={styles.uploadedFileItem}>
              <div className={styles.uploadedFileName}>
                <span title={source.filename}>{source.filename}</span>
              </div>
              <div className={styles.fileActions}>
                <a
                  href={source.file_url}
                  download
                  className={styles.iconButton}
                  title="Download"
                >
                  <FiDownload />
                </a>
                <button
                  className={styles.iconButton}
                  title="Delete"
                  onClick={() => handleDeleteSource(source.source_id)}
                >
                  <FiTrash2 />
                </button>
              </div>
            </li>
          ))}
      </div>

      {showModal && (
        <div className={styles.modalOverlay}>
          <div className={styles.modalContent}>
            <h2 className={styles.modalTitle}>Upload Files (Max 5)</h2>
            <label htmlFor="file-upload" className={styles.fileInputLabel}>
              Choose Files
            </label>
            <input
              id="file-upload"
              type="file"
              multiple
              onChange={handleFileChange}
              className={styles.fileInput}
              accept="*/*"
            />
            <ul className={styles.selectedFileList}>
              {selectedFiles.map((file, index) => (
                <li key={index} className={styles.fileItem}>
                  <span>{file.name}</span>
                  <button
                    type="button"
                    className={styles.removeFileButton}
                    onClick={() => handleRemoveFile(file.name)}
                  >
                    &times;
                  </button>
                </li>
              ))}
            </ul>
            <div className={styles.modalActions}>
              <button
                onClick={() => {
                  setShowModal(false);
                  setSelectedFiles([]);
                }}
                className={styles.cancelButton}
              >
                Cancel
              </button>
              <button
                onClick={handleSubmit}
                className={styles.submitButton}
                disabled={selectedFiles.length === 0}
              >
                Submit
              </button>
            </div>
          </div>
        </div>
      )}

      {/* The PopUp component is rendered here */}
      {popup.show && (
        <PopUp
          type={popup.type}
          message={popup.message}
          onClose={closePopup}
          onConfirm={popup.onConfirm}
        />
      )}
    </div>
  );
};

export default Fileinfo;
