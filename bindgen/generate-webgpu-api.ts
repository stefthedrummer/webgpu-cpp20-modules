import { BindGen } from "./bindgen";
import { FunctionDef, ParamDef, PropertyDef } from "./types/interface-type";
import { FieldDef, FieldDefFlags } from "./types/struct-type";
import { BaseFormat, t_BoolType, t_BufferSourceType, t_F32Type, t_StringType, t_U32Type, t_VoidType } from "./types/types";

export const generate_web_gpu = () => { };

const bindGen = new BindGen({
    moduleName: "api.webgpu",
    cppOut: "../engine/src-cpp/api/webgpu.cppm",
    tsOut: "../engine/src-ts/webgpu-api.ts",
    cppImports: [
        "core.wasm",
        "core.types",
        "core.allocator",
        "core.array",
        "core.buffer",
        "api.bindgen"
    ],
    tsImports: {
        "./engine": ["Engine"]
    }
});


const t_GPUTextureDimension = bindGen.defineEnumLiterals<GPUTextureDimension>(
    "GPUTextureDimension", BaseFormat.upper(), [
    "1d", "2d", "3d"
]);

const t_GPUTextureFormat = bindGen.defineEnumLiterals<GPUTextureFormat>(
    "GPUTextureFormat", BaseFormat.spell("Norm", "Int", "Float", "Stencil", "Depth").upper(),
    ["r8unorm", "r8snorm", "r8uint", "r8sint", "r16uint", "r16sint", "r16float", "rg8unorm", "rg8snorm", "rg8uint", "rg8sint", "r32uint", "r32sint", "r32float", "rg16uint", "rg16sint", "rg16float", "rgba8unorm", "rgba8unorm-srgb", "rgba8snorm", "rgba8uint", "rgba8sint", "bgra8unorm", "bgra8unorm-srgb", "rgb9e5ufloat", "rgb10a2unorm", "rg11b10ufloat", "rg32uint", "rg32sint", "rg32float", "rgba16uint", "rgba16sint", "rgba16float", "rgba32uint", "rgba32sint", "rgba32float", "stencil8", "depth16unorm", "depth24plus", "depth24plus-stencil8", "depth32float", "depth32float-stencil8", "bc1-rgba-unorm", "bc1-rgba-unorm-srgb", "bc2-rgba-unorm", "bc2-rgba-unorm-srgb", "bc3-rgba-unorm", "bc3-rgba-unorm-srgb", "bc4-r-unorm", "bc4-r-snorm", "bc5-rg-unorm", "bc5-rg-snorm", "bc6h-rgb-ufloat", "bc6h-rgb-float", "bc7-rgba-unorm", "bc7-rgba-unorm-srgb", "etc2-rgb8unorm", "etc2-rgb8unorm-srgb", "etc2-rgb8a1unorm", "etc2-rgb8a1unorm-srgb", "etc2-rgba8unorm", "etc2-rgba8unorm-srgb", "eac-r11unorm", "eac-r11snorm", "eac-rg11unorm", "eac-rg11snorm", "astc-4x4-unorm", "astc-4x4-unorm-srgb", "astc-5x4-unorm", "astc-5x4-unorm-srgb", "astc-5x5-unorm", "astc-5x5-unorm-srgb", "astc-6x5-unorm", "astc-6x5-unorm-srgb", "astc-6x6-unorm", "astc-6x6-unorm-srgb", "astc-8x5-unorm", "astc-8x5-unorm-srgb", "astc-8x6-unorm", "astc-8x6-unorm-srgb", "astc-8x8-unorm", "astc-8x8-unorm-srgb", "astc-10x5-unorm", "astc-10x5-unorm-srgb", "astc-10x6-unorm", "astc-10x6-unorm-srgb", "astc-10x8-unorm", "astc-10x8-unorm-srgb", "astc-10x10-unorm", "astc-10x10-unorm-srgb", "astc-12x10-unorm", "astc-12x10-unorm-srgb", "astc-12x12-unorm", "astc-12x12-unorm-srgb"]
);

const t_GPULoadOp = bindGen.defineEnumLiterals<GPULoadOp>("GPULoadOp", BaseFormat.cap(), [
    "load", "clear"
]);

const t_GPUStoreOp = bindGen.defineEnumLiterals<GPUStoreOp>("GPUStoreOp", BaseFormat.cap(), [
    "store", "discard"
]);

const t_GPUCanvasAlphaMode = bindGen.defineEnumLiterals<GPUCanvasAlphaMode>("GPUCanvasAlphaMode", BaseFormat.cap(), [
    "opaque", "premultiplied"
]);

const t_GPUTextureUsageFlags = bindGen.defineEnumFlags<GPUTextureUsageFlags>(
    "GPUTextureUsageFlags", BaseFormat, {
    COPY_SRC: 0x01,
    COPY_DST: 0x02,
    TEXTURE_BINDING: 0x04,
    STORAGE_BINDING: 0x08,
    RENDER_ATTACHMENT: 0x10
}
);

const t_GPUExtent3DDict = bindGen.defineStruct<GPUExtent3DDict>(
    "GPUExtent3DDict", [
    new FieldDef("width", t_U32Type),
    new FieldDef("height", t_U32Type, 1),
    new FieldDef("depthOrArrayLayers", t_U32Type, 1)
]);

const t_GPUTextureDescriptor = bindGen.defineStruct<GPUTextureDescriptor>(
    "GPUTextureDescriptor", [
    new FieldDef("size", t_GPUExtent3DDict),
    new FieldDef("mipLevelCount", t_U32Type, 1),
    new FieldDef("sampleCount", t_U32Type, 1),
    new FieldDef("dimension", t_GPUTextureDimension, "2d"),
    new FieldDef("format", t_GPUTextureFormat),
    new FieldDef("usage", t_GPUTextureUsageFlags),
    new FieldDef("viewFormats", t_GPUTextureFormat.array())
]);


const t_GPUColor = bindGen.defineStruct<GPUColorDict>("GPUColor", [
    new FieldDef("r", t_F32Type),
    new FieldDef("g", t_F32Type),
    new FieldDef("b", t_F32Type),
    new FieldDef("a", t_F32Type)
]);

const t_GPUTextureAspect = bindGen.defineEnumLiterals<GPUTextureAspect>("GPUTextureAspect", BaseFormat.cap(), ["all", "depth-only", "stencil-only"]);
const t_GPUTextureViewDimension = bindGen.defineEnumLiterals<GPUTextureViewDimension>("GPUTextureViewDimension", BaseFormat.cap(), ["1d", "2d", "2d-array", "cube", "cube-array", "3d"]);
const t_GPUTextureViewDescriptor = bindGen.defineStruct<GPUTextureViewDescriptor>("GPUTextureViewDescriptor", [
    new FieldDef("format", t_GPUTextureFormat.optional()),
    new FieldDef("dimension", t_GPUTextureViewDimension.optional()),
    new FieldDef("aspect", t_GPUTextureAspect, "all"),
    //new FieldDef("baseMipLevel", t_U32Type, 0),
    //new FieldDef("mipLevelCount", t_U32Type),
    //new FieldDef("baseArrayLayer", t_U32Type,0),
    //new FieldDef("arrayLayerCount", t_U32Type),
]);

const t_GPUTextureView = bindGen.defineInterface<GPUTextureView>("GPUTextureView", [
]);

const t_GPUSampler = bindGen.defineInterface<GPUSampler>("GPUSampler", [

]);

const t_GPUCommandBuffer = bindGen.defineInterface<GPUCommandBuffer>("GPUCommandBuffer", [
]);


const t_GPUBuffer = bindGen.defineInterface<GPUBuffer>("GPUBuffer", [
    new FunctionDef("destroy", t_VoidType, [])
    /*new FunctionDef("getMappedRange", t_GPUTextureView.handleType_local, [
        new ParamDef("offset", _.t_U32Type),
        new ParamDef("size", _.t_U32Type)
    ]),
    new FunctionDef("unmap", t_VoidType, [ ])*/
]);

const t_GPUTexture = bindGen.defineInterface<GPUTexture>("GPUTexture", [
    new FunctionDef("destroy", t_VoidType, []),
    new FunctionDef("createView", t_GPUTextureView.handleType_local, []),
    new FunctionDef("createView", t_GPUTextureView.handleType_local, [
        new ParamDef("descriptor", t_GPUTextureViewDescriptor.pointer())
    ])
]);



const t_GPURenderPassColorAttachment = bindGen.defineStruct<GPURenderPassColorAttachment>(
    "GPURenderPassColorAttachment", [
    new FieldDef("view", t_GPUTextureView.handleType_any),
    new FieldDef("clearValue", t_GPUColor),
    new FieldDef("loadOp", t_GPULoadOp),
    new FieldDef("storeOp", t_GPUStoreOp),
]);


const t_GPURenderPassDescriptor = bindGen.defineStruct<GPURenderPassDescriptor>(
    "GPURenderPassDescriptor", [
    new FieldDef("colorAttachments", t_GPURenderPassColorAttachment.array()),
]);

const t_GPUBindGroup = bindGen.defineInterface<GPUBindGroup>("GPUBindGroup", [

]);
const t_GPUBindGroupLayout = bindGen.defineInterface<GPUBindGroupLayout>("GPUBindGroupLayout", []);

const t_GPUPipelineLayout = bindGen.defineInterface<GPUPipelineLayout>("GPUPipelineLayout", [
]);
const t_GPURenderPipeline = bindGen.defineInterface<GPURenderPipeline>("GPURenderPipeline", [
    new FunctionDef("getBindGroupLayout", t_GPUBindGroupLayout.handleType_local, [
        new ParamDef("index", t_U32Type)
    ])
]);

const t_GPURenderPassEncoder = bindGen.defineInterface<GPURenderPassEncoder>("GPURenderPassEncoder", [
    new FunctionDef("end", t_VoidType, []),
    new FunctionDef("setPipeline", t_VoidType, [
        new ParamDef("pipeline", t_GPURenderPipeline.handleType_any)
    ]),
    new FunctionDef("setBindGroup", t_VoidType, [
        new ParamDef("index", t_U32Type),
        new ParamDef("bindGroup", t_GPUBindGroup.handleType_any),
        null!, null!, null!
        //new ParamDef("dynamicOffsets", _.t_U32Type.array().pointer() )
    ]),
    new FunctionDef("setVertexBuffer", t_VoidType, [
        new ParamDef("slot", t_U32Type),
        new ParamDef("buffer", t_GPUBuffer.handleType_any),
        new ParamDef("offset", t_U32Type),
        new ParamDef("size", t_U32Type)
    ]
    ),
    new FunctionDef("draw", t_VoidType, [
        new ParamDef("vertexCount", t_U32Type),
        new ParamDef("instanceCount", t_U32Type, 1),
        new ParamDef("firstVertex", t_U32Type, 0),
        new ParamDef("firstInstance", t_U32Type, 0)
    ])
]);


const t_GPUCommandEncoder = bindGen.defineInterface<GPUCommandEncoder>("GPUCommandEncoder", [
    new FunctionDef("beginRenderPass", t_GPURenderPassEncoder.handleType_local, [
        new ParamDef("descriptor", t_GPURenderPassDescriptor.pointer())
    ]),
    new FunctionDef("finish", t_GPUCommandBuffer.handleType_local, [])
]);

const t_GPUOrigin3DDict = bindGen.defineStruct<GPUOrigin3DDict>("GPUOrigin3DDict", [
    new FieldDef("x", t_U32Type, 0),
    new FieldDef("y", t_U32Type, 0),
    new FieldDef("z", t_U32Type, 0),
]);


const t_GPUImageCopyTexture = bindGen.defineStruct<GPUImageCopyTexture>("GPUImageCopyTexture", [
    new FieldDef("texture", t_GPUTexture.handleType_any),
    new FieldDef("mipLevel", t_U32Type, 0),
    new FieldDef("origin", t_GPUOrigin3DDict),
    new FieldDef("aspect", t_GPUTextureAspect, "all"),
]);

const t_GPUImageDataLayout = bindGen.defineStruct<GPUImageDataLayout>("GPUImageDataLayout", [
    new FieldDef("offset", t_U32Type, 0),
    new FieldDef("bytesPerRow", t_U32Type),
    new FieldDef("rowsPerImage", t_U32Type),
]);

const t_GPUQueue = bindGen.defineInterface<GPUQueue>("GPUQueue", [
    new FunctionDef("submit", t_VoidType, [
        new ParamDef("commandBuffers", t_GPUCommandBuffer.handleType_any.array().pointer()),
    ]),
    new FunctionDef("writeBuffer", t_VoidType, [
        new ParamDef("buffer", t_GPUBuffer.handleType_any),
        new ParamDef("bufferOffset", t_U32Type),
        new ParamDef("data", t_BufferSourceType.pointer()),
        new ParamDef("dataOffset", t_U32Type),
        new ParamDef("size", t_U32Type),
    ], /*ParamStruct*/[
        new ParamDef("buffer", t_GPUBuffer.handleType_any),
        new ParamDef("bufferOffset", t_U32Type),
        new ParamDef("data", t_BufferSourceType),
        new ParamDef("dataOffset", t_U32Type),
        new ParamDef("size", t_U32Type),
    ]),
    new FunctionDef("writeTexture", t_VoidType, [
        new ParamDef("destination", t_GPUImageCopyTexture.pointer()),
        new ParamDef("data", t_BufferSourceType.pointer()),
        new ParamDef("dataLayout", t_GPUImageDataLayout.pointer()),
        new ParamDef("size", t_GPUExtent3DDict.pointer()),
    ], /*ParamStruct*/[
        new ParamDef("destination", t_GPUImageCopyTexture),
        new ParamDef("data", t_BufferSourceType),
        new ParamDef("dataLayout", t_GPUImageDataLayout),
        new ParamDef("size", t_GPUExtent3DDict),
    ])
]);


const t_GPUShaderModule = bindGen.defineInterface<GPUShaderModule>("GPUShaderModule", [

]);


const t_GPUVertexStepMode = bindGen.defineEnumLiterals<GPUVertexStepMode>("GPUVertexStepMode", BaseFormat.cap(), ["vertex", "instance"]);
const t_GPUVertexFormat = bindGen.defineEnumLiterals<GPUVertexFormat>("GPUVertexFormat", BaseFormat.cap(), ["uint8x2", "uint8x4", "sint8x2", "sint8x4", "unorm8x2", "unorm8x4", "snorm8x2", "snorm8x4", "uint16x2", "uint16x4", "sint16x2", "sint16x4", "unorm16x2", "unorm16x4", "snorm16x2", "snorm16x4", "float16x2", "float16x4", "float32", "float32x2", "float32x3", "float32x4", "uint32", "uint32x2", "uint32x3", "uint32x4", "sint32", "sint32x2", "sint32x3", "sint32x4"]);
const t_GPUPrimitiveTopology = bindGen.defineEnumLiterals<GPUPrimitiveTopology>("GPUPrimitiveTopology", BaseFormat.cap(), ["point-list", "line-list", "line-strip", "triangle-list", "triangle-strip"]);
const t_GPUIndexFormat = bindGen.defineEnumLiterals<GPUIndexFormat>("GPUIndexFormat", BaseFormat.cap(), ["uint16", "uint32"]);
const t_GPUFrontFace = bindGen.defineEnumLiterals<GPUFrontFace>("GPUFrontFace", BaseFormat.cap(), ["ccw", "cw"]);
const t_GPUCullMode = bindGen.defineEnumLiterals<GPUCullMode>("GPUCullMode", BaseFormat.cap(), ["none", "front", "back"]);
const t_GPUCompareFunction = bindGen.defineEnumLiterals<GPUCompareFunction>("GPUCompareFunction", BaseFormat.cap(), ["never", "less", "equal", "less-equal", "greater", "not-equal", "greater-equal", "always"]);
const t_GPUBlendOperation = bindGen.defineEnumLiterals<GPUBlendOperation>("GPUBlendOperation", BaseFormat.cap(), ["add", "subtract", "reverse-subtract", "min", "max"]);
const t_GPUBlendFactor = bindGen.defineEnumLiterals<GPUBlendFactor>("GPUBlendFactor", BaseFormat.cap(), ["zero", "one", "src", "one-minus-src", "src-alpha", "one-minus-src-alpha", "dst", "one-minus-dst", "dst-alpha", "one-minus-dst-alpha", "src-alpha-saturated", "constant", "one-minus-constant"]);
const t_GPUColorWriteFlags = bindGen.defineEnumFlags<GPUColorWriteFlags>("GPUColorWrite", BaseFormat, {
    RED: 0x1,
    GREEN: 0x2,
    BLUE: 0x4,
    ALPHA: 0x8,
    ALL: 0xF
});
const t_GPUBufferUsageFlags = bindGen.defineEnumFlags<GPUBufferUsageFlags>("GPUBufferUsageFlags", BaseFormat, {
    MAP_READ: 0x0001,
    MAP_WRITE: 0x0002,
    COPY_SRC: 0x0004,
    COPY_DST: 0x0008,
    INDEX: 0x0010,
    VERTEX: 0x0020,
    UNIFORM: 0x0040,
    STORAGE: 0x0080,
    INDIRECT: 0x0100,
    QUERY_RESOLVE: 0x0200
})
const t_GPUAutoLayoutMode = bindGen.defineEnumLiterals<GPUAutoLayoutMode>("GPUAutoLayoutMode", BaseFormat.cap(), ["auto"]);

const t_GPUBlendComponent = bindGen.defineStruct<GPUBlendComponent>("GPUBlendComponent", [
    new FieldDef("operation", t_GPUBlendOperation),
    new FieldDef("srcFactor", t_GPUBlendFactor),
    new FieldDef("dstFactor", t_GPUBlendFactor),
]);
const t_GPUBlendState = bindGen.defineStruct<GPUBlendState>("GPUBlendState", [
    new FieldDef("color", t_GPUBlendComponent),
    new FieldDef("alpha", t_GPUBlendComponent,)
]);

const t_GPUColorTargetState = bindGen.defineStruct<GPUColorTargetState>("GPUColorTargetState", [
    new FieldDef("format", t_GPUTextureFormat),
    new FieldDef("blend", t_GPUBlendState.optional()),
    new FieldDef("writeMask", t_GPUColorWriteFlags.markAsOptional(), 0xF),
]);

const t_GPUVertexAttribute = bindGen.defineStruct<GPUVertexAttribute>("GPUVertexAttribute", [
    new FieldDef("format", t_GPUVertexFormat),
    new FieldDef("offset", t_U32Type),
    new FieldDef("shaderLocation", t_U32Type)
]);

const t_GPUVertexBufferLayout = bindGen.defineStruct<GPUVertexBufferLayout>("GPUVertexBufferLayout", [
    new FieldDef("arrayStride", t_U32Type),
    new FieldDef("stepMode", t_GPUVertexStepMode.markAsOptional(), "vertex"),
    new FieldDef("attributes", t_GPUVertexAttribute.array())
]);

const t_GPUProgrammableStage = bindGen.defineStruct<GPUProgrammableStage>("GPUProgrammableStage", [
    new FieldDef("module", t_GPUShaderModule.handleType_any),
    new FieldDef("entryPoint", t_StringType.pointer()),
    new FieldDef("constants", t_U32Type.record().optional()),
]);
const t_GPUVertexState = bindGen.defineStruct<GPUVertexState>("GPUVertexState", [
    ...t_GPUProgrammableStage.extend<GPUVertexState>(),
    new FieldDef("buffers", t_GPUVertexBufferLayout.array())
]);
const t_GPUFragmentState = bindGen.defineStruct<GPUFragmentState>("GPUFragmentState", [
    ...t_GPUProgrammableStage.extend<GPUFragmentState>(),
    new FieldDef("targets", t_GPUColorTargetState.array())
]);
const t_GPUDepthStencilState = bindGen.defineStruct<GPUDepthStencilState>("GPUDepthStencilState", [
    new FieldDef("format", t_GPUTextureFormat),
    new FieldDef("depthWriteEnabled", t_BoolType.markAsOptional(), false),
    new FieldDef("depthCompare", t_GPUCompareFunction.markAsOptional(), "always"),
    //new FieldDef("stencilFront"),
    //new FieldDef("stencilBack"),
    //new FieldDef("stencilReadMask"),
    //new FieldDef("stencilWriteMask"),
    //new FieldDef("depthBias"),
    //new FieldDef("depthBiasSlopeScale"),
    //new FieldDef("depthBiasClamp")  
]);



const t_GPUPrimitiveState = bindGen.defineStruct<GPUPrimitiveState>("GPUPrimitiveState", [
    new FieldDef("topology", t_GPUPrimitiveTopology.markAsOptional(), "triangle-list"),
    new FieldDef("stripIndexFormat", t_GPUIndexFormat.markAsOptional()),
    new FieldDef("frontFace", t_GPUFrontFace.markAsOptional(), "ccw"),
    new FieldDef("cullMode", t_GPUCullMode.markAsOptional(), "none"),
    new FieldDef("unclippedDepth", t_BoolType.markAsOptional(), false),
]);

const t_GPUPipelineDescriptorBase = bindGen.defineStruct<GPUPipelineDescriptorBase>("GPUPipelineDescriptorBase", [
    new FieldDef("layout", bindGen.defineUnion<GPUPipelineLayout | GPUAutoLayoutMode>("GPULayoutMode", [t_GPUAutoLayoutMode, t_GPUPipelineLayout.handleType_any])),
]);

const t_GPUPipelineLayoutDescriptor = bindGen.defineStruct<GPUPipelineLayoutDescriptor>("GPUPipelineLayoutDescriptor", [
    new FieldDef("bindGroupLayouts", t_GPUBindGroupLayout.handleType_any.array()),
]);
const t_GPURenderPipelineDescriptor = bindGen.defineStruct<GPURenderPipelineDescriptor>("GPURenderPipelineDescriptor", [
    ...t_GPUPipelineDescriptorBase.extend<GPURenderPipelineDescriptor>(),
    new FieldDef("vertex", t_GPUVertexState),
    new FieldDef("primitive", t_GPUPrimitiveState.optional()),
    new FieldDef("depthStencil", t_GPUDepthStencilState.optional()),
    //new FieldDef("multisample"),
    new FieldDef("fragment", t_GPUFragmentState.optional()),
]);




const t_GPUShaderModuleDescriptor = bindGen.defineStruct<GPUShaderModuleDescriptor>("GPUShaderModuleDescriptor", [
    new FieldDef("code", t_StringType.pointer()),
]);

const t_GPUBufferDescriptor = bindGen.defineStruct<GPUBufferDescriptor>("GPUBufferDescriptor", [
    new FieldDef("size", t_U32Type),
    new FieldDef("usage", t_GPUBufferUsageFlags),
]);




const t_GPUAddressMode = bindGen.defineEnumLiterals<GPUAddressMode>("GPUAddressMode", BaseFormat.cap(), [
    "clamp-to-edge", "repeat", "mirror-repeat"
]);
const t_GPUFilterMode = bindGen.defineEnumLiterals<GPUFilterMode>("GPUFilterMode", BaseFormat.cap(), [
    "nearest", "linear"
]);
const t_GPUMipmapFilterMode = t_GPUFilterMode;

const t_GPUSamplerDescriptor = bindGen.defineStruct<GPUSamplerDescriptor>("GPUSamplerDescriptor", [
    new FieldDef("addressModeU", t_GPUAddressMode, "clamp-to-edge"),
    new FieldDef("addressModeV", t_GPUAddressMode, "clamp-to-edge"),
    new FieldDef("addressModeW", t_GPUAddressMode, "clamp-to-edge"),
    new FieldDef("magFilter", t_GPUFilterMode, "nearest"),
    new FieldDef("minFilter", t_GPUFilterMode, "nearest"),
    new FieldDef("mipmapFilter", t_GPUMipmapFilterMode, "nearest"),
    new FieldDef("lodMinClamp", t_U32Type, 0),
    new FieldDef("lodMaxClamp", t_U32Type, 32),
    //new FieldDef("compare", t_GPUCompareFunction, null),
    new FieldDef("maxAnisotropy", t_U32Type, 1)
]);

const t_GPUBufferBinding = bindGen.defineStruct<GPUBufferBinding>("GPUBufferBinding", [
    new FieldDef("buffer", t_GPUBuffer.handleType_any),
    new FieldDef("offset", t_U32Type, 0),
    new FieldDef("size", t_U32Type.optional()),
]);

const t_GPUBindingResource = bindGen.defineUnion<GPUBindingResource>("GPUBindingResource", [
    t_GPUSampler.handleType_any,
    t_GPUTextureView.handleType_any,
    t_GPUBufferBinding
]);

const t_GPUBindGroupEntry = bindGen.defineStruct<GPUBindGroupEntry>("GPUBindGroupEntry", [
    new FieldDef("binding", t_U32Type),
    new FieldDef("resource", t_GPUBindingResource),
]);
const t_GPUBindGroupDescriptor = bindGen.defineStruct<GPUBindGroupDescriptor>("GPUBindGroupDescriptor", [
    new FieldDef("layout", t_GPUBindGroupLayout.handleType_any),
    new FieldDef("entries", t_GPUBindGroupEntry.array()),
]);

const t_GPUShaderStageFlags = bindGen.defineEnumFlags<GPUShaderStageFlags>("GPUShaderStageFlags", BaseFormat, {
    VERTEX: 0x1,
    FRAGMENT: 0x2,
    COMPUTE: 0x4
});

const t_GPUBufferBindingType = bindGen.defineEnumLiterals<GPUBufferBindingType>("GPUBufferBindingType", BaseFormat.cap(), ["uniform", "storage", "read-only-storage"]);
const t_GPUBufferBindingLayout = bindGen.defineStruct<GPUBufferBindingLayout>("GPUBufferBindingLayout", [
    new FieldDef("type", t_GPUBufferBindingType, "uniform"),
    new FieldDef("hasDynamicOffset", t_BoolType, false),
    new FieldDef("minBindingSize", t_U32Type, 0),
]);

const t_GPUSamplerBindingType = bindGen.defineEnumLiterals<GPUSamplerBindingType>("GPUSamplerBindingType", BaseFormat.cap(), ["filtering", "non-filtering", "comparison"]);
const t_GPUSamplerBindingLayout = bindGen.defineStruct<GPUSamplerBindingLayout>("GPUSamplerBindingLayout", [
    new FieldDef("type", t_GPUSamplerBindingType, "filtering"),
]);

const t_GPUTextureSampleType = bindGen.defineEnumLiterals<GPUTextureSampleType>("GPUTextureSampleType", BaseFormat.cap(), ["float", "unfilterable-float", "depth", "sint", "uint"]);
const t_GPUTextureBindingLayout = bindGen.defineStruct<GPUTextureBindingLayout>("GPUTextureBindingLayout", [
    new FieldDef("sampleType", t_GPUTextureSampleType, "float"),
    new FieldDef("viewDimension", t_GPUTextureViewDimension, "2d"),
    new FieldDef("multisampled", t_BoolType, false)
]);

const t_GPUBindGroupLayoutEntry = bindGen.defineStruct<GPUBindGroupLayoutEntry>("GPUBindGroupLayoutEntry", [
    new FieldDef("binding", t_U32Type),
    new FieldDef("visibility", t_GPUShaderStageFlags),
    new FieldDef("buffer", t_GPUBufferBindingLayout.optional()),
    new FieldDef("sampler", t_GPUSamplerBindingLayout.optional()),
    new FieldDef("texture", t_GPUTextureBindingLayout.optional()),
    //new FieldDef("storageTexture", ),
    //new FieldDef("externalTexture", ),
]);
const t_GPUBindGroupLayoutDescriptor = bindGen.defineStruct<GPUBindGroupLayoutDescriptor>("GPUBindGroupLayoutDescriptor", [
    new FieldDef("entries", t_GPUBindGroupLayoutEntry.array())
]);

const t_GPUDevice = bindGen.defineInterface<GPUDevice>("GPUDevice", [
    new FunctionDef("destroy", t_VoidType, []),
    new FunctionDef("createCommandEncoder",
        t_GPUCommandEncoder.handleType_local, [
    ]),
    new FunctionDef("createTexture",
        t_GPUTexture.handleType_local, [
        new ParamDef("descriptor", t_GPUTextureDescriptor.pointer())
    ]),
    new FunctionDef("createShaderModule",
        t_GPUShaderModule.handleType_local, [
        new ParamDef("descriptor", t_GPUShaderModuleDescriptor.pointer())
    ]),
    new FunctionDef("createPipelineLayout",
        t_GPUPipelineLayout.handleType_local, [
        new ParamDef("descriptor", t_GPUPipelineLayoutDescriptor.pointer())
    ]),
    new FunctionDef("createRenderPipeline",
        t_GPURenderPipeline.handleType_local, [
        new ParamDef("descriptor", t_GPURenderPipelineDescriptor.pointer())
    ]),
    new FunctionDef("createBuffer",
        t_GPUBuffer.handleType_local, [
        new ParamDef("descriptor", t_GPUBufferDescriptor.pointer())
    ]),
    new FunctionDef("createSampler",
        t_GPUSampler.handleType_local, [
        new ParamDef("descriptor", t_GPUSamplerDescriptor.pointer())
    ]),
    new FunctionDef("createBindGroup",
        t_GPUBindGroup.handleType_local, [
        new ParamDef("descriptor", t_GPUBindGroupDescriptor.pointer())
    ]),
    new FunctionDef("createBindGroupLayout",
        t_GPUBindGroupLayout.handleType_local, [
        new ParamDef("descriptor", t_GPUBindGroupLayoutDescriptor.pointer())
    ]),
    new PropertyDef("queue", t_GPUQueue.handleType_local),
]);

const t_GPUCanvasConfiguration = bindGen.defineStruct<GPUCanvasConfiguration>(
    "GPUCanvasConfiguration", [
    new FieldDef("device", t_GPUDevice.handleType_any),
    new FieldDef("format", t_GPUTextureFormat),
    new FieldDef("usage", t_GPUTextureUsageFlags, 0x10),
    new FieldDef("alphaMode", t_GPUCanvasAlphaMode, "opaque")
    /*Deprecated new FieldDef("compositingAlphaMode", t_GPUCanvasAlphaMode, "opaque", FieldDefFlags.Deprecated)*/
]);

const t_GPUCanvasContext = bindGen.defineInterface<GPUCanvasContext>("GPUCanvasContext", [
    new FunctionDef("configure", t_VoidType, [
        new ParamDef("configuration", t_GPUCanvasConfiguration.pointer())
    ]),
    new FunctionDef("getCurrentTexture", t_GPUTexture.handleType_local, [])
]);


bindGen.generate();