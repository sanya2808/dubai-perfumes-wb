import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyCKAZ_7t_dH7x9MtOwKgPJbx6nrVCsAShU",
  authDomain: "dubai-perfumes-3af9c.firebaseapp.com",
  projectId: "dubai-perfumes-3af9c",
  storageBucket: "dubai-perfumes-3af9c.firebasestorage.app",
  messagingSenderId: "739253901325",
  appId: "1:739253901325:web:69def59504d30b99561d44",
  measurementId: "G-8V9JBCK8Y0"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);

export default app;