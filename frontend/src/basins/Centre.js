import React, { useEffect } from 'react';
import { preloadImages } from '../utils/imagePreloader';

const Centre = () => {
  const imageUrl = '/img/cartes_france/7_Centre/';

  useEffect(() => {
    const images = [
      'embt-decize.png',
      'embt-nevers.png',
      'bassin-saone-rhone.png',
      'bassin-est.png',
      'bassin-seine.png',
      'embt_vermont.png',
      'embt_dompierre.png',
      'canal-berry.png',
      'cher.png',
      'canal-orleans.png',
      'canal-centre.png',
      'canal-roanne-digoin.png',
      'canal-lateral-loire.png',
      'canal-briare.png',
      'canal-loing.png',
      'canal-bourgogne.png',
      'canal-nivernais.png',
      'yonne.png'
    ].map((img) => imageUrl + img);

    preloadImages(images);
  }, [imageUrl]);

  return (
    <div>
      <h2>Bassin Centre</h2>
      <div style="width:485px; height: 402px; padding: 0; background: url('.$imageUrl.'fond.jpg) top left no-repeat;">
                  <img src="'.$imageUrl.'fond.jpg" border="0" usemap="#map" name="fond" />
<map name="map">
<area shape="poly" coords="286,262,278,262,276,253,294,252,291,258" href="430" rel="430" class="voieAppel" onMouseOut="MM_swapImgRestore()" onMouseOver="MM_swapImage(\'fond\',\'\',\''.$imageUrl.'embt-decize.png\',1)" />
<area shape="poly" coords="267,244,259,240,264,230,272,233" href="432" rel="432" class="voieAppel" onMouseOut="MM_swapImgRestore()" onMouseOver="MM_swapImage(\'fond\',\'\',\''.$imageUrl.'embt-nevers.png\',1)" />
<area shape="poly" coords="453,215,459,212,466,212,467,220,456,223,451,229,451,240,450,254,445,255,436,250,435,255,432,261,430,264,434,274,434,284,433,298,428,298,427,281,424,271,418,264,426,254,429,244,439,236,446,223" href="?bassin_id=8"  rel="99" onMouseOut="MM_swapImgRestore()" onMouseOver="MM_swapImage(\'fond\',\'\',\''.$imageUrl.'bassin-saone-rhone.png\',1)" />
<area shape="poly" coords="463,132,460,140,463,148,468,152,467,158,463,166,467,175,469,183,467,194,467,204,464,209,464,213,468,213,468,223,472,232,479,225,475,212,476,196,479,186,483,185,482,173,476,172,473,166,478,157,476,144,469,135" href="?bassin_id=6"  rel="" onMouseOut="MM_swapImgRestore()" onMouseOver="MM_swapImage(\'fond\',\'\',\''.$imageUrl.'bassin-est.png\',1)" />
<area shape="poly" coords="185,15,196,24,201,29,206,28,215,34,216,42,220,47,230,49,243,47,255,43,270,40,285,34,298,26,313,23,318,17,316,9,304,14,289,17,279,24,265,31,255,36,238,38,230,40,225,35,223,27,216,22,208,19,198,15,192,15" href="?bassin_id=5"  rel="" onMouseOut="MM_swapImgRestore()" onMouseOver="MM_swapImage(\'fond\',\'\',\''.$imageUrl.'bassin-seine.png\',1)" />
<area shape="poly" coords="311,142,310,152,324,154,323,144" href="433" rel="433" class="voieAppel" onMouseOut="MM_swapImgRestore()" onMouseOver="MM_swapImage(\'fond\',\'\',\''.$imageUrl.'embt-vermenton.png\',1)" />
<area shape="poly" coords="304,293,311,302,300,310,296,300" href="431" rel="431" class="voieAppel" onMouseOut="MM_swapImgRestore()" onMouseOver="MM_swapImage(\'fond\',\'\',\''.$imageUrl.'embt-dompierre.png\',1)" />
<area shape="poly" coords="70,190,72,201,89,200,88,190" href="104" rel="104" class="voieAppel" onMouseOut="MM_swapImgRestore()" onMouseOver="MM_swapImage(\'fond\',\'\',\''.$imageUrl.'canal-berry.png\',1)" />
<area shape="poly" coords="70,190,72,201,50,199,23,190,19,184,28,182,54,187,57,190" href="105" rel="105" class="voieAppel" onMouseOut="MM_swapImgRestore()" onMouseOver="MM_swapImage(\'fond\',\'\',\''.$imageUrl.'cher.png\',1)" />
<area shape="poly" coords="138,112,148,109,157,111,156,120,143,119,137,116" href="106" rel="106" class="voieAppel" onMouseOut="MM_swapImgRestore()" onMouseOver="MM_swapImage(\'fond\',\'\',\''.$imageUrl.'canal-orleans.png\',1)" />
<area shape="poly" coords="343,316,334,305,349,302,355,304,359,291,377,277,384,267,397,255,410,241,424,248,428,251,426,257,418,264,415,258,411,253,408,262,391,275,374,295,368,299,360,316,352,318,346,314,344,315" href="114" rel="114" class="voieAppel" onMouseOut="MM_swapImgRestore()" onMouseOver="MM_swapImage(\'fond\',\'\',\''.$imageUrl.'canal-centre.png\',1)" />
<area shape="poly" coords="339,311,332,314,333,328,340,346,343,353,345,375,353,375,355,365,352,345,348,338,343,321,343,315" href="113" rel="113" class="voieAppel" onMouseOut="MM_swapImgRestore()" onMouseOver="MM_swapImage(\'fond\',\'\',\''.$imageUrl.'canal-roanne-digoin.png\',1)" />
<area shape="poly" coords="335,305,338,311,331,316,310,302,303,292,295,275,285,268,273,266,258,249,254,254,247,254,245,248,244,235,242,228,235,208,226,195,226,187,228,181,224,167,212,154,214,149,226,152,234,164,236,175,237,187,236,194,244,205,248,217,251,228,255,238,259,240,268,243,278,253,277,262,290,262,307,271,312,283,313,293,329,302" href="108" rel="108" class="voieAppel" onMouseOut="MM_swapImgRestore()" onMouseOver="MM_swapImage(\'fond\',\'\',\''.$imageUrl.'canal-lateral-loire.png\',1)" />
<area shape="poly" coords="214,148,226,151,234,140,238,128,230,116,229,104,221,97,214,103,219,109,220,117,222,125,226,132,222,137" href="109" rel="109" class="voieAppel" onMouseOut="MM_swapImgRestore()" onMouseOver="MM_swapImage(\'fond\',\'\',\''.$imageUrl.'canal-briare.png\',1)" />
<area shape="poly" coords="221,97,214,103,209,93,212,79,209,57,220,47,229,50,232,50,220,60,221,79" href="110" rel="110" class="voieAppel" onMouseOut="MM_swapImgRestore()" onMouseOver="MM_swapImage(\'fond\',\'\',\''.$imageUrl.'canal-loing.png\',1)" />
<area shape="poly" coords="285,95,287,99,293,103,300,105,316,99,337,114,344,122,344,129,354,132,358,145,371,159,372,167,373,180,386,199,397,209,408,217,414,207,418,195,426,191,432,191,441,201,448,212,453,216,462,211,448,193,438,179,429,178,420,180,413,185,410,191,406,195,404,204,393,191,384,177,384,159,367,142,364,125,354,119,340,104,318,89,298,90" href="107" rel="107" class="voieAppel" onMouseOut="MM_swapImgRestore()" onMouseOver="MM_swapImage(\'fond\',\'\',\''.$imageUrl.'canal-bourgogne.png\',1)" />
<area shape="poly" coords="306,130,291,133,298,141,306,144,300,152,297,160,290,164,283,172,289,178,290,185,297,190,300,200,301,212,299,219,302,235,307,245,299,249,294,253,287,261,296,263,307,256,317,254,321,242,317,232,311,228,311,219,315,210,311,201,312,195,304,180,297,172,303,168,309,163,311,155,311,151,311,141,311,135" href="111" rel="111" class="voieAppel" onMouseOut="MM_swapImgRestore()" onMouseOver="MM_swapImage(\'fond\',\'\',\''.$imageUrl.'canal-nivernais.png\',1)" />
<area shape="poly" coords="306,130,300,104,290,102,285,99,285,94,275,89,272,63,265,52,262,46,253,44,239,47,252,53,261,69,266,86,266,99,277,102,287,107,292,120,291,134,294,131" href="112" rel="112" class="voieAppel" onMouseOut="MM_swapImgRestore()" onMouseOver="MM_swapImage(\'fond\',\'\',\''.$imageUrl.'yonne.png\',1)" />
</map>
</div>
</div>
  );
};

export default Centre;
