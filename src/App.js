import React, { useRef, useEffect } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import * as dat from 'dat.gui';


function App() {
  const sceneRef = useRef(null);
  const rendererRef = useRef(null);
  const guiRef = useRef(null);
  const spheres = useRef([]);

  useEffect(() => {
    // Scene setup
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0xffffff);

    // Camera setup
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.z = 5;

    // Renderer setup
    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    rendererRef.current = renderer;

    // Controls setup
    const controls = new OrbitControls(camera, renderer.domElement);

    // Append renderer to the DOM
    sceneRef.current.appendChild(renderer.domElement);

    // GUI setup
    const gui = new dat.GUI();
    guiRef.current = gui;

    // Add sphere button
    const addButton = { addSphere: () => addSphere(scene, gui) };
    gui.add(addButton, 'addSphere').name('Add Sphere');

    // Animation loop
    const animate = () => {
      requestAnimationFrame(animate);
      renderer.render(scene, camera);
    };
    animate();

    // Clean up
    return () => {
      gui.destroy();
      sceneRef.current.removeChild(renderer.domElement);
    };
  }, []);

  const addSphere = (scene, gui) => {
    const sphereGeometry = new THREE.SphereGeometry(1, 32, 32);
    const sphereMaterial = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
    const sphere = new THREE.Mesh(sphereGeometry, sphereMaterial);
    sphere.position.set(Math.random() * 4 - 2, Math.random() * 4 - 2, Math.random() * 4 - 2);
    scene.add(sphere);
    spheres.current.push(sphere);

    // Remove sphere on double-click
    sphere.addEventListener('dblclick', () => {
      scene.remove(sphere);
      spheres.current = spheres.current.filter((s) => s !== sphere);
    });

    // Sphere properties in GUI
    const sphereFolder = gui.addFolder(`Sphere ${spheres.current.length}`);
    const color = { value: sphereMaterial.color.getHex() };
    sphereFolder.addColor(color, 'value').name('Color').onChange(() => {
      sphereMaterial.color.set(color.value);
    });
    sphereFolder.add(sphere.position, 'x', -2, 2, 0.1).name('X Position');
    sphereFolder.add(sphere.position, 'y', -2, 2, 0.1).name('Y Position');
    sphereFolder.add(sphere.position, 'z', -2, 2, 0.1).name('Z Position');
    sphereFolder.open();
  };

  return <div ref={sceneRef} />;
}

export default App;
