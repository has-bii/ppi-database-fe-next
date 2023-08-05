const isAdmin = (user) => {
  return user.role_id === 1;
};

const isStudent = (user) => {
  return user.role_id === 2;
};

const isUser = (user) => {
  return user.role_id === 3;
};

const isSU = (user) => {
  return user.role_id === 4;
};

const isPPMB = (user) => {
  return user.role_id === 5;
};

export { isAdmin, isStudent, isUser, isSU, isPPMB };
