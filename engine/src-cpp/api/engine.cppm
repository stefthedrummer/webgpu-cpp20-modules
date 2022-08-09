
export module api.engine;
import api.webgpu;
import api.bindgen;
import api.resources;
import api.ui_events;
import core.allocator;
import core.array;
import core.types;

#define wasm_import(name) __attribute__((import_name(name)))

export namespace Engine {
	using Callback = void(*)();

	wasm_import("cpp_getGPU") u32 cpp_getGPU();
	wasm_import("cpp_getDevice") u32 cpp_getDevice();
	wasm_import("cpp_getCanvasContext") u32 cpp_getCanvasContext();
	wasm_import("cpp_requestAnimationFrame") void cpp_requestAnimationFrame(u32 millis, Callback fnCallback);

	inline PersistentHandle<IGPU> GetGPU() { return PersistentHandle<IGPU>{cpp_getGPU()}; }
	inline PersistentHandle<IGPUDevice> GetDevice() { return PersistentHandle<IGPUDevice>{cpp_getDevice()}; }
	inline PersistentHandle<IGPUCanvasContext> GetCanvasContext() { return PersistentHandle<IGPUCanvasContext>{cpp_getCanvasContext()}; }
	inline void RequestAnimationFrame(u32 millis, Callback fnCallback) { cpp_requestAnimationFrame(millis, fnCallback); }
}

export namespace Resources {
	using Callback = void(*)();

	wasm_import("cpp_loadResources") void cpp_loadResource(u32 pResourceDescriptors, u32 fnCallback);

	void LoadResources(Array<ResourceDescriptor*>* pResourceDescriptors, Callback fnCallback) { cpp_loadResource((u32)pResourceDescriptors, (u32)fnCallback); }
	void LoadResources(Array<ResourceDescriptor*>&& pResourceDescriptors, Callback fnCallback) { cpp_loadResource((u32)&pResourceDescriptors, (u32)fnCallback); }
}

export namespace UIEvents {

	wasm_import("cpp_pollUIEvents") u32 cpp_pollUIEvents(u32);

	template<Allocator TAllocator>
	inline u32 PollUIEvents(Array<UIEvent, TAllocator>* pUIEvents) { return cpp_pollUIEvents((u32)pUIEvents); }
}