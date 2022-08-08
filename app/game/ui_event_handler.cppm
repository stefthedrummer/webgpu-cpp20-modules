
export module game.ui_event_handler;
import api;
import core;
import rendering;

export struct UIEventHandler {

    Renderer* pRenderer;
    UIEventHandler( Renderer* pRenderer ) : pRenderer{pRenderer} {}

    void PollUIEvents() {
            Scope scope{ 0 };

        Array<UIEvent, Scope> uiEvents{ 8, &scope };
        u32 numEvents = UIEvents::PollUIEvents(&uiEvents);

        for(u32 i = 0; i < numEvents; i++) {
            UIEvent& e = uiEvents[i];

            switch(e.type) {
                case UIEventType::CanvasResize: {
                    pRenderer->camera.UpdateSize({ (f32)e.x, (f32)e.y });
                    break;
                }
            }
        }
    }

};