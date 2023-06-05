import {
  createUser,
  getAllUsers,
  getUserInfoById,
  googleLogin,
  refresh,
  login,
} from "./mongodb/controllers/user.controller.js";
import {
  createProperty,
  deleteProperty,
  getAllProperies,
  getPropertyDetail,
  updateProperty,
} from "./mongodb/controllers/property.controller.js";

const userRoutes = (server, opts, done) => {
  server.get("/", getAllUsers);
  server.post("/", login);
  server.post("/register", createUser);
  server.get("/:id", getUserInfoById);
  server.post("/login", googleLogin);
  server.post("/refresh", refresh);
  done();
};

const propertyRoutes = (server, opts, done) => {
  server.get("/", getAllProperies);
  server.get("/:id", getPropertyDetail);
  server.post("/", createProperty);
  server.patch("/:id", updateProperty);
  server.delete("/:id", deleteProperty);
  done();
};

// const signUpRoutes = (server, opts, done) => {
//   server.post("/signup", signUp);
// };

export { userRoutes, propertyRoutes };
