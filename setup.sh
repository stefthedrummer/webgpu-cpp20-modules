
pushd "clang-make"
npm install
popd

pushd "engine/src-ts"
npm install
npx tsc
popd

pushd "."
ts-node clang-make/clang-make.ts
popd


