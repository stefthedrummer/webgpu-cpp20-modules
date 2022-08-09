export module api.webgpu;
import core.wasm;
import core.types;
import core.allocator;
import core.array;
import core.buffer;
import api.bindgen;
#define wasm_import(name) __attribute__((import_name(name)))
export  {
enum class GPUTextureDimension {
	_1D = 1,
	_2D = 2,
	_3D = 3,
};
enum class GPUTextureFormat {
	R8UNorm = 1,
	R8SNorm = 2,
	R8UInt = 3,
	R8SInt = 4,
	R16UInt = 5,
	R16SInt = 6,
	R16Float = 7,
	RG8UNorm = 8,
	RG8SNorm = 9,
	RG8UInt = 10,
	RG8SInt = 11,
	R32UInt = 12,
	R32SInt = 13,
	R32Float = 14,
	RG16UInt = 15,
	RG16SInt = 16,
	RG16Float = 17,
	RGBA8UNorm = 18,
	RGBA8UNorm_SRGB = 19,
	RGBA8SNorm = 20,
	RGBA8UInt = 21,
	RGBA8SInt = 22,
	BGRA8UNorm = 23,
	BGRA8UNorm_SRGB = 24,
	RGB9E5UFloat = 25,
	RGB10A2UNorm = 26,
	RG11B10UFloat = 27,
	RG32UInt = 28,
	RG32SInt = 29,
	RG32Float = 30,
	RGBA16UInt = 31,
	RGBA16SInt = 32,
	RGBA16Float = 33,
	RGBA32UInt = 34,
	RGBA32SInt = 35,
	RGBA32Float = 36,
	Stencil8 = 37,
	Depth16UNorm = 38,
	Depth24PLUS = 39,
	Depth24PLUS_Stencil8 = 40,
	Depth32Float = 41,
	Depth32Float_Stencil8 = 42,
	BC1_RGBA_UNorm = 43,
	BC1_RGBA_UNorm_SRGB = 44,
	BC2_RGBA_UNorm = 45,
	BC2_RGBA_UNorm_SRGB = 46,
	BC3_RGBA_UNorm = 47,
	BC3_RGBA_UNorm_SRGB = 48,
	BC4_R_UNorm = 49,
	BC4_R_SNorm = 50,
	BC5_RG_UNorm = 51,
	BC5_RG_SNorm = 52,
	BC6H_RGB_UFloat = 53,
	BC6H_RGB_Float = 54,
	BC7_RGBA_UNorm = 55,
	BC7_RGBA_UNorm_SRGB = 56,
	ETC2_RGB8UNorm = 57,
	ETC2_RGB8UNorm_SRGB = 58,
	ETC2_RGB8A1UNorm = 59,
	ETC2_RGB8A1UNorm_SRGB = 60,
	ETC2_RGBA8UNorm = 61,
	ETC2_RGBA8UNorm_SRGB = 62,
	EAC_R11UNorm = 63,
	EAC_R11SNorm = 64,
	EAC_RG11UNorm = 65,
	EAC_RG11SNorm = 66,
	ASTC_4X4_UNorm = 67,
	ASTC_4X4_UNorm_SRGB = 68,
	ASTC_5X4_UNorm = 69,
	ASTC_5X4_UNorm_SRGB = 70,
	ASTC_5X5_UNorm = 71,
	ASTC_5X5_UNorm_SRGB = 72,
	ASTC_6X5_UNorm = 73,
	ASTC_6X5_UNorm_SRGB = 74,
	ASTC_6X6_UNorm = 75,
	ASTC_6X6_UNorm_SRGB = 76,
	ASTC_8X5_UNorm = 77,
	ASTC_8X5_UNorm_SRGB = 78,
	ASTC_8X6_UNorm = 79,
	ASTC_8X6_UNorm_SRGB = 80,
	ASTC_8X8_UNorm = 81,
	ASTC_8X8_UNorm_SRGB = 82,
	ASTC_10X5_UNorm = 83,
	ASTC_10X5_UNorm_SRGB = 84,
	ASTC_10X6_UNorm = 85,
	ASTC_10X6_UNorm_SRGB = 86,
	ASTC_10X8_UNorm = 87,
	ASTC_10X8_UNorm_SRGB = 88,
	ASTC_10X10_UNorm = 89,
	ASTC_10X10_UNorm_SRGB = 90,
	ASTC_12X10_UNorm = 91,
	ASTC_12X10_UNorm_SRGB = 92,
	ASTC_12X12_UNorm = 93,
	ASTC_12X12_UNorm_SRGB = 94,
};
enum class GPULoadOp {
	Load = 1,
	Clear = 2,
};
enum class GPUStoreOp {
	Store = 1,
	Discard = 2,
};
enum class GPUCanvasAlphaMode {
	Opaque = 1,
	Premultiplied = 2,
};
enum class GPUTextureUsageFlags: u32 {
	COPY_SRC = 1,
	COPY_DST = 2,
	TEXTURE_BINDING = 4,
	STORAGE_BINDING = 8,
	RENDER_ATTACHMENT = 16,
};
inline constexpr GPUTextureUsageFlags operator |(GPUTextureUsageFlags l, GPUTextureUsageFlags r) { return (GPUTextureUsageFlags)((u32)l | (u32)r); }
struct GPUExtent3DDict {
	u32 width;
	u32 height{1};
	u32 depthOrArrayLayers{1};
};
struct GPUTextureDescriptor {
	GPUExtent3DDict size;
	u32 mipLevelCount{1};
	u32 sampleCount{1};
	GPUTextureDimension dimension{GPUTextureDimension::_2D};
	GPUTextureFormat format;
	GPUTextureUsageFlags usage;
	Array<GPUTextureFormat, Borrow> viewFormats;
};
struct GPUColor {
	f32 r;
	f32 g;
	f32 b;
	f32 a;
};
enum class GPUTextureAspect {
	All = 1,
	Depth_Only = 2,
	Stencil_Only = 3,
};
enum class GPUTextureViewDimension {
	_1d = 1,
	_2d = 2,
	_2d_Array = 3,
	Cube = 4,
	Cube_Array = 5,
	_3d = 6,
};
struct GPUTextureViewDescriptor {
	Optional<GPUTextureFormat> format;
	Optional<GPUTextureViewDimension> dimension;
	GPUTextureAspect aspect{GPUTextureAspect::All};
};
struct IGPUTextureView {
private:
public:
	static inline constexpr char const* Name = "GPUTextureView";
	u32 handle;
};
struct IGPUSampler {
private:
public:
	static inline constexpr char const* Name = "GPUSampler";
	u32 handle;
};
struct IGPUCommandBuffer {
private:
public:
	static inline constexpr char const* Name = "GPUCommandBuffer";
	u32 handle;
};
struct IGPUBuffer {
private:
	static wasm_import("cpp_GPUBuffer_destroy0") void cpp_destroy(u32);
public:
	static inline constexpr char const* Name = "GPUBuffer";
	u32 handle;
	inline void Destroy() const {
		IGPUBuffer::cpp_destroy(this->handle);
	}
};
struct IGPUTexture {
private:
	static wasm_import("cpp_GPUTexture_destroy0") void cpp_destroy(u32);
	static wasm_import("cpp_GPUTexture_createView0") void cpp_createView(u32, u32);
	static wasm_import("cpp_GPUTexture_createView1") void cpp_createView(u32, GPUTextureViewDescriptor const*, u32);
	static wasm_import("cpp_GPUTexture_format") void cpp_format(u32, GPUTextureFormat*);
	static wasm_import("cpp_GPUTexture_width") void cpp_width(u32, u32*);
	static wasm_import("cpp_GPUTexture_height") void cpp_height(u32, u32*);
public:
	static inline constexpr char const* Name = "GPUTexture";
	u32 handle;
	inline void Destroy() const {
		IGPUTexture::cpp_destroy(this->handle);
	}
	inline LocalHandle<IGPUTextureView> CreateView(Scope* pScope) const {
		u32 const _retHandle = pScope->externrefScope.AcquireLocal();
		IGPUTexture::cpp_createView(this->handle, _retHandle);
		return LocalHandle<IGPUTextureView>{_retHandle};
	}
	inline LocalHandle<IGPUTextureView> CreateView(GPUTextureViewDescriptor const* pDescriptor, Scope* pScope) const {
		u32 const _retHandle = pScope->externrefScope.AcquireLocal();
		IGPUTexture::cpp_createView(this->handle, pDescriptor, _retHandle);
		return LocalHandle<IGPUTextureView>{_retHandle};
	}
	inline LocalHandle<IGPUTextureView> CreateView(GPUTextureViewDescriptor&& descriptor, Scope* pScope) const {
		return this->CreateView(&descriptor, pScope);
	}
	inline GPUTextureFormat Format() const {
		GPUTextureFormat _ret{};
		IGPUTexture::cpp_format(this->handle, &_ret);
		return _ret;
	}
	inline u32 Width() const {
		u32 _ret{};
		IGPUTexture::cpp_width(this->handle, &_ret);
		return _ret;
	}
	inline u32 Height() const {
		u32 _ret{};
		IGPUTexture::cpp_height(this->handle, &_ret);
		return _ret;
	}
};
struct GPURenderPassColorAttachment {
	Handle<IGPUTextureView> view;
	GPUColor clearValue;
	GPULoadOp loadOp;
	GPUStoreOp storeOp;
};
struct GPURenderPassDescriptor {
	Array<GPURenderPassColorAttachment, Borrow> colorAttachments;
};
struct IGPUBindGroup {
private:
public:
	static inline constexpr char const* Name = "GPUBindGroup";
	u32 handle;
};
struct IGPUBindGroupLayout {
private:
public:
	static inline constexpr char const* Name = "GPUBindGroupLayout";
	u32 handle;
};
struct IGPUPipelineLayout {
private:
public:
	static inline constexpr char const* Name = "GPUPipelineLayout";
	u32 handle;
};
struct IGPURenderPipeline {
private:
	static wasm_import("cpp_GPURenderPipeline_getBindGroupLayout1") void cpp_getBindGroupLayout(u32, u32, u32);
public:
	static inline constexpr char const* Name = "GPURenderPipeline";
	u32 handle;
	inline LocalHandle<IGPUBindGroupLayout> GetBindGroupLayout(u32 index, Scope* pScope) const {
		u32 const _retHandle = pScope->externrefScope.AcquireLocal();
		IGPURenderPipeline::cpp_getBindGroupLayout(this->handle, index, _retHandle);
		return LocalHandle<IGPUBindGroupLayout>{_retHandle};
	}
};
struct IGPURenderPassEncoder {
private:
	static wasm_import("cpp_GPURenderPassEncoder_end0") void cpp_end(u32);
	static wasm_import("cpp_GPURenderPassEncoder_setPipeline1") void cpp_setPipeline(u32, u32);
	static wasm_import("cpp_GPURenderPassEncoder_setBindGroup2") void cpp_setBindGroup(u32, u32, u32);
	static wasm_import("cpp_GPURenderPassEncoder_setVertexBuffer4") void cpp_setVertexBuffer(u32, u32, u32, u32, u32);
	static wasm_import("cpp_GPURenderPassEncoder_draw4") void cpp_draw(u32, u32, u32, u32, u32);
public:
	static inline constexpr char const* Name = "GPURenderPassEncoder";
	u32 handle;
	inline void End() const {
		IGPURenderPassEncoder::cpp_end(this->handle);
	}
	inline void SetPipeline(Handle<IGPURenderPipeline> pipeline) const {
		IGPURenderPassEncoder::cpp_setPipeline(this->handle, pipeline->handle);
	}
	inline void SetBindGroup(u32 index, Handle<IGPUBindGroup> bindGroup) const {
		IGPURenderPassEncoder::cpp_setBindGroup(this->handle, index, bindGroup->handle);
	}
	inline void SetVertexBuffer(u32 slot, Handle<IGPUBuffer> buffer, u32 offset, u32 size) const {
		IGPURenderPassEncoder::cpp_setVertexBuffer(this->handle, slot, buffer->handle, offset, size);
	}
	inline void Draw(u32 vertexCount, u32 instanceCount = 1, u32 firstVertex = 0, u32 firstInstance = 0) const {
		IGPURenderPassEncoder::cpp_draw(this->handle, vertexCount, instanceCount, firstVertex, firstInstance);
	}
};
struct IGPUCommandEncoder {
private:
	static wasm_import("cpp_GPUCommandEncoder_beginRenderPass1") void cpp_beginRenderPass(u32, GPURenderPassDescriptor const*, u32);
	static wasm_import("cpp_GPUCommandEncoder_finish0") void cpp_finish(u32, u32);
public:
	static inline constexpr char const* Name = "GPUCommandEncoder";
	u32 handle;
	inline LocalHandle<IGPURenderPassEncoder> BeginRenderPass(GPURenderPassDescriptor const* pDescriptor, Scope* pScope) const {
		u32 const _retHandle = pScope->externrefScope.AcquireLocal();
		IGPUCommandEncoder::cpp_beginRenderPass(this->handle, pDescriptor, _retHandle);
		return LocalHandle<IGPURenderPassEncoder>{_retHandle};
	}
	inline LocalHandle<IGPURenderPassEncoder> BeginRenderPass(GPURenderPassDescriptor&& descriptor, Scope* pScope) const {
		return this->BeginRenderPass(&descriptor, pScope);
	}
	inline LocalHandle<IGPUCommandBuffer> Finish(Scope* pScope) const {
		u32 const _retHandle = pScope->externrefScope.AcquireLocal();
		IGPUCommandEncoder::cpp_finish(this->handle, _retHandle);
		return LocalHandle<IGPUCommandBuffer>{_retHandle};
	}
};
struct GPUOrigin3DDict {
	u32 x{0};
	u32 y{0};
	u32 z{0};
};
struct GPUImageCopyTexture {
	Handle<IGPUTexture> texture;
	u32 mipLevel{0};
	GPUOrigin3DDict origin;
	GPUTextureAspect aspect{GPUTextureAspect::All};
};
struct GPUImageDataLayout {
	u32 offset{0};
	u32 bytesPerRow;
	u32 rowsPerImage;
};
struct WriteBufferParamStruct {
	Handle<IGPUBuffer> buffer;
	u32 bufferOffset;
	Memory<u8> data;
	u32 dataOffset;
	u32 size;
};
struct WriteTextureParamStruct {
	GPUImageCopyTexture destination;
	Memory<u8> data;
	GPUImageDataLayout dataLayout;
	GPUExtent3DDict size;
};
struct IGPUQueue {
private:
	static wasm_import("cpp_GPUQueue_submit1") void cpp_submit(u32, Array<Handle<IGPUCommandBuffer>, Borrow> const*);
	static wasm_import("cpp_GPUQueue_writeBuffer5") void cpp_writeBuffer(u32, u32, u32, Memory<u8> const*, u32, u32);
	static wasm_import("cpp_GPUQueue_writeBuffer1") void cpp_writeBuffer(u32, WriteBufferParamStruct const*);
	static wasm_import("cpp_GPUQueue_writeTexture4") void cpp_writeTexture(u32, GPUImageCopyTexture const*, Memory<u8> const*, GPUImageDataLayout const*, GPUExtent3DDict const*);
	static wasm_import("cpp_GPUQueue_writeTexture1") void cpp_writeTexture(u32, WriteTextureParamStruct const*);
public:
	static inline constexpr char const* Name = "GPUQueue";
	u32 handle;
	inline void Submit(Array<Handle<IGPUCommandBuffer>, Borrow> const* pCommandBuffers) const {
		IGPUQueue::cpp_submit(this->handle, pCommandBuffers);
	}
	inline void Submit(Array<Handle<IGPUCommandBuffer>, Borrow>&& commandBuffers) const {
		this->Submit(&commandBuffers);
	}
	inline void WriteBuffer(Handle<IGPUBuffer> buffer, u32 bufferOffset, Memory<u8> const* pData, u32 dataOffset, u32 size) const {
		IGPUQueue::cpp_writeBuffer(this->handle, buffer->handle, bufferOffset, pData, dataOffset, size);
	}
	inline void WriteBuffer(Handle<IGPUBuffer> buffer, u32 bufferOffset, Memory<u8>&& data, u32 dataOffset, u32 size) const {
		this->WriteBuffer(buffer, bufferOffset, &data, dataOffset, size);
	}
	inline void WriteBuffer(WriteBufferParamStruct const* pParams) const {
		IGPUQueue::cpp_writeBuffer(this->handle, pParams);
	}
	inline void WriteBuffer(WriteBufferParamStruct&& params) const {
		this->WriteBuffer(&params);
	}
	inline void WriteTexture(GPUImageCopyTexture const* pDestination, Memory<u8> const* pData, GPUImageDataLayout const* pDataLayout, GPUExtent3DDict const* pSize) const {
		IGPUQueue::cpp_writeTexture(this->handle, pDestination, pData, pDataLayout, pSize);
	}
	inline void WriteTexture(GPUImageCopyTexture&& destination, Memory<u8>&& data, GPUImageDataLayout&& dataLayout, GPUExtent3DDict&& size) const {
		this->WriteTexture(&destination, &data, &dataLayout, &size);
	}
	inline void WriteTexture(WriteTextureParamStruct const* pParams) const {
		IGPUQueue::cpp_writeTexture(this->handle, pParams);
	}
	inline void WriteTexture(WriteTextureParamStruct&& params) const {
		this->WriteTexture(&params);
	}
};
struct IGPUShaderModule {
private:
public:
	static inline constexpr char const* Name = "GPUShaderModule";
	u32 handle;
};
enum class GPUVertexStepMode {
	Vertex = 1,
	Instance = 2,
};
enum class GPUVertexFormat {
	Uint8x2 = 1,
	Uint8x4 = 2,
	Sint8x2 = 3,
	Sint8x4 = 4,
	Unorm8x2 = 5,
	Unorm8x4 = 6,
	Snorm8x2 = 7,
	Snorm8x4 = 8,
	Uint16x2 = 9,
	Uint16x4 = 10,
	Sint16x2 = 11,
	Sint16x4 = 12,
	Unorm16x2 = 13,
	Unorm16x4 = 14,
	Snorm16x2 = 15,
	Snorm16x4 = 16,
	Float16x2 = 17,
	Float16x4 = 18,
	Float32 = 19,
	Float32x2 = 20,
	Float32x3 = 21,
	Float32x4 = 22,
	Uint32 = 23,
	Uint32x2 = 24,
	Uint32x3 = 25,
	Uint32x4 = 26,
	Sint32 = 27,
	Sint32x2 = 28,
	Sint32x3 = 29,
	Sint32x4 = 30,
};
enum class GPUPrimitiveTopology {
	Point_List = 1,
	Line_List = 2,
	Line_Strip = 3,
	Triangle_List = 4,
	Triangle_Strip = 5,
};
enum class GPUIndexFormat {
	Uint16 = 1,
	Uint32 = 2,
};
enum class GPUFrontFace {
	Ccw = 1,
	Cw = 2,
};
enum class GPUCullMode {
	None = 1,
	Front = 2,
	Back = 3,
};
enum class GPUCompareFunction {
	Never = 1,
	Less = 2,
	Equal = 3,
	Less_Equal = 4,
	Greater = 5,
	Not_Equal = 6,
	Greater_Equal = 7,
	Always = 8,
};
enum class GPUBlendOperation {
	Add = 1,
	Subtract = 2,
	Reverse_Subtract = 3,
	Min = 4,
	Max = 5,
};
enum class GPUBlendFactor {
	Zero = 1,
	One = 2,
	Src = 3,
	One_Minus_Src = 4,
	Src_Alpha = 5,
	One_Minus_Src_Alpha = 6,
	Dst = 7,
	One_Minus_Dst = 8,
	Dst_Alpha = 9,
	One_Minus_Dst_Alpha = 10,
	Src_Alpha_Saturated = 11,
	Constant = 12,
	One_Minus_Constant = 13,
};
enum class GPUColorWrite: u32 {
	RED = 1,
	GREEN = 2,
	BLUE = 4,
	ALPHA = 8,
	ALL = 15,
};
inline constexpr GPUColorWrite operator |(GPUColorWrite l, GPUColorWrite r) { return (GPUColorWrite)((u32)l | (u32)r); }
enum class GPUBufferUsageFlags: u32 {
	MAP_READ = 1,
	MAP_WRITE = 2,
	COPY_SRC = 4,
	COPY_DST = 8,
	INDEX = 16,
	VERTEX = 32,
	UNIFORM = 64,
	STORAGE = 128,
	INDIRECT = 256,
	QUERY_RESOLVE = 512,
};
inline constexpr GPUBufferUsageFlags operator |(GPUBufferUsageFlags l, GPUBufferUsageFlags r) { return (GPUBufferUsageFlags)((u32)l | (u32)r); }
enum class GPUAutoLayoutMode {
	Auto = 1,
};
struct GPUBlendComponent {
	GPUBlendOperation operation;
	GPUBlendFactor srcFactor;
	GPUBlendFactor dstFactor;
};
struct GPUBlendState {
	GPUBlendComponent color;
	GPUBlendComponent alpha;
};
struct GPUColorTargetState {
	GPUTextureFormat format;
	Optional<GPUBlendState> blend;
	GPUColorWrite writeMask{0xF};
};
struct GPUVertexAttribute {
	GPUVertexFormat format;
	u32 offset;
	u32 shaderLocation;
};
struct GPUVertexBufferLayout {
	u32 arrayStride;
	GPUVertexStepMode stepMode{GPUVertexStepMode::Vertex};
	Array<GPUVertexAttribute, Borrow> attributes;
};
struct GPUProgrammableStage {
	Handle<IGPUShaderModule> module_;
	char const* pEntryPoint;
	Optional<Array<RecordEntry<u32>, Borrow>> constants;
};
struct GPUVertexState {
	Handle<IGPUShaderModule> module_;
	char const* pEntryPoint;
	Optional<Array<RecordEntry<u32>, Borrow>> constants;
	Array<GPUVertexBufferLayout, Borrow> buffers;
};
struct GPUFragmentState {
	Handle<IGPUShaderModule> module_;
	char const* pEntryPoint;
	Optional<Array<RecordEntry<u32>, Borrow>> constants;
	Array<GPUColorTargetState, Borrow> targets;
};
struct GPUDepthStencilState {
	GPUTextureFormat format;
	bool depthWriteEnabled{false};
	GPUCompareFunction depthCompare{GPUCompareFunction::Always};
};
struct GPUPrimitiveState {
	GPUPrimitiveTopology topology{GPUPrimitiveTopology::Triangle_List};
	GPUIndexFormat stripIndexFormat;
	GPUFrontFace frontFace{GPUFrontFace::Ccw};
	GPUCullMode cullMode{GPUCullMode::None};
	bool unclippedDepth{false};
};
struct GPULayoutMode {
	u32 tag;
	union {
		GPUAutoLayoutMode gpuautolayoutmode;
		Handle<IGPUPipelineLayout> handle_igpupipelinelayout_;
	};
	GPULayoutMode(GPUAutoLayoutMode val) : tag{0}, gpuautolayoutmode{val} {};
	GPULayoutMode(Handle<IGPUPipelineLayout> val) : tag{1}, handle_igpupipelinelayout_{val} {};
};
struct GPUPipelineDescriptorBase {
	GPULayoutMode layout;
};
struct GPUPipelineLayoutDescriptor {
	Array<Handle<IGPUBindGroupLayout>, Borrow> bindGroupLayouts;
};
struct GPURenderPipelineDescriptor {
	GPULayoutMode layout;
	GPUVertexState vertex;
	Optional<GPUPrimitiveState> primitive;
	Optional<GPUDepthStencilState> depthStencil;
	Optional<GPUFragmentState> fragment;
};
struct GPUShaderModuleDescriptor {
	char const* pCode;
};
struct GPUBufferDescriptor {
	u32 size;
	GPUBufferUsageFlags usage;
};
enum class GPUAddressMode {
	Clamp_To_Edge = 1,
	Repeat = 2,
	Mirror_Repeat = 3,
};
enum class GPUFilterMode {
	Nearest = 1,
	Linear = 2,
};
struct GPUSamplerDescriptor {
	GPUAddressMode addressModeU{GPUAddressMode::Clamp_To_Edge};
	GPUAddressMode addressModeV{GPUAddressMode::Clamp_To_Edge};
	GPUAddressMode addressModeW{GPUAddressMode::Clamp_To_Edge};
	GPUFilterMode magFilter{GPUFilterMode::Nearest};
	GPUFilterMode minFilter{GPUFilterMode::Nearest};
	GPUFilterMode mipmapFilter{GPUFilterMode::Nearest};
	u32 lodMinClamp{0};
	u32 lodMaxClamp{32};
	u32 maxAnisotropy{1};
};
struct GPUBufferBinding {
	Handle<IGPUBuffer> buffer;
	u32 offset{0};
	Optional<u32> size;
};
struct GPUBindingResource {
	u32 tag;
	union {
		Handle<IGPUSampler> handle_igpusampler_;
		Handle<IGPUTextureView> handle_igputextureview_;
		GPUBufferBinding gpubufferbinding;
	};
	GPUBindingResource(Handle<IGPUSampler> val) : tag{0}, handle_igpusampler_{val} {};
	GPUBindingResource(Handle<IGPUTextureView> val) : tag{1}, handle_igputextureview_{val} {};
	GPUBindingResource(GPUBufferBinding val) : tag{2}, gpubufferbinding{val} {};
};
struct GPUBindGroupEntry {
	u32 binding;
	GPUBindingResource resource;
};
struct GPUBindGroupDescriptor {
	Handle<IGPUBindGroupLayout> layout;
	Array<GPUBindGroupEntry, Borrow> entries;
};
enum class GPUShaderStageFlags: u32 {
	VERTEX = 1,
	FRAGMENT = 2,
	COMPUTE = 4,
};
inline constexpr GPUShaderStageFlags operator |(GPUShaderStageFlags l, GPUShaderStageFlags r) { return (GPUShaderStageFlags)((u32)l | (u32)r); }
enum class GPUBufferBindingType {
	Uniform = 1,
	Storage = 2,
	Read_Only_Storage = 3,
};
struct GPUBufferBindingLayout {
	GPUBufferBindingType type{GPUBufferBindingType::Uniform};
	bool hasDynamicOffset{false};
	u32 minBindingSize{0};
};
enum class GPUSamplerBindingType {
	Filtering = 1,
	Non_Filtering = 2,
	Comparison = 3,
};
struct GPUSamplerBindingLayout {
	GPUSamplerBindingType type{GPUSamplerBindingType::Filtering};
};
enum class GPUTextureSampleType {
	Float = 1,
	Unfilterable_Float = 2,
	Depth = 3,
	Sint = 4,
	Uint = 5,
};
struct GPUTextureBindingLayout {
	GPUTextureSampleType sampleType{GPUTextureSampleType::Float};
	GPUTextureViewDimension viewDimension{GPUTextureViewDimension::_2d};
	bool multisampled{false};
};
struct GPUBindGroupLayoutEntry {
	u32 binding;
	GPUShaderStageFlags visibility;
	Optional<GPUBufferBindingLayout> buffer;
	Optional<GPUSamplerBindingLayout> sampler;
	Optional<GPUTextureBindingLayout> texture;
};
struct GPUBindGroupLayoutDescriptor {
	Array<GPUBindGroupLayoutEntry, Borrow> entries;
};
struct IGPUDevice {
private:
	static wasm_import("cpp_GPUDevice_destroy0") void cpp_destroy(u32);
	static wasm_import("cpp_GPUDevice_createCommandEncoder0") void cpp_createCommandEncoder(u32, u32);
	static wasm_import("cpp_GPUDevice_createTexture1") void cpp_createTexture(u32, GPUTextureDescriptor const*, u32);
	static wasm_import("cpp_GPUDevice_createShaderModule1") void cpp_createShaderModule(u32, GPUShaderModuleDescriptor const*, u32);
	static wasm_import("cpp_GPUDevice_createPipelineLayout1") void cpp_createPipelineLayout(u32, GPUPipelineLayoutDescriptor const*, u32);
	static wasm_import("cpp_GPUDevice_createRenderPipeline1") void cpp_createRenderPipeline(u32, GPURenderPipelineDescriptor const*, u32);
	static wasm_import("cpp_GPUDevice_createBuffer1") void cpp_createBuffer(u32, GPUBufferDescriptor const*, u32);
	static wasm_import("cpp_GPUDevice_createSampler1") void cpp_createSampler(u32, GPUSamplerDescriptor const*, u32);
	static wasm_import("cpp_GPUDevice_createBindGroup1") void cpp_createBindGroup(u32, GPUBindGroupDescriptor const*, u32);
	static wasm_import("cpp_GPUDevice_createBindGroupLayout1") void cpp_createBindGroupLayout(u32, GPUBindGroupLayoutDescriptor const*, u32);
	static wasm_import("cpp_GPUDevice_queue") void cpp_queue(u32, u32);
public:
	static inline constexpr char const* Name = "GPUDevice";
	u32 handle;
	inline void Destroy() const {
		IGPUDevice::cpp_destroy(this->handle);
	}
	inline LocalHandle<IGPUCommandEncoder> CreateCommandEncoder(Scope* pScope) const {
		u32 const _retHandle = pScope->externrefScope.AcquireLocal();
		IGPUDevice::cpp_createCommandEncoder(this->handle, _retHandle);
		return LocalHandle<IGPUCommandEncoder>{_retHandle};
	}
	inline LocalHandle<IGPUTexture> CreateTexture(GPUTextureDescriptor const* pDescriptor, Scope* pScope) const {
		u32 const _retHandle = pScope->externrefScope.AcquireLocal();
		IGPUDevice::cpp_createTexture(this->handle, pDescriptor, _retHandle);
		return LocalHandle<IGPUTexture>{_retHandle};
	}
	inline LocalHandle<IGPUTexture> CreateTexture(GPUTextureDescriptor&& descriptor, Scope* pScope) const {
		return this->CreateTexture(&descriptor, pScope);
	}
	inline LocalHandle<IGPUShaderModule> CreateShaderModule(GPUShaderModuleDescriptor const* pDescriptor, Scope* pScope) const {
		u32 const _retHandle = pScope->externrefScope.AcquireLocal();
		IGPUDevice::cpp_createShaderModule(this->handle, pDescriptor, _retHandle);
		return LocalHandle<IGPUShaderModule>{_retHandle};
	}
	inline LocalHandle<IGPUShaderModule> CreateShaderModule(GPUShaderModuleDescriptor&& descriptor, Scope* pScope) const {
		return this->CreateShaderModule(&descriptor, pScope);
	}
	inline LocalHandle<IGPUPipelineLayout> CreatePipelineLayout(GPUPipelineLayoutDescriptor const* pDescriptor, Scope* pScope) const {
		u32 const _retHandle = pScope->externrefScope.AcquireLocal();
		IGPUDevice::cpp_createPipelineLayout(this->handle, pDescriptor, _retHandle);
		return LocalHandle<IGPUPipelineLayout>{_retHandle};
	}
	inline LocalHandle<IGPUPipelineLayout> CreatePipelineLayout(GPUPipelineLayoutDescriptor&& descriptor, Scope* pScope) const {
		return this->CreatePipelineLayout(&descriptor, pScope);
	}
	inline LocalHandle<IGPURenderPipeline> CreateRenderPipeline(GPURenderPipelineDescriptor const* pDescriptor, Scope* pScope) const {
		u32 const _retHandle = pScope->externrefScope.AcquireLocal();
		IGPUDevice::cpp_createRenderPipeline(this->handle, pDescriptor, _retHandle);
		return LocalHandle<IGPURenderPipeline>{_retHandle};
	}
	inline LocalHandle<IGPURenderPipeline> CreateRenderPipeline(GPURenderPipelineDescriptor&& descriptor, Scope* pScope) const {
		return this->CreateRenderPipeline(&descriptor, pScope);
	}
	inline LocalHandle<IGPUBuffer> CreateBuffer(GPUBufferDescriptor const* pDescriptor, Scope* pScope) const {
		u32 const _retHandle = pScope->externrefScope.AcquireLocal();
		IGPUDevice::cpp_createBuffer(this->handle, pDescriptor, _retHandle);
		return LocalHandle<IGPUBuffer>{_retHandle};
	}
	inline LocalHandle<IGPUBuffer> CreateBuffer(GPUBufferDescriptor&& descriptor, Scope* pScope) const {
		return this->CreateBuffer(&descriptor, pScope);
	}
	inline LocalHandle<IGPUSampler> CreateSampler(GPUSamplerDescriptor const* pDescriptor, Scope* pScope) const {
		u32 const _retHandle = pScope->externrefScope.AcquireLocal();
		IGPUDevice::cpp_createSampler(this->handle, pDescriptor, _retHandle);
		return LocalHandle<IGPUSampler>{_retHandle};
	}
	inline LocalHandle<IGPUSampler> CreateSampler(GPUSamplerDescriptor&& descriptor, Scope* pScope) const {
		return this->CreateSampler(&descriptor, pScope);
	}
	inline LocalHandle<IGPUBindGroup> CreateBindGroup(GPUBindGroupDescriptor const* pDescriptor, Scope* pScope) const {
		u32 const _retHandle = pScope->externrefScope.AcquireLocal();
		IGPUDevice::cpp_createBindGroup(this->handle, pDescriptor, _retHandle);
		return LocalHandle<IGPUBindGroup>{_retHandle};
	}
	inline LocalHandle<IGPUBindGroup> CreateBindGroup(GPUBindGroupDescriptor&& descriptor, Scope* pScope) const {
		return this->CreateBindGroup(&descriptor, pScope);
	}
	inline LocalHandle<IGPUBindGroupLayout> CreateBindGroupLayout(GPUBindGroupLayoutDescriptor const* pDescriptor, Scope* pScope) const {
		u32 const _retHandle = pScope->externrefScope.AcquireLocal();
		IGPUDevice::cpp_createBindGroupLayout(this->handle, pDescriptor, _retHandle);
		return LocalHandle<IGPUBindGroupLayout>{_retHandle};
	}
	inline LocalHandle<IGPUBindGroupLayout> CreateBindGroupLayout(GPUBindGroupLayoutDescriptor&& descriptor, Scope* pScope) const {
		return this->CreateBindGroupLayout(&descriptor, pScope);
	}
	inline LocalHandle<IGPUQueue> Queue(Scope* pScope) const {
		u32 const _retHandle = pScope->externrefScope.AcquireLocal();
		IGPUDevice::cpp_queue(this->handle, _retHandle);
		return LocalHandle<IGPUQueue>{_retHandle};
	}
};
struct GPUCanvasConfiguration {
	Handle<IGPUDevice> device;
	GPUTextureFormat format;
	GPUTextureUsageFlags usage{0x10};
	GPUCanvasAlphaMode alphaMode{GPUCanvasAlphaMode::Opaque};
};
struct IGPUCanvasContext {
private:
	static wasm_import("cpp_GPUCanvasContext_configure1") void cpp_configure(u32, GPUCanvasConfiguration const*);
	static wasm_import("cpp_GPUCanvasContext_getCurrentTexture0") void cpp_getCurrentTexture(u32, u32);
public:
	static inline constexpr char const* Name = "GPUCanvasContext";
	u32 handle;
	inline void Configure(GPUCanvasConfiguration const* pConfiguration) const {
		IGPUCanvasContext::cpp_configure(this->handle, pConfiguration);
	}
	inline void Configure(GPUCanvasConfiguration&& configuration) const {
		this->Configure(&configuration);
	}
	inline LocalHandle<IGPUTexture> GetCurrentTexture(Scope* pScope) const {
		u32 const _retHandle = pScope->externrefScope.AcquireLocal();
		IGPUCanvasContext::cpp_getCurrentTexture(this->handle, _retHandle);
		return LocalHandle<IGPUTexture>{_retHandle};
	}
};
struct IGPU {
private:
	static wasm_import("cpp_GPU_getPreferredCanvasFormat0") void cpp_getPreferredCanvasFormat(u32, GPUTextureFormat*);
public:
	static inline constexpr char const* Name = "GPU";
	u32 handle;
	inline GPUTextureFormat GetPreferredCanvasFormat() const {
		GPUTextureFormat _ret{};
		IGPU::cpp_getPreferredCanvasFormat(this->handle, &_ret);
		return _ret;
	}
};
}