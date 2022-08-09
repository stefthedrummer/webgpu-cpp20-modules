
export module rendering.camera;
import core.types;
import core.math;

export struct Camera {
    vec2<f32> size;
    f32 aspectRatio;
    f32 zoom = 5.0f;
    vec2<f32> pos;
    vec2<f32> world2vp{1.0f, 1.0f};

    void Update() {
        this->aspectRatio = size.x / size.y;
        this->world2vp = { 1.0f / (zoom * aspectRatio), 1.0f / (zoom) };
    }

    vec2<f32> Viewport2CamSpace(vec2<f32> p) {

        f32 normX = ((p.x / this->size.x * 2) - 1) * this->aspectRatio * this->zoom;
        f32 normY = (((this->size.y - p.y) / this->size.y * 2) - 1) * this->zoom;

        f32 u = 0.5 * (normY * 2 + normX);
        f32 v = 0.5 * (normY * 2 - normX);

        return vec2<f32>{u, v};
    }
};