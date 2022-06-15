# Karpunets proxy home work

1. First run Hardhat Network
```shell
npx hardhat node
```

2. Deploy two copy of contract
```shell
npx hardhat run --network localhost scripts/deploy_v1.js
```

3. Go to [./scripts/deploy_v1.js](./scripts/deploy_v1.js) and change `PROXY_ADDRESS` variable to one of your contract
```shell
npx hardhat run --network localhost scripts/deploy_v2.js
```

4. Go to [./scripts/exploit.js](./scripts/exploit.js) and change `address` variable and try to hack contracts
```shell
npx hardhat run --network localhost scripts/exploit.js
```

5. Test describe fixing scenario [./test/proxy-test.js](./test/proxy-test.js)
```shell
npx hardhat test
```
