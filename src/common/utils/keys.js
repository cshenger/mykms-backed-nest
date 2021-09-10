const crypto = require('crypto');

const createKey = (params) => {
  const algorithm = params.way;
  // console.log(algorithm);
  const password = Math.random().toString(36).substr(2);
  const salt = '' + Math.round(Math.random() * 1000000000) % 100000000;
  const key = crypto.scryptSync(password, salt, parseInt(params.length / 8));
  const iv = crypto.randomBytes(16);

  return {
    key,
    iv
  }
};

const keyWrite = async (params, str) => {
  const algorithm = params.way;
  const key = params.mykey;
  const iv = params.iv;
  const cipher = crypto.createCipheriv(algorithm, key, iv);

  let encrypted = '';
  cipher.on('readable', () => {
    let chunk;
    while (null !== (chunk = cipher.read())) {
      encrypted += chunk.toString('hex');
    }
  });
  cipher.on('end', () => {
    console.log('加密: ', encrypted);
  });

  await cipher.write(str);
  await cipher.end();

  return encrypted
}

const decipherKey = async (params, str) => {
  const algorithm = params.way;
  const key = params.mykey;
  const iv = params.iv;
  const decipher = crypto.createDecipheriv(algorithm, key, iv);

  let decrypted = '';
  decipher.on('readable', () => {
    while (null !== (chunk = decipher.read())) {
      decrypted += chunk.toString('utf8');
    }
  });
  decipher.on('end', () => {
    console.log('解密: ', decrypted);
  });

  await decipher.write(str, 'hex');
  await decipher.end();

  return decrypted;
};

exports = module.exports = {
  createKey,
  keyWrite,
  decipherKey
}