export const getTrialExpiresAt = (user: { createdAt: Date }) => {
  return new Date(user.createdAt.getTime() + 3 * 24 * 60 * 60 * 1000);
};

export const isUserOnTrial = (user: { createdAt: Date }) => {
  return getTrialExpiresAt(user) > new Date();
};
