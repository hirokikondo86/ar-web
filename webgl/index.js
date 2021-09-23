const createShader = (gl, type, source) => {
  // シェーダーを作成
  const shader = gl.createShader(type);
  // GLSL のコードを GPU にアップロード
  gl.shaderSource(shader, source);
  // シェーダーをコンパイル
  gl.compileShader(shader);
  // 成功かどうかチェック
  const success = gl.getShaderParameter(shader, gl.COMPILE_STATUS);
  if (success) {
    return shader;
  }

  // エラーを表示
  console.log(gl.getShaderInfoLog(shader));
  // シェーダーを削除
  gl.deleteShader(shader);
};

const createProgram = (gl, vertexShader, fragmentShader) => {
  // プログラムを作成
  const program = gl.createProgram();
  // プログラムに頂点シェーダーを付ける
  gl.attachShader(program, vertexShader);
  // プログラムにフラグメントシェーダーを付ける
  gl.attachShader(program, fragmentShader);
  // プログラムをリンクする
  gl.linkProgram(program);
  const success = gl.getProgramParameter(program, gl.LINK_STATUS);
  if (success) {
    return program;
  }

  console.log(gl.getProgramInfoLog(program));
  gl.deleteProgram(program);
};

const main = () => {
  // WebGL context を取得
  const canvas = document.querySelector("#c");
  const gl = canvas.getContext("webgl");
  if (!gl) {
    return;
  }

  // GLSLを 取得
  const vertexShaderSource = document.querySelector("#vertexShader2d").text;
  const fragmentShaderSource = document.querySelector("#fragmentShader2d").text;

  // GLSL shaders を作成, GLSL コードをアップロード, シェーダーをコンパイル
  const vertexShader = createShader(gl, gl.VERTEX_SHADER, vertexShaderSource);
  const fragmentShader = createShader(
    gl,
    gl.FRAGMENT_SHADER,
    fragmentShaderSource
  );

  // プログラムに二つのシェーダーをリンク
  const program = createProgram(gl, vertexShader, fragmentShader);

  // 属性のロケーションを取得
  const positionAttributeLocation = gl.getAttribLocation(program, "a_position");

  // バッファーを作成
  const positionBuffer = gl.createBuffer();

  // ARRAY_BUFFER (WebGLのグローバル変数みたいな結び点) に positionBuffer をバインド (think of it as ARRAY_BUFFER = positionBuffer)
  gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);

  const positions = [0, 0, 0, 0.5, 0.7, 0];
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(positions), gl.STATIC_DRAW);

  // 以上が初期化処理
  // 以下が描画処理

  webglUtils.resizeCanvasToDisplaySize(gl.canvas);

  // クリップ空間上の値である gl_Position を、画面空間上のピクセルにどうやって変換するのか WebGL に教える
  gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);

  // キャンバスをクリアする
  gl.clearColor(0, 0, 0, 0);
  gl.clear(gl.COLOR_BUFFER_BIT);

  // 作成したプログラム（シェーダー2つ）を設定する
  gl.useProgram(program);

  // 属性をオンにする
  gl.enableVertexAttribArray(positionAttributeLocation);

  // positionBuffer を ARRAY_BUFFER に結び付ける
  gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);

  // どうやって positionBuffer（ARRAY_BUFFER)から属性にデータを取り込むか。
  const size = 2; // 呼び出すごとに2つの数値
  const type = gl.FLOAT; // データは32ビットの数値
  const normalize = false; // データを normalize しない
  const stride = 0; // シェーダーを呼び出すごとに進む距離 (0 = size * sizeof(type))
  const offset = 0; // バッファーの頭から取り始める
  gl.vertexAttribPointer(
    positionAttributeLocation,
    size,
    type,
    normalize,
    stride,
    offset
  );

  // 描画
  const primitiveType = gl.TRIANGLES;
  const offset2 = 0;
  const count = 3;
  gl.drawArrays(primitiveType, offset2, count);
};

main();
