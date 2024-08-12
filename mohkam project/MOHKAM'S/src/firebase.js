
import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider,signInWithPopup } from "firebase/auth";
import axios from 'axios'; // Import axios here
import { getFirestore } from "firebase/firestore";
// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCIMDTWLqN8CzJtbQ7VDeqUyRFQSLT23h0",
  authDomain: "mohkam-549bd.firebaseapp.com",
  projectId: "mohkam-549bd",
  storageBucket: "mohkam-549bd.appspot.com",
  messagingSenderId: "1086216510948",
  appId: "1:1086216510948:web:2bde3d24b47eb59ae7bbf1"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase Authentication and get a reference to the service
const auth = getAuth(app);

// Initialize Firestore
const db = getFirestore(app);

// Google Auth provider
const provider = new GoogleAuthProvider();


const popUp = async () => {
  try {
    const result = await signInWithPopup(auth, provider);
    // This gives you a Google Access Token. You can use it to access the Google API.
    const credential = GoogleAuthProvider.credentialFromResult(result);
    const token = credential.accessToken;
    // The signed-in user info.
    const user = result.user;

    // Send user email to backend to save in MongoDB
    const response = await axios.post('http://localhost:5000/api/users/google-login', {
      email: user.email,
      username:user.displayName
    });

    // Check if email was successfully saved in MongoDB
    if (response.status === 200) {
      // Save user email in local storage
      localStorage.setItem("user-mohkam", JSON.stringify({ email: user.email,username:user.displayName }));
    } else {
      console.error('Failed to save email in MongoDB');
      // Handle the error case where email could not be saved
    }

    console.log('User signed in:', user);
  } catch (error) {
    // Handle Errors here.
    const errorCode = error.code;
    const errorMessage = error.message;
    // The email of the user's account used.
    const email = error.customData?.email;
    // The AuthCredential type that was used.
    const credential = GoogleAuthProvider.credentialFromError(error);
    // ...
    console.error('Error during Google login:', errorMessage);
  }
};


export { auth, provider, db , popUp};