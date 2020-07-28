
import decomp from "poly-decomp";
import { Engine, Render, Bodies, World, Svg, Vertices, Mouse, MouseConstraint, Constraint } from "matter-js";
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
    height: window.innerHeight
  }
});

engine.world.gravity = { x: 0, y: 0, scale: 0 };

var mouse = Mouse.create(render.canvas),
  mouseConstraint = MouseConstraint.create(engine, {
    mouse: mouse,
    constraint: {
      stiffness: 0.2,
      render: {
        visible: false
      }
    }
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
      points.forEach(p => {
        p.x += 300;
        p.y += 300;

        center.x += p.x;
        center.y += p.y;
      });
      center.x /= points.length;
      center.y /= points.length;
      console.log(i);
      sectionBodies.push(Bodies.fromVertices(center.x, center.y, [points], {
        render: {
          fillStyle: "#556270",
          strokeStyle: "#556270",
          lineWidth: 2
        },
        isStatic: false,
        collisionFilter: { group: -1 * (i + 1) }
      }, true));
    }

    World.add(engine.world, sectionBodies);

    switch (letter.id) {
      case "S":
        World.add(engine.world, [
          Constraint.create({
            bodyA: sectionBodies[0],
            pointA: { x: -15, y: 10 },
            bodyB: sectionBodies[2],
            pointB: { x: -15, y: -15 },
            stiffness: 0.2,
            length: 0
          }),
          Constraint.create({
            bodyA: sectionBodies[2],
            pointA: { x: 15, y: 15 },
            bodyB: sectionBodies[1],
            pointB: { x: 15, y: -10 },
            stiffness: 0.2,
            length: 0
          })
        ]);

        break;
    }

  }
}


