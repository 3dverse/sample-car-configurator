# Car Configurator

![Car Configurator Screenshot](https://github.com/3dverse/sample-car-configurator/blob/main/screenshot.png?raw=true)

## Try it out

[Try it out](https://nw5jvw.csb.app/)

## Description

A basic web app built using 3dverse, featuring HTML UI elements synchronized with the state of the 3dverse scene, via the 3dverse Livelink SDK. The Car Configurator features include:

- Switch between different car models
- Adjust paint material and color
- Swap environments
- Trigger a rotation animation
- Toggle head and rear lights
- Toggle the presence of an RGB animated accent on the car platform
- Adjust scene brightness (per-client setting, not propagated between clients)

# How does it work?

Every client that runs this application will either start a new session of the scene named 'Showroom', or join an ongoing session if there is one running already. Each connected client will appear as a floating avatar in the scene, to indicate their viewing position. Any changes made to the scene will be instantly updated for other clients, in the 3d render and in the corresponding UI.

## Assets inside

The project includes a lot of assets inside the `Public/` directory. We won't go over all of them, but the most important are:

- Showroom - `scene` containing the platform, environment and references to embedded scenes for each car
- Dodge Viper - nested `scene` used to display the Dodge Viper car selection
- Mercedes AMG GT - nested `scene` used to display the Mercedes AMG GT car selection
- SM_Viper_Body - the `mesh` referenced inside the Dodge Viper scene
- SM_Mercedes_AMG_GT - the `mesh` referenced inside the Mercedes AMG GT scene
- SM_Cylinder - the `mesh` used to render the platform as well as the RGB animated accent that can be switched on and off. We toggle its presence by adding or removing the mesh reference in our Showroom scene.
- MAT_Viper_Default_Paint,MAT_Mercedes_ClearCoat_Paint - `materials` for the paint on each of the two cars
- MAT_Paint_Metallic, MAT_Paint_Solid, MAT_Paint_Matte - thre three different car paint `materials` that can be selected in the UI. These materials are used as templates. The selected `asset description` is copied to the specific paint material attached to each car, and then modified with the selected color.
- MAT_Headlights_Emissive, MAT_Light_Reflector_Red - the `materials` for the head and rear lights on the Dodge Viper. The `emissionIntensity` is modified on these materials to switch the lights on and off.
- MAT_Head_Lights, MAT_Tail_Lights - the `materials` for the head and rear lights on the Mercedes AMG GT
- Rotor - `animation-sequence` used to rotate the car in the scene

## Run it locally

Open the codesandbox link generated for your application, and replace the content of `template.3dverse.js` with the file you find at that link.

The application is a static frontend that can be served by any web server of your convenience.

### Node

You can use the [serve](https://www.npmjs.com/package/serve) package:

```
npx serve
```

### Python

You can use the [http.server](https://docs.python.org/3/library/http.server.html) command:

```
python -m http.server
```

Now open your web browser at the url indicated by your server (http://localhost:XXXX) to run your application.

## What's next

### View and edit with Scene Editor

While your application is running, navigate to "Sessions" in the 3dverse Console and join the ongoing session of your application.

You have now joined the application's session in the Scene Editor, where you can view and live edit your application.

### Adding a car model

One way you can customize this application is by adding a new car model.

The first step is to find a car model - you can find cars on sites like Sketchfab. [Here are some results for 3d car models](https://sketchfab.com/search?features=downloadable&q=sports+car&type=models).

Once you've downloaded your model, the next step is to visit the Asset Browser in the 3dverse Console and upload your model.

When you've finished uploading, you need to add some extra configuration to your application.

Open [config.js](https://github.com/3dverse/sample-car-configurator/blob/main/js/config.js), which has an array of `cars` configuration near the bottom. You can find it by search for "Mercedes AMG GT".

Copy the Mercedes AMG GT configuration and paste it below, and start replacing each of the values:

- `sceneUUID`: You can find this by visiting the asset browser and looking for a `scene` with the name of the model you just uploaded. Click once on the asset and the asset browser will display some information in the right panel. **Copy its UUID.** Once you have that, double click the scene to open up the scene editor, which you'll need to find the rest of the needed information.
- `paintMaterialUUID`: Once you're inside the scene editor, you should see the car model you uploaded. Click on the painted body of the car to focus on one of the car body entities. You should see a panel called "Components" to the right, scroll down until you see a subsection with a red title called "Material Reference". Click the copy symbol to copy the entire json for the material reference component. You don't need most of this, so just paste it somewhere and get the "value" that looks something like 78ea2c9f-351f-4f36-a487-b6feea6957e2. Then re-copy that.
- `headLightsMatUUID`: Getting this is a similar procedure to getting the paint material UUID, but sometimes the headlights on the car are covered by some transparent glass. To get the UUID of the actual light, you will want to first select the headlight glass, turn it transparent by clicking the eye symbol next to the selected entity in the scene graph tree, then clicking again on the headlight. Now you can follow the procedure for the paint material.
- `rearLightsMatUUID`: Similar procedure as for the headlights.

Once you've added your new car config with the appropriate information, your app should have a new car with toggleable lights and with adjustable paint material and color!
