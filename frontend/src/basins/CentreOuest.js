import React, { useEffect } from 'react';
import { preloadImages } from '../utils/imagePreloader';

const CentreOuest = () => {
  const imageUrl = '/img/cartes_france/3_CentreOuest/';

  useEffect(() => {
    const images = [
      'charente-maritime.png',
      'charente.png',
      'sevre-niortaise-maritime.png',
      'sevre-niortaise.png',
      'pertuis-antioche.png',
      'pertuis-breton.png',
      'canal-mignon.png',
      'vieille-autize.png',
      'jeune-autize.png'
    ].map((img) => imageUrl + img);

    preloadImages(images);
  }, [imageUrl]);

  return (
    <div>
      <h2>Bassin Centre-Ouest</h2>

      <div style="width: 500px; height: 225px; padding: 0; background: url('.$imageUrl.'fond.jpg);">
                  <img src="'.$imageUrl.'fond.jpg" border="0" usemap="#map" name="fond" />
<map name="map">
<area shape="poly" coords="218,123,215,137,208,138,203,131,196,130,201,122,210,123" href="47" rel="47" class="voieAppel" onMouseOut="MM_swapImgRestore()" onMouseOver="MM_swapImage(\'fond\',\'\',\''.$imageUrl.'charente-maritime.png\',1)" />
<area shape="poly" coords="218,124,215,138,225,145,233,146,236,159,244,165,250,167,260,172,272,169,285,174,291,181,304,179,317,174,320,170,312,161,303,166,295,170,289,164,279,161,269,158,262,158,256,161,243,152,243,142,243,135,231,135,222,129,216,122" href="45" rel="45" class="voieAppel" onMouseOut="MM_swapImgRestore()" onMouseOver="MM_swapImage(\'fond\',\'\',\''.$imageUrl.'charente.png\',1)" />
<area shape="poly" coords="209,79,210,89,226,85,233,86,241,90,262,90,260,80,248,82,235,79,229,79,220,79,216,79" href="51" rel="51" class="voieAppel" onMouseOut="MM_swapImgRestore()" onMouseOver="MM_swapImage(\'fond\',\'\',\''.$imageUrl.'sevre-niortaise.png\',1)" />
<area shape="poly" coords="210,79,210,88,196,88,195,82,204,78" href="52" rel="52" class="voieAppel" onMouseOut="MM_swapImgRestore()" onMouseOver="MM_swapImage(\'fond\',\'\',\''.$imageUrl.'sevre-niortaise-maritime.png\',1)" />
<area shape="poly" coords="187,107,196,106,201,123,196,130,183,123" href="580" rel="580" class="voieAppel" onMouseOut="MM_swapImgRestore()" onMouseOver="MM_swapImage(\'fond\',\'\',\''.$imageUrl.'pertuis-antioche.png\',1)" />
<area shape="poly" coords="199,105,186,106,182,94,195,80,199,89" href="581" rel="581" class="voieAppel" onMouseOut="MM_swapImgRestore()" onMouseOver="MM_swapImage(\'fond\',\'\',\''.$imageUrl.'pertuis-breton.png\',1)" />
<area shape="poly" coords="225,85,231,85,237,88,237,94,241,102,235,105,230,101,225,91,226,91,225,89" href="50" rel="50" class="voieAppel" onMouseOut="MM_swapImgRestore()" onMouseOver="MM_swapImage(\'fond\',\'\',\''.$imageUrl.'canal-mignon.png\',1)" />
<area shape="poly" coords="227,78,230,72,241,71,236,79" href="49" rel="49" class="voieAppel" onMouseOut="MM_swapImgRestore()" onMouseOver="MM_swapImage(\'fond\',\'\',\''.$imageUrl.'vieille-autize.png\',1)" />
<area shape="poly" coords="228,79,230,72,226,66,219,68,221,74,217,79" href="48" rel="48" class="voieAppel" onMouseOut="MM_swapImgRestore()" onMouseOver="MM_swapImage(\'fond\',\'\',\''.$imageUrl.'jeune-autize.png\',1)" />
</map>
</div>
</div>
  );
};

export default CentreOuest;
