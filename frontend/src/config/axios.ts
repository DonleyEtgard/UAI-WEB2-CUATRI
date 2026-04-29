import axios from "axios";

export const jsonplaceholderInstance = axios.create({
  baseURL: "https://jsonplaceholder.typicode.com",
});
export const firebaseAxios = axios.create({
  baseURL: "https://firestore.googleapis.com/v1/projects/TU_PROJECT_ID/databases/(default)/documents/",
});
