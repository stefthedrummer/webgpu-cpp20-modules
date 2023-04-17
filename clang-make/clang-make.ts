import { AppWasm } from "./lib/artifacts/app-wasm";
import { CompileCommandsJson } from "./lib/artifacts/compile-command-json";
import { Cpp } from "./lib/artifacts/cpp";
import { Cppm } from "./lib/artifacts/cppm";
import { Wat } from "./lib/artifacts/wat";
import { Stage } from "./lib/config";
import { FileInfo } from "./lib/file";
import { Project } from "./lib/project";
import { Config } from "./lib/config"

const config: Config = {
    srcDirs: [
        "engine/src-cpp",
        "engine/src-wat",
        "app"
    ],
    buildDir: "bin/build",
    distDit: "bin",
    clangCppArguments: [
        "-g",
        "-gdwarf-4",
        "--target=wasm32-wasi",
        "-std=c++20",
        "-fmodules",
        "-mbulk-memory",
        "-ffast-math",
        //"-O2",
        "-fno-rtti",
        //"-frtti",
        //"-flto",
    ],
    clangCArguments: [
        "--target=wasm32-wasi",
        //"-O2",
        "-flto"
    ],
    clangdArguments: [
        "--target=wasm32-wasi",
        "-std=c++20",
        "-fmodules",
    ],
    wasmldArguments: [
        "--no-entry"
        //"-O3",
        //"--lto-O3",
        //"--strip-all",
        //"--gc-sections"
    ],
    wat2wasmArguments: [
        "-r"
    ]
};

new Project(config)
    .addSourceArtifacts(Cppm, Cpp, Wat)
    .collectSources()
    .emitArtifact(new CompileCommandsJson("compile_commands:json", FileInfo.create(".", "compile_commands", "json")))
    .emitArtifact(new AppWasm("app:wasm", FileInfo.create(config.distDit, "game", "wasm")))
    .build(Stage.Link, true);



    /*
clangCppArguments: [
        "--target=wasm32-wasi",
        "-std=c++20",
        "-fmodules",
        "-mbulk-memory",
        "-ffast-math",
        //"-O2",
        "-fno-rtti",
        //"-frtti",
        "-flto"
    ],
    clangCArguments: [
        "--target=wasm32-wasi",
        //"-O2",
        "-flto"
    ],
    clangdArguments: [
        "--target=wasm32-wasi",
        "-std=c++20",
        "-fmodules",
    ],
    wasmldArguments: [
        "--no-entry",
        //"-O3",
        //"--lto-O3",
        "--strip-all",
        "--gc-sections"
    ],
    wat2wasmArguments: [
        "-r"
    ]

    */