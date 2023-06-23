const createTimer = () => {
  let lastTime = Date.now();
  let activationCount = 0;

  const timer = (func, interval, stopCondition = () => false, maxActivation = 999) => {
    const currentTime = Date.now();
    const delta = currentTime - lastTime;

    if (delta >= interval) {
      if (stopCondition() || activationCount >= maxActivation) {
        return;
      }
      func();
      activationCount++;
      lastTime = currentTime;
    }
  };

  return timer;
};

export default createTimer;
