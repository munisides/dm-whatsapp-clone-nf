const getReceiverEmail = (users, userLoggedIn) =>
  users?.find((userToFilter) => userToFilter !== userLoggedIn.email);

export default getReceiverEmail;
