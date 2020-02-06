// Develop the function to find out Volume Area High, Volume Area Low and all POC's for Volume Profile.
// The example of volume profile is the array of arrays such as [price, BID volume, ASK volume]

// http://joxi.ru/zANvzYMC6yk9PA bid-ask
// http://joxi.ru/1A5VKxLTGJXdYr delta
// http://joxi.ru/eAOvzYECpD53B2 volume
const percent = 70;
const volumeProfile = [
  [1558.1, 9, 10],
  [1558.0, 0, 36],
  [1557.9, 2, 17],
  [1557.8, 23, 28],
  [1557.7, 42, 73],
  [1557.6, 41, 31],
  [1557.5, 8, 94],
  [1557.4, 35, 27],
  [1557.3, 2, 13],
  [1557.2, 8, 40],
  [1557.1, 31, 28],
  [1557.0, 9, 57],
  [1556.9, 36, 61],
  [1556.8, 127, 127],
  [1556.7, 131, 107],
  [1556.6, 113, 109],
  [1556.5, 124, 107],
  [1556.4, 50, 55],
  [1556.3, 34, 20],
  [1556.2, 41, 35],
  [1556.1, 53, 12],
  [1556.0, 8, 0]
];

function solution(vp, volumeAreaPercent) {
  //vp = vp.map((level, id) => [...level, level[1] + level[2], id]);
  //console.log(vp);
  const POC = vp
    .map((level, id) => [...level, level[1] + level[2], id])
    .sort((a, b) => b[3] - a[3])
    .filter((a, i, ar) => a[3] === ar[0][3])
    .sort((a, b) => a[4] - b[4]);

  const DELTA = vp
    .map((level, id) => [...level, level[2] - level[1], id])
    .sort((a, b) => Math.abs(b[3]) - Math.abs(a[3]));

  const barVolume = vp.reduce((s, c) => (s += c[1] + c[2]), 0);

  const volumeArea = Math.round(volumeAreaPercent * (barVolume / 100));
  console.log(DELTA[0]);
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
      if (calcVolumeArea < volumeArea) vahIndex--;
    } else if (vah < val) {
      calcVolumeArea += val;
      if (calcVolumeArea < volumeArea) valIndex++;
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

  return {
    VAH: vp[vahIndex][0],
    VAL: vp[valIndex][0],
    POC: POC.length === 1 ? POC[0][0] : POC.map(el => el[0]),
    DELTA: DELTA[0][3]
  };
}

console.log(solution(volumeProfile, percent));
