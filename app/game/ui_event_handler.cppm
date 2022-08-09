
export module game.ui_event_handler;
import api;
import core;
import rendering;

export struct UIEventHandler {

    Renderer* pRenderer;
    UIEventHandler( Renderer* pRenderer ) : pRenderer{pRenderer} {}
    vec2<f32> camPosAtMouseDown{};
    vec2<f32> mousePosAtMouseDown{};
    vec2<i32> hoveredCell{};
    bool isPanCamera{};

    void PollUIEvents() {
            Scope scope{ 0 };

        Array<UIEvent, Scope> uiEvents{ 8, &scope };
        u32 numEvents = UIEvents::PollUIEvents(&uiEvents);

        for(u32 i = 0; i < numEvents; i++) {
            UIEvent& e = uiEvents[i];

            switch(e.type) {
                case UIEventType::CanvasResize: {
                    pRenderer->camera.size = { (f32)e.x, (f32)e.y };
                    break;
                }

                case UIEventType::MouseMove:
                case UIEventType::MouseUp:
                case UIEventType::MouseDown: {
                    vec2<f32> mousePos = pRenderer->camera.Viewport2CamSpace({(f32)e.x, (f32)e.y});

                    this->hoveredCell = (vec2<i32>)(floor(mousePos + pRenderer->camera.pos));

                    switch(e.type) {
                        case UIEventType::MouseMove: {
                            if(this->isPanCamera) {
                                pRenderer->camera.pos = this->camPosAtMouseDown - mousePos + this->mousePosAtMouseDown;
                            }
                            break;
                        }
                        case UIEventType::MouseUp: {
                            if(e.button == 1) {
                                this->isPanCamera = false;
                            }
                            break;
                        }
                        case UIEventType::MouseDown: {
                            if(e.button == 1) {
                                this->camPosAtMouseDown = pRenderer->camera.pos;
                                this->mousePosAtMouseDown = mousePos;
                                this->isPanCamera = true;
                            }
                            break;
                        }
                        default: break;
                    }
                    break;
                }

                case UIEventType::MouseWheel: {
                    pRenderer->camera.zoom *= (1.0f + e.y*0.0005f);
                    break;
                }
            }
        }
    }
};