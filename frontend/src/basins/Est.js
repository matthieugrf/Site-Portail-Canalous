import React, { useEffect } from 'react';
import { preloadImages } from '../utils/imagePreloader';

const Est = () => {
  const imageUrl = '/img/cartes_france/6_Est/';

  useEffect(() => {
    const images = [
      'canal-rhone-rhin-sud.png',
      'canal-rhone-rhin-nord.png',
      'meuse.png',
      'bassin-nord.png',
      'moyenne-basse-meuse.png',
      'haute-meuse.png',
      'vouziers.png',
      'canal-ardennes.png',
      'moselle.png',
      'canal-sarre.png',
      'canal-champagne-bourgogne.png',
      'canal-marne-rhin-ouest.png',
      'canal-marne-rhin-est.png',
      'canal-vosges.png',
      'canal-nancy.png',
      'canal-colmar.png',
      'rhin.png',
      'petite-saone.png',
      'embt-epinal.png',
      'embt-belfort.png',
      'bassin-saone-rhone.png',
      'bassin-centre-bourgogne.png',
      'bassin-seine.png'
    ].map((img) => imageUrl + img);

    preloadImages(images);
  }, [imageUrl]);

  return (
    <div>
      <h2>Bassin Est</h2>
      <div style="width: 436px; height: 525px; padding: 0; background: url('.$imageUrl.'fond.jpg) top left no-repeat;">
                  <img src="'.$imageUrl.'fond.jpg" width="436" height="525" border="0" usemap="#map" name="fond" />

<map name="map">
<area shape="poly" coords="350,391,340,387,339,377,331,391,311,399,297,415,281,425,272,429,257,441,241,449,225,457,215,469,204,469,189,473,169,484,159,476,164,470,171,475,184,464,204,459,229,444,269,422,293,410,300,402,308,392,325,385,336,367,345,371" href="99" rel="99" class="voieAppel" onMouseOut="MM_swapImgRestore()" onMouseOver="MM_swapImage(\'fond\',\'\',\''.$imageUrl.'canal-rhone-rhin-sud.png\',1)" />
<area shape="poly" coords="358,268,365,270,360,301,359,309,353,304,354,294,356,276" href="100"  rel="100" class="voieAppel" onMouseOut="MM_swapImgRestore()" onMouseOver="MM_swapImage(\'fond\',\'\',\''.$imageUrl.'canal-rhone-rhin-nord.png\',1)" />
<area shape="poly" coords="97,72,105,76,102,85,96,89,97,92,100,98,94,106,100,117,98,125,103,134,115,129,121,136,130,152,138,157,139,169,140,178,151,190,159,208,172,239,171,245,186,264,176,265,160,243,162,236,154,223,141,195,131,178,130,162,121,159,121,152,111,138,103,141,94,138,87,121,87,113,81,113,82,101,89,98,90,83" href="90"  rel="90" class="voieAppel" onMouseOut="MM_swapImgRestore()" onMouseOver="MM_swapImage(\'fond\',\'\',\''.$imageUrl.'meuse.png\',1)" />
<area shape="poly" coords="101,34,101,45,63,52,48,60,30,67,32,55,33,36,46,11,70,33" href="?bassin_id=1"  rel="" onMouseOut="MM_swapImgRestore()" onMouseOver="MM_swapImage(\'fond\',\'\',\''.$imageUrl.'bassin-nord.png\',1)" />
<area shape="poly" coords="102,33,102,43,142,29,171,12,171,3,139,19,102,34" href="126"  rel="126" class="voieAppel" onMouseOut="MM_swapImgRestore()" onMouseOver="MM_swapImage(\'fond\',\'\',\''.$imageUrl.'moyenne-basse-meuse.png\',1)" />
<area shape="poly" coords="99,44,108,41,110,63,105,78,98,72,102,63,99,43" href="125"  rel="125" class="voieAppel" onMouseOut="MM_swapImgRestore()" onMouseOver="MM_swapImage(\'fond\',\'\',\''.$imageUrl.'haute-meuse.png\',1)" />
<area shape="poly" coords="83,169,91,167,97,179,90,182" href="95s"  rel="95" class="voieAppel" onMouseOut="MM_swapImgRestore()" onMouseOver="MM_swapImage(\'fond\',\'\',\''.$imageUrl.'vouziers.png\',1)" />
<area shape="poly" coords="97,138,105,141,107,143,103,165,91,168,82,168,73,171,53,166,36,180,29,179,49,157,60,157,71,163,83,163,89,159,97,159,98,146" href="96"  rel="96" class="voieAppel" onMouseOut="MM_swapImgRestore()" onMouseOver="MM_swapImage(\'fond\',\'\',\''.$imageUrl.'canal-ardennes.png\',1)" />
<area shape="poly" coords="223,272,223,281,213,276,210,273,201,273,198,265,205,252,217,252,215,247,208,230,211,212,221,204,216,187,219,173,234,161,230,153,234,138,242,127,251,127,246,134,243,137,241,143,237,151,241,164,225,179,224,189,228,208,220,216,216,230,223,245,222,258,219,259,211,258,207,265,216,264" href="101"  rel="101" class="voieAppel" onMouseOut="MM_swapImgRestore()" onMouseOver="MM_swapImage(\'fond\',\'\',\''.$imageUrl.'moselle.png\',1)" />
<area shape="poly" coords="252,126,246,136,246,146,250,153,250,162,259,173,269,190,280,197,291,196,298,212,293,215,291,226,286,238,288,251,286,258,293,258,296,251,294,238,306,213,305,207,295,189,279,188,265,169,258,157,257,146,255,143" href="97"  rel="97" class="voieAppel" onMouseOut="MM_swapImgRestore()" onMouseOver="MM_swapImage(\'fond\',\'\',\''.$imageUrl.'canal-sarre.png\',1)" />
<area shape="poly" coords="84,269,94,265,102,269,124,270,138,284,144,298,142,333,156,352,165,370,164,387,162,392,164,401,171,414,170,422,166,429,171,441,164,446,156,430,162,415,154,405,152,386,155,374,147,358,132,334,135,300,125,285,118,279,93,277" href="91"  rel="91" class="voieAppel" onMouseOut="MM_swapImgRestore()" onMouseOver="MM_swapImage(\'fond\',\'\',\''.$imageUrl.'canal-champagne-bourgogne.png\',1)" />
<area shape="poly" coords="96,266,89,266,88,261,102,256,123,250,137,252,167,277,170,275,171,266,176,265,187,264,199,263,201,273,182,271,171,287,154,280,131,260,122,257,109,263" href="92"  rel="92" class="voieAppel" onMouseOut="MM_swapImgRestore()" onMouseOver="MM_swapImage(\'fond\',\'\',\''.$imageUrl.'canal-marne-rhin-ouest.png\',1)" />
<area shape="poly" coords="223,252,219,260,226,270,244,275,274,264,298,265,326,256,350,254,358,267,366,270,368,260,353,245,334,245,307,249,293,258,286,257,272,256,267,256,240,268,233,264" href="93"  rel="93" class="voieAppel" onMouseOut="MM_swapImgRestore()" onMouseOver="MM_swapImage(\'fond\',\'\',\''.$imageUrl.'canal-marne-rhin-est.png\',1)" />
<area shape="poly" coords="222,281,224,275,232,278,239,286,238,299,249,308,252,321,249,327,246,331,244,343,235,357,221,361,216,355,228,350,235,338,237,326,244,321,237,310,227,301,228,287" href="98"  rel="98" class="voieAppel" onMouseOut="MM_swapImgRestore()" onMouseOver="MM_swapImage(\'fond\',\'\',\''.$imageUrl.'canal-vosges.png\',1)" />
<area shape="poly" coords="237,273,231,278,222,277,221,271,225,267,230,269" href="94"  rel="94" class="voieAppel" onMouseOut="MM_swapImgRestore()" onMouseOver="MM_swapImage(\'fond\',\'\',\''.$imageUrl.'canal-nancy.png\',1)" />
<area shape="poly" coords="331,327,331,337,342,334,353,351,354,341,344,323" href="89"  rel="89" class="voieAppel" onMouseOut="MM_swapImgRestore()" onMouseOver="MM_swapImage(\'fond\',\'\',\''.$imageUrl.'canal-colmar.png\',1)" />
<area shape="poly" coords="396,213,402,218,397,224,393,240,372,266,372,280,362,317,356,333,360,340,358,353,354,359,355,370,354,385,362,396,357,402,349,390,346,373,348,351,353,348,354,340,350,302,359,305,365,268,369,260,387,232,392,216" href="103"  rel="103" class="voieAppel" onMouseOut="MM_swapImgRestore()" onMouseOver="MM_swapImage(\'fond\',\'\',\''.$imageUrl.'rhin.png\',1)" />
<area shape="poly" coords="215,355,222,362,215,374,223,380,224,400,205,413,199,413,196,421,190,428,177,444,171,450,165,472,158,467,164,446,171,440,177,426,187,416,196,405,216,393,213,381,204,373,214,357" href="102"  rel="102" class="voieAppel" onMouseOut="MM_swapImgRestore()" onMouseOver="MM_swapImage(\'fond\',\'\',\''.$imageUrl.'petite-saone.png\',1)" />
<area shape="poly" coords="251,318,248,327,252,339,259,328" href="630"  rel="630" class="voieAppel" onMouseOut="MM_swapImgRestore()" onMouseOver="MM_swapImage(\'fond\',\'\',\''.$imageUrl.'embt-epinal.png\',1)" />
<area shape="poly" coords="300,403,291,411,289,395,296,391" href="88"  rel="88" class="voieAppel" onMouseOut="MM_swapImgRestore()" onMouseOver="MM_swapImage(\'fond\',\'\',\''.$imageUrl.'embt-belfort.png\',1)" />
<area shape="poly" coords="158,467,164,471,159,476,151,480,147,496,146,512,134,513,125,518,120,508,126,498,139,490,139,480,152,471" href="?bassin_id=8"  rel="" onMouseOut="MM_swapImgRestore()" onMouseOver="MM_swapImage(\'fond\',\'\',\''.$imageUrl.'bassin-saone-rhone.png\',1)" />
<area shape="poly" coords="156,467,145,475,128,449,121,450,113,458,106,472,98,474,92,464,78,450,69,430,72,423,57,407,57,395,45,393,32,370,46,372,54,384,63,389,68,405,83,421,81,435,86,445,102,463,107,449,117,442,135,441,145,458" href="?bassin_id=7"  rel="" onMouseOut="MM_swapImgRestore()" onMouseOver="MM_swapImage(\'fond\',\'\',\''.$imageUrl.'bassin-centre-bourgogne.png\',1)" />
<area shape="poly" coords="90,259,89,267,83,271,73,252,60,237,46,229,29,227,30,218,45,218,48,213,31,201,31,188,44,199,59,213,56,224,69,232,84,250" href="?bassin_id=5"  rel="" onMouseOut="MM_swapImgRestore()" onMouseOver="MM_swapImage(\'fond\',\'\',\''.$imageUrl.'bassin-seine.png\',1)" />
</map>
</div>
</div>
  );
};

export default Est;
