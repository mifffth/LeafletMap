import { Component } from '@angular/core';
import * as L from 'leaflet';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {
  map!: L.Map;
  tileLayers: any = {};
  currentLayer!: L.TileLayer;
  currentMarker: L.Marker | null = null; // Store the current marker

  constructor() {}
  ngOnInit() {}

  ionViewDidEnter() {
    this.map = L.map('mapId').setView([-7.797068, 110.370529], 13); // Set peta di Yogyakarta

    // OSM Base map
    const osm = L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    });

    // Satellite Base map
    const satellite = L.tileLayer('https://{s}.tile.openstreetmap.fr/hot/{z}/{x}/{y}.png', {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    });

    // Terrain Base map
    const terrain = L.tileLayer('https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png', {
      attribution: 'Map data: &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, SRTM | Map style: &copy; <a href="https://opentopomap.org">OpenTopoMap</a> (CC-BY-SA)'
    });

    osm.addTo(this.map); // Default basemap

    // Menambahkan layer control untuk memilih basemap
    L.control.layers({
      "OpenStreetMap": osm,
      "Satellite": satellite,
      "Terrain": terrain
    }).addTo(this.map);


    this.map.on('click', (e: any) => {
      const { lat, lng } = e.latlng;
    
      // Remove the previous marker if it exists
      if (this.currentMarker) {
        this.map.removeLayer(this.currentMarker);
      }
    
      // Create a custom marker with FontAwesome icon and popupAnchor adjustment
      const icon = L.divIcon({
        html: '<i class="fa-solid fa-location-dot fa-2x" style="color:blue"></i>',  // FontAwesome icon
        className: 'custom-div-icon',
        iconAnchor: [9, 42], // Anchor point of the marker (center bottom)
        popupAnchor: [0, -45], // Popup appears above the marker (adjust as needed)
      });
    
      // Add the custom marker to the map
      this.currentMarker = L.marker([lat, lng], { icon })
        .addTo(this.map)
        .bindPopup(`<b>You are in:</b> ${lat.toFixed(5)}, ${lng.toFixed(5)}`)
        .openPopup();
    });
    
  }

  onBasemapChange(event: any) {
    const selectedLayer = event.detail.value;

    // Remove the current layer and add the selected one
    if (this.currentLayer) {
      this.map.removeLayer(this.currentLayer);
    }

    this.currentLayer = this.tileLayers[selectedLayer];
    this.currentLayer.addTo(this.map);
  }
}
