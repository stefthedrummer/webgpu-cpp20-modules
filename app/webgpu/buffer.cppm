
export module webgpu.buffer;
import api;
import core;

export inline constexpr GPUBufferUsageFlags VertexBuffer = GPUBufferUsageFlags::VERTEX | GPUBufferUsageFlags::COPY_DST;
export inline constexpr GPUBufferUsageFlags InstanceBuffer = GPUBufferUsageFlags::VERTEX | GPUBufferUsageFlags::COPY_DST;
export inline constexpr GPUBufferUsageFlags UniformBuffer = GPUBufferUsageFlags::UNIFORM | GPUBufferUsageFlags::COPY_DST;

export template<typename T>
struct GPUBuffer {
    PersistentHandle<IGPUBuffer> _hBuffer;
    u32 length;

    constexpr operator GPUBuffer<u8>() {
        return {
            _hBuffer = this->_hBuffer,
            length = this->length * sizeof(T)
        };
    }
};