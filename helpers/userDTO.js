export const userDTO = (user)=>({
  email:user.email,
  name:user.name,
  avatar:user.avatar,
  id:user._id
})