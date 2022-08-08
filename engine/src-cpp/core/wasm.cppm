module;

// Import/Export
#define wasm_import(name) __attribute__((import_name(name)))
#define wasm_export(name) __attribute__((export_name(name)))
#define wasm_extern extern "C"
#define wasm_builtin extern "C"

using u32 = unsigned long;
using i32 = signed long;
using size_t = __SIZE_TYPE__;

// Intrinsic
wasm_builtin void  __wasm_call_ctors(void);
wasm_builtin void* memset(void* pMemory, i32 value, size_t size) noexcept;
wasm_builtin void* memcpy(void* dest, const void* src, size_t count) noexcept;

// Implemented in wallo.c
wasm_extern void* malloc(size_t);
wasm_extern void  free(void*);
wasm_extern void* realloc(void*, size_t);

wasm_extern void externref_clear(u32 idx);
wasm_extern u32 externref_size();
wasm_extern void externref_copy(u32 idxDest, u32 idxSrc);

//--------------------------------------------------------------------------------

extern "C" void __cxa_atexit() {};
void* operator new[](size_t size) { return malloc(size); }

wasm_export("app_callConstructors") void app_callConstructors() {  __wasm_call_ctors(); };
wasm_export("app_invoke") void app_invoke(void (*fnCallback)()) { fnCallback(); };

//--------------------------------------------------------------------------------

export module core.wasm;
export {

using ::__wasm_call_ctors;
using ::memset;
using ::memcpy;

using ::malloc;
using ::free;
using ::realloc;

using ::externref_clear;
using ::externref_size;
using ::externref_copy;

}