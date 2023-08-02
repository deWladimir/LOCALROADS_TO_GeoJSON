(function () {
    return {
      init: function() {
        this.loadStyles('https://unpkg.com/leaflet@1.7.1/dist/leaflet.css')
        .then((s) => this.loadScript('https://unpkg.com/leaflet@1.7.1/dist/leaflet.js'))
        .then(s => this.loadScript('lib/leaflet/Leaflet.encoded-master/Polyline.encoded.js'))
        .then(() => this.messageService.publish({name: "LeafletScriptsLoaded"}))
        .catch((s) => {
          console.log(s);
          alert('Script loading has failed');
        });
      },

      loadStyles: function(href) {
        return new Promise((resolve, reject) => {
          const style = document.createElement('link');
          style.href = href;
          style.rel = 'stylesheet';

          style.onload = () => resolve(style);
          style.onerror = () => reject(new Error(`Style loading has failed: ${href}`));

          style.classList.add("train-custom-lib");
          document.head.append(style);
        });
      },

      loadScript: function(src) {
        return new Promise((resolve, reject) => {
          const script = document.createElement('script');
          script.src = src;

          script.onload = () => resolve(script);
          script.onerror = () => reject(new Error(`Script loading has failed: ${src}`));

          script.classList.add("train-custom-lib");
          document.head.append(script);
        });
      }
  };
}());
  