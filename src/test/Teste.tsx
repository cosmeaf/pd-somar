import React, { useState } from "react";

const FileUploadComponent: React.FC = () => {
  const [file, setFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState<boolean>(false);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      setFile(event.target.files[0]);
    }
  };

  const handleUpload = async () => {
    if (!file) {
      alert("Por favor, selecione um arquivo!");
      return;
    }

    const formData = new FormData();
    formData.append("continuous_training_doc", file); // "continuous_training_doc" deve corresponder ao campo esperado pelo backend

    setIsUploading(true);
    try {
      const response = await fetch("https://api-somar.lexlam.com.br/api/candidates/1/", { // Barra final mantida para resolver o problema de redirecionamento
        method: "PUT",
        body: formData,
      });

      if (response.ok) {
        alert("Arquivo enviado com sucesso!");
      } else {
        const errorData = await response.json(); // Lê o erro como JSON para melhorar a legibilidade
        console.error("Erro no servidor:", errorData);
        alert(`Erro ao enviar o arquivo: ${errorData.detail || "Verifique os logs do servidor."}`);
      }
    } catch (error) {
      console.error("Erro ao enviar o arquivo:", error);
      alert("Erro de conexão com a API. Por favor, tente novamente mais tarde.");
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div>
      <input type="file" onChange={handleFileChange} />
      <button onClick={handleUpload} disabled={isUploading}>
        {isUploading ? "Enviando..." : "Enviar Arquivo"}
      </button>
    </div>
  );
};

export default FileUploadComponent;
