
import decomp from "poly-decomp";
import { Engine, Render, Bodies, World, Svg, Vertices, Mouse, MouseConstraint } from "matter-js";
import logoPath from "./logo.svg";
// import boxPath from "./box.svg";
import "pathseg";
import Bounds from "matter-js/src/geometry/Bounds";

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

async function getLogo() {
  const logoResponse = await fetch(logoPath);
  const logoSource = await logoResponse.text();

  const parser = new DOMParser();
  const doc = parser.parseFromString(logoSource, "image/svg+xml");
  const letters = doc.getElementsByTagName("g")[0].children;

  for (let i = 0; i < letters.length; i++) {
    console.log(letters[i]);
    const sections = letters[i].getElementsByTagName("path");
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

      console.log(center);

      // center.x += 300;
      // center.y += 300;

      const body = Bodies.fromVertices(center.x, center.y, [points], {
        render: {
          fillStyle: "#556270",
          strokeStyle: "#556270",
          lineWidth: 2
        }
      }, true)
      //      body.isStatic = true;

      console.log(body.position);

      World.add(engine.world, body);
    }
  }

  // let vertexSets = [];
  // for (let i = 0; i < paths.length; i++) {
  //   console.log(paths);
  //   
  //   vertexSets.push(points);
  // }



  // World.add(engine.world,);
}

getLogo();
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
