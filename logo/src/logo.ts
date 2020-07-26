import { Engine, Render, Bodies, World } from "matter-js";

const engine = Engine.create();

const render = Render.create({
  element: document.body,
  engine: engine
});

const box = Bodies.rectangle(100, 100, 80, 80);
const ground = Bodies.rectangle(400, 600, 800, 60, { isStatic: true });

World.add(engine.world, [box, ground]);

Engine.run(engine);
Render.run(render);

console.log(document);
console.log(document.body)
console.log(window);