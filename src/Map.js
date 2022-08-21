import React, { useState } from "react"
import "leaflet/dist/leaflet.css"
import { MapContainer, TileLayer, GeoJSON } from "react-leaflet"
import features from "./country"
import "./Map.css"
import axios from "axios"
import { LocalData } from "./LocalData"
const baseURL = "https://jsonplaceholder.typicode.com/posts/1"

const Map = () => {
  const [onselect, setOnselect] = useState({})
  const [post, setPost] = React.useState(null)

  React.useEffect(() => {
    axios.get(baseURL).then((response) => {
      setPost(response.data)
    })
  }, [])
  // console.log({ post }) // api data is working here but not inside highlightFeature function. where i want it to be worked
  // console.log({ LocalData })
  const highlightFeature = (e) => {
    console.log({ post }) // i am not getting api data when i hover over map , which i want to be worked
    console.log({ LocalData }) // but i am getting local hard coded jason data, this is strange , why not api data?
    var layer = e.target
    const { County, Total, Male, Female, Intersex, Desnity } =
      e.target.feature.properties
    setOnselect({
      county: County,
      total: Total,
      male: Male,
      female: Female,
      intersex: Intersex,
      density: Desnity,
    })
    layer.setStyle({
      weight: 1,
      color: "black",
      fillOpacity: 1,
    })
  }

  const resetHighlight = (e) => {
    setOnselect({})
    e.target.setStyle(style(e.target.feature))
  }

  const onEachFeature = (feature, layer) => {
    layer.on({
      mouseover: highlightFeature,
      mouseout: resetHighlight,
    })
  }

  const mapPolygonColorToDensity = (density) => {
    return density > 3023
      ? "#a50f15"
      : density > 676
      ? "#de2d26"
      : density > 428
      ? "#fb6a4a"
      : density > 236
      ? "#fc9272"
      : density > 23
      ? "#fcbba1"
      : "#fee5d9"
  }
  const style = (feature) => {
    return {
      fillColor: mapPolygonColorToDensity(feature.properties.Desnity),
      weight: 1,
      opacity: 1,
      color: "white",
      dashArray: "2",
      fillOpacity: 0.5,
    }
  }
  const mapStyle = {
    height: "55vh",
    width: "85%",
    margin: "0 auto",
  }
  const feature = features.map((feature) => {
    return feature
  })
  return (
    <div className="container">
      <div className="header">
        <h2 className="heading">
          Kenya Population as Per 2019 National Census Exercise
        </h2>
        <p className="text-muted">
          A choropleth map displaying Kenya population density as per the
          national census conducted <br />
          in 2019 Each County, details displayed by the map include, total
          population and number of each gender.
        </p>
      </div>
      <div className="">
        <div className="">
          {!onselect.county && (
            <div className="census-info-hover">
              <strong>Kenya population density</strong>
              <p>Hover on each county for more details</p>
            </div>
          )}
          {onselect.county && (
            <ul className="census-info">
              <li>
                <strong>{onselect.county}</strong>
              </li>
              <br />
              <li>Total Population:{onselect.total}</li>
              <li>Men:{onselect.male}</li>
              <li>Women:{onselect.female}</li>
              <li>Intersex:{onselect.intersex}</li>
              <li>
                Population density:{onselect.density} people <br /> per square
                km
              </li>
            </ul>
          )}
          <MapContainer
            zoom={6}
            scrollWheelZoom={true}
            style={mapStyle}
            center={[1.286389, 38.817223]}
          >
            <TileLayer
              attribution="Map tiles by Carto, under CC BY 3.0. Data by OpenStreetMap, under ODbL."
              url="https://cartodb-basemaps-{s}.global.ssl.fastly.net/dark_all/{z}/{x}/{y}.png"
            />
            {feature && (
              <GeoJSON
                data={feature}
                style={style}
                onEachFeature={onEachFeature}
              />
            )}
          </MapContainer>
        </div>
      </div>
    </div>
  )
}
export default Map
