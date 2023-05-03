import User from '../models/user.js'


const getAllUsers = async (req, res) => {
}

const createUser = async (req, res) => {
    try {
        const { name, email, avatar } = req.body;
        const userExist = await User.findOne({ email })
        if (userExist) {
           return {
            status:200,
            userExist
           }
            
        }
        const newUser = await User.create({
            name,
            email,
            avatar
        })
      return  {
        status:200,
        newUser
      }

    } catch (error) {
      return  res.status(500).send(error)
    }
}
const getUserInfoById = async (req, res) => { }


export {
    getAllUsers,
    createUser,
    getUserInfoById
}