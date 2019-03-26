function ERC165 (interfaces = []) {
  const INTERFACE_ID_LENGTH = 4;

  const interfaceIdBuffer = interfaces
    .map(methodSignature => web3.utils.soliditySha3(methodSignature)) // keccak256
    .map(h =>
      Buffer
        .from(h.substring(2), 'hex')
        .slice(0, 4) // bytes4()
    )
    .reduce((memo, bytes) => {
      for (let i = 0; i < INTERFACE_ID_LENGTH; i++) {
        memo[i] = memo[i] ^ bytes[i]; // xor
      }
      return memo;
    }, Buffer.alloc(INTERFACE_ID_LENGTH));

  return `0x${interfaceIdBuffer.toString('hex')}`;
}

function ERC1820 (inteface) {

}

module.exports = {
  ERC165,
  ERC1820,
};
