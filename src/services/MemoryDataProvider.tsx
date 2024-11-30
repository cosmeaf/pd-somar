interface FileMetaData {
    id: string;
    name: string;
    size: number;
    type: string;
    createdAt: Date;
    updatedAt: Date;
    pos_lato_especializacao?: string;
    pos_stricto_mestrado?: string;
    pos_stricto_doutorado?: string;
    id_doc?: string;
    continuous_training_doc?: string;
  }
  
  interface DataProvider {
    uploadFile(file: File): Promise<FileMetaData>;
    downloadFile(fileId: string): Promise<File>;
    deleteFile(fileId: string): Promise<void>;
    listFiles(): Promise<FileMetaData[]>;
  }
  
  class InMemoryFileDataProvider implements DataProvider {
    private files: Map<string, { file: File; metadata: FileMetaData }> = new Map();
  
    async uploadFile(file: File): Promise<FileMetaData> {
      const id = this.generateId();
      const metadata: FileMetaData = {
        id,
        name: file.name,
        size: file.size,
        type: file.type,
        createdAt: new Date(),
        updatedAt: new Date(),
      };
  
      this.files.set(id, { file, metadata });
      return metadata;
    }
  
    async downloadFile(fileId: string): Promise<File> {
      const fileData = this.files.get(fileId);
      if (!fileData) {
        throw new Error("File not found");
      }
      return fileData.file;
    }
  
    async deleteFile(fileId: string): Promise<void> {
      if (!this.files.has(fileId)) {
        throw new Error("File not found");
      }
      this.files.delete(fileId);
    }
  
    async listFiles(): Promise<FileMetaData[]> {
      return Array.from(this.files.values()).map(({ metadata }) => metadata);
    }
  
    private generateId(): string {
      return Math.random().toString(36).substr(2, 9);
    }
  }
  
  // Usage example
  (async () => {
    const dataProvider = new InMemoryFileDataProvider();
  
    // Upload a file (in a real use case, this would be a File object from an input element)
    const file = new File(["Hello World"], "example.txt", {
      type: "text/plain",
    });
    const metadata = await dataProvider.uploadFile(file);
    console.log("Uploaded File Metadata:", metadata);
  
    // List all files
    const files = await dataProvider.listFiles();
    console.log("All Files:", files);
  
    // Download a file
    const downloadedFile = await dataProvider.downloadFile(metadata.id);
    console.log("Downloaded File:", downloadedFile);
  
    // Delete a file
    await dataProvider.deleteFile(metadata.id);
    console.log("File deleted");
  })();
  