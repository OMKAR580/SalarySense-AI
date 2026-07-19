"use client";

import { motion } from "framer-motion";
import * as React from "react";
import { useEffect, useRef,useState } from "react";
import * as THREE from "three";

export const AuroraBackground: React.FC = () => {
    const mountRef = useRef<HTMLDivElement>(null);
    const [webGLFailed, setWebGLFailed] = useState(false);

    useEffect(() => {
        if (!mountRef.current || webGLFailed) return;
        const currentMount = mountRef.current;
        const scene = new THREE.Scene();
        const camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);
        let renderer: THREE.WebGLRenderer;
        try {
            renderer = new THREE.WebGLRenderer({ alpha: true, antialias: false, powerPreference: "low-power", failIfMajorPerformanceCaveat: false });
            renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1));
            renderer.setSize(window.innerWidth * 0.25, window.innerHeight * 0.25, false);
        } catch (error) {
            console.warn("WebGL not supported or context lost. Falling back to CSS Aurora:", error);
            setWebGLFailed(true);
            return;
        }
        renderer.domElement.style.width = '100%';
        renderer.domElement.style.height = '100%';
        renderer.domElement.style.objectFit = 'cover';
        currentMount.appendChild(renderer.domElement);
        const material = new THREE.ShaderMaterial({
            uniforms: { iTime: { value: 0 }, iResolution: { value: new THREE.Vector2(window.innerWidth, window.innerHeight) } },
            vertexShader: `void main() { gl_Position = vec4(position, 1.0); }`,
            fragmentShader: `
                uniform float iTime; uniform vec2 iResolution;
                #define NUM_OCTAVES 3
                float rand(vec2 n) { return fract(sin(dot(n, vec2(12.9898, 4.1414))) * 43758.5453); }
                float noise(vec2 p){ vec2 ip=floor(p);vec2 u=fract(p);u=u*u*(3.0-2.0*u);float res=mix(mix(rand(ip),rand(ip+vec2(1.0,0.0)),u.x),mix(rand(ip+vec2(0.0,1.0)),rand(ip+vec2(1.0,1.0)),u.x),u.y);return res*res; }
                float fbm(vec2 x) { float v=0.0;float a=0.3;vec2 shift=vec2(100);mat2 rot=mat2(cos(0.5),sin(0.5),-sin(0.5),cos(0.50));for(int i=0;i<NUM_OCTAVES;++i){v+=a*noise(x);x=rot*x*2.0+shift;a*=0.4;}return v;}
                void main() {
                    vec2 p=((gl_FragCoord.xy)-iResolution.xy*0.5)/iResolution.y*mat2(6.,-4.,4.,6.);vec4 o=vec4(0.);float f=2.+fbm(p+vec2(iTime*5.,0.))*.5;
                    for(float i=0.;i++<15.;){vec2 v=p+cos(i*i+(iTime+p.x*.08)*.025+i*vec2(13.,11.))*3.5;float tailNoise=fbm(v+vec2(iTime*.5,i))*.3*(1.-(i/15.));vec4 auroraColors=vec4(.1+.2*sin(i*.2+iTime*.2),.3+.4*cos(i*.3+iTime*.3),.8+.3*sin(i*.4+iTime*.2),1.);vec4 currentContribution=auroraColors*exp(sin(i*i+iTime*.8))/length(max(v,vec2(v.x*f*.015,v.y*1.5)));float thinnessFactor=smoothstep(0.,1.,i/15.)*.6;o+=currentContribution*(1.+tailNoise*.8)*thinnessFactor;}
                    o=tanh(pow(o/100.,vec4(1.6)));gl_FragColor=o*1.5;
                }`
        });
        const geometry = new THREE.PlaneGeometry(2, 2);
        const mesh = new THREE.Mesh(geometry, material);
        scene.add(mesh);
        
        let animationFrameId: number;
        let isVisible = true;
        
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => { isVisible = entry.isIntersecting; });
        }, { threshold: 0 });
        observer.observe(currentMount);

        const animate = () => { 
            animationFrameId = requestAnimationFrame(animate); 
            if (!isVisible) return; 
            material.uniforms['iTime']!.value += 0.003; 
            renderer.render(scene, camera); 
        };
        const handleResize = () => { 
            renderer.setSize(window.innerWidth * 0.25, window.innerHeight * 0.25, false); 
            material.uniforms['iResolution']!.value.set(window.innerWidth, window.innerHeight); 
        };
        window.addEventListener('resize', handleResize);
        animate();
        return () => { 
            observer.disconnect();
            cancelAnimationFrame(animationFrameId); 
            window.removeEventListener('resize', handleResize); 
            if (currentMount.contains(renderer.domElement)) currentMount.removeChild(renderer.domElement); 
            renderer.dispose(); material.dispose(); geometry.dispose(); 
        };
    }, [webGLFailed]);

    if (webGLFailed) {
        return (
            <div className="absolute inset-0 w-full h-full opacity-60 overflow-hidden pointer-events-none flex items-center justify-center">
                <motion.div className="absolute w-[60vw] h-[40vw] rounded-full" style={{ background: 'radial-gradient(ellipse at center, rgba(59,130,246,0.3) 0%, rgba(30,58,138,0) 70%)' }} animate={{ rotate: [0, 90, 0], scale: [1, 1.2, 1] }} transition={{ duration: 20, repeat: Infinity, ease: "easeInOut" }} />
                <motion.div className="absolute w-[50vw] h-[50vw] rounded-full translate-x-1/4 -translate-y-1/4" style={{ background: 'radial-gradient(ellipse at center, rgba(139,92,246,0.2) 0%, rgba(76,29,149,0) 70%)' }} animate={{ rotate: [0, -90, 0], scale: [1, 1.5, 1] }} transition={{ duration: 25, repeat: Infinity, ease: "easeInOut" }} />
                <motion.div className="absolute w-[70vw] h-[30vw] rounded-full -translate-x-1/4 translate-y-1/4" style={{ background: 'radial-gradient(ellipse at center, rgba(14,165,233,0.2) 0%, rgba(8,145,178,0) 70%)' }} animate={{ rotate: [0, 180, 0], scale: [1, 1.1, 1] }} transition={{ duration: 15, repeat: Infinity, ease: "easeInOut" }} />
                <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff0a_1px,transparent_1px),linear-gradient(to_bottom,#ffffff0a_1px,transparent_1px)] bg-[size:64px_64px] [mask-image:radial-gradient(ellipse_60%_60%_at_50%_50%,#000_50%,transparent_100%)] z-10" />
            </div>
        );
    }

    return <div ref={mountRef} className="absolute inset-0 w-full h-full opacity-40 pointer-events-none" />;
};
