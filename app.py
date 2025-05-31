import streamlit as st
import folium
from streamlit_folium import st_folium

st.set_page_config(layout="wide")

st.title("🌊 FloodLight: Guardian View")
st.markdown("Real-time monitoring of flood, rain & wind zones.")

# Create base map
m = folium.Map(location=[37.0902, -95.7129], zoom_start=4)

# Overlay: NASA Blue Marble (daily Earth image)
folium.TileLayer(
    tiles="https://gibs.earthdata.nasa.gov/wmts/epsg3857/best/VIIRS_SNPP_CorrectedReflectance_TrueColor/default/2023-05-31/250m/{z}/{y}/{x}.jpg",
    attr="NASA GIBS",
    name="NASA TrueColor",
    overlay=True,
    control=True
).add_to(m)

# Overlay: USGS Streamflow (flood indicator - raster)
folium.TileLayer(
    tiles="https://mrdata.usgs.gov/services/streamflow?FORMAT=image/png&TRANSPARENT=true",
    attr="USGS",
    name="USGS Streamflow",
    overlay=True,
    control=True
).add_to(m)

# Sample danger zones
zones = [
    {"location": [29.76, -95.36], "radius": 30000, "type": "Flood", "color": "blue"},
    {"location": [34.05, -118.25], "radius": 40000, "type": "Wind", "color": "red"},
]

for z in zones:
    folium.Circle(
        location=z["location"],
        radius=z["radius"],
        color=z["color"],
        fill=True,
        fill_opacity=0.4,
        popup=f"{z['type']} Risk Zone"
    ).add_to(m)

# Layer control
folium.LayerControl().add_to(m)

# Show the map
st_folium(m, width=1000, height=600)
