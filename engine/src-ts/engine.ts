import { cpp_decode_Array, cpp_encode_Array_Borrow, cpp_encode_String, cpp_getArrayLength, size_t } from "./bindgen-api";
import { Console } from "./console";
import { fetchImage } from "./fetch";
import { cpp_decode_ResourceDescriptor, cpp_encode_ResourceDescriptor, ResourceDescriptor, ResourceType } from "./resources-api";
import { UIEventType, UIEvent, cpp_encode_UIEvent, cpp_sizeof_UIEvent } from "./ui-events-api";
import { cpp_module_api_webgpu } from "./webgpu-api";

export type WasmModuleExports = {
    memory: WebAssembly.Memory;
    externref_table: WebAssembly.Table;
    app_invoke: (fn: number) => void;
    app_main: () => void;
    cpp_malloc: (size: number) => number;
    app_callConstructors: () => void;
    cpp_acquirePersistent: () => number;
};

export class Engine {

    static wasmModuleImports: any = {};
    static wasmModuleExports: WasmModuleExports = null!;
    static mem_u8: Uint8Array = null!;
    static mem_u32: Uint32Array = null!;
    static mem_f32: Float32Array = null!;
    static externref_table: WebAssembly.Table = null!;
    static jsonTypes: Record<string, { sizeOf: number, encode: (ptr: number, val: any) => void }> = {};
    static uiEventQueue: UIEvent[] = [];
    static hGPU: number;
    static hDevice: number;
    static hCanvasContext: number;
    static canvas: HTMLCanvasElement = null!;

    static bootstrap() {

        const implementations: any[] = [Engine, Console, ...cpp_module_api_webgpu];

        for (const impl of implementations) {
            for (const key of Object.getOwnPropertyNames(impl)) {
                if (key.startsWith("cpp_")) {
                    const val = impl[key];
                    if (typeof val == "function" && !val.prototype) {
                        Engine.wasmModuleImports[key] = val;
                    }
                }
            }
        }
    }

    static loadResources(resourceDescriptors: ResourceDescriptor[]): Promise<void> {
        const promise = new Promise<void>(allDone => {
            const allResourcePromises = resourceDescriptors.map(desc => new Promise<void>(resourceDone => {
                switch (desc.type) {
                    case ResourceType.Text:
                        return fetch(desc.url)
                            .then(res => res.text())
                            .then(text => {
                                desc.dataLength = text.length;
                                desc.pData = Engine.wasmModuleExports.cpp_malloc(desc.dataLength);
                                cpp_encode_String(text, desc.pData, desc.dataLength);

                                cpp_encode_ResourceDescriptor(desc.ptr, desc);
                                resourceDone();
                            });

                    case ResourceType.Image:
                        return fetchImage(desc.url)
                            .then(imgData => {
                                const blob_u8 = imgData.data;
                                desc.dataLength = blob_u8.length;
                                desc.width = imgData.width;
                                desc.height = imgData.height;
                                desc.pData = Engine.wasmModuleExports.cpp_malloc(desc.dataLength);
                                Engine.mem_u8.set(blob_u8, desc.pData);

                                cpp_encode_ResourceDescriptor(desc.ptr, desc);
                                resourceDone();
                            });

                    case ResourceType.Json:
                        return fetch(desc.url)
                            .then(res => res.text())
                            .then(json => {
                                const jsonType = Engine.jsonTypes[desc.jsonType!];
                                if (!jsonType) throw new Error(`Unknown jsonType: ${desc.jsonType}`);

                                const jsObject = JSON.parse(json);
                                const pObject = Engine.wasmModuleExports.cpp_malloc(jsonType.sizeOf);
                                jsonType.encode(pObject, jsObject);

                                desc.pData = pObject;
                                cpp_encode_ResourceDescriptor(desc.ptr, desc);
                                resourceDone();
                            });

                    default:
                        throw new Error(`Unknown ResourceType @ ${desc.url}`);
                }
            }));

            Promise.all(allResourcePromises).then(() => allDone())
        });
        return promise;
    }

    static fireResizeEvent() {
        const bounds = Engine.canvas.getBoundingClientRect();
        const w = Math.round(bounds.width);
        const h = Math.round(bounds.height);
        Engine.canvas.width = w;
        Engine.canvas.height = h;
        Engine.uiEventQueue.push({
            type: UIEventType.CanvasResize,
            x: w,
            y: h,
            button: 0
        });
    }

    static registerUIEventListeners(canvas: HTMLCanvasElement) {
        window.onresize = e => Engine.fireResizeEvent();

        canvas.addEventListener("wheel", e => {
            e.preventDefault();
            e.stopPropagation();
            Engine.uiEventQueue.push({
                type: UIEventType.MouseWheel,
                x: e.deltaX,
                y: e.deltaY,
                button: 1,
            });
        }, { passive: false });

        canvas.addEventListener("mousemove", e => {
            Engine.uiEventQueue.push({
                type: UIEventType.MouseMove,
                x: e.clientX,
                y: e.clientY,
                button: 0,
            });
        });

        canvas.addEventListener("mousedown", e => {
            canvas.setPointerCapture(1);
            Engine.uiEventQueue.push({
                type: UIEventType.MouseDown,
                x: e.clientX,
                y: e.clientY,
                button: e.button,
            });
        });

        canvas.addEventListener("mouseup", e => {
            canvas.releasePointerCapture(1);
            Engine.uiEventQueue.push({
                type: UIEventType.MouseUp,
                x: e.clientX,
                y: e.clientY,
                button: e.button,
            });
        });
    }

    static run(adapter: GPUAdapter, device: GPUDevice, wasmModule: WebAssembly.WebAssemblyInstantiatedSource, canvas: HTMLCanvasElement) {
        {
            Engine.canvas = canvas;
            Engine.wasmModuleExports = wasmModule.instance.exports as WasmModuleExports;
            Engine.wasmModuleExports.app_callConstructors();
            Engine.cpp_invalidateMemory();
        }

        {
            Engine.externref_table.set(
                Engine.hGPU = Engine.wasmModuleExports.cpp_acquirePersistent(), navigator.gpu!);
            Engine.externref_table.set(
                Engine.hDevice = Engine.wasmModuleExports.cpp_acquirePersistent(), device);
            Engine.externref_table.set(
                Engine.hCanvasContext = Engine.wasmModuleExports.cpp_acquirePersistent(), canvas.getContext("webgpu"));
        }

        Engine.registerUIEventListeners(canvas);
        Engine.fireResizeEvent();
        Engine.wasmModuleExports.app_main();
    }

    static cpp_invalidateMemory() {
        const buffer = Engine.wasmModuleExports.memory.buffer;
        Engine.mem_u8 = new Uint8Array(buffer);
        Engine.mem_u32 = new Uint32Array(buffer);
        Engine.mem_f32 = new Float32Array(buffer);
        Engine.externref_table = Engine.wasmModuleExports.externref_table;
    }

    static cpp_getGPU() { return Engine.hGPU; }
    static cpp_getDevice() { return Engine.hDevice; }
    static cpp_getCanvasContext() { return Engine.hCanvasContext; }

    static cpp_requestAnimationFrame(millis: number, fnCallback: number) {
        setTimeout(() => Engine.wasmModuleExports.app_invoke(fnCallback), millis);
    }

    static cpp_loadResources(pResourceDescriptors: number, fnCallback: number) {
        const resourceDesciptors = cpp_decode_Array(pResourceDescriptors, size_t,
            ptr => cpp_decode_ResourceDescriptor(Engine.mem_u32[ptr >> 2]));

        Engine.loadResources(resourceDesciptors).then(() => {
            Engine.wasmModuleExports.app_invoke(fnCallback);
        });
    }

    static cpp_pollUIEvents(outUIEvents: number): number {
        const capacity = cpp_getArrayLength(outUIEvents);
        const numUIEvents = Math.min(capacity, Engine.uiEventQueue.length);

        const polledUIevents = Engine.uiEventQueue.splice(0, numUIEvents);

        cpp_encode_Array_Borrow(outUIEvents, polledUIevents, cpp_sizeof_UIEvent, (ptr, uiEvent) => cpp_encode_UIEvent(ptr, uiEvent));
        return numUIEvents;
    }
};


