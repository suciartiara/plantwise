import React from "react";
import { Redirect, Route } from "react-router-dom";
import { IonApp, IonRouterOutlet, setupIonicReact } from "@ionic/react";
import { IonReactRouter } from "@ionic/react-router";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

// Import your pages
import Login from "./pages/Login/Login";

import SignUp from "./pages/SignUp/SignUp";
import Calculator from "./pages/Kalkulator/Kalkulator";
import PanduanForm from "./pages/Admin/Panduan/PanduanForm";
import Dashboard from "./pages/Admin/Dashboard/Dashboard";
import UserPage from "./pages/Admin/User/User";
import JadwalAdmin from "./pages/Admin/Jadwal/Jadwal";
import EditJadwal from "./pages/Admin/Jadwal/EditJadwal";
import AddJadwal from "./pages/Admin/Jadwal/TambahJadwal";
import PostPage from "./pages/Admin/Forum/Post";
import CommentPage from "./pages/Admin/Forum/Komentar";
import Jadwal from "./pages/Jadwal/jadwal";
import Home from "./pages/Home/Home";
import Panduan from "./pages/Panduan/Panduan";

import Forum from "./pages/Forum/Forum";
import CommentsPage from "./pages/Forum/ForumComments";
import NewPost from "./pages/Forum/ForumPost";

import AdminLogin from "./pages/Admin/Login/AdminLogin";
import AdminTutorials from "./pages/Admin/Panduan/Panduan";
import { RequireAuth } from "./middleware/auth.middleware";
import { AdminOnly } from "./middleware/admin.middleware";

// Ionic CSS
import "@ionic/react/css/core.css";
import "@ionic/react/css/normalize.css";
import "@ionic/react/css/structure.css";
import "@ionic/react/css/typography.css";

// Optional CSS
import "@ionic/react/css/padding.css";
import "@ionic/react/css/float-elements.css";
import "@ionic/react/css/text-alignment.css";
import "@ionic/react/css/text-transformation.css";
import "@ionic/react/css/flex-utils.css";
import "@ionic/react/css/display.css";

// import Profile from "./pages/Profile/Profile";

/**
 * Ionic Dark Mode
 * -----------------------------------------------------
 * For more info, please see:
 * https://ionicframework.com/docs/theming/dark-mode
 */

/* import '@ionic/react/css/palettes/dark.always.css'; */
/* import '@ionic/react/css/palettes/dark.class.css'; */
// import "@ionic/react/css/palettes/dark.system.css";

/* Theme variables */
import "./theme/variables.css";
import ForumPage from "./pages/Forum/ForumPage";

setupIonicReact();

// Create a client
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000, // 5 minutes
      // cacheTime: 30 * 60 * 1000, // 30 minutes
    },
  },
});

const App: React.FC = () => (
  <QueryClientProvider client={queryClient}>
    <IonApp>
      <IonReactRouter>
        <IonRouterOutlet>
          <Route exact path="/login" component={Login} />
          <Route exact path="/signup" component={SignUp} />
          <Route exact path="/home" component={Home} />
          {/* <Route exact path="/forumPage" component={ForumPage} /> */}
          {/* <Route exact path="/forum" component={ForumPage} /> */}
          {/* <Route exact path="/forum/create" component={NewPost} />
          <Route path="/comments/:postId" component={CommentsPage} />
          <Route path="/forum/category/:categoryName" component={Forum} /> */}

          {/* <Route exact path="/profile">
            <RequireAuth>
              <Profile />
            </RequireAuth>
          </Route> */}
          <Route exact path="/panduan">
            <RequireAuth>
              <Panduan />
            </RequireAuth>
          </Route>
          <Route exact path="/jadwal">
            <RequireAuth>
              <Jadwal />
            </RequireAuth>
          </Route>
          <Route exact path="/kalkulator">
            <RequireAuth>
              <Calculator />
            </RequireAuth>
          </Route>
          <Route exact path="/forum">
            <RequireAuth>
              <ForumPage />
            </RequireAuth>
          </Route>

          <Route exact path="/admin" component={AdminLogin} />
          <Route exact path="/admin/panduan/add">
            <AdminOnly>
              <PanduanForm />
            </AdminOnly>
          </Route>
          <Route exact path="/admin/dashboard">
            <AdminOnly>
              <Dashboard />
            </AdminOnly>
          </Route>
          <Route exact path="/admin/user">
            <AdminOnly>
              <UserPage />
            </AdminOnly>
          </Route>
          <Route exact path="/admin/jadwal">
            <AdminOnly>
              <JadwalAdmin />
            </AdminOnly>
          </Route>
          <Route exact path="/edit-jadwal/:id">
            <AdminOnly>
              <EditJadwal />
            </AdminOnly>
          </Route>
          <Route exact path="/tambah-jadwal">
            <AdminOnly>
              <AddJadwal />
            </AdminOnly>
          </Route>
          <Route exact path="/post-admin">
            <AdminOnly>
              <PostPage />
            </AdminOnly>
          </Route>
          <Route exact path="/admin/forum/komentar">
            <AdminOnly>
              <CommentPage />
            </AdminOnly>
          </Route>
          <Route exact path="/admin/forum/post">
            <AdminOnly>
              <PostPage />
            </AdminOnly>
          </Route>
          <Route exact path="/admin/panduan">
            <AdminOnly>
              <AdminTutorials />
            </AdminOnly>
          </Route>
          <Route
            path="/admin/panduan/edit/:id"
            component={() => <PanduanForm isEditMode={true} />}
          />

          {/* Default redirect */}
          <Route exact path="/">
            <Redirect to="/home" />
          </Route>
          {/* <Route exact path="*">
            <Redirect to="/home" />
          </Route> */}
        </IonRouterOutlet>
      </IonReactRouter>
    </IonApp>
  </QueryClientProvider>
);

export default App;
