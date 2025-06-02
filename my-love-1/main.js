document.addEventListener("DOMContentLoaded", () => {
  init();
});

let scene, camera, renderer, controls;
const texts = [];
const hearts = [];
const sprites = []; // <-- Thêm mảng chứa ảnh

function createHeartMesh(color = 0xffc0cb) {
  const x = 0,
    y = 0;
  const heartShape = new THREE.Shape();
  heartShape.moveTo(x + 0, y + 0);
  heartShape.bezierCurveTo(x + 0, y + 3, x - 3, y + 5, x - 5, y + 5);
  heartShape.bezierCurveTo(x - 9, y + 5, x - 9, y + 1, x - 9, y + 1);
  heartShape.bezierCurveTo(x - 9, y - 3, x - 5, y - 7, x + 0, y - 10);
  heartShape.bezierCurveTo(x + 5, y - 7, x + 9, y - 3, x + 9, y + 1);
  heartShape.bezierCurveTo(x + 9, y + 1, x + 9, y + 5, x + 5, y + 5);
  heartShape.bezierCurveTo(x + 3, y + 5, x + 0, y + 3, x + 0, y + 0);

  const geometry = new THREE.ShapeGeometry(heartShape);
  const material = new THREE.MeshBasicMaterial({ color: color });
  const mesh = new THREE.Mesh(geometry, material);

  mesh.scale.set(0.5, 0.5, 0.5);
  return mesh;
}

function init() {
  scene = new THREE.Scene();

  camera = new THREE.PerspectiveCamera(
    75,
    window.innerWidth / window.innerHeight,
    0.1,
    1000
  );
  camera.position.set(0, 10, 100);

  renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
  renderer.setSize(window.innerWidth, window.innerHeight);
  document.body.appendChild(renderer.domElement);

  controls = new THREE.OrbitControls(camera, renderer.domElement);

  // Background stars
  const starsGeometry = new THREE.BufferGeometry();
  const starVertices = [];
  for (let i = 0; i < 10000; i++) {
    starVertices.push((Math.random() - 0.5) * 2000);
    starVertices.push((Math.random() - 0.5) * 2000);
    starVertices.push((Math.random() - 0.5) * 2000);
  }
  starsGeometry.setAttribute(
    "position",
    new THREE.Float32BufferAttribute(starVertices, 3)
  );
  const starsMaterial = new THREE.PointsMaterial({ color: 0xffffff });
  const stars = new THREE.Points(starsGeometry, starsMaterial);
  scene.add(stars);

  const loader = new THREE.FontLoader();
  loader.load(
    "font/Open Sans Condensed_Bold.json",
    function (font) {
      for (let i = 0; i < 20; i++) {
        const textGeo1 = new THREE.TextGeometry("Anh yêu em", {
          font: font,
          size: 2,
          height: 0.3,
          curveSegments: 8,
        });

        const material1 = new THREE.MeshBasicMaterial({ color: 0xffc0cb });
        const mesh1 = new THREE.Mesh(textGeo1, material1);
        mesh1.position.set(
          (Math.random() - 0.5) * 100,
          Math.random() * 100 + 50,
          (Math.random() - 0.5) * 100
        );
        scene.add(mesh1);
        texts.push(mesh1);
      }

      for (let i = 0; i < 20; i++) {
        const textGeo2 = new THREE.TextGeometry(
          "Cảm ơn em vì thời gian qua đã ở bên cạnh anh!",
          {
            font: font,
            size: 2,
            height: 0.3,
            curveSegments: 8,
          }
        );

        const material2 = new THREE.MeshBasicMaterial({ color: 0xff69b4 });
        const mesh2 = new THREE.Mesh(textGeo2, material2);
        mesh2.position.set(
          (Math.random() - 0.5) * 100,
          Math.random() * 100 + 50,
          (Math.random() - 0.5) * 100
        );
        scene.add(mesh2);
        texts.push(mesh2);
      }

      for (let i = 0; i < 10; i++) {
        const heart = createHeartMesh(0xffc0cb);
        heart.position.set(
          (Math.random() - 0.5) * 100,
          Math.random() * 100 + 50,
          (Math.random() - 0.5) * 100
        );
        scene.add(heart);
        hearts.push(heart);
      }

      // ✅ Load ảnh PNG (ví dụ hoa hồng)
      const textureLoader = new THREE.TextureLoader();
      for (let i = 0; i < 10; i++) {
        textureLoader.load("img/lo2.jpg", function (texture) {
          const material = new THREE.SpriteMaterial({ map: texture });
          const sprite = new THREE.Sprite(material);
          sprite.scale.set(10, 10, 1); // Kích thước ảnh
          sprite.position.set(
            (Math.random() - 0.5) * 100,
            Math.random() * 100 + 50,
            (Math.random() - 0.5) * 100
          );
          scene.add(sprite);
          sprites.push(sprite);
        });
      }

      animate();
    },
    undefined,
    function (err) {
      console.error("Font load error:", err);
    }
  );

  window.addEventListener("resize", onWindowResize);
}

function animate() {
  requestAnimationFrame(animate);

  texts.forEach((text) => {
    text.position.y -= 0.2;
    if (text.position.y < -50) text.position.y = 100;
  });

  hearts.forEach((heart) => {
    heart.position.y -= 0.1;
    if (heart.position.y < -50) heart.position.y = 100;
  });

  sprites.forEach((sprite) => {
    sprite.position.y -= 0.15;
    if (sprite.position.y < -50) sprite.position.y = 100;
  });

  controls.update();
  renderer.render(scene, camera);
}

function onWindowResize() {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
}
