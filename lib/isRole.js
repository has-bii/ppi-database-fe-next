const isAdmin = (user) => {
  return user.role_id === 1;
};

const isStudent = (user) => {
  return user.role_id === 2;
};

const isUser = (user) => {
  return user.role_id === 3;
};

export { isAdmin, isStudent, isUser };
