const generatePongKey = () => {
  let keyParts = [];

  for (let i = 0; i < 4; i++) {
    let part = "";
    for (let j = 0; j < 6; j++) {
      part = `${part}${Math.floor(Math.random() * 10)}`;
    }
    keyParts.push(part);
  }

  const key = keyParts.join("-");

  return key;
};

export default generatePongKey;
