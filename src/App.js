import React from 'react';
import Autocomplete from "@material-ui/lab/Autocomplete";
import TextField from "@material-ui/core/TextField";
import { WeatherItem } from "./WeatherItem";

export class App extends React.Component {
  constructor() {
    super()

    this.changeCity = this.changeCity.bind(this);
    this.selectItem = this.selectItem.bind(this);
    this.loadData = this.loadData.bind(this);
    this.saveResult = this.saveResult.bind(this);
    this.loadLastResult = this.loadLastResult.bind(this);

    this.places = ["Taganrog", "Moscow", "Krasnodar"]
    this.city = null;
    this.state = { res: null, selected: null }
  }
  componentDidMount() {
    this.loadLastResult();
    
    if (this.city === null) {
      this.city = "Moscow";
      this.loadData("Moscow");
    }
  }

  loadData(city) {
    return new Promise((resolve, rej) => {
      fetch(`https://api.weatherbit.io/v2.0/forecast/daily?key=12848220c86a428096a30f7c5bb9c9cd&units=M&city=${city}`)
        .then(res => res.json())
        .then(res => this.saveResult(city, res));
    });
  }

  saveResult(city, result) {
    localStorage.setItem("city", city);
    localStorage.setItem("result", JSON.stringify(result));
    this.setState({ res: result, selected: result.data[0] }); 
  }

  loadLastResult() {
    if (localStorage.getItem("result") && localStorage.getItem("city")) {
      const result = JSON.parse(localStorage.getItem("result"));
      this.setState({ res: result, selected: result.data[0] });
      this.city = localStorage.getItem("city");
    }
  }

  changeCity(e, n) {
    this.loadData(n);
  }

  selectItem(e) {
    this.setState({ selected: e });
  }
  getImageUrl(code){
    if(code > 800) return "clouds.png";
    if(code == 800) return "clear_sky.jpg"
    if(code >= 700) return "fog.jpg";
    if(code >= 600) return "snow.jpg";
    if(code >= 500) return "rain.jpg";
    if(code >= 300) return "drizzle.jpg";
    return "thunder.jpg";
}
  render() {
    return (
      <div class="app">
        <div class="section_current">
          <div class="changer">
            <Autocomplete
              onChange={this.changeCity}
              options={this.places}
              getOptionLabel={options => options}
              style={{ width: 150 }}
              size="small"
              renderInput={option =>
                (<TextField {...option}
                  label="City"
                  fullWidth
                  style={{ WebkitTextFillColor: "white" }}
                />)}
            />
          </div>
          {this.state.selected &&
            <div class="section_current_content" style={{backgroundImage: `url(/weather/${this.getImageUrl(this.state.selected.weather.code)})`}}>
              <div class="current_location_info">
                <h1>{this.state.res.city_name}</h1>
                <h3>{this.state.selected.valid_date}</h3>
              </div>
              <div class="current_weather_info">
                <h2>{this.state.selected.temp} ℃</h2>
                <h3>{this.state.selected.wind_cdir} {this.state.selected.wind_spd.toFixed(2).toString()} m/s</h3>
                <h3>{this.state.selected.pop} %</h3>
                <h3>{this.state.selected.weather.description}</h3>
              </div>
            </div>
          }
        </div>
        <div class="section_prediction">
          {this.state.res &&
            this.state.res.data.map((el, i) => {
              if (i < 6) {
                return (
                  <buton onClick={(e) => this.selectItem(this.state.res.data[i])} key={i}>
                    <WeatherItem item={this.state.res.data[i]} />
                  </buton>
                )
              }
            })
          }
        </div>
      </div >
    );
  }

}