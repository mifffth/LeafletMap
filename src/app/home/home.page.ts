import { Component } from '@angular/core';
import * as L from 'leaflet';

// Fix for missing default Leaflet marker icons
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png',
});

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {
  map!: L.Map;
  tileLayers: any = {};
  currentLayer!: L.TileLayer;

  constructor() {}
  ngOnInit() {}

  ionViewDidEnter() {
    // Initialize map
    this.map = L.map('mapId').setView([51.505, -0.09], 13);

    // Define basemap layers
    this.tileLayers = {
      topo: L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      }),  
      streets: L.tileLayer('https://{s}.tile.openstreetmap.fr/hot/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      }),  
      hybrid: L.tileLayer('https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png', {
        attribution: 'Map data: &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, SRTM | Map style: &copy; <a href="https://opentopomap.org">OpenTopoMap</a> (CC-BY-SA)' }),
    };

    // Set default basemap (streets)
    this.currentLayer = this.tileLayers.streets;
    this.currentLayer.addTo(this.map);

    // Add blue popup marker on map click
    this.map.on('click', (e: any) => {
      const { lat, lng } = e.latlng;
      L.marker([lat, lng])
        .addTo(this.map)
        .bindPopup(`<b>Location:</b> ${lat.toFixed(5)}, ${lng.toFixed(5)}`)
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
