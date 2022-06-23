export const updateSpring = (spring, modifier, state = true) => {
  if (!state) {
    return;
  }
  spring.start(modifier);
};
