export const renderIf = (condition) => (componentThunk) => {
  return condition ? componentThunk() : null;
};

export const renderIfElse = (condition) => (ifCompThunk, elseCompThunk) => {
  return condition ? ifCompThunk() : elseCompThunk();
};
