// Develop the function to find out Volume Area High, Volume Area Low and all POC's for Volume Profile.
// The example of volume profile is the array of arrays such as [price, BID volume, ASK volume]

// http://joxi.ru/zANvzYMC6yk9PA bid-ask
// http://joxi.ru/1A5VKxLTGJXdYr delta
// http://joxi.ru/eAOvzYECpD53B2 volume
const percent = 70;
const volumeProfile = [
  [26.66, 0, 1],
  [26.65, 0, 29],
  [26.64, 15, 34],
  [26.63, 14, 46],
  [26.62, 32, 27],
  [26.61, 7, 6],
  [26.60, 4, 13],
  [26.59, 25, 16],
  [26.58, 27, 73],
  [26.57, 106, 132],
  [26.56, 105, 98],
  [26.55, 115, 98],
  [26.54, 98, 81],
  [26.53, 83, 30],
  [26.52, 25, 0],
];

function solution(vp, volumeAreaPercent) {
  //vp = vp.map((level, id) => [...level, level[1] + level[2], id]);
  //console.log(vp);
  const POC = vp
    .map((level, id) => [...level, level[1] + level[2], id])
    .sort((a, b) => b[3] - a[3])
    .filter((a, i, ar) => a[3] === ar[0][3])
    .sort((a, b) => a[4] - b[4]);
  console.log(POC)
  const DELTA = vp
    .map((level, id) => [...level, level[2] - level[1], id])
    .sort((a, b) => Math.abs(b[3]) - Math.abs(a[3]));

  const barVolume = vp.reduce((s, c) => (s += c[1] + c[2]), 0);

  const volumeArea = Math.round(volumeAreaPercent * (barVolume / 100));
  //console.log(DELTA[0]);
  let calcVolumeArea = 0,
    vahIndex = 0,
    valIndex = 0;

  if (POC.length === 1) {
    vahIndex = POC[0][4];
    valIndex = POC[0][4];
    calcVolumeArea = POC[0][3];
  } else {
    vahIndex = POC[0][4];
    valIndex = POC[POC.length - 1][4];
    calcVolumeArea = vp
      .filter((a, i, ar) => a[0] <= POC[0][0] && a[0] >= POC[POC.length - 1][0])
      .reduce((s, c) => (s += c[1] + c[2]), 0);
  }

  const compareVolumes = (vah, val) => {
    if (vah > val) {
      calcVolumeArea += vah;
      //if (calcVolumeArea < volumeArea) vahIndex--;
      vahIndex--;
    } else if (vah < val) {
      calcVolumeArea += val;
      //if (calcVolumeArea < volumeArea) valIndex++;
      valIndex++;
    } else {
      calcVolumeArea += vah;
      if (calcVolumeArea < volumeArea) vahIndex--;

      calcVolumeArea += val;
      if (calcVolumeArea < volumeArea) vahIndex++;
    }
  };

  vp.forEach((el, index, ar) => {
    if (calcVolumeArea < volumeArea) {
      const volVah =
        vahIndex - 1 >= 0 ? ar[vahIndex - 1][1] + ar[vahIndex - 1][2] : 0;
      const volVal =
        valIndex + 1 < ar.length
          ? ar[valIndex + 1][1] + ar[valIndex + 1][2]
          : 0;
      // console.log(
      //   `=== start ${index} ===\nvahIndex: ${vahIndex} valIndex: ${valIndex}\nvolVah: ${volVah}  volVal: ${volVal}`
      // );

      compareVolumes(volVah, volVal);
      // console.log(
      //   `=== ${index} end ===\ncalcVolumeArea: ${calcVolumeArea}\nvahIndex: ${vahIndex} valIndex: ${valIndex}\nvolVah: ${volVah}  volVal: ${volVal}`
      // );
    }
  });

  const pocPrice = POC.length === 1 ? POC[0][0] : POC.map(el => el[0]);
  const pocValue = POC.length === 1 ? POC[0][3] : POC.map(el => el[3]);
  return {
    vah: {price: vp[vahIndex][0], value: vp[vahIndex][2] + vp[vahIndex][1]},
    val: {price: vp[valIndex][0], value: vp[valIndex][2] + vp[valIndex][1]},
    poc: {price: pocPrice, value: pocValue},
    delta: {price: DELTA[0][0], value: DELTA[0][3]}
  };
}

console.log(solution(volumeProfile, percent));
