// Home Page for RoktoDanBD (Translated to Bangla)

const HomePage = {
  render: async () => {
    return `
      <div class="page-wrapper">
        <!-- Hero Section -->
        <section class="hero">
          <div class="container flex-between" style="width:100%; height:100%;">
            <div class="hero-content">
              <div class="hero-eyebrow">
                <span class="pulse-dot"></span>
                বাংলাদেশজুড়ে জরুরি রক্তের প্রয়োজন
              </div>
              <h1 class="headline-xl">
                রক্তের প্রতিটি ফোঁটা একটি <em>জীবন রক্ষাকারী</em> বন্ধন
              </h1>
              <p class="hero-subtitle">
                রক্তদান বাংলাদেশ একটি আধুনিক এবং নির্ভরযোগ্য স্বেচ্ছাসেবী প্ল্যাটফর্ম, যা রক্তদাতাদের সরাসরি জরুরি রোগীদের সাথে যুক্ত করে। আপনার এলাকায় তাৎক্ষণিকভাবে ভেরিফাইড রক্তদাতা খুঁজুন।
              </p>
              <div class="hero-actions">
                <a href="#/donors" class="btn btn-primary btn-lg">🔍 রক্তদাতা খুঁজুন</a>
                <a href="#/requests" class="btn btn-secondary btn-lg">🩸 রক্তের অনুরোধ করুন</a>
              </div>
            </div>
            
            <div class="hero-visual">
              <svg width="400" height="400" viewBox="0 0 240 240" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M120 20C120 20 40 100 40 155C40 196.42 75.82 230 120 230C164.18 230 200 196.42 200 155C200 100 120 20 120 20Z" fill="var(--primary)"/>
                <path d="M120 60C120 60 70 120 70 155C70 180 90 200 120 200" stroke="white" stroke-width="6" stroke-linecap="round" opacity="0.25"/>
              </svg>
            </div>
          </div>
        </section>

        <!-- Stats Banner -->
        <section class="stats-banner" id="home-stats-banner">
          <div class="container stats-grid">
            <div class="stat-item">
              <div class="stat-number" id="stat-donors">...</div>
              <div class="stat-label">ভেরিফাইড রক্তদাতা</div>
            </div>
            <div class="stat-item">
              <div class="stat-number" id="stat-lives">...</div>
              <div class="stat-label">জীবন বাঁচানো হয়েছে</div>
            </div>
            <div class="stat-item">
              <div class="stat-number" id="stat-districts">...</div>
              <div class="stat-label">জেলা কভার করা হয়েছে</div>
            </div>
          </div>
        </section>

        <!-- How It Works Section -->
        <section class="section how-it-works">
          <div class="container">
            <div class="section-header centered">
              <span class="section-tag">কার্যপদ্ধতি</span>
              <h2 class="headline-lg">সহজ, সরাসরি এবং জীবন রক্ষাকারী</h2>
              <p class="body-md">কোনো মধ্যস্থতাকারী ছাড়াই সরাসরি রক্তদাতার সাথে যোগাযোগ করুন। দ্রুত, বিনামূল্যে এবং বিশ্বস্ত।</p>
            </div>

            <div class="hiw-grid">
              <div class="hiw-card">
                <div class="hiw-number">ধাপ ০১</div>
                <div class="hiw-icon red">🩸</div>
                <h3>রক্তদাতা হিসেবে নিবন্ধন করুন</h3>
                <p>আপনার রক্তের গ্রুপ, চিকিৎসা সংক্রান্ত বিবরণ এবং যোগাযোগের তথ্য নিরাপদে জমা দিয়ে যুক্ত হন জীবন রক্ষাকারী এই প্ল্যাটফর্মে।</p>
              </div>
              <div class="hiw-card">
                <div class="hiw-number">ধাপ ০২</div>
                <div class="hiw-icon blue">🔍</div>
                <h3>খুঁজুন অথবা অনুরোধ করুন</h3>
                <p>জেলা/উপজেলা এবং রক্তের গ্রুপ অনুযায়ী ফিল্টার করে রক্তদাতা খুঁজুন অথবা একটি জরুরি রক্তের অনুরোধ পোস্ট করুন।</p>
              </div>
              <div class="hiw-card">
                <div class="hiw-number">ধাপ ০৩</div>
                <div class="hiw-icon green">🤝</div>
                <h3>যোগাযোগ করুন ও জীবন বাঁচান</h3>
                <p>কল বা এসএমএসের মাধ্যমে সরাসরি রক্তদাতার সাথে যোগাযোগ করুন। রক্তদান সম্পন্ন করে আপনার ড্যাশবোর্ডে আপডেট করুন!</p>
              </div>
            </div>
          </div>
        </section>

        <!-- Live Urgent Requests Section -->
        <section class="section">
          <div class="container">
            <div class="flex-between section-header" style="flex-wrap: wrap; gap: 16px;">
              <div>
                <span class="section-tag">সক্রিয় অনুরোধসমূহ</span>
                <h2 class="headline-lg">আপনার কাছাকাছি জরুরি রক্তের প্রয়োজন</h2>
                <p class="body-md">এই সক্রিয় রক্তের অনুরোধগুলোতে সাড়া দিয়ে জীবন বাঁচাতে সহায়তা করুন।</p>
              </div>
              <a href="#/requests" class="btn btn-secondary btn-sm">সব অনুরোধ দেখুন &rarr;</a>
            </div>

            <div id="home-requests-list" class="grid-2">
              <div class="skeleton skeleton-card"></div>
              <div class="skeleton skeleton-card"></div>
            </div>
          </div>
        </section>

        <!-- Community blood level Reserve -->
        <section class="section-sm" style="background: var(--surface-container-low);">
          <div class="container">
            <div class="grid-2" style="align-items: center; gap: var(--space-md);">
              <div>
                <h3 class="headline-md" style="margin-bottom: 8px;">স্বেচ্ছাসেবী রক্তদাতার তথ্য</h3>
                <p class="body-sm" style="color: var(--on-surface-variant); margin-bottom: var(--space-sm);">
                  প্রধান বিভাগগুলোতে রক্তদানের ফ্রিকোয়েন্সির উপর ভিত্তি করে প্রাক্কলিত রক্তদাতা রিজার্ভ পরিসংখ্যান।
                </p>
                <div class="community-progress">
                  <div class="progress-row">
                    <div class="progress-label">
                      <span>ঢাকা বিভাগ</span>
                      <span>৮২% রিজার্ভ (অনুকূল)</span>
                    </div>
                    <div class="progress-track">
                      <div class="progress-fill" style="width: 82%;"></div>
                    </div>
                  </div>
                  <div class="progress-row">
                    <div class="progress-label">
                      <span>চট্টগ্রাম বিভাগ</span>
                      <span>৬৪% রিজার্ভ (মধ্যম)</span>
                    </div>
                    <div class="progress-track">
                      <div class="progress-fill" style="width: 64%;"></div>
                    </div>
                  </div>
                  <div class="progress-row">
                    <div class="progress-label">
                      <span>রাজশাহী বিভাগ</span>
                      <span>৪৫% রিজার্ভ (স্বল্প চাহিদা)</span>
                    </div>
                    <div class="progress-track">
                      <div class="progress-fill" style="width: 45%;"></div>
                    </div>
                  </div>
                </div>
              </div>

              <div style="background: var(--surface-container-lowest); padding: var(--space-md); border-radius: var(--radius-lg); border: 1px solid var(--surface-container-high);">
                <span class="section-tag" style="color: var(--primary);">থ্যালাসেমিয়া সহায়তা</span>
                <h3 class="headline-md" style="margin-top: 4px; margin-bottom: 12px;">নিয়মিত রক্তদান প্রোগ্রাম</h3>
                <p class="body-sm" style="color: var(--on-surface-variant); line-height: 1.6; margin-bottom: var(--space-md);">
                  থ্যালাসেমিয়া রোগীদের প্রায়ই প্রতি ২-৪ সপ্তাহে নিয়মিত রক্ত পরিবর্তনের প্রয়োজন হয়। রক্তদান বাংলাদেশ থ্যালাসেমিয়া রোগী শিশুদের দীর্ঘমেয়াদী রক্তদাতাদের সাথে সংযুক্ত করতে সাহায্য করে।
                </p>
                <a href="#/thalassemia" class="btn btn-primary btn-sm">সহায়তার জন্য আবেদন করুন</a>
              </div>
            </div>
          </div>
        </section>

        <!-- ── Hospital Finder Map ─────────────────────────── -->
        <section class="section" id="hospital-map-section" style="background: var(--surface-container-low); padding-bottom: var(--space-xl);">
          <div class="container">
            <div class="section-header centered" style="margin-bottom: var(--space-md);">
              <span class="section-tag" style="color: var(--secondary);">🏥 হাসপাতাল খুঁজুন</span>
              <h2 class="headline-lg">আপনার কাছের হাসপাতাল</h2>
              <p class="body-md">বাংলাদেশের সকল জেলার প্রধান হাসপাতাল এক মানচিত্রে। আপনার অবস্থান দিয়ে কাছের হাসপাতাল খুঁজুন।</p>
            </div>

            <!-- Controls -->
            <div class="map-controls-bar">
              <button class="btn btn-primary" id="btn-locate-me">
                <span id="locate-icon">📍</span> আমার অবস্থান দিন
              </button>
              <div class="form-group" style="margin:0; min-width:180px;">
                <select class="form-select" id="map-radius-select">
                  <option value="5">৫ কিমির মধ্যে</option>
                  <option value="10" selected>১০ কিমির মধ্যে</option>
                  <option value="20">২০ কিমির মধ্যে</option>
                  <option value="50">৫০ কিমির মধ্যে</option>
                </select>
              </div>
              <div class="form-group" style="margin:0; min-width:160px;">
                <select class="form-select" id="map-type-filter">
                  <option value="">সব ধরন</option>
                  <option value="Government">সরকারি</option>
                  <option value="Private">বেসরকারি</option>
                  <option value="Specialized">বিশেষায়িত</option>
                </select>
              </div>
              <span class="map-legend">
                <span class="legend-dot" style="background:#1e7e34"></span> সরকারি
                <span class="legend-dot" style="background:#2b6485"></span> বেসরকারি
                <span class="legend-dot" style="background:#856404"></span> বিশেষায়িত
              </span>
            </div>

            <!-- Map + Sidebar layout -->
            <div class="map-layout">
              <div id="hospital-map" class="hospital-map-container"></div>
              <div class="hospital-sidebar" id="hospital-sidebar">
                <div class="sidebar-header">
                  <h3>🏥 কাছের হাসপাতাল</h3>
                  <span class="body-sm" id="nearby-count" style="color:var(--on-surface-variant);">অবস্থান দিন</span>
                </div>
                <div id="nearby-list" class="nearby-list">
                  <div class="nearby-placeholder">
                    <div style="font-size:2.5rem;">📍</div>
                    <p>"আমার অবস্থান দিন" বোতামে ক্লিক করুন এবং কাছের হাসপাতালের তালিকা দেখুন।</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
    `;
  },

  afterRender: async () => {
    // Load platform statistics
    try {
      const stats = await api.getStats();
      if (window.currentPath !== '/') return;
      document.getElementById('stat-donors').innerText = (stats.totalDonors || 0).toLocaleString('bn-BD');
      document.getElementById('stat-lives').innerText = (stats.totalLives || 0).toLocaleString('bn-BD');
      document.getElementById('stat-districts').innerText = (stats.totalDistricts || 0).toLocaleString('bn-BD');
    } catch (e) {
      if (window.currentPath !== '/') return;
      console.error('Stats loading error:', e);
      document.getElementById('stat-donors').innerText = '১০০+';
      document.getElementById('stat-lives').innerText = '৩০০+';
      document.getElementById('stat-districts').innerText = '৬৪';
    }

    // Load active urgent blood requests
    try {
      const requests = await api.getRequests();
      if (window.currentPath !== '/') return;
      const listEl = document.getElementById('home-requests-list');
      
      // Limit to 4 requests on home page
      const featured = requests.slice(0, 4);

      if (featured.length === 0) {
        listEl.innerHTML = `
          <div class="empty-state" style="grid-column: span 2;">
            <div class="empty-icon">🕊️</div>
            <h3>কোনো সক্রিয় রক্তের অনুরোধ নেই</h3>
            <p>এই মুহূর্তে কোনো জরুরি রক্তের অনুরোধ পাওয়া যায়নি। সাথে থাকার জন্য ধন্যবাদ।</p>
          </div>
        `;
      } else {
        listEl.innerHTML = featured.map(req => RequestCard.render(req)).join('');
      }
    } catch (e) {
      if (window.currentPath !== '/') return;
      console.error('Requests load error:', e);
      document.getElementById('home-requests-list').innerHTML = `
        <div class="empty-state" style="grid-column: span 2;">
          <h3>অনুরোধ লোড করতে ব্যর্থ হয়েছে</h3>
          <p>অনুগ্রহ করে আপনার ইন্টারনেট কানেকশন চেক করে আবার চেষ্টা করুন।</p>
        </div>
      `;
    }

    // ─── Leaflet Map & Hospital Finder Integration ───
    try {
      if (window.currentPath !== '/') return;
      const mapContainer = document.getElementById('hospital-map');
      if (!mapContainer) return;

      if (typeof L === 'undefined') {
        console.warn("Leaflet (L) is not loaded.");
        mapContainer.innerHTML = `
          <div style="padding: var(--space-md); text-align: center; color: var(--error); height: 100%; display: flex; align-items: center; justify-content: center; flex-direction: column;">
            <div style="font-size: 32px; margin-bottom: 8px;">⚠️</div>
            <p style="margin: 0;">মানচিত্র লোড করা সম্ভব হয়নি। অনুগ্রহ করে পৃষ্ঠাটি রিফ্রেশ করুন বা ইন্টারনেট সংযোগ চেক করুন।</p>
          </div>
        `;
        return;
      }

      // Initialize Map
      const map = L.map('hospital-map').setView([23.6850, 90.3563], 7);
      
      // OpenStreetMap Tiles
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      }).addTo(map);

      // Load hospitals dataset
      const hospitals = window.BD_HOSPITALS || [];
      const markerGroup = L.layerGroup().addTo(map);
      
      let userCoords = null;
      let userMarker = null;
      let radiusCircle = null;

      // Custom Hospital Icon Builder
      const getHospitalIcon = (type) => {
        let color = '#2b6485'; // Default Private (Blue)
        if (type === 'Government') color = '#1e7e34'; // Green
        else if (type === 'Specialized') color = '#856404'; // Gold/Yellow

        return L.divIcon({
          className: 'custom-hospital-marker',
          html: `
            <svg width="30" height="30" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" style="filter: drop-shadow(0px 2px 4px rgba(0,0,0,0.35));">
              <path d="M12 2C8.13 2 5 5.13 5 9C5 14.25 12 22 12 22C12 22 19 14.25 19 9C19 5.13 15.87 2 12 2Z" fill="${color}" stroke="#ffffff" stroke-width="1.5"/>
              <path d="M12 6V12M9 9H15" stroke="#ffffff" stroke-width="2" stroke-linecap="round"/>
            </svg>
          `,
          iconSize: [30, 30],
          iconAnchor: [15, 30],
          popupAnchor: [0, -30]
        });
      };

      // Custom User Location Icon
      const userIcon = L.divIcon({
        className: 'user-location-marker',
        html: `
          <div class="user-pulse-ring">
            <span class="user-pulse-dot"></span>
          </div>
        `,
        iconSize: [24, 24],
        iconAnchor: [12, 12]
      });

      // Haversine Distance Formula (km)
      const getDistance = (lat1, lon1, lat2, lon2) => {
        const R = 6371; // Earth radius in km
        const dLat = (lat2 - lat1) * Math.PI / 180;
        const dLon = (lon2 - lon1) * Math.PI / 180;
        const a = 
          Math.sin(dLat/2) * Math.sin(dLat/2) +
          Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * 
          Math.sin(dLon/2) * Math.sin(dLon/2);
        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
        return R * c;
      };

      // Render Hospital Markers
      const renderMarkers = (list) => {
        markerGroup.clearLayers();
        list.forEach(h => {
          if (!h.lat || !h.lng) return;
          const marker = L.marker([h.lat, h.lng], { icon: getHospitalIcon(h.type) });
          
          const popupContent = `
            <div style="font-family: 'Hind Siliguri', 'Inter', sans-serif; padding: 4px; min-width: 180px;">
              <h4 style="margin: 0 0 6px 0; font-size: 14px; font-weight: 700; color: var(--on-surface); line-height: 1.4;">${h.name}</h4>
              <div style="font-size: 12px; color: var(--on-surface-variant); margin-bottom: 8px; line-height: 1.5;">
                <span>📍 ${h.district}, ${h.division}</span><br/>
                <span style="display: inline-block; margin-top: 4px; padding: 2px 6px; border-radius: 4px; font-weight: 600; font-size: 10px; 
                  background: ${h.type === 'Government' ? 'rgba(30, 126, 52, 0.1)' : h.type === 'Private' ? 'rgba(43, 100, 133, 0.1)' : 'rgba(133, 100, 4, 0.1)'};
                  color: ${h.type === 'Government' ? '#1e7e34' : h.type === 'Private' ? '#2b6485' : '#856404'};">
                  ${h.type === 'Government' ? 'সরকারি' : h.type === 'Private' ? 'বেসরকারি' : 'বিশেষায়িত'}
                </span>
              </div>
              ${h.phone ? `
                <a href="tel:${h.phone}" style="display: flex; align-items: center; justify-content: center; gap: 6px; 
                  background: var(--primary); color: white; padding: 6px 12px; border-radius: 6px; 
                  text-decoration: none; font-size: 12px; font-weight: 600; text-align: center; margin-top: 4px; transition: background 0.2s;">
                  📞 কল করুন: ${h.phone}
                </a>
              ` : ''}
            </div>
          `;
          
          marker.bindPopup(popupContent);
          marker.hospitalData = h;
          markerGroup.addLayer(marker);
        });
      };

      // Render Nearby List in Sidebar
      const renderSidebarList = (list) => {
        const listEl = document.getElementById('nearby-list');
        const countEl = document.getElementById('nearby-count');
        if (!listEl) return;

        if (!userCoords) {
          listEl.innerHTML = `
            <div class="nearby-placeholder">
              <div style="font-size:2.5rem;">📍</div>
              <p>"আমার অবস্থান দিন" বোতামে ক্লিক করুন এবং কাছের হাসপাতালের তালিকা দেখুন।</p>
            </div>
          `;
          countEl.innerText = 'অবস্থান দিন';
          return;
        }

        if (list.length === 0) {
          listEl.innerHTML = `
            <div class="nearby-placeholder">
              <div style="font-size:2.5rem;">🏥</div>
              <p>এই সীমানার মধ্যে কোনো হাসপাতাল পাওয়া যায়নি। অনুগ্রহ করে সার্চ ব্যাসার্ধ বাড়িয়ে চেষ্টা করুন।</p>
            </div>
          `;
          countEl.innerText = '০টি হাসপাতাল';
          return;
        }

        countEl.innerText = `${list.length.toLocaleString('bn-BD')}টি হাসপাতাল`;
        
        listEl.innerHTML = list.map((h, index) => {
          const typeLabel = h.type === 'Government' ? 'সরকারি' : h.type === 'Private' ? 'বেসরকারি' : 'বিশেষায়িত';
          const distText = h.distance < 1 
            ? `${Math.round(h.distance * 1000).toLocaleString('bn-BD')} মিটার দূরে` 
            : `${h.distance.toFixed(1).toLocaleString('bn-BD')} কিমি দূরে`;

          return `
            <div class="nearby-item" data-index="${index}" style="display: flex; justify-content: space-between; align-items: center; width: 100%;">
              <div class="nearby-info" style="cursor: pointer; flex: 1; min-width: 0; padding-right: 8px;">
                <div class="nearby-name" style="word-wrap: break-word; overflow-wrap: break-word; font-family: 'Hind Siliguri', sans-serif;">${h.name}</div>
                <div class="nearby-meta" style="font-family: 'Hind Siliguri', sans-serif;">${typeLabel} • ${h.district}</div>
                <div class="nearby-dist" style="font-family: 'Hind Siliguri', sans-serif;">📍 ${distText}</div>
              </div>
              <div class="nearby-actions" style="flex-shrink: 0;">
                ${h.phone ? `
                  <a href="tel:${h.phone}" class="btn btn-secondary btn-sm" style="padding: 4px 8px; font-size: 11px; display: inline-flex; align-items: center; justify-content: center; min-width: 32px; height: 32px; border-radius: 50%;" title="কল করুন">
                    📞
                  </a>
                ` : ''}
              </div>
            </div>
          `;
        }).join('');

        // Bind clicks on nearby items
        const items = listEl.querySelectorAll('.nearby-item');
        items.forEach(item => {
          const infoEl = item.querySelector('.nearby-info');
          infoEl.addEventListener('click', () => {
            const idx = parseInt(item.getAttribute('data-index'), 10);
            const hospital = list[idx];
            if (hospital) {
              markerGroup.eachLayer(m => {
                if (m.hospitalData && m.hospitalData.name === hospital.name) {
                  map.setView(m.getLatLng(), 14);
                  m.openPopup();
                }
              });
            }
          });
        });
      };

      // Filter and Update View
      const filterAndUpdate = () => {
        if (window.currentPath !== '/') return;
        const typeFilter = document.getElementById('map-type-filter').value;
        const radiusFilter = parseFloat(document.getElementById('map-radius-select').value);

        let filtered = hospitals;
        if (typeFilter) {
          filtered = filtered.filter(h => h.type === typeFilter);
        }

        if (userCoords) {
          filtered = filtered.map(h => {
            const dist = getDistance(userCoords.lat, userCoords.lng, h.lat, h.lng);
            return { ...h, distance: dist };
          });

          // Filter by distance/radius
          filtered = filtered.filter(h => h.distance <= radiusFilter);
          
          // Sort nearest first
          filtered.sort((a, b) => a.distance - b.distance);

          // Update radius circle boundary
          if (radiusCircle) {
            radiusCircle.setRadius(radiusFilter * 1000);
          }
        }

        renderMarkers(filtered);
        renderSidebarList(filtered);

        // Adjust view to fit user & matched results
        if (userCoords) {
          const points = [];
          if (userMarker) points.push(userMarker);
          markerGroup.eachLayer(m => {
            points.push(m);
          });
          
          if (points.length > 0) {
            const bounds = L.featureGroup(points).getBounds();
            map.fitBounds(bounds, { padding: [50, 50] });
          }
        }
      };

      // Setup Listeners
      const typeFilterEl = document.getElementById('map-type-filter');
      const radiusFilterEl = document.getElementById('map-radius-select');

      if (typeFilterEl) typeFilterEl.addEventListener('change', filterAndUpdate);
      if (radiusFilterEl) radiusFilterEl.addEventListener('change', filterAndUpdate);

      // Locate Me Geolocation Trigger
      const locateBtn = document.getElementById('btn-locate-me');
      if (locateBtn) {
        locateBtn.addEventListener('click', () => {
          if (!navigator.geolocation) {
            toast.error("আপনার ব্রাউজারটি লোকেশন ট্র্যাকিং সমর্থন করে না।");
            return;
          }

          locateBtn.disabled = true;
          locateBtn.innerHTML = `⏳ লোকেট করা হচ্ছে...`;

          navigator.geolocation.getCurrentPosition(
            (pos) => {
              if (window.currentPath !== '/') return;
              userCoords = {
                lat: pos.coords.latitude,
                lng: pos.coords.longitude
              };

              locateBtn.disabled = false;
              locateBtn.innerHTML = `📍 আমার অবস্থান দিন`;

              // Add/Update User Marker
              if (userMarker) {
                userMarker.setLatLng([userCoords.lat, userCoords.lng]);
              } else {
                userMarker = L.marker([userCoords.lat, userCoords.lng], { icon: userIcon }).addTo(map);
              }

              // Add/Update Radius Circle
              const radiusVal = parseFloat(radiusFilterEl.value);
              if (radiusCircle) {
                radiusCircle.setLatLng([userCoords.lat, userCoords.lng]);
                radiusCircle.setRadius(radiusVal * 1000);
              } else {
                radiusCircle = L.circle([userCoords.lat, userCoords.lng], {
                  radius: radiusVal * 1000,
                  color: '#b7102a',
                  fillColor: '#b7102a',
                  fillOpacity: 0.05,
                  weight: 1.5,
                  dashArray: '4, 6'
                }).addTo(map);
              }

              filterAndUpdate();
              toast.success("আপনার অবস্থান সফলভাবে চিহ্নিত করা হয়েছে!");
            },
            (err) => {
              console.error("Geolocation request failed:", err);
              locateBtn.disabled = false;
              locateBtn.innerHTML = `📍 আমার অবস্থান দিন`;

              let msg = "আপনার অবস্থান নির্ধারণে সমস্যা হয়েছে।";
              if (err.code === err.PERMISSION_DENIED) {
                msg = "অনুগ্রহ করে ব্রাউজারে লোকেশন পারমিশন দিন এবং আবার চেষ্টা করুন।";
              }
              toast.error(msg);
            },
            { enableHighAccuracy: true, timeout: 8000, maximumAge: 0 }
          );
        });
      }

      // Initial Render
      filterAndUpdate();

      // Trigger map resize check to handle rendering in tabs/hidden layouts correctly
      setTimeout(() => {
        map.invalidateSize();
      }, 300);

    } catch (mapErr) {
      console.error("Map rendering logic failed:", mapErr);
    }
  }
};

window.HomePage = HomePage;
