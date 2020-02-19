import React from "react";
import "./WeatherItem.css"

export class WeatherItem extends React.Component {

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
            <div class="weather" style={{backgroundImage: `url(/weather/${this.getImageUrl(this.props.item.weather.code)})`}}>
                <div class="weather_info">
                    <h4>{this.props.item.temp} ℃</h4>
                    <h4 class="more_info">{this.props.item.wind_spd.toFixed(2).toString()} m/s</h4>
                    <h4 class="more_info">{this.props.item.weather.description}</h4>
                </div>
                <h4 class="weather_date">{this.props.item.valid_date}</h4>
            </div>
        );
    }
}