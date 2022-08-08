import { Engine } from "./engine";
import { resolveAll } from "./promise-extensions";
import { cpp_encode_Atlas, cpp_sizeof_Atlas } from "./sprite-atlas-api";

Engine.bootstrap();
Engine.jsonTypes["Atlas"] = { sizeOf: cpp_sizeof_Atlas, encode: cpp_encode_Atlas };

resolveAll({
    wasmFile: fetch("./game.wasm"),
    gpuAdapter: navigator.gpu.requestAdapter()

}).then(e => resolveAll({
    wasmBytes: e.wasmFile.arrayBuffer(),
    gpuDevice: e.gpuAdapter!.requestDevice(),
    gpuAdapter: e.gpuAdapter!

})).then(e => resolveAll({
    wasmModule: WebAssembly.instantiate(e.wasmBytes, {
        "env": Engine.wasmModuleImports
    }),
    gpuDevice: e.gpuDevice,
    gpuAdapter: e.gpuAdapter

})).then(e => {
    Engine.run(e.gpuAdapter, e.gpuDevice, e.wasmModule, document.getElementById("canvas") as HTMLCanvasElement);
});
