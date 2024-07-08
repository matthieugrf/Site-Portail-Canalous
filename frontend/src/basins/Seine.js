import React, { useEffect } from 'react';
import { preloadImages } from '../utils/imagePreloader';

const Seine = () => {
  const imageUrl = '/img/cartes_france/5_Seine/';

  useEffect(() => {
    const images = [
      'bassin-centre-bourgogne.png',
      'bassin-est.png',
      'bassin-nord.png',
      'canal-oise-aisne.png',
      'canal-st-denis.png',
      'canal-st-martin.png',
      'taute.png',
      'haute-seine.png',
      'canal-tancarville.png',
      'seine-maritime.png',
      'canal-caen.png',
      'aisne.png',
      'canal-lateral-aisne.png',
      'canal-aisne-marne.png',
      'petite-seine-aval.png',
      'petite-seine-amont.png',
      'canal-lateral-marne.png',
      'canal-lateral-oise.png',
      'marne.png',
      'oise.png',
      'ourcq.png',
      'basse-seine.png'
    ].map((img) => imageUrl + img);

    preloadImages(images);
  }, [imageUrl]);

  return (
    <div>
      <h2>Bassin Seine</h2>
      
<div style="width:532px; height: 246px; padding: 0; background: url('.$imageUrl.'fond.jpg) top left no-repeat;">
                  <img src="'.$imageUrl.'fond.jpg" border="0" usemap="#map" name="fond" />
<map name="map">
<area shape="poly" coords="335,223,334,205,346,198,351,204,364,203,364,198,370,196,383,201,391,218,392,244,383,235,381,217,366,205,345,206,342,211,343,229,340,243,335,243,334,229" href="?bassin_id=7" rel="" onMouseOut="MM_swapImgRestore()" onMouseOver="MM_swapImage(\'fond\',\'\',\''.$imageUrl.'bassin-centre-bourgogne.png\',1)" />
<area shape="poly" coords="444,62,451,69,460,59,481,63,487,59,469,51,457,49,448,57" href="?bassin_id=6" rel="" onMouseOut="MM_swapImgRestore()" onMouseOver="MM_swapImage(\'fond\',\'\',\''.$imageUrl.'bassin-est.png\',1)" />
<area shape="poly" coords="360,54,354,52,355,45,350,26,353,13,360,18,366,24,381,14,385,16,383,25,394,20,397,23,392,38,388,44,377,50,370,45,379,40,372,33,359,33,362,45" href="?bassin_id=1"  rel="" onMouseOut="MM_swapImgRestore()" onMouseOver="MM_swapImage(\'fond\',\'\',\''.$imageUrl.'bassin-nord.png\',1)" />
<area shape="poly" coords="374,48,370,54,381,67,398,65,407,71,418,73,405,59,396,55,386,57,379,49" href="77"  rel="77" class="voieAppel" onMouseOut="MM_swapImgRestore()" onMouseOver="MM_swapImage(\'fond\',\'\',\''.$imageUrl.'canal-oise-aisne.png\',1)" />

<area shape="poly" coords="309,127,306,134,308,139" href="79"  rel="79" class="voieAppel" onMouseOut="MM_swapImgRestore()" onMouseOver="MM_swapImage(\'fond\',\'\',\''.$imageUrl.'canal-st-denis.png\',1)" />
<area shape="poly" coords="308,139,315,141,314,132" href="80"  rel="80" class="voieAppel" onMouseOut="MM_swapImgRestore()" onMouseOver="MM_swapImage(\'fond\',\'\',\''.$imageUrl.'canal-st-martin.png\',1)" />

<area shape="poly" coords="29,78,21,72,17,79,13,94,21,95" href="44"  rel="44" class="voieAppel" onMouseOut="MM_swapImgRestore()" onMouseOver="MM_swapImage(\'fond\',\'\',\''.$imageUrl.'taute.png\',1)" />
<area shape="poly" coords="314,139,308,144,310,165,321,180,331,183,338,187,345,199,352,203,351,192,345,184,335,173,319,161" href="83"  rel="83" class="voieAppel" onMouseOut="MM_swapImgRestore()" onMouseOver="MM_swapImage(\'fond\',\'\',\''.$imageUrl.'haute-seine.png\',1)" />
<area shape="poly" coords="162,62,149,64,134,64,122,63,121,55,141,54,151,57" href="86"  rel="86" class="voieAppel" onMouseOut="MM_swapImgRestore()" onMouseOver="MM_swapImage(\'fond\',\'\',\''.$imageUrl.'canal-tancarville.png\',1)" />
<area shape="poly" coords="142,65,162,62,166,63,173,54,180,53,187,62,194,60,198,64,209,63,204,71,203,76,193,84,189,78,181,77,179,73,176,63,169,73,159,69,141,71" href="85"  rel="85" class="voieAppel" onMouseOut="MM_swapImgRestore()" onMouseOver="MM_swapImage(\'fond\',\'\',\''.$imageUrl.'seine-maritime.png\',1)" />
<area shape="poly" coords="93,83,99,82,101,88,91,103,84,99" href="87"  rel="87" class="voieAppel" onMouseOut="MM_swapImgRestore()" onMouseOver="MM_swapImage(\'fond\',\'\',\''.$imageUrl.'canal-caen.png\',1)" />
<area shape="poly" coords="352,64,348,71,355,74,372,75,388,77,396,76,390,69,374,67,352,64" href="70"  rel="70" class="voieAppel" onMouseOut="MM_swapImgRestore()" onMouseOver="MM_swapImage(\'fond\',\'\',\''.$imageUrl.'aisne.png\',1)" />
<area shape="poly" coords="392,69,394,76,418,79,431,73,435,72,452,69,443,63,424,67,418,72,408,71,401,67" href="69"  rel="69" class="voieAppel" onMouseOut="MM_swapImgRestore()" onMouseOver="MM_swapImage(\'fond\',\'\',\''.$imageUrl.'canal-lateral-aisne.png\',1)" />
<area shape="poly" coords="427,75,437,71,444,78,447,86,463,100,464,109,461,114,451,110,454,104,436,88" href="71" rel="71" class="voieAppel" onMouseOut="MM_swapImgRestore()" onMouseOver="MM_swapImage(\'fond\',\'\',\''.$imageUrl.'canal-aisne-marne.png\',1)" />
<area shape="poly" coords="350,191,352,203,371,196,391,192,401,184,396,179,378,187,358,192" href="82" rel="82" class="voieAppel" onMouseOut="MM_swapImgRestore()" onMouseOver="MM_swapImage(\'fond\',\'\',\''.$imageUrl.'petite-seine-aval.png\',1)" />
<area shape="poly" coords="396,178,400,186,410,181,424,176,424,167,406,172" href="81" rel="81" class="voieAppel" onMouseOut="MM_swapImgRestore()" onMouseOver="MM_swapImage(\'fond\',\'\',\''.$imageUrl.'petite-seine-amont.png\',1)" />
<area shape="poly" coords="431,106,429,114,443,117,455,118,468,127,491,152,492,139,472,119,462,113,449,109" href="72" rel="72" class="voieAppel" onMouseOut="MM_swapImgRestore()" onMouseOver="MM_swapImage(\'fond\',\'\',\''.$imageUrl.'canal-lateral-marne.png\',1)" />
<area shape="poly" coords="314,139,316,148,322,149,325,142,347,139,354,133,361,130,382,130,389,129,397,118,404,114,417,112,430,114,432,106,417,103,398,107,387,114,384,120,373,116,363,117,356,119,353,126,347,126,339,131,321,136" href="73" rel="73" class="voieAppel" onMouseOut="MM_swapImgRestore()" onMouseOver="MM_swapImage(\'fond\',\'\',\''.$imageUrl.'marne.png\',1)" />
<area shape="poly" coords="350,67,343,63,354,52,361,49,371,45,375,48,370,54,362,56" href="74"  rel="74" class="voieAppel" onMouseOut="MM_swapImgRestore()" onMouseOver="MM_swapImage(\'fond\',\'\',\''.$imageUrl.'canal-lateral-oise.png\',1)" />
<area shape="poly" coords="314,132,329,122,339,123,352,115,359,112,364,100,373,93,377,100,370,108,367,117,360,118,355,122,352,126,340,129,330,131,314,141" href="78"  rel="78" class="voieAppel" onMouseOut="MM_swapImgRestore()" onMouseOver="MM_swapImage(\'fond\',\'\',\''.$imageUrl.'ourcq.png\',1)" />
<area shape="poly" coords="290,120,286,120,283,126,274,116,283,108,291,107,298,99,305,97,319,81,335,76,344,62,350,67,349,73,342,84,327,88,309,107,302,109" href="76" rel="76" class="voieAppel" onMouseOut="MM_swapImgRestore()" onMouseOver="MM_swapImage(\'fond\',\'\',\''.$imageUrl.'oise.png\',1)" />
<area shape="poly" coords="209,62,212,65,212,80,222,86,223,90,231,89,234,93,233,99,243,110,248,105,256,108,258,114,257,119,262,122,272,118,275,117,284,125,291,119,297,120,298,125,307,125,309,128,306,134,308,140,309,146,296,150,295,142,286,142,283,135,281,134,274,134,272,128,266,129,258,131,253,127,244,123,224,104,221,100,214,100,212,90,207,90,194,93,191,85,194,83,202,77,204,62" href="84" rel="84" class="voieAppel" onMouseOut="MM_swapImgRestore()" onMouseOver="MM_swapImage(\'fond\',\'\',\''.$imageUrl.'basse-seine.png\',1)" />
</map>
</div>
</div>
  );
};

export default Seine;
