import React, { useEffect } from 'react';
import { preloadImages } from '../utils/imagePreloader';

const SaoneRhone = () => {
  const imageUrl = '/img/cartes_france/8_SaoneRhone/';

  useEffect(() => {
    const images = [
      'doubs.png',
      'seille.png',
      'bassin-centre-bourgogne.png',
      'bassin-est.png',
      'saone.png',
      'lac-bourget.png',
      'canal-savieres.png',
      'rhone.png',
      'canal-pont-vaux.png',
      'haut-rhone.png',
      'liaison-rhone-port-bouc.png',
      'canal-arles-fos.png',
      'petit-rhone.png',
      'bassin-sud.png'
    ].map((img) => imageUrl + img);

    preloadImages(images);
  }, [imageUrl]);

  return (
    <div>
      <h2>Bassin Saône-Rhône</h2>
      <div style="width:421px; height: 613px; padding: 0; background: url('.$imageUrl.'fond.jpg) top left no-repeat;">
                  <img src="'.$imageUrl.'fond.jpg" border="0" usemap="#map" name="fond" />
<map name="map">
<area shape="poly" coords="134,71,129,74,134,81,142,80,145,68,143,62,138,68,136,71" href="116" rel="116" class="voieAppel" onMouseOut="MM_swapImgRestore()" onMouseOver="MM_swapImage(\'fond\',\'\',\''.$imageUrl.'doubs.png\',1)" />
<area shape="poly" coords="127,119,126,124,129,130,137,129,138,117,146,111,157,111,156,100,142,101,138,105,131,113" href="117"  rel="117" class="voieAppel" onMouseOut="MM_swapImgRestore()" onMouseOver="MM_swapImage(\'fond\',\'\',\''.$imageUrl.'seille.png\',1)" />
<area shape="poly" coords="153,38,144,44,126,25,119,79,117,83,112,90,110,82,104,77,99,83,95,91,83,100,61,125,60,117,72,97,89,82,98,69,106,67,118,75,125,22,131,9" href="?bassin_id=7"  rel="" onMouseOut="MM_swapImgRestore()" onMouseOver="MM_swapImage(\'fond\',\'\',\''.$imageUrl.'bassin-centre-bourgogne.png\',1)" />
<area shape="poly" coords="166,6,161,14,160,26,158,37,158,46,167,53,186,45,189,38,196,38,206,35,215,37,226,30,219,24,213,28,204,25,183,32,170,44,165,39,169,24,169,12" href="?bassin_id=6" rel="" onMouseOut="MM_swapImgRestore()" onMouseOver="MM_swapImage(\'fond\',\'\',\''.$imageUrl.'bassin-est.png\',1)" />
<area shape="poly" coords="158,35,152,37,153,39,143,44,136,47,135,58,127,68,119,71,118,80,112,90,113,96,118,102,120,127,117,137,109,159,108,173,105,187,105,208,113,211,116,227,121,223,124,206,114,199,116,180,118,171,118,159,122,139,124,135,128,130,127,119,129,114,127,94,123,88,128,85,128,72,134,69,140,66,144,62,147,51,159,45" href="115" rel="115" class="voieAppel" onMouseOut="MM_swapImgRestore()" onMouseOver="MM_swapImage(\'fond\',\'\',\''.$imageUrl.'saone.png\',1)" />
<area shape="poly" coords="216,212,213,225,216,245,231,248,233,239,226,226,220,216" href="118" rel="118" class="voieAppel" onMouseOut="MM_swapImgRestore()" onMouseOver="MM_swapImage(\'fond\',\'\',\''.$imageUrl.'lac-bourget.png\',1)" />
<area shape="poly" coords="216,212,217,216,213,227,210,223,211,212,218,212" href="119" rel="119" class="voieAppel" onMouseOut="MM_swapImgRestore()" onMouseOver="MM_swapImage(\'fond\',\'\',\''.$imageUrl.'canal-savieres.png\',1)" />
<area shape="poly" coords="113,227,123,222,125,230,125,239,120,249,126,259,124,266,115,275,123,296,124,314,127,323,129,349,124,356,120,366,127,375,123,384,118,390,117,414,118,429,116,445,127,463,131,477,112,493,109,517,107,521,116,528,123,546,123,552,131,553,125,560,115,556,114,545,102,521,104,512,103,488,120,472,107,448,107,410,109,385,116,375,108,365,120,342,114,317,113,297,105,272,116,259,110,248,114,234" href="121" rel="121" class="voieAppel" onMouseOut="MM_swapImgRestore()" onMouseOver="MM_swapImage(\'fond\',\'\',\''.$imageUrl.'rhone.png\',1)" />
<area shape="poly" coords="126,132,121,144,132,148,136,136" href="597" rel="597" class="voieAppel" onMouseOut="MM_swapImgRestore()" onMouseOver="MM_swapImage(\'fond\',\'\',\''.$imageUrl.'canal-pont-vaux.png\',1)" />
<area shape="poly" coords="122,218,124,228,134,224,148,224,155,229,162,229,167,212,173,225,181,232,187,244,202,250,206,240,211,232,211,224,211,212,215,210,216,194,209,194,207,215,204,227,199,233,197,239,188,228,186,222,179,218,173,205,165,204,160,207,157,215,154,218,147,216,137,215,129,215" href="120" rel="120" class="voieAppel" onMouseOut="MM_swapImgRestore()" onMouseOver="MM_swapImage(\'fond\',\'\',\''.$imageUrl.'haut-rhone.png\',1)" />
<area shape="poly" coords="123,553,122,544,132,542,149,546,153,555,146,560,137,553,127,551" href="214" rel="214" class="voieAppel" onMouseOut="MM_swapImgRestore()" onMouseOver="MM_swapImage(\'fond\',\'\',\''.$imageUrl.'liaison-rhone-port-bouc.png\',1)" />
<area shape="poly" coords="110,511,107,521,116,528,121,540,122,544,136,543,126,529,116,518" href="123" rel="123" class="voieAppel" onMouseOut="MM_swapImgRestore()" onMouseOver="MM_swapImage(\'fond\',\'\',\''.$imageUrl.'canal-arles-fos.png\',1)" />
<area shape="poly" coords="104,512,102,521,93,520,94,530,86,535,83,538,87,544,90,551,82,552,74,547,73,537,73,530,84,525,88,520,90,513,99,511,103,511" href="122" rel="122" class="voieAppel" onMouseOut="MM_swapImgRestore()" onMouseOver="MM_swapImage(\'fond\',\'\',\''.$imageUrl.'petit-rhone.png\',1)" />
<area shape="poly" coords="103,492,104,503,103,509,91,513,86,523,82,526,72,530,65,536,54,542,42,537,29,542,21,542,33,529,51,525,62,523,65,525,72,517,79,515,84,512,86,505,97,503,101,493" href="?bassin_id=4" rel="" onMouseOut="MM_swapImgRestore()" onMouseOver="MM_swapImage(\'fond\',\'\',\''.$imageUrl.'bassin-sud.png\',1)" />
</map>
</div>
</div>
  );
};

export default SaoneRhone;
