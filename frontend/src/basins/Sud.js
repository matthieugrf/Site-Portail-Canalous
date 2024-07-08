import React, { useEffect } from 'react';
import { preloadImages } from '../utils/imagePreloader';

const Sud = () => {
  const imageUrl = '/img/cartes_france/4_Sud/';

  useEffect(() => {
    const images = [
      'bassin-saone-rhone.png',
      'embt-beaucaire.png',
      'lot-aval.png',
      'lot-amont.png',
      'canal-rhone-sete.png',
      'canal-midi.png',
      'canal-montech.png',
      'baise.png',
      'bidouze.png',
      'gaves-reunis.png',
      'adour.png',
      'canal-landes.png',
      'garonne.png',
      'canal-garonne.png',
      'embt-sete.png',
      'lez.png',
      'isle.png',
      'etang-thau.png',
      'herault-sud.png',
      'herault-nord.png',
      'canal-robine.png',
      'dordogne.png'
    ].map((img) => imageUrl + img);

    preloadImages(images);
  }, [imageUrl]);

  return (
    <div>
      <h2>Bassin Sud</h2>
      <div style="width:530px; height: 370px; padding: 0; background: url('.$imageUrl.'fond.jpg);">
                  <img src="'.$imageUrl.'fond.jpg" width="530" height="370" border="0" usemap="#map" name="fond" />
<map name="map">
<area shape="poly" coords="501,210,496,217,484,227,488,243,501,243,503,232,503,224,508,219,511,230,518,233,519,236,524,225,526,215,521,202,525,189,529,181,518,178,510,187,508,197,511,200,511,207,501,211" href="?bassin_id=8" rel="" onMouseOut="MM_swapImgRestore()" onMouseOver="MM_swapImage(\'fond\',\'\',\''.$imageUrl.'bassin-saone-rhone.png\',1)" />
<area shape="poly" coords="498,215,490,211,494,203,508,197,512,200,512,208,503,210" href="427"  rel="427" class="voieAppel" onMouseOut="MM_swapImgRestore()" onMouseOver="MM_swapImage(\'fond\',\'\',\''.$imageUrl.'embt-beaucaire.png\',1)" />
<area shape="poly" coords="171,144,173,151,176,152,181,145,186,139,198,138,205,139,214,141,223,133,227,129,236,129,238,119,226,118,221,122,211,128,204,128,197,125,187,125,185,130,177,132,172,136" href="62"  rel="62" class="voieAppel" onMouseOut="MM_swapImgRestore()" onMouseOver="MM_swapImage(\'fond\',\'\',\''.$imageUrl.'lot-aval.png\',1)" />
<area shape="poly" coords="238,120,236,129,247,135,254,135,264,139,273,131,278,132,293,133,302,128,302,122,294,119,289,121,279,124,270,121,262,124,256,123,246,119,240,120" href="61"  rel="61" class="voieAppel" onMouseOut="MM_swapImgRestore()" onMouseOver="MM_swapImage(\'fond\',\'\',\''.$imageUrl.'lot-amont.png\',1)" />
<area shape="poly" coords="446,244,435,239,444,232,449,233,451,230,452,223,471,220,484,214,491,211,498,214,494,221,486,227,473,234,466,229,454,236,448,242" href="66"  rel="66" class="voieAppel" onMouseOut="MM_swapImgRestore()" onMouseOver="MM_swapImage(\'fond\',\'\',\''.$imageUrl.'canal-rhone-sete.png\',1)" />
<area shape="poly" coords="426,246,422,252,417,252,404,250,393,247,388,252,378,251,369,255,365,259,354,258,341,263,334,260,327,260,314,262,297,251,284,249,273,238,267,229,265,223,256,223,258,235,264,243,276,255,286,259,298,264,311,268,324,272,340,271,347,274,361,268,373,270,376,261,380,258,388,261,395,262,404,261,417,259,419,255,425,255,431,251,430,246" href="64"  rel="64" class="voieAppel" onMouseOut="MM_swapImgRestore()" onMouseOver="MM_swapImage(\'fond\',\'\',\''.$imageUrl.'canal-midi.png\',1)" />
<area shape="poly" coords="244,177,248,186,258,182,253,175" href="63"  rel="63" class="voieAppel" onMouseOut="MM_swapImgRestore()" onMouseOver="MM_swapImage(\'fond\',\'\',\''.$imageUrl.'canal-montech.png\',1)" />
<area shape="poly" coords="170,154,178,156,180,162,181,224,173,226,171,222,169,166,168,159" href="60"  rel="60" class="voieAppel" onMouseOut="MM_swapImgRestore()" onMouseOver="MM_swapImage(\'fond\',\'\',\''.$imageUrl.'baise.png\',1)" />
<area shape="poly" coords="52,230,47,235,57,249,65,242,61,238" href="428"  rel="428" class="voieAppel" onMouseOut="MM_swapImgRestore()" onMouseOver="MM_swapImage(\'fond\',\'\',\''.$imageUrl.'bidouze.png\',1)" />
<area shape="poly" coords="50,223,50,229,53,231,62,236,64,227,56,222" href="426"  rel="426" class="voieAppel" onMouseOut="MM_swapImgRestore()" onMouseOver="MM_swapImage(\'fond\',\'\',\''.$imageUrl.'gaves-reunis.png\',1)" />
<area shape="poly" coords="23,227,20,235,30,241,38,239,48,235,52,231,50,222,59,218,63,213,75,211,78,207,85,209,104,208,104,199,87,199,76,195,68,200,67,204,57,204,52,212,44,215,42,220,43,226,40,228,35,227,28,228" href="53" rel="53" class="voieAppel" onMouseOut="MM_swapImgRestore()" onMouseOver="MM_swapImage(\'fond\',\'\',\''.$imageUrl.'adour.png\',1)" />
<area shape="poly" coords="48,128,55,128,55,140,50,140" href="54"  rel="54" class="voieAppel" onMouseOut="MM_swapImgRestore()" onMouseOver="MM_swapImage(\'fond\',\'\',\''.$imageUrl.'canal-landes.png\',1)" />
<area shape="poly" coords="101,64,108,72,108,86,116,96,126,106,129,111,141,113,138,121,124,121,111,106,98,86,99,73" href="58" rel="58" class="voieAppel" onMouseOut="MM_swapImgRestore()" onMouseOver="MM_swapImage(\'fond\',\'\',\''.$imageUrl.'garonne.png\',1)" />
<area shape="poly" coords="62,7,64,14,81,27,92,62,100,70,106,63,98,49,93,17,76,2,66,4" href="57"  rel="57" class="voieAppel" onMouseOut="MM_swapImgRestore()" onMouseOver="MM_swapImage(\'fond\',\'\',\''.$imageUrl.'gironde.png\',1)" />
<area shape="poly" coords="140,113,137,121,161,137,168,157,174,153,179,160,203,164,219,173,229,170,239,183,242,188,246,204,250,212,256,226,257,223,267,223,259,205,251,190,248,185,243,176,233,161,219,163,204,153,176,152,172,149,171,140,171,134,159,121,144,111" href="59"  rel="59" class="voieAppel" onMouseOut="MM_swapImgRestore()" onMouseOver="MM_swapImage(\'fond\',\'\',\''.$imageUrl.'canal-garonne.png\',1)" />
<area shape="poly" coords="445,242,434,239,436,250,446,250" href="586" rel="586" class="voieAppel" onMouseOut="MM_swapImgRestore()" onMouseOver="MM_swapImage(\'fond\',\'\',\''.$imageUrl.'embt-sete.png\',1)" />
<area shape="poly" coords="452,230,448,232,445,232,443,222,450,218" href="570"  rel="570" class="voieAppel" onMouseOut="MM_swapImgRestore()" onMouseOver="MM_swapImage(\'fond\',\'\',\''.$imageUrl.'lez.png\',1)" />
<area shape="poly" coords="134,80,126,76,123,72,131,59,138,59,135,71" href="55" rel="55" class="voieAppel" onMouseOut="MM_swapImgRestore()" onMouseOver="MM_swapImage(\'fond\',\'\',\''.$imageUrl.'isle.png\',1)" />
<area shape="poly" coords="437,238,427,242,423,249,429,253,435,255,439,251,440,248" href="65" rel="65" class="voieAppel" onMouseOut="MM_swapImgRestore()" onMouseOver="MM_swapImage(\'fond\',\'\',\''.$imageUrl.'etang-thau.png\',1)" />
<area shape="poly" coords="417,259,421,263,427,260,427,255,424,254,420,255,417,259" href="67" rel="67" class="voieAppel" onMouseOut="MM_swapImgRestore()" onMouseOver="MM_swapImage(\'fond\',\'\',\''.$imageUrl.'herault-sud.png\',1)" />
<area shape="poly" coords="424,251,420,252,415,252,416,244,424,243,425,247" href="558" rel="558" class="voieAppel" onMouseOut="MM_swapImgRestore()" onMouseOver="MM_swapImage(\'fond\',\'\',\''.$imageUrl.'herault-nord.png\',1)" />
<area shape="poly" coords="377,260,374,265,381,274,382,292,388,299,393,294,391,283,391,271,388,263,381,258,377,260" href="68" rel="68" class="voieAppel" onMouseOut="MM_swapImgRestore()" onMouseOver="MM_swapImage(\'fond\',\'\',\''.$imageUrl.'canal-robine.png\',1)" />
<area shape="poly" coords="104,66,109,71,113,80,123,84,129,88,136,94,146,90,157,92,165,93,170,90,177,87,174,77,165,77,162,81,154,82,148,79,139,82,134,78,123,72,119,69,111,63,106,62" href="56"  rel="56" class="voieAppel" onMouseOut="MM_swapImgRestore()" onMouseOver="MM_swapImage(\'fond\',\'\',\''.$imageUrl.'dordogne.png\',1)" />
</map>
</div>
</div>
  );
};

export default Sud;
