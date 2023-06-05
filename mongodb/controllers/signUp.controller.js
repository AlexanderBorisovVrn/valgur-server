import UserModel from "../models/user";
const signUp =
  ("/login",
  (req, res) => {
    const { name, email, pass, avatar } = req.body;
    const user = UserModel.find({email});
    if(user){
      throw new Error ("User is exist now")
    }

    // Создание JWT токена
    const token = jwt.sign(user, secretKey);

    // Отправка токена в ответе
    res.json({ token });
  });
