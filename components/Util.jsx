export const updateSpring = (spring, modifier, state = true) => {
  if (!state) {
    return;
  }
  const springResult = spring.start(modifier);
  return springResult;
};
