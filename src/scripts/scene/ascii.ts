import * as THREE from "three";
import { createDoomFire } from "./doom-fire";

/** A coloured glyph surface shared by the character, desktop and mathematical fields. */
export function createAsciiSurface() {
	const source = new THREE.WebGLRenderTarget(800, 600, { minFilter: THREE.LinearFilter, magFilter: THREE.LinearFilter });
	const portraitSource = source.clone();
	const atlas = createAtlas();
	const fire = createDoomFire();
	const uniforms = {
		uImage: { value: source.texture },
		uPortrait: { value: portraitSource.texture },
		uPortraitPresence: { value: 0 },
		uAtlas: { value: atlas },
		uFireField: { value: fire.texture },
		uFireReveal: { value: 1 },
		uFireLift: { value: 0 },
		uWorkPresence: { value: 0 },
		uContactPresence: { value: 0 },
		uGrid: { value: new THREE.Vector2(100, 60) },
		uTime: { value: 0 },
		uStory: { value: 0 },
		uBrightness: { value: 0.9 },
		uPointer: { value: new THREE.Vector2(0.5, 0.5) },
		uImpulse: { value: new THREE.Vector3(0.5, 0.5, -30) },
		uWeights: { value: new THREE.Vector3() },
		uFieldCenter: { value: new THREE.Vector2(0.5, 0.5) },
		// Retained for callers from V3; the V4 flame never reads a movable origin.
		uFireOrigin: { value: new THREE.Vector2(0.7, 0.2) },
		uLabelFocus: { value: new THREE.Vector4(-1, -1, 0, 0) },
		uLabelOpacity: { value: 0 },
		uNarrativeFocus: { value: Array.from({ length: 5 }, () => new THREE.Vector4(-1, -1, 0, 0)) },
		uNarrativeOpacity: { value: new Float32Array(5) }
	};
	const material = new THREE.ShaderMaterial({
		uniforms,
		depthTest: false,
		depthWrite: false,
		vertexShader: "varying vec2 vUv;void main(){vUv=uv;gl_Position=vec4(position.xy,0.,1.);}",
		fragmentShader: `
      precision highp float;
      varying vec2 vUv;
      uniform sampler2D uImage,uPortrait,uAtlas,uFireField;
      uniform vec2 uGrid,uPointer,uFieldCenter;
      uniform vec3 uWeights,uImpulse;
      uniform vec4 uLabelFocus;
      uniform vec4 uNarrativeFocus[5];
      uniform float uLabelOpacity,uNarrativeOpacity[5];
      uniform float uTime,uStory,uBrightness,uFireReveal,uFireLift,uWorkPresence,uContactPresence,uPortraitPresence;
      float hash(vec2 p){return fract(sin(dot(p,vec2(127.1,311.7)))*43758.5453);}
      float noise(vec2 p){vec2 i=floor(p),f=fract(p);f=f*f*(3.-2.*f);return mix(mix(hash(i),hash(i+vec2(1,0)),f.x),mix(hash(i+vec2(0,1)),hash(i+vec2(1,1)),f.x),f.y);}
      vec3 flamePalette(float h){
        // Purple embers → red → orange → gold → pale hot tips, as in textmode Doom.
        if(h<.12)return mix(vec3(.12,0.,.2),vec3(.5,0.,.02),h/.12);
        if(h<.32)return mix(vec3(.5,0.,.02),vec3(1.,.055,0.),(h-.12)/.2);
        if(h<.56)return mix(vec3(1.,.055,0.),vec3(1.,.42,0.),(h-.32)/.24);
        if(h<.76)return mix(vec3(1.,.42,0.),vec3(1.,.84,.015),(h-.56)/.2);
        return mix(vec3(1.,.84,.015),vec3(1.,1.,.9),clamp((h-.76)/.24,0.,1.));
      }
      void main(){
        vec2 cell=floor(vUv*uGrid),uv=(cell+.5)/uGrid;
        float aspect=uGrid.x/uGrid.y*.64;
        vec3 raw=texture2D(uImage,uv).rgb;
        if(uPortraitPresence>.0001)raw=mix(raw,texture2D(uPortrait,uv).rgb,uPortraitPresence);
        float brightness=dot(raw,vec3(.2126,.7152,.0722));
        // Perceptual density keeps the blue face legible without turning the
        // dark scene into a carpet of dots; highlights become broad strokes.
        float density=pow(max(brightness-.003,0.),.46)*1.18;
        vec3 tint=pow(max(raw,vec3(0.)),vec3(.55));
        tint/=max(max(max(tint.r,tint.g),tint.b),.001);
        vec3 colour=mix(vec3(.88,.91,.89),tint,.62);
        float t=uTime;
        float fireHeat=0.;
        float fireMix=0.;
        vec3 fireColour=vec3(0.);
        if(uWeights.y>.001){
          // Circle SDF → a full-bleed, breathing contour field. Pointer gravity
          // bends the distance function, rather than merely changing its colour.
          vec2 pointer=(uPointer-.5)*vec2(aspect,1.);
          vec2 p=(uv-vec2(.5))*vec2(aspect,1.);
          p-=pointer*.12;
          vec2 touch=(uv-uPointer)*vec2(aspect,1.);
          float attraction=exp(-dot(touch,touch)*14.);
          p-=touch*attraction*.62;
          float breath=1.+.2*sin(t*1.24)+.055*sin(t*1.93+.6);
          p/=breath;
          float radius=length(p),theta=atan(p.y,p.x)+t*.065;
          float petals=.066*cos(theta*6.+.7*sin(t*.29))+.021*cos(theta*11.-t*.23);
          float age=max(0.,t-uImpulse.z);
          float kick=sin(length((uv-uImpulse.xy)*vec2(aspect,1.))*34.-age*5.)*exp(-age*1.4);
          float curve=radius-.25-petals*(.65+.35*sin(radius*5.-t*.24));
          curve+=.024*sin(theta*3.+radius*9.-t*.47)+attraction*.075+kick*.027;
          float rings=.5+.5*cos(curve*48.-t*.6+sin(theta*4.-t*.21)*.65);
          float contours=pow(rings,5.5);
          float filaments=pow(.5+.5*cos(curve*102.+theta*.6+t*.38),16.)*.16;
          float texture=.64+.26*sin(radius*13.-theta*2.+t*.32);
          float alive=(contours*.76+filaments)*texture;
          alive*=.82+.18*sin(theta*5.-t*.39);
          density=mix(density,alive,uWeights.y);
          vec3 aliveColour=mix(vec3(.38,.67,.76),vec3(.85,.92,.72),.5+.5*sin(theta*2.+radius*8.-t*.24));
          colour=mix(colour,aliveColour,uWeights.y*.9);
        }
        if(uWeights.z>.001){
          vec2 landscape=uv;
          landscape.x+=uStory*.075;
          float terrain=0.;
          for(int j=0;j<10;j++){
            float k=float(j);
            float h=.11+k*.065+sin(landscape.x*6.+k*.49+t*.1)*.085+sin(landscape.x*16.-k*.8+t*.07)*.025;
            h+=noise(vec2(landscape.x*8.,k*.3))*.045;
            float line=exp(-abs(landscape.y-h)*uGrid.y*.9);
            terrain=max(terrain,line*(.18+k*.06));
          }
          terrain+=exp(-abs(landscape.y-(.42+sin(landscape.x*9.-t*.2)*.055))*uGrid.y)*.22;
          terrain=max(0.,terrain-.018)*.93;
          density=mix(density,terrain,uWeights.z);
          colour=mix(colour,mix(vec3(.47,.7,.8),vec3(.85,.88,.74),uv.y),uWeights.z);
        }
        if(uWorkPresence>.001){
          // Stable random positions; only their luminosity changes, slowly.
          float seed=hash(cell+vec2(71.,149.));
          float twinkle=pow(.5+.5*sin(t*(.38+hash(cell+9.)*.43)+seed*91.),3.);
          float stars=smoothstep(.989,.9998,seed)*(.07+.39*twinkle);
          density=max(density,stars*uWorkPresence);
          colour=mix(colour,vec3(.62,.76,.8),step(.06,stars)*uWorkPresence*.7);
        }
        if(uContactPresence>.001){
          // Hotlink's flowing density idea, made sparse and quiet. Noise is
          // local shader math; no remote code or runtime dependency is used.
          vec2 p=(uv-.5)*vec2(aspect,1.);
          vec2 flow=p*2.7+vec2(t*.025,-t*.04);
          float warp=noise(flow+vec2(.0,t*.035));
          float cloud=noise(flow+vec2(warp*1.3,-warp*.8));
          float veins=pow(.5+.5*sin(cloud*24.+t*.11),9.);
          float quietCenter=1.-exp(-dot(p,p)*7.);
          float contact=veins*smoothstep(.28,.68,cloud)*quietCenter*.34;
          density=mix(density,contact,uContactPresence);
          colour=mix(colour,vec3(.52,.67,.72),uContactPresence);
        }
        if(uWeights.x>.001 && uFireReveal>.001){
          // Lift climbs THROUGH the flame field. The bottom stays hot and
          // populated while the expanding fire cross-dissolves into the SDF.
          float lift=clamp(uFireLift,0.,1.);
          float fireHeight=max(uFireReveal,.001)*(1.+lift*1.7);
          vec2 fireUv=vec2(uv.x,uv.y/fireHeight);
          fireHeat=texture2D(uFireField,clamp(fireUv,0.,1.)).r;
          fireHeat*=step(0.,fireUv.y)*(1.-step(1.,fireUv.y));
          fireColour=flamePalette(fireHeat);
          float edge=fireHeight+.025*sin(uv.x*19.+t*.5)+.035*noise(vec2(uv.x*16.,t*.4));
          fireMix=uWeights.x*(1.-smoothstep(edge-.035,edge+.035,uv.y));
          density=mix(density,smoothstep(.015,.1,fireHeat),fireMix);
          colour=mix(colour,fireColour,fireMix);
        }
        float i=floor(clamp(density,0.,.999)*16.);
        if(fireMix>.5 && fireHeat>.015)i=16.+mod(floor(fireHeat*127.),10.);
        vec2 glyph=fract(vUv*uGrid);
        float ink=texture2D(uAtlas,vec2((i+glyph.x)/32.,glyph.y)).r;
        float vignette=1.-smoothstep(.4,1.1,length((uv-.5)*vec2(.8,1.)));
        vec2 delta=abs(uv-uLabelFocus.xy)-uLabelFocus.zw;
        float protectedArea=1.-smoothstep(-.02,.065,max(delta.x,delta.y));
        float protection=1.-.66*protectedArea*uLabelOpacity;
        for(int j=0;j<5;j++){
          vec2 delta=abs(uv-uNarrativeFocus[j].xy)-uNarrativeFocus[j].zw;
          float area=1.-smoothstep(-.02,.065,max(delta.x,delta.y));
          protection*=1.-.66*area*uNarrativeOpacity[j];
        }
        // Keep the hot floor translucent: the subject is tongues of digit-fire,
        // rather than a solid white rectangle occupying the lower screen.
        vec3 fireGlow=fireColour*fireHeat*.075*fireMix;
        gl_FragColor=vec4(vec3(.018,.023,.025)+(ink*colour*uBrightness+fireGlow)*vignette*protection,1.);
      }`
	});
	const scene = new THREE.Scene();
	const quad = new THREE.Mesh(new THREE.PlaneGeometry(2, 2), material);
	scene.add(quad);
	const camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);
	return {
		source,
		portraitSource,
		fire,
		uniforms,
		scene,
		camera,
		resize(width: number, height: number, large = false) {
			const cell = width < 600 ? 8.5 : large ? 20 : 14;
			uniforms.uGrid.value.set(Math.ceil(width / cell), Math.ceil(height / (cell * 1.5)));
			fire.resize(uniforms.uGrid.value.x, uniforms.uGrid.value.y);
			source.setSize(Math.round(width * 0.65), Math.round(height * 0.65));
			portraitSource.setSize(Math.round(width * 0.65), Math.round(height * 0.65));
		},
		dispose() {
			source.dispose();
			portraitSource.dispose();
			atlas.dispose();
			fire.dispose();
			material.dispose();
			quad.geometry.dispose();
		}
	};
}

function createAtlas(): THREE.CanvasTexture {
	const canvas = document.createElement("canvas");
	canvas.width = 1024;
	canvas.height = 48;
	const ctx = canvas.getContext("2d")!;
	ctx.fillStyle = "#000";
	ctx.fillRect(0, 0, 1024, 48);
	ctx.fillStyle = "#fff";
	ctx.font = "bold 40px monospace";
	ctx.textAlign = "center";
	ctx.textBaseline = "middle";
	[" ", ".", ":", "·", "-", "/", "+", "=", "x", "*", "o", "#", "%", "@", "▓", "█"].forEach((glyph, index) => ctx.fillText(glyph, index * 32 + 16, 25));
	ctx.fillStyle = "#000";
	ctx.fillRect(14 * 32, 0, 64, 48);
	ctx.fillStyle = "#fff";
	ctx.fillRect(14 * 32, 15, 32, 18);
	ctx.fillRect(15 * 32, 6, 32, 36);
	ctx.font = "bold 40px monospace";
	for (let digit = 0; digit < 10; digit++) ctx.fillText(String(digit), (16 + digit) * 32 + 16, 25);
	const texture = new THREE.CanvasTexture(canvas);
	texture.minFilter = THREE.LinearFilter;
	texture.magFilter = THREE.LinearFilter;
	return texture;
}
