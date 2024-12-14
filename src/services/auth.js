import { createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut, } from "firebase/auth";
import { doc, setDoc, getDoc, collection, query, where, orderBy, getDocs, addDoc, Timestamp, } from "firebase/firestore";
import { auth, db } from "../../firebase";
export const signup = async (values) => {
    const userCredentials = await createUserWithEmailAndPassword(auth, values.email, values.password);
    const user = {
        uid: userCredentials.user.uid,
        name: values.name,
        email: values.email,
        photoURL: "",
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
    };
    await setDoc(doc(db, "user", user.uid), user);
    return user;
};
export const login = async (values) => {
    const userCredentials = await signInWithEmailAndPassword(auth, values.email, values.password);
    const docRef = doc(db, "user", userCredentials.user.uid);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
        return docSnap.data();
    }
    else {
        signOut(auth);
        throw new Error("User not found!");
    }
};
export const loginAdmin = async (values) => {
    const userCredentials = await signInWithEmailAndPassword(auth, values.email, values.password);
    const docRef = doc(db, "user", userCredentials.user.uid);
    const docSnap = await getDoc(docRef);
    if (!docSnap.exists()) {
        signOut(auth);
        throw new Error("User not found!");
    }
    const user = docSnap.data();
    // if (user.role !== "admin") {
    //   signOut(auth);
    //   throw new Error("User not found!");
    // }
    return user;
};
export const logout = async () => {
    await signOut(auth);
};
export const getCurrentUser = async () => {
    const user = auth.currentUser;
    return user;
};
export const fetchPosts = async () => {
    try {
        const postsRef = collection(db, "postingan");
        const q = query(postsRef, orderBy("createAt", "desc"));
        const querySnapshot = await getDocs(q);
        return querySnapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
        }));
    }
    catch (error) {
        console.error("Error fetching posts:", error);
        throw error;
    }
};
export const fetchComments = async (postId) => {
    try {
        const commentsRef = collection(db, "komentar");
        const q = query(commentsRef, where("postId", "==", postId), // Use postId instead of link
        orderBy("createAt", "desc"));
        const querySnapshot = await getDocs(q);
        return querySnapshot.docs.map((doc) => {
            const data = doc.data();
            // Handle timestamp conversion
            const createAt = data.createAt instanceof Timestamp
                ? data.createAt.toDate().toISOString()
                : data.createAt || new Date().toISOString();
            const comment = {
                id: doc.id,
                body: data.body || "",
                name: data.name || "Anonymous",
                email: data.email || "",
                createAt,
                postId: data.postId || postId,
            };
            return comment;
        });
    }
    catch (error) {
        console.error("Error fetching comments:", error);
        throw error;
    }
};
export const addComment = async (comment) => {
    try {
        // Pastikan createAt adalah timestamp atau string ISO
        const commentWithTimestamp = {
            ...comment,
            createAt: comment.createAt || Timestamp.now(),
            postId: comment.postId, // Pastikan postId disertakan
        };
        // Menambahkan dokumen ke koleksi komentar
        const docRef = await addDoc(collection(db, "komentar"), commentWithTimestamp);
        return { id: docRef.id };
    }
    catch (error) {
        console.error("Error adding comment:", error);
        throw error;
    }
};
export const getPostWithComments = async (postId) => {
    try {
        // Fetch the post
        const postDoc = await getDoc(doc(db, "postingan", postId));
        if (!postDoc.exists()) {
            throw new Error("Post not found");
        }
        // Fetch comments for this post
        const comments = await fetchComments(postId);
        return {
            post: { id: postDoc.id, ...postDoc.data() },
            comments,
        };
    }
    catch (error) {
        console.error("Error fetching post with comments:", error);
        throw error;
    }
};
// When creating a post, ensure it's ready for comments
export const addPost = async (post) => {
    try {
        const postsCollection = collection(db, "postingan");
        // Ensure createAt is properly formatted
        const postWithTimestamp = {
            ...post,
            createAt: post.createAt || Timestamp.now(),
            view: post.view ?? 0,
        };
        const docRef = await addDoc(postsCollection, postWithTimestamp);
        return {
            id: docRef.id,
            ...postWithTimestamp,
        };
    }
    catch (error) {
        console.error("Error adding post:", error);
        throw error;
    }
};