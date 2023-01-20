'use strict';
const MANIFEST = 'flutter-app-manifest';
const TEMP = 'flutter-temp-cache';
const CACHE_NAME = 'flutter-app-cache';
const RESOURCES = {
  "assets/AssetManifest.bin": "9c4c3bc09d8e75c43a06cfa24488c1e5",
"assets/AssetManifest.json": "f6b77c0d4463aa3450afef0c1efbef07",
"assets/assets/images/1634475253747.png": "935253132cb064fbec1e640113b40aab",
"assets/assets/images/app_logo.png": "ab84185d304434084ddfa039232c940d",
"assets/assets/images/hemanth.jpg": "9f2f0f4c82b44b91c83f287ccd5d240d",
"assets/assets/images/paisa_1.png": "52ac5ebcd0b551ac13d5a15a4d5f2780",
"assets/assets/images/paisa_2.png": "35a0ad6750f9b177dd311661216f8fe6",
"assets/assets/images/paisa_3.png": "6a7361c44f2ce5e6258ce6ca8339036e",
"assets/assets/images/paisa_4.png": "15ea01087c1475c3818a9dfdd1b93e8f",
"assets/assets/images/paisa_5.png": "a95befc12076f4c77d1238f7c9c857ea",
"assets/assets/images/paisa_6.png": "99eaa9d448f544b88a903062e84642d4",
"assets/assets/images/paisa_7.png": "d0a5c8595d218c3090761e83678a0329",
"assets/assets/images/paisa_8.png": "f1969126a15e05d1167df828b222a856",
"assets/assets/images/paisa_logo.png": "4aa99cdd801371259cc22f889a5de7b1",
"assets/assets/images/retro_1.png": "d4ba844d4e8d6e8cd0314848dfad35bc",
"assets/assets/images/retro_2.png": "a17c0ba6ed51a20f1a1957c00fadf9b3",
"assets/assets/images/retro_3.png": "f7a66514f06dbdf2bdc2eb898beed7f0",
"assets/assets/images/retro_4.png": "c6846bc8187142414aca9d08f01fa488",
"assets/assets/images/retro_5.png": "e9f60e34cf8c7d59e85cede4b7682571",
"assets/assets/images/retro_6.png": "199eb349f9f50f4467d654dd82495864",
"assets/assets/images/retro_7.png": "db9e008dca5f9e5b9115e84a37bfb434",
"assets/assets/images/retro_logo.png": "621bffd9f41b3b21e190b2a94d4e656f",
"assets/FontManifest.json": "1b1e7812d9eb9f666db8444d7dde1b20",
"assets/fonts/MaterialIcons-Regular.otf": "e7069dfd19b331be16bed984668fe080",
"assets/NOTICES": "2068dccfc915e80ecbe4f88eb88615bf",
"assets/packages/cupertino_icons/assets/CupertinoIcons.ttf": "6d342eb68f170c97609e9da345464e5e",
"assets/packages/material_design_icons_flutter/lib/fonts/materialdesignicons-webfont.ttf": "dd74f11e425603c7adb66100f161b2a5",
"assets/shaders/ink_sparkle.frag": "92666cc97576adbea2e2d3061a953137",
"canvaskit/canvaskit.js": "678d9f53b0e5c5f22543631f43279fb9",
"canvaskit/canvaskit.wasm": "6972cd6e8f48c5f3c027416c7b2443a6",
"canvaskit/profiling/canvaskit.js": "5a0f05139f1d43c603dcfc67d15b1ec9",
"canvaskit/profiling/canvaskit.wasm": "09aacbc0d8b20c7ee684e310703e2d86",
"favicon.png": "5dcef449791fa27946b3d35ad8803796",
"flutter.js": "1cfe996e845b3a8a33f57607e8b09ee4",
"icons/Icon-192.png": "ac9a721a12bbc803b44f645561ecb1e1",
"icons/Icon-512.png": "96e752610906ba2a93c65f8abe1645f1",
"icons/Icon-maskable-192.png": "c457ef57daa1d16f64b27b786ec2ea3c",
"icons/Icon-maskable-512.png": "301a7604d45b3e739efc881eb04896ea",
"index.html": "a6292decbeb6a86d167cc1dcc0111b99",
"/": "a6292decbeb6a86d167cc1dcc0111b99",
"main.dart.js": "1bccbf6e25eec5bf00dc98db96f5fa56",
"manifest.json": "e09a8ea9f9519547b2c788e45ef32d77",
"version.json": "2643dbf726fac80cad939bb6f6694b3a"
};

// The application shell files that are downloaded before a service worker can
// start.
const CORE = [
  "main.dart.js",
"index.html",
"assets/AssetManifest.json",
"assets/FontManifest.json"];
// During install, the TEMP cache is populated with the application shell files.
self.addEventListener("install", (event) => {
  self.skipWaiting();
  return event.waitUntil(
    caches.open(TEMP).then((cache) => {
      return cache.addAll(
        CORE.map((value) => new Request(value, {'cache': 'reload'})));
    })
  );
});

// During activate, the cache is populated with the temp files downloaded in
// install. If this service worker is upgrading from one with a saved
// MANIFEST, then use this to retain unchanged resource files.
self.addEventListener("activate", function(event) {
  return event.waitUntil(async function() {
    try {
      var contentCache = await caches.open(CACHE_NAME);
      var tempCache = await caches.open(TEMP);
      var manifestCache = await caches.open(MANIFEST);
      var manifest = await manifestCache.match('manifest');
      // When there is no prior manifest, clear the entire cache.
      if (!manifest) {
        await caches.delete(CACHE_NAME);
        contentCache = await caches.open(CACHE_NAME);
        for (var request of await tempCache.keys()) {
          var response = await tempCache.match(request);
          await contentCache.put(request, response);
        }
        await caches.delete(TEMP);
        // Save the manifest to make future upgrades efficient.
        await manifestCache.put('manifest', new Response(JSON.stringify(RESOURCES)));
        return;
      }
      var oldManifest = await manifest.json();
      var origin = self.location.origin;
      for (var request of await contentCache.keys()) {
        var key = request.url.substring(origin.length + 1);
        if (key == "") {
          key = "/";
        }
        // If a resource from the old manifest is not in the new cache, or if
        // the MD5 sum has changed, delete it. Otherwise the resource is left
        // in the cache and can be reused by the new service worker.
        if (!RESOURCES[key] || RESOURCES[key] != oldManifest[key]) {
          await contentCache.delete(request);
        }
      }
      // Populate the cache with the app shell TEMP files, potentially overwriting
      // cache files preserved above.
      for (var request of await tempCache.keys()) {
        var response = await tempCache.match(request);
        await contentCache.put(request, response);
      }
      await caches.delete(TEMP);
      // Save the manifest to make future upgrades efficient.
      await manifestCache.put('manifest', new Response(JSON.stringify(RESOURCES)));
      return;
    } catch (err) {
      // On an unhandled exception the state of the cache cannot be guaranteed.
      console.error('Failed to upgrade service worker: ' + err);
      await caches.delete(CACHE_NAME);
      await caches.delete(TEMP);
      await caches.delete(MANIFEST);
    }
  }());
});

// The fetch handler redirects requests for RESOURCE files to the service
// worker cache.
self.addEventListener("fetch", (event) => {
  if (event.request.method !== 'GET') {
    return;
  }
  var origin = self.location.origin;
  var key = event.request.url.substring(origin.length + 1);
  // Redirect URLs to the index.html
  if (key.indexOf('?v=') != -1) {
    key = key.split('?v=')[0];
  }
  if (event.request.url == origin || event.request.url.startsWith(origin + '/#') || key == '') {
    key = '/';
  }
  // If the URL is not the RESOURCE list then return to signal that the
  // browser should take over.
  if (!RESOURCES[key]) {
    return;
  }
  // If the URL is the index.html, perform an online-first request.
  if (key == '/') {
    return onlineFirst(event);
  }
  event.respondWith(caches.open(CACHE_NAME)
    .then((cache) =>  {
      return cache.match(event.request).then((response) => {
        // Either respond with the cached resource, or perform a fetch and
        // lazily populate the cache only if the resource was successfully fetched.
        return response || fetch(event.request).then((response) => {
          if (response && Boolean(response.ok)) {
            cache.put(event.request, response.clone());
          }
          return response;
        });
      })
    })
  );
});

self.addEventListener('message', (event) => {
  // SkipWaiting can be used to immediately activate a waiting service worker.
  // This will also require a page refresh triggered by the main worker.
  if (event.data === 'skipWaiting') {
    self.skipWaiting();
    return;
  }
  if (event.data === 'downloadOffline') {
    downloadOffline();
    return;
  }
});

// Download offline will check the RESOURCES for all files not in the cache
// and populate them.
async function downloadOffline() {
  var resources = [];
  var contentCache = await caches.open(CACHE_NAME);
  var currentContent = {};
  for (var request of await contentCache.keys()) {
    var key = request.url.substring(origin.length + 1);
    if (key == "") {
      key = "/";
    }
    currentContent[key] = true;
  }
  for (var resourceKey of Object.keys(RESOURCES)) {
    if (!currentContent[resourceKey]) {
      resources.push(resourceKey);
    }
  }
  return contentCache.addAll(resources);
}

// Attempt to download the resource online before falling back to
// the offline cache.
function onlineFirst(event) {
  return event.respondWith(
    fetch(event.request).then((response) => {
      return caches.open(CACHE_NAME).then((cache) => {
        cache.put(event.request, response.clone());
        return response;
      });
    }).catch((error) => {
      return caches.open(CACHE_NAME).then((cache) => {
        return cache.match(event.request).then((response) => {
          if (response != null) {
            return response;
          }
          throw error;
        });
      });
    })
  );
}
