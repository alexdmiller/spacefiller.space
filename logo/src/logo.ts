import decomp from "poly-decomp";
import {
  Engine,
  Render,
  Bodies,
  World,
  Svg,
  Vertices,
  Mouse,
  MouseConstraint,
  Constraint,
  Events,
  Vector,
  Body,
} from "matter-js";
import logoPath from "./logo-physics.svg";
import "pathseg";

window.decomp = decomp;

const engine = Engine.create();
const world = engine.world;

const render = Render.create({
  element: document.body,
  engine: engine,
  options: {
    width: window.innerWidth,
    height: window.innerHeight,
  },
});

engine.world.gravity = { x: 0, y: 0, scale: 0 };

const mouse = Mouse.create(render.canvas);
const mouseConstraint = MouseConstraint.create(engine, {
  mouse: mouse,
  constraint: {
    stiffness: 0.2,
    render: {
      visible: false,
    },
  },
});

World.add(world, mouseConstraint);

Engine.run(engine);
Render.run(render);

getLogo();

async function getLogo() {
  const logoResponse = await fetch(logoPath);
  const logoSource = await logoResponse.text();

  const parser = new DOMParser();
  const doc = parser.parseFromString(logoSource, "image/svg+xml");
  const letters = doc.getElementsByTagName("g")[0].children;

  for (let i = 0; i < letters.length; i++) {
    const letter = letters[i];
    const sections = letter.getElementsByTagName("path");
    const sectionBodies = [];
    for (let j = 0; j < sections.length; j++) {
      const len = sections[j].getTotalLength();
      let points = [];
      for (let t = 0; t < len; t += 5) {
        const p = sections[j].getPointAtLength(t);
        points.push(p);
      }

      let center = { x: 0, y: 0 };
      points.forEach((p) => {
        center.x += p.x;
        center.y += p.y;
      });
      center.x /= points.length;
      center.y /= points.length;
      sectionBodies.push(
        Bodies.fromVertices(
          center.x,
          center.y,
          [points],
          {
            render: {
              fillStyle: "#556270",
              strokeStyle: "#556270",
              lineWidth: 2,
            },
            isStatic: false,
            collisionFilter: { group: -1 * (i + 1) },
            frictionAir: 0.1,
          },
          true
        )
      );
    }

    World.add(engine.world, sectionBodies);

    const stiffness = 0.2;

    switch (letter.classList[0]) {
      case "S":
        World.add(engine.world, [
          Constraint.create({
            bodyA: sectionBodies[0],
            pointA: { x: -15, y: 10 },
            bodyB: sectionBodies[2],
            pointB: { x: -15, y: -15 },
            stiffness,
            length: 0,
          }),
          Constraint.create({
            bodyA: sectionBodies[2],
            pointA: { x: 15, y: 15 },
            bodyB: sectionBodies[1],
            pointB: { x: 15, y: -10 },
            stiffness,
            length: 0,
          }),
        ]);
        break;
      case "P":
        World.add(engine.world, [
          Constraint.create({
            bodyA: sectionBodies[0],
            pointA: { x: -17, y: 0 },
            bodyB: sectionBodies[1],
            pointB: { x: 0, y: -15 },
            stiffness,
            length: 0,
          }),
        ]);
        break;
      case "R":
        World.add(engine.world, [
          Constraint.create({
            bodyA: sectionBodies[0],
            pointA: { x: -17, y: 0 },
            bodyB: sectionBodies[1],
            pointB: { x: 0, y: -15 },
            stiffness,
            length: 0,
          }),
          Constraint.create({
            bodyA: sectionBodies[1],
            pointA: { x: 0, y: 5 },
            bodyB: sectionBodies[2],
            pointB: { x: -17, y: -15 },
            stiffness,
            length: 0,
          }),
        ]);
        break;
      case "A":
        World.add(engine.world, [
          Constraint.create({
            bodyA: sectionBodies[0],
            pointA: { x: 10, y: -32 },
            bodyB: sectionBodies[1],
            pointB: { x: -10, y: -32 },
            stiffness,
            length: 0,
          }),
          Constraint.create({
            bodyA: sectionBodies[0],
            pointA: { x: -3, y: 10 },
            bodyB: sectionBodies[2],
            pointB: { x: -13, y: 0 },
            stiffness: stiffness * 0.05,
            length: 0,
          }),
          Constraint.create({
            bodyA: sectionBodies[1],
            pointA: { x: 3, y: 10 },
            bodyB: sectionBodies[2],
            pointB: { x: 13, y: 0 },
            stiffness: stiffness * 0.05,
            length: 0,
          }),
        ]);
        break;
      case "E":
        World.add(engine.world, [
          Constraint.create({
            bodyA: sectionBodies[0],
            pointA: { x: 0, y: -33 },
            bodyB: sectionBodies[1],
            pointB: { x: -15, y: 0 },
            stiffness,
            length: 0,
          }),
          Constraint.create({
            bodyA: sectionBodies[0],
            pointA: { x: 0, y: 33 },
            bodyB: sectionBodies[2],
            pointB: { x: -15, y: 0 },
            stiffness,
            length: 0,
          }),
          Constraint.create({
            bodyA: sectionBodies[0],
            pointA: { x: 0, y: 0 },
            bodyB: sectionBodies[3],
            pointB: { x: -12, y: 0 },
            stiffness,
            length: 0,
          }),
        ]);
        break;
      case "F":
        World.add(engine.world, [
          Constraint.create({
            bodyA: sectionBodies[0],
            pointA: { x: 0, y: -33 },
            bodyB: sectionBodies[1],
            pointB: { x: -15, y: 0 },
            stiffness,
            length: 0,
          }),
          Constraint.create({
            bodyA: sectionBodies[0],
            pointA: { x: 0, y: 0 },
            bodyB: sectionBodies[2],
            pointB: { x: -12, y: 0 },
            stiffness,
            length: 0,
          }),
        ]);
        break;
      case "L":
        World.add(engine.world, [
          Constraint.create({
            bodyA: sectionBodies[0],
            pointA: { x: 0, y: 33 },
            bodyB: sectionBodies[1],
            pointB: { x: -15, y: 0 },
            stiffness,
            length: 0,
          }),
        ]);
        break;
    }
  }
}

Events.on(engine, "tick", () => {
  const target = Vector.create(window.innerWidth / 2, window.innerHeight / 2);
  engine.world.bodies.forEach((body) => {
    let r = Vector.sub(target, body.position);
    if (Vector.magnitude(r) > 50) {
      r = Vector.mult(r, 0.00001);
    } else {
      r = Vector.mult(r, -0.0001);
    }
    Body.applyForce(body, body.position, r);
  });
});
