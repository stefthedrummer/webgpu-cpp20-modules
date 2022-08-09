
export module game.game;
export import api;
export import core;
export import rendering;

import game.ui_event_handler; 

export struct Game {
    PersistentHandle<IGPUDevice> hDevice{};
    PersistentHandle<IGPUCanvasContext> hCanvasContext{};

    ResourceManager resourceManager{};
    Renderer renderer{};
    UIEventHandler uiEventHandler{&renderer};
};