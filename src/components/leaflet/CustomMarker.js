import L from 'leaflet';
import icon from 'assets/map-marker.png';

const CustomMarker = L.Icon.extend({
  options: {
    iconUrl: icon,
    iconRetinaUrl: icon,
    iconAnchor: [15, 40],
    popupAnchor: null,
    shadowUrl: null,
    shadowSize: null,
    shadowAnchor: null,
    iconSize: new L.Point(30, 40)
  }
});

export default CustomMarker;
