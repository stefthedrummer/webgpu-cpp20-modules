import { Engine } from "./engine";
import { cpp_decode_optional, cpp_decode_Array, cpp_decode_String, cpp_decode_Record, cpp_decode_BufferSource, size_t, cpp_encode_Array_Borrow, cpp_encode_Array_Heap, cpp_enum_literals, cpp_enum_define_literals } from "./bindgen-api";
const cpp_enum_GPUTextureDimension = cpp_enum_define_literals<GPUTextureDimension>(
	undefined!, "1d", "2d", "3d"
);
const cpp_enum_GPUTextureFormat = cpp_enum_define_literals<GPUTextureFormat>(
	undefined!, "r8unorm", "r8snorm", "r8uint", "r8sint", "r16uint", "r16sint", "r16float", "rg8unorm", "rg8snorm", "rg8uint", "rg8sint", "r32uint", "r32sint", "r32float", "rg16uint", "rg16sint", "rg16float", "rgba8unorm", "rgba8unorm-srgb", "rgba8snorm", "rgba8uint", "rgba8sint", "bgra8unorm", "bgra8unorm-srgb", "rgb9e5ufloat", "rgb10a2unorm", "rg11b10ufloat", "rg32uint", "rg32sint", "rg32float", "rgba16uint", "rgba16sint", "rgba16float", "rgba32uint", "rgba32sint", "rgba32float", "stencil8", "depth16unorm", "depth24plus", "depth24plus-stencil8", "depth32float", "depth32float-stencil8", "bc1-rgba-unorm", "bc1-rgba-unorm-srgb", "bc2-rgba-unorm", "bc2-rgba-unorm-srgb", "bc3-rgba-unorm", "bc3-rgba-unorm-srgb", "bc4-r-unorm", "bc4-r-snorm", "bc5-rg-unorm", "bc5-rg-snorm", "bc6h-rgb-ufloat", "bc6h-rgb-float", "bc7-rgba-unorm", "bc7-rgba-unorm-srgb", "etc2-rgb8unorm", "etc2-rgb8unorm-srgb", "etc2-rgb8a1unorm", "etc2-rgb8a1unorm-srgb", "etc2-rgba8unorm", "etc2-rgba8unorm-srgb", "eac-r11unorm", "eac-r11snorm", "eac-rg11unorm", "eac-rg11snorm", "astc-4x4-unorm", "astc-4x4-unorm-srgb", "astc-5x4-unorm", "astc-5x4-unorm-srgb", "astc-5x5-unorm", "astc-5x5-unorm-srgb", "astc-6x5-unorm", "astc-6x5-unorm-srgb", "astc-6x6-unorm", "astc-6x6-unorm-srgb", "astc-8x5-unorm", "astc-8x5-unorm-srgb", "astc-8x6-unorm", "astc-8x6-unorm-srgb", "astc-8x8-unorm", "astc-8x8-unorm-srgb", "astc-10x5-unorm", "astc-10x5-unorm-srgb", "astc-10x6-unorm", "astc-10x6-unorm-srgb", "astc-10x8-unorm", "astc-10x8-unorm-srgb", "astc-10x10-unorm", "astc-10x10-unorm-srgb", "astc-12x10-unorm", "astc-12x10-unorm-srgb", "astc-12x12-unorm", "astc-12x12-unorm-srgb"
);
const cpp_enum_GPULoadOp = cpp_enum_define_literals<GPULoadOp>(
	undefined!, "load", "clear"
);
const cpp_enum_GPUStoreOp = cpp_enum_define_literals<GPUStoreOp>(
	undefined!, "store", "discard"
);
const cpp_enum_GPUCanvasAlphaMode = cpp_enum_define_literals<GPUCanvasAlphaMode>(
	undefined!, "opaque", "premultiplied"
);
export const cpp_sizeof_GPUExtent3DDict = 12;
export function cpp_decode_GPUExtent3DDict(ptr: number): GPUExtent3DDict {
	return {
		width: Engine.mem_u32[(ptr + 0) >> 2],
		height: Engine.mem_u32[(ptr + 4) >> 2],
		depthOrArrayLayers: Engine.mem_u32[(ptr + 8) >> 2],
	};
};
export const cpp_sizeof_GPUTextureDescriptor = 44;
export function cpp_decode_GPUTextureDescriptor(ptr: number): GPUTextureDescriptor {
	return {
		size: cpp_decode_GPUExtent3DDict(ptr + 0),
		mipLevelCount: Engine.mem_u32[(ptr + 12) >> 2],
		sampleCount: Engine.mem_u32[(ptr + 16) >> 2],
		dimension: cpp_enum_GPUTextureDimension[Engine.mem_u32[(ptr + 20) >> 2]],
		format: cpp_enum_GPUTextureFormat[Engine.mem_u32[(ptr + 24) >> 2]],
		usage: Engine.mem_u32[(ptr + 28) >> 2],
		viewFormats: cpp_decode_Array(ptr + 32, 4, (e_ptr) => cpp_enum_GPUTextureFormat[Engine.mem_u32[(e_ptr) >> 2]]),
	};
};
export const cpp_sizeof_GPUColor = 16;
export function cpp_decode_GPUColor(ptr: number): GPUColor {
	return {
		r: Engine.mem_f32[(ptr + 0) >> 2],
		g: Engine.mem_f32[(ptr + 4) >> 2],
		b: Engine.mem_f32[(ptr + 8) >> 2],
		a: Engine.mem_f32[(ptr + 12) >> 2],
	};
};
const cpp_enum_GPUTextureAspect = cpp_enum_define_literals<GPUTextureAspect>(
	undefined!, "all", "depth-only", "stencil-only"
);
const cpp_enum_GPUTextureViewDimension = cpp_enum_define_literals<GPUTextureViewDimension>(
	undefined!, "1d", "2d", "2d-array", "cube", "cube-array", "3d"
);
export const cpp_sizeof_GPUTextureViewDescriptor = 20;
export function cpp_decode_GPUTextureViewDescriptor(ptr: number): GPUTextureViewDescriptor {
	return {
		format: cpp_decode_optional(ptr + 0, (e_ptr) => cpp_enum_GPUTextureFormat[Engine.mem_u32[(e_ptr) >> 2]]),
		dimension: cpp_decode_optional(ptr + 8, (e_ptr) => cpp_enum_GPUTextureViewDimension[Engine.mem_u32[(e_ptr) >> 2]]),
		aspect: cpp_enum_GPUTextureAspect[Engine.mem_u32[(ptr + 16) >> 2]],
	};
};
export class cpp_GPUTextureView {
};
export class cpp_GPUSampler {
};
export class cpp_GPUCommandBuffer {
};
export class cpp_GPUBuffer {
	static cpp_GPUBuffer_destroy0(_this: number): void {
		const arg_this = Engine.externref_table.get(_this) as GPUBuffer;
		arg_this.destroy();
	}
};
export class cpp_GPUTexture {
	static cpp_GPUTexture_destroy0(_this: number): void {
		const arg_this = Engine.externref_table.get(_this) as GPUTexture;
		arg_this.destroy();
	}
	static cpp_GPUTexture_createView0(_this: number, _retHandle: number): void {
		const arg_this = Engine.externref_table.get(_this) as GPUTexture;
		const ret = arg_this.createView();
		Engine.externref_table.set(_retHandle, ret);
	}
	static cpp_GPUTexture_createView1(_this: number, descriptor: number, _retHandle: number): void {
		const arg_this = Engine.externref_table.get(_this) as GPUTexture;
		const arg_descriptor = cpp_decode_GPUTextureViewDescriptor(descriptor);
		const ret = arg_this.createView(arg_descriptor);
		Engine.externref_table.set(_retHandle, ret);
	}
	static cpp_GPUTexture_format(_this: number, _ret: number): void {
		const arg_this = Engine.externref_table.get(_this) as GPUTexture;
		const ret = arg_this.format;
		Engine.mem_u32[(_ret) >> 2] = cpp_enum_GPUTextureFormat.lookup.get(ret) || 0;
	}
	static cpp_GPUTexture_width(_this: number, _ret: number): void {
		const arg_this = Engine.externref_table.get(_this) as GPUTexture;
		const ret = arg_this.width;
		Engine.mem_u32[(_ret) >> 2] = ret;
	}
	static cpp_GPUTexture_height(_this: number, _ret: number): void {
		const arg_this = Engine.externref_table.get(_this) as GPUTexture;
		const ret = arg_this.height;
		Engine.mem_u32[(_ret) >> 2] = ret;
	}
};
export const cpp_sizeof_GPURenderPassColorAttachment = 28;
export function cpp_decode_GPURenderPassColorAttachment(ptr: number): GPURenderPassColorAttachment {
	return {
		view: Engine.externref_table.get(Engine.mem_u32[(ptr + 0) >> 2]) as GPUTextureView,
		clearValue: cpp_decode_GPUColor(ptr + 4),
		loadOp: cpp_enum_GPULoadOp[Engine.mem_u32[(ptr + 20) >> 2]],
		storeOp: cpp_enum_GPUStoreOp[Engine.mem_u32[(ptr + 24) >> 2]],
	};
};
export const cpp_sizeof_GPURenderPassDescriptor = 12;
export function cpp_decode_GPURenderPassDescriptor(ptr: number): GPURenderPassDescriptor {
	return {
		colorAttachments: cpp_decode_Array(ptr + 0, 28, (e_ptr) => cpp_decode_GPURenderPassColorAttachment(e_ptr)),
	};
};
export class cpp_GPUBindGroup {
};
export class cpp_GPUBindGroupLayout {
};
export class cpp_GPUPipelineLayout {
};
export class cpp_GPURenderPipeline {
	static cpp_GPURenderPipeline_getBindGroupLayout1(_this: number, index: number, _retHandle: number): void {
		const arg_this = Engine.externref_table.get(_this) as GPURenderPipeline;
		const arg_index = index;
		const ret = arg_this.getBindGroupLayout(arg_index);
		Engine.externref_table.set(_retHandle, ret);
	}
};
export class cpp_GPURenderPassEncoder {
	static cpp_GPURenderPassEncoder_end0(_this: number): void {
		const arg_this = Engine.externref_table.get(_this) as GPURenderPassEncoder;
		arg_this.end();
	}
	static cpp_GPURenderPassEncoder_setPipeline1(_this: number, pipeline: number): void {
		const arg_this = Engine.externref_table.get(_this) as GPURenderPassEncoder;
		const arg_pipeline = Engine.externref_table.get(pipeline) as GPURenderPipeline;
		arg_this.setPipeline(arg_pipeline);
	}
	static cpp_GPURenderPassEncoder_setBindGroup2(_this: number, index: number, bindGroup: number): void {
		const arg_this = Engine.externref_table.get(_this) as GPURenderPassEncoder;
		const arg_index = index;
		const arg_bindGroup = Engine.externref_table.get(bindGroup) as GPUBindGroup;
		arg_this.setBindGroup(arg_index, arg_bindGroup);
	}
	static cpp_GPURenderPassEncoder_setVertexBuffer4(_this: number, slot: number, buffer: number, offset: number, size: number): void {
		const arg_this = Engine.externref_table.get(_this) as GPURenderPassEncoder;
		const arg_slot = slot;
		const arg_buffer = Engine.externref_table.get(buffer) as GPUBuffer;
		const arg_offset = offset;
		const arg_size = size;
		arg_this.setVertexBuffer(arg_slot, arg_buffer, arg_offset, arg_size);
	}
	static cpp_GPURenderPassEncoder_draw4(_this: number, vertexCount: number, instanceCount: number, firstVertex: number, firstInstance: number): void {
		const arg_this = Engine.externref_table.get(_this) as GPURenderPassEncoder;
		const arg_vertexCount = vertexCount;
		const arg_instanceCount = instanceCount;
		const arg_firstVertex = firstVertex;
		const arg_firstInstance = firstInstance;
		arg_this.draw(arg_vertexCount, arg_instanceCount, arg_firstVertex, arg_firstInstance);
	}
};
export class cpp_GPUCommandEncoder {
	static cpp_GPUCommandEncoder_beginRenderPass1(_this: number, descriptor: number, _retHandle: number): void {
		const arg_this = Engine.externref_table.get(_this) as GPUCommandEncoder;
		const arg_descriptor = cpp_decode_GPURenderPassDescriptor(descriptor);
		const ret = arg_this.beginRenderPass(arg_descriptor);
		Engine.externref_table.set(_retHandle, ret);
	}
	static cpp_GPUCommandEncoder_finish0(_this: number, _retHandle: number): void {
		const arg_this = Engine.externref_table.get(_this) as GPUCommandEncoder;
		const ret = arg_this.finish();
		Engine.externref_table.set(_retHandle, ret);
	}
};
export const cpp_sizeof_GPUOrigin3DDict = 12;
export function cpp_decode_GPUOrigin3DDict(ptr: number): GPUOrigin3DDict {
	return {
		x: Engine.mem_u32[(ptr + 0) >> 2],
		y: Engine.mem_u32[(ptr + 4) >> 2],
		z: Engine.mem_u32[(ptr + 8) >> 2],
	};
};
export const cpp_sizeof_GPUImageCopyTexture = 24;
export function cpp_decode_GPUImageCopyTexture(ptr: number): GPUImageCopyTexture {
	return {
		texture: Engine.externref_table.get(Engine.mem_u32[(ptr + 0) >> 2]) as GPUTexture,
		mipLevel: Engine.mem_u32[(ptr + 4) >> 2],
		origin: cpp_decode_GPUOrigin3DDict(ptr + 8),
		aspect: cpp_enum_GPUTextureAspect[Engine.mem_u32[(ptr + 20) >> 2]],
	};
};
export const cpp_sizeof_GPUImageDataLayout = 12;
export function cpp_decode_GPUImageDataLayout(ptr: number): GPUImageDataLayout {
	return {
		offset: Engine.mem_u32[(ptr + 0) >> 2],
		bytesPerRow: Engine.mem_u32[(ptr + 4) >> 2],
		rowsPerImage: Engine.mem_u32[(ptr + 8) >> 2],
	};
};
export const cpp_sizeof_WriteBufferParamStruct = 24;
export const cpp_sizeof_WriteTextureParamStruct = 56;
export class cpp_GPUQueue {
	static cpp_GPUQueue_submit1(_this: number, commandBuffers: number): void {
		const arg_this = Engine.externref_table.get(_this) as GPUQueue;
		const arg_commandBuffers = cpp_decode_Array(commandBuffers, 4, (e_ptr) => Engine.externref_table.get(Engine.mem_u32[(e_ptr) >> 2]) as GPUCommandBuffer);
		arg_this.submit(arg_commandBuffers);
	}
	static cpp_GPUQueue_writeBuffer5(_this: number, buffer: number, bufferOffset: number, data: number, dataOffset: number, size: number): void {
		const arg_this = Engine.externref_table.get(_this) as GPUQueue;
		const arg_buffer = Engine.externref_table.get(buffer) as GPUBuffer;
		const arg_bufferOffset = bufferOffset;
		const arg_data = cpp_decode_BufferSource(data);
		const arg_dataOffset = dataOffset;
		const arg_size = size;
		arg_this.writeBuffer(arg_buffer, arg_bufferOffset, arg_data, arg_dataOffset, arg_size);
	}
	static cpp_GPUQueue_writeBuffer1(_this: number, params: number): void {
		const arg_this = Engine.externref_table.get(_this) as GPUQueue;
		const arg_buffer = Engine.externref_table.get(Engine.mem_u32[(params + 0) >> 2]) as GPUBuffer;
		const arg_bufferOffset = Engine.mem_u32[(params + 4) >> 2];
		const arg_data = cpp_decode_BufferSource(params + 8);
		const arg_dataOffset = Engine.mem_u32[(params + 16) >> 2];
		const arg_size = Engine.mem_u32[(params + 20) >> 2];
		arg_this.writeBuffer(arg_buffer, arg_bufferOffset, arg_data, arg_dataOffset, arg_size);
	}
	static cpp_GPUQueue_writeTexture4(_this: number, destination: number, data: number, dataLayout: number, size: number): void {
		const arg_this = Engine.externref_table.get(_this) as GPUQueue;
		const arg_destination = cpp_decode_GPUImageCopyTexture(destination);
		const arg_data = cpp_decode_BufferSource(data);
		const arg_dataLayout = cpp_decode_GPUImageDataLayout(dataLayout);
		const arg_size = cpp_decode_GPUExtent3DDict(size);
		arg_this.writeTexture(arg_destination, arg_data, arg_dataLayout, arg_size);
	}
	static cpp_GPUQueue_writeTexture1(_this: number, params: number): void {
		const arg_this = Engine.externref_table.get(_this) as GPUQueue;
		const arg_destination = cpp_decode_GPUImageCopyTexture(params + 0);
		const arg_data = cpp_decode_BufferSource(params + 24);
		const arg_dataLayout = cpp_decode_GPUImageDataLayout(params + 32);
		const arg_size = cpp_decode_GPUExtent3DDict(params + 44);
		arg_this.writeTexture(arg_destination, arg_data, arg_dataLayout, arg_size);
	}
};
export class cpp_GPUShaderModule {
};
const cpp_enum_GPUVertexStepMode = cpp_enum_define_literals<GPUVertexStepMode>(
	undefined!, "vertex", "instance"
);
const cpp_enum_GPUVertexFormat = cpp_enum_define_literals<GPUVertexFormat>(
	undefined!, "uint8x2", "uint8x4", "sint8x2", "sint8x4", "unorm8x2", "unorm8x4", "snorm8x2", "snorm8x4", "uint16x2", "uint16x4", "sint16x2", "sint16x4", "unorm16x2", "unorm16x4", "snorm16x2", "snorm16x4", "float16x2", "float16x4", "float32", "float32x2", "float32x3", "float32x4", "uint32", "uint32x2", "uint32x3", "uint32x4", "sint32", "sint32x2", "sint32x3", "sint32x4"
);
const cpp_enum_GPUPrimitiveTopology = cpp_enum_define_literals<GPUPrimitiveTopology>(
	undefined!, "point-list", "line-list", "line-strip", "triangle-list", "triangle-strip"
);
const cpp_enum_GPUIndexFormat = cpp_enum_define_literals<GPUIndexFormat>(
	undefined!, "uint16", "uint32"
);
const cpp_enum_GPUFrontFace = cpp_enum_define_literals<GPUFrontFace>(
	undefined!, "ccw", "cw"
);
const cpp_enum_GPUCullMode = cpp_enum_define_literals<GPUCullMode>(
	undefined!, "none", "front", "back"
);
const cpp_enum_GPUCompareFunction = cpp_enum_define_literals<GPUCompareFunction>(
	undefined!, "never", "less", "equal", "less-equal", "greater", "not-equal", "greater-equal", "always"
);
const cpp_enum_GPUBlendOperation = cpp_enum_define_literals<GPUBlendOperation>(
	undefined!, "add", "subtract", "reverse-subtract", "min", "max"
);
const cpp_enum_GPUBlendFactor = cpp_enum_define_literals<GPUBlendFactor>(
	undefined!, "zero", "one", "src", "one-minus-src", "src-alpha", "one-minus-src-alpha", "dst", "one-minus-dst", "dst-alpha", "one-minus-dst-alpha", "src-alpha-saturated", "constant", "one-minus-constant"
);
const cpp_enum_GPUAutoLayoutMode = cpp_enum_define_literals<GPUAutoLayoutMode>(
	undefined!, "auto"
);
export const cpp_sizeof_GPUBlendComponent = 12;
export function cpp_decode_GPUBlendComponent(ptr: number): GPUBlendComponent {
	return {
		operation: cpp_enum_GPUBlendOperation[Engine.mem_u32[(ptr + 0) >> 2]],
		srcFactor: cpp_enum_GPUBlendFactor[Engine.mem_u32[(ptr + 4) >> 2]],
		dstFactor: cpp_enum_GPUBlendFactor[Engine.mem_u32[(ptr + 8) >> 2]],
	};
};
export const cpp_sizeof_GPUBlendState = 24;
export function cpp_decode_GPUBlendState(ptr: number): GPUBlendState {
	return {
		color: cpp_decode_GPUBlendComponent(ptr + 0),
		alpha: cpp_decode_GPUBlendComponent(ptr + 12),
	};
};
export const cpp_sizeof_GPUColorTargetState = 36;
export function cpp_decode_GPUColorTargetState(ptr: number): GPUColorTargetState {
	return {
		format: cpp_enum_GPUTextureFormat[Engine.mem_u32[(ptr + 0) >> 2]],
		blend: cpp_decode_optional(ptr + 4, (e_ptr) => cpp_decode_GPUBlendState(e_ptr)),
		writeMask: Engine.mem_u32[(ptr + 32) >> 2],
	};
};
export const cpp_sizeof_GPUVertexAttribute = 12;
export function cpp_decode_GPUVertexAttribute(ptr: number): GPUVertexAttribute {
	return {
		format: cpp_enum_GPUVertexFormat[Engine.mem_u32[(ptr + 0) >> 2]],
		offset: Engine.mem_u32[(ptr + 4) >> 2],
		shaderLocation: Engine.mem_u32[(ptr + 8) >> 2],
	};
};
export const cpp_sizeof_GPUVertexBufferLayout = 20;
export function cpp_decode_GPUVertexBufferLayout(ptr: number): GPUVertexBufferLayout {
	return {
		arrayStride: Engine.mem_u32[(ptr + 0) >> 2],
		stepMode: cpp_enum_GPUVertexStepMode[Engine.mem_u32[(ptr + 4) >> 2]],
		attributes: cpp_decode_Array(ptr + 8, 12, (e_ptr) => cpp_decode_GPUVertexAttribute(e_ptr)),
	};
};
export const cpp_sizeof_GPUProgrammableStage = 24;
export function cpp_decode_GPUProgrammableStage(ptr: number): GPUProgrammableStage {
	return {
		module: Engine.externref_table.get(Engine.mem_u32[(ptr + 0) >> 2]) as GPUShaderModule,
		entryPoint: cpp_decode_String(Engine.mem_u32[(ptr + 4) >> 2]),
		constants: cpp_decode_optional(ptr + 8, (e_ptr) => cpp_decode_Record(e_ptr, size_t + 4, (e_ptr) => Engine.mem_u32[(e_ptr) >> 2])),
	};
};
export const cpp_sizeof_GPUVertexState = 36;
export function cpp_decode_GPUVertexState(ptr: number): GPUVertexState {
	return {
		module: Engine.externref_table.get(Engine.mem_u32[(ptr + 0) >> 2]) as GPUShaderModule,
		entryPoint: cpp_decode_String(Engine.mem_u32[(ptr + 4) >> 2]),
		constants: cpp_decode_optional(ptr + 8, (e_ptr) => cpp_decode_Record(e_ptr, size_t + 4, (e_ptr) => Engine.mem_u32[(e_ptr) >> 2])),
		buffers: cpp_decode_Array(ptr + 24, 20, (e_ptr) => cpp_decode_GPUVertexBufferLayout(e_ptr)),
	};
};
export const cpp_sizeof_GPUFragmentState = 36;
export function cpp_decode_GPUFragmentState(ptr: number): GPUFragmentState {
	return {
		module: Engine.externref_table.get(Engine.mem_u32[(ptr + 0) >> 2]) as GPUShaderModule,
		entryPoint: cpp_decode_String(Engine.mem_u32[(ptr + 4) >> 2]),
		constants: cpp_decode_optional(ptr + 8, (e_ptr) => cpp_decode_Record(e_ptr, size_t + 4, (e_ptr) => Engine.mem_u32[(e_ptr) >> 2])),
		targets: cpp_decode_Array(ptr + 24, 36, (e_ptr) => cpp_decode_GPUColorTargetState(e_ptr)),
	};
};
export const cpp_sizeof_GPUDepthStencilState = 12;
export function cpp_decode_GPUDepthStencilState(ptr: number): GPUDepthStencilState {
	return {
		format: cpp_enum_GPUTextureFormat[Engine.mem_u32[(ptr + 0) >> 2]],
		depthWriteEnabled: (Engine.mem_u8[ptr + 4] > 0),
		depthCompare: cpp_enum_GPUCompareFunction[Engine.mem_u32[(ptr + 8) >> 2]],
	};
};
export const cpp_sizeof_GPUPrimitiveState = 20;
export function cpp_decode_GPUPrimitiveState(ptr: number): GPUPrimitiveState {
	return {
		topology: cpp_enum_GPUPrimitiveTopology[Engine.mem_u32[(ptr + 0) >> 2]],
		stripIndexFormat: cpp_enum_GPUIndexFormat[Engine.mem_u32[(ptr + 4) >> 2]],
		frontFace: cpp_enum_GPUFrontFace[Engine.mem_u32[(ptr + 8) >> 2]],
		cullMode: cpp_enum_GPUCullMode[Engine.mem_u32[(ptr + 12) >> 2]],
		unclippedDepth: (Engine.mem_u8[ptr + 16] > 0),
	};
};
export function cpp_parse_GPULayoutMode(ptr: number): GPUAutoLayoutMode | GPUPipelineLayout {
	const tag = Engine.mem_u32[(ptr + 0) >> 2];
	switch(tag) {
		case 0: return cpp_enum_GPUAutoLayoutMode[Engine.mem_u32[(ptr + 4) >> 2]]
		case 1: return Engine.externref_table.get(Engine.mem_u32[(ptr + 4) >> 2]) as GPUPipelineLayout
		default: throw new Error("Unknown union-tag");
	};
};
export const cpp_sizeof_GPUPipelineDescriptorBase = 8;
export function cpp_decode_GPUPipelineDescriptorBase(ptr: number): GPUPipelineDescriptorBase {
	return {
		layout: cpp_parse_GPULayoutMode(ptr + 0),
	};
};
export const cpp_sizeof_GPUPipelineLayoutDescriptor = 12;
export function cpp_decode_GPUPipelineLayoutDescriptor(ptr: number): GPUPipelineLayoutDescriptor {
	return {
		bindGroupLayouts: cpp_decode_Array(ptr + 0, 4, (e_ptr) => Engine.externref_table.get(Engine.mem_u32[(e_ptr) >> 2]) as GPUBindGroupLayout),
	};
};
export const cpp_sizeof_GPURenderPipelineDescriptor = 124;
export function cpp_decode_GPURenderPipelineDescriptor(ptr: number): GPURenderPipelineDescriptor {
	return {
		layout: cpp_parse_GPULayoutMode(ptr + 0),
		vertex: cpp_decode_GPUVertexState(ptr + 8),
		primitive: cpp_decode_optional(ptr + 44, (e_ptr) => cpp_decode_GPUPrimitiveState(e_ptr)),
		depthStencil: cpp_decode_optional(ptr + 68, (e_ptr) => cpp_decode_GPUDepthStencilState(e_ptr)),
		fragment: cpp_decode_optional(ptr + 84, (e_ptr) => cpp_decode_GPUFragmentState(e_ptr)),
	};
};
export const cpp_sizeof_GPUShaderModuleDescriptor = 4;
export function cpp_decode_GPUShaderModuleDescriptor(ptr: number): GPUShaderModuleDescriptor {
	return {
		code: cpp_decode_String(Engine.mem_u32[(ptr + 0) >> 2]),
	};
};
export const cpp_sizeof_GPUBufferDescriptor = 8;
export function cpp_decode_GPUBufferDescriptor(ptr: number): GPUBufferDescriptor {
	return {
		size: Engine.mem_u32[(ptr + 0) >> 2],
		usage: Engine.mem_u32[(ptr + 4) >> 2],
	};
};
const cpp_enum_GPUAddressMode = cpp_enum_define_literals<GPUAddressMode>(
	undefined!, "clamp-to-edge", "repeat", "mirror-repeat"
);
const cpp_enum_GPUFilterMode = cpp_enum_define_literals<GPUFilterMode>(
	undefined!, "nearest", "linear"
);
export const cpp_sizeof_GPUSamplerDescriptor = 36;
export function cpp_decode_GPUSamplerDescriptor(ptr: number): GPUSamplerDescriptor {
	return {
		addressModeU: cpp_enum_GPUAddressMode[Engine.mem_u32[(ptr + 0) >> 2]],
		addressModeV: cpp_enum_GPUAddressMode[Engine.mem_u32[(ptr + 4) >> 2]],
		addressModeW: cpp_enum_GPUAddressMode[Engine.mem_u32[(ptr + 8) >> 2]],
		magFilter: cpp_enum_GPUFilterMode[Engine.mem_u32[(ptr + 12) >> 2]],
		minFilter: cpp_enum_GPUFilterMode[Engine.mem_u32[(ptr + 16) >> 2]],
		mipmapFilter: cpp_enum_GPUFilterMode[Engine.mem_u32[(ptr + 20) >> 2]],
		lodMinClamp: Engine.mem_u32[(ptr + 24) >> 2],
		lodMaxClamp: Engine.mem_u32[(ptr + 28) >> 2],
		maxAnisotropy: Engine.mem_u32[(ptr + 32) >> 2],
	};
};
export const cpp_sizeof_GPUBufferBinding = 16;
export function cpp_decode_GPUBufferBinding(ptr: number): GPUBufferBinding {
	return {
		buffer: Engine.externref_table.get(Engine.mem_u32[(ptr + 0) >> 2]) as GPUBuffer,
		offset: Engine.mem_u32[(ptr + 4) >> 2],
		size: cpp_decode_optional(ptr + 8, (e_ptr) => Engine.mem_u32[(e_ptr) >> 2]),
	};
};
export function cpp_parse_GPUBindingResource(ptr: number): GPUSampler | GPUTextureView | GPUBufferBinding {
	const tag = Engine.mem_u32[(ptr + 0) >> 2];
	switch(tag) {
		case 0: return Engine.externref_table.get(Engine.mem_u32[(ptr + 4) >> 2]) as GPUSampler
		case 1: return Engine.externref_table.get(Engine.mem_u32[(ptr + 4) >> 2]) as GPUTextureView
		case 2: return cpp_decode_GPUBufferBinding(ptr + 4)
		default: throw new Error("Unknown union-tag");
	};
};
export const cpp_sizeof_GPUBindGroupEntry = 24;
export function cpp_decode_GPUBindGroupEntry(ptr: number): GPUBindGroupEntry {
	return {
		binding: Engine.mem_u32[(ptr + 0) >> 2],
		resource: cpp_parse_GPUBindingResource(ptr + 4),
	};
};
export const cpp_sizeof_GPUBindGroupDescriptor = 16;
export function cpp_decode_GPUBindGroupDescriptor(ptr: number): GPUBindGroupDescriptor {
	return {
		layout: Engine.externref_table.get(Engine.mem_u32[(ptr + 0) >> 2]) as GPUBindGroupLayout,
		entries: cpp_decode_Array(ptr + 4, 24, (e_ptr) => cpp_decode_GPUBindGroupEntry(e_ptr)),
	};
};
const cpp_enum_GPUBufferBindingType = cpp_enum_define_literals<GPUBufferBindingType>(
	undefined!, "uniform", "storage", "read-only-storage"
);
export const cpp_sizeof_GPUBufferBindingLayout = 12;
export function cpp_decode_GPUBufferBindingLayout(ptr: number): GPUBufferBindingLayout {
	return {
		type: cpp_enum_GPUBufferBindingType[Engine.mem_u32[(ptr + 0) >> 2]],
		hasDynamicOffset: (Engine.mem_u8[ptr + 4] > 0),
		minBindingSize: Engine.mem_u32[(ptr + 8) >> 2],
	};
};
const cpp_enum_GPUSamplerBindingType = cpp_enum_define_literals<GPUSamplerBindingType>(
	undefined!, "filtering", "non-filtering", "comparison"
);
export const cpp_sizeof_GPUSamplerBindingLayout = 4;
export function cpp_decode_GPUSamplerBindingLayout(ptr: number): GPUSamplerBindingLayout {
	return {
		type: cpp_enum_GPUSamplerBindingType[Engine.mem_u32[(ptr + 0) >> 2]],
	};
};
const cpp_enum_GPUTextureSampleType = cpp_enum_define_literals<GPUTextureSampleType>(
	undefined!, "float", "unfilterable-float", "depth", "sint", "uint"
);
export const cpp_sizeof_GPUTextureBindingLayout = 12;
export function cpp_decode_GPUTextureBindingLayout(ptr: number): GPUTextureBindingLayout {
	return {
		sampleType: cpp_enum_GPUTextureSampleType[Engine.mem_u32[(ptr + 0) >> 2]],
		viewDimension: cpp_enum_GPUTextureViewDimension[Engine.mem_u32[(ptr + 4) >> 2]],
		multisampled: (Engine.mem_u8[ptr + 8] > 0),
	};
};
export const cpp_sizeof_GPUBindGroupLayoutEntry = 48;
export function cpp_decode_GPUBindGroupLayoutEntry(ptr: number): GPUBindGroupLayoutEntry {
	return {
		binding: Engine.mem_u32[(ptr + 0) >> 2],
		visibility: Engine.mem_u32[(ptr + 4) >> 2],
		buffer: cpp_decode_optional(ptr + 8, (e_ptr) => cpp_decode_GPUBufferBindingLayout(e_ptr)),
		sampler: cpp_decode_optional(ptr + 24, (e_ptr) => cpp_decode_GPUSamplerBindingLayout(e_ptr)),
		texture: cpp_decode_optional(ptr + 32, (e_ptr) => cpp_decode_GPUTextureBindingLayout(e_ptr)),
	};
};
export const cpp_sizeof_GPUBindGroupLayoutDescriptor = 12;
export function cpp_decode_GPUBindGroupLayoutDescriptor(ptr: number): GPUBindGroupLayoutDescriptor {
	return {
		entries: cpp_decode_Array(ptr + 0, 48, (e_ptr) => cpp_decode_GPUBindGroupLayoutEntry(e_ptr)),
	};
};
export class cpp_GPUDevice {
	static cpp_GPUDevice_destroy0(_this: number): void {
		const arg_this = Engine.externref_table.get(_this) as GPUDevice;
		arg_this.destroy();
	}
	static cpp_GPUDevice_createCommandEncoder0(_this: number, _retHandle: number): void {
		const arg_this = Engine.externref_table.get(_this) as GPUDevice;
		const ret = arg_this.createCommandEncoder();
		Engine.externref_table.set(_retHandle, ret);
	}
	static cpp_GPUDevice_createTexture1(_this: number, descriptor: number, _retHandle: number): void {
		const arg_this = Engine.externref_table.get(_this) as GPUDevice;
		const arg_descriptor = cpp_decode_GPUTextureDescriptor(descriptor);
		const ret = arg_this.createTexture(arg_descriptor);
		Engine.externref_table.set(_retHandle, ret);
	}
	static cpp_GPUDevice_createShaderModule1(_this: number, descriptor: number, _retHandle: number): void {
		const arg_this = Engine.externref_table.get(_this) as GPUDevice;
		const arg_descriptor = cpp_decode_GPUShaderModuleDescriptor(descriptor);
		const ret = arg_this.createShaderModule(arg_descriptor);
		Engine.externref_table.set(_retHandle, ret);
	}
	static cpp_GPUDevice_createPipelineLayout1(_this: number, descriptor: number, _retHandle: number): void {
		const arg_this = Engine.externref_table.get(_this) as GPUDevice;
		const arg_descriptor = cpp_decode_GPUPipelineLayoutDescriptor(descriptor);
		const ret = arg_this.createPipelineLayout(arg_descriptor);
		Engine.externref_table.set(_retHandle, ret);
	}
	static cpp_GPUDevice_createRenderPipeline1(_this: number, descriptor: number, _retHandle: number): void {
		const arg_this = Engine.externref_table.get(_this) as GPUDevice;
		const arg_descriptor = cpp_decode_GPURenderPipelineDescriptor(descriptor);
		const ret = arg_this.createRenderPipeline(arg_descriptor);
		Engine.externref_table.set(_retHandle, ret);
	}
	static cpp_GPUDevice_createBuffer1(_this: number, descriptor: number, _retHandle: number): void {
		const arg_this = Engine.externref_table.get(_this) as GPUDevice;
		const arg_descriptor = cpp_decode_GPUBufferDescriptor(descriptor);
		const ret = arg_this.createBuffer(arg_descriptor);
		Engine.externref_table.set(_retHandle, ret);
	}
	static cpp_GPUDevice_createSampler1(_this: number, descriptor: number, _retHandle: number): void {
		const arg_this = Engine.externref_table.get(_this) as GPUDevice;
		const arg_descriptor = cpp_decode_GPUSamplerDescriptor(descriptor);
		const ret = arg_this.createSampler(arg_descriptor);
		Engine.externref_table.set(_retHandle, ret);
	}
	static cpp_GPUDevice_createBindGroup1(_this: number, descriptor: number, _retHandle: number): void {
		const arg_this = Engine.externref_table.get(_this) as GPUDevice;
		const arg_descriptor = cpp_decode_GPUBindGroupDescriptor(descriptor);
		const ret = arg_this.createBindGroup(arg_descriptor);
		Engine.externref_table.set(_retHandle, ret);
	}
	static cpp_GPUDevice_createBindGroupLayout1(_this: number, descriptor: number, _retHandle: number): void {
		const arg_this = Engine.externref_table.get(_this) as GPUDevice;
		const arg_descriptor = cpp_decode_GPUBindGroupLayoutDescriptor(descriptor);
		const ret = arg_this.createBindGroupLayout(arg_descriptor);
		Engine.externref_table.set(_retHandle, ret);
	}
	static cpp_GPUDevice_queue(_this: number, _retHandle: number): void {
		const arg_this = Engine.externref_table.get(_this) as GPUDevice;
		const ret = arg_this.queue;
		Engine.externref_table.set(_retHandle, ret);
	}
};
export const cpp_sizeof_GPUCanvasConfiguration = 16;
export function cpp_decode_GPUCanvasConfiguration(ptr: number): GPUCanvasConfiguration {
	return {
		device: Engine.externref_table.get(Engine.mem_u32[(ptr + 0) >> 2]) as GPUDevice,
		format: cpp_enum_GPUTextureFormat[Engine.mem_u32[(ptr + 4) >> 2]],
		usage: Engine.mem_u32[(ptr + 8) >> 2],
		alphaMode: cpp_enum_GPUCanvasAlphaMode[Engine.mem_u32[(ptr + 12) >> 2]],
	};
};
export class cpp_GPUCanvasContext {
	static cpp_GPUCanvasContext_configure1(_this: number, configuration: number): void {
		const arg_this = Engine.externref_table.get(_this) as GPUCanvasContext;
		const arg_configuration = cpp_decode_GPUCanvasConfiguration(configuration);
		arg_this.configure(arg_configuration);
	}
	static cpp_GPUCanvasContext_getCurrentTexture0(_this: number, _retHandle: number): void {
		const arg_this = Engine.externref_table.get(_this) as GPUCanvasContext;
		const ret = arg_this.getCurrentTexture();
		Engine.externref_table.set(_retHandle, ret);
	}
};
export class cpp_GPU {
	static cpp_GPU_getPreferredCanvasFormat0(_this: number, _ret: number): void {
		const arg_this = Engine.externref_table.get(_this) as GPU;
		const ret = arg_this.getPreferredCanvasFormat();
		Engine.mem_u32[(_ret) >> 2] = cpp_enum_GPUTextureFormat.lookup.get(ret) || 0;
	}
};
export const cpp_module_api_webgpu = [
	cpp_GPUTextureView,
	cpp_GPUSampler,
	cpp_GPUCommandBuffer,
	cpp_GPUBuffer,
	cpp_GPUTexture,
	cpp_GPUBindGroup,
	cpp_GPUBindGroupLayout,
	cpp_GPUPipelineLayout,
	cpp_GPURenderPipeline,
	cpp_GPURenderPassEncoder,
	cpp_GPUCommandEncoder,
	cpp_GPUQueue,
	cpp_GPUShaderModule,
	cpp_GPUDevice,
	cpp_GPUCanvasContext,
	cpp_GPU,
];