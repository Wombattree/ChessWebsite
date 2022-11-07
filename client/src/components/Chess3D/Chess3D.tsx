import React, { useState } from 'react';
import { Canvas } from 'react-three-fiber';
import { OrbitControls } from '@react-three/drei';
import './style.css';
import { PerspectiveCamera } from '@react-three/drei/core';

export default function Chess() 
{
	function Board()
	{
	  return(
		<mesh position={[0, 0, 0.25]} rotation={[0, 0, 0]}>
		  <boxGeometry attach="geometry" args={[2, 2, 0.25]}/>
		  <meshLambertMaterial attach="material" color="purple"/>
		</mesh>
	  )
	}
	
	function Plane()
	{
	  return(
		<mesh position={[0, 0, 0]} rotation={[0, 0, 0]}>
		  <planeGeometry attach="geometry" args={[100, 100, 1]}/>
		  <meshLambertMaterial attach="material" color="green"/>
		</mesh>
	  )
	}

	function Candle1()
	{
	  return(
		<mesh position={[2, 0, 0.5]} rotation={[0, 0, 0]}>
		  <boxGeometry attach="geometry" args={[.25, .25, 0.5]}/>
		  <meshLambertMaterial attach="material" color="white"/>
		</mesh>
	  )
	}

	return (
		<div className="renderingCanvas">
			<Canvas camera={{ position: [0, 0, 5] }}>
				{/* <PerspectiveCamera makeDefault fov={75} position={[0, 0, 3]} setRotationFromEuler={} quaternion={undefined} rotation={[-90, 90, 0]} key={undefined} id={undefined} view={undefined} onClick={undefined} attach={undefined} args={undefined} onUpdate={undefined} up={undefined} scale={undefined} matrix={undefined} layers={undefined} dispose={undefined} onContextMenu={undefined} onDoubleClick={undefined} onPointerUp={undefined} onPointerDown={undefined} onPointerOver={undefined} onPointerOut={undefined} onPointerEnter={undefined} onPointerLeave={undefined} onPointerMove={undefined} onPointerMissed={undefined} onPointerCancel={undefined} onWheel={undefined} visible={undefined} type={undefined} uuid={undefined} name={undefined} parent={undefined} modelViewMatrix={undefined} normalMatrix={undefined} matrixWorld={undefined} matrixAutoUpdate={undefined} matrixWorldNeedsUpdate={undefined} castShadow={undefined} receiveShadow={undefined} frustumCulled={undefined} renderOrder={undefined} animations={undefined} userData={undefined} customDepthMaterial={undefined} customDistanceMaterial={undefined} isObject3D={undefined} onBeforeRender={undefined} onAfterRender={undefined} applyMatrix4={undefined} applyQuaternion={undefined} setRotationFromAxisAngle={undefined} setRotationFromEuler={undefined} setRotationFromMatrix={undefined} setRotationFromQuaternion={undefined} rotateOnAxis={undefined} rotateOnWorldAxis={undefined} rotateX={undefined} rotateY={undefined} rotateZ={undefined} translateOnAxis={undefined} translateX={undefined} translateY={undefined} translateZ={undefined} localToWorld={undefined} worldToLocal={undefined} lookAt={undefined} add={undefined} remove={undefined} removeFromParent={undefined} clear={undefined} getObjectById={undefined} getObjectByName={undefined} getObjectByProperty={undefined} getWorldPosition={undefined} getWorldQuaternion={undefined} getWorldScale={undefined} getWorldDirection={undefined} raycast={undefined} traverse={undefined} traverseVisible={undefined} traverseAncestors={undefined} updateMatrix={undefined} updateMatrixWorld={undefined} updateWorldMatrix={undefined} toJSON={undefined} clone={undefined} copy={undefined} addEventListener={undefined} hasEventListener={undefined} removeEventListener={undefined} dispatchEvent={undefined} zoom={undefined} matrixWorldInverse={undefined} projectionMatrix={undefined} projectionMatrixInverse={undefined} isCamera={undefined} near={undefined} far={undefined} isPerspectiveCamera={undefined} aspect={undefined} focus={undefined} filmGauge={undefined} filmOffset={undefined} setFocalLength={undefined} getFocalLength={undefined} getEffectiveFOV={undefined} getFilmWidth={undefined} getFilmHeight={undefined} setViewOffset={undefined} clearViewOffset={undefined} updateProjectionMatrix={undefined} setLens={undefined}/> */}
				<OrbitControls />
				<ambientLight intensity={0.25} />
				<Board />
				<Plane />
				<Candle1 />
				<pointLight position={[2, 10, -0.5]} rotation={[-2.1, 0, 0]} decay="1"/>
			</Canvas>
		</div>
	);
}