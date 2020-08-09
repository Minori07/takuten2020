class Canvas {
  constructor() {
    // ウィンドウサイズ
    this.w = window.innerWidth;
    this.h = window.innerHeight;

    this.minW = 700;
    if (this.w < this.minW) this.w = this.minW;

    //スクロール量
    this.scrollY = 0;

    //アニメーション用、時間経過
    this.time = 0;

    // レンダラーを作成
    this.renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    this.renderer.setPixelRatio(window.devicePixelRatio); // ピクセル比
    this.renderer.setSize(this.w, this.h); // 描画サイズ

    // #canvas-containerにレンダラーのcanvasを追加
    const container = document.getElementById("canvas-container");
    container.appendChild(this.renderer.domElement);

    const fov = 60;
    const fovRad = (fov / 2) * (Math.PI / 180); // 視野角をラジアンに変換
    const dist = this.h / 2 / Math.tan(fovRad); // ウィンドウぴったりのカメラ距離

    // カメラを作成 (視野角, 画面のアスペクト比, カメラに映る最短距離, カメラに映る最遠距離)
    this.camera = new THREE.PerspectiveCamera(
      fov,
      this.w / this.h,
      1,
      dist * 2
    );
    this.camera.position.z = dist; // カメラを遠ざける

    const loader = new THREE.TextureLoader();
    const texture = loader.load("images/wave.png");

    // シーンを作成
    this.scene = new THREE.Scene();

    //シェーダー
    const vs = `
      //ここからライブラリ-------------------------
      //
      // Description : Array and textureless GLSL 2D/3D/4D simplex 
      //               noise functions.
      //      Author : Ian McEwan, Ashima Arts.
      //  Maintainer : stegu
      //     Lastmod : 20110822 (ijm)
      //     License : Copyright (C) 2011 Ashima Arts. All rights reserved.
      //               Distributed under the MIT License. See LICENSE file.
      //               https://github.com/ashima/webgl-noise
      //               https://github.com/stegu/webgl-noise
      // 

      vec3 mod289(vec3 x) {
        return x - floor(x * (1.0 / 289.0)) * 289.0;
      }

      vec4 mod289(vec4 x) {
        return x - floor(x * (1.0 / 289.0)) * 289.0;
      }

      vec4 permute(vec4 x) {
          return mod289(((x*34.0)+1.0)*x);
      }

      vec4 taylorInvSqrt(vec4 r)
      {
        return 1.79284291400159 - 0.85373472095314 * r;
      }

      float snoise(vec3 v)
        { 
        const vec2  C = vec2(1.0/6.0, 1.0/3.0) ;
        const vec4  D = vec4(0.0, 0.5, 1.0, 2.0);

      // First corner
        vec3 i  = floor(v + dot(v, C.yyy) );
        vec3 x0 =   v - i + dot(i, C.xxx) ;

      // Other corners
        vec3 g = step(x0.yzx, x0.xyz);
        vec3 l = 1.0 - g;
        vec3 i1 = min( g.xyz, l.zxy );
        vec3 i2 = max( g.xyz, l.zxy );

        //   x0 = x0 - 0.0 + 0.0 * C.xxx;
        //   x1 = x0 - i1  + 1.0 * C.xxx;
        //   x2 = x0 - i2  + 2.0 * C.xxx;
        //   x3 = x0 - 1.0 + 3.0 * C.xxx;
        vec3 x1 = x0 - i1 + C.xxx;
        vec3 x2 = x0 - i2 + C.yyy; // 2.0*C.x = 1/3 = C.y
        vec3 x3 = x0 - D.yyy;      // -1.0+3.0*C.x = -0.5 = -D.y

      // Permutations
        i = mod289(i); 
        vec4 p = permute( permute( permute( 
                  i.z + vec4(0.0, i1.z, i2.z, 1.0 ))
                + i.y + vec4(0.0, i1.y, i2.y, 1.0 )) 
                + i.x + vec4(0.0, i1.x, i2.x, 1.0 ));

      // Gradients: 7x7 points over a square, mapped onto an octahedron.
      // The ring size 17*17 = 289 is close to a multiple of 49 (49*6 = 294)
        float n_ = 0.142857142857; // 1.0/7.0
        vec3  ns = n_ * D.wyz - D.xzx;

        vec4 j = p - 49.0 * floor(p * ns.z * ns.z);  //  mod(p,7*7)

        vec4 x_ = floor(j * ns.z);
        vec4 y_ = floor(j - 7.0 * x_ );    // mod(j,N)

        vec4 x = x_ *ns.x + ns.yyyy;
        vec4 y = y_ *ns.x + ns.yyyy;
        vec4 h = 1.0 - abs(x) - abs(y);

        vec4 b0 = vec4( x.xy, y.xy );
        vec4 b1 = vec4( x.zw, y.zw );

        //vec4 s0 = vec4(lessThan(b0,0.0))*2.0 - 1.0;
        //vec4 s1 = vec4(lessThan(b1,0.0))*2.0 - 1.0;
        vec4 s0 = floor(b0)*2.0 + 1.0;
        vec4 s1 = floor(b1)*2.0 + 1.0;
        vec4 sh = -step(h, vec4(0.0));

        vec4 a0 = b0.xzyw + s0.xzyw*sh.xxyy ;
        vec4 a1 = b1.xzyw + s1.xzyw*sh.zzww ;

        vec3 p0 = vec3(a0.xy,h.x);
        vec3 p1 = vec3(a0.zw,h.y);
        vec3 p2 = vec3(a1.xy,h.z);
        vec3 p3 = vec3(a1.zw,h.w);

      //Normalise gradients
        vec4 norm = taylorInvSqrt(vec4(dot(p0,p0), dot(p1,p1), dot(p2, p2), dot(p3,p3)));
        p0 *= norm.x;
        p1 *= norm.y;
        p2 *= norm.z;
        p3 *= norm.w;

      // Mix final noise value
        vec4 m = max(0.6 - vec4(dot(x0,x0), dot(x1,x1), dot(x2,x2), dot(x3,x3)), 0.0);
        m = m * m;
        return 42.0 * dot( m*m, vec4( dot(p0,x0), dot(p1,x1), 
                                      dot(p2,x2), dot(p3,x3) ) );
        }
        //ここまで-------------------------------------

        float rand(vec2 co){
          return fract(sin(dot(co.xy ,vec2(12.9898,78.233))) * 43758.5453);
        }

      varying vec2 v_uv;
      uniform float u_time;
      uniform float u_FixAspect;
      uniform float u_scrollY;
      uniform float u_Y[6];
      uniform int u_id;

      void main() {
        // 余白ができないようにアスペクト補正
        v_uv = uv - .5;
        v_uv.y *= u_FixAspect;
        v_uv += .5;


        vec3 pos = position;
        float freq = 2.0; //振動数
        float amp = 0.6; //振幅

        pos.y *= 0.12; //幅を縮める
        pos.y = amp * snoise(vec3(pos.x, pos.y, u_time));
        
        pos.y += u_Y[u_id];
        pos.y += u_scrollY;
        gl_Position = vec4(pos, 1.0);
      }
      `;
    const fs = `
      varying vec2 v_uv;  
      uniform sampler2D u_tex;
      void main(){
        vec3 color = texture2D(u_tex,v_uv).rgb;
        gl_FragColor = vec4(color, 0.26);
        // gl_FragColor = texture2D(u_tex, v_uv);
      }
      `;

    const geo = new THREE.PlaneBufferGeometry(2, 1, 100, 100);

    var nposY = [-0, -2.0, -3.8, -4.0, -7.0, -10.0];
    if (this.w < 480) {
      nposY = [-1.0, -2.0, -3.5, -3.8, -5.0, -7.0];
    }

    // 波のグループ作成
    this.waves = new THREE.Object3D();
    for (let i = 0; i < 6; i++) {
      const mat = new THREE.ShaderMaterial({
        uniforms: {
          u_time: {
            value: Math.random() * (i + 1 - i) + i, //初期値をランダムに
          },
          u_tex: {
            type: "t",
            value: texture,
          },
          u_FixAspect: {
            value: this.h / this.w, // 逆アスペクト
          },
          u_Y: {
            type: "fv1",
            value: nposY, //一つ一つのY座標（マイナスが下方向）
          },
          u_scrollY: {
            value: this.scrollY,
          },
          u_id: {
            value: i, //シェーダーに渡すID
          },
        },
        vertexShader: vs,
        fragmentShader: fs,
        // wireframe: true,
        side: THREE.DoubleSide,
        transparent: true, //不透明度を扱う
        blending: THREE.NormalBlending,
        alphaTest: 0.2,
      });
      const mesh = new THREE.Mesh(geo, mat);
      this.waves.add(mesh);
    }

    this.scene.add(this.waves);
    this.renderer.render(this.scene, this.camera);

    // 描画ループ開始
    this.render();
  }
  //毎フレーム呼ばれるやつ
  render() {
    // 次のフレームを要求
    requestAnimationFrame(() => {
      this.render();
    });

    for (let i = 0; i < 6; i++) {
      this.waves.children[i].material.uniforms.u_time.value += 0.0008;
    }

    this.renderer.render(this.scene, this.camera);
  }
  scrolled(y) {
    //ここの倍率指定してパララックスとかできる（デフォで0.005くらいじゃないとなぜか速すぎる）
    for (let i = 0; i < 6; i++) {
      this.waves.children[i].material.uniforms.u_scrollY.value = y * 0.002;
    }
  }
  resize() {
    // サイズを取得
    const width = window.innerWidth;
    const height = window.innerHeight;

    // カメラのアスペクト比を正す
    this.camera.aspect = width / height;
    this.camera.updateProjectionMatrix();

    if (width < this.minW) return; //波が縮まりすぎるのでこれらいを最小幅にする

    // レンダラーのサイズを調整する
    this.renderer.setPixelRatio(window.devicePixelRatio); // ピクセル比
    this.renderer.setSize(width, height); // 描画サイズ
  }
}

const canvas = new Canvas();

canvas.resize();
canvas.scrolled(window.scrollY);

window.addEventListener("resize", () => {
  canvas.resize();
});

window.addEventListener("scroll", (e) => {
  canvas.scrolled(window.scrollY);
});
