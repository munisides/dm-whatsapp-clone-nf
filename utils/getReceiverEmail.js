const getReceiverEmail = (users, userLoggedIn) =>{
  users?.filter((userToFilter) => userToFilter?.email !== userLoggedIn?.email);
  // return users;
}
export default getReceiverEmail;
