<template>
  <div class="earth-options">
    <div class="inner">
      <h3>SENSES Earth</h3>
      <p>This visualisation shows the land areas exposed to different types of extreme events under global warming, as projected by a variety of impact models.</p>
      <h3>Impact models</h3>
      <p>Impact models simulate the most important biophysical processes of particular Earth subsystems and use climate data, among other data, as their input. For instance, in order to model the hydrology on the Earth's surface, a hydrological model uses quantities such as precipitation, temperature, radiation and so on as input. Then the model lets the precipitation trickle into the soil or evaporate from the surface, plants pump soil water back into the atmosphere, water in rivers is routed across continents etc. All the impact models here were run under the umbrella of the ISIMIP project. Please refer to www.isimip.org for further information on the project or the individual impact models.</p>

      <h3>Determination of land area exposed by extreme events</h3>
      <p>The maps show what fraction of a grid cell (0.5° × 0.5° geographical grid) is exposed to extreme events at different global warming levels (1 °C, 1.5 °C and 2 °C). These temperature differences are measured with respect to preindustrial times. Preindustrial times are also the setting, on which the definitions of most of these extreme events are ultimately based. An impact model was run while driven by a surrogate (i.e. artificial) preindustrial climate. Actually, four different preindustrial climates which were provided by climate models (GFDL-ESM2M, HadGEM2-ES, IPSL-CM5A-LR, MIROC5) were used. Similarly, climates were provided for considered warming levels by using climate scenarios other than 'preindustrial', such as 'historical', 'RCP2.6', 'RCP6.0'. Furthermore, we also give the median results across all four climate models as well as the median across impact models for a give climate model.</p>
      <p>The following sections give the precise definitions for the exposed land areas.</p>

      <h3>River flood</h3>
      <p>Flooding is assumed to occur whenever daily discharge (0.5° resolution) exceeds the preindustrial 100-year return level; to derive the associated land area exposed per grid cell, simulated runoff is translated into inundation areas (2.5 0 resolution) by CaMaFlood (Yamazaki et al., 2011, 2013).</p>

      <h3>Tropical cyclone</h3>
      <p>Fraction of grid cell exposed to 1-minute sustained hurricane-force winds (at least 64 kt) at least once a year (0.1° resolution); information required about wind fields is derived from center location and minimum pressure/maximum wind speed (Emanuel, 2013; Geiger et al., 2018).</p>

      <h3>Crop failure</h3>
      <p>Fraction of grid cell where one of the considered crops (maize, wheat, soybean, rice) is grown and the corresponding crop yield falls short of the 2.5th percentile of the preindustrial baseline distribution; crop-specific land area fractions exposed are added up.</p>

      <h3>Wildfire</h3>
      <p>Annual aggregate of monthly burned land area simulated by global vegetation models.</p>

      <h3>Drought</h3>
      <p>Entire grid cell if monthly soil moisture falls below the 2.5th percentile of the preindustrial baseline distribution for at least 7 consecutive months.</p>

      <h3>Heatwave</h3>
      <p>Entire grid cell if both, a relative indicator based on temperature (Russo et al., 2015, 2017) and an absolute indicator based on temperature and relative humidity (Masterton & Richardson, 1979) exceed their respective threshold value.</p>

      <h3>Final note</h3>
      <p>Be aware that these extreme events only need to fulfil the above definitions. For instance, a drought here does not necessarily mean that all plants will die, although it could. It means that the soil water falls for at least seven consecutive months below the 2.5th percentile of the monthly values observed preindustrial time series, regardless of whether that is still a lot (whatever that means).</p>

      <h3>References</h3>
      <ul>
      <li><a href="https://doi.org/10.1073/pnas.1301293110">Emanuel, K. (2013). Downscaling CMIP5 climate models shows increased tropical cyclone activity over the 21st century. Proceedings of the National Academy of Sciences, 110 (30), 12219-12224.</a></li>

      <li><a href="https://doi.org/10.5194/essd-10-185-2018">Geiger, T., Frieler, K., & Bresch, D. N. (2018). A global historical data set of tropical cyclone exposure (TCE-DAT). Earth System Science Data, 10 (1), 185–194.</a></li>

      <li><a href="https://books.google.com/books?id=2uH5ygAACAAJ">Masterton, J. M., & Richardson, F. A.  (1979).  Humidex: A Method of Quantifying Human Discomfort Due to Excessive Heat and Humidity.  Environment Canada, Atmospheric Environment.</a></li>

      <li><a href="https://doi.org/10.1088/1748-9326/10/12/124003">Russo, S., Sillmann, J., & Fischer, E. M. (2015). Top ten european heatwaves since 1950 and their occurrence in the coming decades. Environmental Research Letters, 10 (12), 124003.</a></li>

      <li><a href="https://doi.org/10.1038/s41598-017-07536-7">Russo, S., Sillmann, J., & Sterl, A. (2017). Humid heat waves at different warming levels. Scientific Reports, 7 (1), 7477. </a></li>

      <li><a href="https://doi.org/10.1029/2010WR009726">Yamazaki, D., Kanae, S., Kim, H., & Oki, T. (2011). A physically based description of floodplain inundation dynamics in a global river routing model. Water Resources Research, 47 (4).</a></li>
      </ul>
</div>
  </div>
</template>

<script>
export default {
  name: 'EarthOptions',
  data () {
    return {}
  },
  methods: {
    toggleCompare () {
      this.comparing = !this.comparing
      this.setComparison(null, null)
    },
    setComparison (value, option) {
      this.compareOption = option
      this.compareValue = value
    }
  }
}
</script>

<style scoped lang="scss">
@import "library/src/style/global.scss";

.earth-options {
  align-self: normal;
  color: $color-white;
  overflow: auto;
  padding: $spacing * 2 $spacing / 2 $spacing;

  // display: flex;
  // justify-content: center;
  width: 100%;

  .inner {
    width: 100%;
    max-width: 720px;
    // padding: 0 0 $spacing;
    margin: auto;
  }

  p {
    margin-bottom: $spacing / 2;
  }

  a {
    color: getColor(neon, 80);
    background: none;

    &:hover {
      text-decoration: underline;
    }
  }

  ul {
    list-style: none;
    li {
      margin-bottom: $spacing / 4;
    }
  }
}
</style>
