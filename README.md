# car-configurator
A sample app built with 3dverse, which manipulates a scene via the 3dverse Livelink SDK.

## Other tools used

- HTML
- CSS
- Vanilla JavaScript
- Handlebars templates for data-driven views

Aside from Handlebars, this sample does not rely on any particular third-party UI framework (e.g. React, Vue, Svelte, Angular, etc).

Your own apps can integrate any UI framework you're comfortable with.

## App design principles

Basic app flow:

[Car Configurator Flowchart](./car-config-flowchart.png)

(This chart was created with flowchart.fun)

Many clients can simultaneously change car details, in the same 3dverse Livelink session.

Since 3dverse is our app's backend, the 3dverse scene graph is the source of truth.

When the app first loads in the browser, the UI synchronizes with the 3dverse scene graph, and this synchronization also occurs whenever 3dverse notifies the client that another client affects a scene change. These changes can include car selection, paint material attributes, paint color, RGB platform, rotation toggle, car lights toggle, and the environment.

### another way of doing it

If your app has its own server, you can choose to have your app state dictated by your server. You'll then manipulate the 3dverse scene as a function of this external state.

## api usage details

TBA: details on APIs used to accomplish different tasks
