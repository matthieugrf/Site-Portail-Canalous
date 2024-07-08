import React, { useEffect } from 'react';
import { preloadImages } from '../utils/imagePreloader';

const Ouest = () => {
  const imageUrl = '/img/cartes_france/2_Ouest/';

  useEffect(() => {
    const images = [
      'aulne.png',
      'canal-nantes-brest-ouest.png',
      'canal-nantes-brest-centre.png',
      'canal-nantes-brest-est.png',
      'sarthe.png',
      'mayenne.png',
      'oudon.png',
      'maine.png',
      'loire-maritime.png',
      'loire.png',
      'sevre-nantaise.png',
      'petite-maine.png',
      'erdre.png',
      'vilaine-amont.png',
      'vilaine-aval.png',
      'aff.png',
      'blavet.png',
      'rance.png',
      'canal-ille-rance.png',
      'lac-guerledan.png'
    ].map((img) => imageUrl + img);

    preloadImages(images);
  }, [imageUrl]);

  return (
    <div>
      <h2>Bassin Ouest</h2>
      
<div style="width: 500px; height: 303px; padding: 0; background: url('.$imageUrl.'fond.jpg);">
                  <img src="'.$imageUrl.'fond.jpg" width="500" height="303" border="0" usemap="#map" name="fond" />


<map name="map">
<area shape="poly" coords="77,95,92,102,87,117,71,104" href="26" rel="26" class="voieAppel" onMouseOut="MM_swapImgRestore()" onMouseOver="MM_swapImage(\'fond\',\'\',\''.$imageUrl.'aulne.png\',1)" />
<area shape="poly" coords="94,102,108,103,136,98,136,104,115,115,104,118,87,112,91,103" href="27" rel="27" class="voieAppel" onMouseOut="MM_swapImgRestore()" onMouseOver="MM_swapImage(\'fond\',\'\',\''.$imageUrl.'canal-nantes-brest-ouest.png\',1)" />
<area shape="poly" coords="181,131,186,134,193,130,238,179,253,188,253,178,243,172,231,153,210,137,197,123,186,123,183,127" href="29"  rel="29" class="voieAppel" onMouseOut="MM_swapImgRestore()" onMouseOver="MM_swapImage(\'fond\',\'\',\''.$imageUrl.'canal-nantes-brest-centre.png\',1)" />
<area shape="poly" coords="262,192,256,195,271,215,299,220,304,227,306,220,301,213,276,209,263,191" href="539" rel="539" class="voieAppel" onMouseOut="MM_swapImgRestore()" onMouseOver="MM_swapImage(\'fond\',\'\',\''.$imageUrl.'canal-nantes-brest-est.png\',1)" />
<area shape="poly" coords="454,148,460,149,459,165,451,172,432,176,414,174,404,195,398,217,393,208,397,188,409,169,424,164,441,162,453,160,451,159" href="41" rel="41" class="voieAppel" onMouseOut="MM_swapImgRestore()" onMouseOver="MM_swapImage(\'fond\',\'\',\''.$imageUrl.'sarthe.png\',1)" />
<area shape="poly" coords="393,207,395,212,391,215,382,209,375,197,383,177,377,170,369,133,374,120,391,103,398,109,380,124,378,137,384,169,390,177,382,199,390,205,394,210" href="39"  rel="39" class="voieAppel" onMouseOut="MM_swapImgRestore()" onMouseOver="MM_swapImage(\'fond\',\'\',\''.$imageUrl.'mayenne.png\',1)" />
<area shape="poly" coords="361,183,359,188,376,197,378,190,361,181,359,184" href="40" rel="40" class="voieAppel" onMouseOut="MM_swapImgRestore()" onMouseOver="MM_swapImage(\'fond\',\'\',\''.$imageUrl.'oudon.png\',1)" />
<area shape="poly" coords="393,209,382,226,390,229,400,217" href="38" rel="38" class="voieAppel" onMouseOut="MM_swapImgRestore()" onMouseOver="MM_swapImage(\'fond\',\'\',\''.$imageUrl.'maine.png\',1)" />
<area shape="poly" coords="275,239,272,245,297,254,300,252,298,246,275,239" href="36"  rel="36" class="voieAppel" onMouseOut="MM_swapImgRestore()" onMouseOver="MM_swapImage(\'fond\',\'\',\''.$imageUrl.'loire-maritime.png\',1)" />
<area shape="poly" coords="302,245,304,250,320,245,328,237,362,233,377,239,385,236,390,229,382,226,377,230,358,225,321,230,302,245" href="37" rel="37" class="voieAppel" onMouseOut="MM_swapImgRestore()" onMouseOver="MM_swapImage(\'fond\',\'\',\''.$imageUrl.'loire.png\',1)" />
<area shape="poly" coords="305,249,298,253,312,257,328,268,333,264,316,252,303,249" href="42" rel="42" class="voieAppel" onMouseOut="MM_swapImgRestore()" onMouseOver="MM_swapImage(\'fond\',\'\',\''.$imageUrl.'sevre-nantaise.png\',1)" />
<area shape="poly" coords="306,255,317,261,319,271,311,271,306,256" href="43" rel="43" class="voieAppel" onMouseOut="MM_swapImgRestore()" onMouseOver="MM_swapImage(\'fond\',\'\',\''.$imageUrl.'petite-maine.png\',1)" />
<area shape="poly" coords="298,246,303,245,308,231,316,213,313,208,305,214,305,221,301,227" href="35" rel="35" class="voieAppel" onMouseOut="MM_swapImgRestore()" onMouseOver="MM_swapImage(\'fond\',\'\',\''.$imageUrl.'erdre.png\',1)" />
<area shape="poly" coords="256,187,261,193,268,189,275,193,287,181,285,170,295,152,293,135,297,129,290,125,285,133,287,151,277,169,277,180,268,182,258,184,256,187" href="33" rel="33" class="voieAppel" onMouseOut="MM_swapImgRestore()" onMouseOver="MM_swapImage(\'fond\',\'\',\''.$imageUrl.'vilaine-amont.png\',1)" />
<area shape="poly" coords="252,188,257,198,252,204,241,204,234,212,223,214,222,207,233,203,237,196,250,196,252,190" href="34"  rel="34" class="voieAppel" onMouseOut="MM_swapImgRestore()" onMouseOver="MM_swapImage(\'fond\',\'\',\''.$imageUrl.'vilaine-aval.png\',1)" />
<area shape="poly" coords="259,187,252,188,253,170,262,171" href="25"  rel="25" class="voieAppel" onMouseOut="MM_swapImgRestore()" onMouseOver="MM_swapImage(\'fond\',\'\',\''.$imageUrl.'aff.png\',1)" />
<area shape="poly" coords="181,128,187,134,182,142,170,157,157,164,144,175,136,169,152,159,162,150,174,137,179,129" href="30"  rel="30" class="voieAppel" onMouseOut="MM_swapImgRestore()" onMouseOver="MM_swapImage(\'fond\',\'\',\''.$imageUrl.'blavet.png\',1)" />
<area shape="poly" coords="267,75,277,76,274,60,263,62,267,75" href="31"  rel="31" class="voieAppel" onMouseOut="MM_swapImgRestore()" onMouseOver="MM_swapImage(\'fond\',\'\',\''.$imageUrl.'rance.png\',1)" />
<area shape="poly" coords="267,75,278,76,269,84,274,93,283,92,286,99,286,100,300,102,301,130,297,131,288,123,295,119,292,107,278,105,269,98,260,83" href="32"  rel="32" class="voieAppel" onMouseOut="MM_swapImgRestore()" onMouseOver="MM_swapImage(\'fond\',\'\',\''.$imageUrl.'canal-ille-rance.png\',1)" />
<area shape="poly" coords="170,108,181,112,175,120,166,116" href="28"  rel="28" class="voieAppel" onMouseOut="MM_swapImgRestore()" onMouseOver="MM_swapImage(\'fond\',\'\',\''.$imageUrl.'lac-guerledan.png\',1)" />
</map>
</div>
</div>
  );
};

export default Ouest;
