(function () {
    return {
      title: [],
      hint: '',
      formatTitle: function() {},
      customConfig:
                  `
                    <div id = "map">
                    </div>
                  `
      ,
      _subscriptions: [],
      _map: null,
      init: function() {
        this._subscriptions.push(this.messageService.subscribe('LeafletScriptsLoaded', this.myAfterInit, this));
      },

      afterViewInit: function() {
      },

      myAfterInit: function() {
        this._map = new L.Map('map', {
            center: new L.LatLng(49.840415, 24.032218),
            zoom: 15,
            zoomSnap: 1,
            maxZoom: 20,
            minZoom: 6,
            preferCanvas: true,
            layers: []
        });

        let layer = L.tileLayer('http://{s}.google.com/vt/lyrs=s,h&x={x}&y={y}&z={z}&hl=uk', {
            attribution: 'Картографічні дані © «<a href="https://www.google.com.ua/">Google</a>»',
            maxZoom: 19,
            subdomains: ['mt0']
        });

        layer.addTo(this._map);

        this.loadData();
      },

      // custom 
      _listeners: [],
      _roads: [],
     _outRoads: [],


      loadData: function() {
        const query = {
            queryCode: 'Select_Roads',
            parameterValues: []
        };

        this.queryExecutor(query, this.parseData, this);
      },

      parseData: function(data) {
        const rowLength = data.columns.length;
        const columns = data.columns;
        const popup = L.popup({className: 'custom-popup'});
        const showPopup = (e, road) => {
            let content = '';
            for (const [key, value] of Object.entries(road)) {
                if (key != 'Polyline' && key != 'CoordinateHash') {
                    content = content.concat(`<p>${key}: ${value}</p>`);
                }
            }

            popup.setLatLng(e.latlng)
            .setContent(content)
            .openOn(this._map);

            //console.log(content);
        };

        for (let row = 0; row < data.rows.length; ++row) {
            const rawData = data.rows[row].values;
            let road = {};
            //let outRoad = {};
            for (let col = 0; col < rowLength; ++ col) {
                if (columns[col].code != 'CoordinateHash') {
                    road[columns[col].name] = rawData[col];
                    //outRoad[columns[col].code] = rawData[col];
                } else if (columns[col].code == 'CoordinateHash' && rawData[col]) {
                        let polyline = L.Polyline.fromEncoded(rawData[col], {
                        color: "#7171bf",
                        weight: 6,
                        opacity: 1,
                        smoothFactor: 1
                        });
                        road['Polyline'] = polyline;
                        //outRoad['Coordinates'] = polyline._latlngs;

                        polyline.on('click', (e) => {
                            showPopup(e, road);
                        });

                        polyline.addTo(this._map);
                }
            }

            this._roads.push(road);
            this._outRoads.push(outRoad);   
        }

        console.log(JSON.stringify(this._outRoads));
      },

      destroy: function() { 
      this._subscriptions.forEach(subscription => {
        subscription.unsubscribe();
      });

      document.getElementsByClassName('train-custom-lib').forEach(el => {
        el.remove();
      });
      }

    
      

  };
  }());
  