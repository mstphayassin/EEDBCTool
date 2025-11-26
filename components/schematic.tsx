import Canvas from "./utils/canvas";

export default function DamSchematic({
  heightOfWater,
  depthOfBreach,
  heightOfDam,
  averageWidth,
  volumeOfWater,
}: {
  heightOfWater: string;
  depthOfBreach: string;
  heightOfDam: string;
  averageWidth: string;
  volumeOfWater: string;
}) {
  let h_w = Number(heightOfWater?.replace(/,/g, ""));
  let v_w = Number(volumeOfWater?.replace(/,/g, ""));
  let h_b = Number(depthOfBreach?.replace(/,/g, ""));
  let h_d = Number(heightOfDam?.replace(/,/g, ""));
  let w_avg = Number(averageWidth?.replace(/,/g, ""));

  let assumedHb = false;
  let assumedHd = false;
  let assumedWavg = false;

  if (!h_w || !v_w) {
    return (
      <div className="result-container text-center border-1 border-white rounded-xl p-5 place-content-center text-orange-600 text-2xl">
        There's a problem with the input.
      </div>
    );
  }

  if (!h_b) {
    h_b = h_w;
    assumedHb = true;
  }

  if (!h_d) {
    h_d = h_w;
    assumedHd = true;
  }

  if (!w_avg) {
    w_avg = h_d * 2.6;
    assumedWavg = true;
  }
  const draw = (ctx: CanvasRenderingContext2D) => {
    if (ctx) {
      let wMax = ctx.canvas.width;
      let hMax = ctx.canvas.height;

      let crestY = hMax / 4;
      let baseY = (hMax * 3) / 4;
      let breachY = hMax / 2;
      let waterY = hMax / 4;
      let leftCrestX = (wMax * 2) / 5;
      let rightCrestX = (wMax * 3) / 5;
      let leftToeX = wMax / 5;
      let rightToeX = (wMax * 4) / 5;

      ctx.beginPath();
      ctx.strokeStyle = "white";
      ctx.lineWidth = 1;

      // 2D dam shape
      ctx.moveTo(0, baseY);
      ctx.lineTo(leftToeX, baseY);
      ctx.lineTo(leftCrestX, crestY);
      ctx.lineTo(rightCrestX, crestY);
      ctx.lineTo(rightToeX, baseY);
      ctx.lineTo(wMax, baseY);
      ctx.stroke();

      // Add 3D effects
      const length3d = 50;
      const ratio3d = 6;
      ctx.beginPath();
      ctx.moveTo(leftCrestX, crestY);
      ctx.lineTo(leftCrestX + length3d * ratio3d, crestY - length3d);
      ctx.moveTo(rightCrestX, crestY);
      ctx.lineTo(rightCrestX + length3d * ratio3d, crestY - length3d);
      ctx.moveTo(rightToeX, baseY);
      ctx.lineTo(rightToeX + length3d * ratio3d, baseY - length3d);
      ctx.stroke();

      // Water height
      ctx.lineWidth = 2;
      ctx.strokeStyle = "#ff6900";
      ctx.beginPath();
      ctx.moveTo(0, waterY);
      ctx.lineTo(leftCrestX, waterY)
      ctx.stroke();

      // Breach height
      ctx.setLineDash([10, 10]);
      ctx.beginPath();
      ctx.moveTo(0, breachY);
      ctx.lineTo(rightCrestX + breachY, breachY);
      ctx.stroke();
      
      // Add dimensions
      ctx.lineWidth = 2;
      ctx.strokeStyle = "white";
      ctx.setLineDash([]);
      drawDimension(ctx, "H_d", leftToeX - 15, baseY, leftToeX - 15, crestY);
      drawDimension(ctx, "H_w", leftToeX - 35, breachY, leftToeX - 35, waterY);
      drawDimension(ctx, "H_b", leftToeX - 55, crestY, leftToeX - 55, breachY);
    }
  };
  return (
    <div className="flex justify-center">
      <Canvas width={400} height={200} draw={draw} />
    </div>
  );
}

function drawDoubleArrow(
  ctx: CanvasRenderingContext2D,
  x1: number,
  y1: number,
  x2: number,
  y2: number
) {
  const tipLength = 7;
  let dx = x2 - x1;
  let dy = y2 - y1;
  let tipRatio = tipLength / (dx ** 2 + dy ** 2) ** 0.5;
  let arrowTipDir1 = [
    (dx * 3 ** 0.5) / 2 + dy / 2,
    (dx * -1) / 2 + (dy * 3 ** 0.5) / 2,
  ];
  let arrowTipDir2 = [
    (dx * 3 ** 0.5) / 2 - dy / 2,
    dx / 2 + (dy * 3 ** 0.5) / 2,
  ];
  ctx.beginPath();
  ctx.moveTo(x1, y1);
  ctx.lineTo(x1 + arrowTipDir1[0] * tipRatio, y1 + arrowTipDir1[1] * tipRatio);
  ctx.moveTo(x1, y1);
  ctx.lineTo(x1 + arrowTipDir2[0] * tipRatio, y1 + arrowTipDir2[1] * tipRatio);

  ctx.moveTo(x1, y1);
  ctx.lineTo(x2, y2);
  ctx.lineTo(x2 - arrowTipDir1[0] * tipRatio, y2 - arrowTipDir1[1] * tipRatio);
  ctx.moveTo(x2, y2);
  ctx.lineTo(x2 - arrowTipDir2[0] * tipRatio, y2 - arrowTipDir2[1] * tipRatio);
  ctx.stroke();
}

function drawDimension(
  ctx: CanvasRenderingContext2D,
  dimensionName: string,
  x1: number,
  y1: number,
  x2: number,
  y2: number
) {
  return drawDoubleArrow(ctx, x1, y1, x2, y2);
}
